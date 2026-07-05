import { z } from "zod";
import { createRouter, authedQuery, adminQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reservationRequests } from "@db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const reservationRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        checkInDate: z.string(),
        checkOutDate: z.string(),
        guests: z.string().min(1),
        roomType: z.string().min(1),
        roomId: z.string().optional(),
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(reservationRequests).values({
        userId: ctx.user.id,
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        guests: input.guests,
        roomType: input.roomType,
        roomId: input.roomId ?? null,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        message: input.message ?? null,
        status: "pending",
      }).returning({ id: reservationRequests.id });
      return { id: result[0].id, success: true };
    }),

  myReservations: authedQuery
    .query(async ({ ctx }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(reservationRequests)
        .where(eq(reservationRequests.userId, ctx.user.id))
        .orderBy(desc(reservationRequests.createdAt));
      return results;
    }),

  cancel: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db
        .update(reservationRequests)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(reservationRequests.id, input.id),
            eq(reservationRequests.userId, ctx.user.id)
          )
        );
      return { success: true };
    }),

  allReservations: adminQuery
    .query(async () => {
      const db = getDb();
      const results = await db
        .select()
        .from(reservationRequests)
        .orderBy(desc(reservationRequests.createdAt));
      return results;
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(reservationRequests)
        .set({ status: input.status })
        .where(eq(reservationRequests.id, input.id));
      return { success: true };
    }),

  /**
   * Public — checks whether a room has remaining capacity for the given dates.
   * Returns the total confirmed beds booked for overlapping reservations so the
   * caller can compare against the room's capacity.
   *
   * Two date ranges overlap when: checkIn_A < checkOut_B AND checkOut_A > checkIn_B
   */
  checkAvailability: publicQuery
    .input(
      z.object({
        roomId: z.string(),
        checkIn: z.string(),  // YYYY-MM-DD
        checkOut: z.string(), // YYYY-MM-DD
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select({ guests: reservationRequests.guests })
        .from(reservationRequests)
        .where(
          and(
            eq(reservationRequests.roomId, input.roomId),
            eq(reservationRequests.status, "confirmed"),
            // overlapping: existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
            sql`${reservationRequests.checkInDate} < ${input.checkOut}`,
            sql`${reservationRequests.checkOutDate} > ${input.checkIn}`
          )
        );

      const bookedBeds = rows.reduce(
        (sum, r) => sum + (parseInt(r.guests, 10) || 1),
        0
      );

      return { bookedBeds };
    }),

  /**
   * Public — returns a list of roomIds that are fully sold out today.
   * Used by the homepage grid to badge sold-out rooms without needing
   * per-room queries.
   */
  getSoldOutRooms: publicQuery
    .input(
      z.object({
        /** ISO date string YYYY-MM-DD representing "today" */
        date: z.string(),
        /** Map of roomId -> capacity so the server can evaluate sold-out status */
        capacities: z.record(z.string(), z.number()),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();

      // All confirmed reservations that cover `date` (checkIn <= date < checkOut)
      const rows = await db
        .select({
          roomId: reservationRequests.roomId,
          guests: reservationRequests.guests,
        })
        .from(reservationRequests)
        .where(
          and(
            eq(reservationRequests.status, "confirmed"),
            sql`${reservationRequests.checkInDate} <= ${input.date}`,
            sql`${reservationRequests.checkOutDate} > ${input.date}`
          )
        );

      // Sum guests per roomId
      const bookedMap: Record<string, number> = {};
      for (const row of rows) {
        if (!row.roomId) continue;
        bookedMap[row.roomId] =
          (bookedMap[row.roomId] ?? 0) + (parseInt(row.guests, 10) || 1);
      }

      // A room is sold out when booked >= capacity
      const soldOut = Object.entries(input.capacities)
        .filter(([roomId, cap]) => (bookedMap[roomId] ?? 0) >= cap)
        .map(([roomId]) => roomId);

      return { soldOut };
    }),
});

