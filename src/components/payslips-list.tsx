"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Download, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MOCK_EMPLOYEES } from "@/lib/mock-employees";
import {
  getMockPayslipList,
  type MockPayslipStatus,
} from "@/lib/mock-payslips";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<MockPayslipStatus, string> = {
  Sent: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-600",
};

function employeeName(employeeId: string): string {
  return (
    MOCK_EMPLOYEES.find((e) => e.id === employeeId)?.name ??
    employeeId.replace("emp-", "Employee ")
  );
}

function employeeEmail(employeeId: string): string {
  return (
    MOCK_EMPLOYEES.find((e) => e.id === employeeId)?.email ?? ""
  );
}

const ALL = "All";

const PAYSLIPS = getMockPayslipList();
const RUNS = Array.from(new Set(PAYSLIPS.map((p) => p.period))).sort();

const selectClass =
  "h-10 cursor-pointer rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

export function PayslipsList() {
  const router = useRouter();
  const [run, setRun] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      PAYSLIPS.filter(
        (p) =>
          (run === ALL || p.period === run) &&
          (status === ALL || p.status === status),
      ),
    [run, status],
  );

  const hasActiveFilters = run !== ALL || status !== ALL;

  function resetFilters() {
    setRun(ALL);
    setStatus(ALL);
    setOpenMenu(null);
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payslips</h1>
        <p className="text-sm text-muted-foreground">
          View and send payslips for finalized runs.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
        <select
          aria-label="Filter payslips by run"
          value={run}
          onChange={(e) => {
            setRun(e.target.value);
            setOpenMenu(null);
          }}
          className={selectClass}
        >
          <option value={ALL}>All runs</option>
          {RUNS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter payslips by delivery status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setOpenMenu(null);
          }}
          className={selectClass}
        >
          <option value={ALL}>All statuses</option>
          <option value="Sent">Sent</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 text-right font-medium">Net pay</th>
                <th className="px-5 py-3 font-medium">Delivery status</th>
                <th className="px-5 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payslip) => (
                <tr
                  key={payslip.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-3 font-medium">
                    {payslip.reference}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                        {initials(employeeName(payslip.employeeId))}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-card-foreground">
                          {employeeName(payslip.employeeId)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {employeeEmail(payslip.employeeId)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">{payslip.period}</td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums">
                    {formatNaira(payslip.netKobo)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        STATUS_STYLES[payslip.status],
                      )}
                    >
                      {payslip.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        aria-label={`Actions for ${payslip.reference}`}
                        aria-expanded={openMenu === payslip.id}
                        onClick={() =>
                          setOpenMenu((current) =>
                            current === payslip.id ? null : payslip.id,
                          )
                        }
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <MoreHorizontal className="size-4" aria-hidden />
                      </button>
                      {openMenu === payslip.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close actions menu"
                            className="fixed inset-0 z-30 cursor-default"
                            onClick={() => setOpenMenu(null)}
                          />
                          <div
                            role="menu"
                            className="absolute right-0 z-40 mt-1 w-48 rounded-lg border border-border bg-card p-1 shadow-lg"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenu(null);
                                router.push(`/payslips/${payslip.id}`);
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenu(null);
                                toast("PDF ready (mock)");
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              <Download className="size-4" aria-hidden />
                              Download PDF
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenu(null);
                                toast(
                                  payslip.status === "Failed"
                                    ? "Resent (mock)"
                                    : "Sent (mock)",
                                );
                              }}
                              className="flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              {payslip.status === "Failed" ? "Resend" : "Send"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-5 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {PAYSLIPS.length}
          </p>
        </div>
      </div>
    </section>
  );
}
