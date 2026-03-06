import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // TODO: 从数据库获取文档详情
        // 暂时使用模拟数据
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
      }
    }

    const document = MockDatabase.getDocumentById(id);

    if (!document) {
      return NextResponse.json({
        success: false,
        error: '文档不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: document,
    });
  } catch (error: any) {
    console.error('获取文档详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取文档详情失败'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 验证必填字段
    if (!body.title) {
      return NextResponse.json({
        success: false,
        error: '请填写文档标题'
      }, { status: 400 });
    }

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // TODO: 更新文档到数据库
        // 暂时使用模拟数据
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
      }
    }

    const document = MockDatabase.updateDocument(id, body);

    if (!document) {
      return NextResponse.json({
        success: false,
        error: '文档不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '文档更新成功',
      data: document,
    });
  } catch (error: any) {
    console.error('更新文档失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新文档失败'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // TODO: 从数据库删除文档
        // 暂时使用模拟数据
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
      }
    }

    const result = MockDatabase.deleteDocument(id);

    if (!result) {
      return NextResponse.json({
        success: false,
        error: '文档不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '文档删除成功',
    });
  } catch (error: any) {
    console.error('删除文档失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除文档失败'
    }, { status: 500 });
  }
}
