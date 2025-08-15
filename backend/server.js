const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
db.connect(err => {
  if (err) console.error('Database connection failed:', err.message);
  else console.log('Connected to the MySQL database');
});

// JWT Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = decoded;
    next();
  });
};
 // JWT Admin Middelware
const authenticateAdminJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.admin = decoded;  // changed from req.user to req.admin
    next();
  });
};

// ------------------------- Multer config for storing images in /public/images -------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'images');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed!'), false);
  },
});

// ✅ Serve static files from /public/images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ------------------------- Customer -------------------------

// ------------------------- Customer Registration -------------------------
app.post('/api/cusregister', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userType = 'customer'; // automatic user_type

    // Insert into users table
    db.query(
      'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
      [email, hashedPassword, userType],
      (err, userResult) => {
        if (err) {
          return res.status(500).json({ message: 'User already exists or DB error' });
        }

        const newUserId = userResult.insertId;

        // Insert only user_id into customer table
        db.query(
          'INSERT INTO customer (user_id) VALUES (?)',
          [newUserId],
          (err2) => {
            if (err2) {
              // Rollback: delete user if customer insert fails
              db.query('DELETE FROM users WHERE user_id = ?', [newUserId], () => {});

              return res.status(500).json({ message: 'Failed to create customer record' });
            }

            // Generate JWT token with user_id
            const token = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '5h' });
            res.status(201).json({ token });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ------------------------- Customer Login -------------------------
app.post('/api/cuslogin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and Password are required' });

  console.log('Login attempt:', email);

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.length === 0) {
      console.log('No user found with this email');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) {
        console.error('bcrypt error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (!isMatch) {
        console.log('Password mismatch');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, { expiresIn: '5h' });
      console.log('Login successful, issuing token');
      res.status(200).json({ token });
    });
  });
});

// ------------------------- Update Customer Profile -------------------------
app.put('/api/customer/update-profile', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const {
    phone_number,
    address,
    province,
    district,
    first_name,
    middle_name,
    last_name,
    gender,
    birthday
  } = req.body;

  try {
    await db.promise().query(
      `UPDATE users SET phone_number=?, address=?, province=?, district=? WHERE user_id=? AND is_deleted=0`,
      [phone_number, address, province, district, userId]
    );

    await db.promise().query(
      `UPDATE customer SET first_name=?, middle_name=?, last_name=?, gender=?, birthday=? WHERE user_id=? AND is_deleted=0`,
      [first_name, middle_name, last_name, gender, birthday, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// ------------------------- Other Registrations -------------------------

const registerHandler = (userType, tableName) => async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
      [email, hashedPassword, userType],
      (err, userResult) => {
        if (err) return res.status(500).json({ message: 'User already exists or DB error' });

        const newUserId = userResult.insertId;
        db.query(
          `INSERT INTO ${tableName} (user_id) VALUES (?)`,
          [newUserId],
          (err2) => {
            if (err2) {
              db.query('DELETE FROM users WHERE user_id = ?', [newUserId], () => {});
              return res.status(500).json({ message: `Failed to create ${userType} record` });
            }

            const token = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '5h' });
            res.status(201).json({ token });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

app.post('/api/cardealershipregister', registerHandler('dealership', 'car_dealerships'));
app.post('/api/garageregister', registerHandler('garage', 'garages'));
app.post('/api/sparepartregister', registerHandler('sparepart', 'spareparts_shop'));

// ------------------------- Single Login -------------------------

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.user_id, user_type: user.user_type }, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.status(200).json({
      token,
      user_type: user.user_type,
    });
  });
});


// Customer Logout
app.post('/api/cuslogout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});



// Total Customer Count
app.get('/api/customers/count', (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM customers', (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ count: result[0].count });
  });
});

// ------------------------- Basic User Info Display Navbar -------------------------

app.get('/api/user', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!results.length) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    res.json({
      email: user.email,
      user_type: user.user_type,
      profileImage: user.profile_image || null,
    });
  });
});

// ------------------------- Get Customer Details (including user info) -------------------------

app.get('/api/customer/details', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  const customerSql = `
    SELECT 
      c.cus_id,
      c.user_id,
      c.first_name,
      c.middle_name,
      c.last_name,
      c.gender,
      c.birthday,
      c.created_at AS customer_created_at,
      u.user_id AS user_user_id,
      u.email,
      u.user_type,
      u.phone_number,
      u.address,
      u.province,
      u.district,
      u.created_at AS user_created_at
    FROM users u
    RIGHT JOIN customer c ON u.user_id = c.user_id
    WHERE c.user_id = ? AND c.is_deleted = 0 AND (u.is_deleted = 0 OR u.is_deleted IS NULL)
  `;

  db.query(customerSql, [userId], (err, customerResults) => {
    if (err) {
      console.error('Customer Query Error:', err);
      return res.status(500).json({ message: 'Database query error' });
    }
    if (customerResults.length === 0) {
      return res.status(404).json({ message: 'No customer details found' });
    }

    const customerData = customerResults[0];

    // Query for listing counts by approval_status
    const listingsSql = `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN approval_status = 'Approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN approval_status = 'Rejected' THEN 1 ELSE 0 END) AS rejected
      FROM advertisements
      WHERE user_id = ?
    `;

    db.query(listingsSql, [userId], (err, listingResults) => {
      if (err) {
        console.error('Listings Count Query Error:', err);
        return res.status(500).json({ message: 'Error fetching listings count' });
      }

      const counts = listingResults[0] || {
        total: 0,
        approved: 0,
        rejected: 0,
      };

      res.json({
        ...customerData,
        AllListingsCount: counts.total,
        ApprovedListingsCount: counts.approved,
        RejectededListingsCount: counts.rejected,
      });
    });
  });
});



