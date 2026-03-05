import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据
const mockUsers: any[] = [
  {
    id: 1,
    phone: '138****0001',
    nickname: '张明',
    name: '张明',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    age: 38,
    company: '科技有限公司',
    position: '技术总监',
    industry: '互联网',
    bio: '15年互联网行业经验，擅长AI技术应用',
    need: '寻找AI项目合作伙伴',
    tagStamp: 'personLookingForJob',
    tags: ['技术', '管理', 'AI'],
    abilityTags: ['技术架构', '团队管理', 'AI应用'],
    resourceTags: ['资金', '人脉', '技术资源'],
    isTrusted: true,
    role: 'user',
    status: 'active',
    followers: 128,
    following: 56,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 2,
    phone: '139****0002',
    nickname: '李华',
    name: '李华',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    age: 42,
    company: '咨询公司',
    position: '合伙人',
    industry: '咨询',
    bio: '20年企业管理咨询经验',
    need: '寻找传统企业转型项目',
    tagStamp: 'jobLookingForPerson',
    tags: ['咨询', '管理', '转型'],
    abilityTags: ['战略规划', '组织变革', '流程优化'],
    resourceTags: ['客户资源', '行业经验'],
    isTrusted: true,
    role: 'user',
    status: 'active',
    followers: 234,
    following: 89,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

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
    
    // 使用模拟数据
    const user = mockUsers.find(u => u.id === parseInt(id));
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取用户详情失败'
    }, { status: 500 });
  }
}
