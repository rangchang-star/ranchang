import { NextRequest, NextResponse } from 'next/server';
import { db, userFavorites } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// POST - 喜欢/取消喜欢用户
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { currentUserId, action } = body; // action: 'like' or 'unlike'

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    if (!action || !['like', 'unlike'].includes(action)) {
      return NextResponse.json(
        { success: false, error: '操作类型无效' },
        { status: 400 }
      );
    }

    if (action === 'like') {
      // 检查是否已经喜欢过
      const existing = await db
        .select()
        .from(userFavorites)
        .where(and(
          eq(userFavorites.userId, currentUserId),
          eq(userFavorites.targetType, 'user'),
          eq(userFavorites.targetId, userId)
        ));

      if (existing.length > 0) {
        return NextResponse.json({
          success: true,
          data: { isLiked: true },
        });
      }

      // 添加喜欢记录
      await db.insert(userFavorites).values({
        userId: currentUserId,
        targetType: 'user',
        targetId: userId,
      });
    } else {
      // 删除喜欢记录
      await db
        .delete(userFavorites)
        .where(and(
          eq(userFavorites.userId, currentUserId),
          eq(userFavorites.targetType, 'user'),
          eq(userFavorites.targetId, userId)
        ));
    }

    // 计算新的喜欢数
    const likesCountResult = await db
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.targetType, 'user'),
        eq(userFavorites.targetId, userId)
      ));

    return NextResponse.json({
      success: true,
      data: {
        isLiked: action === 'like',
        likesCount: likesCountResult.length,
      },
    });
  } catch (error) {
    console.error('喜欢/取消喜欢失败:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}

// GET - 检查用户是否喜欢过
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    // 查询是否已喜欢
    const existing = await db
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, currentUserId),
        eq(userFavorites.targetType, 'user'),
        eq(userFavorites.targetId, userId)
      ));

    return NextResponse.json({
      success: true,
      data: {
        isLiked: existing.length > 0,
      },
    });
  } catch (error) {
    console.error('检查喜欢状态失败:', error);
    return NextResponse.json(
      { success: false, error: '检查失败' },
      { status: 500 }
    );
  }
}
