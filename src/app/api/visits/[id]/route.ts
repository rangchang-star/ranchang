import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 使用统一的模拟数据
    const visit = MockDatabase.getVisitById(id);

    if (!visit) {
      return NextResponse.json({
        success: false,
        error: '探访信息不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: visit
    });
  } catch (error: any) {
    console.error('获取探访详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取探访详情失败'
    }, { status: 500 });
  }
}
