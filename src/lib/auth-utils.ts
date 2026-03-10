import { NextRequest } from 'next/server';

export interface TokenPayload {
  userId: string;
  phone: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  statusCode?: number;
}

// 从请求头中获取用户ID
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);

    // 简单的 JWT 解析（生产环境应使用 jsonwebtoken 库）
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(atob(payload)) as TokenPayload;

    if (!decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    console.error('获取用户ID失败:', error);
    return null;
  }
}

// 从请求头中获取完整用户信息
export async function getUserFromRequest(request: NextRequest): Promise<any | null> {
  try {
    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return null;
    }

    // 从数据库获取用户信息
    const { db, users } = await import('@/storage/database/supabase/connection');
    const { eq } = await import('drizzle-orm');

    const dbUsers = await db.select().from(users).where(eq(users.id, parseInt(userId)));

    if (dbUsers.length === 0) {
      return null;
    }

    return dbUsers[0];
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 验证用户是否已登录
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const user = await getUserFromRequest(request);

  if (!user) {
    return {
      success: false,
      error: '请先登录',
      statusCode: 401,
    };
  }

  return {
    success: true,
    user,
  };
}

// 验证用户是否为管理员
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  if (authResult.user!.role !== 'admin') {
    return {
      success: false,
      error: '无权访问此资源',
      statusCode: 403,
    };
  }

  return {
    success: true,
    user: authResult.user,
  };
}
