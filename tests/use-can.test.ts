import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { useSession } = vi.hoisted(() => ({
  useSession: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  useSession,
}));

import { useCan } from "@/lib/use-can";
import type { Permission } from "@/server/permissions";

function setSession(role: string | undefined | null) {
  useSession.mockReturnValue({
    data:
      role === null
        ? null
        : { user: { id: "user-1", email: "u@example.com", role } },
    isPending: false,
    error: null,
  });
}

function can(role: string | undefined | null, permission: Permission): boolean {
  setSession(role);
  const { result } = renderHook(() => useCan(permission));
  return result.current;
}

beforeEach(() => {
  useSession.mockReset();
});

describe("useCan", () => {
  it("grants an allowed permission", () => {
    expect(can("hr_admin", "employees.manage")).toBe(true);
    expect(can("super_admin", "users.manage")).toBe(true);
    expect(can("payroll_officer", "payslips.send")).toBe(true);
  });

  it("hides a permission the role lacks", () => {
    expect(can("viewer", "employees.manage")).toBe(false);
    expect(can("hr_admin", "users.manage")).toBe(false);
    expect(can("payroll_officer", "payroll.finalize")).toBe(false);
  });

  it("hides everything while signed out", () => {
    expect(can(null, "employees.view")).toBe(false);
    expect(can(null, "payroll.manage")).toBe(false);
  });

  it("hides actions when the role is unknown or missing", () => {
    expect(can(undefined, "employees.view")).toBe(false);
    expect(can("owner", "employees.view")).toBe(false);
  });

  it("reflects the read-only viewer across the matrix", () => {
    expect(can("viewer", "employees.view")).toBe(true);
    expect(can("viewer", "audit.view")).toBe(true);
    expect(can("viewer", "settings.sensitive")).toBe(false);
  });
});
