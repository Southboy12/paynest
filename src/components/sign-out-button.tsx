"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  async function handleSignOut() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
