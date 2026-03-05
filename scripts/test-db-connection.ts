import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

async function testConnection() {
  console.log('=================================');
  console.log('测试 Supabase 数据库连接');
  console.log('=================================\n');

  console.log('连接字符串:', connectionString?.replace(/:[^:@]+@/, ':****@'));

  try {
    const sql = postgres(connectionString, {
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log('\n正在连接数据库...\n');

    // 测试查询
    const result = await sql`SELECT NOW()`;
    console.log('✅ 数据库连接成功！');
    console.log(`   服务器时间: ${result[0].now}\n`);

    // 检查表是否存在
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log('⚠️  数据库中还没有表，需要先执行迁移脚本');
      console.log('   迁移文件: src/storage/database/supabase/migrations/0002_complete_schema.sql');
    } else {
      console.log('✅ 数据库中的表:');
      tables.forEach((t: any) => {
        console.log(`   - ${t.table_name}`);
      });
      console.log();

      // 检查各表的数据量
      for (const table of tables) {
        const tableName = table.table_name;
        const countResult = await sql`
          SELECT COUNT(*) as count 
          FROM ${sql.unsafe(tableName)}
        `;
        console.log(`   ${tableName}: ${countResult[0].count} 条记录`);
      }
    }

    await sql.end();

    console.log('\n=================================');
    console.log('数据库测试完成！');
    console.log('=================================');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ 数据库连接失败！');
    console.error(`错误信息: ${error.message}`);
    console.error(`错误代码: ${error.code}`);

    if (error.code === 'ENETUNREACH' || error.code === 'ETIMEDOUT') {
      console.log('\n可能原因:');
      console.log('1. 网络连接问题');
      console.log('2. Supabase 项目已暂停或删除');
      console.log('3. 防火墙阻止了连接');
    } else if (error.code === '28P01') {
      console.log('\n可能原因:');
      console.log('1. 数据库密码错误');
      console.log('2. 请检查 DATABASE_URL 中的密码');
    } else if (error.code === '3D000') {
      console.log('\n可能原因:');
      console.log('1. 数据库名称错误');
      console.log('2. 请检查 DATABASE_URL 中的数据库名');
    }

    console.log('\n请检查 .env.local 文件中的配置是否正确。');

    process.exit(1);
  }
}

testConnection();
