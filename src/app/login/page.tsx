import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <section className="w-full max-w-sm rounded-lg border bg-background p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-1">
          <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            PayNest
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Use your work email and password to access payroll.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
