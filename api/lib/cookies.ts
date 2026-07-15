import type { CookieOptions } from "hono/utils/cookie";

function isLocalhost(headers: Headers): boolean {
  const host = headers.get("host") || "";
  return host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
}

export function getSessionCookieOptions(headers: Headers): CookieOptions {
  const localhost = isLocalhost(headers);

  return {
    httpOnly: true,
    path: "/",
    // Use Lax everywhere — the API and frontend share the same domain so
    // Lax is both safe and doesn't require the Secure flag dance.
    // On localhost this also works correctly.
    sameSite: "Lax",
    secure: !localhost,
  };
}
