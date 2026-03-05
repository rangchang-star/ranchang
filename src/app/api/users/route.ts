import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { users } from '@/storage/database/supabase/schema';
import { eq, desc } from 'drizzle-orm';

// GET - 获取用户列表（仅管理员）
export async function GET(request: NextRequest) {
  try {
    // 这里应该添加管理员权限验证
    // 暂时允许所有请求
    
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
    }).from(users).orderBy(desc(users.createdAt));
    
    // 不返回密码字段
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户列表失败'
    }, { status: 500 });
  }
}

// POST - 创建用户（注册）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await db.insert(users).values({
      phone: body.phone,
      password: body.password,
      nickname: body.nickname,
      name: body.name,
      avatar: body.avatar,
      company: body.company,
      position: body.position,
      bio: body.bio,
      role: 'user',
      status: 'active',
    }).returning();
    
    // 不返回密码字段
    const { password, ...userWithoutPassword } = result[0];
    
    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error: any) {
    console.error('创建用户失败:', error);
    
    if (error.code === '23505') { // 唯一约束冲突
      return NextResponse.json({
        success: false,
        error: '该手机号已被注册'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: '创建用户失败'
    }, { status: 500 });
  }
}
