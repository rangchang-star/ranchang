CREATE TYPE "public"."tag_stamp" AS ENUM('personLookingForJob', 'jobLookingForPerson', 'pureExchange');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "industry" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "need" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tag_stamp" "tag_stamp" DEFAULT 'pureExchange';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tags" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hardcore_tags" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "resource_tags" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_trusted" boolean DEFAULT false;