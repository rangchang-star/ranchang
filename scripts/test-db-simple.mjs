import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Zy-818989696926@yqttwnpuhkfytrnslqml.pooler.supabase.com:5432/postgres';

const sql = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('正在测试数据库连接...');
    
    const result = await sql`SELECT NOW()`;
    console.log('✓ 数据库连接成功:', result[0].now);
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✓ 数据库表列表:', tables.map(t => t.table_name));
    
    // 检查是否有 users 表
    if (tables.some(t => t.table_name === 'users')) {
      const count = await sql`SELECT COUNT(*) as count FROM users`;
      console.log('✓ users 表记录数:', count[0].count);
      
      // 获取前3条记录
      const users = await sql`SELECT id, nickname, name, avatar FROM users LIMIT 3`;
      console.log('✓ users 表示例数据:', users);
    } else {
      console.log('⚠ users 表不存在');
    }
    
    // 检查是否有 activities 表
    if (tables.some(t => t.table_name === 'activities')) {
      const count = await sql`SELECT COUNT(*) as count FROM activities`;
      console.log('✓ activities 表记录数:', count[0].count);
      
      // 获取前3条记录
      const activities = await sql`SELECT id, title, category FROM activities LIMIT 3`;
      console.log('✓ activities 表示例数据:', activities);
    } else {
      console.log('⚠ activities 表不存在');
    }
    
  } catch (error) {
    console.error('✗ 数据库连接失败:', error.message);
    console.error('错误详情:', error);
  } finally {
    await sql.end();
  }
}

testConnection();
