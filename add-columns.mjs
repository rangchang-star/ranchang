import postgres from 'postgres';

const connectionString = 'postgresql://postgres:Zy818989@pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com:5432/ran_field?sslmode=disable';

async function addColumns() {
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

    // 检查是否有 experience 和 achievement 字段
    const hasExperience = columnsResult.some(c => c.column_name === 'experience');
    const hasAchievement = columnsResult.some(c => c.column_name === 'achievement');

    console.log(`\nexperience 字段存在: ${hasExperience}`);
    console.log(`achievement 字段存在: ${hasAchievement}`);

    // 添加 experience 字段
    if (!hasExperience) {
      console.log('\n正在添加 experience 字段...');
      await client`ALTER TABLE public.app_users ADD COLUMN experience jsonb DEFAULT '[]'::jsonb`;
      console.log('experience 字段添加成功');
    }

    // 添加 achievement 字段
    if (!hasAchievement) {
      console.log('\n正在添加 achievement 字段...');
      await client`ALTER TABLE public.app_users ADD COLUMN achievement jsonb DEFAULT '[]'::jsonb`;
      console.log('achievement 字段添加成功');
    }

    // 再次检查
    const newColumnsResult = await client`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'app_users'
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;

    const newHasExperience = newColumnsResult.some(c => c.column_name === 'experience');
    const newHasAchievement = newColumnsResult.some(c => c.column_name === 'achievement');

    console.log(`\n添加后检查:`);
    console.log(`experience 字段存在: ${newHasExperience}`);
    console.log(`achievement 字段存在: ${newHasAchievement}`);

  } catch (err) {
    console.error('错误:', err);
  } finally {
    await client.end();
  }
}

addColumns();
