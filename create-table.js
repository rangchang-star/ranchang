const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yqttwnpuhkfytrnslqml.supabase.co';
const supabaseKey = 'sb_publishable_22-lQF_ab5UgQViQAOk2RA_tRtb7XOL';
const client = createClient(supabaseUrl, supabaseKey);

async function createTable() {
  try {
    console.log('🚀 开始创建 users 表...');

    // 使用 RPC 执行 SQL（如果可用）
    // 否则需要直接在 Supabase 控制台执行

    console.log('\n⚠️  请在 Supabase 控制台执行以下 SQL：\n');

    const sql = `-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(128) NOT NULL,
  age INTEGER,
  avatar TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  connection_type VARCHAR(50),
  industry VARCHAR(100),
  need TEXT,
  ability_tags JSONB,
  resource_tags JSONB,
  level VARCHAR(50),
  company VARCHAR(255),
  position VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  is_featured BOOLEAN DEFAULT false,
  join_date TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS users_connection_type_idx ON users(connection_type);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_industry_idx ON users(industry);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email);`;

    console.log(sql);

    console.log('\n========================================');
    console.log('执行步骤：');
    console.log('========================================');
    console.log('1. 登录 Supabase 控制台');
    console.log('2. 进入 SQL Editor');
    console.log('3. 复制上面的 SQL');
    console.log('4. 点击 "RUN" 执行');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

createTable();
