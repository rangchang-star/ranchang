import { pgTable, serial, timestamp, varchar, text, integer, jsonb, boolean, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }).notNull(),
    age: integer("age"),
    avatar: text("avatar"),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }).unique(),
    connectionType: varchar("connection_type", { length: 50 }), // 人找事/事找人/纯交流
    industry: varchar("industry", { length: 100 }), // 行业标签
    need: text("need"), // 一句话说清需求
    abilityTags: jsonb("ability_tags"), // 能力标签（JSON数组）
    resourceTags: jsonb("resource_tags"), // 资源标签（JSON数组）
    level: varchar("level", { length: 50 }), // 会员等级
    company: varchar("company", { length: 255 }), // 公司
    position: varchar("position", { length: 255 }), // 职位
    status: varchar("status", { length: 20 }).default("active"), // active/inactive
    isFeatured: boolean("is_featured").default(false),
    joinDate: timestamp("join_date", { withTimezone: true }).defaultNow(),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("users_phone_idx").on(table.phone),
    index("users_email_idx").on(table.email),
    index("users_connection_type_idx").on(table.connectionType),
    index("users_industry_idx").on(table.industry),
  ]
);

// 活动表
export const activities = pgTable(
  "activities",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    date: timestamp("date", { withTimezone: true }).notNull(),
    startTime: varchar("start_time", { length: 10 }), // 格式: "09:00"
    endTime: varchar("end_time", { length: 10 }), // 格式: "17:00"
    location: varchar("location", { length: 255 }),
    capacity: integer("capacity"),
    registeredCount: integer("registered_count").default(0),
    type: varchar("type", { length: 50 }), // 活动类型
    coverImage: text("cover_image"),
    status: varchar("status", { length: 20 }).default("draft"), // draft/published/cancelled
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("activities_date_idx").on(table.date),
    index("activities_status_idx").on(table.status),
    index("activities_type_idx").on(table.type),
  ]
);

// 探访表
export const visits = pgTable(
  "visits",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    companyId: varchar("company_id", { length: 36 }).notNull(),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    industry: varchar("industry", { length: 100 }),
    location: varchar("location", { length: 255 }),
    description: text("description"),
    date: timestamp("date", { withTimezone: true }).notNull(),
    capacity: integer("capacity"),
    registeredCount: integer("registered_count").default(0),
    coverImage: text("cover_image"),
    status: varchar("status", { length: 20 }).default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("visits_date_idx").on(table.date),
    index("visits_status_idx").on(table.status),
    index("visits_company_id_idx").on(table.companyId),
  ]
);

// 量表评估表
export const assessments = pgTable(
  "assessments",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(), // 评估名称：创业心理评估、商业认知评估等
    score: integer("score").notNull(), // 总分
    level: varchar("level", { length: 20 }), // 优秀/良好/中等/需提升
    summary: text("summary"), // 一句话总结
    dimensions: jsonb("dimensions"), // 维度得分（JSON数组）
    testDate: timestamp("test_date", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("assessments_user_id_idx").on(table.userId),
    index("assessments_name_idx").on(table.name),
    index("assessments_test_date_idx").on(table.testDate),
  ]
);

// 高燃宣告表
export const declarations = pgTable(
  "declarations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull(),
    direction: varchar("direction", { length: 50 }), // 信心/使命/自我/对手/环境
    text: text("text").notNull(), // 宣告内容
    summary: text("summary"), // 宣告总结
    audioUrl: text("audio_url"), // 音频URL
    views: integer("views").default(0), // 查看次数
    date: timestamp("date", { withTimezone: true }).defaultNow(),
    isFeatured: boolean("is_featured").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("declarations_user_id_idx").on(table.userId),
    index("declarations_direction_idx").on(table.direction),
    index("declarations_date_idx").on(table.date),
  ]
);

