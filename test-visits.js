const postgres = require('./node_modules/postgres');

const connectionString = 'postgresql://postgres:Zy818989@pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com:5432/ran_field?sslmode=disable&connect_timeout=10';

(async () => {
  const sql = postgres(connectionString, {
    max: 1,
    ssl: false,
    connect_timeout: 10,
  });

  try {
    // 检查 visits 表的列
    console.log('visits 表的列:');
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'visits' AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    console.log(columns);

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await sql.end();
  }
})();
