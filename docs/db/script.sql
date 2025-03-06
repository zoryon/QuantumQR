-- DBs AND TABLES' SQL SCRIPT
CREATE DATABASE qrcodegen;
USE qrcodegen;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    hasAllowedEmails BOOLEAN DEFAULT FALSE
);

CREATE TABLE admins (
    id INT PRIMARY KEY,
    FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE qrcodes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    userId INT NOT NULL,
    url TEXT NOT NULL,
    scans INT NOT NULL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE vcardqrcodes (
    qrCodeId INT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    websiteUrl VARCHAR(255),
    address VARCHAR(255),
    FOREIGN KEY (qrCodeId) REFERENCES qrcodes(id) ON DELETE CASCADE
);

-- FUNCTIONS AND TRIGGERS
-- To count total number of scans
CREATE TABLE total_scans_cache (
    total_scans BIGINT DEFAULT 0
);

INSERT INTO total_scans_cache (total_scans) VALUES (0);

-- Create a trigger for inserting new scan
DELIMITER //

CREATE TRIGGER update_total_scans
AFTER INSERT ON qrcodes
FOR EACH ROW
BEGIN
    UPDATE total_scans_cache 
    SET total_scans = total_scans + NEW.scans;
END;
//

DELIMITER ;

-- Create a trigger for deleting scan count
DELIMITER //

CREATE TRIGGER delete_scan_count
AFTER DELETE ON qrcodes
FOR EACH ROW
BEGIN
    UPDATE total_scans_cache
    SET total_scans = total_scans - OLD.scans;
END;
//

DELIMITER ;