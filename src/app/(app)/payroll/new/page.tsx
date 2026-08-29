import type { Metadata } from "next";

import { NewPayrollRun } from "@/components/new-payroll-run";

export const metadata: Metadata = {
  title: "New payroll run",
};

export default function NewPayrollRunPage() {
  return <NewPayrollRun />;
}
