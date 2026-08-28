// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

const { getSession, headers } = vi.hoisted(() => ({
  getSession: vi.fn(),
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession } },
}));

vi.mock("next/headers", () => ({
  headers,
}));

import { PermissionDeniedError } from "@/server/permissions";
import { requirePermission } from "@/server/require-permission";

type FakeSession = {
  session: { token: string };
  user: { id: string; email: string; role?: string };
};

function sessionWithRole(role: string | undefined): FakeSession {
  return {
    session: { token: "test-token" },
    user: { id: "user-1", email: "user@example.com", role },
  };
}

describe("requirePermission (mocked session)", () => {
  it("denies an unauthenticated caller", async () => {
    getSession.mockResolvedValueOnce(null);
    const error = await requirePermission("payroll.manage", new Headers()).catch(
      (err: unknown) => err,
    );
    expect(error).toBeInstanceOf(PermissionDeniedError);
    expect(error).toMatchObject({ permission: "payroll.manage", role: null });
  });

  it("denies a role that lacks the requested permission", async () => {
    getSession.mockResolvedValueOnce(sessionWithRole("viewer"));
    const error = await requirePermission(
      "payroll.manage",
      new Headers(),
    ).catch((err: unknown) => err);
    expect(error).toBeInstanceOf(PermissionDeniedError);
    expect(error).toMatchObject({ permission: "payroll.manage", role: "viewer" });
  });

  it("denies a session whose role value is not a known role", async () => {
    getSession.mockResolvedValueOnce(sessionWithRole("owner"));
    const error = await requirePermission("employees.view", new Headers()).catch(
      (err: unknown) => err,
    );
    expect(error).toBeInstanceOf(PermissionDeniedError);
    expect(error).toMatchObject({ permission: "employees.view", role: null });
  });

  it("allows a role that holds the requested permission", async () => {
    const session = sessionWithRole("payroll_officer");
    getSession.mockResolvedValueOnce(session);
    await expect(
      requirePermission("payroll.manage", new Headers()),
    ).resolves.toEqual(session);
  });

  it("falls back to next/headers when no headers are passed", async () => {
    getSession.mockResolvedValueOnce(null);
    headers.mockClear();
    await requirePermission("audit.view").catch((err: unknown) => err);
    expect(headers).toHaveBeenCalledTimes(1);
    expect(getSession).toHaveBeenCalledWith({ headers: expect.any(Headers) });
  });
});