// ------------------------- Upload profile image -------------------------

app.post('/api/customer/upload-profile-image', authenticateJWT, upload.single('profile_image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(200).json({ filename: req.file.filename });
});

// ------------------------- Save uploaded profile image filename to database -------------------------

app.post('/api/customer/save-profile-image', authenticateJWT, (req, res) => {
  const { filename } = req.body;
  const userId = req.user.id; // Changed from req.userId to req.user.id
  
  if (!filename) return res.status(400).json({ message: 'Filename is required' });

  const sql = 'UPDATE users SET profile_picture = ? WHERE user_id = ? AND is_deleted = 0';
  db.query(sql, [filename, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to save profile image' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or deleted' });
    }

    res.status(200).json({ 
      message: 'Profile image updated successfully',
      profile_picture: filename 
    });
  });
});

// ------------------------- Get user profile image info -------------------------

// app.get('/api/customer/profile-image', authenticateJWT, (req, res) => {
//   const userId = req.user.id; // Changed from req.userId to req.user.id
  
//   const sql = 'SELECT profile_picture FROM users WHERE user_id = ? AND is_deleted = 0';
//   db.query(sql, [userId], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }
    
//     if (result.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     const profilePicture = result[0].profile_picture;
//     if (!profilePicture) {
//       return res.status(404).json({ message: 'No profile image found' });
//     }
    
//     res.status(200).json({ profile_picture: profilePicture });
//   });
// });

// app.get('/api/dealership/profile-image', authenticateJWT, (req, res) => {
//   const userId = req.user.id;

//   // Query users table but filter user_type = 'dealership' and not deleted
//   const sql = 'SELECT profile_picture FROM users WHERE user_id = ? AND user_type = ? AND is_deleted = 0';

//   db.query(sql, [userId, 'dealership'], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     if (result.length === 0) {
//       return res.status(404).json({ message: 'User not found or not a dealership' });
//     }

//     const profilePicture = result[0].profile_picture;
//     if (!profilePicture) {
//       return res.status(404).json({ message: 'No profile image found' });
//     }

//     res.status(200).json({ profile_picture: profilePicture });
//   });
// });
app.get('/api/:user_type/profile-image', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const userType = req.params.user_type; // from the URL path

  // Validate user_type if needed (optional)
  const allowedTypes = ['customer', 'dealership', 'garage', 'sparepart'];
  if (!allowedTypes.includes(userType)) {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  const sql = 'SELECT profile_picture FROM users WHERE user_id = ? AND user_type = ? AND is_deleted = 0';
  db.query(sql, [userId, userType], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found or user type mismatch' });
    }

    const profilePicture = result[0].profile_picture;
    if (!profilePicture) {
      return res.status(404).json({ message: 'No profile image found' });
    }

    res.status(200).json({ profile_picture: profilePicture });
  });
});

// ------------------------- Serve static images from /public/images-------------------------

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ------------------------- Update Garage Profile -------------------------
app.put('/api/garage/update-profile', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const {
    phone_number,
    address,
    province,
    district,
    company_name,
    service_type,
    description,
    founded_year,
    owner_name,
    opening_days,
    opening_hours
  } = req.body;

  try {
    // Update common user fields
    await db.promise().query(
      `UPDATE users 
       SET phone_number = ?, address = ?, province = ?, district = ? 
       WHERE user_id = ? AND is_deleted = 0`,
      [phone_number, address, province, district, userId]
    );

    // Update garage-specific fields
    await db.promise().query(
      `UPDATE garages 
       SET company_name = ?, service_type = ?, description = ?, founded_year = ?, 
           owner_name = ?, opening_days = ?, opening_hours = ?
       WHERE user_id = ? AND is_deleted = 0`,
      [company_name, service_type, description, founded_year, owner_name, opening_days, opening_hours, userId]
    );

    res.json({ message: 'Garage profile updated successfully' });
  } catch (err) {
    console.error('Update garage profile error:', err);
    res.status(500).json({ message: 'Server error updating garage profile' });
  }
});

// ------------------------- Get Garage Profile -------------------------
app.get('/api/garage/details', authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
         u.phone_number,
         u.address,
         u.province,
         u.district,
         g.company_name,
         g.service_type,
         g.description,
         g.founded_year,
         g.owner_name,
         g.opening_days,
         g.created_at AS garage_created_at,
         g.opening_hours
       FROM users u
       JOIN garages g ON u.user_id = g.user_id
       WHERE u.user_id = ? AND u.is_deleted = 0 AND g.is_deleted = 0`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Garage profile not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get garage profile error:', err);
    res.status(500).json({ message: 'Server error fetching garage profile' });
  }
});

// ------------------------- Update Dealership Profile -------------------------
app.put('/api/dealership/update-profile', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const {
    phone_number,
    address,
    province,
    district,
    company_name,
    description,
    founded_year,
    owner_name,
    opening_days,
    opening_hours
  } = req.body;

  try {
    // Update common user fields
    await db.promise().query(
      `UPDATE users 
       SET phone_number = ?, address = ?, province = ?, district = ? 
       WHERE user_id = ? AND is_deleted = 0`,
      [phone_number, address, province, district, userId]
    );

    // Update dealership-specific fields
    await db.promise().query(
      `UPDATE car_dealerships 
       SET company_name = ?, description = ?, founded_year = ?, 
           owner_name = ?, opening_days = ?, opening_hours = ?
       WHERE user_id = ? AND is_deleted = 0`,
      [company_name, description, founded_year, owner_name, opening_days, opening_hours, userId]
    );

    res.json({ message: 'Dealership profile updated successfully' });
  } catch (err) {
    console.error('Update dealership profile error:', err);
    res.status(500).json({ message: 'Server error updating dealership profile' });
  }
});

// ------------------------- Get Dealership Profile -------------------------
app.get('/api/dealership/details', authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
         u.phone_number,
         u.address,
         u.province,
         u.district,
         d.company_name,
         d.description,
         d.founded_year,
         d.owner_name,
         d.opening_days,
         d.created_at AS dealer_created_at,
         d.opening_hours
       FROM users u
       JOIN car_dealerships d ON u.user_id = d.user_id
       WHERE u.user_id = ? AND u.is_deleted = 0 AND d.is_deleted = 0`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Dealership profile not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get dealership profile error:', err);
    res.status(500).json({ message: 'Server error fetching dealership profile' });
  }
});

