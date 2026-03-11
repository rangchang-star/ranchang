const postgres = require('./node_modules/postgres');

const connectionString = 'postgresql://postgres:Zy818989@pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com:5432/ran_field?sslmode=disable&connect_timeout=10';

(async () => {
  const sql = postgres(connectionString, {
    max: 1,
    ssl: false,
    connect_timeout: 10,
  });

  try {
    // 检查当前 search_path
    console.log('当前 search_path:');
    const searchPath = await sql`SHOW search_path`;
    console.log(searchPath);

    // 检查 activities 表的所有列
    console.log('\nactivities 表的列:');
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'activities' AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    console.log(columns);

    // 尝试查询 activities 表
    console.log('\n查询 activities 表（第一条记录）:');
    const result = await sql`SELECT * FROM activities LIMIT 1`;
    console.log('列名:', Object.keys(result[0]));

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await sql.end();
  }
})();
