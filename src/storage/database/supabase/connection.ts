import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// 延迟初始化数据库连接，避免构建时环境变量缺失问题
let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getConnection() {
  if (!client) {
    // 从环境变量获取数据库连接信息
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL or POSTGRES_URL environment variable is not set');
    }

    // 创建PostgreSQL连接
    client = postgres(connectionString, {
      max: 10, // 最大连接数
      idle_timeout: 20, // 空闲超时
      connect_timeout: 10, // 连接超时
    });
  }

  if (!dbInstance) {
    dbInstance = drizzle(client);
  }

  return dbInstance;
}

// 导出延迟初始化的数据库实例
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const instance = getConnection();
    return instance[prop as keyof typeof instance];
  },
});
