-- ============================================================
-- 燃场项目 - 数据库结构创建 SQL
-- 用于在阿里云 RDS PostgreSQL 中创建完整的数据库结构
-- ============================================================

-- ============================================================
-- 1. 创建枚举类型
-- ============================================================

CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE activity_status AS ENUM ('draft', 'published', 'cancelled', 'ended');
CREATE TYPE registration_status AS ENUM ('pending', 'registered', 'approved', 'rejected', 'cancelled');
CREATE TYPE visit_status AS ENUM ('draft', 'upcoming', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('system', 'activity', 'registration', 'visit', 'approval');
CREATE TYPE declaration_type AS ENUM ('ability', 'connection', 'resource');

-- ============================================================
-- 2. 创建用户表（app_users）
-- ============================================================

CREATE TABLE app_users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255),
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
  email VARCHAR(255),
  level INTEGER DEFAULT 1,
  achievement JSONB,
  hardcore_tags JSONB,
  ability_tags JSONB,
  resource_tags JSONB,
  tags JSONB,
  tag_stamp VARCHAR(50),
  company_scale VARCHAR(50),
  experience JSONB,
  need TEXT,
  declaration TEXT,
  connection_type VARCHAR(50),
  is_trusted BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  status user_status DEFAULT 'active',
  join_date TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX app_users_phone_idx ON app_users(phone);
CREATE INDEX app_users_status_idx ON app_users(status);
CREATE INDEX app_users_level_idx ON app_users(level);

-- ============================================================
-- 3. 创建活动表（activities）
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
  tea_fee TEXT,
  type VARCHAR(50) DEFAULT 'salon',
  cover_image TEXT,
  cover_image_key TEXT,
  status activity_status DEFAULT 'draft',
  registered_count INTEGER DEFAULT 0,
  created_by VARCHAR(36) REFERENCES app_users(id) ON DELETE SET NULL,
  tags JSONB,
  guests JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX activities_status_idx ON activities(status);
CREATE INDEX activities_date_idx ON activities(date);
CREATE INDEX activities_type_idx ON activities(type);
CREATE INDEX activities_created_by_idx ON activities(created_by);

-- ============================================================
-- 4. 创建活动报名表（activity_registrations）
-- ============================================================

CREATE TABLE activity_registrations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id VARCHAR(36) NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  status registration_status DEFAULT 'registered',
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX activity_registrations_activity_id_idx ON activity_registrations(activity_id);
CREATE INDEX activity_registrations_user_id_idx ON activity_registrations(user_id);
CREATE INDEX activity_registrations_status_idx ON activity_registrations(status);

-- ============================================================
-- 5. 创建探访表（visits）
-- ============================================================

CREATE TABLE visits (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  location VARCHAR(255),
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time VARCHAR(20),
  capacity INTEGER DEFAULT 0,
  registered_count INTEGER DEFAULT 0,
  cover_image TEXT,
  cover_image_key TEXT,
  status visit_status DEFAULT 'draft',
  record TEXT,
  outcome TEXT,
  notes TEXT,
  key_points JSONB,
  next_steps JSONB,
  rating INTEGER,
  feedback_audio TEXT,
  photos JSONB,
  participants INTEGER,
  visitor_ids JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX visits_company_id_idx ON visits(company_id);
CREATE INDEX visits_status_idx ON visits(status);
CREATE INDEX visits_date_idx ON visits(date);
CREATE INDEX visits_cover_image_key_idx ON visits(cover_image_key);

-- ============================================================
-- 6. 创建探访记录表（visit_records）
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX visit_records_visit_id_idx ON visit_records(visit_id);
CREATE INDEX visit_records_visitor_id_idx ON visit_records(visitor_id);

-- ============================================================
-- 7. 创建探访报名表（visit_registrations）
-- ============================================================

CREATE TABLE visit_registrations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id VARCHAR(36) NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX visit_registrations_visit_id_idx ON visit_registrations(visit_id);
CREATE INDEX visit_registrations_user_id_idx ON visit_registrations(user_id);
CREATE INDEX visit_registrations_status_idx ON visit_registrations(status);

-- ============================================================
-- 8. 创建宣告表（declarations）
-- ============================================================

CREATE TABLE declarations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  type declaration_type DEFAULT 'resource',
  direction VARCHAR(100),
  text TEXT NOT NULL,
  summary TEXT,
  audio_url VARCHAR(500),
  audio_key TEXT,
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX declarations_user_id_idx ON declarations(user_id);
CREATE INDEX declarations_date_idx ON declarations(date);
CREATE INDEX declarations_featured_idx ON declarations(is_featured);
CREATE INDEX declarations_type_idx ON declarations(type);

-- ============================================================
-- 9. 创建每日宣告表（daily_declarations）
-- ============================================================

CREATE TABLE daily_declarations (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  image TEXT,
  audio TEXT,
  summary TEXT,
  text TEXT,
  icon_type VARCHAR(50),
  rank INTEGER,
  profile TEXT,
  duration VARCHAR(50),
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX daily_declarations_date_idx ON daily_declarations(date);
CREATE INDEX daily_declarations_featured_idx ON daily_declarations(is_featured);
CREATE INDEX daily_declarations_rank_idx ON daily_declarations(rank);

-- ============================================================
-- 10. 创建文档表（documents）
-- ============================================================

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  content TEXT,
  file_url TEXT,
  cover TEXT,
  icon VARCHAR(100),
  file_size INTEGER,
  file_type VARCHAR(50),
  download_count INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX documents_category_idx ON documents(category);
CREATE INDEX documents_created_by_idx ON documents(created_by);

-- ============================================================
-- 11. 创建通知表（notifications）
-- ============================================================

CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  related_id VARCHAR(36),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);
CREATE INDEX notifications_type_idx ON notifications(type);

-- ============================================================
-- 12. 创建咨询表（consultations）
-- ============================================================

CREATE TABLE consultations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(36) NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  topic_id VARCHAR(50),
  topic_name VARCHAR(200),
  question TEXT NOT NULL,
  answer TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  consultant_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- 13. 创建设置表（settings）
-- ============================================================

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
