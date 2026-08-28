import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  hasPermission,
  isRole,
  PermissionDeniedError,
  type Permission,
} from "@/server/permissions";

/** A resolved better-auth session (never null). */
export type AuthenticatedSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

/**
 * Authoritative permission guard for server code.
 *
 * Reads the current better-auth session from the incoming request headers and
 * throws a {@link PermissionDeniedError} when the caller is unauthenticated or
 * their role does not grant `permission`. Returns the full session otherwise.
 *
 * Works in Server Actions, route handlers, and server components (anywhere
 * `next/headers` is available). Server Actions may catch
 * `PermissionDeniedError` to return a friendly result; route handlers should
 * map it to a 403; server components can let it bubble to an error boundary.
 *
 * @example
 *   await requirePermission("employees.manage");
 *
 * Route handlers may pass the request headers explicitly:
 *
 * @example
 *   export async function POST(request: Request) {
 *     await requirePermission("payroll.manage", request.headers);
 *   }
 */
export async function requirePermission(
  permission: Permission,
  requestHeaders?: Headers,
): Promise<AuthenticatedSession> {
  const session = await auth.api.getSession({
    headers: requestHeaders ?? (await headers()),
  });

  if (!session) {
    throw new PermissionDeniedError(permission, null);
  }

  const rawRole: unknown = (
    session.user as unknown as Record<string, unknown>
  ).role;
  const role = isRole(rawRole) ? rawRole : null;

  if (!role || !hasPermission(role, permission)) {
    throw new PermissionDeniedError(permission, role);
  }

  return session;
}
