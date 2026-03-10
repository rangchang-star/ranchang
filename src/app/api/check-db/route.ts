import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const connectionString = process.env.DATABASE_URL || '';
    if (!connectionString) {
      return NextResponse.json({ error: 'DATABASE_URL 未设置' }, { status: 500 });
    }

    const { default: pg } = await import('pg');
    const client = new pg.Client({ connectionString, ssl: false });

    await client.connect();

    try {
      // 查询所有表
      const tables = await client.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name
      `);

      // 查询 users 表结构
      const usersData: any = { exists: false, sample: [] };
      if (tables.rows.some((r: any) => r.table_name === 'users')) {
        const users = await client.query('SELECT id, phone, name FROM users LIMIT 5');
        usersData.exists = true;
        usersData.sample = users.rows;
      }

      // 查询 activities 表结构
      const activitiesData: any = { exists: false, sample: [] };
      if (tables.rows.some((r: any) => r.table_name === 'activities')) {
        const activities = await client.query('SELECT id, title FROM activities LIMIT 5');
        activitiesData.exists = true;
        activitiesData.sample = activities.rows;
      }

      // 检查 activity_registrations 表
      const arExists = tables.rows.some((r: any) => r.table_name === 'activity_registrations');
      const arData: any = { exists: arExists, sample: [] };
      if (arExists) {
        const ar = await client.query('SELECT * FROM activity_registrations LIMIT 5');
        arData.sample = ar.rows;
      }

      return NextResponse.json({
        success: true,
        database: connectionString.split('/').pop(),
        tables: tables.rows.map((r: any) => r.table_name),
        users: usersData,
        activities: activitiesData,
        activity_registrations: arData,
      });
    } finally {
      await client.end();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
