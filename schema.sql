CREATE DATABASE IF NOT EXISTS gym_membership
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE gym_membership;

CREATE TABLE IF NOT EXISTS plans (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE,
  duration_months INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS members (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_code CHAR(4) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  phone CHAR(10) NOT NULL UNIQUE,
  email VARCHAR(160) NOT NULL UNIQUE,
  join_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  plan_id BIGINT NOT NULL,
  CONSTRAINT fk_members_plan FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  check_in_date DATE NOT NULL,
  CONSTRAINT uq_attendance_member_day UNIQUE (member_id, check_in_date),
  CONSTRAINT fk_attendance_member FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  plan_id BIGINT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  CONSTRAINT fk_payments_member FOREIGN KEY (member_id) REFERENCES members(id),
  CONSTRAINT fk_payments_plan FOREIGN KEY (plan_id) REFERENCES plans(id)
);

INSERT IGNORE INTO plans (id, name, duration_months, price) VALUES
  (1, 'Monthly', 1, 999.00),
  (2, 'Quarterly', 3, 2499.00),
  (3, 'Yearly', 12, 8999.00);

INSERT IGNORE INTO members (id, member_code, name, phone, email, join_date, expiry_date, plan_id) VALUES
  (1, '4102', 'Aarav Sharma', '9876501201', 'aarav@example.com', '2026-09-24', '2026-10-24', 1),
  (2, '5827', 'Diya Patel', '9876501202', 'diya@example.com', '2026-07-24', '2026-10-24', 2),
  (3, '7364', 'Kabir Mehta', '9876501203', 'kabir@example.com', '2026-10-01', '2027-10-01', 3),
  (4, '2941', 'Mira Iyer', '9876501204', 'mira@example.com', '2025-12-01', '2026-01-01', 1),
  (5, '8635', 'Reyansh Rao', '9876501205', 'reyansh@example.com', '2025-08-24', '2025-11-24', 2);

INSERT IGNORE INTO payments (id, member_id, plan_id, amount, payment_date) VALUES
  (1, 1, 1, 999.00, '2026-08-24'), (2, 1, 1, 999.00, '2026-09-24'),
  (3, 2, 2, 2499.00, '2026-04-24'), (4, 2, 2, 2499.00, '2026-07-24'),
  (5, 3, 3, 8999.00, '2025-10-24'), (6, 3, 3, 8999.00, '2026-10-01'),
  (7, 4, 1, 999.00, '2025-10-01'), (8, 4, 1, 999.00, '2025-11-01'),
  (9, 5, 2, 2499.00, '2025-02-24'), (10, 5, 2, 2499.00, '2025-05-24');
