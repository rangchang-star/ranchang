import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 使用统一的模拟数据
    const declaration = MockDatabase.getDeclarationById(id);

    if (!declaration) {
      return NextResponse.json({
        success: false,
        error: '宣告信息不存在'
      }, { status: 404 });
    }

    // 获取关联的用户信息
    const user = MockDatabase.getUserById(parseInt(declaration.userId));

    // 转换数据格式以匹配前端期望的字段
    const formattedDeclaration = {
      id: declaration.id,
      title: declaration.summary, // 使用summary作为标题
      content: declaration.text, // 使用text作为内容
      iconType: declaration.iconType,
      rank: declaration.rank,
      image: declaration.image,
      profile: declaration.profile,
      duration: declaration.duration,
      views: declaration.views || 0,
      likes: Math.floor(declaration.views * 0.1), // 模拟点赞数为浏览量的10%
      shares: Math.floor(declaration.views * 0.05), // 模拟分享数为浏览量的5%
      isFeatured: declaration.isFeatured || false,
      createdAt: declaration.createdAt,
      audioUrl: declaration.audioUrl,
      creator: user ? {
        id: user.id,
        name: user.name || user.nickname,
        avatar: user.avatar,
        position: user.position,
        company: user.company,
        industry: user.industry,
        tags: user.hardcoreTags || user.tags || [], // 优先使用hardcoreTags
      } : null,
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
