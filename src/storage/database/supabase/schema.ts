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
export const registrationStatus = pgEnum('registration_status', ['pending', 'registered', 'approved', 'rejected', 'cancelled']);
export const visitStatus = pgEnum('visit_status', ['draft', 'upcoming', 'completed', 'cancelled']);
export const notificationType = pgEnum('notification_type', ['system', 'activity', 'registration', 'visit', 'approval']);
export const declarationType = pgEnum('declaration_type', ['ability', 'connection', 'resource']);

// ============================================================
// 1. 用户表（app_users）
// ============================================================
export const appUsers = pgTable('app_users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 255 }), // 密码（bcrypt加密）
  nickname: varchar('nickname', { length: 50 }),
  name: varchar('name', { length: 50 }),
  avatar: text('avatar'), // 永久CDN地址
  bio: text('bio'),
  age: integer('age'),
  gender: varchar('gender', { length: 10 }),
  industry: varchar('industry', { length: 50 }),
  company: varchar('company', { length: 100 }),
  position: varchar('position', { length: 50 }),
  city: varchar('city', { length: 50 }),
  email: varchar('email', { length: 255 }),
  level: integer('level').default(1), // 用户等级
  achievement: jsonb('achievement').$type<string[]>(), // 成就
  hardcoreTags: jsonb('hardcore_tags').$type<string[]>(), // 硬核技能标签
  abilityTags: jsonb('ability_tags').$type<string[]>(), // 行业标签
  resourceTags: jsonb('resource_tags').$type<string[]>(), // 资源标签
  tags: jsonb('tags').$type<string[]>(), // 普通标签
  tagStamp: varchar('tag_stamp', { length: 50 }), // 标签类型
  companyScale: varchar('company_scale', { length: 50 }), // 公司规模
  experience: jsonb('experience'), // 硬核经历
  need: text('need'), // 用户需求
  declaration: text('declaration'), // 资源现货
  connectionType: varchar('connection_type', { length: 50 }), // 连接类型
  isTrusted: boolean('is_trusted').default(false), // 是否信任
  isFeatured: boolean('is_featured').default(false), // 是否精选
  status: userStatus('status').default('active'),
  joinDate: timestamp('join_date', { withTimezone: true }), // 加入日期
  lastLogin: timestamp('last_login', { withTimezone: true }), // 最后登录
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
  subtitle: varchar('subtitle', { length: 200 }),
  description: text('description').notNull(),
  category: varchar('category', { length: 50 }),
  date: timestamp('date', { withTimezone: true }).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  startTime: varchar('start_time', { length: 20 }), // 14:00
  endTime: varchar('end_time', { length: 20 }), // 17:00
  location: varchar('location', { length: 200 }),
  address: varchar('address', { length: 200 }),
  capacity: integer('capacity').default(0),
  teaFee: text('tea_fee'), // 茶水费（文本格式）
  type: varchar('type', { length: 50 }).default('salon'), // salon, workshop, meetup
  coverImage: text('cover_image'), // 永久CDN地址
  coverImageKey: text('cover_image_key'), // 对象存储fileKey
  status: activityStatus('status').default('draft'),
  registeredCount: integer('registered_count').default(0),
  createdBy: varchar('created_by', { length: 36 }).references(() => appUsers.id, { onDelete: 'set null' }),
  tags: jsonb('tags'), // 活动标签
  guests: jsonb('guests'), // 参与嘉宾
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
  time: varchar('time', { length: 20 }),
  capacity: integer('capacity').default(0),
  registeredCount: integer('registered_count').default(0),
  coverImage: text('cover_image'), // 永久CDN地址
  coverImageKey: text('cover_image_key'), // 对象存储fileKey
  status: visitStatus('status').default('draft'),
  record: text('record'),
  outcome: text('outcome'),
  notes: text('notes'),
  keyPoints: jsonb('key_points'),
  nextSteps: jsonb('next_steps'),
  rating: integer('rating'),
  feedbackAudio: text('feedback_audio'),
  photos: jsonb('photos'),
  participants: integer('participants'),
  visitorIds: jsonb('visitor_ids').$type<string[]>(), // 探访人ID列表
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('visits_company_id_idx').on(table.companyId),
  index('visits_status_idx').on(table.status),
  index('visits_date_idx').on(table.date),
  index('visits_cover_image_key_idx').on(table.coverImageKey),
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
// 5.5 探访报名表（visit_registrations）
// ============================================================
export const visitRegistrations = pgTable('visit_registrations', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  visitId: varchar('visit_id', { length: 36 }).notNull().references(() => visits.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('registered'),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('visit_registrations_visit_id_idx').on(table.visitId),
  index('visit_registrations_user_id_idx').on(table.userId),
  index('visit_registrations_status_idx').on(table.status),
]);

// ============================================================
// 6. 宣告表（declarations）
// ============================================================
export const declarations = pgTable('declarations', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  type: declarationType('type').default('resource'), // 资源现货类型：ability(能力现货), connection(人脉现货), resource(资源现货)
  direction: varchar('direction', { length: 100 }), // 方向
  text: text('text').notNull(),
  summary: text('summary'),
  audioUrl: varchar('audio_url', { length: 500 }), // 音频URL
  audioKey: text('audio_key'), // 音频fileKey
  views: integer('views').default(0),
  isFeatured: boolean('is_featured').default(false),
  date: date('date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('declarations_user_id_idx').on(table.userId),
  index('declarations_date_idx').on(table.date),
  index('declarations_featured_idx').on(table.isFeatured),
  index('declarations_type_idx').on(table.type),
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
  audioUrl: varchar('audio_url', { length: 500 }), // 音频URL
  audioKey: text('audio_key'), // 音频fileKey
  summary: text('summary'),
  text: text('text'),
  iconType: varchar('icon_type', { length: 50 }), // 图标类型
  rank: integer('rank'), // 排序
  profile: text('profile'),
  duration: varchar('duration', { length: 50 }),
  views: integer('views').default(0),
  isActive: boolean('is_active').default(true), // 是否激活显示
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
  type: varchar('type', { length: 50 }), // 资料类型
  description: text('description'),
  category: varchar('category', { length: 50 }),
  content: text('content'),
  fileUrl: text('file_url'), // 文件CDN地址
  fileKey: text('file_key'), // 对象存储fileKey
  coverImage: text('cover_image'), // 封面CDN地址
  coverImageKey: text('cover_image_key'), // 封面fileKey
  icon: varchar('icon', { length: 100 }), // 图标
  fileSize: integer('file_size'),
  fileType: varchar('file_type', { length: 50 }),
  downloads: integer('downloads').default(0),
  downloadCount: integer('download_count').default(0), // 下载次数
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
  topicId: varchar('topic_id', { length: 50 }),
  topicName: varchar('topic_name', { length: 200 }),
  question: text('question').notNull(),
  answer: text('answer'),
  status: varchar('status', { length: 20 }).default('pending'),
  consultantName: varchar('consultant_name', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
}, (table) => [
  index('consultations_user_id_idx').on(table.userId),
  index('consultations_status_idx').on(table.status),
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

// ============================================================
// 14. 审批表（approvals）
// ============================================================
export const approvals = pgTable('approvals', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // 审批类型：活动、探访、宣告等
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  reviewNote: text('review_note'),
  reviewedBy: varchar('reviewed_by', { length: 36 }).references(() => adminUsers.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('approvals_user_id_idx').on(table.userId),
  index('approvals_type_idx').on(table.type),
  index('approvals_status_idx').on(table.status),
]);

// ============================================================
// 15. 用户收藏表（user_favorites）
// ============================================================
export const userFavorites = pgTable('user_favorites', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => appUsers.id, { onDelete: 'cascade' }),
  targetType: varchar('target_type', { length: 50 }).notNull(), // visit, declaration, activity, document
  targetId: varchar('target_id', { length: 36 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('user_favorites_user_id_idx').on(table.userId),
  index('user_favorites_target_type_idx').on(table.targetType),
  index('user_favorites_target_id_idx').on(table.targetId),
  index('user_favorites_user_target_idx').on(table.userId, table.targetType, table.targetId),
]);
