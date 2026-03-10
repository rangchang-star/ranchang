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

// GET - 获取报名列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const activityId = searchParams.get('activityId');
    const visitId = searchParams.get('visitId');

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
      let result;

      // 根据查询参数选择查询哪个表
      if (activityId) {
        // 查询活动报名记录
        let sqlQuery = `
          SELECT
            id, user_id as "userId", activity_id as "activityId",
            'activity' as type, status,
            registered_at as "registeredAt", reviewed_at as "reviewedAt", note
          FROM activity_registrations
          WHERE activity_id = $1
        `;
        const params: any[] = [activityId];

        if (userId) {
          sqlQuery += ' AND user_id = $2';
          params.push(userId);
        }

        sqlQuery += ' ORDER BY registered_at DESC';

        const queryResult = await pgClient.query(sqlQuery, params);
        result = queryResult.rows;
      } else if (visitId) {
        // 查询探访记录
        let sqlQuery = `
          SELECT
            id, user_id as "userId", visit_id as "visitId",
            'visit' as type, status,
            registered_at as "registeredAt", completed_at as "completedAt"
          FROM visit_records
          WHERE visit_id = $1
        `;
        const params: any[] = [visitId];

        if (userId) {
          sqlQuery += ' AND user_id = $2';
          params.push(userId);
        }

        sqlQuery += ' ORDER BY registered_at DESC';

        const queryResult = await pgClient.query(sqlQuery, params);
        result = queryResult.rows;
      } else if (userId) {
        // 查询用户的所有报名记录（活动和探访）
        const activityResults = await pgClient.query(`
          SELECT
            id, user_id as "userId", activity_id as "activityId",
            'activity' as type, status,
            registered_at as "registeredAt", reviewed_at as "reviewedAt", note
          FROM activity_registrations
          WHERE user_id = $1
          ORDER BY registered_at DESC
        `, [userId]);

        const visitResults = await pgClient.query(`
          SELECT
            id, user_id as "userId", visit_id as "visitId",
            'visit' as type, status,
            registered_at as "registeredAt", completed_at as "completedAt"
          FROM visit_records
          WHERE user_id = $1
          ORDER BY registered_at DESC
        `, [userId]);

        result = [...activityResults.rows, ...visitResults.rows].sort((a: any, b: any) => {
          const aTime = a.registeredAt ? new Date(a.registeredAt).getTime() : 0;
          const bTime = b.registeredAt ? new Date(b.registeredAt).getTime() : 0;
          return bTime - aTime;
        });
      } else {
        return NextResponse.json({
          success: false,
          error: '请提供至少一个查询参数'
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        data: result
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error) {
    console.error('获取报名列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取报名列表失败'
    }, { status: 500 });
  }
}

// POST - 创建报名记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activityId, visitId } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: '用户ID不能为空'
      }, { status: 400 });
    }

    if (!activityId && !visitId) {
      return NextResponse.json({
        success: false,
        error: '活动ID或探访ID不能为空'
      }, { status: 400 });
    }

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
      let result;

      // 根据类型创建报名记录
      if (activityId) {
        // 检查是否已经报名
        const existingRegistration = await pgClient.query(`
          SELECT id FROM activity_registrations
          WHERE user_id = $1 AND activity_id = $2 AND status = 'registered'
        `, [userId, activityId]);

        if (existingRegistration.rows.length > 0) {
          return NextResponse.json({
            success: false,
            error: '您已经报名过此活动'
          }, { status: 400 });
        }

        // 创建活动报名记录
        const insertResult = await pgClient.query(`
          INSERT INTO activity_registrations (user_id, activity_id, status, registered_at)
          VALUES ($1, $2, 'registered', $3)
          RETURNING *
        `, [userId, activityId, new Date()]);

        result = insertResult.rows[0];
      } else {
        // 检查是否已经报名
        const existingRegistration = await pgClient.query(`
          SELECT id FROM visit_records
          WHERE user_id = $1 AND visit_id = $2 AND status = 'registered'
        `, [userId, visitId]);

        if (existingRegistration.rows.length > 0) {
          return NextResponse.json({
            success: false,
            error: '您已经报名过此探访'
          }, { status: 400 });
        }

        // 创建探访记录
        const insertResult = await pgClient.query(`
          INSERT INTO visit_records (user_id, visit_id, status, registered_at)
          VALUES ($1, $2, 'registered', $3)
          RETURNING *
        `, [userId, visitId, new Date()]);

        result = insertResult.rows[0];
      }

      return NextResponse.json({
        success: true,
        data: result,
        message: '报名成功'
      });
    } finally {
      // 关闭连接
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('创建报名失败:', error);

    return NextResponse.json({
      success: false,
      error: '创建报名失败'
    }, { status: 500 });
  }
}
