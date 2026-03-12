import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path') || '/';

    // TODO: 实现代码浏览器功能
    // 返回文件列表
    return NextResponse.json({
      success: true,
      data: {
        path,
        files: [],
      },
    });
  } catch (error) {
    console.error('获取文件列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取文件列表失败' },
      { status: 500 }
    );
  }
}
