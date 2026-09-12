import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env";
import * as schema from "@db/schema";

let instance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!instance) {
    const client = postgres(env.databaseUrl, {
      max: 5,
      connect_timeout: 15,
    });
    instance = drizzle(client, { schema });
  }
  return instance;
}
