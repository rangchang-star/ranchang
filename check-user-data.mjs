import postgres from 'postgres';

const connectionString = 'postgresql://postgres:Zy818989@pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com:5432/ran_field?sslmode=disable';

async function test() {
  const client = postgres(connectionString, { max: 1 });

  try {
    const users = await client`
      SELECT id, name, experience, achievement
      FROM public.app_users
      WHERE id = 'e428646d-7556-453e-8699-84ce8d154836'
    `;

    console.log('用户数据:');
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('错误:', err);
  } finally {
    await client.end();
  }
}

test();
