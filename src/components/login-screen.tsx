"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const DEMO_EMAIL = "admin@paynest.local";
const DEMO_PASSWORD = "PayNest-SuperAdm1n-2026!xQ";

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { data, error } = await signIn.email({ email, password });

    setLoading(false);
    if (error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success(`Welcome back, ${data?.user?.name ?? "there"}`);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-backdrop px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-backdrop-glow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-backdrop-grid"
        aria-hidden="true"
      />

      <section className="animate-card-in relative w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand text-lg font-bold text-brand-foreground">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight text-card-foreground">
            PayNest
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-card-foreground">
          Sign in to PayNest
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Payroll and payslips for Nigerian companies
        </p>

        <form className="mt-7 space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-label">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                className={cn("h-11 pl-9", errors.email && "border-destructive")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-label"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                className={cn("h-11 px-9", errors.password && "border-destructive")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => toast("Password reset is coming soon")}
              className="rounded text-sm font-medium text-brand hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              setEmail(DEMO_EMAIL);
              setPassword(DEMO_PASSWORD);
              setErrors({});
            }}
          >
            Use demo account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need access? Contact your HR administrator.
        </p>
      </section>

      <p className="relative mt-10 text-center text-xs text-backdrop-foreground">
        © 2026 PayNest · Built for Nigerian businesses
      </p>
    </main>
  );
}
