"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EMPLOYEE_STATUSES,
  type MockEmployee,
  type MockEmployeeStatus,
} from "@/lib/mock-employees";
import type { MockPayslip, MockPayslipStatus } from "@/lib/mock-payslips";
import type { MockSalaryStructure } from "@/lib/mock-salary-structures";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

type Tab = "overview" | "salary" | "payslips";

const EMPLOYEE_STATUS_STYLES: Record<MockEmployeeStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "On Leave": "bg-blue-100 text-blue-700",
  Terminated: "bg-slate-200 text-slate-600",
};

const PAYSLIP_STATUS_STYLES: Record<MockPayslipStatus, string> = {
  Sent: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-600",
};

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "salary", label: "Salary history" },
  { id: "payslips", label: "Payslips" },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function maskAccount(accountNumber: string): string {
  return `****${accountNumber.slice(-4)}`;
}

export function EmployeeDetail({
  employee,
  structures,
  payslips,
}: {
  employee: MockEmployee;
  structures: MockSalaryStructure[];
  payslips: MockPayslip[];
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [bankRevealed, setBankRevealed] = useState(false);
  const [structureDialogOpen, setStructureDialogOpen] = useState(false);

  const [structureValues, setStructureValues] = useState({
    effectiveDate: "",
    reason: "Initial",
    basic: "",
    housing: "",
    transport: "",
    other: "",
  });
  const [structureSaving, setStructureSaving] = useState(false);
  const [structureErrors, setStructureErrors] = useState<{
    effectiveDate?: string;
  }>({});

  function submitStructure(event: FormEvent) {
    event.preventDefault();
    if (!structureValues.effectiveDate) {
      setStructureErrors({ effectiveDate: "Pick an effective date" });
      return;
    }
    setStructureErrors({});
    setStructureSaving(true);
    setTimeout(() => {
      setStructureSaving(false);
      setStructureDialogOpen(false);
      toast.success("Salary structure saved");
    }, 300);
  }

  const overviewRows = [
    ["Full name", employee.name],
    ["Employee code", employee.code],
    ["Email", employee.email],
    ["Phone", employee.phone],
    ["Department", employee.department],
    ["Job title", employee.jobTitle],
    ["Hire date", formatDate(employee.hireDate)],
    ["Status", employee.status],
  ];

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/employees"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Employees
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand/10 text-lg font-semibold text-brand">
            {initials(employee.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {employee.name}
              </h1>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {employee.code}
              </span>
              <div className="relative">
                <button
                  type="button"
                  aria-label="Change status"
                  aria-expanded={statusMenuOpen}
                  onClick={() => setStatusMenuOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-80"
                >
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      EMPLOYEE_STATUS_STYLES[employee.status],
                    )}
                  >
                    {employee.status}
                  </span>
                  <ChevronDown className="size-3 text-muted-foreground" aria-hidden />
                </button>
                {statusMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close status menu"
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setStatusMenuOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute left-0 z-40 mt-1 w-40 rounded-lg border border-border bg-card p-1 shadow-lg"
                    >
                      {EMPLOYEE_STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setStatusMenuOpen(false);
                            toast("Status change is not implemented yet");
                          }}
                          className="flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {employee.department} · {employee.jobTitle}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {employee.email} · {employee.phone}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-brand text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">
                Personal &amp; employment details
              </h2>
            </div>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-5 py-4 sm:grid-cols-2">
              {overviewRows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-card-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">Bank details</h2>
            </div>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-5 py-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Account name
                </dt>
                <dd className="mt-1 text-sm font-medium text-card-foreground">
                  {employee.bankAccountName}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Bank name
                </dt>
                <dd className="mt-1 text-sm font-medium text-card-foreground">
                  {employee.bankName}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Account number
                </dt>
                <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-card-foreground">
                  {bankRevealed
                    ? employee.accountNumber
                    : maskAccount(employee.accountNumber)}
                  <button
                    type="button"
                    onClick={() => setBankRevealed((v) => !v)}
                    className="inline-flex items-center gap-1 rounded text-sm font-medium text-brand hover:underline"
                  >
                    {bankRevealed ? (
                      <>
                        <EyeOff className="size-3.5" aria-hidden />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="size-3.5" aria-hidden />
                        Reveal
                      </>
                    )}
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {tab === "salary" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Salary history</h2>
            <Button
              variant="brand"
              size="sm"
              onClick={() => setStructureDialogOpen(true)}
            >
              <Plus className="size-4" aria-hidden />
              Add new structure
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-2 font-medium">Effective date</th>
                  <th className="px-5 py-2 text-right font-medium">Basic</th>
                  <th className="px-5 py-2 text-right font-medium">Housing</th>
                  <th className="px-5 py-2 text-right font-medium">Transport</th>
                  <th className="px-5 py-2 text-right font-medium">Other</th>
                  <th className="px-5 py-2 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {structures.map((structure) => (
                  <tr
                    key={structure.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3 font-medium">
                      {formatDate(structure.effectiveDate)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatNaira(structure.basicKobo)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatNaira(structure.housingKobo)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatNaira(structure.transportKobo)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatNaira(structure.otherKobo)}
                    </td>
                    <td className="px-5 py-3">{structure.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "payslips" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Payslips</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-2 font-medium">Reference</th>
                  <th className="px-5 py-2 font-medium">Period</th>
                  <th className="px-5 py-2 text-right font-medium">Net pay</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((payslip) => (
                  <tr
                    key={payslip.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3 font-medium">
                      {payslip.reference}
                    </td>
                    <td className="px-5 py-3">{payslip.period}</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      {formatNaira(payslip.netKobo)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          PAYSLIP_STATUS_STYLES[payslip.status],
                        )}
                      >
                        {payslip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {structureDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/50"
            onClick={() => setStructureDialogOpen(false)}
          />
          <form
            onSubmit={submitStructure}
            noValidate
            className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold">Add new structure</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label
                  htmlFor="effectiveDate"
                  className="text-sm font-medium text-label"
                >
                  Effective date
                </Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={structureValues.effectiveDate}
                  onChange={(e) =>
                    setStructureValues((v) => ({
                      ...v,
                      effectiveDate: e.target.value,
                    }))
                  }
                  aria-invalid={!!structureErrors.effectiveDate}
                  className={cn(
                    "h-10",
                    structureErrors.effectiveDate && "border-destructive",
                  )}
                />
                {structureErrors.effectiveDate && (
                  <p className="text-xs text-destructive">
                    {structureErrors.effectiveDate}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="basic" className="text-sm font-medium text-label">
                  Basic (₦)
                </Label>
                <Input
                  id="basic"
                  type="number"
                  min={0}
                  placeholder="450000"
                  value={structureValues.basic}
                  onChange={(e) =>
                    setStructureValues((v) => ({ ...v, basic: e.target.value }))
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="housing" className="text-sm font-medium text-label">
                  Housing (₦)
                </Label>
                <Input
                  id="housing"
                  type="number"
                  min={0}
                  placeholder="120000"
                  value={structureValues.housing}
                  onChange={(e) =>
                    setStructureValues((v) => ({
                      ...v,
                      housing: e.target.value,
                    }))
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="transport"
                  className="text-sm font-medium text-label"
                >
                  Transport (₦)
                </Label>
                <Input
                  id="transport"
                  type="number"
                  min={0}
                  placeholder="60000"
                  value={structureValues.transport}
                  onChange={(e) =>
                    setStructureValues((v) => ({
                      ...v,
                      transport: e.target.value,
                    }))
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="other" className="text-sm font-medium text-label">
                  Other (₦)
                </Label>
                <Input
                  id="other"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={structureValues.other}
                  onChange={(e) =>
                    setStructureValues((v) => ({ ...v, other: e.target.value }))
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="reason" className="text-sm font-medium text-label">
                  Reason
                </Label>
                <select
                  id="reason"
                  value={structureValues.reason}
                  onChange={(e) =>
                    setStructureValues((v) => ({ ...v, reason: e.target.value }))
                  }
                  className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="Initial">Initial</option>
                  <option value="Review">Review</option>
                  <option value="Promotion">Promotion</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStructureDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="brand" disabled={structureSaving}>
                {structureSaving && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {structureSaving ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
