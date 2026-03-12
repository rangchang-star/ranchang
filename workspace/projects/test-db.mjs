import postgres from 'postgres';

const connectionString = 'postgresql://postgres:Zy818989@pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com:5432/ran_field?sslmode=disable';

async function test() {
  const client = postgres(connectionString, { max: 1 });

  try {
    // 检查当前数据库
    const dbResult = await client`SELECT current_database()`;
    console.log('当前数据库:', dbResult[0].current_database);

    // 检查 app_users 表的字段
    const columnsResult = await client`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'app_users'
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    console.log('\napp_users 表字段:');
    for (const col of columnsResult) {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    }

    // 检查是否有 experience 和 achievement 字段
    const hasExperience = columnsResult.some(c => c.column_name === 'experience');
    const hasAchievement = columnsResult.some(c => c.column_name === 'achievement');
    console.log(`\nexperience 字段存在: ${hasExperience}`);
    console.log(`achievement 字段存在: ${hasAchievement}`);

    // 尝试查询一个用户
    const userResult = await client`
      SELECT id, name, experience, achievement
      FROM public.app_users
      WHERE id = 'e428646d-7556-453e-8699-84ce8d154836'
      LIMIT 1
    `;
    console.log('\n用户数据:', JSON.stringify(userResult, null, 2));

    // 尝试更新用户
    try {
      const updateResult = await client`
        UPDATE public.app_users
        SET name = '大鱼更新',
            need = '测试数据更新',
            experience = '[{"company":"更新公司","position":"更新职位","duration":"2021-2024"}]'::jsonb,
            achievement = '["新成就1","新成就2"]'::jsonb
        WHERE id = 'e428646d-7556-453e-8699-84ce8d154836'
        RETURNING id, name, experience, achievement
      `;
      console.log('\n更新结果:', JSON.stringify(updateResult, null, 2));
    } catch (err) {
      console.log('\n更新失败:', err.message);
    }

  } catch (err) {
    console.error('错误:', err);
  } finally {
    await client.end();
  }
}

test();
