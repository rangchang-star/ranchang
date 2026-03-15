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
  settings,
  appUsers,
  activities,
  activityRegistrations,
  visits,
  visitRegistrations,
  visitRecords,
  declarations,
  dailyDeclarations,
  documents,
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

// 从 shared schema 导出 adminUsers 和 notifications 表（因为实际数据库使用的是 shared schema 中的定义）
export { adminUsers, notifications } from '@/storage/database/shared/schema';

// 导出 schema 命名空间（方便批量导入）
export * from '@/storage/database/supabase/schema';
export * from '@/storage/database/shared/schema';
