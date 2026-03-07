import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { requireAdmin } from '@/lib/auth-utils';

// GET - 获取管理员详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const userId = parseInt(params.id);

    // 获取用户信息
    const user = MockDatabase.getUserById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: '管理员不存在',
      }, { status: 404 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: '该用户不是管理员',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('获取管理员详情失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '获取管理员详情失败'
    }, { status: 500 });
  }
}

// PUT - 修改管理员信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const userId = parseInt(params.id);
    const body = await request.json();

    // 目前只支持修改密码
    if (body.password) {
      const updatedAdmin = MockDatabase.updateAdminPassword(userId, body.password);

      return NextResponse.json({
        success: true,
        data: updatedAdmin,
        message: '密码修改成功',
      });
    }

    return NextResponse.json({
      success: false,
      error: '没有可更新的字段',
    }, { status: 400 });
  } catch (error: any) {
    console.error('修改管理员信息失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '修改管理员信息失败'
    }, { status: error.message === '管理员不存在' ? 404 : 500 });
  }
}

// DELETE - 删除管理员（降级为普通用户）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const authResult = await requireAdmin(request);

    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        error: authResult.error,
      }, { status: authResult.statusCode || 403 });
    }

    const userId = parseInt(params.id);

    // 删除管理员
    const updatedUser = MockDatabase.deleteAdmin(userId);

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: '管理员已降级为普通用户',
    });
  } catch (error: any) {
    console.error('删除管理员失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '删除管理员失败'
    }, { status: error.message === '管理员不存在' ? 404 : 400 });
  }
}
