-- 消息管理功能所需的数据库表
-- 执行此脚本来创建必要的表

-- 1. 创建审批表（approvals）
-- 用于管理用户申请（如2026AI圈申请、探访申请等）的审核
CREATE TABLE IF NOT EXISTS approvals (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 审批类型：ai-circle, visit 等
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  review_note TEXT,
  reviewed_by VARCHAR(36) REFERENCES admin_users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approvals_user_id ON approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_approvals_type ON approvals(type);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);

-- 2. 创建探访报名表（visit_registrations）
-- 用于管理用户报名探访活动的记录
CREATE TABLE IF NOT EXISTS visit_registrations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id VARCHAR(36) NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered', -- registered, approved, rejected, cancelled
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visit_registrations_visit_id ON visit_registrations(visit_id);
CREATE INDEX IF NOT EXISTS idx_visit_registrations_user_id ON visit_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_visit_registrations_status ON visit_registrations(status);

-- 注：notifications表已经存在，用于存储用户消息通知
