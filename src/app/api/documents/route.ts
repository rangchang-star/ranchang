import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET() {
  try {
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // TODO: 从数据库获取文档列表
        // 暂时使用模拟数据
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
      }
    }

    const documents = MockDatabase.getDocuments();

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error: any) {
    console.error('获取文档列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取文档列表失败'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
        // TODO: 创建文档到数据库
        // 暂时使用模拟数据
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
      }
    }

    const document = MockDatabase.createDocument(body);

    return NextResponse.json({
      success: true,
      message: '文档创建成功',
      data: document,
    });
  } catch (error: any) {
    console.error('创建文档失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建文档失败'
    }, { status: 500 });
  }
}
