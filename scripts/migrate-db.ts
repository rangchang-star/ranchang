import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './src/storage/database/supabase/connection';

async function main() {
  console.log('开始迁移数据库...');
  
  try {
    await migrate(db, { migrationsFolder: './src/storage/database/supabase/migrations' });
    console.log('数据库迁移成功！');
    process.exit(0);
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

main();
