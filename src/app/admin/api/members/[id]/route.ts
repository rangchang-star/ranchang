import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let memberData;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const dbUsers = await db.select().from(users).where(eq(users.id, id));

        if (dbUsers.length === 0) {
          return NextResponse.json({
            success: false,
            error: '用户不存在'
          }, { status: 404 });
        }

        const user = dbUsers[0];

        // 转换为前端需要的格式
        memberData = {
          id: user.id.toString(),
          // 基本信息
          name: user.nickname || user.name,
          age: user.age,
          avatar: user.avatar,
          connectionType: user.tagStamp || 'personLookingForJob',
          industry: user.industry,
          need: user.need,
          hardcoreTags: user.hardcoreTags || [],
          resourceTags: user.resourceTags || [],

          // 后台标签
          adminTags: user.tags || ['普通'],

          // 公司信息
          phone: user.phone,
          email: '', // mock数据中没有email字段
          company: user.company,
          position: user.position,
          faith: '', // mock数据中没有faith字段

          // 其他信息
          level: user.isTrusted ? '活跃会员' : '种子会员',
          joinDate: new Date(user.createdAt).toISOString().split('T')[0],
          status: user.status,
          isFeatured: user.isTrusted,
          role: user.role,
          bio: user.bio,
          connectionCount: user.connectionCount || 0,
          activityCount: user.activityCount || 0,

          // 高燃宣告（暂时为空）
          declaration: null,

          // 量表评估（暂时为空）
          assessments: [],

          // 探访记录（暂时为空）
          visitRecords: [],

          // 参与活动（暂时为空）
          activities: [],
        };
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
        // 降级到模拟数据
        const user = MockDatabase.getUserById(parseInt(id));
        if (!user) {
          return NextResponse.json({
            success: false,
            error: '用户不存在'
          }, { status: 404 });
        }
        memberData = {
          id: user.id.toString(),
          name: user.nickname || user.name,
          age: user.age,
          avatar: user.avatar,
          connectionType: user.tagStamp || 'personLookingForJob',
          industry: user.industry,
          need: user.need,
          hardcoreTags: user.hardcoreTags || [],
          resourceTags: user.resourceTags || [],
          adminTags: user.tags || ['普通'],
          phone: user.phone,
          email: '',
          company: user.company,
          position: user.position,
          faith: '',
          level: user.isTrusted ? '活跃会员' : '种子会员',
          joinDate: new Date(user.createdAt).toISOString().split('T')[0],
          status: user.status,
          isFeatured: user.isFeatured,
          role: user.role,
          bio: user.bio,
          connectionCount: user.connectionCount || 0,
          activityCount: user.activityCount || 0,
          declaration: null,
          assessments: [],
          visitRecords: [],
          activities: [],
        };
      }
    } else {
      // 使用模拟数据
      const user = MockDatabase.getUserById(parseInt(id));
      if (!user) {
        return NextResponse.json({
          success: false,
          error: '用户不存在'
        }, { status: 404 });
      }
      memberData = {
        id: user.id.toString(),
        name: user.nickname || user.name,
        age: user.age,
        avatar: user.avatar,
        connectionType: user.tagStamp || 'personLookingForJob',
        industry: user.industry,
        need: user.need,
        hardcoreTags: user.hardcoreTags || [],
        resourceTags: user.resourceTags || [],
        adminTags: user.tags || ['普通'],
        phone: user.phone,
        email: '',
        company: user.company,
        position: user.position,
        faith: '',
        level: user.isTrusted ? '活跃会员' : '种子会员',
        joinDate: new Date(user.createdAt).toISOString().split('T')[0],
        status: user.status,
        isFeatured: user.isFeatured,
        role: user.role,
        bio: user.bio,
        connectionCount: user.connectionCount || 0,
        activityCount: user.activityCount || 0,
        declaration: null,
        assessments: [],
        visitRecords: [],
        activities: [],
      };
    }

    return NextResponse.json({
      success: true,
      data: memberData,
    });
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
    let updatedUser;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const result = await db.update(users)
          .set({
            name: body.name,
            nickname: body.name,
            age: body.age,
            industry: body.industry,
            company: body.company,
            position: body.position,
            bio: body.bio,
            need: body.need,
            tags: body.adminTags,
            hardcoreTags: body.hardcoreTags,
            resourceTags: body.resourceTags,
            tagStamp: body.connectionType,
            isTrusted: body.isFeatured,
            avatar: body.avatar,
            updatedAt: new Date(),
          })
          .where(eq(users.id, parseInt(id)))
          .returning();

        if (result.length === 0) {
          return NextResponse.json({
            success: false,
            error: '用户不存在或更新失败'
          }, { status: 404 });
        }

        updatedUser = result[0];
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅更新模拟数据:', dbError.message);
        // 降级到模拟数据
        updatedUser = MockDatabase.updateUser(parseInt(id), {
          name: body.name,
          nickname: body.name,
          age: body.age,
          industry: body.industry,
          company: body.company,
          position: body.position,
          bio: body.bio,
          need: body.need,
          tags: body.adminTags,
          hardcoreTags: body.hardcoreTags,
          resourceTags: body.resourceTags,
          tagStamp: body.connectionType,
          isFeatured: body.isFeatured,
          avatar: body.avatar,
        });
      }
    } else {
      // 使用模拟数据
      updatedUser = MockDatabase.updateUser(parseInt(id), {
        name: body.name,
        nickname: body.name,
        age: body.age,
        industry: body.industry,
        company: body.company,
        position: body.position,
        bio: body.bio,
        need: body.need,
        tags: body.adminTags,
        hardcoreTags: body.hardcoreTags,
        resourceTags: body.resourceTags,
        tagStamp: body.connectionType,
        isFeatured: body.isFeatured,
        avatar: body.avatar,
      });
    }

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: '用户不存在或更新失败'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '会员信息更新成功',
      data: updatedUser,
    });
  } catch (error) {
    console.error('更新会员信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新会员信息失败' },
      { status: 500 }
    );
  }
}
