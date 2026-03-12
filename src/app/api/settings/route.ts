import { NextResponse } from 'next/server';
import { db, settings } from '@/lib/db';

// GET - 获取系统设置
export async function GET() {
  try {
    const settingList = await db.select().from(settings);

    // 转换为前端需要的格式
    const formattedSettings: Record<string, any> = {
      discovery: {
        slogan: '发现光亮，点亮事业',
        logo: '/logo-ranchang.png',
        music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        backgroundImage: '/discovery-bg.jpg',
      },
    };

    // 从数据库加载设置
    settingList.forEach((setting: any) => {
      if (setting.key === 'discovery') {
        formattedSettings.discovery = JSON.parse(setting.value);
      }
    });

    return NextResponse.json({
      success: true,
      data: formattedSettings,
    });
  } catch (error) {
    console.error('获取设置失败:', error);
    return NextResponse.json(
      { success: false, error: '获取设置失败' },
      { status: 500 }
    );
  }
}
