/**
 * 用户服务
 *
 * 提供用户数据的 CRUD 操作
 * 所有数据格式统一为前端需要的 camelCase 格式
 */

import { db, users } from '@/lib/db';
import { eq, desc, and, inArray, sql } from 'drizzle-orm';
import { User } from './types';
import { snakeToCamel, safeParseJson, withDefault, parseDate } from './utils';

/**
 * 转换用户数据（从数据库格式到前端格式）
 */
function transformUser(data: any): User {
  return {
    id: data.id,
    name: withDefault(data.name, '用户'),
    email: withDefault(data.email, ''),
    avatar: withDefault(data.avatar, '/default-avatar.svg'),
    age: data.age ?? null,
    company: data.company ?? null,
    position: data.position ?? null,
    phone: data.phone ?? null,
    gender: data.gender ?? null,
    companyScale: data.company_scale ?? null,
    tags: safeParseJson(data.tags, []),
    hardcoreTags: safeParseJson(data.hardcore_tags, []),
    abilityTags: safeParseJson(data.ability_tags, []),
    resourceTags: safeParseJson(data.resource_tags, []),
    status: withDefault(data.status, 'active'),
    isFeatured: withDefault(data.is_featured, false),
    joinDate: parseDate(data.join_date) || new Date(),
    lastLogin: parseDate(data.last_login),
    createdAt: parseDate(data.created_at) || new Date(),
    updatedAt: parseDate(data.updated_at),
  };
}

/**
 * 获取单个用户
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (result.length === 0) {
      console.warn(`用户不存在: ${id}`);
      return null;
    }

    return transformUser(result[0]);
  } catch (error) {
    console.error('获取用户失败:', error);
    return null;
  }
}

/**
 * 获取所有用户（分页）
 */
export async function getUsers(options?: {
  page?: number;
  limit?: number;
  status?: string;
  isFeatured?: boolean;
}): Promise<{ users: User[]; total: number }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];
    if (options?.status) {
      conditions.push(eq(users.status, options.status));
    }
    if (options?.isFeatured !== undefined) {
      conditions.push(eq(users.is_featured, options.isFeatured));
    }

    // 获取数据
    const result = await db
      .select()
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.created_at))
      .limit(limit)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      users: result.map(transformUser),
      total: Number(count),
    };
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return { users: [], total: 0 };
  }
}

/**
 * 根据邮箱获取用户
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }

    return transformUser(result[0]);
  } catch (error) {
    console.error('根据邮箱获取用户失败:', error);
    return null;
  }
}

/**
 * 创建用户
 */
export async function createUser(userData: Partial<User>): Promise<User | null> {
  try {
    const insertData: any = {
      name: userData.name || '',
      avatar: userData.avatar || null,
      status: userData.status || 'active',
      is_featured: userData.isFeatured || false,
      join_date: userData.joinDate || new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // 可选字段
    if (userData.id) insertData.id = userData.id;
    if (userData.email) insertData.email = userData.email;
    if (userData.age !== undefined) insertData.age = userData.age;
    if (userData.company) insertData.company = userData.company;
    if (userData.position) insertData.position = userData.position;
    if (userData.phone) insertData.phone = userData.phone;
    if (userData.gender) insertData.gender = userData.gender;
    if (userData.companyScale) insertData.company_scale = userData.companyScale;
    if (userData.tags) insertData.ability_tags = JSON.stringify(userData.tags);
    if (userData.hardcoreTags) insertData.hardcore_tags = JSON.stringify(userData.hardcoreTags);
    if (userData.abilityTags) insertData.ability_tags = JSON.stringify(userData.abilityTags);
    if (userData.resourceTags) insertData.resource_tags = JSON.stringify(userData.resourceTags);
    if (userData.lastLogin) insertData.last_login = userData.lastLogin;

    const result = await db
      .insert(users)
      .values(insertData)
      .returning();

    return transformUser(result[0]);
  } catch (error) {
    console.error('创建用户失败:', error);
    return null;
  }
}

/**
 * 更新用户
 */
export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.avatar !== undefined) updateData.avatar = userData.avatar;
    if (userData.age !== undefined) updateData.age = userData.age;
    if (userData.company !== undefined) updateData.company = userData.company;
    if (userData.position !== undefined) updateData.position = userData.position;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    if (userData.gender !== undefined) updateData.gender = userData.gender;
    if (userData.companyScale !== undefined) updateData.company_scale = userData.companyScale;
    if (userData.tags !== undefined) updateData.tags = JSON.stringify(userData.tags);
    if (userData.hardcoreTags !== undefined) updateData.hardcore_tags = JSON.stringify(userData.hardcoreTags);
    if (userData.abilityTags !== undefined) updateData.ability_tags = JSON.stringify(userData.abilityTags);
    if (userData.resourceTags !== undefined) updateData.resource_tags = JSON.stringify(userData.resourceTags);
    if (userData.status !== undefined) updateData.status = userData.status;
    if (userData.isFeatured !== undefined) updateData.is_featured = userData.isFeatured;
    if (userData.lastLogin !== undefined) updateData.last_login = userData.lastLogin;

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) {
      console.warn(`更新用户失败，用户不存在: ${id}`);
      return null;
    }

    return transformUser(result[0]);
  } catch (error) {
    console.error('更新用户失败:', error);
    return null;
  }
}

/**
 * 删除用户
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error('删除用户失败:', error);
    return false;
  }
}

/**
 * 获取精选用户
 */
export async function getFeaturedUsers(limit: number = 10): Promise<User[]> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.is_featured, true))
      .orderBy(desc(users.created_at))
      .limit(limit);

    return result.map(transformUser);
  } catch (error) {
    console.error('获取精选用户失败:', error);
    return [];
  }
}
