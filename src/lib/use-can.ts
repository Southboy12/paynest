"use client";

import { useMemo } from "react";

import { useSession } from "@/lib/auth-client";
import { hasPermission, isRole, type Permission } from "@/server/permissions";

/**
 * Client-side convenience helper that reports whether the signed-in user can
 * perform an action. Reads the live session via the better-auth client.
 *
 * This only HIDES UI. It is not authoritative: the server must re-check every
 * mutation with `requirePermission` from `@/server/require-permission`, because
 * client state can be bypassed. Returns `false` while the session is loading
 * or when signed out, so actions stay hidden until permission is confirmed.
 *
 * @example
 *   const canManage = useCan("employees.manage");
 *   return canManage ? <EditButton /> : null;
 */
export function useCan(permission: Permission): boolean {
  const { data } = useSession();

  return useMemo(() => {
    const user = data?.user as unknown as Record<string, unknown> | undefined;
    const role: unknown = user?.role;
    return isRole(role) ? hasPermission(role, permission) : false;
  }, [data?.user, permission]);
}
