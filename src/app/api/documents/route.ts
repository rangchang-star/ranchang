import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { requireAdmin } from '@/lib/auth-utils';

// GET - 获取文档列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let documents = MockDatabase.getDocuments();

    // 按分类筛选
    if (category) {
      documents = documents.filter(doc => doc.category === category);
    }

    // 按创建时间倒序排列
    documents = documents.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      data: documents,
      total: documents.length,
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

    const newDocument = MockDatabase.createDocument({
      title: body.title,
      description: body.description || '',
      fileUrl: body.fileUrl,
      fileType: body.fileType,
      fileSize: body.fileSize || 0,
      category: body.category || '其他',
      createdBy: authResult.user.id,
    });

    return NextResponse.json({
      success: true,
      message: '文档创建成功',
      data: newDocument
    });
  } catch (error: any) {
    console.error('创建文档失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建文档失败'
    }, { status: 500 });
  }
}
