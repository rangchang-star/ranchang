/**
 * 活动服务
 *
 * 提供活动数据的 CRUD 操作
 * 所有数据格式统一为前端需要的 camelCase 格式
 */

import { db, activities } from '@/lib/db';
import { eq, desc, and, sql, or, like } from 'drizzle-orm';
import { Activity } from './types';
import { withDefault, parseDate } from './utils';

/**
 * 转换活动数据（从数据库格式到前端格式）
 */
function transformActivity(data: any): Activity {
  return {
    id: data.id,
    title: withDefault(data.title, ''),
    subtitle: withDefault(data.subtitle, ''),
    category: withDefault(data.type, '其他'),
    description: withDefault(data.description, ''),
    image: withDefault(data.cover_image, '/default-activity.png'),
    address: withDefault(data.location, ''),
    startDate: parseDate(data.date) || new Date(),
    endDate: parseDate(data.date) || new Date(),
    capacity: withDefault(data.capacity, 0),
    teaFee: withDefault(data.tea_fee, 0),
    status: withDefault(data.status, 'pending'),
    createdBy: withDefault(data.created_by, ''),
    createdAt: parseDate(data.created_at) || new Date(),
    updatedAt: parseDate(data.updated_at) || new Date(),
  };
}

/**
 * 获取单个活动
 */
export async function getActivityById(id: string): Promise<Activity | null> {
  try {
    const result = await db.select().from(activities).where(eq(activities.id, id)).limit(1);
    
    if (result.length === 0) {
      console.warn(`活动不存在: ${id}`);
      return null;
    }

    return transformActivity(result[0]);
  } catch (error) {
    console.error('获取活动失败:', error);
    return null;
  }
}

/**
 * 获取所有活动（分页）
 */
export async function getActivities(options?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}): Promise<{ activities: Activity[]; total: number }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];
    if (options?.category) {
      conditions.push(eq(activities.type, options.category));
    }
    if (options?.status) {
      conditions.push(eq(activities.status, options.status));
    }
    if (options?.search) {
      conditions.push(
        or(
          like(activities.title, `%${options.search}%`),
          like(activities.description, `%${options.search}%`)
        )!
      );
    }

    // 获取数据
    const result = await db
      .select()
      .from(activities)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(activities.date))
      .limit(limit)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(activities)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      activities: result.map(transformActivity),
      total: Number(count),
    };
  } catch (error) {
    console.error('获取活动列表失败:', error);
    return { activities: [], total: 0 };
  }
}

/**
 * 获取热门活动
 */
export async function getFeaturedActivities(limit: number = 10): Promise<Activity[]> {
  try {
    const result = await db
      .select()
      .from(activities)
      .where(eq(activities.status, 'active'))
      .orderBy(desc(activities.created_at))
      .limit(limit);

    return result.map(transformActivity);
  } catch (error) {
    console.error('获取热门活动失败:', error);
    return [];
  }
}

/**
 * 获取活动分类列表
 */
export async function getActivityCategories(): Promise<string[]> {
  try {
    const result = await db
      .select({ category: activities.type })
      .from(activities)
      .groupBy(activities.type);

    return result
      .map(r => r.category)
      .filter((c): c is string => Boolean(c));
  } catch (error) {
    console.error('获取活动分类失败:', error);
    return [];
  }
}

/**
 * 创建活动
 */
export async function createActivity(activityData: Partial<Activity>): Promise<Activity | null> {
  try {
    const result = await db
      .insert(activities)
      .values({
        id: activityData.id,
        title: activityData.title || '',
        description: activityData.description || '',
        date: activityData.startDate || new Date(),
        start_time: activityData.startDate?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        end_time: activityData.endDate?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        location: activityData.address || '',
        capacity: activityData.capacity,
        type: activityData.category || '其他',
        cover_image: activityData.image || '/default-activity.png',
        status: activityData.status || 'draft',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return transformActivity(result[0]);
  } catch (error) {
    console.error('创建活动失败:', error);
    return null;
  }
}

/**
 * 更新活动
 */
export async function updateActivity(id: string, activityData: Partial<Activity>): Promise<Activity | null> {
  try {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (activityData.title !== undefined) updateData.title = activityData.title;
    if (activityData.description !== undefined) updateData.description = activityData.description;
    if (activityData.address !== undefined) updateData.location = activityData.address;
    if (activityData.startDate !== undefined) {
      updateData.date = activityData.startDate;
      updateData.start_time = activityData.startDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    }
    if (activityData.endDate !== undefined) {
      updateData.end_time = activityData.endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    }
    if (activityData.capacity !== undefined) updateData.capacity = activityData.capacity;
    if (activityData.category !== undefined) updateData.type = activityData.category;
    if (activityData.image !== undefined) updateData.cover_image = activityData.image;
    if (activityData.status !== undefined) updateData.status = activityData.status;

    const result = await db
      .update(activities)
      .set(updateData)
      .where(eq(activities.id, id))
      .returning();

    if (result.length === 0) {
      console.warn(`更新活动失败，活动不存在: ${id}`);
      return null;
    }

    return transformActivity(result[0]);
  } catch (error) {
    console.error('更新活动失败:', error);
    return null;
  }
}

/**
 * 删除活动
 */
export async function deleteActivity(id: string): Promise<boolean> {
  try {
    const result = await db
      .delete(activities)
      .where(eq(activities.id, id))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error('删除活动失败:', error);
    return false;
  }
}

/**
 * 获取即将开始的活动
 */
export async function getUpcomingActivities(limit: number = 10): Promise<Activity[]> {
  try {
    const now = new Date();
    const result = await db
      .select()
      .from(activities)
      .where(and(
        eq(activities.status, 'active'),
        sql`${activities.date} >= ${now}`
      ))
      .orderBy(activities.date)
      .limit(limit);

    return result.map(transformActivity);
  } catch (error) {
    console.error('获取即将开始的活动失败:', error);
    return [];
  }
}
