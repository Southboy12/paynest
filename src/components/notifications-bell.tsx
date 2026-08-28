"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";

export function NotificationsBell() {
  return (
    <button
      type="button"
      onClick={() => toast("Notifications coming soon")}
      aria-label="Notifications"
      className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Bell className="size-5" aria-hidden />
      <span
        aria-hidden
        className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500"
      />
    </button>
  );
}
