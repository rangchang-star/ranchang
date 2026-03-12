-- ============================================================
-- 燃场网站数据库初始化脚本
-- ============================================================

-- 创建枚举类型
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE activity_status AS ENUM ('draft', 'published', 'cancelled', 'ended');
CREATE TYPE registration_status AS ENUM ('registered', 'approved', 'rejected', 'cancelled');
CREATE TYPE visit_status AS ENUM ('draft', 'upcoming', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('system', 'activity', 'registration', 'visit', 'approval');

-- ============================================================
-- 1. 用户表（app_users）
-- ============================================================
CREATE TABLE app_users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  nickname VARCHAR(50),
  name VARCHAR(50),
  avatar TEXT,
  bio TEXT,
  industry VARCHAR(50),
  company VARCHAR(100),
  position VARCHAR(50),
  level INTEGER DEFAULT 1,
  achievement TEXT,
  status user_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_users_phone ON app_users(phone);
CREATE INDEX idx_app_users_status ON app_users(status);
CREATE INDEX idx_app_users_level ON app_users(level);

-- ============================================================
-- 2. 活动表（activities）
-- ============================================================
CREATE TABLE activities (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  start_time VARCHAR(20),
  end_time VARCHAR(20),
  location VARCHAR(200),
  capacity INTEGER DEFAULT 0,
  type VARCHAR(50) DEFAULT 'salon',
  cover_image TEXT,
  cover_image_key TEXT,
  status activity_status DEFAULT 'draft',
  registered_count INTEGER DEFAULT 0,
  created_by VARCHAR(36) REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_created_by ON activities(created_by);

-- ============================================================
-- 3. 活动报名表（activity_registrations）
-- ============================================================
CREATE TABLE activity_registrations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id VARCHAR(36) NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  status registration_status DEFAULT 'registered',
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

CREATE INDEX idx_activity_registrations_activity_id ON activity_registrations(activity_id);
CREATE INDEX idx_activity_registrations_user_id ON activity_registrations(user_id);
CREATE INDEX idx_activity_registrations_status ON activity_registrations(status);

-- ============================================================
-- 4. 探访表（visits）
-- ============================================================
CREATE TABLE visits (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  location VARCHAR(255),
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity INTEGER DEFAULT 0,
  registered_count INTEGER DEFAULT 0,
  cover_image TEXT,
  cover_image_key TEXT,
  status visit_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visits_company_id ON visits(company_id);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_date ON visits(date);

-- ============================================================
-- 5. 探访记录表（visit_records）
-- ============================================================
CREATE TABLE visit_records (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id VARCHAR(36) NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  record TEXT,
  outcome TEXT,
  key_points JSONB,
  next_steps JSONB,
  rating INTEGER,
  feedback_audio TEXT,
  photos JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visit_records_visit_id ON visit_records(visit_id);
CREATE INDEX idx_visit_records_visitor_id ON visit_records(visitor_id);

-- ============================================================
-- 6. 宣告表（declarations）
-- ============================================================
CREATE TABLE declarations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  user_name VARCHAR(50),
  user_avatar TEXT,
  user_level INTEGER DEFAULT 1,
  direction VARCHAR(100),
  text TEXT NOT NULL,
  summary TEXT,
  audio_url VARCHAR(500),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_declarations_user_id ON declarations(user_id);
CREATE INDEX idx_declarations_date ON declarations(date);
CREATE INDEX idx_declarations_featured ON declarations(is_featured);

-- ============================================================
-- 7. 每日宣告表（daily_declarations）
-- ============================================================
CREATE TABLE daily_declarations (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  image TEXT,
  image_key TEXT,
  audio TEXT,
  audio_key TEXT,
  summary TEXT,
  text TEXT,
  icon_type VARCHAR(50),
  rank INTEGER,
  profile TEXT,
  duration VARCHAR(50),
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_declarations_date ON daily_declarations(date);
CREATE INDEX idx_daily_declarations_featured ON daily_declarations(is_featured);
CREATE INDEX idx_daily_declarations_rank ON daily_declarations(rank);

-- ============================================================
-- 8. 文档表（documents）
-- ============================================================
CREATE TABLE documents (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  file_url TEXT,
  file_key TEXT,
  cover_image TEXT,
  cover_image_key TEXT,
  file_size INTEGER,
  file_type VARCHAR(50),
  downloads INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  author_id VARCHAR(36) REFERENCES app_users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_author_id ON documents(author_id);
CREATE INDEX idx_documents_status ON documents(status);

-- ============================================================
-- 9. 通知表（notifications）
-- ============================================================
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  related_id VARCHAR(36),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================================
-- 10. 咨询表（consultations）
-- ============================================================
CREATE TABLE consultations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  consultant_id VARCHAR(36) REFERENCES app_users(id) ON DELETE SET NULL,
  topic VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  recording_url TEXT,
  recording_key TEXT,
  notes TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_consultant_id ON consultations(consultant_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_scheduled_at ON consultations(scheduled_at);

-- ============================================================
-- 11. 评估表（assessments）
-- ============================================================
CREATE TABLE assessments (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  assessor_id VARCHAR(36) REFERENCES app_users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  score INTEGER,
  feedback TEXT,
  criteria JSONB,
  results JSONB,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_assessor_id ON assessments(assessor_id);
CREATE INDEX idx_assessments_type ON assessments(type);
CREATE INDEX idx_assessments_status ON assessments(status);

-- ============================================================
-- 12. 管理员表（admin_users）
-- ============================================================
CREATE TABLE admin_users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'admin',
  permissions JSONB,
  last_login_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_status ON admin_users(status);

-- ============================================================
-- 13. 设置表（settings）
-- ============================================================
CREATE TABLE settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);

-- ============================================================
-- 插入初始数据
-- ============================================================

-- 插入默认管理员账户
-- 密码: admin123 (需要用 bcrypt 加密后插入)
INSERT INTO admin_users (id, username, email, password, name, role, status)
VALUES (
  'admin-001',
  'admin',
  'admin@ranchang.com',
  '$2b$10$rqOwZJ1Z0K8w5KpKqK5q5O5qK5qK5qK5qK5qK5qK5qK5qK5qK5qK5q',
  '系统管理员',
  'superadmin',
  'active'
) ON CONFLICT (username) DO NOTHING;

-- 插入默认系统设置
INSERT INTO settings (key, value, description)
VALUES
  ('site_name', '"燃场"', '网站名称'),
  ('site_description', '"点燃创业激情，成就梦想"', '网站描述'),
  ('site_logo', '""', '网站Logo'),
  ('site_favicon', '""', '网站Favicon'),
  ('contact_email', '"contact@ranchang.com"', '联系邮箱'),
  ('contact_phone', '"400-888-8888"', '联系电话'),
  ('social_wechat', '""', '微信公众号'),
  ('social_weibo', '""', '微博账号'),
  ('social_douyin', '""', '抖音账号')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 创建更新时间触发器（可选）
-- ============================================================

-- 为所有表的 updated_at 字段创建自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加触发器
CREATE TRIGGER update_app_users_updated_at BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_registrations_updated_at BEFORE UPDATE ON activity_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visit_records_updated_at BEFORE UPDATE ON visit_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_declarations_updated_at BEFORE UPDATE ON declarations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_declarations_updated_at BEFORE UPDATE ON daily_declarations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
