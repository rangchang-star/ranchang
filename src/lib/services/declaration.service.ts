/**
 * 宣告服务
 *
 * 功能：
 * 1. 统一的宣告数据获取
 * 2. 数据格式转换（API → 前端）
 * 3. 默认值处理（防止 undefined）
 */

import { fetchApi, postApi, putApi, deleteApi, apiClient } from '@/lib/api/client';
import type { Declaration, RawDeclaration, PaginationParams } from '@/lib/services/types';

// ============================================================
// 数据转换函数
// ============================================================

/**
 * 将原始宣告数据转换为前端格式
 */
function transformDeclaration(raw: RawDeclaration): Declaration {
  return {
    id: raw.id,
    userId: raw.user_id || '',
    direction: raw.direction,
    text: raw.text || '',
    summary: raw.summary || '',
    audioUrl: raw.audio_url,
    views: raw.views || 0,
    date: new Date(raw.date),
    isFeatured: raw.is_featured || false,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

// ============================================================
// 宣告服务类
// ============================================================

export class DeclarationService {
  /**
   * 获取单个宣告
   */
  static async getById(id: string): Promise<Declaration | null> {
    try {
      const response = await fetchApi<RawDeclaration>(`/declarations/${id}`);
      if (response.success && response.data) {
        return transformDeclaration(response.data);
      }
      return null;
    } catch (error) {
      console.error(`获取宣告 ${id} 失败:`, error);
      return null;
    }
  }

  /**
   * 获取宣告列表
   */
  static async getList(params?: PaginationParams & {
    userId?: string;
    isFeatured?: boolean;
  }): Promise<{ declarations: Declaration[]; total: number }> {
    try {
      const queryParams = apiClient.buildQueryParams({
        page: params?.page || 1,
        limit: params?.limit || 10,
        user_id: params?.userId,
        is_featured: params?.isFeatured,
      });

      const response = await fetchApi<RawDeclaration[]>(
        `/declarations?${queryParams}`
      );

      if (response.success && response.data) {
        const declarations = response.data.map(transformDeclaration);
        return {
          declarations,
          total: response.pagination?.total || 0,
        };
      }

      return { declarations: [], total: 0 };
    } catch (error) {
      console.error('获取宣告列表失败:', error);
      return { declarations: [], total: 0 };
    }
  }

  /**
   * 获取精选宣告
   */
  static async getFeatured(limit: number = 5): Promise<Declaration[]> {
    const result = await this.getList({ isFeatured: true, limit });
    return result.declarations;
  }

  /**
   * 创建宣告
   */
  static async create(data: Partial<Declaration>): Promise<Declaration | null> {
    try {
      // 转换为 snake_case 格式
      const createData: any = {};
      if (data.userId) createData.user_id = data.userId;
      if (data.direction) createData.direction = data.direction;
      if (data.text) createData.text = data.text;
      if (data.summary) createData.summary = data.summary;
      if (data.audioUrl) createData.audio_url = data.audioUrl;
      if (data.date) createData.date = data.date.toISOString().split('T')[0];
      if (data.isFeatured) createData.is_featured = data.isFeatured;

      const response = await postApi<RawDeclaration>('/declarations', createData);

      if (response.success && response.data) {
        return transformDeclaration(response.data);
      }
      return null;
    } catch (error) {
      console.error('创建宣告失败:', error);
      return null;
    }
  }

  /**
   * 更新宣告
   */
  static async update(id: string, data: Partial<Declaration>): Promise<Declaration | null> {
    try {
      // 转换为 snake_case 格式
      const updateData: any = {};
      if (data.direction !== undefined) updateData.direction = data.direction;
      if (data.text !== undefined) updateData.text = data.text;
      if (data.summary !== undefined) updateData.summary = data.summary;
      if (data.audioUrl !== undefined) updateData.audio_url = data.audioUrl;
      if (data.views !== undefined) updateData.views = data.views;
      if (data.isFeatured !== undefined) updateData.is_featured = data.isFeatured;

      const response = await putApi<RawDeclaration>(`/declarations/${id}`, updateData);

      if (response.success && response.data) {
        return transformDeclaration(response.data);
      }
      return null;
    } catch (error) {
      console.error(`更新宣告 ${id} 失败:`, error);
      return null;
    }
  }

  /**
   * 删除宣告
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const response = await deleteApi(`/declarations/${id}`);
      return response.success;
    } catch (error) {
      console.error(`删除宣告 ${id} 失败:`, error);
      return false;
    }
  }
}
