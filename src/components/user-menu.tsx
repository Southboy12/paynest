"use client";

import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  hr_admin: "HR Admin",
  payroll_officer: "Payroll Officer",
  hr_officer: "HR Officer",
  viewer: "Viewer",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

async function handleSignOut() {
  await signOut();
  window.location.href = "/login";
}

function userRole(user: unknown): string {
  const role = (user as { role?: unknown } | null | undefined)?.role;
  return typeof role === "string" ? role : "";
}

export function UserMenu() {
  const { data } = useSession();
  const [open, setOpen] = useState(false);
  const user = data?.user;

  if (!user) {
    return null;
  }

  const role = ROLE_LABELS[userRole(user)] ?? userRole(user);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${user.name}'s menu`}
        className="flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-accent"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
          {initials(user.name)}
        </span>
        <span className="hidden text-sm font-medium sm:block">
          {user.name}
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-60 rounded-lg border border-border bg-card p-1 shadow-lg"
          >
            <div className="px-3 py-2">
              <p className="truncate text-sm font-medium text-card-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
              <span className="mt-1.5 inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                {role}
              </span>
            </div>
            <div className="my-1 h-px bg-border" />
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleSignOut()}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function SidebarUser() {
  const { data } = useSession();
  const user = data?.user;

  if (!user) {
    return null;
  }

  const role = ROLE_LABELS[userRole(user)] ?? userRole(user);

  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
        {initials(user.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {user.name}
        </p>
        <p className="truncate text-xs text-slate-400">
          {role} · PayNest Demo Company
        </p>
      </div>
    </div>
  );
}
