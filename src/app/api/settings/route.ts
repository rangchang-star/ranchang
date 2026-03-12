import { NextRequest, NextResponse } from 'next/server';
import { db, settings } from '@/lib/db';
import { sql } from 'drizzle-orm';

// 默认设置数据
const defaultSettings = {
  navigation: {
    discovery: { label: '发现光亮', icon: 'flame' },
    ignition: { label: '点亮事业', icon: 'trending-up' },
    profile: { label: '个人中心', icon: 'user' },
  },
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
  discovery: {
    slogan: '发现光亮，点亮事业',
    logo: '/logo-ranchang.png',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    backgroundImage: '/discovery-bg.jpg',
  },
  ignition: {
    visitSlogan: '每次探访都是商业思维的激烈碰撞，更是一场关于财务收入与使命践行的重新审视....',
    visitMedia: { type: 'image' as 'image' | 'video' | null, url: '' },
    aiCircleSlogan: 'AI加油圈，为期一年的AI环境高效浸泡池，每周一聚，要求全员产出AI数字资产',
    aiCircleMedia: { type: 'image' as 'image' | 'video' | null, url: '' },
  },
  profile: {
    businessCognition: { displayStyle: 'radar' as 'bar' | 'radar' | 'progress' | 'cards' | 'line' },
    aiCognition: { displayStyle: 'radar' as 'bar' | 'radar' | 'progress' | 'cards' | 'line' },
    careerMission: { displayStyle: 'cards' as 'bar' | 'radar' | 'progress' | 'cards' | 'line' },
    entrepreneurialPsychology: { displayStyle: 'progress' as 'bar' | 'radar' | 'progress' | 'cards' | 'line' },
  },
  contactInfo: {
    message: '此功能暂时关闭，需要对接人与资源联系"燃场app"工作人员。',
    contact: 'v:13023699913',
  },
};

// GET - 获取设置
export async function GET() {
  try {
    // 使用 drizzle-ORM 查询
    const result = await db.select().from(settings).limit(1);

    if (result.length === 0) {
      // 如果没有数据，返回默认设置
      return NextResponse.json({
        success: true,
        data: defaultSettings,
      });
    }

    const settingsData = result[0].settings;

    return NextResponse.json({
      success: true,
      data: settingsData,
    });
  } catch (error) {
    console.error('获取设置失败:', error);
    // 出错时返回默认设置
    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  }
}

// PUT - 更新设置
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { config } = body;

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少配置数据',
        },
        { status: 400 }
      );
    }

    console.log('Config to save:', config);

    // 使用 drizzle-ORM 查询
    const existing = await db.select().from(settings).limit(1);

    console.log('Existing settings:', existing);

    const configString = JSON.stringify(config);
    console.log('Config string:', configString);

    if (existing.length > 0) {
      // 更新现有设置
      const updated = await db
        .update(settings)
        .set({
          settings: sql`${configString}::jsonb`,
          updated_at: new Date(),
        })
        .where(sql`id = ${existing[0].id}`)
        .returning();

      console.log('Updated settings:', updated);

      return NextResponse.json({
        success: true,
        data: updated[0],
      });
    } else {
      // 创建新设置
      const created = await db
        .insert(settings)
        .values({
          settings: sql`${configString}::jsonb`,
        })
        .returning();

      console.log('Created settings:', created);

      return NextResponse.json({
        success: true,
        data: created[0],
      });
    }
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
