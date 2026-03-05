import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据（用于开发演示，实际部署时应连接数据库）
const mockUsers = [
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
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 3,
    phone: '137****0003',
    nickname: '王芳',
    name: '王芳',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    age: 35,
    company: '创业公司',
    position: '创始人',
    industry: '教育',
    bio: '教育行业连续创业者',
    need: '寻找投资人和运营人才',
    tagStamp: 'personLookingForJob',
    tags: ['创业', '教育', '运营'],
    abilityTags: ['创业实战', '教育产品', '市场运营'],
    resourceTags: ['产品', '团队'],
    isTrusted: true,
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 4,
    phone: '136****0004',
    nickname: '刘伟',
    name: '刘伟',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    age: 45,
    company: '投资公司',
    position: '投资经理',
    industry: '投资',
    bio: '专注于早期科技项目投资',
    need: '寻找优质科技创业项目',
    tagStamp: 'jobLookingForPerson',
    tags: ['投资', '科技', '创业'],
    abilityTags: ['项目评估', '投资分析', '资源对接'],
    resourceTags: ['资金', '行业资源'],
    isTrusted: true,
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: 5,
    phone: '135****0005',
    nickname: '陈静',
    name: '陈静',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    age: 39,
    company: '设计工作室',
    position: '设计总监',
    industry: '设计',
    bio: '15年品牌设计经验',
    need: '寻找品牌设计项目合作',
    tagStamp: 'personLookingForJob',
    tags: ['设计', '品牌', '创意'],
    abilityTags: ['品牌设计', '视觉设计', '用户体验'],
    resourceTags: ['设计资源', '创意团队'],
    isTrusted: true,
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-15'),
  },
];

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // 尝试连接数据库
        const { db, users } = await import('@/storage/database/supabase/connection');
        const { eq, desc } = await import('drizzle-orm');
        
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
        }).from(users).orderBy(desc(users.createdAt));
        
        // 不返回密码字段
        return NextResponse.json({
          success: true,
          data: result
        });
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
        // 数据库连接失败时，使用模拟数据
      }
    }
    
    // 使用模拟数据
    return NextResponse.json({
      success: true,
      data: mockUsers
    });
  } catch (error: any) {
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
    
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, users } = await import('@/storage/database/supabase/connection');
        const result = await db.insert(users).values({
          phone: body.phone,
          password: body.password,
          nickname: body.nickname,
          name: body.name,
          avatar: body.avatar,
          age: body.age,
          company: body.company,
          position: body.position,
          industry: body.industry,
          bio: body.bio,
          need: body.need,
          tagStamp: body.tagStamp,
          tags: body.tags,
          abilityTags: body.abilityTags,
          resourceTags: body.resourceTags,
          isTrusted: body.isTrusted || false,
          role: 'user',
          status: 'active',
        }).returning();
        
        // 不返回密码字段
        const { password, ...userWithoutPassword } = result[0];
        
        return NextResponse.json({
          success: true,
          data: userWithoutPassword
        });
      } catch (dbError: any) {
        console.warn('数据库连接失败:', dbError.message);
        // 继续执行，返回模拟响应
      }
    }
    
    // 模拟创建用户
    const newUser = {
      id: mockUsers.length + 1,
      ...body,
      role: 'user',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    delete newUser.password;
    
    return NextResponse.json({
      success: true,
      data: newUser
    });
  } catch (error: any) {
    console.error('创建用户失败:', error);
    
    if (error.code === '23505') {
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
