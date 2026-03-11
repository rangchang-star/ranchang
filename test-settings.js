const postgres = require('./node_modules/postgres');

const connectionString = 'postgresql://postgres:Zy818989@pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com:5432/ran_field?sslmode=disable&connect_timeout=10';

(async () => {
  const sql = postgres(connectionString, {
    max: 1,
    ssl: false,
    connect_timeout: 10,
  });

  try {
    // 检查 settings 表
    console.log('检查 settings 表:');
    const settingsResult = await sql`SELECT * FROM settings LIMIT 1`;
    console.log('settings 数据:', settingsResult);

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await sql.end();
  }
})();
