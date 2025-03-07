-- 企业财务管理系统数据库脚本
-- 创建日期: 2024-03-20
-- 版本: 1.0

-- 创建数据库
CREATE DATABASE IF NOT EXISTS finance_management_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE finance_management_system;

-- 禁用外键检查，以便于批量导入数据
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- 表结构
-- -----------------------------------------------------

-- 1. 用户表 (users)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'manager', 'accountant', 'viewer') NOT NULL,
    avatar VARCHAR(255),
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 账户表 (accounts)
CREATE TABLE IF NOT EXISTS accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('cash', 'bank', 'credit', 'investment', 'other') NOT NULL,
    currency VARCHAR(3) DEFAULT 'CNY',
    balance DECIMAL(15, 2) DEFAULT 0.00,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 交易类别表 (categories)
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 交易记录表 (transactions)
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('income', 'expense', 'transfer') NOT NULL,
    category_id INT,
    account_id INT NOT NULL,
    to_account_id INT,
    description TEXT,
    reference_number VARCHAR(50),
    status ENUM('completed', 'pending', 'cancelled') DEFAULT 'completed',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 预算表 (budgets)
CREATE TABLE IF NOT EXISTS budgets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    category_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 发票表 (invoices)
CREATE TABLE IF NOT EXISTS invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0.00,
    total_amount DECIMAL(15, 2) NOT NULL,
    type ENUM('purchase', 'sales', 'expense') NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
    vendor_name VARCHAR(100),
    vendor_contact VARCHAR(100),
    description TEXT,
    file_path VARCHAR(255),
    transaction_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. 报表设置表 (report_settings)
CREATE TABLE IF NOT EXISTS report_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('income', 'expense', 'balance', 'cash_flow') NOT NULL,
    time_period ENUM('month', 'quarter', 'year', 'custom') NOT NULL,
    start_date DATE,
    end_date DATE,
    include_categories TEXT,
    chart_type VARCHAR(50) DEFAULT 'bar',
    created_by INT NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. 系统设置表 (settings)
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_group VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. 通知表 (notifications)
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. 备份记录表 (backups)
CREATE TABLE IF NOT EXISTS backups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    status ENUM('success', 'failed') DEFAULT 'success',
    notes TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 索引
-- -----------------------------------------------------

-- 交易记录表索引
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);

-- 预算表索引
CREATE INDEX idx_budgets_date ON budgets(start_date, end_date);
CREATE INDEX idx_budgets_category ON budgets(category_id);

-- 发票表索引
CREATE INDEX idx_invoices_date ON invoices(invoice_date, due_date);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_type ON invoices(type);

-- 通知表索引
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- -----------------------------------------------------
-- 视图
-- -----------------------------------------------------

-- 1. 交易明细视图
CREATE OR REPLACE VIEW transaction_details AS
SELECT 
    t.id, 
    t.transaction_date, 
    t.amount, 
    t.type, 
    c.name AS category_name,
    a.name AS account_name,
    t.description,
    t.status,
    u.name AS created_by_name
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN accounts a ON t.account_id = a.id
LEFT JOIN users u ON t.created_by = u.id;

-- 2. 预算使用情况视图
CREATE OR REPLACE VIEW budget_usage AS
SELECT 
    b.id,
    b.name,
    b.amount AS budget_amount,
    b.start_date,
    b.end_date,
    c.name AS category_name,
    COALESCE(SUM(t.amount), 0) AS used_amount,
    (b.amount - COALESCE(SUM(t.amount), 0)) AS remaining_amount,
    (COALESCE(SUM(t.amount), 0) / b.amount * 100) AS usage_percentage
FROM budgets b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN transactions t ON t.category_id = b.category_id 
    AND t.transaction_date BETWEEN b.start_date AND b.end_date
    AND t.type = 'expense'
GROUP BY b.id;

-- 3. 月度收支汇总视图
CREATE OR REPLACE VIEW monthly_summary AS
SELECT 
    DATE_FORMAT(transaction_date, '%Y-%m') AS month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) AS total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -ABS(amount) END) AS net_amount
FROM transactions
WHERE status = 'completed'
GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
ORDER BY month DESC;

-- -----------------------------------------------------
-- 存储过程
-- -----------------------------------------------------

DELIMITER //

-- 1. 生成月度财务报表
CREATE PROCEDURE generate_monthly_report(IN report_month DATE)
BEGIN
    DECLARE start_date DATE;
    DECLARE end_date DATE;
    
    SET start_date = DATE_FORMAT(report_month, '%Y-%m-01');
    SET end_date = LAST_DAY(report_month);
    
    SELECT 
        'income' AS report_type,
        c.name AS category,
        SUM(t.amount) AS amount,
        COUNT(t.id) AS transaction_count
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.transaction_date BETWEEN start_date AND end_date
    AND t.type = 'income'
    AND t.status = 'completed'
    GROUP BY c.name
    
    UNION ALL
    
    SELECT 
        'expense' AS report_type,
        c.name AS category,
        SUM(ABS(t.amount)) AS amount,
        COUNT(t.id) AS transaction_count
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.transaction_date BETWEEN start_date AND end_date
    AND t.type = 'expense'
    AND t.status = 'completed'
    GROUP BY c.name;
