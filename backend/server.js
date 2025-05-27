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
    req.userId = decoded.id;
    next();
  });
};

// Multer config for storing images in /public/images
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

//Customer

// Customer Registration
app.post('/api/cusregister', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO customers (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'User already exists or DB error' });

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Customer Login
app.post('/api/cuslogin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and Password are required' });

  console.log('Login attempt:', email);

  db.query('SELECT * FROM customers WHERE email = ?', [email], (err, result) => {
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


// Customer Logout
app.post('/api/cuslogout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});


// Insert or Update Customer Profile Details
app.put('/api/customer/update/details', authenticateJWT, (req, res) => {
  const {
    first_name, middle_name, last_name, date_of_birth,
    phone_number, gender, address, province, district, postal_code
  } = req.body;

  db.query('SELECT * FROM customer_details WHERE customer_id = ?', [req.userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    const values = [
      first_name, middle_name, last_name, date_of_birth,
      phone_number, gender, address, province, district, postal_code, req.userId
    ];

    if (result.length > 0) {
      // Update
      const sql = `
        UPDATE customer_details SET
          first_name = ?, middle_name = ?, last_name = ?, date_of_birth = ?,
          phone_number = ?, gender = ?, address = ?, province = ?, district = ?,
          postal_code = ?
        WHERE customer_id = ?
      `;
      db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ message: 'Update failed' });
        res.status(200).json({ message: 'Customer details updated successfully' });
      });
    } else {
      // Insert
      const insertSql = `
        INSERT INTO customer_details (
          customer_id, first_name, middle_name, last_name, date_of_birth,
          phone_number, gender, address, province, district, postal_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [req.userId, ...values.slice(0, -1)], (err) => {
        if (err) return res.status(500).json({ message: 'Insert failed' });
        res.status(201).json({ message: 'Customer details added successfully' });
      });
    }
  });
});

// Get Full Customer Profile (excluding image)
app.get('/api/customer/get/fullprofile', authenticateJWT, (req, res) => {
  const sql = `
    SELECT 
      c.id AS customer_id,
      c.username,
      c.email,
      cd.first_name,
      cd.middle_name,
      cd.last_name,
      cd.date_of_birth,
      cd.phone_number,
      cd.gender,
      cd.address,
      cd.province,
      cd.district,
      cd.postal_code,
      cd.created_at AS created_at
    FROM customers c
    LEFT JOIN customer_details cd ON c.id = cd.customer_id
    WHERE c.id = ?
  `;
  db.query(sql, [req.userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(result[0]);
  });
});


// Total Customer Count
app.get('/api/customers/count', (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM customers', (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ count: result[0].count });
  });
});

// Basic User Info
app.get('/api/user', authenticateJWT, (req, res) => {
  db.query('SELECT * FROM customers WHERE id = ?', [req.userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });

    const { password, ...userDetails } = result[0];
    res.status(200).json(userDetails);
  });
});


//Image Part
// Upload profile image
app.post('/api/customer/upload-profile-image', authenticateJWT, upload.single('profile_image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(200).json({ filename: req.file.filename });
});

// Save uploaded profile image filename to DB (customer_details table)
app.post('/api/customer/save-profile-image', authenticateJWT, (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ message: 'Filename is required' });

  const sqlCheck = 'SELECT * FROM customer_details WHERE customer_id = ?';
  db.query(sqlCheck, [req.userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length > 0) {
      const sqlUpdate = 'UPDATE customer_details SET profile_picture = ? WHERE customer_id = ?';
      db.query(sqlUpdate, [filename, req.userId], (err2) => {
        if (err2) return res.status(500).json({ message: 'Failed to save profile image' });
        res.status(200).json({ message: 'Profile image updated successfully' });
      });
    } else {
      // Insert new details if not exists
      const sqlInsert = 'INSERT INTO customer_details (customer_id, profile_picture) VALUES (?, ?)';
      db.query(sqlInsert, [req.userId, filename], (err3) => {
        if (err3) return res.status(500).json({ message: 'Failed to save profile image' });
        res.status(201).json({ message: 'Profile image saved successfully' });
      });
    }
  });
});

// Get user profile image info
app.get('/api/customer/profile-image', authenticateJWT, (req, res) => {
  const sql = 'SELECT profile_picture FROM customer_details WHERE customer_id = ?';
  db.query(sql, [req.userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0 || !result[0].profile_picture) {
      return res.status(404).json({ message: 'No profile image found' });
    }
    res.status(200).json({ profile_picture: result[0].profile_picture });
  });
});

// Serve static images from /public/images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));


// Get Profile Details
app.get('/api/customer/details', authenticateJWT, (req, res) => {
  db.query('SELECT * FROM customer_details WHERE customer_id = ?', [req.userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(404).json({ message: 'No profile details found' });
    res.status(200).json(result[0]);
  });
});


// Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
