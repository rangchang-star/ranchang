import { NextRequest, NextResponse } from 'next/server';
import { db, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取可选择成员列表（简化信息）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    let query = db
      .select({
        id: appUsers.id,
        nickname: appUsers.nickname,
        name: appUsers.name,
        avatar: appUsers.avatar,
        city: appUsers.city,
      })
      .from(appUsers);

    // 仅返回已激活用户（status = active）
    query = (query as any).where(eq(appUsers.status, 'active'));

    const members = await query;

    // 过滤掉 blob URL，只保留有效的对象存储 key
    const filteredMembers = members.map(member => ({
      ...member,
      // 如果 avatar 是 blob URL，返回空字符串
      avatar: member.avatar && !member.avatar.startsWith('blob:') ? member.avatar : '',
    }));

    return NextResponse.json({
      success: true,
      data: filteredMembers,
    });
  } catch (error) {
    console.error('获取可选择成员列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取可选择成员列表失败' },
      { status: 500 }
    );
  }
}
