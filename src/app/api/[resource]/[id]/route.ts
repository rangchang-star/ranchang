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

// 安全的资源名称白名单
const VALID_RESOURCES = [
  'users', 'activities', 'visits', 'declarations', 'daily_declarations',
  'activity_registrations', 'notifications', 'documents', 'visit_records', 'settings'
];

function isValidResource(resource: string): boolean {
  return VALID_RESOURCES.includes(resource);
}

// GET /api/[resource]/[id] - 查询单条
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;

  if (!isValidResource(resource)) {
    return Response.json(
      { success: false, error: `Invalid resource: ${resource}` },
      { status: 400 }
    );
  }

  try {
    const result = await client`
      SELECT * FROM public.${client(resource)} WHERE id = ${id}
    `;

    if (!result || result.length === 0) {
      return Response.json(
        { success: false, error: `${resource} not found` },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: toCamelCase(result[0])
    });
  } catch (error: any) {
    console.error(`GET /api/${resource}/${id} 失败:`, error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/[resource]/[id] - 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;

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
      UPDATE public.${client(resource)} SET ${client(snakeData)} WHERE id = ${id} RETURNING *
    `;

    if (!result || result.length === 0) {
      return Response.json(
        { success: false, error: `${resource} not found` },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: toCamelCase(result[0]),
      message: `${resource} updated successfully`
    });
  } catch (error: any) {
    console.error(`PUT /api/${resource}/${id} 失败:`, error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/[resource]/[id] - 删除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;

  if (!isValidResource(resource)) {
    return Response.json(
      { success: false, error: `Invalid resource: ${resource}` },
      { status: 400 }
    );
  }

  try {
    const result = await client`
      DELETE FROM public.${client(resource)} WHERE id = ${id} RETURNING *
    `;

    if (!result || result.length === 0) {
      return Response.json(
        { success: false, error: `${resource} not found` },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: toCamelCase(result[0]),
      message: `${resource} deleted successfully`
    });
  } catch (error: any) {
    console.error(`DELETE /api/${resource}/${id} 失败:`, error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
