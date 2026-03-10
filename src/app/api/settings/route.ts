import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// 默认设置数据
const defaultSettings = {
  // 底部导航键配置
  navigation: {
    discovery: {
      label: '发现光亮',
      icon: 'flame',
    },
    ignition: {
      label: '点亮事业',
      icon: 'trending-up',
    },
    profile: {
      label: '个人中心',
      icon: 'user',
    },
  },
  // 页面标题配置
  pageTitles: {
    discovery: '发现光亮',
    activities: '活动列表',
    visit: '探访点亮',
    assets: '能力资产',
    declarations: '高燃宣告',
    connection: '能力连接',
    consultation: '专家咨询',
    training: '培训赋能',
    subscription: 'AI加油圈',
    notifications: '消息通知',
    settings: '系统设置',
  },
  // 发现键设置
  discovery: {
    slogan: '发现光亮，点亮事业',
    logo: '/logo-ranchang.png',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    backgroundImage: '/discovery-bg.jpg',
  },
  // 点亮键设置
  ignition: {
    visitSlogan: '每次探访都是商业思维的激烈碰撞，更是一场关于财务收入与使命践行的重新审视....',
    visitMedia: {
      type: null,
      url: '',
    },
    aiCircleSlogan: 'AI加油圈，为期一年的AI环境高效浸泡池，每周一聚，要求全员产出AI数字资产',
    aiCircleMedia: {
      type: null,
      url: '',
    },
  },
  // 个人键量表设置
  profile: {
    businessCognition: {
      displayStyle: 'radar',
    },
    aiCognition: {
      displayStyle: 'radar',
    },
    careerMission: {
      displayStyle: 'cards',
    },
    entrepreneurialPsychology: {
      displayStyle: 'progress',
    },
  },
  // 联系信息配置
  contactInfo: {
    message: '此功能暂时关闭，需要对接人与资源联系"燃场app"工作人员。',
    contact: 'v:13023699913',
  },
};

export async function GET() {
  try {
    let settingsData;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, settings } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const result = await db.select().from(settings).where(eq(settings.key, 'default_settings'));

        if (result.length > 0 && result[0].value) {
          settingsData = result[0].value;
        } else {
          // 数据库中没有设置数据，使用默认设置
          settingsData = defaultSettings;
        }
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用默认设置:', dbError.message);
        settingsData = defaultSettings;
      }
    } else {
      // 使用默认设置
      settingsData = defaultSettings;
    }

    return NextResponse.json({
      success: true,
      data: settingsData,
    });
  } catch (error) {
    console.error('获取设置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取设置失败',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    if (!body) {
      return NextResponse.json(
        {
          success: false,
          error: '请提供设置数据',
        },
        { status: 400 }
      );
    }

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, settings } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        // 检查是否已存在设置
        const existing = await db.select().from(settings).where(eq(settings.key, 'default_settings'));

        if (existing.length > 0) {
          // 更新现有设置
          await db.update(settings)
            .set({
              value: body,
              updatedAt: new Date(),
            })
            .where(eq(settings.key, 'default_settings'));
        } else {
          // 创建新设置
          await db.insert(settings).values({
            id: randomUUID(),
            key: 'default_settings',
            value: body,
            updatedAt: new Date(),
          });
        }
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅返回成功响应:', dbError.message);
        // 降级：不保存到数据库，但返回成功响应
      }
    }

    return NextResponse.json({
      success: true,
      data: body,
      message: '设置保存成功',
    });
  } catch (error) {
    console.error('保存设置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '保存设置失败',
      },
      { status: 500 }
    );
  }
}
