import { NextRequest, NextResponse } from 'next/server';
import { db, userFavorites } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

// GET - 检查用户是否喜欢过资源现货
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: declarationId } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
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
        eq(userFavorites.userId, userId),
        eq(userFavorites.targetType, 'declaration'),
        eq(userFavorites.targetId, declarationId)
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
