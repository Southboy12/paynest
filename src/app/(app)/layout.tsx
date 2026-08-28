import type { ReactNode } from "react";

import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";
import { NotificationsBell } from "@/components/notifications-bell";
import { SidebarUser, UserMenu } from "@/components/user-menu";

export default function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-backdrop text-backdrop-foreground md:flex">
        <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
            P
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            PayNest
          </span>
        </div>
        <NavLinks className="flex-1 overflow-y-auto p-3" />
        <div className="border-t border-white/10 p-4">
          <SidebarUser />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4">
          <MobileNav />
          <span className="font-semibold md:hidden">PayNest</span>
          <span className="hidden text-sm font-medium text-muted-foreground md:block">
            PayNest Demo Company
          </span>
          <div className="ml-auto flex items-center gap-1">
            <NotificationsBell />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
