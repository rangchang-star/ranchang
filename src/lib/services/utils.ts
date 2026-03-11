/**
 * 服务层工具函数
 *
 * 提供：
 * 1. 字段名转换（snake_case ↔ camelCase）
 * 2. 数据转换和清理
 */

/**
 * 将 snake_case 转换为 camelCase
 */
export function snakeToCamel<T = any>(obj: Record<string, any>): T {
  if (!obj || typeof obj !== 'object') {
    return obj as T;
  }

  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 将 snake_case 转换为 camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  }

  return result as T;
}

/**
 * 将 camelCase 转换为 snake_case
 */
export function camelToSnake<T = any>(obj: Record<string, any>): T {
  if (!obj || typeof obj !== 'object') {
    return obj as T;
  }

  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 将 camelCase 转换为 snake_case
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = obj[key];
    }
  }

  return result as T;
}

/**
 * 深度转换数组中的所有对象
 */
export function transformArray<T>(arr: any[], transformFn: (item: any) => T): T[] {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  return arr.map(item => transformFn(item));
}

/**
 * 安全解析 JSON 字符串
 */
export function safeParseJson<T>(str: string | null, defaultValue: T): T {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 格式化日期（返回 Date 对象）
 */
export function parseDate(date: Date | string | null): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  return new Date(date);
}

/**
 * 提供默认值
 */
export function withDefault<T>(value: T | undefined | null, defaultValue: T): T {
  return value !== undefined && value !== null ? value : defaultValue;
}
