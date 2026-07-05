import { authRouter } from "./auth-router";
import { reservationRouter } from "./reservation-router";
import { listingRouter } from "./listing-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  reservation: reservationRouter,
  listing: listingRouter,
});

export type AppRouter = typeof appRouter;
