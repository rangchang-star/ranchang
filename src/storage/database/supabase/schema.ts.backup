import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// 用户表 - 严格匹配数据库实际结构 (public.users)
// ============================================================
export const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID
  name: varchar('name', { length: 128 }),
  age: integer('age'),
  avatar: text('avatar'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  gender: varchar('gender', { length: 10 }),
  company: varchar('company', { length: 255 }),
  company_scale: varchar('company_scale', { length: 50 }),
  position: varchar('position', { length: 255 }),
  industry: varchar('industry', { length: 100 }),
  bio: text('bio'), // 可能不存在，保留以兼容
  need: text('need'),
  tag_stamp: varchar('tag_stamp', { length: 50 }),
  ability_tags: jsonb('ability_tags'),
  hardcore_tags: jsonb('hardcore_tags'),
  resource_tags: jsonb('resource_tags'),
  level: varchar('level', { length: 50 }),
  connection_type: varchar('connection_type', { length: 50 }),
  status: varchar('status', { length: 20 }),
  is_featured: boolean('is_featured').default(false),
  join_date: timestamp('join_date'),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// 活动表 - 严格匹配数据库实际结构
// ============================================================
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  subtitle: varchar('subtitle', { length: 200 }),
  category: text('category').default('private'),
  description: text('description').notNull(),
  image: text('image'),
  address: varchar('address', { length: 200 }),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  capacity: integer('capacity').default(0),
  tea_fee: integer('tea_fee').default(0),
  status: text('status').default('draft'),
  created_by: integer('created_by').references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// 探访表 - 严格匹配数据库实际结构
// ============================================================
export const visits = pgTable('visits', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  image: text('image'),
  location: varchar('location', { length: 200 }),
  date: timestamp('date'),
  capacity: integer('capacity').default(0),
  tea_fee: integer('tea_fee').default(0),
  status: text('status').default('draft'),
  created_by: integer('created_by').references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// 活动报名记录表 - 严格匹配数据库实际结构
// ============================================================
export const activityRegistrations = pgTable('activity_registrations', {
  id: serial('id').primaryKey(),
  activity_id: integer('activity_id').notNull().references(() => activities.id),
  user_id: integer('user_id').notNull().references(() => users.id),
  status: varchar('status', { length: 50 }).default('registered'),
  registered_at: timestamp('registered_at').defaultNow(),
  reviewed_at: timestamp('reviewed_at'),
  note: text('note'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// ============================================================
// 通用报名表 - 严格匹配数据库实际结构
// ============================================================
export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  activity_id: integer('activity_id').references(() => activities.id),
  visit_id: integer('visit_id').references(() => visits.id),
  status: text('status').default('registered'),
  payment_status: text('payment_status').default('unpaid'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// ============================================================
// 高燃宣告表 - 严格匹配数据库实际结构
// ============================================================
export const declarations = pgTable('declarations', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  direction: varchar('direction', { length: 100 }),
  text: text('text').notNull(),
  summary: text('summary'),
  audio_url: varchar('audio_url', { length: 500 }),
  views: integer('views').default(0),
  date: timestamp('date').notNull(),
  is_featured: boolean('is_featured').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// ============================================================
// 每日宣告表 - 严格匹配数据库实际结构
// ============================================================
export const dailyDeclarations = pgTable('daily_declarations', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  date: timestamp('date').notNull(),
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
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// 通知表 - 严格匹配数据库实际结构
// ============================================================
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 50 }).default('info'),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  action_url: varchar('action_url', { length: 500 }),
  is_read: boolean('is_read').default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// 系统设置表 - 严格匹配数据库实际结构
// ============================================================
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// ============================================================
// 关系定义
// ============================================================
export const usersRelations = relations(users, ({ many }) => ({
  activityRegistrations: many(activityRegistrations),
  registrations: many(registrations),
  notifications: many(notifications),
  createdActivities: many(activities),
  createdVisits: many(visits),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [activities.created_by],
    references: [users.id],
  }),
  registrations: many(activityRegistrations),
  generalRegistrations: many(registrations),
}));

export const visitsRelations = relations(visits, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [visits.created_by],
    references: [users.id],
  }),
  registrations: many(registrations),
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

export const registrationsRelations = relations(registrations, ({ one }) => ({
  user: one(users, {
    fields: [registrations.user_id],
    references: [users.id],
  }),
  activity: one(activities, {
    fields: [registrations.activity_id],
    references: [activities.id],
  }),
  visit: one(visits, {
    fields: [registrations.visit_id],
    references: [visits.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.user_id],
    references: [users.id],
  }),
}));
