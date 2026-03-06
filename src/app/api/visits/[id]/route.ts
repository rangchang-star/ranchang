import { NextRequest, NextResponse } from 'next/server';
import { mockVisits } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    // 从模拟数据库中查找对应的数据
    const visit = mockVisits.find((v) => v.id === id);

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