// 咨询表
export const consultations = pgTable(
  "consultations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull(),
    topicId: varchar("topic_id", { length: 50 }), // 咨询话题ID：ai-frontier, entrepreneur-psychology等
    topicName: varchar("topic_name", { length: 100 }),
    question: text("question").notNull(),
    answer: text("answer"),
    status: varchar("status", { length: 20 }).default("pending"), // pending/completed
    consultantName: varchar("consultant_name", { length: 128 }), // 咨询师名称
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("consultations_user_id_idx").on(table.userId),
    index("consultations_topic_id_idx").on(table.topicId),
    index("consultations_status_idx").on(table.status),
  ]
);

// 数字资产表
export const digitalAssets = pgTable(
  "digital_assets",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 50 }), // 文档/表格/视频/音频等
    fileType: varchar("file_type", { length: 50 }), // pdf/xlsx/mp4等
    fileSize: varchar("file_size", { length: 50 }), // 格式: "3.8MB"
    fileUrl: text("file_url"), // 文件URL
    coverImage: text("cover_image"),
    likes: integer("likes").default(0),
    downloads: integer("downloads").default(0),
    status: varchar("status", { length: 20 }).default("draft"), // draft/published
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("digital_assets_user_id_idx").on(table.userId),
    index("digital_assets_type_idx").on(table.type),
    index("digital_assets_status_idx").on(table.status),
  ]
);

// 通知表
export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull(),
    type: varchar("type", { length: 20 }).notNull(), // info/success/warning/error
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    actionUrl: text("action_url"), // 点击通知后的跳转URL
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_type_idx").on(table.type),
    index("notifications_is_read_idx").on(table.isRead),
    index("notifications_created_at_idx").on(table.createdAt),
  ]
);

// 探访记录表（记录用户参加的探访）
export const visitRecords = pgTable(
  "visit_records",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    visitId: varchar("visit_id", { length: 36 }).notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    status: varchar("status", { length: 20 }).default("registered"), // registered/completed/cancelled
    registeredAt: timestamp("registered_at", { withTimezone: true }).defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("visit_records_visit_id_idx").on(table.visitId),
    index("visit_records_user_id_idx").on(table.userId),
    index("visit_records_status_idx").on(table.status),
  ]
);

// 活动报名表（记录用户参加的活动）
export const activityRegistrations = pgTable(
  "activity_registrations",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    activityId: varchar("activity_id", { length: 36 }).notNull(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    status: varchar("status", { length: 20 }).default("pending"), // pending/approved/rejected/cancelled
    registeredAt: timestamp("registered_at", { withTimezone: true }).defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    note: text("note"), // 备注信息
  },
  (table) => [
    index("activity_registrations_activity_id_idx").on(table.activityId),
    index("activity_registrations_user_id_idx").on(table.userId),
    index("activity_registrations_status_idx").on(table.status),
  ]
);

// 用户关注表
export const userFollows = pgTable(
  "user_follows",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    followerId: varchar("follower_id", { length: 36 }).notNull(), // 关注者
    followingId: varchar("following_id", { length: 36 }).notNull(), // 被关注者
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("user_follows_follower_id_idx").on(table.followerId),
    index("user_follows_following_id_idx").on(table.followingId),
  ]
);

// Zod schemas for validation
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});

// 用户表 schemas
export const insertUserSchema = createCoercedInsertSchema(users).pick({
  name: true,
  age: true,
  avatar: true,
  phone: true,
  email: true,
  connectionType: true,
  industry: true,
  need: true,
  abilityTags: true,
  resourceTags: true,
  company: true,
  position: true,
});

export const updateUserSchema = createCoercedInsertSchema(users)
  .pick({
    name: true,
    age: true,
    avatar: true,
    phone: true,
    email: true,
    connectionType: true,
    industry: true,
    need: true,
    abilityTags: true,
    resourceTags: true,
    company: true,
    position: true,
    level: true,
    status: true,
  })
  .partial();

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Activity = typeof activities.$inferSelect;
export type Visit = typeof visits.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type Declaration = typeof declarations.$inferSelect;
export type Consultation = typeof consultations.$inferSelect;
export type DigitalAsset = typeof digitalAssets.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
