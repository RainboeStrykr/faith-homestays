import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { verifyAdminSessionToken } from "./auth0/session";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  isAdmin: boolean;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const cookies = cookie.parse(opts.req.headers.get("cookie") || "");
  const token = cookies[Session.cookieName];

  let isAdmin = false;
  if (token) {
    const payload = await verifyAdminSessionToken(token);
    isAdmin = payload?.role === "admin";
  }

  return { req: opts.req, resHeaders: opts.resHeaders, isAdmin };
}