// ------------------------- Update Spare Parts Profile -------------------------
app.put('/api/spareparts/update-profile', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const {
    phone_number,
    address,
    province,
    district,
    company_name,
    description,
    founded_year,
    owner_name,
    opening_days,
    opening_hours
  } = req.body;

  try {
    // Update common user fields
    await db.promise().query(
      `UPDATE users 
       SET phone_number = ?, address = ?, province = ?, district = ? 
       WHERE user_id = ? AND is_deleted = 0`,
      [phone_number, address, province, district, userId]
    );

    // Update spare parts specific fields
    await db.promise().query(
      `UPDATE spareparts_shop 
       SET company_name = ?, description = ?, founded_year = ?, 
           owner_name = ?, opening_days = ?, opening_hours = ?
       WHERE user_id = ? AND is_deleted = 0`,
      [company_name, description, founded_year, owner_name, opening_days, opening_hours, userId]
    );

    res.json({ message: 'Spare parts profile updated successfully' });
  } catch (err) {
    console.error('Update spare parts profile error:', err);
    res.status(500).json({ message: 'Server error updating spare parts profile' });
  }
});

// ------------------------- Get Spare Parts Profile -------------------------
app.get('/api/spareparts/details', authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
         u.phone_number,
         u.address,
         u.province,
         u.district,
         s.company_name,
         s.description,
         s.founded_year,
         s.owner_name,
         s.opening_days,
         s.created_at AS spareparts_created_at,
         s.opening_hours
       FROM users u
       JOIN spareparts_shop s ON u.user_id = s.user_id
       WHERE u.user_id = ? AND u.is_deleted = 0 AND s.is_deleted = 0`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Spare parts profile not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get spare parts profile error:', err);
    res.status(500).json({ message: 'Server error fetching spare parts profile' });
  }
});

// ------------------------- Add Vehicle Adverti -------------------------
app.post('/api/vehicle/add', authenticateJWT, upload.fields([{ name: 'images', maxCount: 4 }]), async (req, res) => {
  const {
    title,
    description,
    price,
    province,
    city,
    phone_number,
    selling_status,
    item_type,
    item_condition,
    brand,
    color,
    made_year,
    mileage,
    fuel_type,
    transmission
  } = req.body;

  const user_id = req.user.id;
  const images = req.files?.images || [];

  if (!title || !price || !item_type || images.length === 0) {
    return res.status(400).json({ message: 'Missing required fields or images' });
  }

  // Ensure exactly 4 image slots
  const imagePaths = Array(4).fill('').map((_, i) => images[i]?.filename || '');

  // Start MySQL transaction
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: 'Transaction start error', error: err.message });

    // 1. Insert into advertisements
    const adQuery = `
      INSERT INTO advertisements (user_id, title, description, price, province, city, phone_number, selling_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(adQuery, [user_id, title, description, price, province, city, phone_number, selling_status], (err1, adResult) => {
      if (err1) return db.rollback(() => res.status(500).json({ message: 'Ad insert failed', error: err1.message }));

      const ad_id = adResult.insertId;

      // 2. Insert into items (with ad_id now)
      const itemQuery = `
        INSERT INTO items (user_id, ad_id, item_type, item_condition)
        VALUES (?, ?, ?, ?)`;
      db.query(itemQuery, [user_id, ad_id, item_type, item_condition], (err2, itemResult) => {
        if (err2) return db.rollback(() => res.status(500).json({ message: 'Item insert failed', error: err2.message }));

        const item_id = itemResult.insertId;

        // 3. Insert into item_images
        const imageQuery = `
          INSERT INTO item_images (item_id, image_url1, image_url2, image_url3, image_url4)
          VALUES (?, ?, ?, ?, ?)`;
        db.query(imageQuery, [item_id, ...imagePaths], (err3) => {
          if (err3) return db.rollback(() => res.status(500).json({ message: 'Image insert failed', error: err3.message }));

          // 4. Insert into vehicles
          const vehicleQuery = `
            INSERT INTO vehicles (item_id, brand, color, made_year, mileage, fuel_type, transmission)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
          db.query(vehicleQuery, [item_id, brand, color, made_year, mileage, fuel_type, transmission], (err4) => {
            if (err4) return db.rollback(() => res.status(500).json({ message: 'Vehicle insert failed', error: err4.message }));

            db.commit(err5 => {
              if (err5) return db.rollback(() => res.status(500).json({ message: 'Transaction commit failed', error: err5.message }));
              res.status(201).json({ message: 'Vehicle advertisement successfully created' });
            });
          });
        });
      });
    });
  });
});


// ------------------------- Get All Vehicle Adverti -------------------------
app.get('/api/vehicle/all', async (req, res) => {
  const query = `
    SELECT 
      a.ad_id,
      a.user_id,
      a.admin_id,
      a.approval_status,
      a.title,
      a.description,
      a.price,
      a.province,
      a.city,
      a.phone_number,
      a.selling_status,
      i.item_id,
      i.item_type,
      i.item_condition,
      ii.image_url1,
      ii.image_url2,
      ii.image_url3,
      ii.image_url4,
      v.brand,
      v.color,
      v.made_year,
      v.mileage,
      v.fuel_type,
      v.transmission
    FROM advertisements a
    JOIN items i ON a.ad_id = i.ad_id
    JOIN item_images ii ON i.item_id = ii.item_id
    JOIN vehicles v ON i.item_id = v.item_id
    WHERE a.is_deleted = 0 AND i.is_deleted = 0 AND ii.is_deleted = 0 AND v.is_deleted = 0
    ORDER BY a.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching vehicle ads', error: err.message });
    }

    const formatted = results.map(ad => ({
      ...ad,
      images: [
        ad.image_url1 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url1}` : null,
        ad.image_url2 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url2}` : null,
        ad.image_url3 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url3}` : null,
        ad.image_url4 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url4}` : null,
      ].filter(Boolean)
    }));

    res.json(formatted);
  });
});


app.get('/api/vehicle/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      a.ad_id,
      a.user_id,
      a.title,
      a.description,
      a.price,
      a.province,
      a.city,
      a.phone_number,
      a.selling_status,
      i.item_id,
      i.item_type,
      i.item_condition,
      ii.image_url1,
      ii.image_url2,
      ii.image_url3,
      ii.image_url4,
      v.brand,
      v.color,
      v.made_year,
      v.mileage,
      v.fuel_type,
      v.transmission
    FROM advertisements a
    JOIN items i ON a.ad_id = i.ad_id
    JOIN item_images ii ON i.item_id = ii.item_id
    JOIN vehicles v ON i.item_id = v.item_id
    WHERE a.ad_id = ? AND a.is_deleted = 0 AND i.is_deleted = 0 AND ii.is_deleted = 0 AND v.is_deleted = 0
    LIMIT 1
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching vehicle data', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const ad = results[0];

    const formatted = {
      ad_id: ad.ad_id,
      user_id: ad.user_id,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      province: ad.province,
      city: ad.city,
      phone_number: ad.phone_number,
      selling_status: ad.selling_status,
      item_id: ad.item_id,
      item_type: ad.item_type,
      item_condition: ad.item_condition,
      images: [
        ad.image_url1 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url1}` : null,
        ad.image_url2 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url2}` : null,
        ad.image_url3 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url3}` : null,
        ad.image_url4 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url4}` : null,
      ].filter(Boolean),
      vehicle_details: {
        brand: ad.brand,
        color: ad.color,
        made_year: ad.made_year,
        mileage: ad.mileage,
        fuel_type: ad.fuel_type,
        transmission: ad.transmission,
      }
    };

    res.json(formatted);
  });
});


