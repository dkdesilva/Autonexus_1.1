create database autonexus;

use autonexus;

-- DROP DATABASE autonexus;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    is_deleted TINYINT(1) DEFAULT 0,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(50),
    phone_number VARCHAR(20),
    address TEXT,
    province VARCHAR(100),
    district VARCHAR(100),
    profile_picture VARCHAR(255),
    cover_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Table
CREATE TABLE IF NOT EXISTS customer (
    cus_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(10),
    birthday DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Car Dealership Table
CREATE TABLE IF NOT EXISTS car_dealerships (
    dealer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    company_name VARCHAR(255),
    description TEXT,
    founded_year YEAR,
    owner_name VARCHAR(255),
    opening_days VARCHAR(255),
    opening_hours VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Spare Parts Table
CREATE TABLE IF NOT EXISTS spareparts_shop (
    spare_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    company_name VARCHAR(255),
    description TEXT,
    founded_year YEAR,
    owner_name VARCHAR(255),
    opening_days VARCHAR(255),
    opening_hours VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Garages Table
CREATE TABLE IF NOT EXISTS garages (
    garage_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    company_name VARCHAR(255),
    service_type VARCHAR(255),
    description TEXT,
    founded_year YEAR,
    owner_name VARCHAR(255),
    opening_days VARCHAR(255),
    opening_hours VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    is_deleted TINYINT(1) DEFAULT 0,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    province VARCHAR(100),
    district VARCHAR(100),
    profile_picture VARCHAR(255),
    cover_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advertisements Table
CREATE TABLE IF NOT EXISTS advertisements (
    ad_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    admin_id INT DEFAULT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    province VARCHAR(100),
    city VARCHAR(100),
    phone_number VARCHAR(20),
    selling_status VARCHAR(50) DEFAULT 'available',
    approval_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- Items Table
CREATE TABLE IF NOT EXISTS items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ad_id	INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    item_type VARCHAR(50),
    item_condition VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ad_id) REFERENCES advertisements(ad_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    image_url1 VARCHAR(255) NOT NULL,
    image_url2 VARCHAR(255) NOT NULL,
    image_url3 VARCHAR(255) NOT NULL,
    image_url4 VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    brand VARCHAR(100),
    color VARCHAR(50),
    made_year YEAR,
    mileage INT,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS spareparts (
    spare_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    brand VARCHAR(100),
    color VARCHAR(50),
    material VARCHAR(100),
    model_compatibility VARCHAR(255),
    made_year YEAR,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

DROP TABLE spareparts;
-- Show all tables
SHOW TABLES;
select * from users;
select * from customer;
select * from car_dealerships;
select * from spareparts_shop;
select * from garages;
select * from admins;
select * from advertisements;
select * from items;
select * from item_images;
select * from vehicles;
select * from spareparts;
