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
  'app_users': {
    nick_name: 'name',
    occupation: 'company',
    location: 'company_scale', // 将 location 映射到 company_scale
  }
};

// 资源名称映射：前端请求的资源名 -> 实际数据库表名（不包含 schema）
const RESOURCE_NAME_MAPPING: Record<string, string> = {
  'users': 'app_users',  // 前端使用 /api/users，后端操作 public.app_users 表（public 是默认 schema）
};

// 应用资源名称映射
function getTableName(resource: string): string {
  return RESOURCE_NAME_MAPPING[resource] || resource;
}

// 应用字段映射
function applyFieldMapping(resource: string, obj: any): any {
  const actualTableName = getTableName(resource);
  if (!FIELD_MAPPINGS[actualTableName]) {
    return obj;
  }

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const mappedKey = FIELD_MAPPINGS[actualTableName][key] || key;
      result[mappedKey] = obj[key];
    }
  }
  return result;
}

// 安全的资源名称白名单（前端可以使用的资源名）
const VALID_RESOURCES = [
  'users', 'app_users', 'activities', 'visits', 'declarations', 'daily_declarations',
  'activity_registrations', 'notifications', 'documents', 'visit_records', 'settings'
];

function isValidResource(resource: string): boolean {
  return VALID_RESOURCES.includes(resource);
}

// 资源到 Drizzle 表的映射（使用实际表名）
const RESOURCE_TABLES: Record<string, any> = {
  app_users: schema.users,  // 注意：这里仍然使用 schema.users，因为 Drizzle Schema 还没有更新
  activities: schema.activities,
  visits: schema.visits,
  declarations: schema.declarations,
  daily_declarations: schema.dailyDeclarations,
  activity_registrations: schema.activityRegistrations,
  notifications: schema.notifications,
  documents: schema.documents,
  visit_records: schema.visitRecords,
  settings: schema.settings,
};

function getTable(resource: string) {
  const actualTableName = getTableName(resource);
  return RESOURCE_TABLES[actualTableName];
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

  const actualTableName = getTableName(resource);

  try {
    const result = await client.unsafe(
      `SELECT * FROM ${actualTableName} WHERE id = $1`,
      [id]
    );

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

  const actualTableName = getTableName(resource);

  try {
    const body = await request.json();
    const snakeData = toSnakeCase(body);

    // 应用字段映射
    const mappedData = applyFieldMapping(resource, snakeData);
    console.log('映射后的数据:', mappedData);

    // 手动构建 UPDATE SQL 语句（使用 client.unsafe）
    const fields = Object.keys(mappedData).filter(key => mappedData[key] !== undefined);
    if (fields.length === 0) {
      return Response.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    const setClause = fields.map(field => {
      const value = (mappedData as any)[field];
      if (value === null) {
        return `"${field}" = NULL`;
      } else if (typeof value === 'string') {
        return `"${field}" = '${value.replace(/'/g, "''")}'`;
      } else {
        return `"${field}" = ${value}`;
      }
    }).join(', ');

    const updateSql = `UPDATE ${actualTableName} SET ${setClause} WHERE id = $1 RETURNING *`;
    console.log('执行 SQL:', updateSql);

    const result = await client.unsafe(updateSql, [id]);

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

  const actualTableName = getTableName(resource);

  try {
    const result = await client.unsafe(
      `DELETE FROM ${actualTableName} WHERE id = $1 RETURNING *`,
      [id]
    );

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
