import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { requireAuth, requireOwnership } from '@/lib/auth-utils';

// 用户收藏数据存储（模拟数据库）
// Map<userId, Array<{userId, visitId, createdAt}>>
const userFavorites: Map<string, { userId: string; visitId: string; createdAt: string }[]> = new Map();

// 初始化模拟数据
const getMockFavorites = (userId: string) => {
  if (!userFavorites.has(userId)) {
    userFavorites.set(userId, [
      {
        userId,
        visitId: '1',
        createdAt: new Date().toISOString(),
      },
      {
        userId,
        visitId: '2',
        createdAt: new Date().toISOString(),
      },
    ]);
  }
  return userFavorites.get(userId) || [];
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // 验证用户登录状态和权限
    const authResult = await requireOwnership(request, parseInt(userId));

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 401 });
    }

    // 获取用户收藏列表
    const favorites = getMockFavorites(userId);

    // 根据 visitId 获取真实的探访项目数据
    const favoritesWithVisit = favorites.map((fav, index) => {
      const visit = MockDatabase.getVisitById(fav.visitId);
      return {
        id: `${userId}-${fav.visitId}-${index}`,
        userId: userId,
        visitId: fav.visitId,
        createdAt: fav.createdAt,
        visit: visit ? {
          id: visit.id,
          title: visit.title,
          image: visit.image,
          date: visit.date,
          industry: visit.industry,
          tags: visit.tags,
          role: '探访人',
        } : null,
      };
    }).filter(fav => fav.visit !== null);

    return NextResponse.json({
      success: true,
      data: favoritesWithVisit,
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取收藏列表失败',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { visitId } = body;

    // 验证用户登录状态和权限
    const authResult = await requireOwnership(request, parseInt(userId));

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error,
        },
        { status: authResult.statusCode || 401 }
      );
    }

    if (!visitId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少探访项目ID',
        },
        { status: 400 }
      );
    }

    // 验证探访项目是否存在
    const visit = MockDatabase.getVisitById(visitId);
    if (!visit) {
      return NextResponse.json(
        {
          success: false,
          error: '探访项目不存在',
        },
        { status: 404 }
      );
    }

    // 获取当前收藏列表
    const favorites = getMockFavorites(userId);

    // 检查是否已收藏
    if (favorites.some(fav => fav.visitId === visitId)) {
      return NextResponse.json(
        {
          success: false,
          error: '已经收藏过该探访项目',
        },
        { status: 400 }
      );
    }

    // 添加收藏
    const newFavorite = {
      userId,
      visitId,
      createdAt: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    userFavorites.set(userId, favorites);

    return NextResponse.json({
      success: true,
      message: '收藏成功',
      data: {
        id: `${userId}-${visitId}-${Date.now()}`,
        userId,
        visitId,
        createdAt: newFavorite.createdAt,
      },
    });
  } catch (error) {
    console.error('添加收藏失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '添加收藏失败',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { visitId } = body;

    // 验证用户登录状态和权限
    const authResult = await requireOwnership(request, parseInt(userId));

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error,
        },
        { status: authResult.statusCode || 401 }
      );
    }

    if (!visitId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少探访项目ID',
        },
        { status: 400 }
      );
    }

    // 获取当前收藏列表
    const favorites = getMockFavorites(userId);

    // 检查是否已收藏
    const index = favorites.findIndex(fav => fav.visitId === visitId);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          error: '未收藏该探访项目',
        },
        { status: 400 }
      );
    }

    // 移除收藏
    favorites.splice(index, 1);
    userFavorites.set(userId, favorites);

    return NextResponse.json({
      success: true,
      message: '取消收藏成功',
    });
  } catch (error) {
    console.error('取消收藏失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取消收藏失败',
      },
      { status: 500 }
    );
  }
}
