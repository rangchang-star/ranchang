import { NextRequest, NextResponse } from 'next/server';
import { db, declarations, appUsers } from '@/lib/db';
import { desc, eq, and, sql } from 'drizzle-orm';

// GET - 获取资源现货板块展示数据（每个用户最新的一条，按时间倒序，最多3条）
export async function GET(request: NextRequest) {
  try {
    // 查询所有资源现货数据，并关联用户信息
    const allDeclarations = await db
      .select({
        id: declarations.id,
        userId: declarations.userId,
        type: declarations.type,
        subtype: declarations.subtype,
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
      })
      .from(declarations)
      .innerJoin(appUsers, eq(declarations.userId, appUsers.id))
      .where(and(
        eq(declarations.type, 'resource'), // 只获取资源现货
        eq(appUsers.status, 'active'), // 只获取有效用户
      ))
      .orderBy(desc(declarations.createdAt));

    // 过滤出每个用户的第一条（最新的一条）
    const userMap = new Map();
    for (const item of allDeclarations) {
      const userId = item.userId;
      if (!userMap.has(userId)) {
        userMap.set(userId, item);
      }
    }
    const filteredDeclarations = Array.from(userMap.values());

    // 按创建时间倒序排序，只取前3条
    const displayDeclarations = filteredDeclarations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        userId: item.userId,
        type: item.type,
        subtype: item.subtype,
        direction: item.direction,
        text: item.text,
        summary: item.summary,
        audioUrl: item.audioUrl,
        views: item.views,
        isFeatured: item.isFeatured,
        date: item.date,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        user: {
          name: item.userName,
          nickname: item.userNickname,
          avatar: item.userAvatar,
        },
      }));

    return NextResponse.json({
      success: true,
      data: displayDeclarations,
    });
  } catch (error) {
    console.error('获取资源现货展示数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取资源现货展示数据失败' },
      { status: 500 }
    );
  }
}
