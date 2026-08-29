"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, ArrowLeft, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_EMPLOYEES } from "@/lib/mock-employees";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

function overlapsMockRun(start: string, end: string): boolean {
  if (!start || !end) return false;
  const s = new Date(start);
  const e = new Date(end);
  const mockMonths = [new Date("2026-07-01"), new Date("2026-08-01")];
  return mockMonths.some((m) => s <= m && e >= m);
}

export function NewPayrollRun() {
  const router = useRouter();
  const activeEmployees = useMemo(
    () => MOCK_EMPLOYEES.filter((e) => e.status === "Active"),
    [],
  );

  const [values, setValues] = useState({
    runName: "",
    periodStart: "",
    periodEnd: "",
    paymentDate: "",
  });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(activeEmployees.map((e) => e.id)),
  );
  const [saving, setSaving] = useState(false);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return activeEmployees.filter(
      (e) =>
        term === "" ||
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.jobTitle.toLowerCase().includes(term),
    );
  }, [activeEmployees, search]);

  const allVisibleSelected =
    visible.length > 0 && visible.every((e) => selected.has(e.id));

  function toggleAll() {
    setSelected((current) => {
      const next = new Set(current);
      if (allVisibleSelected) {
        for (const e of visible) next.delete(e.id);
      } else {
        for (const e of visible) next.add(e.id);
      }
      return next;
    });
  }

  function toggleEmployee(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const showOverlap = overlapsMockRun(values.periodStart, values.periodEnd);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSaving(false);
    toast.success("Draft saved");
    router.push("/payroll");
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/payroll"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Payroll runs
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          New payroll run
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a run for a pay period and choose the employees it covers.
        </p>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="runName" className="text-sm font-medium text-label">
                Run name
              </Label>
              <Input
                id="runName"
                placeholder="August 2026"
                value={values.runName}
                onChange={(e) =>
                  setValues((v) => ({ ...v, runName: e.target.value }))
                }
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="periodStart"
                className="text-sm font-medium text-label"
              >
                Period start
              </Label>
              <Input
                id="periodStart"
                type="date"
                value={values.periodStart}
                onChange={(e) =>
                  setValues((v) => ({ ...v, periodStart: e.target.value }))
                }
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="periodEnd"
                className="text-sm font-medium text-label"
              >
                Period end
              </Label>
              <Input
                id="periodEnd"
                type="date"
                value={values.periodEnd}
                onChange={(e) =>
                  setValues((v) => ({ ...v, periodEnd: e.target.value }))
                }
                className="h-10"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="paymentDate"
                className="text-sm font-medium text-label"
              >
                Payment date
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={values.paymentDate}
                onChange={(e) =>
                  setValues((v) => ({ ...v, paymentDate: e.target.value }))
                }
                className="h-10"
              />
            </div>
          </div>
        </div>

        {showOverlap && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
            Another run overlaps this period
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Employees</h2>
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
              {selected.size} selected
            </span>
          </div>
          <div className="border-b border-border px-5 py-3">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees"
                aria-label="Search run employees"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={allVisibleSelected}
                      onChange={toggleAll}
                      className="size-4 cursor-pointer accent-[var(--brand)]"
                    />
                  </th>
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Job title</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${employee.name}`}
                        checked={selected.has(employee.id)}
                        onChange={() => toggleEmployee(employee.id)}
                        className="size-4 cursor-pointer accent-[var(--brand)]"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                          {initials(employee.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-card-foreground">
                            {employee.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">{employee.department}</td>
                    <td className="px-5 py-3">{employee.jobTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/payroll">Cancel</Link>
          </Button>
          <Button type="submit" variant="brand" disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {saving ? "Saving…" : "Save as draft"}
          </Button>
        </div>
      </form>
    </section>
  );
}
