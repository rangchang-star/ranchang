import { NextRequest, NextResponse } from 'next/server';

// 模拟活动数据（用于开发演示，实际部署时应连接数据库）
const mockActivities = [
  {
    id: 1,
    category: 'AI技术',
    title: 'AI在传统行业的应用实践',
    subtitle: '探讨AI技术如何赋能传统企业',
    description: '本次分享将详细介绍AI技术在制造业、零售业、服务业等传统行业的成功应用案例，以及实施过程中的挑战和解决方案。',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    tags: ['AI', '传统行业', '案例分享'],
    capacity: 30,
    teaFee: 50,
    address: '北京市朝阳区科技园',
    status: 'active',
    startDate: '2024-03-20 14:00:00',
    endDate: '2024-03-20 17:00:00',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 2,
    category: '创业沙龙',
    title: '35+创业者破局之道',
    subtitle: '中青年创业者的转型与突围',
    description: '邀请多位35+成功创业者分享创业经验，探讨在当前经济环境下如何找到新的机会点和突破口。',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
    tags: ['创业', '经验分享', '人脉拓展'],
    capacity: 50,
    teaFee: 0,
    address: '上海市浦东新区创业中心',
    status: 'active',
    startDate: '2024-03-25 09:30:00',
    endDate: '2024-03-25 12:00:00',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: 3,
    category: '资源对接',
    title: '新能源行业资源对接会',
    subtitle: '连接产业链上下游，共创绿色未来',
    description: '汇聚新能源行业的上下游企业，促进资源对接和合作，共同推动绿色能源发展。',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=400&fit=crop',
    tags: ['新能源', '资源对接', '产业合作'],
    capacity: 40,
    teaFee: 80,
    address: '深圳市南山区新能源产业园',
    status: 'active',
    startDate: '2024-03-28 14:00:00',
    endDate: '2024-03-28 18:00:00',
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 4,
    category: '投资路演',
    title: '科技项目投资路演日',
    subtitle: '优质项目现场路演，投资人面对面',
    description: '精选10个优质科技创业项目进行现场路演，邀请知名投资机构参与点评和对接。',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
    tags: ['投资', '路演', '科技项目'],
    capacity: 60,
    teaFee: 0,
    address: '杭州市西湖区创新大厦',
    status: 'active',
    startDate: '2024-04-01 13:30:00',
    endDate: '2024-04-01 17:30:00',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-18'),
  },
  {
    id: 5,
    category: '技能培训',
    title: '企业管理者领导力提升培训',
    subtitle: '提升管理技能，打造高效团队',
    description: '为期一天的管理培训课程，涵盖团队建设、沟通技巧、决策能力等核心管理技能。',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    tags: ['管理培训', '领导力', '团队建设'],
    capacity: 25,
    teaFee: 200,
    address: '广州市天河区培训中心',
    status: 'active',
    startDate: '2024-04-05 09:00:00',
    endDate: '2024-04-05 18:00:00',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-18'),
  },
];

// GET - 获取活动列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        // 尝试连接数据库
        const { db, activities } = await import('@/storage/database/supabase/connection');
        const { eq, desc } = await import('drizzle-orm');
        
        const result = await db.select().from(activities).orderBy(desc(activities.createdAt));
        
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
      data: mockActivities
    });
  } catch (error: any) {
    console.error('获取活动列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取活动列表失败'
    }, { status: 500 });
  }
}

// POST - 创建活动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, activities } = await import('@/storage/database/supabase/connection');
        const result = await db.insert(activities).values({
          category: body.category,
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          image: body.image,
          capacity: body.capacity,
          teaFee: body.teaFee,
          address: body.address,
          startDate: body.startDate,
          endDate: body.endDate,
          status: body.status || 'active',
        }).returning();
        
        return NextResponse.json({
          success: true,
          data: result[0]
        });
      } catch (dbError: any) {
        console.warn('数据库连接失败:', dbError.message);
      }
    }
    
    // 模拟创建活动
    const newActivity = {
      id: mockActivities.length + 1,
      ...body,
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return NextResponse.json({
      success: true,
      data: newActivity
    });
  } catch (error: any) {
    console.error('创建活动失败:', error);
    return NextResponse.json({
      success: false,
      error: '创建活动失败'
    }, { status: 500 });
  }
}
