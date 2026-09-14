import { z } from "zod";
import { createRouter, adminQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reservationRequests } from "@db/schema";
import { eq, desc, and, sql, count } from "drizzle-orm";
import { sendBookingNotification } from "./lib/email";

export const reservationRouter = createRouter({
  /**
   * Public — any visitor can submit a reservation request.
   * No login required.
   */
  create: publicQuery
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
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(reservationRequests).values({
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

      const id = result[0].id;

      // Fire-and-forget — email failure never blocks the booking response
      void sendBookingNotification({
        id,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        roomType: input.roomType,
        roomId: input.roomId,
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        guests: input.guests,
        message: input.message,
      });

      return { id, success: true };
    }),

  /**
   * Admin only — returns paginated reservation requests, newest first.
   */
  allReservations: adminQuery
    .input(z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(100).default(10),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const offset = (input.page - 1) * input.pageSize;

      const [rows, totalResult] = await Promise.all([
        db.select()
          .from(reservationRequests)
          .orderBy(desc(reservationRequests.createdAt))
          .limit(input.pageSize)
          .offset(offset),
        db.select({ total: count() }).from(reservationRequests),
      ]);

      const total = Number(totalResult[0]?.total ?? 0);
      return {
        reservations: rows,
        total,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.ceil(total / input.pageSize),
      };
    }),

  /**
   * Admin only — update the status of any reservation.
   */
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
   * Admin only — delete all reservation requests.
   */
  deleteAll: adminQuery
    .mutation(async () => {
      const db = getDb();
      await db.delete(reservationRequests);
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
        checkIn: z.string(),
        checkOut: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.roomId || !input.checkIn || !input.checkOut) {
        return { bookedBeds: 0 };
      }
      const db = getDb();
      const rows = await db
        .select({ total: sql<number>`coalesce(sum(cast(${reservationRequests.guests} as int)), 0)` })
        .from(reservationRequests)
        .where(
          and(
            eq(reservationRequests.roomId, input.roomId),
            eq(reservationRequests.status, "confirmed"),
            sql`${reservationRequests.checkInDate} < ${input.checkOut}`,
            sql`${reservationRequests.checkOutDate} > ${input.checkIn}`,
          )
        );
      return { bookedBeds: Number(rows[0]?.total ?? 0) };
    }),

  /**
   * Public — for a given arrival date and a capacity map, returns the set of
   * roomIds that are fully booked (confirmed bookings >= capacity).
   */
  getSoldOutRooms: publicQuery
    .input(
      z.object({
        date: z.string(),
        capacities: z.record(z.string(), z.number()),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select({
          roomId: reservationRequests.roomId,
          total: sql<number>`coalesce(sum(cast(${reservationRequests.guests} as int)), 0)`,
        })
        .from(reservationRequests)
        .where(
          and(
            eq(reservationRequests.status, "confirmed"),
            sql`${reservationRequests.checkInDate} <= ${input.date}`,
            sql`${reservationRequests.checkOutDate} > ${input.date}`,
          )
        )
        .groupBy(reservationRequests.roomId);

      const soldOut: string[] = [];
      for (const row of rows) {
        if (!row.roomId) continue;
        const capacity = input.capacities[row.roomId] ?? Infinity;
        if (Number(row.total) >= capacity) {
          soldOut.push(row.roomId);
        }
      }
      return { soldOut };
    }),
});
