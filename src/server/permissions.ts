/**
 * Permission catalog and role → permission mapping.
 *
 * This module is the single source of truth for authorization in PayNest.
 * It is deliberately free of server-only imports (no `next/headers`, no auth
 * instance, no Prisma client) so the same catalog can back both the
 * authoritative server guard (`src/server/require-permission.ts`) and the
 * client convenience helper (`src/lib/use-can.ts`) without leaking server
 * dependencies into the browser bundle.
 *
 * Server-side enforcement via `requirePermission` is authoritative; the UI
 * hook `useCan` only hides actions and is a convenience.
 */

/** The five application roles, stored as the `User.role` Prisma enum. */
export const ROLES = [
  "super_admin",
  "hr_admin",
  "payroll_officer",
  "hr_officer",
  "viewer",
] as const;

export type Role = (typeof ROLES)[number];

/**
 * Every permission the system knows about. Features must reference one of
 * these values; a permission not in this catalog does not exist.
 */
export const PERMISSIONS = [
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
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Permissions every authenticated role holds. These are the read-only
 * permissions (`*.view`) plus `audit.view`.
 */
export const READ_PERMISSIONS: readonly Permission[] = [
  "employees.view",
  "salary.view",
  "payroll.view",
  "payslips.view",
  "settings.view",
  "audit.view",
];

/**
 * Role → permission matrix (see `_docs/outdated/architecture.md` §7).
 * Defined exactly once here; never duplicate it.
 */
export const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  // super_admin holds every permission.
  super_admin: new Set<Permission>(PERMISSIONS),

  // hr_admin has all management except the sensitive-settings and
  // user-management permissions.
  hr_admin: new Set<Permission>([
    ...READ_PERMISSIONS,
    "employees.manage",
    "salary.manage",
    "payroll.manage",
    "payroll.finalize",
    "payroll.reopen",
    "payslips.generate",
    "payslips.send",
    "settings.manage",
  ]),

  // payroll_officer runs payroll and sends payslips but cannot finalize,
  // manage employees/salaries, or touch settings.
  payroll_officer: new Set<Permission>([
    ...READ_PERMISSIONS,
    "payroll.manage",
    "payslips.generate",
    "payslips.send",
  ]),

  // hr_officer manages employees and salaries, nothing payroll or settings.
  hr_officer: new Set<Permission>([
    ...READ_PERMISSIONS,
    "employees.manage",
    "salary.manage",
  ]),

  // viewer is read-only.
  viewer: new Set<Permission>(READ_PERMISSIONS),
};

/** Returns true when `role` grants `permission`. */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

/** Returns the full set of permissions granted to a role. */
export function getPermissionsForRole(role: Role): ReadonlySet<Permission> {
  return ROLE_PERMISSIONS[role] ?? new Set<Permission>();
}

/** Type guard narrowing an unknown value to a valid {@link Role}. */
export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/**
 * Typed error thrown by the server guard when a caller is not allowed to
 * perform an action. Carries the permission that was required and the role
 * (if any) of the caller so handlers can log or map it to a response.
 */
export class PermissionDeniedError extends Error {
  readonly name = "PermissionDeniedError";
  readonly code = "permission_denied";
  readonly permission: Permission;
  readonly role: Role | null;

  constructor(permission: Permission, role: Role | null, message?: string) {
    super(
      message ??
        (role
          ? `Role "${role}" is missing the "${permission}" permission.`
          : `Authentication is required for the "${permission}" permission.`),
    );
    this.permission = permission;
    this.role = role;
  }
}
