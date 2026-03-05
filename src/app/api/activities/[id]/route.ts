import { NextRequest, NextResponse } from 'next/server';

// 模拟活动数据
const mockActivities: any[] = [
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
        const { db, activities } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');
        
        const result = await db.select().from(activities).where(eq(activities.id, parseInt(id))).limit(1);
        
        if (result.length === 0) {
          return NextResponse.json({
            success: false,
            error: '活动不存在'
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
    const activity = mockActivities.find(a => a.id === parseInt(id));
    
    if (!activity) {
      return NextResponse.json({
        success: false,
        error: '活动不存在'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    console.error('获取活动详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取活动详情失败'
    }, { status: 500 });
  }
}
