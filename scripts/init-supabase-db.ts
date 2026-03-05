import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqttwnpuhkfytrnslqml.supabase.co';
const supabaseKey = 'sb_publishable_22-lQF_ab5UgQViQAOk2RA_tRtb7XOL';

const supabase = createClient(supabaseUrl, supabaseKey);

const createTablesSQL = `
-- 创建枚举类型
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('user', 'admin');
CREATE TYPE IF NOT EXISTS user_status AS ENUM ('active', 'inactive');
CREATE TYPE IF NOT EXISTS activity_category AS ENUM ('private', 'salon', 'ai');
CREATE TYPE IF NOT EXISTS activity_status AS ENUM ('draft', 'active', 'ended', 'cancelled');
CREATE TYPE IF NOT EXISTS visit_status AS ENUM ('draft', 'active', 'ended', 'cancelled');
CREATE TYPE IF NOT EXISTS registration_status AS ENUM ('registered', 'cancelled');
CREATE TYPE IF NOT EXISTS payment_status AS ENUM ('paid', 'unpaid', 'offline');

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  name VARCHAR(50),
  avatar TEXT,
  company VARCHAR(100),
  position VARCHAR(50),
  bio TEXT,
  role user_role DEFAULT 'user',
  status user_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 创建活动表
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(200),
  category activity_category DEFAULT 'private',
  description TEXT NOT NULL,
  image TEXT,
  address VARCHAR(200),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  capacity INTEGER DEFAULT 0,
  tea_fee INTEGER DEFAULT 0,
  status activity_status DEFAULT 'draft',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 创建探访表
CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  location VARCHAR(200),
  date TIMESTAMP,
  capacity INTEGER DEFAULT 0,
  tea_fee INTEGER DEFAULT 0,
  status visit_status DEFAULT 'draft',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 创建报名记录表
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  activity_id INTEGER REFERENCES activities(id),
  visit_id INTEGER REFERENCES visits(id),
  status registration_status DEFAULT 'registered',
  payment_status payment_status DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
`;

async function initDatabase() {
  try {
    console.log('正在连接Supabase...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (error) {
      console.error('创建数据库表失败:', error);
      throw error;
    }
    
    console.log('数据库表创建成功！');
    console.log('创建的表: users, activities, visits, registrations');
  } catch (error) {
    console.error('初始化数据库失败:', error);
    
    // 提供备选方案
    console.log('\n=================================');
    console.log('请手动在Supabase SQL Editor中执行以下SQL:');
    console.log('=================================\n');
    console.log(createTablesSQL);
  }
}

initDatabase();
