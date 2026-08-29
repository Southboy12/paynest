"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  getMockPayrollRuns,
  type MockRunStatus,
} from "@/lib/mock-payroll-runs";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<MockRunStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Review: "bg-amber-100 text-amber-700",
  Finalized: "bg-emerald-100 text-emerald-700",
};

const ALL = "All";

const RUNS = getMockPayrollRuns();
const PERIODS = Array.from(new Set(RUNS.map((r) => r.name))).sort();

const selectClass =
  "h-10 cursor-pointer rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function PayrollRunsList() {
  const router = useRouter();
  const [status, setStatus] = useState(ALL);
  const [period, setPeriod] = useState(ALL);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      RUNS.filter(
        (run) =>
          (status === ALL || run.status === status) &&
          (period === ALL || run.name === period),
      ),
    [status, period],
  );

  const hasActiveFilters = status !== ALL || period !== ALL;

  function resetFilters() {
    setStatus(ALL);
    setPeriod(ALL);
    setOpenMenu(null);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payroll runs
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage payroll runs for each pay period.
          </p>
        </div>
        <Button asChild variant="brand">
          <Link href="/payroll/new">
            <Plus className="size-4" aria-hidden />
            New payroll run
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
        <select
          aria-label="Filter runs by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setOpenMenu(null);
          }}
          className={selectClass}
        >
          <option value={ALL}>All statuses</option>
          <option value="Draft">Draft</option>
          <option value="Review">Review</option>
          <option value="Finalized">Finalized</option>
        </select>
        <select
          aria-label="Filter runs by period"
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setOpenMenu(null);
          }}
          className={selectClass}
        >
          <option value={ALL}>All periods</option>
          {PERIODS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
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
                <th className="px-5 py-3 font-medium">Run</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Employees</th>
                <th className="px-5 py-3 text-right font-medium">Gross</th>
                <th className="px-5 py-3 text-right font-medium">
                  Deductions
                </th>
                <th className="px-5 py-3 text-right font-medium">Net</th>
                <th className="px-5 py-3 font-medium">Finalized date</th>
                <th className="px-5 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((run) => (
                <tr
                  key={run.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => router.push(`/payroll/${run.id}`)}
                      className="text-left"
                    >
                      <p className="font-medium text-card-foreground hover:underline">
                        {run.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {run.periodRange}
                      </p>
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        STATUS_STYLES[run.status],
                      )}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">{run.employees}</td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {formatNaira(run.grossKobo)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {formatNaira(run.deductionsKobo)}
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums">
                    {formatNaira(run.netKobo)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {run.finalizedAt ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        aria-label={`Actions for ${run.name}`}
                        aria-expanded={openMenu === run.id}
                        onClick={() =>
                          setOpenMenu((current) =>
                            current === run.id ? null : run.id,
                          )
                        }
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <MoreHorizontal className="size-4" aria-hidden />
                      </button>
                      {openMenu === run.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close actions menu"
                            className="fixed inset-0 z-30 cursor-default"
                            onClick={() => setOpenMenu(null)}
                          />
                          <div
                            role="menu"
                            className="absolute right-0 z-40 mt-1 w-44 rounded-lg border border-border bg-card p-1 shadow-lg"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenu(null);
                                router.push(`/payroll/${run.id}`);
                              }}
                              className="flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              Open
                            </button>
                            {run.status !== "Finalized" && (
                              <>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    toast("Duplicate is not implemented yet");
                                  }}
                                  className="flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                                >
                                  Duplicate
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    toast("Delete is not implemented yet");
                                  }}
                                  className="flex w-full rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-accent"
                                >
                                  Delete
                                </button>
                              </>
                            )}
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
            Showing {filtered.length} of {RUNS.length}
          </p>
        </div>
      </div>
    </section>
  );
}
