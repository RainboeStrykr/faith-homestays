CREATE TABLE "room_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" varchar(32) NOT NULL UNIQUE,
	"price" varchar(64) NOT NULL,
	"price_note" varchar(128) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
