/**
 * 用户服务
 *
 * 功能：
 * 1. 统一的用户数据获取
 * 2. 数据格式转换（API → 前端）
 * 3. 默认值处理（防止 undefined）
 */

import { fetchApi, postApi, putApi, deleteApi, apiClient } from '@/lib/api/client';
import type { User, RawUser, PaginationParams } from '@/lib/services/types';

// ============================================================
// 数据转换函数
// ============================================================

/**
 * 将原始用户数据转换为前端格式
 *
 * 核心原则：所有字段都保证有值，防止 undefined 错误
 */
function transformUser(raw: RawUser): User {
  // 处理 JSONB 字段（tags 可能为 null 或对象）
  const parseTags = (tags: any): string[] => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'object' && tags !== null) return Object.values(tags);
    return [];
  };

  return {
    id: raw.id,
    name: raw.name || '匿名用户', // 默认值
    email: raw.email || '',
    avatar: raw.avatar || '/avatar-default.jpg', // 默认头像
    age: raw.age,
    company: raw.company,
    position: raw.position,
    phone: raw.phone,
    gender: raw.gender,
    companyScale: raw.company_scale,
    tags: parseTags(raw.tags),
    hardcoreTags: parseTags(raw.hardcore_tags),
    abilityTags: parseTags(raw.ability_tags),
    resourceTags: parseTags(raw.resource_tags),
    status: raw.status || 'active',
    isFeatured: raw.is_featured || false,
    joinDate: raw.join_date ? new Date(raw.join_date) : new Date(),
    lastLogin: raw.last_login ? new Date(raw.last_login) : null,
    createdAt: raw.created_at ? new Date(raw.created_at) : new Date(),
    updatedAt: raw.updated_at ? new Date(raw.updated_at) : null,
  };
}

// ============================================================
// 用户服务类
// ============================================================

export class UserService {
  /**
   * 获取单个用户
   */
  static async getById(id: string): Promise<User | null> {
    try {
      const response = await fetchApi<RawUser>(`/users/${id}`);
      if (response.success && response.data) {
        return transformUser(response.data);
      }
      return null;
    } catch (error) {
      console.error(`获取用户 ${id} 失败:`, error);
      return null;
    }
  }

  /**
   * 获取用户列表
   */
  static async getList(params?: PaginationParams & {
    status?: string;
    isFeatured?: boolean;
  }): Promise<{ users: User[]; total: number }> {
    try {
      const queryParams = apiClient.buildQueryParams({
        page: params?.page || 1,
        limit: params?.limit || 10,
        status: params?.status,
        is_featured: params?.isFeatured,
      });

      const response = await fetchApi<RawUser[]>(
        `/users?${queryParams}`
      );

      if (response.success && response.data) {
        const users = response.data.map(transformUser);
        return {
          users,
          total: response.pagination?.total || 0,
        };
      }

      return { users: [], total: 0 };
    } catch (error) {
      console.error('获取用户列表失败:', error);
      return { users: [], total: 0 };
    }
  }

  /**
   * 创建用户
   */
  static async create(data: Partial<User>): Promise<User | null> {
    try {
      // 转换为 snake_case 格式
      const createData: any = {};
      if (data.name) createData.name = data.name;
      if (data.email) createData.email = data.email;
      if (data.avatar) createData.avatar = data.avatar;
      if (data.age) createData.age = data.age;
      if (data.company) createData.company = data.company;
      if (data.position) createData.position = data.position;
      if (data.phone) createData.phone = data.phone;
      if (data.gender) createData.gender = data.gender;
      if (data.companyScale) createData.company_scale = data.companyScale;
      if (data.tags) createData.tags = data.tags;
      if (data.hardcoreTags) createData.hardcore_tags = data.hardcoreTags;
      if (data.abilityTags) createData.ability_tags = data.abilityTags;
      if (data.resourceTags !== undefined) createData.resource_tags = data.resourceTags;

      const response = await postApi<RawUser>('/users', createData);

      if (response.success && response.data) {
        return transformUser(response.data);
      }
      return null;
    } catch (error) {
      console.error('创建用户失败:', error);
      return null;
    }
  }

  /**
   * 更新用户
   */
  static async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      // 转换为 snake_case 格式
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;
      if (data.age !== undefined) updateData.age = data.age;
      if (data.company !== undefined) updateData.company = data.company;
      if (data.position !== undefined) updateData.position = data.position;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.gender !== undefined) updateData.gender = data.gender;
      if (data.companyScale !== undefined) updateData.company_scale = data.companyScale;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.hardcoreTags !== undefined) updateData.hardcore_tags = data.hardcoreTags;
      if (data.abilityTags !== undefined) updateData.ability_tags = data.abilityTags;
      if (data.resourceTags !== undefined) updateData.resource_tags = data.resourceTags;

      const response = await putApi<RawUser>(`/users/${id}`, updateData);

      if (response.success && response.data) {
        return transformUser(response.data);
      }
      return null;
    } catch (error) {
      console.error(`更新用户 ${id} 失败:`, error);
      return null;
    }
  }

  /**
   * 删除用户
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const response = await deleteApi(`/users/${id}`);
      return response.success;
    } catch (error) {
      console.error(`删除用户 ${id} 失败:`, error);
      return false;
    }
  }
}
