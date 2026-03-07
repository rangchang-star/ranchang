import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { requireAdmin } from '@/lib/auth-utils';

// GET - 获取所有管理员
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

    // 获取所有管理员
    const admins = MockDatabase.getAdmins();

    return NextResponse.json({
      success: true,
      data: admins,
    });
  } catch (error: any) {
    console.error('获取管理员列表失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '获取管理员列表失败'
    }, { status: 500 });
  }
}

// POST - 创建管理员
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const body = await request.json();

    // 验证必填字段
    if (!body.phone || !body.password || !body.nickname || !body.name) {
      return NextResponse.json({
        success: false,
        error: '请填写完整的管理员信息',
      }, { status: 400 });
    }

    // 创建管理员
    const newAdmin = MockDatabase.createAdmin({
      phone: body.phone,
      password: body.password,
      nickname: body.nickname,
      name: body.name,
    });

    return NextResponse.json({
      success: true,
      data: newAdmin,
      message: '管理员创建成功',
    });
  } catch (error: any) {
    console.error('创建管理员失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '创建管理员失败'
    }, { status: error.message === '该手机号已被注册' ? 400 : 500 });
  }
}
