import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { createOAuthCallbackHandler } from "./auth0/auth";

export const config = {
  runtime: "nodejs20.x",
};

const app = new Hono().basePath("/api");

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.get("/auth/callback", createOAuthCallbackHandler());

app.use("/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
    responseMeta({ ctx }) {
      if (ctx?.resHeaders) {
        return { headers: Object.fromEntries(ctx.resHeaders.entries()) };
      }
      return {};
    },
  });
});

app.all("/*", (c) => c.json({ error: "Not Found" }, 404));

export default handle(app);
