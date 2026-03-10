import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 创建PostgreSQL连接 - 使用 ran_field 数据库
const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field') || '';

// 打印连接信息用于调试
console.log('DATABASE_URL配置:', connectionString);
console.log('数据库名:', connectionString.split('/').pop());

// 创建PostgreSQL客户端（阿里云RDS，关闭SSL以避免连接问题）
const client = postgres(connectionString, {
  max: 10, // 最大连接数
  ssl: false, // 关闭SSL
  connection: {
    application_name: 'ran-field-app',
  },
});

// 测试连接并查询当前数据库
(async () => {
  try {
    const result = await client`SELECT current_database(), current_user`;
    console.log('当前数据库信息:', JSON.stringify(result[0]));
  } catch (err) {
    console.error('连接测试失败:', err);
  }
})();

// 创建Drizzle ORM实例
export const db = drizzle(client, { schema });

// 导出schema
export * from './schema';
