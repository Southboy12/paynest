"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type MockPayrollRun,
  type MockRunEntry,
  type MockRunStatus,
} from "@/lib/mock-payroll-runs";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<MockRunStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Review: "bg-amber-100 text-amber-700",
  Finalized: "bg-emerald-100 text-emerald-700",
};

type ModalKind = "override" | "finalize" | "reopen" | "delete";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

export function RunDetail({
  run,
  entries,
}: {
  run: MockPayrollRun;
  entries: MockRunEntry[];
}) {
  const router = useRouter();
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [overrideValues, setOverrideValues] = useState({
    component: "",
    newAmount: "",
    reason: "",
  });
  const [reopenReason, setReopenReason] = useState("");
  const [savingOverride, setSavingOverride] = useState(false);

  const entry = useMemo(
    () => entries.find((e) => e.id === drawerId) ?? null,
    [entries, drawerId],
  );

  const componentOptions = useMemo(() => {
    if (!entry) return [];
    return [
      ...entry.earnings.map((c) => c.name),
      ...entry.deductions.map((c) => c.name),
    ];
  }, [entry]);

  const originalAmount = useMemo(() => {
    if (!entry || !overrideValues.component) return 0;
    return (
      entry.earnings.find((c) => c.name === overrideValues.component)?.kobo ??
      entry.deductions.find((c) => c.name === overrideValues.component)?.kobo ??
      0
    );
  }, [entry, overrideValues.component]);

  function openDrawer(id: string) {
    setDrawerId(id);
    setOverrideValues({ component: "", newAmount: "", reason: "" });
  }

  function submitOverride() {
    if (!overrideValues.reason.trim()) return;
    setSavingOverride(true);
    setTimeout(() => {
      setSavingOverride(false);
      setModal(null);
      toast.success("Override applied");
    }, 300);
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

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {run.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  STATUS_STYLES[run.status],
                )}
              >
                {run.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Period: {run.periodRange} · Payment date: {run.paymentDate}
            </p>
            {run.status === "Finalized" && run.finalizedAt && (
              <p className="mt-2 text-sm text-muted-foreground">
                Locked — finalized on {run.finalizedAt} by {run.finalizedBy}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {run.status === "Draft" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => toast("Run submitted for review (mock)")}
                >
                  Submit for review
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast("Calculation complete (mock)")}
                >
                  Calculate
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => setModal("delete")}
                >
                  Delete
                </Button>
              </>
            )}
            {run.status === "Review" && (
              <>
                <Button variant="brand" onClick={() => setModal("finalize")}>
                  Finalize
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast("Run moved back to draft (mock)")}
                >
                  Back to draft
                </Button>
              </>
            )}
            {run.status === "Finalized" && (
              <Button variant="outline" onClick={() => setModal("reopen")}>
                Reopen
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Gross</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {formatNaira(run.grossKobo)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Total deductions
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {formatNaira(run.deductionsKobo)}
          </p>
        </div>
        <div className="rounded-xl border border-brand bg-brand p-5 text-brand-foreground shadow-sm">
          <p className="text-sm font-medium opacity-80">Net pay</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {formatNaira(run.netKobo)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 text-right font-medium">Gross</th>
                <th className="px-5 py-3 text-right font-medium">
                  Deductions
                </th>
                <th className="px-5 py-3 text-right font-medium">Net</th>
                <th className="px-5 py-3 font-medium">
                  <span className="sr-only">Indicators</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => openDrawer(e.id)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-accent/50"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                        {initials(e.employeeName)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-card-foreground">
                          {e.employeeName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {e.employeeCode}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {formatNaira(e.grossKobo)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {formatNaira(e.deductionsKobo)}
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums">
                    {formatNaira(e.netKobo)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      {e.override && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Override
                        </span>
                      )}
                      {e.oneOff && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          One-off
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {entry && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close entry drawer"
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerId(null)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-l border-border bg-background p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                {initials(entry.employeeName)}
              </span>
              <div>
                <p className="font-semibold">{entry.employeeName}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.employeeCode}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold">Earnings</h3>
                <table className="mt-2 w-full text-sm">
                  <tbody>
                    {entry.earnings.map((c) => (
                      <tr key={c.name} className="border-b border-border">
                        <td className="py-2">{c.name}</td>
                        <td className="py-2 text-right tabular-nums">
                          {formatNaira(c.kobo)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td className="py-2">Total</td>
                      <td className="py-2 text-right tabular-nums">
                        {formatNaira(entry.grossKobo)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Deductions</h3>
                <table className="mt-2 w-full text-sm">
                  <tbody>
                    {entry.deductions.map((c) => (
                      <tr key={c.name} className="border-b border-border">
                        <td className="py-2">{c.name}</td>
                        <td className="py-2 text-right tabular-nums">
                          {formatNaira(c.kobo)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td className="py-2">Total</td>
                      <td className="py-2 text-right tabular-nums">
                        {formatNaira(entry.deductionsKobo)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-slate-50 p-4">
              <h3 className="text-sm font-semibold">
                How PAYE was calculated
              </h3>
              <ol className="mt-3 space-y-1.5 text-sm">
                <li className="flex justify-between gap-2">
                  <span>Gross</span>
                  <span className="tabular-nums">
                    {formatNaira(entry.grossKobo)}
                  </span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>− Pension ({formatNaira(entry.pensionKobo)})</span>
                  <span className="tabular-nums">
                    {formatNaira(entry.taxableKobo)}
                  </span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>− NHF ({formatNaira(entry.nhfKobo)})</span>
                  <span className="tabular-nums">
                    {formatNaira(entry.taxableKobo - entry.nhfKobo)}
                  </span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Taxable income</span>
                  <span className="tabular-nums">
                    {formatNaira(entry.taxableKobo)}
                  </span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>− Consolidated relief</span>
                  <span className="tabular-nums">
                    {formatNaira(entry.reliefKobo)}
                  </span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Chargeable income</span>
                  <span className="font-medium tabular-nums">
                    {formatNaira(entry.chargeableKobo)}
                  </span>
                </li>
              </ol>
              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-1.5 font-medium">Band</th>
                    <th className="py-1.5 text-right font-medium">Rate</th>
                    <th className="py-1.5 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.bands.map((band) => (
                    <tr key={band.label} className="border-b border-border">
                      <td className="py-1.5">{band.label}</td>
                      <td className="py-1.5 text-right">{band.rate}</td>
                      <td className="py-1.5 text-right tabular-nums">
                        {formatNaira(band.amountKobo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm">
                Monthly PAYE:{" "}
                <span className="font-semibold tabular-nums">
                  {formatNaira(entry.payeKobo)}
                </span>
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="brand" onClick={() => setModal("override")}>
                Edit amount
              </Button>
            </div>
          </div>
        </div>
      )}

      {modal === "override" && entry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close override dialog"
            className="absolute inset-0 bg-black/50"
            onClick={() => setModal(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Override amount</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="overrideComponent"
                  className="text-sm font-medium text-label"
                >
                  Component
                </Label>
                <select
                  id="overrideComponent"
                  value={overrideValues.component}
                  onChange={(e) =>
                    setOverrideValues((v) => ({
                      ...v,
                      component: e.target.value,
                    }))
                  }
                  className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">Select component</option>
                  {componentOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="originalAmount"
                  className="text-sm font-medium text-label"
                >
                  Original amount
                </Label>
                <Input
                  id="originalAmount"
                  readOnly
                  value={
                    overrideValues.component
                      ? formatNaira(originalAmount)
                      : ""
                  }
                  className="h-10 bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="newAmount"
                  className="text-sm font-medium text-label"
                >
                  New amount (₦)
                </Label>
                <Input
                  id="newAmount"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={overrideValues.newAmount}
                  onChange={(e) =>
                    setOverrideValues((v) => ({
                      ...v,
                      newAmount: e.target.value,
                    }))
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="overrideReason"
                  className="text-sm font-medium text-label"
                >
                  Reason
                </Label>
                <textarea
                  id="overrideReason"
                  rows={3}
                  value={overrideValues.reason}
                  onChange={(e) =>
                    setOverrideValues((v) => ({ ...v, reason: e.target.value }))
                  }
                  placeholder="Why is this amount changing?"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                <p className="text-xs text-muted-foreground">
                  Required for audit trail
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="brand"
                disabled={
                  !overrideValues.component ||
                  overrideValues.newAmount === "" ||
                  !overrideValues.reason.trim() ||
                  savingOverride
                }
                onClick={submitOverride}
              >
                {savingOverride ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {modal === "finalize" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close finalize dialog"
            className="absolute inset-0 bg-black/50"
            onClick={() => setModal(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Finalize payroll run</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Run</dt>
                <dd className="font-medium">{run.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Employees</dt>
                <dd className="font-medium">{entries.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Net total</dt>
                <dd className="font-medium tabular-nums">
                  {formatNaira(run.netKobo)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              This will lock the run and generate {entries.length} payslips.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="brand"
                onClick={() => {
                  setModal(null);
                  toast.success("Run finalized (mock)");
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {modal === "reopen" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close reopen dialog"
            className="absolute inset-0 bg-black/50"
            onClick={() => setModal(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Reopen payroll run</h2>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="reopenReason" className="text-sm font-medium text-label">
                Reason
              </Label>
              <textarea
                id="reopenReason"
                rows={3}
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="Why is this run being reopened?"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <p className="text-xs text-muted-foreground">
                Required for audit trail
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setReopenReason("");
                  setModal(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="brand"
                disabled={!reopenReason.trim()}
                onClick={() => {
                  setReopenReason("");
                  setModal(null);
                  toast.success("Run reopened (mock)");
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close delete dialog"
            className="absolute inset-0 bg-black/50"
            onClick={() => setModal(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Delete draft run</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Delete &quot;{run.name}&quot;? This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  setModal(null);
                  toast.success("Run deleted (mock)");
                  router.push("/payroll");
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
