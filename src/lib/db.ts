/**
 * 统一的数据库导出
 *
 * 提供：
 * 1. db - Drizzle ORM 实例
 * 2. schema - 数据库表定义
 */

import { db } from '@/storage/database/supabase/connection';
import * as schema from '@/storage/database/supabase/schema';

// 导出 db 实例
export { db };

// 导出 schema
export * from '@/storage/database/supabase/schema';
