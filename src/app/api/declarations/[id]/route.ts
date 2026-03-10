import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查是否配置了数据库连接
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const declarationData = await db.select()
      .from(dailyDeclarations)
      .where(eq(dailyDeclarations.id, parseInt(id)));

    if (declarationData.length === 0) {
      return NextResponse.json({
        success: false,
        error: '宣告信息不存在'
      }, { status: 404 });
    }

    const declaration = declarationData[0];

    // 转换数据格式以匹配前端期望的字段
    const formattedDeclaration = {
      id: declaration.id,
      title: declaration.summary || declaration.title,
      content: declaration.text,
      iconType: declaration.icon_type,
      rank: declaration.rank,
      image: declaration.image,
      profile: declaration.profile,
      duration: declaration.duration,
      views: declaration.views || 0,
      likes: Math.floor((declaration.views || 0) * 0.1), // 模拟点赞数为浏览量的10%
      shares: Math.floor((declaration.views || 0) * 0.05), // 模拟分享数为浏览量的5%
      isFeatured: declaration.is_featured || false,
      createdAt: declaration.created_at,
      audioUrl: declaration.audio,
      creator: null, // 数据库中没有 user_id 字段，暂不关联用户信息
    };

    return NextResponse.json({
      success: true,
      data: formattedDeclaration
    });
  } catch (error: any) {
    console.error('获取宣告详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取宣告详情失败'
    }, { status: 500 });
  }
}
