import type { Metadata } from "next";

import { EmployeesList } from "@/components/employees-list";

export const metadata: Metadata = {
  title: "Employees",
  description:
    "Search, filter, and manage employee records and their profiles.",
};

export default function EmployeesPage() {
  return <EmployeesList />;
}
