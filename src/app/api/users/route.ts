import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const connectionString = process.env.DATABASE_URL || '';

    // 直接创建数据库连接（使用 pg 库）
    const { default: pg } = await import('pg');
    const pgClient = new pg.Client({
      host: 'pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com',
      port: 5432,
      database: 'ran_field',
      user: 'postgres',
      password: 'Zy818989',
      ssl: false,
    });

    await pgClient.connect();

    console.log('[DEBUG] Connected to database');

    // 查询当前数据库和 schema
    const currentInfo = await pgClient.query('SELECT current_database(), current_schema();');
    console.log('[DEBUG] Current database and schema:', currentInfo.rows);

    // 查询 users 表
    const tables = await pgClient.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name = 'users';");
    console.log('[DEBUG] Users tables:', tables.rows);

    // 测试查询
    const testQuery = await pgClient.query('SELECT COUNT(*) as count FROM public.users;');
    console.log('[DEBUG] Test query result:', testQuery.rows);

    // 查询所有字段，找出存在的字段
    const allFields = await pgClient.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      ORDER BY ordinal_position;
    `);
    console.log('[DEBUG] Available fields:', allFields.rows);

    // 查询用户列表（只使用存在的字段）
    const sqlQuery = 'SELECT * FROM public.users ORDER BY created_at DESC LIMIT 10';
    console.log('[DEBUG] SQL Query:', sqlQuery);
    const result = await pgClient.query(sqlQuery);

    // 关闭连接
    await pgClient.end();

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户列表失败: ' + error.message
    }, { status: 500 });
  }
}

// POST - 创建用户（注册）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 前台使用配置的数据库
    const connectionString = process.env.DATABASE_URL || '';

    if (!connectionString || connectionString === '') {
      return NextResponse.json({
        success: false,
        error: '未配置数据库连接'
      }, { status: 500 });
    }

    // 验证必填字段
    if (!body.phone || !body.name) {
      return NextResponse.json({
        success: false,
        error: '手机号和姓名不能为空'
      }, { status: 400 });
    }

    // 创建临时的数据库连接
    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { users } = await import('@/storage/database/supabase/schema');

    // 使用 ran_field 数据库
    const client = postgres(connectionString, {
      max: 10,
      ssl: false,
      connection: {
        application_name: 'ran-field-app-frontend',
      },
    });

    const frontendDb = drizzle(client);

    const result = await frontendDb.insert(users).values({
      id: randomUUID(),
      phone: body.phone,
      name: body.name,
      avatar: body.avatar || null,
      age: body.age || null,
      email: body.email || null,
      connection_type: body.connection_type || null,
      industry: body.industry || null,
      need: body.need || null,
      ability_tags: body.ability_tags || [],
      resource_tags: body.resource_tags || [],
      level: body.level || null,
      company: body.company || null,
      position: body.position || null,
      status: body.status || 'active',
      is_featured: body.is_featured || false,
      join_date: new Date(),
      last_login: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    await client.end();

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error: any) {
    console.error('创建用户失败:', error);

    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: '该手机号已被注册'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: '创建用户失败: ' + error.message
    }, { status: 500 });
  }
}
