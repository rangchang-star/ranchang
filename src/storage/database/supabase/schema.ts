import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// 用户表 - 严格匹配 ran_field 数据库实际结构
export const users = pgTable('users', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('users_id_seq'::regclass)`),
  phone: varchar('phone').notNull(),
  password: varchar('password').notNull(),
  nickname: varchar('nickname'),
  name: varchar('name'),
  avatar: text('avatar'),
  age: integer('age'),
  company: varchar('company'),
  position: varchar('position'),
  industry: varchar('industry'),
  bio: text('bio'),
  need: text('need'),
  tag_stamp: varchar('tag_stamp'),
  tags: jsonb('tags'),
  hardcore_tags: jsonb('hardcore_tags'),
  resource_tags: jsonb('resource_tags'),
  is_trusted: boolean('is_trusted').default(false),
  is_featured: boolean('is_featured').default(false),
  connection_count: integer('connection_count').default(0),
  activity_count: integer('activity_count').default(0),
  role: varchar('role').default('user'),
  status: varchar('status').default('active'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// 活动表 - 严格匹配 ran_field 数据库实际结构
export const activities = pgTable('activities', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('activities_id_seq'::regclass)`),
  title: varchar('title').notNull(),
  subtitle: varchar('subtitle'),
  category: varchar('category').default('private'),
  description: text('description').notNull(),
  image: text('image'),
  address: varchar('address'),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  capacity: integer('capacity').default(0),
  tea_fee: integer('tea_fee').default(0),
  status: varchar('status').default('draft'),
  created_by: integer('created_by'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// 探访表 - 严格匹配 ran_field 数据库实际结构
export const visits = pgTable('visits', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('visits_id_seq'::regclass)`),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  location: varchar('location'),
  date: timestamp('date'),
  capacity: integer('capacity').default(0),
  tea_fee: integer('tea_fee').default(0),
  status: varchar('status').default('draft'),
  created_by: integer('created_by'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// 活动报名记录表 - 严格匹配数据库实际结构
export const activityRegistrations = pgTable('activity_registrations', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('activity_registrations_id_seq'::regclass)`),
  activity_id: integer('activity_id').notNull().references(() => activities.id),
  user_id: integer('user_id').notNull().references(() => users.id),
  status: varchar('status').default('registered'),
  registered_at: timestamp('registered_at').defaultNow(),
  reviewed_at: timestamp('reviewed_at'),
  note: text('note'),
});

// 探访记录表 - 严格匹配数据库实际结构
export const visitRecords = pgTable('visit_records', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('visit_records_id_seq'::regclass)`),
  visit_id: integer('visit_id').notNull().references(() => visits.id),
  user_id: integer('user_id').notNull().references(() => users.id),
  status: varchar('status').default('registered'),
  registered_at: timestamp('registered_at').defaultNow(),
  completed_at: timestamp('completed_at'),
});

// 每日宣告表 - 严格匹配 ran_field 数据库实际结构
export const dailyDeclarations = pgTable('daily_declarations', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('daily_declarations_id_seq'::regclass)`),
  title: varchar('title').notNull(),
  date: timestamp('date').notNull(),
  image: text('image'),
  audio: text('audio'),
  summary: text('summary'),
  text: text('text'),
  icon_type: varchar('icon_type'),
  rank: integer('rank'),
  profile: text('profile'),
  duration: varchar('duration'),
  views: integer('views').default(0),
  is_featured: boolean('is_featured').default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// 系统设置表
export const settings = pgTable('settings', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('settings_id_seq'::regclass)`),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// 管理员表
export const admins = pgTable('admins', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('admins_id_seq'::regclass)`),
  username: varchar('username').notNull().unique(),
  password: varchar('password').notNull(),
  role: varchar('role').default('admin'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// 管理员成员表
export const adminMembers = pgTable('admin_members', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('admin_members_id_seq'::regclass)`),
  name: varchar('name').notNull(),
  company: varchar('company'),
  position: varchar('position'),
  tags: jsonb('tags').$type<string[]>(),
  industry: varchar('industry'),
  is_featured: boolean('is_featured').default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// 活动申请表
export const activityApplications = pgTable('activity_applications', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('activity_applications_id_seq'::regclass)`),
  user_id: integer('user_id').notNull(),
  activity_id: integer('activity_id').notNull(),
  user_name: varchar('user_name').notNull(),
  user_phone: varchar('user_phone').notNull(),
  reason: text('reason'),
  status: varchar('status').default('pending'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  reviewed_at: timestamp('reviewed_at'),
  reviewed_by: integer('reviewed_by'),
  review_comment: text('review_comment'),
});

// 文档表
export const documents = pgTable('documents', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('documents_id_seq'::regclass)`),
  title: varchar('title').notNull(),
  description: text('description'),
  file_url: text('file_url').notNull(),
  file_type: varchar('file_type').notNull(),
  file_size: integer('file_size').default(0),
  category: varchar('category').default('其他'),
  created_by: integer('created_by').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// 收藏表
export const favorites = pgTable('favorites', {
  id: integer('id').primaryKey().notNull().default(sql`nextval('favorites_id_seq'::regclass)`),
  user_id: integer('user_id').notNull(),
  visit_id: integer('visit_id').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// 关系定义
export const usersRelations = relations(users, ({ many }) => ({
  activityRegistrations: many(activityRegistrations),
  visitRecords: many(visitRecords),
}));

export const activitiesRelations = relations(activities, ({ many }) => ({
  activityRegistrations: many(activityRegistrations),
}));

export const visitsRelations = relations(visits, ({ many }) => ({
  visitRecords: many(visitRecords),
}));

export const activityRegistrationsRelations = relations(activityRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [activityRegistrations.user_id],
    references: [users.id],
  }),
  activity: one(activities, {
    fields: [activityRegistrations.activity_id],
    references: [activities.id],
  }),
}));

export const visitRecordsRelations = relations(visitRecords, ({ one }) => ({
  user: one(users, {
    fields: [visitRecords.user_id],
    references: [users.id],
  }),
  visit: one(visits, {
    fields: [visitRecords.visit_id],
    references: [visits.id],
  }),
}));
