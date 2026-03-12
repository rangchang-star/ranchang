// 使用 drizzle ORM 查询高燃宣告数据
import { db } from './src/storage/database/supabase/connection.js';
import { declarations } from './src/storage/database/supabase/schema.js';
import { eq } from 'drizzle-orm';

console.log('开始查询高燃宣告数据...\n');

try {
  // 查询所有高燃宣告
  const allDeclarations = await db.select().from(declarations);
  console.log('所有高燃宣告:', JSON.stringify(allDeclarations, null, 2));

  // 查询该用户的高燃宣告数据
  const userDeclarations = await db
    .select()
    .from(declarations)
    .where(eq(declarations.userId, 'e428646d-7556-453e-8699-84ce8d154836'));

  console.log('\n该用户的高燃宣告:', JSON.stringify(userDeclarations, null, 2));

  if (userDeclarations.length > 0) {
    const decl = userDeclarations[0];
    console.log('\n详情:');
    console.log('方向:', decl.direction);
    console.log('内容:', decl.text);
    console.log('摘要:', decl.summary);
    console.log('播放次数:', decl.views);
  } else {
    console.log('未找到高燃宣告数据');
  }
} catch (error) {
  console.error('查询失败:', error);
  console.error('错误堆栈:', error.stack);
}
