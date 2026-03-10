import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const { db, users } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    // 获取所有用户
    const dbUsers = await db.select().from(users).orderBy(desc(users.created_at));

    // 转换为适合前台使用的格式
    const members = dbUsers.map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      bio: user.need,
      position: user.position,
      company: user.company,
      hardcoreTags: user.ability_tags || [],
      industry: user.industry,
    }));

    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    console.error('获取会员列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取会员列表失败'
    }, { status: 500 });
  }
}
