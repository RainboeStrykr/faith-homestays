import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  auth0Domain: required("AUTH0_DOMAIN"),
  auth0ClientId: required("AUTH0_CLIENT_ID"),
  auth0ClientSecret: required("AUTH0_CLIENT_SECRET"),
  ownerAuth0Sub: process.env.OWNER_AUTH0_SUB ?? "",
};