END //

-- 2. 检查预算超支
CREATE PROCEDURE check_budget_overruns()
BEGIN
    SELECT 
        b.id,
        b.name,
        b.amount AS budget_amount,
        COALESCE(SUM(ABS(t.amount)), 0) AS used_amount,
        (COALESCE(SUM(ABS(t.amount)), 0) / b.amount * 100) AS usage_percentage,
        CASE 
            WHEN COALESCE(SUM(ABS(t.amount)), 0) > b.amount THEN 'Overrun'
            WHEN COALESCE(SUM(ABS(t.amount)), 0) > b.amount * 0.9 THEN 'Warning'
            ELSE 'Normal'
        END AS status
    FROM budgets b
    LEFT JOIN transactions t ON t.category_id = b.category_id 
        AND t.transaction_date BETWEEN b.start_date AND b.end_date
        AND t.type = 'expense'
        AND t.status = 'completed'
    GROUP BY b.id
    HAVING status IN ('Overrun', 'Warning');
END //

DELIMITER ;

-- -----------------------------------------------------
-- 触发器
-- -----------------------------------------------------

DELIMITER //

-- 1. 更新账户余额触发器
CREATE TRIGGER update_account_balance_after_transaction
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    IF NEW.type = 'income' THEN
        UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSEIF NEW.type = 'expense' THEN
        UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
    ELSEIF NEW.type = 'transfer' AND NEW.to_account_id IS NOT NULL THEN
        UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.to_account_id;
    END IF;
END //

-- 2. 创建预算超支通知触发器
CREATE TRIGGER create_budget_notification
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    DECLARE budget_id INT;
    DECLARE budget_name VARCHAR(100);
    DECLARE budget_amount DECIMAL(15, 2);
    DECLARE used_amount DECIMAL(15, 2);
    DECLARE usage_percentage DECIMAL(5, 2);
    
    SELECT b.id, b.name, b.amount INTO budget_id, budget_name, budget_amount
    FROM budgets b
    WHERE b.category_id = NEW.category_id
    AND NEW.transaction_date BETWEEN b.start_date AND b.end_date
    LIMIT 1;
    
    IF budget_id IS NOT NULL THEN
        SELECT COALESCE(SUM(ABS(t.amount)), 0) INTO used_amount
        FROM transactions t
        WHERE t.category_id = NEW.category_id
        AND t.transaction_date BETWEEN (SELECT start_date FROM budgets WHERE id = budget_id) 
                                AND (SELECT end_date FROM budgets WHERE id = budget_id)
        AND t.type = 'expense'
        AND t.status = 'completed';
        
        SET usage_percentage = (used_amount / budget_amount) * 100;
        
        IF usage_percentage >= 90 THEN
            INSERT INTO notifications (user_id, title, message, type)
            SELECT id, CONCAT('预算警告: ', budget_name), 
                   CONCAT('预算 "', budget_name, '" 已使用 ', ROUND(usage_percentage, 2), '%'),
                   'budget'
            FROM users
            WHERE role IN ('admin', 'manager');
        END IF;
    END IF;
END //

DELIMITER ;

-- -----------------------------------------------------
-- 初始数据
-- -----------------------------------------------------

