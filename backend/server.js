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
app.post('/api/sparepartregister', registerHandler('sparepart', 'spareparts'));

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
      `UPDATE spareparts 
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
       JOIN spareparts s ON u.user_id = s.user_id
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


// Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
