import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { users } from '@/storage/database/supabase/schema';
import { eq } from 'drizzle-orm';

// GET - 获取单个用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: '无效的用户ID'
      }, { status: 400 });
    }

    const result = await db.select({
      id: users.id,
      phone: users.phone,
      nickname: users.nickname,
      name: users.name,
      avatar: users.avatar,
      company: users.company,
      position: users.position,
      bio: users.bio,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users).where(eq(users.id, id));

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户详情失败'
    }, { status: 500 });
  }
}

// PUT - 更新用户信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: '无效的用户ID'
      }, { status: 400 });
    }

    const body = await request.json();
    
    const updateData: any = {
      updatedAt: new Date()
    };
    
    // 只更新提供的字段
    if (body.nickname !== undefined) updateData.nickname = body.nickname;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.password !== undefined) updateData.password = body.password; // 如果更新密码
    
    const result = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        phone: users.phone,
        nickname: users.nickname,
        name: users.name,
        avatar: users.avatar,
        company: users.company,
        position: users.position,
        bio: users.bio,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新用户失败'
    }, { status: 500 });
  }
}