// ------------------------- Add Sparepart Adverti -------------------------

app.post('/api/sparepart/add', authenticateJWT, upload.fields([{ name: 'images', maxCount: 4 }]), async (req, res) => {
  const {
    title,
    description,
    price,
    province,
    city,
    phone_number,
    selling_status,
    item_type,
    item_condition,
    brand,
    color,
    material,
    model_compatibility,
    made_year,
    quantity
  } = req.body;

  const user_id = req.user.id;
  const images = req.files?.images || [];

  if (!title || !price || !item_type || images.length === 0) {
    return res.status(400).json({ message: 'Missing required fields or images' });
  }

  // Ensure exactly 4 image slots
  const imagePaths = Array(4).fill('').map((_, i) => images[i]?.filename || '');

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: 'Transaction start error', error: err.message });

    // 1. Insert into advertisements
    const adQuery = `
      INSERT INTO advertisements (user_id, title, description, price, province, city, phone_number, selling_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(adQuery, [user_id, title, description, price, province, city, phone_number, selling_status], (err1, adResult) => {
      if (err1) return db.rollback(() => res.status(500).json({ message: 'Ad insert failed', error: err1.message }));

      const ad_id = adResult.insertId;

      // 2. Insert into items
      const itemQuery = `
        INSERT INTO items (user_id, ad_id, item_type, item_condition)
        VALUES (?, ?, ?, ?)`;
      db.query(itemQuery, [user_id, ad_id, item_type, item_condition], (err2, itemResult) => {
        if (err2) return db.rollback(() => res.status(500).json({ message: 'Item insert failed', error: err2.message }));

        const item_id = itemResult.insertId;

        // 3. Insert into item_images
        const imageQuery = `
          INSERT INTO item_images (item_id, image_url1, image_url2, image_url3, image_url4)
          VALUES (?, ?, ?, ?, ?)`;
        db.query(imageQuery, [item_id, ...imagePaths], (err3) => {
          if (err3) return db.rollback(() => res.status(500).json({ message: 'Image insert failed', error: err3.message }));

          // 4. Insert into spareparts
          const spareQuery = `
            INSERT INTO spareparts (item_id, brand, color, material, model_compatibility, made_year, quantity)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
          db.query(spareQuery, [item_id, brand, color, material, model_compatibility, made_year, quantity || 1], (err4) => {
            if (err4) return db.rollback(() => res.status(500).json({ message: 'Spare part insert failed', error: err4.message }));

            db.commit(err5 => {
              if (err5) return db.rollback(() => res.status(500).json({ message: 'Transaction commit failed', error: err5.message }));
              res.status(201).json({ message: 'Spare part advertisement successfully created' });
            });
          });
        });
      });
    });
  });
});

