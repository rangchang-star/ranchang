import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { db, declarations, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    // 获取宣告信息
    const dbDeclarations = await db.select().from(declarations).where(eq(declarations.id, id));

    if (dbDeclarations.length === 0) {
      return NextResponse.json({
        success: false,
        error: '宣告信息不存在'
      }, { status: 404 });
    }

    const declaration = dbDeclarations[0];

    // 获取关联的用户信息（user_id 是 varchar，需要转换）
    // 注意：declarations.user_id 是 varchar，但 users.id 是 integer
    // 这里需要特殊处理，暂时不关联用户信息
    let creator = null;

    // 转换数据格式以匹配前端期望的字段
    const formattedDeclaration = {
      id: declaration.id,
      userId: declaration.user_id,
      title: declaration.summary || '高燃宣告',
      content: declaration.text,
      direction: declaration.direction,
      audioUrl: declaration.audio_url,
      views: declaration.views || 0,
      likes: Math.floor((declaration.views || 0) * 0.1), // 模拟点赞数为浏览量的10%
      shares: Math.floor((declaration.views || 0) * 0.05), // 模拟分享数为浏览量的5%
      isFeatured: declaration.is_featured || false,
      date: declaration.date?.toISOString(),
      createdAt: declaration.created_at?.toISOString(),
      updatedAt: declaration.updated_at?.toISOString(),
      creator: creator,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { db, declarations } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const result = await db.delete(declarations)
      .where(eq(declarations.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '宣告不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '宣告删除成功'
    });
  } catch (error: any) {
    console.error('删除宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除宣告失败'
    }, { status: 500 });
  }
}
