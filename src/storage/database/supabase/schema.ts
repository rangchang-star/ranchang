import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// 用户表（就是会员表）- 严格匹配 ran_field 数据库实际结构
export const users = pgTable('users', {
  id: text('id').primaryKey(),
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
  ability_tags: jsonb('ability_tags'),
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

// 探访表 - 严格匹配 ran_field 数据库实际结构
export const visits = pgTable('visits', {
  id: integer('id').primaryKey(),
  title: varchar('title'),
  description: text('description'),
  image: text('image'),
  location: varchar('location'),
  date: timestamp('date'),
  capacity: integer('capacity'),
  tea_fee: integer('tea_fee'),
  status: text('status'),
  created_by: integer('created_by'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
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

// 每日宣告表 - 严格匹配 ran_field 数据库实际结构
export const dailyDeclarations = pgTable('daily_declarations', {
  id: integer('id').primaryKey(),
  title: varchar('title'),
  date: timestamp('date'),
  image: text('image'),
  audio: text('audio'),
  summary: text('summary'),
  text: text('text'),
  icon_type: varchar('icon_type'),
  rank: integer('rank'),
  profile: text('profile'),
  duration: varchar('duration'),
  views: integer('views'),
  is_featured: boolean('is_featured'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
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
