import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Log",
};

export default function AuditPage() {
  return (
    <section className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
      <p className="text-muted-foreground">
        Review a chronological record of actions taken in PayNest.
      </p>
    </section>
  );
}
