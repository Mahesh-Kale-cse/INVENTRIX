-- =====================================================
-- INVENTRIX Database Schema
-- Smart Inventory Management System
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS inventrix_db;
USE inventrix_db;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- =====================================================
-- USER ROLES TABLE
-- =====================================================
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_role (role)
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- =====================================================
-- WAREHOUSES TABLE
-- =====================================================
CREATE TABLE warehouses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    address TEXT,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 10,
    image VARCHAR(500),
    sku VARCHAR(100) UNIQUE,
    total_sales INT DEFAULT 0,
    trend VARCHAR(20) DEFAULT 'STABLE',
    warehouse_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_stock (stock_quantity),
    INDEX idx_sku (sku)
);

-- =====================================================
-- SALES TABLE
-- =====================================================
CREATE TABLE sales (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    quantity_sold INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_sale_date (sale_date),
    INDEX idx_user (user_id)
);

-- =====================================================
-- STOCK MOVEMENTS TABLE (Optional - for tracking)
-- =====================================================
CREATE TABLE stock_movements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    quantity_change INT NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT'
    reason TEXT,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email, full_name, is_active) VALUES
('admin', '$2a$10$YourBcryptHashedPasswordHere', 'admin@inventrix.com', 'Admin User', TRUE),
('staff', '$2a$10$YourBcryptHashedPasswordHere', 'staff@inventrix.com', 'Staff User', TRUE);

-- Insert roles
INSERT INTO user_roles (user_id, role) VALUES
(1, 'ADMIN'),
(2, 'STAFF');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Furniture', 'Office and home furniture'),
('Accessories', 'Computer and office accessories');

-- Insert warehouse
INSERT INTO warehouses (name, location, address, contact_number) VALUES
('Main Warehouse', 'Downtown', '123 Main Street, City, Country', '+1234567890');

-- Insert sample products
INSERT INTO products (name, description, category_id, price, stock_quantity, reorder_level, sku, total_sales, trend, warehouse_id) VALUES
('Laptop Dell XPS 15', 'High-performance laptop with 16GB RAM', 1, 1200.00, 15, 10, 'LAP-DELL-001', 45, 'UP', 1),
('iPhone 15 Pro Max', 'Latest Apple smartphone', 1, 999.00, 8, 15, 'PHO-APPL-001', 78, 'UP', 1),
('Herman Miller Chair', 'Ergonomic office chair', 2, 250.00, 25, 10, 'FUR-CHAI-001', 32, 'STABLE', 1),
('Philips Hue Desk Lamp', 'Smart LED desk lamp', 2, 45.00, 5, 10, 'FUR-LAMP-001', 67, 'DOWN', 1),
('Logitech MX Master 3S', 'Wireless mouse', 3, 35.00, 50, 20, 'ACC-MOUS-001', 120, 'UP', 1),
('Anker USB-C Cable Pro', 'High-speed charging cable', 3, 15.00, 3, 30, 'ACC-CABL-001', 89, 'STABLE', 1),
('Samsung 27" Monitor', '4K UHD monitor', 1, 350.00, 12, 8, 'MON-SAMS-001', 56, 'UP', 1),
('Sony WH-1000XM5', 'Noise-canceling headphones', 3, 399.00, 18, 12, 'ACC-HEAD-001', 92, 'UP', 1);

-- Insert sample sales (last 6 months)
INSERT INTO sales (product_id, quantity_sold, unit_price, total_amount, sale_date, user_id) VALUES
(1, 5, 1200.00, 6000.00, DATE_SUB(NOW(), INTERVAL 6 MONTH), 2),
(2, 10, 999.00, 9990.00, DATE_SUB(NOW(), INTERVAL 5 MONTH), 2),
(3, 8, 250.00, 2000.00, DATE_SUB(NOW(), INTERVAL 4 MONTH), 2),
(5, 25, 35.00, 875.00, DATE_SUB(NOW(), INTERVAL 3 MONTH), 2),
(7, 12, 350.00, 4200.00, DATE_SUB(NOW(), INTERVAL 2 MONTH), 2),
(8, 15, 399.00, 5985.00, DATE_SUB(NOW(), INTERVAL 1 MONTH), 2);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Low stock products view
CREATE VIEW low_stock_view AS
SELECT p.id, p.name, p.stock_quantity, p.reorder_level, c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.stock_quantity <= p.reorder_level;

-- Monthly sales summary view
CREATE VIEW monthly_sales_summary AS
SELECT 
    DATE_FORMAT(sale_date, '%Y-%m') as month,
    COUNT(*) as total_transactions,
    SUM(quantity_sold) as total_units_sold,
    SUM(total_amount) as total_revenue
FROM sales
GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
ORDER BY month DESC;

-- Top selling products view
CREATE VIEW top_selling_products AS
SELECT 
    p.id,
    p.name,
    p.total_sales,
    c.name as category_name,
    SUM(s.total_amount) as total_revenue
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sales s ON p.id = s.product_id
GROUP BY p.id, p.name, p.total_sales, c.name
ORDER BY p.total_sales DESC
LIMIT 10;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure to record a sale and update stock
DELIMITER //

CREATE PROCEDURE record_sale(
    IN p_product_id BIGINT,
    IN p_quantity INT,
    IN p_user_id BIGINT
)
BEGIN
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_current_stock INT;
    
    -- Get current product info
    SELECT price, stock_quantity INTO v_price, v_current_stock
    FROM products
    WHERE id = p_product_id;
    
    -- Check if enough stock
    IF v_current_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient stock';
    END IF;
    
    -- Calculate total
    SET v_total = v_price * p_quantity;
    
    -- Insert sale record
    INSERT INTO sales (product_id, quantity_sold, unit_price, total_amount, user_id)
    VALUES (p_product_id, p_quantity, v_price, v_total, p_user_id);
    
    -- Update product stock and total sales
    UPDATE products
    SET stock_quantity = stock_quantity - p_quantity,
        total_sales = total_sales + p_quantity
    WHERE id = p_product_id;
    
    -- Log stock movement
    INSERT INTO stock_movements (product_id, quantity_change, movement_type, reason, user_id)
    VALUES (p_product_id, -p_quantity, 'OUT', 'Sale', p_user_id);
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to check stock after update
DELIMITER //

CREATE TRIGGER check_low_stock_after_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.stock_quantity <= NEW.reorder_level THEN
        -- Here you could insert into a notifications table
        -- or send an alert
        SET @low_stock_alert = CONCAT('Low stock alert for product: ', NEW.name);
    END IF;
END //

DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_sales_product_date ON sales(product_id, sale_date);
CREATE INDEX idx_products_category_stock ON products(category_id, stock_quantity);

-- =====================================================
-- CLEANUP (Optional - for development)
-- =====================================================
-- DROP DATABASE IF EXISTS inventrix_db;
