import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq, desc, like } from 'drizzle-orm';

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let query = db.select().from(users);

    if (search) {
      query = query.where(like((users as any).name, `%${search}%`));
    }

    if (status) {
      query = query.where(eq((users as any).status, status));
    }

    const memberList = await query.orderBy(desc((users as any).created_at));

    // 转换数据格式
    const data = memberList.map((member: any) => ({
      id: member.id,
      name: member.name,
      age: member.age,
      avatar: member.avatar || '',
      level: member.level || '',
      tags: [],
      industry: member.industry || '',
      joinDate: member.join_date || member.created_at,
      status: member.status || 'active',
      isFeatured: member.is_featured || false,
      phone: member.phone || '',
      company: member.company || '',
      position: member.position || '',
      bio: '',
      need: member.need || '',
      tagStamp: member.tag_stamp || '',
      hardcoreTags: member.hardcore_tags ? (Array.isArray(member.hardcore_tags) ? member.hardcore_tags : []) : [],
      resourceTags: member.resource_tags ? (Array.isArray(member.resource_tags) ? member.resource_tags : []) : [],
      role: 'member',
      connectionCount: 0,
      activityCount: 0,
    }));

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取用户列表失败',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT - 更新用户
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少用户ID',
        },
        { status: 400 }
      );
    }

    // 将 camelCase 转换为 snake_case
    const snakeCaseData: any = {};
    const fieldMapping: Record<string, string> = {
      avatar: 'avatar',
      avatarKey: 'avatar_key', // 新增：支持头像fileKey
      name: 'name',
      age: 'age',
      phone: 'phone',
      email: 'email',
      company: 'company',
      position: 'position',
      industry: 'industry',
      need: 'need',
      level: 'level',
      status: 'status',
      isFeatured: 'is_featured',
      tagStamp: 'tag_stamp',
      hardcoreTags: 'hardcore_tags',
      resourceTags: 'resource_tags',
      experience: 'experience',
      achievement: 'achievement',
      gender: 'gender',
      companyScale: 'company_scale',
    };

    for (const [camelKey, value] of Object.entries(updateData)) {
      const snakeKey = fieldMapping[camelKey] || camelKey;
      snakeCaseData[snakeKey] = value;
    }

    // 只更新数据库中存在的字段
    const allowedFields = [
      'avatar', 'avatar_key', 'name', 'age', 'phone', 'email', 'company', 'position',
      'industry', 'need', 'level', 'status', 'is_featured', 'tag_stamp',
      'hardcore_tags', 'resource_tags', 'experience', 'achievement',
      'gender', 'company_scale'
    ];

    const filteredData: any = {};
    for (const field of allowedFields) {
      if (snakeCaseData[field] !== undefined) {
        filteredData[field] = snakeCaseData[field];
      }
    }

    const updated = await db
      .update(users)
      .set({
        ...filteredData,
        updated_at: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新用户失败',
      },
      { status: 500 }
    );
  }
}

// DELETE - 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少用户ID',
        },
        { status: 400 }
      );
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除用户失败',
      },
      { status: 500 }
    );
  }
}
