import { NextResponse } from 'next/server';
import { db, settings } from '@/lib/db';
import { eq } from 'drizzle-orm';

// 默认设置
const defaultSettings = {
  ignition: {
    visitSlogan: '每次探访都是商业思维的激烈碰撞，更是一场关于财务收入与使命践行的重新审视....',
    visitMedia: {
      type: 'image' as 'image' | 'video' | null,
      url: '',
    },
    aiCircleSlogan: 'AI加油圈，为期一年的AI环境高效浸泡池，每周一聚，要求全员产出AI数字资产',
    aiCircleMedia: {
      type: 'image' as 'image' | 'video' | null,
      url: '',
    },
  },
};

// GET - 获取系统设置
export async function GET() {
  try {
    // 使用 key-value 结构获取设置
    const settingList = await db
      .select()
      .from(settings);

    // 如果数据库中没有设置，返回默认设置
    if (!settingList || settingList.length === 0) {
      return NextResponse.json({
        success: true,
        data: defaultSettings,
      });
    }

    // 将 key-value 结构转换为对象
    const config: any = {};
    settingList.forEach((setting: any) => {
      config[setting.key] = setting.value;
    });

    // 合并默认设置和数据库设置
    const mergedSettings = {
      ...defaultSettings,
      ...config,
      ignition: {
        ...defaultSettings.ignition,
        ...(config.ignition || {}),
        visitMedia: {
          ...defaultSettings.ignition.visitMedia,
          ...(config.ignition?.visitMedia || {}),
        },
        aiCircleMedia: {
          ...defaultSettings.ignition.aiCircleMedia,
          ...(config.ignition?.aiCircleMedia || {}),
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: mergedSettings,
    });
  } catch (error) {
    console.error('获取设置失败:', error);
    return NextResponse.json(
      { success: false, error: '获取设置失败' },
      { status: 500 }
    );
  }
}

// PUT - 保存系统设置
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { config } = body;

    if (!config) {
      return NextResponse.json(
        { success: false, error: '缺少配置数据' },
        { status: 400 }
      );
    }

    // 使用 key-value 结构保存设置
    // 先删除所有现有设置
    await db.delete(settings);

    // 保存 ignition 设置
    await db.insert(settings).values({
      key: 'ignition',
      value: config.ignition || defaultSettings.ignition,
      updatedAt: new Date(),
    });

    // 如果有 logo，保存 logo 设置
    if (config.logo !== undefined) {
      await db.insert(settings).values({
        key: 'logo',
        value: config.logo,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: '设置保存成功',
    });
  } catch (error) {
    console.error('保存设置失败:', error);
    return NextResponse.json(
      { success: false, error: '保存设置失败' },
      { status: 500 }
    );
  }
}
