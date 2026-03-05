import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { users } from '@/storage/database/supabase/schema';
import { eq } from 'drizzle-orm';

// GET - 获取单个用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
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
      age: users.age,
      company: users.company,
      position: users.position,
      industry: users.industry,
      bio: users.bio,
      need: users.need,
      tagStamp: users.tagStamp,
      tags: users.tags,
      abilityTags: users.abilityTags,
      resourceTags: users.resourceTags,
      isTrusted: users.isTrusted,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
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
    if (body.age !== undefined) updateData.age = body.age;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.industry !== undefined) updateData.industry = body.industry;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.need !== undefined) updateData.need = body.need;
    if (body.tagStamp !== undefined) updateData.tagStamp = body.tagStamp;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.abilityTags !== undefined) updateData.abilityTags = body.abilityTags;
    if (body.resourceTags !== undefined) updateData.resourceTags = body.resourceTags;
    if (body.isTrusted !== undefined) updateData.isTrusted = body.isTrusted;
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
        age: users.age,
        company: users.company,
        position: users.position,
        industry: users.industry,
        bio: users.bio,
        need: users.need,
        tagStamp: users.tagStamp,
        tags: users.tags,
        abilityTags: users.abilityTags,
        resourceTags: users.resourceTags,
        isTrusted: users.isTrusted,
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
