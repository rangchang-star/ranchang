import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  date,
  jsonb,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ============================================================
// 枚举类型定义
// ============================================================

export const userStatus = pgEnum('user_status', ['active', 'inactive', 'suspended']);
export const activityStatus = pgEnum('activity_status', ['draft', 'published', 'cancelled', 'ended']);
export const registrationStatus = pgEnum('registration_status', ['registered', 'approved', 'rejected', 'cancelled']);
export const visitStatus = pgEnum('visit_status', ['draft', 'upcoming', 'completed', 'cancelled']);
export const notificationType = pgEnum('notification_type', ['system', 'activity', 'registration', 'visit', 'approval']);

// ============================================================
// 1. 用户表（app_users）
// ============================================================
export const appUsers = pgTable('app_users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  nickname: varchar('nickname', { length: 50 }),
  name: varchar('name', { length: 50 }),
  avatar: text('avatar'), // 永久CDN地址
  bio: text('bio'),
  industry: varchar('industry', { length: 50 }),
  company: varchar('company', { length: 100 }),
  position: varchar('position', { length: 50 }),
  level: integer('level').default(1), // 用户等级
  achievement: text('achievement'), // 成就
  status: userStatus('status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('app_users_phone_idx').on(table.phone),
  index('app_users_status_idx').on(table.status),
  index('app_users_level_idx').on(table.level),
]);

// ============================================================
// 2. 活动表（activities）
// ============================================================
export const activities = pgTable('activities', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  startTime: varchar('start_time', { length: 20 }), // 14:00
  endTime: varchar('end_time', { length: 20 }), // 17:00
  location: varchar('location', { length: 200 }),
  capacity: integer('capacity').default(0),
  type: varchar('type', { length: 50 }).default('salon'), // salon, workshop, meetup
  coverImage: text('cover_image'), // 永久CDN地址
  coverImageKey: text('cover_image_key'), // 对象存储fileKey
  status: activityStatus('status').default('draft'),
  registeredCount: integer('registered_count').default(0),
  createdBy: varchar('created_by', { length: 36 }).references(() => appUsers.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('activities_status_idx').on(table.status),
  index('activities_date_idx').on(table.date),
  index('activities_type_idx').on(table.type),
  index('activities_created_by_idx').on(table.createdBy),
]);

// ============================================================
// 3. 活动报名表（activity_registrations）
// ============================================================
export const activityRegistrations = pgTable('activity_registrations', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  activityId: varchar('activity_id', { length: 36 }).notNull().references(() => activities.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  status: registrationStatus('status').default('registered'),
  paymentStatus: varchar('payment_status', { length: 20 }).default('unpaid'),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('activity_registrations_activity_id_idx').on(table.activityId),
  index('activity_registrations_user_id_idx').on(table.userId),
  index('activity_registrations_status_idx').on(table.status),
]);

// ============================================================
// 4. 探访表（visits）
// ============================================================
export const visits = pgTable('visits', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar('company_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 100 }),
  location: varchar('location', { length: 255 }),
  description: text('description'),
  date: timestamp('date', { withTimezone: true }).notNull(),
  capacity: integer('capacity').default(0),
  registeredCount: integer('registered_count').default(0),
  coverImage: text('cover_image'), // 永久CDN地址
  coverImageKey: text('cover_image_key'), // 对象存储fileKey
  status: visitStatus('status').default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('visits_company_id_idx').on(table.companyId),
  index('visits_status_idx').on(table.status),
  index('visits_date_idx').on(table.date),
]);

// ============================================================
// 5. 探访记录表（visit_records）
// ============================================================
export const visitRecords = pgTable('visit_records', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  visitId: varchar('visit_id', { length: 36 }).notNull().references(() => visits.id, { onDelete: 'cascade' }),
  visitorId: varchar('visitor_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  record: text('record'), // 走访记录
  outcome: text('outcome'), // 拜访成果
  keyPoints: jsonb('key_points'), // 关键要点数组
  nextSteps: jsonb('next_steps'), // 下一步计划数组
  rating: integer('rating'), // 评分 1-5
  feedbackAudio: text('feedback_audio'), // 反馈录音fileKey
  photos: jsonb('photos'), // 现场照片fileKeys数组
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('visit_records_visit_id_idx').on(table.visitId),
  index('visit_records_visitor_id_idx').on(table.visitorId),
]);

