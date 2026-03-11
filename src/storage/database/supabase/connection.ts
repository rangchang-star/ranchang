import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 创建PostgreSQL连接 - 使用 ran_field 数据库
let connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field') || '';

// 添加 connect_timeout 来强制重新连接
const separator = connectionString.includes('?') ? '&' : '?';
connectionString += `${separator}connect_timeout=10`;

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

// 调试：打印当前连接的数据库
(async () => {
  try {
    const result = await client`SELECT current_database()`;
    console.log('当前连接的数据库:', result[0].current_database);
    const tables = await client`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log('当前数据库中的表:', tables.map(t => `${t.table_schema}.${t.table_name}`).join(', '));

    // 检查 declarations 表是否存在，如果不存在则创建
    const declarationsTable = tables.find(t => t.table_name === 'declarations');
    if (!declarationsTable) {
      console.log('declarations 表不存在，正在创建...');
      await client`
        CREATE TABLE declarations (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          direction VARCHAR(100),
          text TEXT NOT NULL,
          summary TEXT,
          audio_url VARCHAR(500),
          views INTEGER DEFAULT 0,
          date DATE NOT NULL,
          is_featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('declarations 表创建成功');
    }
  } catch (err) {
    console.error('查询数据库信息失败:', err);
  }
})();

// 创建Drizzle ORM实例
export const db = drizzle(client, { 
  schema,
  logger: false,
});

// 导出postgres client
export { client };

// 导出schema
export * from './schema';
