import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payslips",
};

export default function PayslipsPage() {
  return (
    <section className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Payslips</h1>
      <p className="text-muted-foreground">
        View and deliver payslips to employees.
      </p>
    </section>
  );
}
