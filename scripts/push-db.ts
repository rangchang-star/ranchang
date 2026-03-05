import { push } from 'drizzle-kit/flags';
import { config } from 'drizzle-kit';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.local' });

// 使用 Drizzle Kit 的 push 功能来创建表结构
async function main() {
  console.log('正在创建数据库表结构...');
  console.log('请运行: pnpm drizzle-kit push');
}

main();
