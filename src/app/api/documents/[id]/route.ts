import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';

// GET - 获取文档详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, documents } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.select().from(documents).where(eq(documents.id, parseInt(id)));

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '文档不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error: any) {
    console.error('获取文档详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取文档详情失败'
    }, { status: 500 });
  }
}

// PUT - 更新文档
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const body = await request.json();

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, documents } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.update(documents)
      .set({
        title: body.title,
        description: body.description,
        file_url: body.fileUrl,
        file_type: body.fileType,
        file_size: body.fileSize,
        category: body.category,
        updated_at: new Date(),
      })
      .where(eq(documents.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '文档不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '文档更新成功',
      data: result[0]
    });
  } catch (error: any) {
    console.error('更新文档失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新文档失败'
    }, { status: 500 });
  }
}

// DELETE - 删除文档
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, documents } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.delete(documents)
      .where(eq(documents.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '文档不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '文档删除成功'
    });
  } catch (error: any) {
    console.error('删除文档失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除文档失败'
    }, { status: 500 });
  }
}
