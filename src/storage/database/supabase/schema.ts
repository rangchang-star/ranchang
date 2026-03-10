import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// 用户表（就是会员表）- 严格匹配 ran_field 数据库实际结构
export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  phone: varchar('phone'),
  password: varchar('password'),
  nickname: varchar('nickname'),
  name: varchar('name'),
  avatar: text('avatar'),
  age: integer('age'),
  company: varchar('company'),
  position: varchar('position'),
  industry: varchar('industry'),
  bio: text('bio'),
  need: text('need'),
  tag_stamp: text('tag_stamp'),
  tags: jsonb('tags'),
  hardcore_tags: jsonb('hardcore_tags'),
  resource_tags: jsonb('resource_tags'),
  is_trusted: boolean('is_trusted'),
  is_featured: boolean('is_featured'),
  connection_count: integer('connection_count'),
  activity_count: integer('activity_count'),
  role: text('role'),
  status: text('status'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});

// 活动表 - 严格匹配 ran_field 数据库实际结构
export const activities = pgTable('activities', {
  id: integer('id').primaryKey(),
  title: varchar('title'),
  subtitle: varchar('subtitle'),
  category: text('category'),
  description: text('description'),
  image: text('image'),
  address: varchar('address'),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  capacity: integer('capacity'),
  tea_fee: integer('tea_fee'),
  status: text('status'),
  created_by: integer('created_by'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});

// 探访表 - 严格匹配数据库实际结构
export const visits = pgTable('visits', {
  id: text('id').primaryKey(),
  company_id: text('company_id'),
  company_name: text('company_name'),
  industry: text('industry'),
  location: text('location'),
  description: text('description').notNull(),
  date: timestamp('date'),
  capacity: integer('capacity').default(0),
  registered_count: integer('registered_count').default(0),
  cover_image: text('cover_image'),
  status: text('status').default('active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 活动报名记录表 - 严格匹配数据库实际结构
export const activityRegistrations = pgTable('activity_registrations', {
  id: text('id').primaryKey(),
  activityId: text('activity_id').notNull().references(() => activities.id),
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status').default('registered'),
  registeredAt: timestamp('registered_at'),
  reviewedAt: timestamp('reviewed_at'),
  note: text('note'),
});

// 探访记录表 - 严格匹配数据库实际结构
export const visitRecords = pgTable('visit_records', {
  id: text('id').primaryKey(),
  visitId: text('visit_id').notNull().references(() => visits.id),
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status').default('registered'),
  registeredAt: timestamp('registered_at'),
  completedAt: timestamp('completed_at'),
});

// 每日宣告表
export const dailyDeclarations = pgTable('daily_declarations', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  date: timestamp('date').notNull(),
  image: text('image'),
  audio: text('audio'),
  summary: text('summary'),
  text: text('text'),
  iconType: varchar('icon_type', { length: 50 }),
  rank: integer('rank'),
  profile: text('profile'),
  duration: varchar('duration', { length: 50 }),
  views: integer('views').default(0),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 系统设置表
export const settings = pgTable('settings', {
  id: text('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
    fields: [activityRegistrations.userId],
    references: [users.id],
  }),
  activity: one(activities, {
    fields: [activityRegistrations.activityId],
    references: [activities.id],
  }),
}));

export const visitRecordsRelations = relations(visitRecords, ({ one }) => ({
  user: one(users, {
    fields: [visitRecords.userId],
    references: [users.id],
  }),
  visit: one(visits, {
    fields: [visitRecords.visitId],
    references: [visits.id],
  }),
}));
