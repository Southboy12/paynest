"use client";

import { useState } from "react";
import { PanelLeft } from "lucide-react";

import { NavLinks } from "@/components/nav-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("md:hidden", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation menu">
            <PanelLeft aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 bg-backdrop p-0 text-backdrop-foreground sm:max-w-64"
        >
          <SheetHeader className="border-b border-white/10 text-left">
            <SheetTitle className="text-white">PayNest</SheetTitle>
            <SheetDescription className="text-slate-400">
              Navigate between modules.
            </SheetDescription>
          </SheetHeader>
          <NavLinks className="p-3" onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
