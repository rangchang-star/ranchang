import { NextRequest, NextResponse } from 'next/server';
import { db, adminUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取管理员详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);

    if (!admin || admin.length === 0) {
      return NextResponse.json(
        { success: false, error: '管理员不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: admin[0],
    });
  } catch (error) {
    console.error('获取管理员详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取管理员详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新管理员
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(adminUsers)
      .set({
        status: body.isActive ? 'active' : 'inactive',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adminUsers.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: '管理员不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新管理员失败:', error);
    return NextResponse.json(
      { success: false, error: '更新管理员失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除管理员
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db
      .delete(adminUsers)
      .where(eq(adminUsers.id, id))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: '管理员不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    console.error('删除管理员失败:', error);
    return NextResponse.json(
      { success: false, error: '删除管理员失败' },
      { status: 500 }
    );
  }
}
