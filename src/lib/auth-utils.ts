import { NextRequest } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// 从请求中获取当前用户ID
export async function getCurrentUserId(request: NextRequest): Promise<number | null> {
  try {
    // 从请求头获取用户信息
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return null;
    }

    return parseInt(userId, 10);
  } catch (error) {
    console.error('获取用户ID失败:', error);
    return null;
  }
}

// 从请求中获取当前用户信息
export async function getCurrentUser(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);

    if (!userId) {
      return null;
    }

    const user = MockDatabase.getUserById(userId);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 验证用户是否已登录
export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  statusCode?: number;
}

// 验证用户是否已登录
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const user = await getCurrentUser(request);

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

  if (authResult.user.role !== 'admin') {
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

// 验证用户是否有权操作指定资源
export async function requireOwnership(
  request: NextRequest,
  resourceOwnerId: number
): Promise<AuthResult> {
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  // 用户只能操作自己的资源，除非是管理员
  if (authResult.user!.id !== resourceOwnerId && authResult.user!.role !== 'admin') {
    return {
      success: false,
      error: '无权操作此资源',
      statusCode: 403,
    };
  }

  return {
    success: true,
    user: authResult.user!,
  };
}
