import { pgTable, serial, varchar, text, integer, timestamp, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 用户角色枚举
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// 用户状态枚举
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive']);

// 标签类型枚举
export const tagStampEnum = pgEnum('tag_stamp', ['personLookingForJob', 'jobLookingForPerson', 'pureExchange']);

// 活动类型枚举
export const activityCategoryEnum = pgEnum('activity_category', ['private', 'salon', 'ai']);

// 活动状态枚举
export const activityStatusEnum = pgEnum('activity_status', ['draft', 'active', 'ended', 'cancelled']);

// 探访状态枚举
export const visitStatusEnum = pgEnum('visit_status', ['draft', 'active', 'ended', 'cancelled']);

// 报名状态枚举
export const registrationStatusEnum = pgEnum('registration_status', ['registered', 'cancelled']);

// 支付状态枚举
export const paymentStatusEnum = pgEnum('payment_status', ['paid', 'unpaid', 'offline']);

// 用户表（就是会员表）
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  nickname: varchar('nickname', { length: 50 }),
  name: varchar('name', { length: 50 }),
  avatar: text('avatar'),
  age: integer('age'),
  company: varchar('company', { length: 100 }),
  position: varchar('position', { length: 50 }),
  industry: varchar('industry', { length: 50 }),
  bio: text('bio'),
  need: text('need'),
  tagStamp: tagStampEnum('tag_stamp').default('pureExchange'),
  tags: jsonb('tags').$type<string[]>(),
  abilityTags: jsonb('ability_tags').$type<string[]>(),
  resourceTags: jsonb('resource_tags').$type<string[]>(),
  isTrusted: boolean('is_trusted').default(false),
  role: userRoleEnum('role').default('user'),
  status: userStatusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 活动表
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  subtitle: varchar('subtitle', { length: 200 }),
  category: activityCategoryEnum('category').default('private'),
  description: text('description').notNull(),
  image: text('image'),
  address: varchar('address', { length: 200 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  capacity: integer('capacity').default(0),
  teaFee: integer('tea_fee').default(0),
  status: activityStatusEnum('status').default('draft'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 探访表
export const visits = pgTable('visits', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  image: text('image'),
  location: varchar('location', { length: 200 }),
  date: timestamp('date'),
  capacity: integer('capacity').default(0),
  teaFee: integer('tea_fee').default(0),
  status: visitStatusEnum('status').default('draft'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 报名记录表
export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  activityId: integer('activity_id').references(() => activities.id),
  visitId: integer('visit_id').references(() => visits.id),
  status: registrationStatusEnum('status').default('registered'),
  paymentStatus: paymentStatusEnum('payment_status').default('unpaid'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 关系定义
export const usersRelations = relations(users, ({ many }) => ({
  createdActivities: many(activities),
  createdVisits: many(visits),
  registrations: many(registrations),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  creator: one(users, {
    fields: [activities.createdBy],
    references: [users.id],
  }),
  registrations: many(registrations),
}));

export const visitsRelations = relations(visits, ({ one, many }) => ({
  creator: one(users, {
    fields: [visits.createdBy],
    references: [users.id],
  }),
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
