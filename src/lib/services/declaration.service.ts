/**
 * 宣告服务
 *
 * 提供宣告数据的 CRUD 操作
 * 所有数据格式统一为前端需要的 camelCase 格式
 */

import { db, declarations } from '@/lib/db';
import { eq, desc, and, sql, or, like } from 'drizzle-orm';
import { Declaration } from './types';
import { withDefault, parseDate } from './utils';

/**
 * 转换宣告数据（从数据库格式到前端格式）
 */
function transformDeclaration(data: any): Declaration {
  return {
    id: data.id,
    userId: withDefault(data.user_id, ''),
    direction: data.direction ?? null,
    text: withDefault(data.text, ''),
    summary: data.summary ?? null,
    audioUrl: data.audio_url ?? null,
    views: withDefault(data.views, 0),
    date: parseDate(data.date) || new Date(),
    isFeatured: withDefault(data.is_featured, false),
    createdAt: parseDate(data.created_at) || new Date(),
    updatedAt: parseDate(data.updated_at) || new Date(),
  };
}

/**
 * 获取单个宣告
 */
export async function getDeclarationById(id: string): Promise<Declaration | null> {
  try {
    const result = await db.select().from(declarations).where(eq(declarations.id, id)).limit(1);
    
    if (result.length === 0) {
      console.warn(`宣告不存在: ${id}`);
      return null;
    }

    return transformDeclaration(result[0]);
  } catch (error) {
    console.error('获取宣告失败:', error);
    return null;
  }
}

/**
 * 获取所有宣告（分页）
 */
export async function getDeclarations(options?: {
  page?: number;
  limit?: number;
  userId?: string;
  isFeatured?: boolean;
  search?: string;
}): Promise<{ declarations: Declaration[]; total: number }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];
    if (options?.userId) {
      conditions.push(eq(declarations.user_id, options.userId));
    }
    if (options?.isFeatured !== undefined) {
      conditions.push(eq(declarations.is_featured, options.isFeatured));
    }
    if (options?.search) {
      conditions.push(
        or(
          like(declarations.text, `%${options.search}%`),
          like(declarations.summary, `%${options.search}%`)
        )!
      );
    }

    // 获取数据
    const result = await db
      .select()
      .from(declarations)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(declarations.date))
      .limit(limit)
      .offset(offset);

    // 获取总数
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(declarations)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      declarations: result.map(transformDeclaration),
      total: Number(count),
    };
  } catch (error) {
    console.error('获取宣告列表失败:', error);
    return { declarations: [], total: 0 };
  }
}

/**
 * 获取用户的宣告
 */
export async function getUserDeclarations(userId: string, limit: number = 10): Promise<Declaration[]> {
  try {
    const result = await db
      .select()
      .from(declarations)
      .where(eq(declarations.user_id, userId))
      .orderBy(desc(declarations.date))
      .limit(limit);

    return result.map(transformDeclaration);
  } catch (error) {
    console.error('获取用户宣告失败:', error);
    return [];
  }
}

/**
 * 获取精选宣告
 */
export async function getFeaturedDeclarations(limit: number = 10): Promise<Declaration[]> {
  try {
    const result = await db
      .select()
      .from(declarations)
      .where(eq(declarations.is_featured, true))
      .orderBy(desc(declarations.date))
      .limit(limit);

    return result.map(transformDeclaration);
  } catch (error) {
    console.error('获取精选宣告失败:', error);
    return [];
  }
}

/**
 * 创建宣告
 */
export async function createDeclaration(declarationData: Partial<Declaration>): Promise<Declaration | null> {
  try {
    const insertData: any = {
      user_id: declarationData.userId || '',
      direction: declarationData.direction ?? null,
      text: declarationData.text || '',
      summary: declarationData.summary ?? null,
      audio_url: declarationData.audioUrl ?? null,
      views: declarationData.views || 0,
      date: declarationData.date || new Date(),
      is_featured: declarationData.isFeatured || false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (declarationData.id) {
      insertData.id = declarationData.id;
    } else {
      // 生成随机 ID
      insertData.id = crypto.randomUUID();
    }

    const result = await db
      .insert(declarations)
      .values(insertData)
      .returning();

    return transformDeclaration(result[0]);
  } catch (error) {
    console.error('创建宣告失败:', error);
    return null;
  }
}

/**
 * 更新宣告
 */
export async function updateDeclaration(id: string, declarationData: Partial<Declaration>): Promise<Declaration | null> {
  try {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (declarationData.direction !== undefined) updateData.direction = declarationData.direction;
    if (declarationData.text !== undefined) updateData.text = declarationData.text;
    if (declarationData.summary !== undefined) updateData.summary = declarationData.summary;
    if (declarationData.audioUrl !== undefined) updateData.audio_url = declarationData.audioUrl;
    if (declarationData.views !== undefined) updateData.views = declarationData.views;
    if (declarationData.isFeatured !== undefined) updateData.is_featured = declarationData.isFeatured;

    const result = await db
      .update(declarations)
      .set(updateData)
      .where(eq(declarations.id, id))
      .returning();

    if (result.length === 0) {
      console.warn(`更新宣告失败，宣告不存在: ${id}`);
      return null;
    }

    return transformDeclaration(result[0]);
  } catch (error) {
    console.error('更新宣告失败:', error);
    return null;
  }
}

/**
 * 删除宣告
 */
export async function deleteDeclaration(id: string): Promise<boolean> {
  try {
    const result = await db
      .delete(declarations)
      .where(eq(declarations.id, id))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error('删除宣告失败:', error);
    return false;
  }
}

/**
 * 增加宣告浏览次数
 */
export async function incrementDeclarationViews(id: string): Promise<Declaration | null> {
  try {
    const result = await db
      .update(declarations)
      .set({
        views: sql`${declarations.views} + 1`,
        updated_at: new Date(),
      })
      .where(eq(declarations.id, id))
      .returning();

    if (result.length === 0) {
      return null;
    }

    return transformDeclaration(result[0]);
  } catch (error) {
    console.error('增加宣告浏览次数失败:', error);
    return null;
  }
}
