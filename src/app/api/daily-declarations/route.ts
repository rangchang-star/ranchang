import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// 获取所有每日宣告
export async function GET(request: NextRequest) {
  try {
    // 从模拟数据库获取每日宣告数据
    const declarations = MockDatabase.getDailyDeclarations();

    return NextResponse.json({
      success: true,
      data: declarations,
    });
  } catch (error) {
    console.error('获取每日宣告失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日宣告失败' },
      { status: 500 }
    );
  }
}

// 创建每日宣告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.date || !body.image || !body.audio) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    // 使用模拟数据库创建
    const newDeclaration = MockDatabase.createDailyDeclaration(body);

    return NextResponse.json({
      success: true,
      message: '每日宣告创建成功',
      data: newDeclaration
    });
  } catch (error) {
    console.error('创建每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建每日宣告失败'
    }, { status: 500 });
  }
}
