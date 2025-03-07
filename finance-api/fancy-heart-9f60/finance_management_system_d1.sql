-- 企业财务管理系统数据库脚本 (Cloudflare D1 版本)
-- 创建日期: 2024-03-20
-- 版本: 1.0

-- -----------------------------------------------------
-- 表结构
-- -----------------------------------------------------

-- 1. 用户表 (users)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'accountant', 'viewer')),
    avatar TEXT,
    last_login TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 账户表 (accounts)
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cash', 'bank', 'credit', 'investment', 'other')),
    currency TEXT DEFAULT 'CNY',
    balance REAL DEFAULT 0.00,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 交易类别表 (categories)
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    icon TEXT,
    color TEXT,
    parent_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. 交易记录表 (transactions)
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_date TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    category_id INTEGER,
    account_id INTEGER NOT NULL,
    to_account_id INTEGER,
    description TEXT,
    reference_number TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. 预算表 (budgets)
CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    category_id INTEGER,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. 发票表 (invoices)
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT NOT NULL UNIQUE,
    invoice_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    amount REAL NOT NULL,
    tax_amount REAL DEFAULT 0.00,
    total_amount REAL NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'sales', 'expense')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    vendor_name TEXT,
    vendor_contact TEXT,
    description TEXT,
    file_path TEXT,
    transaction_id INTEGER,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. 报表设置表 (report_settings)
CREATE TABLE IF NOT EXISTS report_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'balance', 'cash_flow')),
    time_period TEXT NOT NULL CHECK (time_period IN ('month', 'quarter', 'year', 'custom')),
    start_date TEXT,
    end_date TEXT,
    include_categories TEXT,
    chart_type TEXT DEFAULT 'bar',
    created_by INTEGER NOT NULL,
    is_favorite INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. 系统设置表 (settings)
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_group TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. 通知表 (notifications)
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. 备份记录表 (backups)
CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed')),
    notes TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

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