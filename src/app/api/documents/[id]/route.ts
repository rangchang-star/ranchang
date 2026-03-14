import { NextRequest, NextResponse } from 'next/server';
import { db, documents } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个文档
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id); // 转换为数字

    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, idNum));

    if (!document) {
      return NextResponse.json(
        { success: false, error: '文档不存在' },
        { status: 404 }
      );
    }

    // 只返回数据库中存在的字段
    return NextResponse.json({
      success: true,
      data: {
        id: document.id,
        title: document.title,
        description: document.description,
        category: document.category,
        content: document.content,
        fileUrl: document.fileUrl,
        coverImage: document.coverImage,
        icon: document.icon, // 添加 icon 字段
        fileSize: document.fileSize,
        fileType: document.fileType,
        downloadCount: document.downloadCount,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    });
  } catch (error) {
    console.error('获取文档失败:', error);
    return NextResponse.json(
      { success: false, error: '获取文档失败' },
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
    const idNum = parseInt(id); // 转换为数字
    const body = await request.json();

    // 验证必填字段
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: '请输入文件名' },
        { status: 400 }
      );
    }

    if (!body.coverImage) {
      return NextResponse.json(
        { success: false, error: '请上传封面图片' },
        { status: 400 }
      );
    }

    if (!body.content) {
      return NextResponse.json(
        { success: false, error: '请输入文档内容' },
        { status: 400 }
      );
    }

    // 只更新允许的字段（数据库中存在的字段）
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.icon !== undefined) updateData.icon = body.icon;

    const [updatedDocument] = await db
      .update(documents)
      .set(updateData)
      .where(eq(documents.id, idNum))
      .returning();

    if (!updatedDocument) {
      return NextResponse.json(
        { success: false, error: '文档不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDocument.id,
        title: updatedDocument.title,
        description: updatedDocument.description,
        category: updatedDocument.category,
        content: updatedDocument.content,
        fileUrl: updatedDocument.fileUrl,
        coverImage: updatedDocument.coverImage,
        icon: updatedDocument.icon,
        fileSize: updatedDocument.fileSize,
        fileType: updatedDocument.fileType,
        downloadCount: updatedDocument.downloadCount,
        createdAt: updatedDocument.createdAt,
        updatedAt: updatedDocument.updatedAt,
      },
    });
  } catch (error) {
    console.error('更新文档失败:', error);
    return NextResponse.json(
      { success: false, error: '更新文档失败' },
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
    const idNum = parseInt(id); // 转换为数字

    const [deletedDocument] = await db
      .delete(documents)
      .where(eq(documents.id, idNum))
      .returning();

    if (!deletedDocument) {
      return NextResponse.json(
        { success: false, error: '文档不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedDocument,
    });
  } catch (error) {
    console.error('删除文档失败:', error);
    return NextResponse.json(
      { success: false, error: '删除文档失败' },
      { status: 500 }
    );
  }
}
