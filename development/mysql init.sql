create schema mmsDefault;
create schema mmsBackup;
use mmsdefault;

-- ACCOUNT TABLE
CREATE TABLE role_types (
    role_id INT PRIMARY KEY,
    role VARCHAR(50) NOT NULL
);

INSERT INTO role_types (role_id, role) VALUES
(1, 'admin'),
(2, 'staff');

CREATE TABLE accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role_types(role_id)
);

INSERT INTO accounts (username, password, role_id) VALUES
('admin', '$2b$10$otKCl.7wXvqA1t4QbVdyqeTlXSE.MvhCqeVfyy7k7oMUa/YJymGzG', 1),
('staff', '$2b$10$h8GLDavmj2co2jx2bsn8iOpGBzDD3vbV5.3IMzjnPL.DeVI4r/jaS', 2);

-- MAIN TABLES
CREATE TABLE members (
    member_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    contact_number VARCHAR(20),
    address TEXT,
	original_join_date DATE,
    recent_join_date DATE,
    expiration_date DATE,
    status_id INT,
    FOREIGN KEY (status_id) REFERENCES status_types(status_id)
);

CREATE TABLE cancelled_members (
    member_id CHAR(36) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    contact_number VARCHAR(20),
    address TEXT,
	original_join_date DATE,
    cancel_date DATE,
    status_id INT DEFAULT 3,
    FOREIGN KEY (status_id) REFERENCES status_types(status_id)
);

CREATE TABLE extend_date (
    extend_date_id INT PRIMARY KEY,
    days INT NOT NULL,
    date_label VARCHAR(50) NOT NULL
);

INSERT INTO extend_date (extend_date_id, days, date_label) VALUES
(1, 0, 'None'),
(2, 30, '1 Month'),
(3, 90, '3 Months'),
(4, 180, '6 Months'),
(5, 360, '12 Months');

CREATE TABLE status_types (
    status_id INT PRIMARY KEY,
    status_label VARCHAR(50) NOT NULL
);

INSERT INTO status_types (status_id, status_label) VALUES
(1, 'active'),
(2, 'expired'),
(3, 'cancelled');

CREATE TABLE action_types (
    action_id INT PRIMARY KEY,
    action VARCHAR(50) NOT NULL
);

CREATE TABLE update_log (
    update_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id CHAR(36),
    action_id INT,
    account_id INT,
    log_date DATE DEFAULT (CURRENT_DATE),
    logged_expiration_date DATE,
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (action_id) REFERENCES action_types(action_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE visit_log (
    visit_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id CHAR(36),
    entry_date DATETIME,
    exit_date DATETIME,
    status_id INT,
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (status_id) REFERENCES status_types(status_id)
);
