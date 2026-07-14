import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

// In serverless environments each function invocation may be a fresh module
// context, so we use a lazy singleton scoped to the module lifetime.
// `prepare: false` is required for Supabase PgBouncer transaction-mode pooling.
let instance: ReturnType<typeof drizzle<typeof fullSchema>> | undefined;

export function getDb() {
  if (!instance) {
    const client = postgres(env.databaseUrl, {
      prepare: false, // required for PgBouncer / Supabase pooler
      max: 1,         // limit connections per serverless invocation
    });
    instance = drizzle(client, { schema: fullSchema });
  }
  return instance;
}
