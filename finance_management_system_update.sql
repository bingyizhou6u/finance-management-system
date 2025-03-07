-- 企业财务管理系统数据库更新脚本
-- 创建日期: 2024-03-07
-- 版本: 1.1

-- -----------------------------------------------------
-- 新增表
-- -----------------------------------------------------

-- 1. 标签表 (tags)
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#007AFF',
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. 交易标签关联表 (transaction_tags)
CREATE TABLE IF NOT EXISTS transaction_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(transaction_id, tag_id)
);

-- 3. 定期交易表 (recurring_transactions)
CREATE TABLE IF NOT EXISTS recurring_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    start_date TEXT NOT NULL,
    end_date TEXT,
    next_date TEXT NOT NULL,
    category_id INTEGER,
    account_id INTEGER NOT NULL,
    to_account_id INTEGER,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. 附件表 (attachments)
CREATE TABLE IF NOT EXISTS attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('transaction', 'invoice', 'budget')),
    entity_id INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. 审计日志表 (audit_logs)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    old_value TEXT,
    new_value TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. 财务报表表 (financial_reports)
CREATE TABLE IF NOT EXISTS financial_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income_statement', 'balance_sheet', 'cash_flow', 'custom')),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    parameters TEXT,
    created_by INTEGER NOT NULL,
    is_public INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- 修改现有表
-- -----------------------------------------------------

-- 1. 用户表添加字段
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN department TEXT;
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));
ALTER TABLE users ADD COLUMN login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN password_changed_at TIMESTAMP;

-- 2. 交易记录表添加字段
ALTER TABLE transactions ADD COLUMN payment_method TEXT CHECK (payment_method IN ('cash', 'bank_transfer', 'credit_card', 'debit_card', 'mobile_payment', 'other'));
ALTER TABLE transactions ADD COLUMN receipt_number TEXT;
ALTER TABLE transactions ADD COLUMN is_reconciled INTEGER DEFAULT 0;
ALTER TABLE transactions ADD COLUMN reconciled_at TIMESTAMP;
ALTER TABLE transactions ADD COLUMN notes TEXT;

-- 3. 预算表添加字段
ALTER TABLE budgets ADD COLUMN alert_threshold REAL DEFAULT 80.0;
ALTER TABLE budgets ADD COLUMN is_active INTEGER DEFAULT 1;
ALTER TABLE budgets ADD COLUMN recurring INTEGER DEFAULT 0;
ALTER TABLE budgets ADD COLUMN color TEXT DEFAULT '#007AFF';

-- 4. 发票表添加字段
ALTER TABLE invoices ADD COLUMN payment_terms TEXT;
ALTER TABLE invoices ADD COLUMN payment_date TEXT;
ALTER TABLE invoices ADD COLUMN payment_method TEXT;
ALTER TABLE invoices ADD COLUMN notes TEXT;

-- -----------------------------------------------------
-- 索引
-- -----------------------------------------------------

-- 标签表索引
CREATE INDEX idx_tags_name ON tags(name);

-- 交易标签关联表索引
CREATE INDEX idx_transaction_tags_transaction ON transaction_tags(transaction_id);
CREATE INDEX idx_transaction_tags_tag ON transaction_tags(tag_id);

-- 定期交易表索引
CREATE INDEX idx_recurring_transactions_next_date ON recurring_transactions(next_date);
CREATE INDEX idx_recurring_transactions_active ON recurring_transactions(is_active);

-- 附件表索引
CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);

-- 审计日志表索引
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- 财务报表表索引
CREATE INDEX idx_financial_reports_date ON financial_reports(start_date, end_date);
CREATE INDEX idx_financial_reports_type ON financial_reports(type);

-- -----------------------------------------------------
-- 初始数据
-- -----------------------------------------------------

-- 1. 标签表初始数据
INSERT INTO tags (name, color, created_by) VALUES
('重要', '#FF3B30', 1),
('已审核', '#34C759', 1),
('待处理', '#FFCC00', 1),
('个人', '#5856D6', 1),
('公司', '#007AFF', 1);

-- 2. 系统设置表新增数据
INSERT INTO settings (setting_key, setting_value, setting_group, description) VALUES
('enable_tags', 'true', 'feature', '是否启用标签功能'),
('enable_recurring_transactions', 'true', 'feature', '是否启用定期交易功能'),
('enable_attachments', 'true', 'feature', '是否启用附件功能'),
('enable_audit_logs', 'true', 'feature', '是否启用审计日志功能'),
('default_date_format', 'YYYY-MM-DD', 'display', '默认日期格式'),
('default_time_format', 'HH:mm', 'display', '默认时间格式'),
('default_currency_format', '¥#,##0.00', 'display', '默认货币格式'); 