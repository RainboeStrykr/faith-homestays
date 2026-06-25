import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reservationRequests } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

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
});

