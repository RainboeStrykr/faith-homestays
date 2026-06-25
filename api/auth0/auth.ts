import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import * as jose from "jose";
import * as cookie from "cookie";
import { env } from "../lib/env";
import { getSessionCookieOptions } from "../lib/cookies";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { signSessionToken, verifySessionToken } from "./session";
import { findUserByAuth0Sub, upsertUser } from "../queries/users";
import type { TokenResponse, Auth0UserInfo } from "./types";

async function exchangeAuthCode(
  code: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: env.auth0ClientId,
    client_secret: env.auth0ClientSecret,
    redirect_uri: redirectUri,
  });

  const resp = await fetch(`https://${env.auth0Domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Token exchange failed (${resp.status}): ${text}`);
  }

  return resp.json() as Promise<TokenResponse>;
}

const jwks = jose.createRemoteJWKSet(
  new URL(`https://${env.auth0Domain}/.well-known/jwks.json`),
);

async function verifyIdToken(
  idToken: string,
): Promise<Auth0UserInfo> {
  const { payload } = await jose.jwtVerify(idToken, jwks, {
    issuer: `https://${env.auth0Domain}/`,
    audience: env.auth0ClientId,
  });

  const sub = payload.sub as string;
  if (!sub) {
    throw new Error("sub missing from ID token");
  }

  return {
    sub,
    name: (payload.name as string) || "",
    email: (payload.email as string) || "",
    picture: (payload.picture as string) || "",
  };
}

export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) {
    console.warn("[auth] No session cookie found in request.");
    throw Errors.forbidden("Invalid authentication token.");
  }
  const claim = await verifySessionToken(token);
  if (!claim) {
    throw Errors.forbidden("Invalid authentication token.");
  }
  const user = await findUserByAuth0Sub(claim.auth0Sub);
  if (!user) {
    throw Errors.forbidden("User not found. Please re-login.");
  }
  return user;
}

export function createOAuthCallbackHandler() {
  return async (c: Context) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");
    const errorDescription = c.req.query("error_description");

    if (error) {
      if (error === "access_denied") {
        return c.redirect("/", 302);
      }
      return c.json(
        { error, error_description: errorDescription },
        400,
      );
    }

    if (!code) {
      return c.json({ error: "code is required" }, 400);
    }

    try {
      const redirectUri = `${c.req.header("x-forwarded-proto") || "http"}://${c.req.header("host")}/api/auth/callback`;
      const tokenResp = await exchangeAuthCode(code, redirectUri);
      const userInfo = await verifyIdToken(tokenResp.id_token);

      await upsertUser({
        auth0Sub: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture,
        lastSignInAt: new Date(),
      });

      const token = await signSessionToken({
        auth0Sub: userInfo.sub,
      });

      const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
      setCookie(c, Session.cookieName, token, {
        ...cookieOpts,
        maxAge: Session.maxAgeMs / 1000,
      });

      // Redirect to the page the user was on, or home
      const returnTo = state || "/";
      return c.redirect(returnTo, 302);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      return c.json({ error: "OAuth callback failed" }, 500);
    }
  };
}

export { exchangeAuthCode, verifyIdToken };