// ------------------------- Get All Sparepart Adverti -------------------------
app.get('/api/sparepart/all', async (req, res) => {
  const query = `
    SELECT 
      a.ad_id,
      a.user_id,
      a.admin_id,
      a.approval_status,
      a.title,
      a.description,
      a.price,
      a.province,
      a.city,
      a.phone_number,
      a.selling_status,
      i.item_id,
      i.item_type,
      i.item_condition,
      ii.image_url1,
      ii.image_url2,
      ii.image_url3,
      ii.image_url4,
      s.brand,
      s.color,
      s.material,
      s.model_compatibility,
      s.made_year,
      s.quantity
    FROM advertisements a
    JOIN items i ON a.ad_id = i.ad_id
    JOIN item_images ii ON i.item_id = ii.item_id
    JOIN spareparts s ON i.item_id = s.item_id
    WHERE a.is_deleted = 0 AND i.is_deleted = 0 AND ii.is_deleted = 0 AND s.is_deleted = 0
    ORDER BY a.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching spare part ads', error: err.message });
    }

    // Format image URLs
    const formatted = results.map(ad => ({
      ...ad,
      images: [
        ad.image_url1 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url1}` : null,
        ad.image_url2 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url2}` : null,
        ad.image_url3 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url3}` : null,
        ad.image_url4 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url4}` : null,
      ].filter(Boolean)
    }));

    res.json(formatted);
  });
});

// ------------------------- Get All Sparepart Adverti By Id-------------------------
app.get('/api/sparepart/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      a.ad_id,
      a.user_id,
      a.title,
      a.description,
      a.price,
      a.province,
      a.city,
      a.phone_number,
      a.selling_status,
      i.item_id,
      i.item_type,
      i.item_condition,
      ii.image_url1,
      ii.image_url2,
      ii.image_url3,
      ii.image_url4,
      s.brand,
      s.color,
      s.material,
      s.model_compatibility,
      s.made_year,
      s.quantity
    FROM advertisements a
    JOIN items i ON a.ad_id = i.ad_id
    JOIN item_images ii ON i.item_id = ii.item_id
    JOIN spareparts s ON i.item_id = s.item_id
    WHERE a.ad_id = ? AND a.is_deleted = 0 AND i.is_deleted = 0 AND ii.is_deleted = 0 AND s.is_deleted = 0
    LIMIT 1
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching spare part data', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    const ad = results[0];

    const formatted = {
      ad_id: ad.ad_id,
      user_id: ad.user_id,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      province: ad.province,
      city: ad.city,
      phone_number: ad.phone_number,
      selling_status: ad.selling_status,
      item_id: ad.item_id,
      item_type: ad.item_type,
      item_condition: ad.item_condition,
      images: [
        ad.image_url1 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url1}` : null,
        ad.image_url2 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url2}` : null,
        ad.image_url3 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url3}` : null,
        ad.image_url4 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url4}` : null,
      ].filter(Boolean),
      spare_details: {
        brand: ad.brand,
        color: ad.color,
        material: ad.material,
        model_compatibility: ad.model_compatibility,
        made_year: ad.made_year,
        quantity: ad.quantity
      }
    };

    res.json(formatted);
  });
});

// Vehicle listings for logged-in customer
app.get('/api/customer/vehicles', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      a.ad_id, a.title, a.description, a.price, a.province AS ad_province, a.city, 
      a.phone_number AS ad_phone, a.selling_status, a.approval_status, a.created_at AS ad_created_at,

      i.item_id, i.item_type, i.item_condition, i.created_at AS item_created_at,

      im.image_url1, im.image_url2, im.image_url3, im.image_url4,

      v.vehicle_id, v.brand, v.color, v.made_year, v.mileage, v.fuel_type, v.transmission, v.created_at AS vehicle_created_at

    FROM advertisements a
    JOIN items i ON a.ad_id = i.ad_id
    JOIN item_images im ON i.item_id = im.item_id
    JOIN vehicles v ON i.item_id = v.item_id
    WHERE 
      a.user_id = ? 
      AND a.is_deleted = 0 
      AND i.is_deleted = 0 
      AND im.is_deleted = 0 
      AND v.is_deleted = 0
    ORDER BY a.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching vehicle data:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const formatted = results.map(ad => ({
      ...ad,
      images: [
        ad.image_url1 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url1}` : null,
        ad.image_url2 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url2}` : null,
        ad.image_url3 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url3}` : null,
        ad.image_url4 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url4}` : null,
      ].filter(Boolean),
    }));

    res.status(200).json({ vehicles: formatted });
  });
});

// Spare part listings for logged-in customer
app.get('/api/customer/spareparts', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      a.ad_id, a.title, a.description, a.price, a.province AS ad_province, a.city, 
      a.phone_number AS ad_phone, a.selling_status, a.approval_status, a.created_at AS ad_created_at,

      i.item_id, i.item_type, i.item_condition, i.created_at AS item_created_at,

      im.image_url1, im.image_url2, im.image_url3, im.image_url4,

      s.spare_id, s.brand, s.color, s.material, s.model_compatibility, s.made_year, s.quantity, s.created_at AS spare_created_at

    FROM advertisements a
    JOIN items i ON a.ad_id = i.ad_id
    JOIN item_images im ON i.item_id = im.item_id
    JOIN spareparts s ON i.item_id = s.item_id
    WHERE 
      a.user_id = ? 
      AND a.is_deleted = 0 
      AND i.is_deleted = 0 
      AND im.is_deleted = 0 
      AND s.is_deleted = 0
    ORDER BY a.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching spare parts:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const formatted = results.map(ad => ({
      ...ad,
      images: [
        ad.image_url1 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url1}` : null,
        ad.image_url2 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url2}` : null,
        ad.image_url3 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url3}` : null,
        ad.image_url4 ? `${req.protocol}://${req.get('host')}/images/${ad.image_url4}` : null,
      ].filter(Boolean),
    }));

    res.status(200).json({ spareparts: formatted });
  });
});

