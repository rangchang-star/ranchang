/**
 * 统一的 API 客户端
 *
 * 功能：
 * 1. 统一的 fetch 封装
 * 2. 统一的错误处理
 * 3. 统一的响应格式验证
 */

import type { ApiResponse } from '@/lib/services/types';

// ============================================================
// API 错误类
// ============================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================
// API 客户端类
// ============================================================

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
          error.error || error.message || '请求失败',
          response.status,
          error.code
        );
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('网络错误', 0);
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * 构建查询参数
   */
  buildQueryParams(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    return query.toString();
  }
}

// ============================================================
// 单例实例
// ============================================================

export const apiClient = new ApiClient();

// ============================================================
// 便捷方法
// ============================================================

/**
 * 发起 GET 请求
 */
export async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiClient.get<T>(endpoint);
}

/**
 * 发起 POST 请求
 */
export async function postApi<T>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> {
  return apiClient.post<T>(endpoint, data);
}

/**
 * 发起 PUT 请求
 */
export async function putApi<T>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> {
  return apiClient.put<T>(endpoint, data);
}

/**
 * 发起 DELETE 请求
 */
export async function deleteApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiClient.delete<T>(endpoint);
}

