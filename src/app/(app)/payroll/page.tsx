import type { Metadata } from "next";

import { PayrollRunsList } from "@/components/payroll-runs-list";

export const metadata: Metadata = {
  title: "Payroll runs",
  description:
    "Create and manage payroll runs for each pay period.",
};

export default function PayrollPage() {
  return <PayrollRunsList />;
}
