import { pgTable, index, varchar, text, timestamp, integer, serial, jsonb, boolean, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


// UUID 生成函数
const genRandomUuid = sql`gen_random_uuid()`;

export const activities = pgTable("activities", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	startTime: varchar("start_time", { length: 10 }),
	endTime: varchar("end_time", { length: 10 }),
	location: varchar({ length: 255 }),
	capacity: integer(),
	registeredCount: integer("registered_count").default(0),
	type: varchar({ length: 50 }),
	coverImage: text("cover_image"),
	status: varchar({ length: 20 }).default('draft'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("activities_date_idx").using("btree", table.date.asc().nullsLast().op("timestamptz_ops")),
	index("activities_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("activities_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
]);

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const activityRegistrations = pgTable("activity_registrations", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	activityId: varchar("activity_id", { length: 36 }).notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	status: varchar({ length: 20 }).default('pending'),
	registeredAt: timestamp("registered_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: 'string' }),
	note: text(),
}, (table) => [
	index("activity_registrations_activity_id_idx").using("btree", table.activityId.asc().nullsLast().op("text_ops")),
	index("activity_registrations_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("activity_registrations_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const assessments = pgTable("assessments", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	name: varchar({ length: 128 }).notNull(),
	score: integer().notNull(),
	level: varchar({ length: 20 }),
	summary: text(),
	dimensions: jsonb(),
	testDate: timestamp("test_date", { withTimezone: true, mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("assessments_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("assessments_test_date_idx").using("btree", table.testDate.asc().nullsLast().op("timestamptz_ops")),
	index("assessments_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const consultations = pgTable("consultations", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	topicId: varchar("topic_id", { length: 50 }),
	topicName: varchar("topic_name", { length: 100 }),
	question: text().notNull(),
	answer: text(),
	status: varchar({ length: 20 }).default('pending'),
	consultantName: varchar("consultant_name", { length: 128 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("consultations_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("consultations_topic_id_idx").using("btree", table.topicId.asc().nullsLast().op("text_ops")),
	index("consultations_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const declarations = pgTable("declarations", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	direction: varchar({ length: 50 }),
	text: text().notNull(),
	summary: text(),
	audioUrl: text("audio_url"),
	views: integer().default(0),
	date: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	isFeatured: boolean("is_featured").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("declarations_date_idx").using("btree", table.date.asc().nullsLast().op("timestamptz_ops")),
	index("declarations_direction_idx").using("btree", table.direction.asc().nullsLast().op("text_ops")),
	index("declarations_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const digitalAssets = pgTable("digital_assets", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	type: varchar({ length: 50 }),
	fileType: varchar("file_type", { length: 50 }),
	fileSize: varchar("file_size", { length: 50 }),
	fileUrl: text("file_url"),
	coverImage: text("cover_image"),
	likes: integer().default(0),
	downloads: integer().default(0),
	status: varchar({ length: 20 }).default('draft'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("digital_assets_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("digital_assets_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	index("digital_assets_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const notifications = pgTable("notifications", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	actionUrl: text("action_url"),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("notifications_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("notifications_is_read_idx").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	index("notifications_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	index("notifications_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const userFollows = pgTable("user_follows", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	followerId: varchar("follower_id", { length: 36 }).notNull(),
	followingId: varchar("following_id", { length: 36 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("user_follows_follower_id_idx").using("btree", table.followerId.asc().nullsLast().op("text_ops")),
	index("user_follows_following_id_idx").using("btree", table.followingId.asc().nullsLast().op("text_ops")),
]);

export const users = pgTable("users", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	name: varchar({ length: 128 }).notNull(),
	age: integer(),
	avatar: text(),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	connectionType: varchar("connection_type", { length: 50 }),
	industry: varchar({ length: 100 }),
	need: text(),
	abilityTags: jsonb("ability_tags"),
	resourceTags: jsonb("resource_tags"),
	level: varchar({ length: 50 }),
	company: varchar({ length: 255 }),
	position: varchar({ length: 255 }),
	status: varchar({ length: 20 }).default('active'),
	isFeatured: boolean("is_featured").default(false),
	joinDate: timestamp("join_date", { withTimezone: true, mode: 'string' }).defaultNow(),
	lastLogin: timestamp("last_login", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("users_connection_type_idx").using("btree", table.connectionType.asc().nullsLast().op("text_ops")),
	index("users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("users_industry_idx").using("btree", table.industry.asc().nullsLast().op("text_ops")),
	index("users_phone_idx").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	unique("users_email_unique").on(table.email),
]);

export const visitRecords = pgTable("visit_records", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	visitId: varchar("visit_id", { length: 36 }).notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	status: varchar({ length: 20 }).default('registered'),
	registeredAt: timestamp("registered_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("visit_records_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("visit_records_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("visit_records_visit_id_idx").using("btree", table.visitId.asc().nullsLast().op("text_ops")),
]);

export const visits = pgTable("visits", {
	id: varchar({ length: 36 }).default(genRandomUuid).primaryKey().notNull(),
	companyId: varchar("company_id", { length: 36 }).notNull(),
	companyName: varchar("company_name", { length: 255 }).notNull(),
	industry: varchar({ length: 100 }),
	location: varchar({ length: 255 }),
	description: text(),
	date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	capacity: integer(),
	registeredCount: integer("registered_count").default(0),
	coverImage: text("cover_image"),
	status: varchar({ length: 20 }).default('draft'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("visits_company_id_idx").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	index("visits_date_idx").using("btree", table.date.asc().nullsLast().op("timestamptz_ops")),
	index("visits_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
]);
