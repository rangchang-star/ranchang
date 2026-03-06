import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');
        
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
        }).from(users).where(eq(users.id, parseInt(id))).limit(1);
        
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
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
      }
    }
    
    // 使用统一的模拟数据
    const user = MockDatabase.getUserById(parseInt(id));

    if (!user) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    // 不返回密码字段
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error: any) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户详情失败'
    }, { status: 500 });
  }
}
