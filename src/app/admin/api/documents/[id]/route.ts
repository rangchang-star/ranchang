import { NextRequest, NextResponse } from 'next/server';
import { db, documents } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个文档详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const documentList = await db
      .select()
      .from(documents)
      .where(eq((documents as any).id, parseInt(id)))
      .limit(1);

    if (documentList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '文档不存在',
        },
        { status: 404 }
      );
    }

    // 增加下载次数
    await db
      .update(documents)
      .set({
        download_count: (documentList[0].download_count || 0) + 1,
      })
      .where(eq((documents as any).id, parseInt(id)));

    return NextResponse.json({
      success: true,
      data: documentList[0],
    });
  } catch (error) {
    console.error('获取文档详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取文档详情失败',
      },
      { status: 500 }
    );
  }
}

// PUT - 更新文档
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(documents)
      .set({
        title: body.title,
        description: body.description,
        file_url: body.fileUrl,
        file_type: body.fileType,
        file_size: body.fileSize,
        category: body.category,
        created_by: body.createdBy,
        cover: body.cover,
        download_count: body.downloadCount,
        updated_at: new Date(),
      })
      .where(eq((documents as any).id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '文档不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error('更新文档失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新文档失败',
      },
      { status: 500 }
    );
  }
}

// DELETE - 删除文档
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(documents).where(eq((documents as any).id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除文档失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除文档失败',
      },
      { status: 500 }
    );
  }
}
