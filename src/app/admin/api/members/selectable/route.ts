import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { requireAdmin } from '@/lib/auth-utils';

// 定义用户类型
type User = {
  id: number;
  phone: string;
  name: string;
  nickname: string;
  avatar: string;
  bio: string;
  position: string;
  company: string;
  hardcoreTags: string[];
  tags: string[];
  industry: string;
};

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

    // 获取所有用户（显式指定类型）
    const users = MockDatabase.getUsers() as User[];

    // 转换为适合前台使用的格式
    const members = users.map(user => ({
      id: String(user.id),
      name: user.nickname || user.name,
      avatar: user.avatar,
      bio: user.bio,
      position: user.position,
      company: user.company,
      hardcoreTags: user.hardcoreTags || user.tags,
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
