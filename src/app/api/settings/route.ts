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
    const settingList = await db.select().from(settings);

    // 如果数据库中没有设置，返回默认设置
    if (!settingList || settingList.length === 0) {
      return NextResponse.json({
        success: true,
        data: defaultSettings,
      });
    }

    // 获取第一条记录
    const dbSettings = settingList[0] as any;

    // 合并数据库设置和默认设置，确保所有字段都存在
    const mergedSettings = {
      ...defaultSettings,
      ...dbSettings.settings,
      ignition: {
        ...defaultSettings.ignition,
        ...(dbSettings.settings?.ignition || {}),
        visitMedia: {
          ...defaultSettings.ignition.visitMedia,
          ...(dbSettings.settings?.ignition?.visitMedia || {}),
        },
        aiCircleMedia: {
          ...defaultSettings.ignition.aiCircleMedia,
          ...(dbSettings.settings?.ignition?.aiCircleMedia || {}),
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

    // 检查是否已有设置记录
    const existingSettings = await db.select().from(settings);

    if (existingSettings && existingSettings.length > 0) {
      // 更新现有记录
      await db
        .update(settings)
        .set({
          settings: config,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(settings.id, existingSettings[0].id));
    } else {
      // 创建新记录
      await db.insert(settings).values({
        settings: config,
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
