import type { Metadata } from "next";

import { PayslipsList } from "@/components/payslips-list";

export const metadata: Metadata = {
  title: "Payslips",
  description: "View and send payslips for finalized runs.",
};

export default function PayslipsPage() {
  return <PayslipsList />;
}
