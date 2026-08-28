import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmployeeForm } from "@/components/employee-form";
import { MOCK_EMPLOYEES } from "@/lib/mock-employees";

export const metadata: Metadata = {
  title: "Edit employee",
};

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = MOCK_EMPLOYEES.find((e) => e.id === id);

  if (!employee) {
    notFound();
  }

  return <EmployeeForm mode="edit" initial={employee} />;
}
