import { pgTable, serial, varchar, text, integer, boolean, unique, jsonb, date, timestamp, foreignKey, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// ============================================================
// 用户表
// ============================================================
export const users = pgTable('app.app_users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 128 }).notNull(),
  age: integer('age'),
  avatar: text('avatar'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  connection_type: varchar('connection_type', { length: 50 }),
  industry: varchar('industry', { length: 100 }),
  need: text('need'),
  ability_tags: jsonb('ability_tags'),
  resource_tags: jsonb('resource_tags'),
  level: varchar('level', { length: 50 }),
  company: varchar('company', { length: 255 }),
  position: varchar('position', { length: 255 }),
  status: varchar('status', { length: 20 }).default('active'),
  is_featured: boolean('is_featured').default(false),
  join_date: timestamp('join_date', { withTimezone: true }).default(sql`now()`),
  last_login: timestamp('last_login', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { withTimezone: true }),
  tag_stamp: varchar('tag_stamp', { length: 50 }),
  hardcore_tags: jsonb('hardcore_tags'),
  gender: varchar('gender', { length: 10 }),
  company_scale: varchar('company_scale', { length: 50 }),
}, (table) => ({
  // 可以在这里添加索引
}));

// ============================================================
// 活动表
// ============================================================
export const activities = pgTable('activities', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  date: timestamp('date', { withTimezone: true }).notNull(),
  start_time: varchar('start_time', { length: 10 }),
  end_time: varchar('end_time', { length: 10 }),
  location: varchar('location', { length: 255 }),
  capacity: integer('capacity'),
  registered_count: integer('registered_count').default(0),
  type: varchar('type', { length: 50 }),
  cover_image: text('cover_image'),
  status: varchar('status', { length: 20 }).default('draft'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { withTimezone: true }),
});

// ============================================================
// 探访表
// ============================================================
export const visits = pgTable('visits', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  company_id: varchar('company_id', { length: 36 }).notNull(),
  company_name: varchar('company_name', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 100 }),
  location: varchar('location', { length: 255 }),
  description: text('description'),
  date: timestamp('date', { withTimezone: true }).notNull(),
  capacity: integer('capacity'),
  registered_count: integer('registered_count').default(0),
  cover_image: text('cover_image'),
  status: varchar('status', { length: 20 }).default('draft'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { withTimezone: true }),
});

// ============================================================
// 高燃宣告表
// ============================================================
export const declarations = pgTable('declarations', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  direction: varchar('direction', { length: 100 }),
  text: text('text').notNull(),
  summary: text('summary'),
  audio_url: varchar('audio_url', { length: 500 }),
  views: integer('views').default(0),
  date: date('date').notNull(),
  is_featured: boolean('is_featured').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// 每日宣告表
// ============================================================
export const dailyDeclarations = pgTable('daily_declarations', {
  id: serial('id').primaryKey().notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  date: timestamp('date', { mode: 'string' }).notNull(),
  image: text('image'),
  audio: text('audio'),
  summary: text('summary'),
  text: text('text'),
  icon_type: varchar('icon_type', { length: 50 }),
  rank: integer('rank'),
  profile: text('profile'),
  duration: varchar('duration', { length: 50 }),
  views: integer('views').default(0),
  is_featured: boolean('is_featured').default(false),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().default(sql`now()`),
});

// ============================================================
// 活动报名记录表
// ============================================================
export const activityRegistrations = pgTable('activity_registrations', {
  id: serial('id').primaryKey().notNull(),
  activity_id: text('activity_id').notNull(),
  user_id: text('user_id').notNull(),
  status: varchar('status', { length: 50 }).default('registered'),
  registered_at: timestamp('registered_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
  reviewed_at: timestamp('reviewed_at', { mode: 'string' }),
  note: text('note'),
  created_at: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// 通知表
// ============================================================
export const notifications = pgTable('notifications', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  action_url: text('action_url'),
  is_read: boolean('is_read').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
});

// ============================================================
// 文档表
// ============================================================
export const documents = pgTable('documents', {
  id: serial('id').primaryKey().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  file_url: text('file_url').notNull(),
  file_type: varchar('file_type', { length: 50 }).notNull(),
  file_size: integer('file_size').default(0),
  category: varchar('category', { length: 50 }).default('其他'),
  created_by: integer('created_by').notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// 探访记录表
// ============================================================
export const visitRecords = pgTable('visit_records', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  visit_id: varchar('visit_id', { length: 36 }).notNull(),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 20 }).default('registered'),
  registered_at: timestamp('registered_at', { withTimezone: true }).default(sql`now()`),
  completed_at: timestamp('completed_at', { withTimezone: true }),
});

// ============================================================
// 系统设置表
// ============================================================
export const settings = pgTable('settings', {
  id: serial('id').primaryKey().notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: jsonb('value').notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  unique('settings_key_key').on(table.key),
]);

// ============================================================
// 其他表（暂时不需要使用）
// ============================================================
export const adminUsers = pgTable('admin_users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: varchar('username', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).default('admin'),
  status: varchar('status', { length: 20 }).default('active'),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().default(sql`now()`),
});

export const assessments = pgTable('assessments', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 128 }).notNull(),
  score: integer('score').notNull(),
  level: varchar('level', { length: 20 }),
  summary: text('summary'),
  dimensions: jsonb('dimensions'),
  test_date: timestamp('test_date', { withTimezone: true }).default(sql`now()`),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
});

export const consultations = pgTable('consultations', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  topic_id: varchar('topic_id', { length: 50 }),
  topic_name: varchar('topic_name', { length: 100 }),
  question: text('question').notNull(),
  answer: text('answer'),
  status: varchar('status', { length: 20 }).default('pending'),
  consultant_name: varchar('consultant_name', { length: 128 }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { withTimezone: true }),
});

export const digitalAssets = pgTable('digital_assets', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }),
  file_type: varchar('file_type', { length: 50 }),
  file_size: varchar('file_size', { length: 50 }),
  file_url: text('file_url'),
  cover_image: text('cover_image'),
  likes: integer('likes').default(0),
  downloads: integer('downloads').default(0),
  status: varchar('status', { length: 20 }).default('draft'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { withTimezone: true }),
});

export const healthCheck = pgTable('health_check', {
  id: serial('id').primaryKey().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
});

export const userFollows = pgTable('user_follows', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  follower_id: varchar('follower_id', { length: 36 }).notNull(),
  following_id: varchar('following_id', { length: 36 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
});
