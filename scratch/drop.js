import postgres from "postgres";

const databaseUrl = "postgresql://postgres.bvbvckfxlbwnbjpdjfsb:abhirajbhowmick%402006@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  console.log("Connecting to database...");
  const sql = postgres(databaseUrl);
  
  console.log("Dropping tables...");
  await sql`DROP TABLE IF EXISTS reservation_requests CASCADE;`;
  await sql`DROP TABLE IF EXISTS users CASCADE;`;
  await sql`DROP TABLE IF EXISTS __drizzle_migrations CASCADE;`;
  await sql`DROP TYPE IF EXISTS role CASCADE;`;
  await sql`DROP TYPE IF EXISTS status CASCADE;`;
  
  console.log("Tables dropped successfully.");
  await sql.end();
}

main().catch(console.error);
