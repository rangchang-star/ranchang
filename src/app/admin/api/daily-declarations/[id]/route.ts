import { NextRequest, NextResponse } from 'next/server';
import { db, dailyDeclarations } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个每日宣告详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const declarationList = await db
      .select()
      .from(dailyDeclarations)
      .where(eq(dailyDeclarations.id, parseInt(id)))
      .limit(1);

    if (declarationList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '每日宣告不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: declarationList[0],
    });
  } catch (error) {
    console.error('获取每日宣告详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取每日宣告详情失败',
      },
      { status: 500 }
    );
  }
}

// PUT - 更新每日宣告
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(dailyDeclarations)
      .set({
        ...body,
        date: body.date ? new Date(body.date) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(dailyDeclarations.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '每日宣告不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新每日宣告失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新每日宣告失败',
      },
      { status: 500 }
    );
  }
}

// DELETE - 删除每日宣告
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(dailyDeclarations).where(eq(dailyDeclarations.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除每日宣告失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除每日宣告失败',
      },
      { status: 500 }
    );
  }
}
