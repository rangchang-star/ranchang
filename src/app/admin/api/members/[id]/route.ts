import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const memberList = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (memberList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在',
        },
        { status: 404 }
      );
    }

    const member = memberList[0];

    const data = {
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
      email: member.email || '',
      company: member.company || '',
      position: member.position || '',
      bio: '',
      need: member.need || '',
      tagStamp: member.tag_stamp || '',
      abilityTags: member.ability_tags ? (Array.isArray(member.ability_tags) ? member.ability_tags : []) : [],
      hardcoreTags: member.hardcore_tags ? (Array.isArray(member.hardcore_tags) ? member.hardcore_tags : []) : [],
      resourceTags: member.resource_tags ? (Array.isArray(member.resource_tags) ? member.resource_tags : []) : [],
      gender: member.gender || '',
      companyScale: member.company_scale || '',
      connectionType: member.connection_type || '',
      role: 'member',
      connectionCount: 0,
      activityCount: 0,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
      experiences: member.experience ? (Array.isArray(member.experience) ? member.experience : []) : [],
      achievements: member.achievement ? (Array.isArray(member.achievement) ? member.achievement : []) : [],
    };

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取用户详情失败',
      },
      { status: 500 }
    );
  }
}

// PUT - 更新用户
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 字段映射：前端 camelCase -> 数据库 snake_case
    const updateData: any = {
      name: body.name,
      age: body.age,
      // 头像字段映射：avatarKey -> avatar（向后兼容旧数据）
      avatar: body.avatarKey || body.avatar,
      connection_type: body.connection_type,
      industry: body.industry,
      need: body.need,
      hardcore_tags: body.hardcore_tags,
      resource_tags: body.resource_tags,
      phone: body.phone,
      email: body.email,
      company: body.company,
      position: body.position,
      is_featured: body.is_featured,
      updated_at: new Date(),
    };

    // 移除 undefined 值
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('📝 [API] 更新用户数据:', { id, updateData }); // 调试日志

    const updated = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在',
        },
        { status: 404 }
      );
    }

    console.log('✅ [API] 更新成功:', updated[0]); // 调试日志

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('❌ [API] 更新用户失败:', error);
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
