import { NextRequest } from 'next/server';
import { client } from '@/storage/database/supabase/connection';

// 字段名转换：snake_case <-> camelCase
function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;

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

// 安全的资源名称白名单（防止SQL注入）
const VALID_RESOURCES = [
  'users', 'activities', 'visits', 'declarations', 'daily_declarations',
  'activity_registrations', 'notifications', 'documents', 'visit_records', 'settings'
];

// 验证资源名称
function isValidResource(resource: string): boolean {
  return VALID_RESOURCES.includes(resource);
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

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const order = searchParams.get('order') || 'DESC';

    // 构建WHERE条件
    const conditions: string[] = [];
    const params2: any[] = [];

    searchParams.forEach((value, key) => {
      if (!['page', 'limit', 'orderBy', 'order', 'id'].includes(key)) {
        conditions.push(`"${key}" = $${conditions.length + 1}`);
        params2.push(value);
      }
    });

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // 查询总数
    const countResult = await client.unsafe(
      `SELECT COUNT(*) as total FROM public."${resource}" ${whereClause}`,
      params2
    );
    const total = parseInt(countResult[0].total);

    // 查询数据
    const dataResult = await client.unsafe(
      `SELECT * FROM public."${resource}" ${whereClause} ORDER BY "${orderBy}" ${order} LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2}`,
      [...params2, limit, offset]
    );

    const result = dataResult.map(toCamelCase);

    return Response.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
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

  try {
    const body = await request.json();
    const snakeData = toSnakeCase(body);

    const result = await client`
      INSERT INTO public.${client(resource)} ${client(snakeData)}
      RETURNING *
    `;

    if (!result || result.length === 0) {
      return Response.json(
        { success: false, error: `Failed to create ${resource}` },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: toCamelCase(result[0]),
      message: `${resource} created successfully`
    });
  } catch (error: any) {
    console.error(`POST /api/${resource} 失败:`, error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
