import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payroll",
};

export default function PayrollPage() {
  return (
    <section className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Payroll</h1>
      <p className="text-muted-foreground">
        Create, review, and process payroll runs.
      </p>
    </section>
  );
}
