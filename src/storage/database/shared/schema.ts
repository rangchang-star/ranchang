import { pgTable, serial, timestamp, index, varchar, text, integer, jsonb, boolean, unique, foreignKey, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 使用 sql 函数包装 gen_random_uuid
const gen_random_uuid = () => sql`gen_random_uuid()`



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const activities = pgTable("activities", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
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
	coverImageKey: text("cover_image_key"),
	teaFee: text("tea_fee"),
	tags: jsonb("tags"),
	guests: jsonb("guests"),
}, (table) => [
	index("activities_cover_image_key_idx").using("btree", table.coverImageKey.asc().nullsLast().op("text_ops")),
	index("activities_date_idx").using("btree", table.date.asc().nullsLast().op("timestamptz_ops")),
	index("activities_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("activities_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
]);

export const assessments = pgTable("assessments", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
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
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
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

export const userFollows = pgTable("user_follows", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	followerId: varchar("follower_id", { length: 36 }).notNull(),
	followingId: varchar("following_id", { length: 36 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("user_follows_follower_id_idx").using("btree", table.followerId.asc().nullsLast().op("text_ops")),
	index("user_follows_following_id_idx").using("btree", table.followingId.asc().nullsLast().op("text_ops")),
]);

export const visitRecords = pgTable("visit_records", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
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

export const notifications = pgTable("notifications", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	actionUrl: text("action_url"),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("notifications_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("notifications_is_read_idx").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	index("notifications_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	index("notifications_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const users = pgTable("users", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
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
	tagStamp: varchar("tag_stamp", { length: 50 }),
	hardcoreTags: jsonb("hardcore_tags"),
	gender: varchar({ length: 10 }),
	companyScale: varchar("company_scale", { length: 50 }),
	avatarKey: text("avatar_key"),
}, (table) => [
	index("users_avatar_key_idx").using("btree", table.avatarKey.asc().nullsLast().op("text_ops")),
	index("users_connection_type_idx").using("btree", table.connectionType.asc().nullsLast().op("text_ops")),
	index("users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("users_industry_idx").using("btree", table.industry.asc().nullsLast().op("text_ops")),
	index("users_phone_idx").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	unique("users_email_key").on(table.email),
]);

export const visits = pgTable("visits", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
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
	coverImageKey: text("cover_image_key"),
	visitorId: varchar("visitor_id", { length: 36 }),
	record: text(),
	outcome: text(),
	notes: text(),
	keyPoints: jsonb("key_points"),
	nextSteps: jsonb("next_steps"),
	rating: integer(),
	feedbackAudio: text("feedback_audio"),
	photos: jsonb(),
	time: varchar({ length: 20 }),
	participants: integer(),
}, (table) => [
	index("visits_company_id_idx").using("btree", table.companyId.asc().nullsLast().op("text_ops")),
	index("visits_cover_image_key_idx").using("btree", table.coverImageKey.asc().nullsLast().op("text_ops")),
	index("visits_date_idx").using("btree", table.date.asc().nullsLast().op("timestamptz_ops")),
	index("visits_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
]);

export const dailyDeclarations = pgTable("daily_declarations", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	image: text(),
	audio: text(),
	summary: text(),
	text: text(),
	iconType: varchar("icon_type", { length: 50 }),
	rank: integer(),
	profile: text(),
	duration: varchar({ length: 50 }),
	views: integer().default(0),
	isFeatured: boolean("is_featured").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const settings = pgTable("settings", {
	id: serial().primaryKey().notNull(),
	config: jsonb().notNull().default("{}"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("settings_id_idx").using("btree", table.id.asc().nullsLast().op("int8_ops")),
]);

export const adminUsers = pgTable("admin_users", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
	username: varchar({ length: 128 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 50 }).notNull().default('admin'),
	status: varchar({ length: 20 }).notNull().default('active'),
	avatar: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("admin_users_username_idx").using("btree", table.username.asc().nullsLast().op("text_ops")),
	index("admin_users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("admin_users_role_idx").using("btree", table.role.asc().nullsLast().op("text_ops")),
	index("admin_users_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
]);

export const appUsers = pgTable("app_users", {
	id: varchar({ length: 36 }),
	name: varchar({ length: 128 }),
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
	status: varchar({ length: 20 }),
	isFeatured: boolean("is_featured"),
	joinDate: timestamp("join_date", { withTimezone: true, mode: 'string' }),
	lastLogin: timestamp("last_login", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	tagStamp: varchar("tag_stamp", { length: 50 }),
	hardcoreTags: jsonb("hardcore_tags"),
	gender: varchar({ length: 10 }),
	companyScale: varchar("company_scale", { length: 50 }),
	experience: jsonb().default([]),
	achievement: jsonb().default([]),
	declaration: text(),
	password: varchar({ length: 255 }),
	nickname: varchar({ length: 50 }),
	bio: text(),
	city: varchar({ length: 50 }),
	isTrusted: boolean("is_trusted").default(false),
	tags: jsonb(),
});

export const activityRegistrations = pgTable("activity_registrations", {
	id: varchar({ length: 36 }).primaryKey().default(gen_random_uuid()),
	activityId: text("activity_id").notNull(),
	userId: text("user_id").notNull(),
	status: varchar({ length: 50 }).default('registered'),
	registeredAt: timestamp("registered_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	note: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_registrations_activity_id_fkey"
		}).onDelete("cascade"),
]);

export const authCredentials = pgTable("auth_credentials", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	username: varchar({ length: 50 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("auth_credentials_username_key").on(table.username),
]);

export const digitalAssets = pgTable("digital_assets", {
	id: varchar({ length: 36 }).default(gen_random_uuid()).primaryKey().notNull(),
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
	fileKey: text("file_key"),
	coverImageKey: text("cover_image_key"),
}, (table) => [
	index("digital_assets_cover_image_key_idx").using("btree", table.coverImageKey.asc().nullsLast().op("text_ops")),
	index("digital_assets_file_key_idx").using("btree", table.fileKey.asc().nullsLast().op("text_ops")),
	index("digital_assets_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("digital_assets_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	index("digital_assets_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const documents = pgTable("documents", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	fileUrl: text("file_url").notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	fileSize: integer("file_size").default(0),
	category: varchar({ length: 50 }).default('其他'),
	createdBy: integer("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	downloadCount: integer("download_count").default(0),
	cover: text(),
});

export const declarations = pgTable("declarations", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	direction: varchar({ length: 100 }),
	text: text().notNull(),
	summary: text(),
	audioUrl: varchar("audio_url", { length: 500 }),
	views: integer().default(0),
	date: date().notNull(),
	isFeatured: boolean("is_featured").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	audioKey: text("audio_key"),
}, (table) => [
	index("declarations_audio_key_idx").using("btree", table.audioKey.asc().nullsLast().op("text_ops")),
]);
