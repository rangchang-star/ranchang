import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// 从环境变量获取数据库连接信息
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable is not set');
}

// 创建PostgreSQL连接
const client = postgres(connectionString, {
  max: 10, // 最大连接数
  idle_timeout: 20, // 空闲超时
  connect_timeout: 10, // 连接超时
});

// 创建Drizzle实例
export const db = drizzle(client);
