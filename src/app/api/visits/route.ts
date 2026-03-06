import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(request: NextRequest) {
  try {
    // 使用统一的模拟数据
    const visits = MockDatabase.getVisits();

    return NextResponse.json({
      success: true,
      data: visits
    });
  } catch (error: any) {
    console.error('获取探访列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取探访列表失败'
    }, { status: 500 });
  }
}
