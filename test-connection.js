const postgres = require('./node_modules/postgres');

const connectionString = 'postgresql://postgres:Zy818989@pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com:5432/ran_field?sslmode=disable&connect_timeout=10';

(async () => {
  const sql = postgres(connectionString, {
    max: 1,
    ssl: false,
    connect_timeout: 10,
  });

  try {
    // 手动插入一些测试数据
    console.log('插入测试数据:');
    await sql`
      INSERT INTO app_users (id, name, age, gender, company, company_scale, position, email, created_at)
      VALUES 
        ('test-id-1', '测试用户1', 35, '男', '测试公司', '100-500人', '产品经理', 'test1@example.com', NOW()),
        ('test-id-2', '测试用户2', 40, '女', '科技公司', '500-1000人', '技术总监', 'test2@example.com', NOW())
    `;
    console.log('插入成功');

    // 查询数据
    console.log('\n查询 app_users 的数据:');
    const data = await sql`SELECT id, name, gender FROM app_users`;
    console.log('数据:', data);

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await sql.end();
  }
})();
