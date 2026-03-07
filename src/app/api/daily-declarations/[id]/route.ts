import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// 获取单个每日宣告
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    const declaration = MockDatabase.getDailyDeclarationById(id);

    if (!declaration) {
      return NextResponse.json(
        { success: false, error: '每日宣告不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: declaration,
    });
  } catch (error) {
    console.error('获取每日宣告失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日宣告失败' },
      { status: 500 }
    );
  }
}

// 更新每日宣告
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.date || !body.image || !body.audio) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    // 使用模拟数据库更新
    const updated = MockDatabase.updateDailyDeclaration(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: '每日宣告不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '每日宣告更新成功',
      data: updated
    });
  } catch (error) {
    console.error('更新每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新每日宣告失败'
    }, { status: 500 });
  }
}

// 删除每日宣告
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    const success = MockDatabase.deleteDailyDeclaration(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: '每日宣告不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '每日宣告删除成功'
    });
  } catch (error) {
    console.error('删除每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除每日宣告失败'
    }, { status: 500 });
  }
}
