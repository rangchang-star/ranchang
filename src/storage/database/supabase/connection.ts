import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 创建PostgreSQL连接
const connectionString = process.env.DATABASE_URL!;

// 创建PostgreSQL客户端（跳过SSL验证）
const client = postgres(connectionString, {
  max: 10, // 最大连接数
  ssl: {
    rejectUnauthorized: false, // 跳过SSL证书验证
  },
});

// 创建Drizzle ORM实例
export const db = drizzle(client, { schema });

// 导出schema
export * from './schema';
