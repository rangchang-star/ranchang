import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';

// 从 DATABASE_URL 解析连接参数
function parseDatabaseUrl(connectionString: string) {
  const urlMatch = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!urlMatch) {
    throw new Error('DATABASE_URL 格式错误');
  }
  const [, user, password, host, port, database] = urlMatch;
  return { user, password, host, port: parseInt(port), database };
}

// GET - 获取管理员详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const { id } = await params;

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
      const dbUsers = await pgClient.query(`
        SELECT * FROM users WHERE id = $1
      `, [parseInt(id, 10)]);

      if (dbUsers.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: '管理员不存在',
        }, { status: 404 });
      }

      const user = dbUsers.rows[0];

      if (user.role !== 'admin') {
        return NextResponse.json({
          success: false,
          error: '该用户不是管理员',
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        data: user,
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('获取管理员详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取管理员详情失败: ' + error.message
    }, { status: 500 });
  }
}

// PUT - 修改管理员信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const { id } = await params;
    const body = await request.json();

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
      if (body.name || body.phone || body.password) {
        const result = await pgClient.query(`
          UPDATE users
          SET name = COALESCE($1, name),
              phone = COALESCE($2, phone),
              password = COALESCE($3, password),
              updated_at = $4
          WHERE id = $5
          RETURNING *
        `, [
          body.name || null,
          body.phone || null,
          body.password || null,
          new Date(),
          parseInt(id, 10),
        ]);

        if (result.rows.length === 0) {
          return NextResponse.json({
            success: false,
            error: '管理员不存在',
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: result.rows[0],
          message: '管理员信息修改成功',
        });
      }

      return NextResponse.json({
        success: true,
        message: '没有需要修改的信息',
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('修改管理员信息失败:', error);
    return NextResponse.json({
      success: false,
      error: '修改管理员信息失败: ' + error.message
    }, { status: 500 });
  }
}

// DELETE - 删除管理员（降级为普通用户）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const { id } = await params;

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
      const result = await pgClient.query(`
        UPDATE users
        SET role = 'user',
            updated_at = $1
        WHERE id = $2
        RETURNING *
      `, [new Date(), parseInt(id, 10)]);

      if (result.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: '管理员不存在',
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: '管理员已降级为普通用户',
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('删除管理员失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除管理员失败: ' + error.message
    }, { status: 500 });
  }
}