-- 1. 用户表初始数据
INSERT INTO users (username, password, name, email, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', 'admin@example.com', 'admin'),
('manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '财务经理', 'manager@example.com', 'manager'),
('accountant', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '会计', 'accountant@example.com', 'accountant'),
('viewer', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '查看者', 'viewer@example.com', 'viewer');

-- 2. 账户表初始数据
INSERT INTO accounts (name, type, currency, balance, description) VALUES
('现金账户', 'cash', 'CNY', 5000.00, '日常现金支出'),
('工商银行', 'bank', 'CNY', 120000.00, '主要银行账户'),
('建设银行', 'bank', 'CNY', 85000.00, '备用银行账户'),
('招商银行信用卡', 'credit', 'CNY', -3500.00, '公司信用卡'),
('支付宝', 'other', 'CNY', 8500.00, '电子支付账户');

-- 3. 交易类别表初始数据
INSERT INTO categories (name, type, icon, color) VALUES
('工资收入', 'income', 'fa-money-bill', '#34C759'),
('投资收益', 'income', 'fa-chart-line', '#5856D6'),
('销售收入', 'income', 'fa-shopping-cart', '#007AFF'),
('其他收入', 'income', 'fa-plus-circle', '#64D2FF'),
('办公用品', 'expense', 'fa-paperclip', '#FF9500'),
('水电费', 'expense', 'fa-bolt', '#FF3B30'),
('房租', 'expense', 'fa-building', '#FF9500'),
('工资支出', 'expense', 'fa-users', '#5856D6'),
('市场推广', 'expense', 'fa-bullhorn', '#FF2D55'),
('差旅费', 'expense', 'fa-plane', '#AF52DE'),
('餐饮费', 'expense', 'fa-utensils', '#FF9500'),
('其他支出', 'expense', 'fa-minus-circle', '#8E8E93');

-- 4. 交易记录表初始数据
INSERT INTO transactions (transaction_date, amount, type, category_id, account_id, description, status, created_by) VALUES
('2024-03-01', 150000.00, 'income', 3, 2, '3月销售收入', 'completed', 1),
('2024-03-05', -3800.00, 'expense', 6, 2, '3月水电费', 'completed', 1),
('2024-03-10', -25000.00, 'expense', 7, 2, '3月办公室租金', 'completed', 1),
('2024-03-15', -85000.00, 'expense', 8, 2, '3月员工工资', 'completed', 1),
('2024-03-18', -2500.00, 'expense', 5, 4, '办公用品采购', 'completed', 1),
('2024-03-20', -15000.00, 'expense', 9, 2, '网络广告费', 'completed', 1),
('2024-03-22', -4500.00, 'expense', 10, 4, '业务出差费用', 'completed', 1),
('2024-03-25', 8000.00, 'income', 4, 2, '设备租赁收入', 'completed', 1),
('2024-03-28', -1200.00, 'expense', 11, 1, '客户招待餐费', 'completed', 1),
('2024-03-30', -3000.00, 'expense', 12, 1, '办公室装修', 'pending', 1);

-- 5. 预算表初始数据
INSERT INTO budgets (name, amount, start_date, end_date, category_id, created_by) VALUES
('人工成本预算', 200000.00, '2024-01-01', '2024-12-31', 8, 1),
('办公用品预算', 50000.00, '2024-01-01', '2024-12-31', 5, 1),
('水电费预算', 30000.00, '2024-01-01', '2024-12-31', 6, 1),
('市场推广预算', 100000.00, '2024-01-01', '2024-12-31', 9, 1);

-- 6. 发票表初始数据
INSERT INTO invoices (invoice_number, invoice_date, due_date, amount, tax_amount, total_amount, type, status, vendor_name, description, created_by) VALUES
('INV-001', '2024-03-20', '2024-04-20', 2118.64, 381.36, 2500.00, 'purchase', 'pending', '文具有限公司', '办公用品采购', 1),
('INV-002', '2024-03-19', '2024-04-19', 12711.86, 2288.14, 15000.00, 'sales', 'approved', '客户A公司', '产品销售', 1),
('INV-003', '2024-03-18', '2024-04-18', 3220.34, 579.66, 3800.00, 'expense', 'rejected', '水电公司', '3月水电费', 1);

-- 7. 系统设置表初始数据
INSERT INTO settings (setting_key, setting_value, setting_group, description) VALUES
('system_name', '企业财务管理系统', 'basic', '系统名称'),
('language', 'zh', 'basic', '系统语言'),
('timezone', 'UTC+8', 'basic', '系统时区'),
('currency', 'CNY', 'basic', '默认货币单位'),
('password_expiry', '90', 'security', '密码有效期（天）'),
('login_attempts', '5', 'security', '登录失败尝试次数限制'),
('two_factor_auth', 'false', 'security', '是否启用双因素认证'),
('session_timeout', '30', 'security', '会话超时时间（分钟）'),
('system_notifications', 'true', 'notification', '是否启用系统通知'),
('budget_reminders', 'true', 'notification', '是否启用预算提醒'),
('invoice_reminders', 'true', 'notification', '是否启用发票提醒'),
('email_notifications', 'true', 'notification', '是否启用邮件通知'),
('auto_backup', 'true', 'backup', '是否启用自动备份'),
('backup_frequency', 'weekly', 'backup', '备份频率'),
('backup_time', '00:00', 'backup', '备份时间'),
('backup_count', '7', 'backup', '保留备份数量');

-- 8. 通知表初始数据
INSERT INTO notifications (user_id, title, message, type) VALUES
(1, '预算提醒', '市场推广预算已使用45%', 'budget'),
(1, '发票到期提醒', '发票 #INV-001 将在5天后到期', 'invoice'),
(1, '系统通知', '系统将于本周日进行维护，请提前做好准备', 'system');

-- 启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 完成
SELECT '企业财务管理系统数据库初始化完成' AS '状态'; 