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

// 导出所有 schema 表
export {
  appUsers,
  activities,
  activityRegistrations,
  visits,
  visitRegistrations,
  visitRecords,
  declarations,
  dailyDeclarations,
  documents,
  notifications,
  consultations,
  assessments,
  userStatus,
  activityStatus,
  registrationStatus,
  visitStatus,
  notificationType,
  approvals,
  userFavorites,
} from '@/storage/database/supabase/schema';

// 从 shared schema 导入 settings 和 adminUsers 表
export { settings, adminUsers } from '@/storage/database/shared/schema';

// 导出 schema 命名空间（方便批量导入）
export * from '@/storage/database/supabase/schema';
export * from '@/storage/database/shared/schema';
