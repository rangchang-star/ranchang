/**
 * 设置服务
 *
 * 提供应用设置的获取操作
 * 所有数据格式统一为前端需要的 camelCase 格式
 */

import { db, settings } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { Settings } from './types';
import { safeParseJson, withDefault } from './utils';

/**
 * 转换设置数据（从数据库格式到前端格式）
 */
function transformSettings(settingsData: Record<string, any>): Settings {
  return {
    navigation: {
      discovery: { icon: settingsData.discovery_nav_icon?.icon || '💡', label: settingsData.discovery_nav_icon?.label || '发现光亮' },
      ignition: { icon: settingsData.ignition_nav_icon?.icon || '🔥', label: settingsData.ignition_nav_icon?.label || '点亮事业' },
      profile: { icon: settingsData.profile_nav_icon?.icon || '👤', label: settingsData.profile_nav_icon?.label || '个人中心' },
    },
    pageTitles: {
      discovery: settingsData.discovery_title || '发现光亮',
      activities: settingsData.activities_title || '活动',
      visit: settingsData.visit_title || '探访',
      assets: settingsData.assets_title || '资产',
      declarations: settingsData.declarations_title || '高燃宣告',
      connection: settingsData.connection_title || '连接',
      consultation: settingsData.consultation_title || '咨询',
    },
    discovery: {
      slogan: settingsData.discovery_slogan || '能力连接 · 困境解决',
      logo: settingsData.discovery_logo || '/logo.png',
      music: settingsData.discovery_music || '/bg-music.mp3',
      bgImage: settingsData.discovery_bg_image || '/bg-image.jpg',
    },
  };
}

/**
 * 获取应用设置（从数据库）
 */
export async function getSettings(): Promise<Settings | null> {
  try {
    const result = await db.select().from(settings);
    
    if (result.length === 0) {
      console.warn('应用设置不存在，使用默认值');
      return getDefaultSettings();
    }

    // 将键值对转换为对象
    const settingsData: Record<string, any> = {};
    result.forEach(item => {
      settingsData[item.key] = item.value;
    });

    return transformSettings(settingsData);
  } catch (error) {
    console.error('获取应用设置失败:', error);
    return getDefaultSettings();
  }
}

/**
 * 获取默认设置
 */
function getDefaultSettings(): Settings {
  return {
    navigation: {
      discovery: { icon: '💡', label: '发现光亮' },
      ignition: { icon: '🔥', label: '点亮事业' },
      profile: { icon: '👤', label: '个人中心' },
    },
    pageTitles: {
      discovery: '发现光亮',
      activities: '活动',
      visit: '探访',
      assets: '资产',
      declarations: '高燃宣告',
      connection: '连接',
      consultation: '咨询',
    },
    discovery: {
      slogan: '能力连接 · 困境解决',
      logo: '/logo.png',
      music: '/bg-music.mp3',
      bgImage: '/bg-image.jpg',
    },
  };
}