// ------------------------- Admin -------------------------

// Admin Signup
app.post('/api/admin/signup', async (req, res) => {
  const { email, password, phone_number, address, province, district } = req.body;

  if (!email || !password || !phone_number || !address || !province || !district) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.promise().query(
      'SELECT * FROM admins WHERE email = ? AND is_deleted = 0',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin into admins table (without user_type)
    const [result] = await db.promise().query(
      `INSERT INTO admins 
        (email, password, phone_number, address, province, district) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, phone_number, address, province, district]
    );

    res.status(201).json({ message: 'Admin registered successfully', admin_id: result.insertId });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    // Query admin by email
    const [rows] = await db.promise().query(
      `SELECT * FROM admins WHERE email = ? AND is_deleted = 0`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const admin = rows[0];

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Sign JWT with admin_id and email payload
    const token = jwt.sign(
      { admin_id: admin.admin_id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send back token and admin info (you can exclude password here)
    const { password: _, ...adminWithoutPassword } = admin;

    res.json({ token, admin: adminWithoutPassword });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// 🔍 Get All User + Customer Details
app.get('/api/users/customer', authenticateJWT, (req, res) => {
  const query = `
    SELECT 
      u.user_id, u.email, u.user_type, u.phone_number, u.address,
      u.province, u.district, u.profile_picture, u.cover_picture,
      c.cus_id, c.first_name, c.middle_name, c.last_name,
      c.gender, c.birthday,
      u.created_at AS user_created_at, c.created_at AS customer_created_at
    FROM users u
    JOIN customer c ON u.user_id = c.user_id
    WHERE u.is_deleted = 0 AND c.is_deleted = 0
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://yourdomain.com/images/'
  : `${req.protocol}://${req.get('host')}/images/`;

    const formattedResults = results.map(row => ({
      ...row,
      profile_picture: row.profile_picture ? baseUrl + row.profile_picture : null,
      cover_picture: row.cover_picture ? baseUrl + row.cover_picture : null,
    }));

    res.json(formattedResults);
  });
});

// 🔍 Get All Spare Parts Shop Users
app.get('/api/users/spareparts', authenticateJWT, (req, res) => {
  const query = `
    SELECT 
      u.user_id, u.email, u.user_type, u.phone_number, u.address,
      u.province, u.district, u.profile_picture, u.cover_picture,
      u.created_at AS user_created_at,
      s.spare_id, s.company_name, s.description, s.founded_year, 
      s.owner_name, s.opening_days, s.opening_hours, 
      s.created_at AS shop_created_at
    FROM users u
    JOIN spareparts_shop s ON u.user_id = s.user_id
    WHERE u.is_deleted = 0 AND s.is_deleted = 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com/images/'
        : `${req.protocol}://${req.get('host')}/images/`;

    const formattedResults = results.map(row => ({
      user_id: row.user_id,
      email: row.email,
      user_type: row.user_type,
      phone_number: row.phone_number,
      address: row.address,
      province: row.province,
      district: row.district,
      profile_picture: row.profile_picture
        ? baseUrl + row.profile_picture
        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      cover_picture: row.cover_picture ? baseUrl + row.cover_picture : null,
      user_created_at: row.user_created_at,

      // Spare Parts Shop Info
      spare_id: row.spare_id,
      company_name: row.company_name,
      description: row.description,
      founded_year: row.founded_year,
      owner_name: row.owner_name,
      opening_days: row.opening_days,
      opening_hours: row.opening_hours,
      shop_created_at: row.shop_created_at,
    }));

    res.json(formattedResults);
  });
});

// 🔍 Get All Drdealers Users
app.get('/api/users/cardealers', authenticateJWT, (req, res) => {
  const query = `
    SELECT 
      u.user_id, u.email, u.user_type, u.phone_number, u.address,
      u.province, u.district, u.profile_picture, u.cover_picture,
      u.created_at AS user_created_at,
      c.dealer_id, c.company_name, c.description, c.founded_year, 
      c.owner_name, c.opening_days, c.opening_hours, 
      c.created_at AS dealer_created_at
    FROM users u
    JOIN car_dealerships c ON u.user_id = c.user_id
    WHERE u.is_deleted = 0 AND c.is_deleted = 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com/images/'
        : `${req.protocol}://${req.get('host')}/images/`;

    const formattedResults = results.map(row => ({
      user_id: row.user_id,
      email: row.email,
      user_type: row.user_type,
      phone_number: row.phone_number,
      address: row.address,
      province: row.province,
      district: row.district,
      profile_picture: row.profile_picture
        ? baseUrl + row.profile_picture
        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      cover_picture: row.cover_picture ? baseUrl + row.cover_picture : null,
      user_created_at: row.user_created_at,

      // Car Dealership Info
      dealer_id: row.dealer_id,
      company_name: row.company_name,
      description: row.description,
      founded_year: row.founded_year,
      owner_name: row.owner_name,
      opening_days: row.opening_days,
      opening_hours: row.opening_hours,
      dealer_created_at: row.dealer_created_at,
    }));

    res.json(formattedResults);
  });
});

