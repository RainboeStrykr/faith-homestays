CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TABLE "reservation_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"check_in_date" varchar(64) NOT NULL,
	"check_out_date" varchar(64) NOT NULL,
	"guests" varchar(32) NOT NULL,
	"room_type" varchar(128) NOT NULL,
	"room_id" varchar(32),
	"full_name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(64) NOT NULL,
	"message" text,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"auth0_sub" varchar(255) NOT NULL,
	"name" varchar(255),
	"email" varchar(320),
	"avatar" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_sign_in_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_auth0_sub_unique" UNIQUE("auth0_sub")
);
