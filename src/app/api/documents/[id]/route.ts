import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { requireAdmin } from '@/lib/auth-utils';

// GET - 获取文档详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = MockDatabase.getDocumentById(id);

    if (!document) {
      return NextResponse.json({
        success: false,
        error: '文档不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: document
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

    const updatedDocument = MockDatabase.updateDocument(id, {
      title: body.title,
      description: body.description,
      fileUrl: body.fileUrl,
      fileType: body.fileType,
      fileSize: body.fileSize,
      category: body.category,
    });

    if (!updatedDocument) {
      return NextResponse.json({
        success: false,
        error: '文档不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '文档更新成功',
      data: updatedDocument
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

    const success = MockDatabase.deleteDocument(id);

    if (!success) {
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