// ✅ Vehicle Advertisements Approval Status API (Approve or Reject)
app.put('/api/advertisements/:adId', authenticateAdminJWT, async (req, res) => {
  const { adId } = req.params;
  const { approval_status } = req.body;

  // Validate approval_status value
  const validStatuses = ['Approved', 'Rejected', 'Pending'];
  if (!validStatuses.includes(approval_status)) {
    return res.status(400).json({ message: 'Invalid approval status' });
  }

  const adminId = req.admin.admin_id;  // extract admin_id from JWT payload

  try {
    const [result] = await db.promise().query(
      'UPDATE advertisements SET approval_status = ?, admin_id = ? WHERE ad_id = ?',
      [approval_status, adminId, adId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    res.json({ message: 'Advertisement updated successfully' });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/user-stats', (req, res) => {
  const query = `
    SELECT
      COUNT(CASE WHEN user_type = 'Customer' AND is_deleted = 0 THEN 1 END) AS customerCount,
      COUNT(CASE WHEN user_type = 'Sparepart' AND is_deleted = 0 THEN 1 END) AS sparepartCount,
      COUNT(CASE WHEN user_type = 'dealership' AND is_deleted = 0 THEN 1 END) AS dealerCount,
      COUNT(CASE WHEN user_type = 'Garage' AND is_deleted = 0 THEN 1 END) AS garageCount
    FROM users
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch user stats:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results[0]);
  });
});

app.get('/api/items/count-by-type', (req, res) => {
  const query = `
    SELECT
      SUM(CASE WHEN item_type = 'Vehicle' AND is_deleted = 0 THEN 1 ELSE 0 END) AS vehicleCount,
      SUM(CASE WHEN item_type = 'Spare Part' AND is_deleted = 0 THEN 1 ELSE 0 END) AS sparePartCount
    FROM items
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error counting items by type:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results[0]);
  });
});


app.get('/api/spareparts/count-by-approval', (req, res) => {
  const query = `
    SELECT
      SUM(CASE WHEN a.approval_status = 'Approved' THEN 1 ELSE 0 END) AS approvedCount,
      SUM(CASE WHEN a.approval_status = 'Pending' THEN 1 ELSE 0 END) AS pendingCount,
      SUM(CASE WHEN a.approval_status = 'Rejected' THEN 1 ELSE 0 END) AS rejectedCount
    FROM advertisements a
    JOIN items i ON a.ad_id = i.ad_id
    WHERE i.item_type = 'Spare Part' AND a.is_deleted = 0 AND i.is_deleted = 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error counting spare parts by approval:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results[0]);
  });
});

app.get('/api/vehicles/count-by-approval', (req, res) => {
  const query = `
    SELECT
      SUM(CASE WHEN a.approval_status = 'Approved' THEN 1 ELSE 0 END) AS approvedCount,
      SUM(CASE WHEN a.approval_status = 'Pending' THEN 1 ELSE 0 END) AS pendingCount,
      SUM(CASE WHEN a.approval_status = 'Rejected' THEN 1 ELSE 0 END) AS rejectedCount
    FROM advertisements a
    JOIN items i ON a.ad_id = i.ad_id
    WHERE i.item_type = 'Vehicle' AND a.is_deleted = 0 AND i.is_deleted = 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error counting vehicles by approval:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results[0]);
  });
});

app.get('/api/users-summary', (req, res) => {
  const query = `
    SELECT 
        u.user_id,
        u.created_at,
        u.user_type,
        u.province,
        u.email,
        COALESCE(c.first_name, cd.owner_name, ss.owner_name, g.owner_name) AS owner_name
    FROM users u
    LEFT JOIN customer c ON u.user_id = c.user_id AND c.is_deleted = 0
    LEFT JOIN car_dealerships cd ON u.user_id = cd.user_id AND cd.is_deleted = 0
    LEFT JOIN spareparts_shop ss ON u.user_id = ss.user_id AND ss.is_deleted = 0
    LEFT JOIN garages g ON u.user_id = g.user_id AND g.is_deleted = 0
    WHERE u.is_deleted = 0
    ORDER BY u.created_at ASC
    LIMIT 9
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});


// ------------------------- End Admin -------------------------

// ------------------------- Get All Car Dealers Data -------------------------

app.get('/api/dealerships', (req, res) => {
  const query = `
    SELECT 
      cd.dealer_id,
      cd.company_name,
      cd.description,
      cd.founded_year,
      cd.owner_name,
      cd.opening_days,
      cd.opening_hours,
      cd.created_at AS dealership_created_at,

      u.user_id,
      u.email,
      u.phone_number,
      u.address,
      u.province,
      u.district,
      u.profile_picture,
      u.cover_picture,
      u.created_at AS user_created_at,

      JSON_ARRAYAGG(
        IF(a.ad_id IS NOT NULL,
          JSON_OBJECT(
            'ad_id', a.ad_id,
            'title', a.title,
            'price', a.price,
            'approval_status', a.approval_status,
            'image_url', (
              SELECT ii.image_url1 
              FROM item_images ii
              JOIN items it ON ii.item_id = it.item_id
              WHERE it.ad_id = a.ad_id AND ii.is_deleted = 0
              LIMIT 1
            )
          ),
          NULL
        )
      ) AS vehicles

    FROM car_dealerships cd
    JOIN users u ON cd.user_id = u.user_id

    LEFT JOIN advertisements a ON a.user_id = u.user_id 
      AND a.is_deleted = 0 
      AND a.selling_status = 'available' 
      AND a.approval_status = 'approved'

    WHERE cd.is_deleted = 0 AND u.is_deleted = 0

    GROUP BY cd.dealer_id
    ORDER BY cd.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching dealership data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const finalResults = results.map(dealer => {
      if (dealer.vehicles && Array.isArray(dealer.vehicles)) {
        // Parse JSON if it's returned as string (in some MySQL configurations)
        if (typeof dealer.vehicles === 'string') {
          dealer.vehicles = JSON.parse(dealer.vehicles);
        }

        // Remove any null entries
        dealer.vehicles = dealer.vehicles.filter(v => v !== null).slice(0, 4);
      } else {
        dealer.vehicles = [];
      }
      return dealer;
    });

    res.json(finalResults);
  });
});



