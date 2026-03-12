import { NextRequest, NextResponse } from 'next/server';
import { db, documents } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

// GET - 获取文档列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || '';

    let query = db.select().from(documents);

    if (category && category !== 'all') {
      query = query.where(eq((documents as any).category, category));
    }

    const documentList = await query.orderBy(desc((documents as any).created_at));

    return NextResponse.json({
      success: true,
      data: documentList,
    });
  } catch (error) {
    console.error('获取文档列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取文档列表失败',
      },
      { status: 500 }
    );
  }
}

// POST - 创建文档
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newDocument = await db
      .insert(documents)
      .values({
        title: body.title,
        description: body.description,
        file_url: body.fileUrl,
        file_type: body.fileType,
        file_size: body.fileSize || 0,
        category: body.category || '其他',
        created_by: body.createdBy || 1,
        cover: body.cover,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newDocument[0],
    });
  } catch (error) {
    console.error('创建文档失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建文档失败',
      },
      { status: 500 }
    );
  }
}
