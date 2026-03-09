import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 创建PostgreSQL连接
const connectionString = process.env.DATABASE_URL!;

// 创建PostgreSQL客户端（阿里云RDS，关闭SSL以避免连接问题）
const client = postgres(connectionString, {
  max: 10, // 最大连接数
  ssl: false, // 关闭SSL
  connection: {
    application_name: 'ran-field-app',
  },
});

// 创建Drizzle ORM实例
export const db = drizzle(client, { schema });

// 导出schema
export * from './schema';
