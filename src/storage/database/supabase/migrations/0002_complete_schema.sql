-- 完整数据库迁移脚本 - 从前端模拟数据同步
-- 此脚本包含所有表的完整定义，包括扩展的用户字段

-- ==========================================
-- 枚举类型定义
-- ==========================================

CREATE TYPE IF NOT EXISTS "user_role" AS ENUM('user', 'admin');
CREATE TYPE IF NOT EXISTS "user_status" AS ENUM('active', 'inactive');
CREATE TYPE IF NOT EXISTS "tag_stamp" AS ENUM('personLookingForJob', 'jobLookingForPerson', 'pureExchange');
CREATE TYPE IF NOT EXISTS "activity_category" AS ENUM('private', 'salon', 'ai');
CREATE TYPE IF NOT EXISTS "activity_status" AS ENUM('draft', 'active', 'ended', 'cancelled');
CREATE TYPE IF NOT EXISTS "visit_status" AS ENUM('draft', 'active', 'ended', 'cancelled');
CREATE TYPE IF NOT EXISTS "registration_status" AS ENUM('registered', 'cancelled');
CREATE TYPE IF NOT EXISTS "payment_status" AS ENUM('paid', 'unpaid', 'offline');

-- ==========================================
-- 删除已存在的表（如果存在）
-- ==========================================

DROP TABLE IF EXISTS "registrations" CASCADE;
DROP TABLE IF EXISTS "activities" CASCADE;
DROP TABLE IF EXISTS "visits" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- ==========================================
-- 创建表结构
-- ==========================================

-- 用户表（会员表）
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"password" varchar(255) NOT NULL,
	"nickname" varchar(50),
	"name" varchar(50),
	"avatar" text,
	"age" integer,
	"company" varchar(100),
	"position" varchar(50),
	"industry" varchar(50),
	"bio" text,
	"need" text,
	"tag_stamp" "tag_stamp" DEFAULT 'pureExchange',
	"tags" jsonb,
	"ability_tags" jsonb,
	"resource_tags" jsonb,
	"is_trusted" boolean DEFAULT false,
	"role" "user_role" DEFAULT 'user',
	"status" "user_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);

-- 活动表
CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"subtitle" varchar(200),
	"category" "activity_category" DEFAULT 'private',
	"description" text NOT NULL,
	"image" text,
	"address" varchar(200),
	"start_date" timestamp,
	"end_date" timestamp,
	"capacity" integer DEFAULT 0,
	"tea_fee" integer DEFAULT 0,
	"status" "activity_status" DEFAULT 'draft',
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- 探访表
CREATE TABLE "visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"image" text,
	"location" varchar(200),
	"date" timestamp,
	"capacity" integer DEFAULT 0,
	"tea_fee" integer DEFAULT 0,
	"status" "visit_status" DEFAULT 'draft',
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- 报名记录表
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"activity_id" integer,
	"visit_id" integer,
	"status" "registration_status" DEFAULT 'registered',
	"payment_status" "payment_status" DEFAULT 'unpaid',
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ==========================================
-- 创建外键约束
-- ==========================================

ALTER TABLE "activities" ADD CONSTRAINT "activities_created_by_users_id_fk" 
	FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") 
	ON DELETE no action ON UPDATE no action;

ALTER TABLE "visits" ADD CONSTRAINT "visits_created_by_users_id_fk" 
	FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") 
	ON DELETE no action ON UPDATE no action;

ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_users_id_fk" 
	FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
	ON DELETE no action ON UPDATE no action;

ALTER TABLE "registrations" ADD CONSTRAINT "registrations_activity_id_activities_id_fk" 
	FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") 
	ON DELETE no action ON UPDATE no action;

ALTER TABLE "registrations" ADD CONSTRAINT "registrations_visit_id_visits_id_fk" 
	FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") 
	ON DELETE no action ON UPDATE no action;

-- ==========================================
-- 创建索引（优化查询性能）
-- ==========================================

CREATE INDEX IF NOT EXISTS "idx_users_phone" ON "users"("phone");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");
CREATE INDEX IF NOT EXISTS "idx_users_tag_stamp" ON "users"("tag_stamp");
CREATE INDEX IF NOT EXISTS "idx_activities_category" ON "activities"("category");
CREATE INDEX IF NOT EXISTS "idx_activities_status" ON "activities"("status");
CREATE INDEX IF NOT EXISTS "idx_visits_status" ON "visits"("status");
CREATE INDEX IF NOT EXISTS "idx_registrations_user_id" ON "registrations"("user_id");
CREATE INDEX IF NOT EXISTS "idx_registrations_activity_id" ON "registrations"("activity_id");
CREATE INDEX IF NOT EXISTS "idx_registrations_visit_id" ON "registrations"("visit_id");

-- ==========================================
-- 创建视图（便于查询）
-- ==========================================

-- 活动报名统计视图
CREATE OR REPLACE VIEW "activity_stats" AS
SELECT 
	a.id,
	a.title,
	a.category,
	a.status,
	a.capacity,
	COUNT(r.id) as registered_count,
	CASE 
		WHEN COUNT(r.id) >= a.capacity THEN true 
		ELSE false 
	END as is_full
FROM "activities" a
LEFT JOIN "registrations" r ON a.id = r.activity_id AND r.status = 'registered'
GROUP BY a.id, a.title, a.category, a.status, a.capacity;

-- 探访报名统计视图
CREATE OR REPLACE VIEW "visit_stats" AS
SELECT 
	v.id,
	v.title,
	v.status,
	v.capacity,
	COUNT(r.id) as registered_count,
	CASE 
		WHEN COUNT(r.id) >= v.capacity THEN true 
		ELSE false 
	END as is_full
FROM "visits" v
LEFT JOIN "registrations" r ON v.id = r.visit_id AND r.status = 'registered'
GROUP BY v.id, v.title, v.status, v.capacity;

-- ==========================================
-- 创建触发器（自动更新 updated_at）
-- ==========================================

-- 用户表更新时间触发器
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
	BEFORE UPDATE ON "users"
	FOR EACH ROW
	EXECUTE FUNCTION update_users_updated_at();

-- 活动表更新时间触发器
CREATE OR REPLACE FUNCTION update_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_activities_updated_at
	BEFORE UPDATE ON "activities"
	FOR EACH ROW
	EXECUTE FUNCTION update_activities_updated_at();

-- 探访表更新时间触发器
CREATE OR REPLACE FUNCTION update_visits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_visits_updated_at
	BEFORE UPDATE ON "visits"
	FOR EACH ROW
	EXECUTE FUNCTION update_visits_updated_at();

-- ==========================================
-- 完成
-- ==========================================

COMMENT ON TABLE "users" IS '用户表（会员表）- 存储用户基本信息、能力标签、需求描述等';
COMMENT ON TABLE "activities" IS '活动表 - 存储活动信息';
COMMENT ON TABLE "visits" IS '探访表 - 存储探访企业活动信息';
COMMENT ON TABLE "registrations" IS '报名记录表 - 存储用户报名活动的记录';
COMMENT ON VIEW "activity_stats" IS '活动报名统计视图';
COMMENT ON VIEW "visit_stats" IS '探访报名统计视图';
