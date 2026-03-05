import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;

const createTableSQL = `
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

async function createTables() {
  console.log('正在连接Supabase数据库...');
  console.log('连接字符串:', connectionString.replace(/:[^:@]+@/, ':****@'));
  
  try {
    const sql = postgres(connectionString, {
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log('\n正在创建数据库表...');
    
    // 执行SQL
    await sql.unsafe(createTableSQL);
    
    console.log('✅ 数据库表创建成功！');
    console.log('已创建的表:');
    console.log('  - users (用户/会员表)');
    console.log('  - activities (活动表)');
    console.log('  - visits (探访表)');
    console.log('  - registrations (报名记录表)');
    
    await sql.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ 创建数据库表失败:', error.message);
    
    // 如果是网络问题，提供手动执行方案
    if (error.code === 'ENETUNREACH' || error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.log('\n=================================');
      console.log('检测到网络连接问题，请手动在Supabase SQL Editor中执行以下SQL:');
      console.log('=================================\n');
      console.log(createTableSQL);
      console.log('\nSQL Editor地址: https://supabase.com/dashboard/project/yqttwnpuhkfytrnslqml/sql/new');
    }
    
    process.exit(1);
  }
}

createTables();
