import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';

// GET - 获取文档列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, documents } = await import('@/storage/database/supabase/connection');

    let result;
    if (category) {
      const { eq } = await import('drizzle-orm');
      result = await db.select().from(documents).where(eq(documents.category, category));
    } else {
      result = await db.select().from(documents);
    }

    // 按创建时间倒序排列
    const sortedDocuments = result.sort((a, b) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return NextResponse.json({
      success: true,
      data: sortedDocuments,
      total: sortedDocuments.length,
    });
  } catch (error: any) {
    console.error('获取文档列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取文档列表失败'
    }, { status: 500 });
  }
}

// POST - 创建文档
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.fileUrl || !body.fileType) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, documents } = await import('@/storage/database/supabase/connection');

    const result = await db.insert(documents).values({
      title: body.title,
      description: body.description || '',
      file_url: body.fileUrl,
      file_type: body.fileType,
      file_size: body.fileSize || 0,
      category: body.category || '其他',
      created_by: authResult.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      message: '文档创建成功',
      data: result[0]
    });
  } catch (error: any) {
    console.error('创建文档失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建文档失败'
    }, { status: 500 });
  }
}
