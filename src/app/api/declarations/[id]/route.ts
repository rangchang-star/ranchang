import { NextRequest, NextResponse } from 'next/server';
import { db, declarations, appUsers } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// GET - 获取资源现货详情
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '资源现货ID不能为空' },
        { status: 400 }
      );
    }

    // 查询资源现货详情，并关联用户信息
    const result = await db
      .select({
        id: declarations.id,
        userId: declarations.userId,
        type: declarations.type,
        direction: declarations.direction,
        text: declarations.text,
        summary: declarations.summary,
        audioUrl: declarations.audioUrl,
        views: declarations.views,
        isFeatured: declarations.isFeatured,
        date: declarations.date,
        createdAt: declarations.createdAt,
        updatedAt: declarations.updatedAt,
        userName: appUsers.name,
        userNickname: appUsers.nickname,
        userAvatar: appUsers.avatar,
        userIndustry: appUsers.industry,
        userHardcoreTags: appUsers.hardcoreTags,
        userAge: appUsers.age,
        userPosition: appUsers.position,
        userCompany: appUsers.company,
      })
      .from(declarations)
      .innerJoin(appUsers, eq(declarations.userId, appUsers.id))
      .where(and(
        eq(declarations.id, id),
        eq(appUsers.status, 'active'),
      ));

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: '资源现货不存在' },
        { status: 404 }
      );
    }

    const declaration = result[0];

    // 类型映射到中文
    const typeLabelMap: Record<string, string> = {
      'ability': '能力现货',
      'connection': '人脉现货',
      'resource': '资源现货',
    };

    // 返回数据
    return NextResponse.json({
      success: true,
      data: {
        id: declaration.id,
        userId: declaration.userId,
        type: declaration.type,
        typeLabel: declaration.type ? (typeLabelMap[declaration.type] || '资源现货') : '资源现货',
        direction: declaration.direction,
        title: declaration.text,
        content: declaration.summary,
        audioUrl: declaration.audioUrl,
        views: declaration.views || 0,
        likes: 0, // 暂无点赞数据
        shares: 0, // 暂无分享数据
        isFeatured: declaration.isFeatured,
        date: declaration.date,
        createdAt: declaration.createdAt,
        updatedAt: declaration.updatedAt,
        user: {
          id: declaration.userId,
          name: declaration.userName,
          nickname: declaration.userNickname,
          avatar: declaration.userAvatar,
          industry: declaration.userIndustry,
          hardcoreTags: declaration.userHardcoreTags || [],
          age: declaration.userAge,
          position: declaration.userPosition,
          company: declaration.userCompany,
        },
      },
    });
  } catch (error) {
    console.error('获取资源现货详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取资源现货详情失败' },
      { status: 500 }
    );
  }
}
