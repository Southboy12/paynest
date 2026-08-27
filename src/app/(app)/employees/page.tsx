import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees",
};

export default function EmployeesPage() {
  return (
    <section className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
      <p className="text-muted-foreground">
        Manage employee records and profiles.
      </p>
    </section>
  );
}
