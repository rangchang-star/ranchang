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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查数据库连接
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
          error: '用户不存在'
        }, { status: 404 });
      }

      const user = dbUsers.rows[0];

      // 转换为前端需要的格式
      const memberData = {
        id: user.id.toString(),
        // 基本信息
        name: user.name,
        age: user.age,
        avatar: user.avatar,
        connectionType: 'personLookingForJob', // 默认值
        industry: user.industry,
        need: user.need,
        hardcoreTags: user.hardcore_tags || [],
        resourceTags: user.resource_tags || [],

        // 后台标签（暂时使用空数组）
        adminTags: [],

        // 公司信息
        phone: user.phone,
        email: '', // 数据库中没有email字段
        company: user.company,
        position: user.position,
        faith: '', // 数据库中没有faith字段

        // 其他信息
        level: user.is_featured ? '活跃会员' : '种子会员',
        joinDate: new Date(user.created_at).toISOString().split('T')[0],
        status: user.status || 'active',
        isFeatured: user.is_featured,
        role: user.role || 'user',
        bio: user.need, // 使用 need 字段代替 bio
        connectionCount: 0,
        activityCount: 0,

        // 高燃宣告（暂时为空）
        declaration: null,

        // 量表评估（暂时为空）
        assessments: [],

        // 探访记录（暂时为空）
        visitRecords: [],

        // 参与活动（暂时为空）
        activities: [],
      };

      return NextResponse.json({
        success: true,
        data: memberData,
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error) {
    console.error('获取会员详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取会员详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 检查数据库连接
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
        SET name = COALESCE($1, name),
            age = COALESCE($2, age),
            industry = COALESCE($3, industry),
            company = COALESCE($4, company),
            position = COALESCE($5, position),
            need = COALESCE($6, need),
            resource_tags = COALESCE($7, resource_tags),
            is_featured = COALESCE($8, is_featured),
            avatar = COALESCE($9, avatar),
            updated_at = $10
        WHERE id = $11
        RETURNING *
      `, [
        body.name,
        body.age,
        body.industry,
        body.company,
        body.position,
        body.need,
        body.resourceTags,
        body.isFeatured,
        body.avatar,
        new Date(),
        parseInt(id, 10),
      ]);

      if (result.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: '用户不存在或更新失败'
        }, { status: 404 });
      }

      const updatedUser = result.rows[0];

      return NextResponse.json({
        success: true,
        message: '会员信息更新成功',
        data: updatedUser,
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error) {
    console.error('更新会员信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新会员信息失败' },
      { status: 500 }
    );
  }
}
