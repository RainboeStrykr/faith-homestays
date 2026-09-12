import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["pending", "confirmed", "cancelled"]);

export const reservationRequests = pgTable("reservation_requests", {
  id: serial("id").primaryKey(),
  checkInDate: varchar("check_in_date", { length: 64 }).notNull(),
  checkOutDate: varchar("check_out_date", { length: 64 }).notNull(),
  guests: varchar("guests", { length: 32 }).notNull(),
  roomType: varchar("room_type", { length: 128 }).notNull(),
  roomId: varchar("room_id", { length: 32 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  message: text("message"),
  status: statusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomPrices = pgTable("room_prices", {
  id: serial("id").primaryKey(),
  roomId: varchar("room_id", { length: 32 }).notNull().unique(),
  price: varchar("price", { length: 64 }).notNull(),
  priceNote: varchar("price_note", { length: 128 }).notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type RoomPrice = typeof roomPrices.$inferSelect;
export type InsertRoomPrice = typeof roomPrices.$inferInsert;

export type ReservationRequest = typeof reservationRequests.$inferSelect;
export type InsertReservationRequest = typeof reservationRequests.$inferInsert;
