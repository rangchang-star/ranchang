import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { db, users } = await import('@/storage/database/supabase/connection');
    const { desc } = await import('drizzle-orm');

    const dbUsers = await db.select().from(users).orderBy(desc(users.created_at));

    // 转换数据格式以适配后台管理页面
    const members = dbUsers.map((user: any) => ({
      id: user.id,
      name: user.name,
      age: user.age,
      avatar: user.avatar,
      level: user.is_featured ? '活跃会员' : '种子会员',
      tags: user.tags || [],
      industry: user.industry,
      joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '',
      status: user.status,
      isFeatured: user.is_featured,
      phone: user.phone,
      company: user.company,
      position: user.position,
      bio: user.bio,
      need: user.need,
      resourceTags: user.resource_tags || [],
      role: user.role,
      connectionCount: user.connection_count || 0,
      activityCount: user.activity_count || 0,
    }));

    return NextResponse.json({
      success: true,
      data: members,
      total: members.length,
    });
  } catch (error) {
    console.error('获取会员列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取会员列表失败' },
      { status: 500 }
    );
  }
}
