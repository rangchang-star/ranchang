import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    // 从模拟数据库中查找对应的数据
    const visit = MockDatabase.getVisitById(id);

    if (!visit) {
      return NextResponse.json(
        { success: false, error: '探访信息不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: visit,
    });
  } catch (error) {
    console.error('获取探访信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访信息失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.date || !body.location) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    // 使用模拟数据库更新
    MockDatabase.updateVisit(id, body);

    return NextResponse.json({
      success: true,
      message: '探访更新成功',
      data: { id }
    });
  } catch (error) {
    console.error('更新探访失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新探访失败'
    }, { status: 500 });
  }
}
