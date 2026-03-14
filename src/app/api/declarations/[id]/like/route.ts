import { NextRequest, NextResponse } from 'next/server';
import { db, declarations, userFavorites } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// POST - 喜欢/取消喜欢资源现货
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: declarationId } = await context.params;
    const body = await request.json();
    const { userId, action } = body; // action: 'like' or 'unlike'

    if (!userId) {
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
          eq(userFavorites.userId, userId),
          eq(userFavorites.targetType, 'declaration'),
          eq(userFavorites.targetId, declarationId)
        ));

      if (existing.length > 0) {
        return NextResponse.json({
          success: true,
          data: { isLiked: true },
        });
      }

      // 添加喜欢记录
      await db.insert(userFavorites).values({
        userId,
        targetType: 'declaration',
        targetId: declarationId,
      });
    } else {
      // 删除喜欢记录
      await db
        .delete(userFavorites)
        .where(and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.targetType, 'declaration'),
          eq(userFavorites.targetId, declarationId)
        ));
    }

    // 计算新的喜欢数
    const likesCountResult = await db
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.targetType, 'declaration'),
        eq(userFavorites.targetId, declarationId)
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
