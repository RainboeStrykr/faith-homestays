import { z } from "zod";
import * as cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, adminQuery, publicQuery } from "./middleware";
import { signAdminSessionToken } from "./auth0/session";
import { env } from "./lib/env";

export const authRouter = createRouter({
  /**
   * Returns { role: "admin" } when a valid admin session cookie is present,
   * otherwise returns null (no error — callers check the value).
   */
  me: publicQuery.query((opts) => {
    return opts.ctx.isAdmin ? { role: "admin" as const } : null;
  }),

  /**
   * Verifies the plain-text password and, on success, sets a signed session
   * cookie granting admin access for 30 days.
   */
  login: publicQuery
    .input(z.object({ password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (input.password !== env.adminPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect password.",
        });
      }

      const token = await signAdminSessionToken();
      const cookieOpts = getSessionCookieOptions(ctx.req.headers);

      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none",
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      return { success: true };
    }),

  /**
   * Clears the admin session cookie.
   */
  logout: adminQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
