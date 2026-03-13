-- 添加 payment_status 列到 activity_registrations 表
ALTER TABLE activity_registrations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'unpaid';
