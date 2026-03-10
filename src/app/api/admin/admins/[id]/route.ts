import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';
import { requireAdmin } from '@/lib/auth-utils';

// GET - 获取管理员详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    let user;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const dbUsers = await db.select().from(users).where(eq(users.id, id));

        if (dbUsers.length === 0) {
          return NextResponse.json({
            success: false,
            error: '管理员不存在',
          }, { status: 404 });
        }

        user = dbUsers[0];
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
        // 降级到模拟数据
        user = MockDatabase.getUserById(id);
        if (!user) {
          return NextResponse.json({
            success: false,
            error: '管理员不存在',
          }, { status: 404 });
        }
      }
    } else {
      // 使用模拟数据
      user = MockDatabase.getUserById(id);
      if (!user) {
        return NextResponse.json({
          success: false,
          error: '管理员不存在',
        }, { status: 404 });
      }
    }

    if ((user as any).level !== 'admin') {
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await request.json();

    let updatedAdmin;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        if (body.name || body.phone) {
          const result = await db.update(users)
            .set({
              name: body.name || null,
              phone: body.phone || null,
              updated_at: new Date(),
            })
            .where(eq(users.id, id))
            .returning();

          if (result.length === 0) {
            return NextResponse.json({
              success: false,
              error: '管理员不存在',
            }, { status: 404 });
          }

          updatedAdmin = result[0];
        }
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅更新模拟数据:', dbError.message);
        // 降级到模拟数据
        updatedAdmin = MockDatabase.updateAdminPassword(id, body.password);
      }
    } else {
      // 使用模拟数据
      updatedAdmin = MockDatabase.updateAdminPassword(id, body.password);
    }

    return NextResponse.json({
      success: true,
      data: updatedAdmin,
      message: '密码修改成功',
    });
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    let updatedUser;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const result = await db.update(users)
          .set({
            level: 'user',
            updated_at: new Date(),
          })
          .where(eq(users.id, id))
          .returning();

        if (result.length === 0) {
          return NextResponse.json({
            success: false,
            error: '管理员不存在',
          }, { status: 404 });
        }

        updatedUser = result[0];
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅删除模拟数据:', dbError.message);
        // 降级到模拟数据
        updatedUser = MockDatabase.deleteAdmin(id);
      }
    } else {
      // 使用模拟数据
      updatedUser = MockDatabase.deleteAdmin(id);
    }

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
