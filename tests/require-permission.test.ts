// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Provide `headers()` outside a real Next.js request; the tests pass explicit
// request headers, and the default-path test relies on an empty header set.
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PermissionDeniedError } from "@/server/permissions";
import { requirePermission } from "@/server/require-permission";

const email = `rbac-guard+${Date.now()}@example.com`;
const password = "rbac-guard-password-123";

let userId: string;
let requestHeaders: Headers;

function sessionCookie(response: Response): string {
  const cookies = response.headers.getSetCookie();
  const match = cookies.find((cookie) => cookie.includes("session_token="));
  if (!match) throw new Error("sign-in response carried no session cookie");
  return match.split(";")[0] ?? "";
}

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email } });

  // Sign up through better-auth so the password hash and session match the
  // real login flow.
  const { user } = await auth.api.signUpEmail({
    body: { name: "RBAC Guard Test", email, password },
  });
  userId = user.id;

  const response = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });
  requestHeaders = new Headers({ cookie: sessionCookie(response) });
});

afterAll(async () => {
  await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});

describe("requirePermission with a real better-auth session", () => {
  it("resolves the caller role from the live session", async () => {
    const session = await auth.api.getSession({ headers: requestHeaders });
    expect(session?.user.id).toBe(userId);
    // better-auth signs users up with the default role.
    expect((session?.user as { role?: string }).role).toBe("hr_admin");
  });

  it("allows an hr_admin to use a permission its role holds", async () => {
    const session = await requirePermission("settings.manage", requestHeaders);
    expect(session.user.id).toBe(userId);
  });

  it("denies an hr_admin a permission its role lacks", async () => {
    const error = await requirePermission("users.manage", requestHeaders).catch(
      (err: unknown) => err,
    );
    expect(error).toBeInstanceOf(PermissionDeniedError);
    expect(error).toMatchObject({
      permission: "users.manage",
      role: "hr_admin",
      code: "permission_denied",
    });
  });

  it("switches enforcement when the role changes to viewer", async () => {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "viewer" },
    });

    const allowed = await requirePermission("audit.view", requestHeaders);
    expect(allowed.user.id).toBe(userId);

    const error = await requirePermission(
      "employees.manage",
      requestHeaders,
    ).catch((err: unknown) => err);
    expect(error).toBeInstanceOf(PermissionDeniedError);
    expect(error).toMatchObject({ permission: "employees.manage", role: "viewer" });
  });

  it("denies unauthenticated callers through the default headers path", async () => {
    const error = await requirePermission("employees.view").catch(
      (err: unknown) => err,
    );
    expect(error).toBeInstanceOf(PermissionDeniedError);
    expect(error).toMatchObject({ permission: "employees.view", role: null });
  });
});