// ------------------------- Get All Car Dealers Data For Customer View -------------------------

app.get('/api/dealerships/:id', (req, res) => {
  const dealerId = req.params.id;

  const query = `
    SELECT * FROM car_dealerships 
    JOIN users ON car_dealerships.user_id = users.user_id 
    WHERE dealer_id = ?
  `;

  db.query(query, [dealerId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Dealership not found' });
    }

    res.json(results[0]);
  });
});

// ------------------------- Get All Car Dealers lsitings For Customer View -------------------------

app.get('/api/dealerships/:id/listings', (req, res) => {
  const dealerId = req.params.id;

  const query = `
    SELECT 
      a.ad_id, a.title, a.description, a.price, a.selling_status, a.approval_status, a.created_at AS ad_created_at,
      a.province AS ad_province, a.city, a.phone_number AS ad_phone,
      v.vehicle_id, v.brand, v.made_year, v.mileage, v.fuel_type, v.transmission,
      it.item_id, it.item_type, it.item_condition, it.created_at AS item_created_at,
      i.image_url1, i.image_url2, i.image_url3, i.image_url4
    FROM advertisements a
    JOIN items it ON a.ad_id = it.ad_id
    JOIN vehicles v ON v.item_id = it.item_id
    LEFT JOIN item_images i ON i.item_id = it.item_id AND i.is_deleted = 0
    WHERE a.user_id IN (SELECT user_id FROM car_dealerships WHERE dealer_id = ?)
      AND a.is_deleted = 0 AND it.is_deleted = 0 AND v.is_deleted = 0;
  `;

  db.query(query, [dealerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
});


app.post('/api/mapgarages', (req, res) => {
  const { garage_name, description, lat, lng } = req.body;
  db.query(
    'INSERT INTO garages (garage_name, description, lat, lng) VALUES (?, ?, ?, ?)',
    [garage_name, description, lat, lng],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, insertedId: result.insertId });
    }
  );
});

// GET: All garages
app.get('/api/mapgarages', (req, res) => {
  const sql = `
    SELECT
      g.garage_id,
      g.company_name AS garage_name,
      g.description,
      g.lat,
      g.lng,
      u.address,
      u.province,
      u.district,
      u.profile_picture
    FROM garages g
    JOIN users u ON g.user_id = u.user_id
    WHERE g.is_deleted = 0 AND g.lat IS NOT NULL AND g.lng IS NOT NULL
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    // Append full image URL if needed
    const updatedResults = results.map(garage => ({
      ...garage,
      profile_picture: garage.profile_picture 
        ? `${req.protocol}://${req.get('host')}/images/${garage.profile_picture}`
        : null
    }));

    res.json(updatedResults);
  });
});


// API to get all garages with user info
app.get('/api/garagesall', (req, res) => {
  const sql = `
    SELECT
      g.garage_id,
      g.company_name AS name,
      g.service_type,
      g.description,
      g.founded_year,
      g.opening_days,
      g.opening_hours,
      u.user_id,
      u.email,
      u.phone_number,
      u.address,
      u.province,
      u.district,
      u.profile_picture,
      u.cover_picture
    FROM garages g
    JOIN users u ON g.user_id = u.user_id
    WHERE g.is_deleted = 0
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL Error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    const formatted = results.map(row => ({
      garage_id: row.garage_id,
      name: row.name,
      service_type: row.service_type,
      description: row.description,
      founded_year: row.founded_year,
      opening_days: row.opening_days,
      opening_hours: row.opening_hours,
      user: {
        user_id: row.user_id,
        email: row.email,
        phone_number: row.phone_number,
        address: row.address,
        province: row.province,
        district: row.district,
        profile_picture: row.profile_picture
          ? `${req.protocol}://${req.get('host')}/images/${row.profile_picture}`
          : null,
        cover_picture: row.cover_picture
          ? `${req.protocol}://${req.get('host')}/images/${row.cover_picture}`
          : null
      }
    }));

    res.json(formatted);
  });
});

// Get user details by vehicle ad user_id
app.get('/api/seller/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      u.user_id,
      u.email,
      u.phone_number,
      u.address,
      u.province,
      u.district,
      u.profile_picture,
      u.cover_picture,
      c.first_name,
      c.middle_name,
      c.last_name,
      c.gender,
      c.birthday
    FROM users u
    LEFT JOIN customer c ON u.user_id = c.user_id
    WHERE u.user_id = ? AND u.is_deleted = 0 AND (c.is_deleted = 0 OR c.is_deleted IS NULL)
    LIMIT 1
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching seller data', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const user = results[0];

    const seller = {
      user_id: user.user_id,
      email: user.email,
      phone_number: user.phone_number,
      address: user.address,
      province: user.province,
      district: user.district,
      profile_picture: user.profile_picture
        ? `${req.protocol}://${req.get('host')}/images/${user.profile_picture}`
        : null,
      cover_picture: user.cover_picture
        ? `${req.protocol}://${req.get('host')}/images/${user.cover_picture}`
        : null,
      full_name: [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' '),
      gender: user.gender,
      birthday: user.birthday,
    };

    res.json(seller);
  });
});



// Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
