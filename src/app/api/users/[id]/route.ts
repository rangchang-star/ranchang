import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 直接创建数据库连接
    const connectionString = process.env.DATABASE_URL || '';
    const postgres = (await import('postgres')).default;

    // 创建单个连接（不使用连接池）
    const client = postgres(connectionString, {
      max: 1,
      ssl: false,
    });

    try {
      // 使用原始 SQL 查询
      const result = await client`
        SELECT
          id, name, nickname, avatar, age, phone,
          company, position, industry, bio, need,
          hardcore_tags, resource_tags, tag_stamp,
          is_trusted, is_featured,
          connection_count, activity_count,
          role, status,
          created_at, updated_at
        FROM users
        WHERE id::text = ${id}
        LIMIT 1
      `;

      // 立即关闭连接
      await client.end();

      if (result.length === 0) {
        return NextResponse.json({
          success: false,
          error: '用户不存在'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result[0]
      });
    } catch (queryError: any) {
      await client.end();
      console.error('GET API - Query error:', queryError.message);
      return NextResponse.json({
        success: false,
        error: '查询用户信息失败: ' + queryError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户详情失败: ' + error.message
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    // 直接创建数据库连接
    const connectionString = process.env.DATABASE_URL || '';
    const postgres = (await import('postgres')).default;

    // 创建单个连接（不使用连接池）
    const client = postgres(connectionString, {
      max: 1,
      ssl: false,
    });

    try {
      // 构建更新 SQL
      const updateFields = [];
      const updateValues = [];

      if (body.name !== undefined) {
        updateFields.push('name = $1');
        updateValues.push(body.name);
      }
      if (body.nickname !== undefined) {
        updateFields.push('nickname = $' + (updateValues.length + 1));
        updateValues.push(body.nickname);
      }
      if (body.avatar !== undefined) {
        updateFields.push('avatar = $' + (updateValues.length + 1));
        updateValues.push(body.avatar);
      }
      if (body.age !== undefined) {
        updateFields.push('age = $' + (updateValues.length + 1));
        updateValues.push(body.age);
      }
      if (body.company !== undefined) {
        updateFields.push('company = $' + (updateValues.length + 1));
        updateValues.push(body.company);
      }
      if (body.position !== undefined) {
        updateFields.push('position = $' + (updateValues.length + 1));
        updateValues.push(body.position);
      }
      if (body.industry !== undefined) {
        updateFields.push('industry = $' + (updateValues.length + 1));
        updateValues.push(body.industry);
      }
      if (body.need !== undefined) {
        updateFields.push('need = $' + (updateValues.length + 1));
        updateValues.push(body.need);
      }
      if (body.bio !== undefined) {
        updateFields.push('bio = $' + (updateValues.length + 1));
        updateValues.push(body.bio);
      }
      if (body.hardcore_tags !== undefined) {
        updateFields.push('hardcore_tags = $' + (updateValues.length + 1));
        updateValues.push(JSON.stringify(body.hardcore_tags));
      }
      if (body.resource_tags !== undefined) {
        updateFields.push('resource_tags = $' + (updateValues.length + 1));
        updateValues.push(JSON.stringify(body.resource_tags));
      }
      if (body.tag_stamp !== undefined) {
        updateFields.push('tag_stamp = $' + (updateValues.length + 1));
        updateValues.push(body.tag_stamp);
      }

      // 添加 updated_at
      updateFields.push('updated_at = $' + (updateValues.length + 1));
      updateValues.push(new Date());

      // 添加 id 作为最后一个参数
      updateValues.push(id);

      if (updateFields.length === 0) {
        await client.end();
        return NextResponse.json({
          success: false,
          error: '没有提供要更新的字段'
        }, { status: 400 });
      }

      const sql = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE id::text = $${updateValues.length}
        RETURNING id, name, nickname, avatar, age, phone, company, position,
                  industry, bio, need, hardcore_tags, resource_tags, tag_stamp,
                  is_trusted, is_featured, connection_count, activity_count,
                  role, status, created_at, updated_at
      `;

      const result = await client.unsafe(sql, updateValues);
      await client.end();

      if (result.length === 0) {
        return NextResponse.json({
          success: false,
          error: '用户不存在'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: '用户信息更新成功',
        data: result[0]
      });
    } catch (queryError: any) {
      await client.end();
      console.error('PUT API - Query error:', queryError.message);
      return NextResponse.json({
        success: false,
        error: '更新用户信息失败: ' + queryError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('更新用户详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新用户详情失败: ' + error.message
    }, { status: 500 });
  }
}
