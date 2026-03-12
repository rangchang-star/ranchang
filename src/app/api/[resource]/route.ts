import { NextRequest } from 'next/server';
import { db } from '@/storage/database/supabase/connection';
import { users, activities, visits, declarations, notifications, documents, settings } from '@/storage/database/supabase/schema';
import { desc, asc, eq, and, sql } from 'drizzle-orm';

// 禁用 Next.js 缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 字段名转换：snake_case <-> camelCase
function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;

  // 如果是日期对象，转换为 ISO 字符串
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
    }
  }
  return result;
}

function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
    }
  }
  return result;
}

// 资源到表的映射
const RESOURCE_TABLES: Record<string, any> = {
  'users': users,
  'app_users': users,
  'activities': activities,
  'visits': visits,
  'declarations': declarations,
  'notifications': notifications,
  'documents': documents,
  'settings': settings,
};

// 安全的资源名称白名单
const VALID_RESOURCES = Object.keys(RESOURCE_TABLES);

// 验证资源名称
function isValidResource(resource: string): boolean {
  return VALID_RESOURCES.includes(resource);
}

// 获取表
function getTable(resource: string) {
  return RESOURCE_TABLES[resource];
}

// GET /api/[resource] - 查询列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  // 验证资源名称
  if (!isValidResource(resource)) {
    return Response.json(
      { success: false, error: `Invalid resource: ${resource}` },
      { status: 400 }
    );
  }

  const table = getTable(resource);

  if (!table) {
    return Response.json(
      { success: false, error: `Table not found for resource: ${resource}` },
      { status: 404 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const order = searchParams.get('order') || 'DESC';

    // 使用 drizzle-ORM 查询
    const orderField = (table as any)[orderBy] || (table as any).createdAt;

    // 获取总数
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(table);
    const total = Number(countResult[0].count);

    // 获取数据
    let dataResult: any[];
    
    if (resource === 'declarations') {
      // 特殊处理 declarations 表，需要 JOIN users 表
      const result = await db
        .select({
          id: declarations.id,
          userId: (declarations as any).user_id,
          direction: declarations.direction,
          text: declarations.text,
          summary: declarations.summary,
          audioUrl: (declarations as any).audio_url,
          views: declarations.views,
          date: declarations.date,
          isFeatured: (declarations as any).is_featured,
          createdAt: (declarations as any).created_at,
          updatedAt: (declarations as any).updated_at,
          userName: users.name,
          userAvatar: users.avatar,
          userPosition: users.position,
          userCompany: users.company,
        })
        .from(declarations)
        .leftJoin(users, eq((declarations as any).user_id, users.id))
        .orderBy(order === 'DESC' ? desc(orderField) : asc(orderField))
        .limit(limit)
        .offset(offset);

      // 转换为嵌套 user 对象
      dataResult = result.map((row: any) => ({
        id: row.id,
        userId: row.userId,
        direction: row.direction,
        text: row.text,
        summary: row.summary,
        audioUrl: row.audioUrl,
        views: row.views,
        date: row.date,
        isFeatured: row.isFeatured,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        user: {
          name: row.userName,
          avatar: row.userAvatar,
          position: row.userPosition,
          company: row.userCompany,
        },
      }));
    } else {
      // 普通表查询
      const result = await db
        .select()
        .from(table)
        .orderBy(order === 'DESC' ? desc(orderField) : asc(orderField))
        .limit(limit)
        .offset(offset);

      dataResult = result;
    }

    console.log(`[API DEBUG] 查询 ${resource} 结果数量: ${dataResult.length}`);
    if (dataResult.length > 0) {
      console.log(`[API DEBUG] 第一条记录:`, JSON.stringify(dataResult[0], null, 2));
    }

    const result = dataResult.map(toCamelCase);

    return Response.json(
      {
        success: true,
        data: result,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error(`GET /api/${resource} 失败:`, error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/[resource] - 创建
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  // 验证资源名称
  if (!isValidResource(resource)) {
    return Response.json(
      { success: false, error: `Invalid resource: ${resource}` },
      { status: 400 }
    );
  }

  const table = getTable(resource);

  if (!table) {
    return Response.json(
      { success: false, error: `Table not found for resource: ${resource}` },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const snakeData = toSnakeCase(body);

    // 特殊处理 declarations 表，需要手动生成 ID
    if (resource === 'declarations' && !snakeData.id) {
      snakeData.id = `decl-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    }

    // 使用 drizzle-ORM 插入
    const result = await db.insert(table).values(snakeData).returning();

    if (!result || result.length === 0) {
      return Response.json(
        { success: false, error: `Failed to create ${resource}` },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: toCamelCase(result[0]),
      message: `${resource} created successfully`,
    });
  } catch (error: any) {
    console.error(`POST /api/${resource} 失败:`, error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/[resource] - 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  // 验证资源名称
  if (!isValidResource(resource)) {
    return Response.json(
      { success: false, error: `Invalid resource: ${resource}` },
      { status: 400 }
    );
  }

  const table = getTable(resource);

  if (!table) {
    return Response.json(
      { success: false, error: `Table not found for resource: ${resource}` },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json(
        { success: false, error: 'Missing id field' },
        { status: 400 }
      );
    }

    // 使用 drizzle-ORM 更新
    const result = await db
      .update(table)
      .set({ ...toSnakeCase(updateData), updatedAt: new Date() })
      .where(eq((table as any).id, id))
      .returning();

    if (!result || result.length === 0) {
      return Response.json(
        { success: false, error: `Failed to update ${resource}` },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: toCamelCase(result[0]),
      message: `${resource} updated successfully`,
    });
  } catch (error: any) {
    console.error(`PUT /api/${resource} 失败:`, error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/[resource] - 删除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  // 验证资源名称
  if (!isValidResource(resource)) {
    return Response.json(
      { success: false, error: `Invalid resource: ${resource}` },
      { status: 400 }
    );
  }

  const table = getTable(resource);

  if (!table) {
    return Response.json(
      { success: false, error: `Table not found for resource: ${resource}` },
      { status: 404 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, error: 'Missing id parameter' },
        { status: 400 }
      );
    }

    // 使用 drizzle-ORM 删除
    await db.delete(table).where(eq((table as any).id, id));

    return Response.json({
      success: true,
      message: `${resource} deleted successfully`,
    });
  } catch (error: any) {
    console.error(`DELETE /api/${resource} 失败:`, error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
