/**
 * 活动服务
 *
 * 功能：
 * 1. 统一的活动数据获取
 * 2. 数据格式转换（API → 前端）
 * 3. 默认值处理（防止 undefined）
 */

import { fetchApi, postApi, putApi, deleteApi, apiClient } from '@/lib/api/client';
import type { Activity, RawActivity, PaginationParams } from '@/lib/services/types';

// ============================================================
// 数据转换函数
// ============================================================

/**
 * 将原始活动数据转换为前端格式
 */
function transformActivity(raw: RawActivity): Activity {
  return {
    id: raw.id.toString(),
    title: raw.title || '未命名活动',
    subtitle: raw.subtitle || '',
    category: raw.category || '其他',
    description: raw.description || '',
    image: raw.image || '/default-activity.jpg',
    address: raw.address || '待定',
    startDate: new Date(raw.start_date),
    endDate: new Date(raw.end_date),
    capacity: raw.capacity || 0,
    teaFee: raw.tea_fee || 0,
    status: raw.status || 'draft',
    createdBy: raw.created_by?.toString() || '',
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

// ============================================================
// 活动服务类
// ============================================================

export class ActivityService {
  /**
   * 获取单个活动
   */
  static async getById(id: string | number): Promise<Activity | null> {
    try {
      const response = await fetchApi<RawActivity>(`/activities/${id}`);
      if (response.success && response.data) {
        return transformActivity(response.data);
      }
      return null;
    } catch (error) {
      console.error(`获取活动 ${id} 失败:`, error);
      return null;
    }
  }

  /**
   * 获取活动列表
   */
  static async getList(params?: PaginationParams & {
    status?: string;
    category?: string;
  }): Promise<{ activities: Activity[]; total: number }> {
    try {
      const queryParams = apiClient.buildQueryParams({
        page: params?.page || 1,
        limit: params?.limit || 10,
        status: params?.status,
        category: params?.category,
      });

      const response = await fetchApi<RawActivity[]>(
        `/activities?${queryParams}`
      );

      if (response.success && response.data) {
        const activities = response.data.map(transformActivity);
        return {
          activities,
          total: response.pagination?.total || 0,
        };
      }

      return { activities: [], total: 0 };
    } catch (error) {
      console.error('获取活动列表失败:', error);
      return { activities: [], total: 0 };
    }
  }

  /**
   * 获取活跃的活动
   */
  static async getActive(limit: number = 10): Promise<Activity[]> {
    const result = await this.getList({ status: 'active', limit });
    return result.activities;
  }

  /**
   * 创建活动
   */
  static async create(data: Partial<Activity>): Promise<Activity | null> {
    try {
      // 转换为 snake_case 格式
      const createData: any = {};
      if (data.title) createData.title = data.title;
      if (data.subtitle) createData.subtitle = data.subtitle;
      if (data.category) createData.category = data.category;
      if (data.description) createData.description = data.description;
      if (data.image) createData.image = data.image;
      if (data.address) createData.address = data.address;
      if (data.startDate) createData.date = data.startDate.toISOString();
      if (data.capacity) createData.capacity = data.capacity;
      if (data.status) createData.status = data.status;
      if (data.createdBy) createData.createdBy = parseInt(data.createdBy);

      const response = await postApi<RawActivity>('/activities', createData);

      if (response.success && response.data) {
        return transformActivity(response.data);
      }
      return null;
    } catch (error) {
      console.error('创建活动失败:', error);
      return null;
    }
  }

  /**
   * 更新活动
   */
  static async update(id: string | number, data: Partial<Activity>): Promise<Activity | null> {
    try {
      // 转换为 snake_case 格式
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.capacity !== undefined) updateData.capacity = data.capacity;
      if (data.status !== undefined) updateData.status = data.status;

      const response = await putApi<RawActivity>(`/activities/${id}`, updateData);

      if (response.success && response.data) {
        return transformActivity(response.data);
      }
      return null;
    } catch (error) {
      console.error(`更新活动 ${id} 失败:`, error);
      return null;
    }
  }

  /**
   * 删除活动
   */
  static async delete(id: string | number): Promise<boolean> {
    try {
      const response = await deleteApi(`/activities/${id}`);
      return response.success;
    } catch (error) {
      console.error(`删除活动 ${id} 失败:`, error);
      return false;
    }
  }
}
