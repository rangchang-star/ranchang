import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { declarations, users } from '@/storage/database/supabase/schema';
import { eq } from 'drizzle-orm';

// 禁用 Next.js 缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/declarations/[id] - 获取单个宣告详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Declaration ID is required' },
      { status: 400 }
    );
  }

  try {
    // 使用 drizzle-ORM 查询，关联用户信息
    const result = await db
      .select({
        id: declarations.id,
        userId: (declarations as any).user_id,
        direction: declarations.direction,
        text: declarations.text,
        summary: declarations.summary,
        audioUrl: (declarations as any).audio_url,
        views: declarations.views,
        date: declarations.date,
        isFeatured: (declarations as any).is_featured,
        createdAt: (declarations as any).created_at,
        updatedAt: (declarations as any).updated_at,
        userName: users.name,
        userAvatar: users.avatar,
        userPosition: users.position,
        userCompany: users.company,
        userIndustry: users.industry,
        userHardcoreTags: (users as any).hardcore_tags,
      })
      .from(declarations)
      .leftJoin(users, eq((declarations as any).user_id, users.id))
      .where(eq(declarations.id, id))
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Declaration not found' },
        { status: 404 }
      );
    }

    const row = result[0];

    // 构建创建者信息
    const creator = {
      name: row.userName,
      avatar: row.userAvatar,
      position: row.userPosition,
      company: row.userCompany,
      industry: row.userIndustry,
      tags: row.userHardcoreTags || []
    };

    // 构建响应数据，映射数据库字段到前端字段
    const declaration = {
      id: row.id,
      title: row.text || row.summary || '高燃宣告',
      content: row.summary || '',
      summary: row.summary || '',
      profile: row.userPosition || '',
      rank: Math.floor(Math.random() * 100) + 1,
      iconType: 'flame',
      icon: row.userAvatar || '/avatar-default.jpg',
      duration: '0:00',
      userId: row.userId,
      userAvatar: row.userAvatar || '/avatar-default.jpg',
      userName: row.userName,
      views: row.views || 0,
      likes: 0,
      shares: 0,
      audioUrl: row.audioUrl,
      image: '/declaration-default.jpg',
      direction: row.direction,
      date: row.date,
      isFeatured: row.isFeatured,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      creator: creator
    };

    return NextResponse.json(
      {
        success: true,
        data: declaration
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error: any) {
    console.error('GET /api/declarations/[id] 失败:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
