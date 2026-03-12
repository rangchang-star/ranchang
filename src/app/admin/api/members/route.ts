import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { desc, like, eq, and, or } from 'drizzle-orm';

// GET - 获取会员列表（后台）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let query = db.select().from(appUsers).orderBy(desc(appUsers.createdAt));

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(appUsers.nickname, `%${search}%`),
          like(appUsers.name, `%${search}%`),
          like(appUsers.phone, `%${search}%`)
        )
      );
    }
    if (status && status !== 'all') {
      conditions.push(eq(appUsers.status, status as any));
    }

    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const userList = await query;

    const data = userList.map((user: any) => {
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

      // 格式化加入日期
      const joinDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : '';

      return {
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
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取会员列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取会员列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建会员（后台）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newUser = await db
      .insert(appUsers)
      .values({
        id: crypto.randomUUID(),
        phone: body.phone,
        nickname: body.nickname,
        name: body.name,
        avatar: body.avatar,
        bio: body.bio,
        industry: body.industry,
        company: body.company,
        position: body.position,
        level: body.level || 1,
        status: body.status || 'active',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newUser[0],
    });
  } catch (error) {
    console.error('创建会员失败:', error);
    return NextResponse.json(
      { success: false, error: '创建会员失败' },
      { status: 500 }
    );
  }
}
