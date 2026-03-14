import { NextRequest, NextResponse } from 'next/server';
import { db, dailyDeclarations } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个每日现货资源
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    const [declaration] = await db
      .select()
      .from(dailyDeclarations)
      .where(eq(dailyDeclarations.id, idNum));

    if (!declaration) {
      return NextResponse.json(
        { success: false, error: '每日现货资源不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: declaration,
    });
  } catch (error) {
    console.error('获取每日现货资源失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日现货资源失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新每日现货资源
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();

    const [updatedDeclaration] = await db
      .update(dailyDeclarations)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dailyDeclarations.id, idNum))
      .returning();

    if (!updatedDeclaration) {
      return NextResponse.json(
        { success: false, error: '每日现货资源不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedDeclaration,
    });
  } catch (error) {
    console.error('更新每日现货资源失败:', error);
    return NextResponse.json(
      { success: false, error: '更新每日现货资源失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除每日现货资源
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    const [deletedDeclaration] = await db
      .delete(dailyDeclarations)
      .where(eq(dailyDeclarations.id, idNum))
      .returning();

    if (!deletedDeclaration) {
      return NextResponse.json(
        { success: false, error: '每日现货资源不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedDeclaration,
    });
  } catch (error) {
    console.error('删除每日现货资源失败:', error);
    return NextResponse.json(
      { success: false, error: '删除每日现货资源失败' },
      { status: 500 }
    );
  }
}