// ============================================================
// 6. 宣告表（declarations）
// ============================================================
export const declarations = pgTable('declarations', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  userName: varchar('user_name', { length: 50 }),
  userAvatar: text('user_avatar'), // 永久CDN地址
  userLevel: integer('user_level').default(1),
  direction: varchar('direction', { length: 100 }), // 方向
  text: text('text').notNull(),
  summary: text('summary'),
  audioUrl: varchar('audio_url', { length: 500 }), // 音频URL
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  isFeatured: boolean('is_featured').default(false),
  date: date('date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('declarations_user_id_idx').on(table.userId),
  index('declarations_date_idx').on(table.date),
  index('declarations_featured_idx').on(table.isFeatured),
]);

// ============================================================
// 7. 每日宣告表（daily_declarations）
// ============================================================
export const dailyDeclarations = pgTable('daily_declarations', {
  id: serial('id').primaryKey().notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  date: date('date').notNull(),
  image: text('image'), // 永久CDN地址
  imageKey: text('image_key'), // 对象存储fileKey
  audio: text('audio'), // 音频CDN地址
  audioKey: text('audio_key'), // 音频fileKey
  summary: text('summary'),
  text: text('text'),
  iconType: varchar('icon_type', { length: 50 }), // 图标类型
  rank: integer('rank'), // 排序
  profile: text('profile'),
  duration: varchar('duration', { length: 50 }),
  views: integer('views').default(0),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('daily_declarations_date_idx').on(table.date),
  index('daily_declarations_featured_idx').on(table.isFeatured),
  index('daily_declarations_rank_idx').on(table.rank),
]);

// ============================================================
// 8. 文档表（documents）
// ============================================================
export const documents = pgTable('documents', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }),
  fileUrl: text('file_url'), // 文件CDN地址
  fileKey: text('file_key'), // 对象存储fileKey
  coverImage: text('cover_image'), // 封面CDN地址
  coverImageKey: text('cover_image_key'), // 封面fileKey
  fileSize: integer('file_size'),
  fileType: varchar('file_type', { length: 50 }),
  downloads: integer('downloads').default(0),
  likes: integer('likes').default(0),
  authorId: varchar('author_id', { length: 36 }).references(() => appUsers.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 20 }).default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('documents_category_idx').on(table.category),
  index('documents_author_id_idx').on(table.authorId),
  index('documents_status_idx').on(table.status),
]);

// ============================================================
// 9. 通知表（notifications）
// ============================================================
export const notifications = pgTable('notifications', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  type: notificationType('type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  relatedId: varchar('related_id', { length: 36 }), // 关联对象ID（活动、宣告等）
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('notifications_user_id_idx').on(table.userId),
  index('notifications_is_read_idx').on(table.isRead),
  index('notifications_type_idx').on(table.type),
]);

// ============================================================
// 10. 咨询表（consultations）
// ============================================================
export const consultations = pgTable('consultations', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  consultantId: varchar('consultant_id', { length: 36 }).references(() => appUsers.id, { onDelete: 'set null' }),
  topic: varchar('topic', { length: 200 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('pending'),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  duration: integer('duration'), // 咨询时长（分钟）
  recordingUrl: text('recording_url'), // 录音CDN地址
  recordingKey: text('recording_key'), // 录音fileKey
  notes: text('notes'),
  rating: integer('rating'), // 评分
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('consultations_user_id_idx').on(table.userId),
  index('consultations_consultant_id_idx').on(table.consultantId),
  index('consultations_status_idx').on(table.status),
  index('consultations_scheduled_at_idx').on(table.scheduledAt),
]);

// ============================================================
// 11. 评估表（assessments）
// ============================================================
export const assessments = pgTable('assessments', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  assessorId: varchar('assessor_id', { length: 36 }).references(() => appUsers.id, { onDelete: 'set null' }),
  type: varchar('type', { length: 50 }).notNull(), // 评估类型
  score: integer('score'), // 分数
  feedback: text('feedback'),
  criteria: jsonb('criteria'), // 评估标准
  results: jsonb('results'), // 评估结果
  status: varchar('status', { length: 20 }).default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('assessments_user_id_idx').on(table.userId),
  index('assessments_assessor_id_idx').on(table.assessorId),
  index('assessments_type_idx').on(table.type),
  index('assessments_status_idx').on(table.status),
]);

// ============================================================
// 12. 管理员表（admin_users）
// ============================================================
export const adminUsers = pgTable('admin_users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 50 }),
  avatar: text('avatar'), // 永久CDN地址
  role: varchar('role', { length: 20 }).default('admin'), // admin, superadmin
  permissions: jsonb('permissions'), // 权限列表
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('admin_users_username_idx').on(table.username),
  index('admin_users_email_idx').on(table.email),
  index('admin_users_role_idx').on(table.role),
  index('admin_users_status_idx').on(table.status),
]);

// ============================================================
// 13. 设置表（settings）
// ============================================================
export const settings = pgTable('settings', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('settings_key_idx').on(table.key),
]);
