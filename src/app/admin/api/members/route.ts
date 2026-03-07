import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-database';

export async function GET(request: NextRequest) {
  try {
    // 转换数据格式以适配后台管理页面
    const members = mockUsers.map((user) => ({
      id: user.id.toString(),
      name: user.nickname || user.name,
      age: user.age,
      avatar: user.avatar,
      level: user.isTrusted ? '活跃会员' : '种子会员',
      tags: user.tags,
      industry: user.industry,
      joinDate: new Date(user.createdAt).toISOString().split('T')[0],
      status: user.status,
      isFeatured: user.isTrusted,
      phone: user.phone,
      company: user.company,
      position: user.position,
      bio: user.bio,
      need: user.need,
      tagStamp: user.tagStamp,
      hardcoreTags: user.hardcoreTags,
      resourceTags: user.resourceTags,
      role: user.role,
      connectionCount: user.connectionCount || 0,
      activityCount: user.activityCount || 0,
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
