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

    // 检查 public schema 中的所有表
    console.log('\npublic schema 中的所有表:');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    console.log('表列表:', tables.map(t => t.table_name));

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await sql.end();
  }
})();
