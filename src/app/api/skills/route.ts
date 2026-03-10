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

// GET - 获取技能树数据
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

    try {
      // 检查是否有 skills 表
      const tableCheck = await pgClient.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'skills'
      `);

      let skills: any[] = [];

      if (tableCheck.rows.length > 0) {
        // 如果有 skills 表，从数据库获取
        const result = await pgClient.query('SELECT * FROM public.skills ORDER BY id');
        skills = result.rows.map((row: any) => ({
          id: row.id.toString(),
          name: row.name,
          size: row.size,
          color: row.color,
          borderColor: row.border_color,
          textColor: row.text_color,
          x: row.x,
          y: row.y,
        }));
      } else {
        // 如果没有 skills 表，返回默认技能树数据
        skills = [
          {
            id: 's1',
            name: 'AI技术',
            size: 80,
            color: 'bg-blue-400/50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-800',
            x: 25,
            y: 30
          },
          {
            id: 's2',
            name: '战略规划',
            size: 75,
            color: 'bg-purple-400/50',
            borderColor: 'border-purple-500',
            textColor: 'text-purple-800',
            x: 65,
            y: 35
          },
          {
            id: 's3',
            name: '商业模式',
            size: 85,
            color: 'bg-green-400/50',
            borderColor: 'border-green-500',
            textColor: 'text-green-800',
            x: 45,
            y: 60
          },
          {
            id: 's4',
            name: '组织管理',
            size: 60,
            color: 'bg-yellow-400/50',
            borderColor: 'border-yellow-500',
            textColor: 'text-yellow-800',
            x: 20,
            y: 65
          },
          {
            id: 's5',
            name: '市场营销',
            size: 65,
            color: 'bg-red-400/50',
            borderColor: 'border-red-500',
            textColor: 'text-red-800',
            x: 75,
            y: 65
          },
          {
            id: 's6',
            name: '财务分析',
            size: 55,
            color: 'bg-cyan-400/50',
            borderColor: 'border-cyan-500',
            textColor: 'text-cyan-800',
            x: 35,
            y: 80
          },
          {
            id: 's7',
            name: '产品创新',
            size: 58,
            color: 'bg-pink-400/50',
            borderColor: 'border-pink-500',
            textColor: 'text-pink-800',
            x: 60,
            y: 85
          }
        ];
      }

      return NextResponse.json({
        success: true,
        data: skills
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('获取技能树失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取技能树失败: ' + error.message
    }, { status: 500 });
  }
}
