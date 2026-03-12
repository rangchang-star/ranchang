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
  age INTEGER,
  gender VARCHAR(10),
  industry VARCHAR(50),
  company VARCHAR(100),
  position VARCHAR(50),
  city VARCHAR(50),
  level INTEGER DEFAULT 1,
  achievement TEXT,
  hardcore_tags JSONB,
  tags JSONB,
  tag_stamp VARCHAR(50),
  need TEXT,
  is_trusted BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
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
  subtitle VARCHAR(200),
  description TEXT NOT NULL,
  category VARCHAR(50),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  start_time VARCHAR(20),
  end_time VARCHAR(20),
  location VARCHAR(200),
  address VARCHAR(200),
  capacity INTEGER DEFAULT 0,
  tea_fee INTEGER DEFAULT 0,
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
  user_position VARCHAR(100),
  direction VARCHAR(100),
  text TEXT NOT NULL,
  summary TEXT,
  audio_url VARCHAR(500),
  audio_key TEXT,
  icon VARCHAR(100),
  icon_type VARCHAR(50),
  duration VARCHAR(20),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
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
  audio_url VARCHAR(500),
  audio_key TEXT,
  summary TEXT,
  text TEXT,
  icon_type VARCHAR(50),
  rank INTEGER,
  profile TEXT,
  duration VARCHAR(50),
  views INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
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
  type VARCHAR(50),
  description TEXT,
  category VARCHAR(50),
  content TEXT,
  file_url TEXT,
  file_key TEXT,
  cover_image TEXT,
  cover_image_key TEXT,
  icon VARCHAR(100),
  file_size INTEGER,
  file_type VARCHAR(50),
  downloads INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
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
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_status ON consultations(status);

-- ============================================================
-- 11. 评估表（assessments）
-- ============================================================
CREATE TABLE assessments (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  score JSONB,
  result TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_type ON assessments(type);

-- ============================================================
-- 12. 管理员表（admin_users）
-- ============================================================
CREATE TABLE admin_users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(50),
  role VARCHAR(50) DEFAULT 'admin',
  status user_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_status ON admin_users(status);

-- ============================================================
-- 13. 设置表（settings）
-- ============================================================
CREATE TABLE settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);

-- ============================================================
-- 初始化数据
-- ============================================================

-- 创建默认管理员账号（密码: admin123，实际应用中需要加密）
INSERT INTO admin_users (username, password, name, role, status)
VALUES ('admin', '$2a$10$rQK8qZqZqZqZqZqZqZqZqO', '超级管理员', 'admin', 'active');

-- 初始化页面设置
INSERT INTO settings (key, value, description)
VALUES
  ('discovery', '{"slogan":"发现光亮，点亮事业","logo":"/logo-ranchang.png","music":"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3","backgroundImage":"/discovery-bg.jpg"}', '发现页设置'),
  ('activities', '{"defaultCapacity":20,"defaultTeaFee":100}', '活动页默认设置'),
  ('visits', '{"defaultCapacity":10}', '探访页默认设置');

-- 注释：以上密码是 admin123 的 bcrypt 哈希值（示例）
-- 实际部署时需要使用真实的 bcrypt 哈希值
