import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    const connectionString = process.env.DATABASE_URL || '';
    if (!connectionString) {
      return NextResponse.json({ error: 'DATABASE_URL 未设置' }, { status: 500 });
    }

    const { default: pg } = await import('pg');
    const client = new pg.Client({ connectionString, ssl: false });

    await client.connect();

    try {
      // 创建 activity_registrations 表
      const result = await client.query(`
        CREATE TABLE IF NOT EXISTS activity_registrations (
            id SERIAL PRIMARY KEY,
            activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            status VARCHAR(50) DEFAULT 'registered',
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reviewed_at TIMESTAMP,
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      return NextResponse.json({
        success: true,
        message: 'activity_registrations 表创建成功',
      });
    } finally {
      await client.end();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
