import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 创建 postgres.js 客户端（最简单的配置，不加任何 transform）
const queryClient = postgres(process.env.DATABASE_URL || '', {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// 创建 drizzle 实例
export const db = drizzle(queryClient, { schema });

// 导出 queryClient 供特殊场景使用
export { queryClient as client };

// 导出 schema
export * from './schema';
