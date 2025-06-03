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
  host: 'localhost',
  user: 'root',
  password: 'KAlana#23',
  database: 'autonexus',
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
  // We get the user_id from the JWT token (you can adjust this as per your token payload)
  const userId = req.user.id;

  const sql = `
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

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database query error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No customer details found' });
    }
    res.json(results[0]);
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

app.get('/api/customer/profile-image', authenticateJWT, (req, res) => {
  const userId = req.user.id; // Changed from req.userId to req.user.id
  
  const sql = 'SELECT profile_picture FROM users WHERE user_id = ? AND is_deleted = 0';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
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

    // Update image URLs to include full path
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


// Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
