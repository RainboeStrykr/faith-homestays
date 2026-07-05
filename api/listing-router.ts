import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { roomPrices } from "@db/schema";
import { eq } from "drizzle-orm";

export const listingRouter = createRouter({
  /**
   * Public — used by the frontend to get current prices for all rooms.
   * Returns a map of roomId -> { price, priceNote }.
   */
  getRoomPrices: publicQuery.query(async () => {
    const db = getDb();
    const rows = await db.select().from(roomPrices);
    return rows;
  }),

  /**
   * Admin only — upsert the price/priceNote for a room by its roomId.
   */
  updateRoomPrice: adminQuery
    .input(
      z.object({
        roomId: z.string().min(1),
        price: z.string().min(1),
        priceNote: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .insert(roomPrices)
        .values({
          roomId: input.roomId,
          price: input.price,
          priceNote: input.priceNote,
        })
        .onConflictDoUpdate({
          target: roomPrices.roomId,
          set: {
            price: input.price,
            priceNote: input.priceNote,
            updatedAt: new Date(),
          },
        });
      return { success: true };
    }),
});
