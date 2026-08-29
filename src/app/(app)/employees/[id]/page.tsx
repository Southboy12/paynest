import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmployeeDetail } from "@/components/employee-detail";
import { MOCK_EMPLOYEES } from "@/lib/mock-employees";
import { getMockPayslips } from "@/lib/mock-payslips";
import { getMockSalaryStructures } from "@/lib/mock-salary-structures";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const employee = MOCK_EMPLOYEES.find((e) => e.id === id);
  return { title: employee ? employee.name : "Employee" };
}

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = MOCK_EMPLOYEES.find((e) => e.id === id);

  if (!employee) {
    notFound();
  }

  return (
    <EmployeeDetail
      employee={employee}
      structures={getMockSalaryStructures(id)}
      payslips={getMockPayslips(id)}
    />
  );
}
