import { NextRequest } from 'next/server';
import { client, db } from '@/storage/database/supabase/connection';
import { eq, sql } from 'drizzle-orm';
import * as schema from '@/storage/database/supabase/schema';

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

// 字段映射：前端字段名 -> 数据库实际列名
const FIELD_MAPPINGS: Record<string, Record<string, string>> = {
  users: {
    nick_name: 'name',
    occupation: 'company',
    location: 'company_scale', // 将 location 映射到 company_scale
  }
};

// 应用字段映射
function applyFieldMapping(resource: string, obj: any): any {
  if (!FIELD_MAPPINGS[resource]) {
    return obj;
  }

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const mappedKey = FIELD_MAPPINGS[resource][key] || key;
      result[mappedKey] = obj[key];
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

// 资源到 Drizzle 表的映射
const RESOURCE_TABLES: Record<string, any> = {
  users: schema.users,
  activities: schema.activities,
  visits: schema.visits,
  declarations: schema.declarations,
  daily_declarations: schema.daily_declarations,
  activity_registrations: schema.activity_registrations,
  notifications: schema.notifications,
  documents: schema.documents,
  visit_records: schema.visit_records,
  settings: schema.settings,
};

function getTable(resource: string) {
  return RESOURCE_TABLES[resource];
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
    
    // 应用字段映射
    const mappedData = applyFieldMapping(resource, snakeData);
    console.log('映射后的数据:', mappedData);

    // 使用 Drizzle ORM 的 sql 模板构建 UPDATE 语句
    const table = getTable(resource);
    if (!table) {
      return Response.json(
        { success: false, error: `Table not found for resource: ${resource}` },
        { status: 404 }
      );
    }

    const fields = Object.keys(mappedData).filter(key => mappedData[key] !== undefined);
    if (fields.length === 0) {
      return Response.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    const updateValues: any = {};
    for (const field of fields) {
      updateValues[field] = (mappedData as any)[field];
    }

    console.log('更新值:', updateValues);

    const result = await db.update(table)
      .set(updateValues)
      .where(eq(table.id, id))
      .returning();

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
