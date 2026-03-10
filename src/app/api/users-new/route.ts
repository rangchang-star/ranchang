import { NextRequest } from 'next/server';
import { client } from '@/storage/database/supabase/connection';

// 字段名转换：snake_case -> camelCase
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

// GET /api/users-new - 查询用户列表
export async function GET(request: NextRequest) {
  try {
    // 使用SQL直接查询public.users表
    const result = await client`
      SELECT * FROM public.users 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    
    const camelResult = result.map(toCamelCase);
    
    return Response.json({ success: true, data: camelResult });
  } catch (error: any) {
    console.error('获取用户列表失败:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/users-new - 创建用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await client`
      INSERT INTO public.users ${client(body)}
      RETURNING *
    `;
    
    if (!result || result.length === 0) {
      return Response.json({ success: false, error: '创建用户失败' }, { status: 500 });
    }

    const camelResult = toCamelCase(result[0]);
    
    return Response.json({ success: true, data: camelResult, message: '用户创建成功' });
  } catch (error: any) {
    console.error('创建用户失败:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
