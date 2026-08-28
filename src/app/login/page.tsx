import type { Metadata } from "next";

import { LoginScreen } from "@/components/login-screen";

export const metadata: Metadata = {
  title: "Sign in to PayNest",
  description:
    "Sign in to PayNest to manage payroll runs and payslips for your Nigerian company.",
};

export default function LoginPage() {
  return <LoginScreen />;
}
