import { pgTable, serial, varchar, timestamp, text, integer, boolean, unique, jsonb, date, foreignKey, index, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const activityCategory = pgEnum("activity_category", ['private', 'salon', 'ai'])
export const activityStatus = pgEnum("activity_status", ['draft', 'active', 'ended', 'cancelled'])
export const paymentStatus = pgEnum("payment_status", ['paid', 'unpaid', 'offline'])
export const registrationStatus = pgEnum("registration_status", ['registered', 'cancelled'])
export const tagStamp = pgEnum("tag_stamp", ['personLookingForJob', 'jobLookingForPerson', 'pureExchange'])
export const userRole = pgEnum("user_role", ['user', 'admin'])
export const userStatus = pgEnum("user_status", ['active', 'inactive'])
export const visitStatus = pgEnum("visit_status", ['draft', 'active', 'ended', 'cancelled'])


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
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const settings = pgTable("settings", {
	id: serial().primaryKey().notNull(),
	key: varchar({ length: 100 }).notNull(),
	value: jsonb().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("settings_key_key").on(table.key),
]);

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
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	phone: varchar({ length: 20 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	nickname: varchar({ length: 50 }),
	name: varchar({ length: 50 }),
	avatar: text(),
	age: integer(),
	company: varchar({ length: 100 }),
	position: varchar({ length: 50 }),
	industry: varchar({ length: 50 }),
	bio: text(),
	need: text(),
	tagStamp: tagStamp("tag_stamp").default('pureExchange'),
	tags: jsonb(),
	hardcoreTags: jsonb("hardcore_tags"),
	resourceTags: jsonb("resource_tags"),
	isTrusted: boolean("is_trusted").default(false),
	isFeatured: boolean("is_featured").default(false),
	connectionCount: integer("connection_count").default(0),
	activityCount: integer("activity_count").default(0),
	role: userRole().default('user'),
	status: userStatus().default('active'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("users_phone_key").on(table.phone),
]);

export const activities = pgTable("activities", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	subtitle: varchar({ length: 200 }),
	category: activityCategory().default('private'),
	description: text().notNull(),
	image: text(),
	address: varchar({ length: 200 }),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	capacity: integer().default(0),
	teaFee: integer("tea_fee").default(0),
	status: activityStatus().default('draft'),
	createdBy: integer("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "activities_created_by_fkey"
		}),
]);

export const visits = pgTable("visits", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text().notNull(),
	image: text(),
	location: varchar({ length: 200 }),
	date: timestamp({ mode: 'string' }),
	capacity: integer().default(0),
	teaFee: integer("tea_fee").default(0),
	status: visitStatus().default('draft'),
	createdBy: integer("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "visits_created_by_fkey"
		}),
]);

export const registrations = pgTable("registrations", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	activityId: integer("activity_id"),
	visitId: integer("visit_id"),
	status: registrationStatus().default('registered'),
	paymentStatus: paymentStatus("payment_status").default('unpaid'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "registrations_activity_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "registrations_user_id_fkey"
		}),
	foreignKey({
			columns: [table.visitId],
			foreignColumns: [visits.id],
			name: "registrations_visit_id_fkey"
		}),
]);

export const activityRegistrations = pgTable("activity_registrations", {
	id: serial().primaryKey().notNull(),
	activityId: integer("activity_id").notNull(),
	userId: integer("user_id").notNull(),
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
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "activity_registrations_user_id_fkey"
		}).onDelete("cascade"),
]);

export const notifications = pgTable("notifications", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	type: varchar({ length: 50 }).default('info'),
	title: varchar({ length: 255 }).notNull(),
	message: text(),
	actionUrl: varchar("action_url", { length: 500 }),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_notifications_is_read").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	index("idx_notifications_user_id").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
]);
