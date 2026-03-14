import { NextRequest, NextResponse } from 'next/server';
import { db, settings } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET 获取页面设置
export async function GET() {
  try {
    // 获取第一条设置记录
    const settingRecords = await db.select().from(settings).limit(1);

    if (settingRecords.length === 0) {
      // 如果没有设置记录，返回默认设置
      return NextResponse.json({
        success: true,
        data: {
          discovery: {
            slogan: '发现光亮，点亮事业',
            logo: '/logo-ranchang.png',
            music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            backgroundImage: '/discovery-bg.jpg',
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settingRecords[0].settings,
    });
  } catch (error) {
    console.error('获取页面设置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取页面设置失败',
      },
      { status: 500 },
    );
  }
}

// POST 保存页面设置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageSettings, discoveryBg } = body;

    // 合并设置
    const settingsData = {
      ...pageSettings,
      discovery: {
        ...pageSettings?.discovery,
        backgroundImage: discoveryBg,
      },
    };

    // 检查是否已存在设置记录
    const existingRecords = await db.select().from(settings).limit(1);

    if (existingRecords.length > 0) {
      // 更新现有记录
      await db
        .update(settings)
        .set({
          settings: settingsData,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, existingRecords[0].id));
    } else {
      // 创建新记录
      await db.insert(settings).values({
        settings: settingsData,
      });
    }

    return NextResponse.json({
      success: true,
      message: '设置保存成功',
    });
  } catch (error) {
    console.error('保存页面设置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '保存页面设置失败',
      },
      { status: 500 },
    );
  }
}
