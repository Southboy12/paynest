// @vitest-environment node
import { NextRequest } from "next/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { middleware } from "@/middleware";

const BASE_URL = "http://localhost:3000";
const APP_URL = `${BASE_URL}/api/auth`;

function authRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("origin", BASE_URL);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return auth.handler(
    new Request(`${APP_URL}${path}`, { ...init, headers }),
  );
}

function cookiesFrom(response: Response): string[] {
  return response.headers.getSetCookie();
}

function sessionCookie(response: Response): string | null {
  const match = cookiesFrom(response).find((cookie) =>
    cookie.includes("session_token="),
  );
  if (!match) return null;
  return match.split(";")[0] ?? null;
}

async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<Response> {
  return authRequest("/sign-up/email", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

afterAll(async () => {
  await prisma.$disconnect();
});

describe("email/password authentication", () => {
  const email = `dev+${Date.now()}@example.com`;
  const password = "super-secret-password-123";
  let userId: string;
  let sessionCookieValue: string;
  let activeSessionId: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
  });

  it("rejects sign-in with unknown credentials and creates no session", async () => {
    const response = await authRequest("/sign-in/email", {
      method: "POST",
      body: JSON.stringify({ email, password: "wrong-password-123" }),
    });

    expect(response.ok).toBe(false);
    expect(sessionCookie(response)).toBeNull();

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).toBeNull();
  });

  it("signs up a user and hashes the password with Argon2", async () => {
    const response = await signUp("Ada Lovelace", email, password);

    expect(response.ok).toBe(true);
    const body = await response.json();
    expect(body?.user?.email).toBe(email);
    userId = body.user.id;

    const account = await prisma.account.findFirst({
      where: { userId, providerId: "credential" },
    });
    expect(account?.password).toBeTruthy();
    expect(account?.password).toMatch(/^\$argon2/);
    expect(account?.password).not.toContain(password);

    const storedUser = await prisma.user.findUnique({ where: { email } });
    expect(storedUser?.role).toBe("hr_admin");
  });

  it("creates a database-backed session on valid sign-in", async () => {
    const response = await authRequest("/sign-in/email", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    expect(response.ok).toBe(true);
    sessionCookieValue = sessionCookie(response) ?? "";
    expect(sessionCookieValue).not.toBe("");

    const dbSession = await prisma.session.findFirst({
      where: { userId },
    });
    expect(dbSession).not.toBeNull();
    expect(dbSession?.token).toBeTruthy();
  });

  it("rejects a valid account with the wrong password and adds no session", async () => {
    const sessionsBefore = await prisma.session.count({ where: { userId } });

    const response = await authRequest("/sign-in/email", {
      method: "POST",
      body: JSON.stringify({ email, password: "not-the-real-password" }),
    });

    expect(response.ok).toBe(false);
    expect(sessionCookie(response)).toBeNull();

    const sessionsAfter = await prisma.session.count({ where: { userId } });
    expect(sessionsAfter).toBe(sessionsBefore);
  });

  it("returns the active session for a valid session cookie", async () => {
    const response = await authRequest("/get-session", {
      headers: { cookie: sessionCookieValue },
    });

    expect(response.ok).toBe(true);
    const body = await response.json();
    expect(body).toBeTruthy();
    expect(body.user.email).toBe(email);
    expect(body.session.token).toBeTruthy();
    activeSessionId = body.session.id;
  });

  it("sign-out revokes the stored session and clears the cookie", async () => {
    const sessionsBefore = await prisma.session.count({ where: { userId } });

    const response = await authRequest("/sign-out", {
      method: "POST",
      headers: { cookie: sessionCookieValue },
    });
    expect(response.ok).toBe(true);

    const revoked = await prisma.session.findUnique({
      where: { id: activeSessionId },
    });
    expect(revoked).toBeNull();

    const sessionsAfter = await prisma.session.count({ where: { userId } });
    expect(sessionsAfter).toBe(sessionsBefore - 1);

    const clearedCookie = cookiesFrom(response).find((cookie) =>
      cookie.startsWith("better-auth.session_token="),
    );
    if (clearedCookie) {
      const value =
        clearedCookie.split(";")[0]?.split("=").slice(1).join("=") ?? "";
      expect(value === "" || /max-age=0/i.test(clearedCookie)).toBe(true);
    }

    const after = await authRequest("/get-session", {
      headers: { cookie: sessionCookieValue },
    });
    const afterBody = await after.json().catch(() => null);
    expect(afterBody?.session ?? null).toBeNull();
  });

  it("cleans up the test user", async () => {
    await prisma.user.delete({ where: { email } });
    const gone = await prisma.user.findUnique({ where: { email } });
    expect(gone).toBeNull();
  });
});

describe("route protection middleware", () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");

  it("redirects unauthenticated visitors of app routes to /login", async () => {
    const response = await middleware(
      new NextRequest(`${BASE_URL}/dashboard`),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${BASE_URL}/login`);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("redirects / itself when unauthenticated", async () => {
    const response = await middleware(new NextRequest(`${BASE_URL}/`));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${BASE_URL}/login`);
  });

  it("lets a request with a valid session continue", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ session: { token: "abc" }, user: { id: "u1" } }),
        { status: 200 },
      ),
    );

    const request = new NextRequest(`${BASE_URL}/payroll`);
    request.headers.set("cookie", "better-auth.session_token=abc.sig");

    const response = await middleware(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects when the session endpoint reports no session", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ session: null, user: null }), {
        status: 200,
      }),
    );

    const request = new NextRequest(`${BASE_URL}/employees`);
    request.headers.set("cookie", "better-auth.session_token=stale.sig");

    const response = await middleware(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${BASE_URL}/login`);
  });

  it("leaves /login and auth endpoints public", async () => {
    for (const path of ["/login", "/api/auth/get-session"]) {
      const response = await middleware(new NextRequest(`${BASE_URL}${path}`));
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    }
  });
});
