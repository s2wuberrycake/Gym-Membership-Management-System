-- 1) Drop existing schemas (be careful—this wipes everything!)
DROP SCHEMA IF EXISTS mmsDefault;

-- 2) Recreate schemas
CREATE SCHEMA mmsDefault;

USE mmsDefault;

-- 3) Turn off checks for development
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES   = 0;

-- 4) Lookup tables
CREATE TABLE role_types (
    role_id INT PRIMARY KEY,
    role    VARCHAR(50) NOT NULL
);
INSERT INTO role_types (role_id, role) VALUES
  (1, 'admin'),
  (2, 'staff');

CREATE TABLE extend_date (
    extend_date_id INT PRIMARY KEY,
    days           INT NOT NULL,
    date_label     VARCHAR(50) NOT NULL
);
INSERT INTO extend_date (extend_date_id, days, date_label) VALUES
  (1, 0,   'None'),
  (2, 30,  '1 Month'),
  (3, 90,  '3 Months'),
  (4, 180, '6 Months'),
  (5, 360, '12 Months');

CREATE TABLE status_types (
    status_id    INT PRIMARY KEY,
    status_label VARCHAR(50) NOT NULL
);
INSERT INTO status_types (status_id, status_label) VALUES
  (1, 'active'),
  (2, 'expired'),
  (3, 'cancelled');

CREATE TABLE action_types (
    action_id    INT PRIMARY KEY,
    action_label VARCHAR(50) NOT NULL
);
INSERT INTO action_types (action_id, action_label) VALUES
  (1, 'enrollment'),
  (2, 'member info update'),
  (3, 'membership extension'),
  (4, 'cancellation'),
  (5, 'expiration'),
  (6, 're-enrollment');

-- 5) Accounts
CREATE TABLE accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(100) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role_id    INT,
    FOREIGN KEY (role_id) REFERENCES role_types(role_id)
);
INSERT INTO accounts (username, password, role_id)
VALUES
  ('admin',  '$2b$10$hoMHDmZGwpwwEdhQLbYyWeayxP/1MM6SrG5QG1jyqUvUohuQsdpta', 1),
  ('staff', '$2b$10$1K7nQOt6ZhvrmorQOXJfp.WQVUwIHdASZYRsQctSbMFy57QKyYzlS', 2);

-- 6) Main member tables
CREATE TABLE members (
    member_id         CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name        VARCHAR(100),
    last_name         VARCHAR(100),
    email             VARCHAR(255),
    contact_number    VARCHAR(20),
    address           TEXT,
    profile_picture   VARCHAR(512),
    original_join_date DATE,
    recent_join_date   DATE,
    expiration_date    DATE,
    status_id         INT,
    FOREIGN KEY (status_id)
      REFERENCES status_types(status_id)
);

CREATE TABLE cancelled_members (
    member_id         CHAR(36) PRIMARY KEY,
    first_name        VARCHAR(100),
    last_name         VARCHAR(100),
    email             VARCHAR(255),
    contact_number    VARCHAR(20),
    address           TEXT,
    original_join_date DATE,
    cancel_date        DATE,
    status_id         INT DEFAULT 3,
    FOREIGN KEY (status_id)
      REFERENCES status_types(status_id)
);

-- 7) Logs with cascading deletes on member removal
CREATE TABLE update_log (
    update_id  INT AUTO_INCREMENT PRIMARY KEY,
    member_id  CHAR(36),
    action_id  INT,
    account_id INT,
    log_date   DATETIME,
    FOREIGN KEY (member_id)
      REFERENCES members(member_id)
      ON DELETE CASCADE,
    FOREIGN KEY (action_id)
      REFERENCES action_types(action_id),
    FOREIGN KEY (account_id)
      REFERENCES accounts(account_id)
);

CREATE TABLE visit_log (
    visit_id  INT AUTO_INCREMENT PRIMARY KEY,
    member_id CHAR(36),
    visit_date DATETIME,
    FOREIGN KEY (member_id)
      REFERENCES members(member_id)
      ON DELETE CASCADE
);

-- 8) Re-enable checks
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES   = 1;
