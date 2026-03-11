/**
 * 设置服务
 *
 * 功能：
 * 1. 统一的设置数据获取
 * 2. 将分散的 key-value 设置组装成前端需要的结构
 * 3. 默认值处理（防止 undefined）
 */

import { fetchApi, postApi, putApi, apiClient } from '@/lib/api/client';
import type { Settings, RawSettings } from '@/lib/services/types';

// ============================================================
// 默认设置值
// ============================================================

const DEFAULT_SETTINGS: Settings = {
  navigation: {
    discovery: { icon: 'flame', label: '发现光亮' },
    ignition: { icon: 'trending-up', label: '点亮事业' },
    profile: { icon: 'user', label: '个人中心' },
  },
  pageTitles: {
    discovery: '发现光亮',
    activities: '活动列表',
    visit: '探访点亮',
    assets: '能力资产',
    declarations: '高燃宣告',
    connection: '能力连接',
    consultation: '专家咨询',
  },
  discovery: {
    slogan: '发现光亮，点亮事业',
    logo: '/logo-ranchang.png',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bgImage: '/discovery-bg.jpg',
  },
};

// ============================================================
// 数据转换函数
// ============================================================

/**
 * 将原始设置数据转换为前端格式
 * 将分散的 key-value 设置组装成结构化对象
 */
function transformSettings(rawList: RawSettings[]): Settings {
  const settings: Settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

  rawList.forEach((item) => {
    const key = item.key;

    // 处理 navigation.* 设置
    if (key.startsWith('navigation.')) {
      const navKey = key.split('.')[1] as keyof Settings['navigation'];
      if (settings.navigation[navKey]) {
        settings.navigation[navKey] = item.value;
      }
    }

    // 处理 pageTitles.* 设置
    else if (key.startsWith('pageTitles.')) {
      const pageTitleKey = key.split('.')[1] as keyof Settings['pageTitles'];
      if (settings.pageTitles[pageTitleKey]) {
        settings.pageTitles[pageTitleKey] = item.value;
      }
    }

    // 处理 discovery.* 设置
    else if (key.startsWith('discovery.')) {
      const discoveryKey = key.split('.')[1] as keyof Settings['discovery'];
      if (settings.discovery[discoveryKey]) {
        settings.discovery[discoveryKey] = item.value;
      }
    }
  });

  return settings;
}

// ============================================================
// 设置服务类
// ============================================================

export class SettingsService {
  /**
   * 获取所有设置
   */
  static async getAll(): Promise<Settings> {
    try {
      // 获取所有设置（不分页）
      const queryParams = apiClient.buildQueryParams({
        limit: 100, // 获取所有设置
      });

      const response = await fetchApi<RawSettings[]>(
        `/settings?${queryParams}`
      );

      if (response.success && response.data) {
        return transformSettings(response.data);
      }

      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('获取设置失败:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * 获取单个设置项
   */
  static async getByKey(key: string): Promise<any> {
    try {
      const response = await fetchApi<RawSettings[]>(
        `/settings?key=${key}`
      );

      if (response.success && response.data && response.data.length > 0) {
        return response.data[0].value;
      }

      return null;
    } catch (error) {
      console.error(`获取设置 ${key} 失败:`, error);
      return null;
    }
  }

  /**
   * 更新设置
   */
  static async update(key: string, value: any): Promise<boolean> {
    try {
      // 检查设置是否存在
      const existing = await this.getByKey(key);

      if (existing) {
        // 更新现有设置
        const response = await putApi(`/settings?key=${key}`, { value });
        return response.success;
      } else {
        // 创建新设置
        const response = await postApi('/settings', { key, value });
        return response.success;
      }
    } catch (error) {
      console.error(`更新设置 ${key} 失败:`, error);
      return false;
    }
  }

  /**
   * 批量更新设置
   */
  static async updateMany(settings: Partial<Settings>): Promise<boolean> {
    try {
      const promises: Promise<boolean>[] = [];

      // 更新 navigation 设置
      if (settings.navigation) {
        Object.entries(settings.navigation).forEach(([key, value]) => {
          promises.push(this.update(`navigation.${key}`, value));
        });
      }

      // 更新 pageTitles 设置
      if (settings.pageTitles) {
        Object.entries(settings.pageTitles).forEach(([key, value]) => {
          promises.push(this.update(`pageTitles.${key}`, value));
        });
      }

      // 更新 discovery 设置
      if (settings.discovery) {
        Object.entries(settings.discovery).forEach(([key, value]) => {
          promises.push(this.update(`discovery.${key}`, value));
        });
      }

      const results = await Promise.all(promises);
      return results.every(result => result);
    } catch (error) {
      console.error('批量更新设置失败:', error);
      return false;
    }
  }
}
