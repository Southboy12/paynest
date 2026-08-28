import type { Metadata } from "next";

import { EmployeeForm } from "@/components/employee-form";

export const metadata: Metadata = {
  title: "New employee",
};

export default function NewEmployeePage() {
  return <EmployeeForm mode="new" />;
}
