import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

export async function findUserByAuth0Sub(auth0Sub: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.auth0Sub, auth0Sub))
    .limit(1);
  return rows.at(0);
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  if (
    values.role === undefined &&
    values.auth0Sub &&
    values.auth0Sub === env.ownerAuth0Sub
  ) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  await getDb()
    .insert(schema.users)
    .values(values)
    .onConflictDoUpdate({
      target: schema.users.auth0Sub,
      set: updateSet,
    });
}
