import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PayslipPreview } from "@/components/payslip-preview";
import { MOCK_EMPLOYEES } from "@/lib/mock-employees";
import { getMockRunEntries } from "@/lib/mock-payroll-runs";
import { getMockPayslipList } from "@/lib/mock-payslips";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const payslip = getMockPayslipList().find((p) => p.id === id);
  return { title: payslip ? payslip.reference : "Payslip" };
}

export default async function PayslipPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payslip = getMockPayslipList().find((p) => p.id === id);

  if (!payslip) {
    notFound();
  }

  const employee = MOCK_EMPLOYEES.find((e) => e.id === payslip.employeeId);
  const entry = getMockRunEntries("run-2026-08").find(
    (e) => e.employeeId === payslip.employeeId,
  );

  if (!employee || !entry) {
    notFound();
  }

  return (
    <PayslipPreview payslip={payslip} employee={employee} entry={entry} />
  );
}
