create database autonexus;
use autonexus;

CREATE TABLE users (
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

select * from users;

DROP TABLE IF EXISTS garages;

CREATE TABLE customer (
    cus_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(10),
    birthday DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from customer;

CREATE TABLE car_dealerships (
    dealer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	is_deleted TINYINT(1) DEFAULT 0,
    company_name VARCHAR(255),
    description TEXT,
    founded_year YEAR,
    owner_name VARCHAR(255),
    opening_days VARCHAR(255),
    opening_hours VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from car_dealerships;

CREATE TABLE spareparts (
    spare_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	is_deleted TINYINT(1) DEFAULT 0,
    company_name VARCHAR(255),
    description TEXT,
    founded_year YEAR,
    owner_name VARCHAR(255),
    opening_days VARCHAR(255),
    opening_hours VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from spareparts;

CREATE TABLE garages (
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
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from garages;
