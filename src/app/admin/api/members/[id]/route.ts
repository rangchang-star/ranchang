import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 从 MockDatabase 获取用户信息
    const user = MockDatabase.getUserById(parseInt(id));

    if (!user) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    // 转换为前端需要的格式
    const memberData = {
      id: user.id.toString(),
      // 基本信息
      name: user.nickname || user.name,
      age: user.age,
      avatar: user.avatar,
      connectionType: user.tagStamp || 'personLookingForJob',
      industry: user.industry,
      need: user.need,
      abilityTags: user.abilityTags || [],
      resourceTags: user.resourceTags || [],

      // 后台标签
      adminTags: user.tags || ['普通'],

      // 公司信息
      phone: user.phone,
      email: '', // mock数据中没有email字段
      company: user.company,
      position: user.position,
      faith: '', // mock数据中没有faith字段

      // 其他信息
      level: user.isTrusted ? '活跃会员' : '种子会员',
      joinDate: new Date(user.createdAt).toISOString().split('T')[0],
      status: user.status,
      isFeatured: user.isFeatured,
      role: user.role,
      bio: user.bio,
      connectionCount: user.connectionCount || 0,
      activityCount: user.activityCount || 0,

      // 高燃宣告（从 mockDeclarations 获取）
      declaration: null,

      // 量表评估（暂时为空）
      assessments: [],

      // 探访记录（从 mockVisits 获取）
      visitRecords: [],

      // 参与活动（从 mockActivityRegistrations 获取）
      activities: [],
    };

    return NextResponse.json({
      success: true,
      data: memberData,
    });
  } catch (error) {
    console.error('获取会员详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取会员详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 更新用户信息
    const updatedUser = MockDatabase.updateUser(parseInt(id), {
      name: body.name,
      nickname: body.name,
      age: body.age,
      industry: body.industry,
      company: body.company,
      position: body.position,
      bio: body.bio,
      need: body.need,
      tags: body.adminTags,
      abilityTags: body.abilityTags,
      resourceTags: body.resourceTags,
      tagStamp: body.connectionType,
      isFeatured: body.isFeatured,
      avatar: body.avatar,
    });

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: '用户不存在或更新失败'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '会员信息更新成功',
      data: updatedUser,
    });
  } catch (error) {
    console.error('更新会员信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新会员信息失败' },
      { status: 500 }
    );
  }
}
