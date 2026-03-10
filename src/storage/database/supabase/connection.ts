import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 创建PostgreSQL连接 - 使用 ran_field 数据库
const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field') || '';

// 打印连接信息用于调试
console.log('DATABASE_URL配置:', connectionString);
console.log('数据库名:', connectionString.split('/').pop());

// 创建PostgreSQL客户端（阿里云RDS，关闭SSL以避免连接问题）
// 减少连接池大小以避免连接池满的问题
const client = postgres(connectionString, {
  max: 1, // 最大连接数（降低以避免阿里云 RDS 连接池满）
  ssl: false, // 关闭SSL
  idle_timeout: 10, // 10秒后关闭空闲连接
  max_lifetime: 60 * 10, // 10分钟后关闭连接
  connect_timeout: 5, // 连接超时时间
  connection: {
    application_name: 'ran-field-app',
  },
});

// 创建Drizzle ORM实例
export const db = drizzle(client, { schema });

// 导出schema
export * from './schema';
