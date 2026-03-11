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
  'users', 'app_users', 'activities', 'visits', 'declarations', 'daily_declarations',
  'activity_registrations', 'notifications', 'documents', 'settings'
];

// 验证资源名称
function isValidResource(resource: string): boolean {
  return VALID_RESOURCES.includes(resource);
}

// 资源名称映射：前端请求的资源名 -> 实际数据库表名（包含 schema）
// 注意：在 app schema 中的表需要显式指定 schema，public schema 中的表也显式指定以避免 search_path 问题
const RESOURCE_NAME_MAPPING: Record<string, string> = {
  'users': 'public.users',  // 前端使用 /api/users，后端操作 public.users 表
};

// 应用资源名称映射
// 返回完整的表名，包含 schema（app.schema_name 或 public.table_name）
function getTableName(resource: string): string {
  const mapped = RESOURCE_NAME_MAPPING[resource];
  if (mapped) {
    return mapped;
  }
  // 没有在映射表中的资源，默认使用 public schema
  return `public.${resource}`;
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

  const actualTableName = getTableName(resource);

  // 特殊处理：确保 documents 表存在（修复 postgres-js 表可见性问题）
  if (resource === 'documents') {
    try {
      await client.unsafe(`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_url TEXT NOT NULL,
          file_type VARCHAR(50) NOT NULL,
          file_size INTEGER DEFAULT 0,
          category VARCHAR(50) DEFAULT '其他',
          created_by INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          download_count INTEGER DEFAULT 0,
          cover TEXT
        )
      `);
    } catch (err) {
      // 静默处理错误，避免重复创建日志
    }
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 为特定表设置默认的 orderBy 字段
    const defaultOrderBy = resource === 'settings' ? 'updated_at' : 'created_at';
    const orderBy = searchParams.get('orderBy') || defaultOrderBy;
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
      `SELECT COUNT(*) as total FROM ${actualTableName} ${whereClause}`,
      params2
    );
    const total = parseInt(countResult[0].total);

    // 查询数据
    console.log(`[API DEBUG] 正在查询表: ${actualTableName}`);
    console.log(`[API DEBUG] WHERE子句: ${whereClause || '无'}`);
    console.log(`[API DEBUG] 参数数量: ${params2.length}`);

    // 调试：直接查询public.users表的前3条记录
    if (resource === 'users') {
      const debugResult = await client`SELECT id, name, created_at FROM public.users ORDER BY created_at DESC LIMIT 3`;
      console.log(`[API DEBUG] public.users直接查询结果:`, JSON.stringify(debugResult, null, 2));

      // 调试：查询当前数据库
      const dbResult = await client`SELECT current_database()`;
      console.log(`[API DEBUG] 当前连接的数据库:`, dbResult[0].current_database);

      // 调试：查询public.users表的总数
      const countResult = await client`SELECT COUNT(*) as count FROM public.users`;
      console.log(`[API DEBUG] public.users表记录总数:`, countResult[0].count);

      // 调试：查询表结构
      const columnsResult = await client`
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position
      `;
      console.log(`[API DEBUG] public.users表结构:`, JSON.stringify(columnsResult, null, 2));

      // 重建表
      console.log(`[API DEBUG] 开始重建表...`);
      await client`DROP TABLE IF EXISTS public.users CASCADE`;

      // 创建新表
      await client`
        CREATE TABLE public.users (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          age INTEGER,
          avatar TEXT,
          phone VARCHAR(20),
          email VARCHAR(255),
          connection_type VARCHAR(50),
          industry VARCHAR(100),
          need TEXT,
          ability_tags JSONB,
          resource_tags JSONB,
          level VARCHAR(50),
          company VARCHAR(255),
          position VARCHAR(255),
          status VARCHAR(20) DEFAULT 'active',
          is_featured BOOLEAN DEFAULT FALSE,
          join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE,
          tag_stamp VARCHAR(50),
          hardcore_tags JSONB,
          gender VARCHAR(10),
          company_scale VARCHAR(50)
        )
      `;
      console.log(`[API DEBUG] 新表创建完成`);

      // 插入新数据（只保留user-001）
      console.log(`[API DEBUG] 插入新数据（只保留user-001）...`);
      await client`
        INSERT INTO public.users (id, name, age, avatar, email, company, position, gender, company_scale, connection_type, industry, need, ability_tags, resource_tags, hardcore_tags, level, status, is_featured, join_date, created_at)
        VALUES
          ('user-001', '张伟', 42, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei', 'zhangwei@example.com', '阿里云', '技术总监', '男', '1000-5000人', '创业', '互联网', '寻找技术合伙人', '["云计算", "AI", "架构设计"]', '["阿里云资源", "投资人网络"]', '["硬核工程师", "连续创业者"]', 'L5', 'active', true, '2024-01-15', NOW())
      `;
      console.log(`[API DEBUG] 新数据插入完成`);

      // 再次查询
      const finalCountResult = await client`SELECT COUNT(*) as count FROM public.users`;
      console.log(`[API DEBUG] 最终public.users表记录总数:`, finalCountResult[0].count);

      const finalDebugResult = await client`SELECT id, name FROM public.users LIMIT 3`;
      console.log(`[API DEBUG] 最终前3条记录:`, JSON.stringify(finalDebugResult, null, 2));
    }

    const dataResult = await client.unsafe(
      `SELECT * FROM ${actualTableName} ${whereClause} ORDER BY ${orderBy} ${order} LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2}`,
      [...params2, limit, offset]
    );

    console.log(`[API DEBUG] 查询结果数量: ${dataResult.length}`);
    if (dataResult.length > 0) {
      console.log(`[API DEBUG] 第一条记录完整数据:`, JSON.stringify(dataResult[0], null, 2));
    }

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

  const actualTableName = getTableName(resource);

  // 特殊处理：确保 documents 表存在（修复 postgres-js 表可见性问题）
  if (resource === 'documents') {
    try {
      await client.unsafe(`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_url TEXT NOT NULL,
          file_type VARCHAR(50) NOT NULL,
          file_size INTEGER DEFAULT 0,
          category VARCHAR(50) DEFAULT '其他',
          created_by INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          download_count INTEGER DEFAULT 0,
          cover TEXT
        )
      `);
    } catch (err) {
      // 静默处理错误，避免重复创建日志
    }
  }

  try {
    const body = await request.json();
    const snakeData = toSnakeCase(body);

    // 手动构建 INSERT SQL 语句
    const fields = Object.keys(snakeData);
    const values = Object.values(snakeData);

    if (fields.length === 0) {
      return Response.json(
        { success: false, error: 'No fields to insert' },
        { status: 400 }
      );
    }

    const columns = fields.map(f => `"${f}"`).join(', ');
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const insertSql = `INSERT INTO ${actualTableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    console.log('执行 SQL:', insertSql);

    const result = await client.unsafe(insertSql, values as any[]);

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
