import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取成员详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const users = await db
      .select()
      .from(appUsers)
      .where(eq(appUsers.id, id));

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: '成员不存在' },
        { status: 404 }
      );
    }

    const user = users[0];

    // 解析能力标签
    let abilityTags: string[] = [];
    try {
      abilityTags = typeof user.abilityTags === 'string' 
        ? JSON.parse(user.abilityTags) 
        : (user.abilityTags || []);
    } catch {
      abilityTags = [];
    }

    // 解析硬核标签
    let hardcoreTags: string[] = [];
    try {
      hardcoreTags = typeof user.hardcoreTags === 'string' 
        ? JSON.parse(user.hardcoreTags) 
        : (user.hardcoreTags || []);
    } catch {
      hardcoreTags = [];
    }

    // 解析资源标签
    let resourceTags: string[] = [];
    try {
      resourceTags = typeof user.resourceTags === 'string' 
        ? JSON.parse(user.resourceTags) 
        : (user.resourceTags || []);
    } catch {
      resourceTags = [];
    }

    // 合并所有标签
    const tags = [...abilityTags, ...hardcoreTags, ...resourceTags];

    // 解析硬核经历
    let experiences: Array<{ company: string; position: string; duration: string }> = [];
    try {
      experiences = typeof user.experience === 'string' 
        ? JSON.parse(user.experience) 
        : (user.experience || []);
    } catch {
      experiences = [];
    }

    // 解析主要成就
    let achievements: string[] = [];
    try {
      achievements = typeof user.achievement === 'string' 
        ? JSON.parse(user.achievement) 
        : (user.achievement || []);
    } catch {
      achievements = [];
    }

    // 格式化加入日期
    const joinDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      : '';

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        name: user.name,
        age: user.age || 0,
        avatar: user.avatar,
        bio: user.bio,
        gender: user.gender,
        email: user.email,
        industry: user.industry,
        company: user.company,
        companyScale: user.companyScale,
        position: user.position,
        level: user.level,
        need: user.need,
        tagStamp: user.tagStamp,
        abilityTags,
        hardcoreTags,
        resourceTags,
        tags,
        adminTags: tags, // 使用合并后的标签作为后台标签
        experiences,
        achievements,
        experience: user.experience,
        achievement: user.achievement,
        declaration: user.declaration,
        joinDate,
        status: user.status,
        isFeatured: user.isFeatured || false,
        role: user.status === 'active' ? '会员' : '非会员',
        connectionCount: 0, // TODO: 从关联表统计
        activityCount: 0, // TODO: 从关联表统计
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('获取成员详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取成员详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新成员信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(appUsers)
      .set({
        nickname: body.nickname,
        bio: body.bio,
        avatar: body.avatar,
        age: body.age,
        gender: body.gender,
        city: body.city,
        hardcoreTags: body.hardcoreTags,
        tags: body.tags,
        need: body.need,
        isTrusted: body.isTrusted,
        isFeatured: body.isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(appUsers.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: '成员不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新成员信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新成员信息失败' },
      { status: 500 }
    );
  }
}
