import { NextRequest, NextResponse } from 'next/server';

// 从 DATABASE_URL 解析连接参数
function parseDatabaseUrl(connectionString: string) {
  const urlMatch = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!urlMatch) {
    throw new Error('DATABASE_URL 格式错误');
  }
  const [, user, password, host, port, database] = urlMatch;
  return { user, password, host, port: parseInt(port), database };
}

// 将扁平的键值对转换为嵌套对象
function flattenToNested(flatObj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in flatObj) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        // 最后一级，设置值
        current[part] = flatObj[key];
      } else {
        // 中间级，创建对象
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    }
  }

  return result;
}

// GET - 获取所有设置
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
    const dbConfig = parseDatabaseUrl(connectionString);

    // 创建数据库连接（使用 pg 库）
    const { default: pg } = await import('pg');
    const pgClient = new pg.Client({
      ...dbConfig,
      ssl: false,
    });

    await pgClient.connect();

    // 查询设置
    const sqlQuery = 'SELECT * FROM public.settings ORDER BY id';
    const result = await pgClient.query(sqlQuery);

    // 关闭连接
    await pgClient.end();

    // 转换为键值对格式
    const settingsMap = result.rows.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    // 将扁平的键值对转换为嵌套结构
    const nestedSettings = flattenToNested(settingsMap);

    return NextResponse.json({
      success: true,
      data: nestedSettings,
    });
  } catch (error: any) {
    console.error('获取设置失败:', error);
    return NextResponse.json(
      { success: false, error: '获取设置失败: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - 更新设置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 检查数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '未配置数据库连接'
      }, { status: 500 });
    }

    const connectionString = process.env.DATABASE_URL || '';
    const dbConfig = parseDatabaseUrl(connectionString);

    // 创建数据库连接（使用 pg 库）
    const { default: pg } = await import('pg');
    const pgClient = new pg.Client({
      ...dbConfig,
      ssl: false,
    });

    await pgClient.connect();

    try {
      // 更新设置
      const insertQuery = `
        INSERT INTO settings (key, value, updated_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (key)
        DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = EXCLUDED.updated_at
        RETURNING *
      `;

      const values = [
        body.key,
        JSON.stringify(body.value),
        new Date(),
      ];

      const result = await pgClient.query(insertQuery, values);

      return NextResponse.json({
        success: true,
        message: '设置更新成功',
        data: result.rows[0]
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('更新设置失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新设置失败: ' + error.message
    }, { status: 500 });
  }
}
