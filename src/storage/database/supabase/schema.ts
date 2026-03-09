import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// 用户表（就是会员表）- 严格匹配数据库实际结构
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  age: integer('age'),
  avatar: text('avatar'),
  phone: text('phone').notNull(),
  email: text('email'),
  connection_type: text('connection_type'),
  industry: text('industry'),
  need: text('need'),
  ability_tags: jsonb('ability_tags').$type<string[]>(),
  resource_tags: jsonb('resource_tags').$type<string[]>(),
  level: text('level'),
  company: text('company'),
  position: text('position'),
  status: text('status').default('active'),
  is_featured: boolean('is_featured').default(false),
  join_date: timestamp('join_date'),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 活动表 - 严格匹配数据库实际结构
export const activities = pgTable('activities', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: timestamp('date'),
  start_time: text('start_time'),
  end_time: text('end_time'),
  location: text('location'),
  capacity: integer('capacity').default(0),
  registered_count: integer('registered_count').default(0),
  type: text('type'),
  cover_image: text('cover_image'),
  status: text('status').default('active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
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

// 报名记录表
export const registrations = pgTable('registrations', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull().references(() => users.id),
  activityId: text('activity_id').references(() => activities.id),
  visitId: text('visit_id').references(() => visits.id),
  status: text('status').default('registered'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
  registrations: many(registrations),
}));

export const activitiesRelations = relations(activities, ({ many }) => ({
  registrations: many(registrations),
}));

export const visitsRelations = relations(visits, ({ many }) => ({
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  activity: one(activities, {
    fields: [registrations.activityId],
    references: [activities.id],
  }),
  visit: one(visits, {
    fields: [registrations.visitId],
    references: [visits.id],
  }),
}));
