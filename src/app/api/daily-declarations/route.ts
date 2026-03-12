import { NextRequest, NextResponse } from 'next/server';
import { db, dailyDeclarations } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取每日宣告列表（前台）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';

    let query = db
      .select()
      .from(dailyDeclarations)
      .orderBy(desc(dailyDeclarations.date));

    if (status === 'featured') {
      query = (query as any).where(eq(dailyDeclarations.is_featured, true));
    }

    const declarationList = await query;

    // 转换数据格式（数据库 snake_case → 前端 camelCase）
    const data = declarationList.map((decl: any) => ({
      id: decl.id,
      title: decl.title,
      date: decl.date || '',  // 数据库中存储的是字符串
      image: decl.image || '',
      imageKey: decl.image || '',  // 图片fileKey（当前数据库存储的是URL）
      audio: decl.audio || '',
      audioUrl: decl.audio || '',  // 音频URL
      audioKey: decl.audio || '',  // 音频fileKey
      summary: decl.summary || '',
      text: decl.text || '',
      iconType: decl.icon_type || '',
      rank: decl.rank || 0,
      profile: decl.profile || '',
      duration: decl.duration || '',
      isFeatured: decl.is_featured || false,
      isActive: decl.is_featured !== false,  // 向后兼容：默认显示
      views: decl.views || 0,
      createdAt: decl.created_at,
      updatedAt: decl.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取每日宣告列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取每日宣告列表失败',
      },
      { status: 500 }
    );
  }
}
