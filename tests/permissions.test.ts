// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  getPermissionsForRole,
  hasPermission,
  isRole,
  PermissionDeniedError,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLES,
  type Permission,
  type Role,
} from "@/server/permissions";

/** `*.view` + `audit.view`: held by every role in the matrix. */
const READ: readonly Permission[] = [
  "employees.view",
  "salary.view",
  "payroll.view",
  "payslips.view",
  "settings.view",
  "audit.view",
];

/**
 * The role → permission matrix from the issue (mirrors
 * `_docs/outdated/architecture.md` §7). This is the test's independent copy of
 * the expected truth, used to assert the catalog matches exactly.
 */
const EXPECTED_MATRIX: Record<Role, readonly Permission[]> = {
  super_admin: [...PERMISSIONS],
  hr_admin: [
    ...READ,
    "employees.manage",
    "salary.manage",
    "payroll.manage",
    "payroll.finalize",
    "payroll.reopen",
    "payslips.generate",
    "payslips.send",
    "settings.manage",
  ],
  payroll_officer: [
    ...READ,
    "payroll.manage",
    "payslips.generate",
    "payslips.send",
  ],
  hr_officer: [...READ, "employees.manage", "salary.manage"],
  viewer: [...READ],
};

const MUTATION_PERMISSIONS: readonly Permission[] = [
  "employees.manage",
  "salary.manage",
  "payroll.manage",
  "payroll.finalize",
  "payroll.reopen",
  "payslips.generate",
  "payslips.send",
  "settings.manage",
  "settings.sensitive",
  "users.manage",
];

describe("permission catalog", () => {
  it("exposes exactly the five roles", () => {
    expect(ROLES).toEqual([
      "super_admin",
      "hr_admin",
      "payroll_officer",
      "hr_officer",
      "viewer",
    ]);
  });

  it("includes every required permission in the catalog", () => {
    const required: readonly Permission[] = [
      "employees.view",
      "employees.manage",
      "salary.view",
      "salary.manage",
      "payroll.view",
      "payroll.manage",
      "payroll.finalize",
      "payroll.reopen",
      "payslips.view",
      "payslips.generate",
      "payslips.send",
      "settings.view",
      "settings.manage",
      "settings.sensitive",
      "audit.view",
      "users.manage",
    ];
    for (const permission of required) {
      expect(PERMISSIONS).toContain(permission);
    }
  });

  it("has a matrix entry for every role and permission", () => {
    expect(Object.keys(ROLE_PERMISSIONS).sort()).toEqual([...ROLES].sort());
    for (const role of ROLES) {
      for (const permission of getPermissionsForRole(role)) {
        expect(PERMISSIONS).toContain(permission);
      }
    }
  });
});

describe("role → permission matrix", () => {
  it.each(ROLES)(
    "%s matches the issue matrix exactly (no extra, no missing permissions)",
    (role) => {
      const granted = [...getPermissionsForRole(role)].sort();
      const expected = [...new Set(EXPECTED_MATRIX[role])].sort();
      expect(granted).toEqual(expected);
    },
  );

  it.each(ROLES)("hasPermission agrees with the matrix for every permission on %s", (role) => {
    const expected = new Set(EXPECTED_MATRIX[role]);
    for (const permission of PERMISSIONS) {
      expect(hasPermission(role, permission)).toBe(expected.has(permission));
    }
  });
});

describe("representative allow/deny cases", () => {
  const cases: Array<{
    role: Role;
    permission: Permission;
    allowed: boolean;
    label: string;
  }> = [
    // super_admin can do everything.
    { role: "super_admin", permission: "users.manage", allowed: true, label: "allowed" },
    { role: "super_admin", permission: "settings.sensitive", allowed: true, label: "allowed" },
    { role: "super_admin", permission: "payroll.finalize", allowed: true, label: "allowed" },
    { role: "super_admin", permission: "employees.view", allowed: true, label: "allowed" },

    // hr_admin manages most but not sensitive settings or users.
    { role: "hr_admin", permission: "settings.manage", allowed: true, label: "allowed" },
    { role: "hr_admin", permission: "payroll.finalize", allowed: true, label: "allowed" },
    { role: "hr_admin", permission: "settings.sensitive", allowed: false, label: "denied" },
    { role: "hr_admin", permission: "users.manage", allowed: false, label: "denied" },

    // payroll_officer runs payroll and sends payslips but cannot finalize.
    { role: "payroll_officer", permission: "payroll.manage", allowed: true, label: "allowed" },
    { role: "payroll_officer", permission: "payslips.send", allowed: true, label: "allowed" },
    { role: "payroll_officer", permission: "payroll.finalize", allowed: false, label: "denied" },
    { role: "payroll_officer", permission: "employees.manage", allowed: false, label: "denied" },
    { role: "payroll_officer", permission: "settings.manage", allowed: false, label: "denied" },

    // hr_officer manages employees/salaries only.
    { role: "hr_officer", permission: "employees.manage", allowed: true, label: "allowed" },
    { role: "hr_officer", permission: "salary.manage", allowed: true, label: "allowed" },
    { role: "hr_officer", permission: "payroll.manage", allowed: false, label: "denied" },
    { role: "hr_officer", permission: "payslips.send", allowed: false, label: "denied" },

    // viewer reads but never mutates.
    { role: "viewer", permission: "employees.view", allowed: true, label: "allowed" },
    { role: "viewer", permission: "audit.view", allowed: true, label: "allowed" },
    { role: "viewer", permission: "employees.manage", allowed: false, label: "denied" },
  ];

  it.each(cases)(
    "$role is $label $permission",
    ({ role, permission, allowed }) => {
      expect(hasPermission(role, permission)).toBe(allowed);
    },
  );
});

describe("viewer is read-only", () => {
  it.each(MUTATION_PERMISSIONS)("viewer is denied %s", (permission) => {
    expect(hasPermission("viewer", permission)).toBe(false);
  });

  it("viewer keeps every read permission", () => {
    for (const permission of READ) {
      expect(hasPermission("viewer", permission)).toBe(true);
    }
  });
});

describe("isRole", () => {
  it("accepts valid roles", () => {
    for (const role of ROLES) {
      expect(isRole(role)).toBe(true);
    }
  });

  it("rejects invalid values", () => {
    expect(isRole("owner")).toBe(false);
    expect(isRole("")).toBe(false);
    expect(isRole(undefined)).toBe(false);
    expect(isRole(null)).toBe(false);
    expect(isRole(42)).toBe(false);
  });
});

describe("PermissionDeniedError", () => {
  it("carries the permission, role, and a stable code", () => {
    const error = new PermissionDeniedError("payroll.manage", "viewer");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("PermissionDeniedError");
    expect(error.code).toBe("permission_denied");
    expect(error.permission).toBe("payroll.manage");
    expect(error.role).toBe("viewer");
    expect(error.message).toContain("viewer");
    expect(error.message).toContain("payroll.manage");
  });

  it("describes unauthenticated callers when no role is present", () => {
    const error = new PermissionDeniedError("users.manage", null);
    expect(error.role).toBeNull();
    expect(error.message.toLowerCase()).toContain("authentication");
  });
});
