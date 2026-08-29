"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Copy, Download, Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nairaInWords } from "@/lib/amount-in-words";
import type { MockEmployee } from "@/lib/mock-employees";
import type { MockRunEntry } from "@/lib/mock-payroll-runs";
import type { MockPayslip } from "@/lib/mock-payslips";
import { formatNaira } from "@/lib/money";

const COMPANY = {
  name: "PayNest Demo Company",
  address: "12 Adeola Odeku Street, Victoria Island, Lagos",
  phone: "+234 1 700 0000",
  tin: "TIN: 12345678-0001",
};

const PASSWORD = "k9#Tq2mV…";

function maskAccount(accountNumber: string): string {
  return `****${accountNumber.slice(-4)}`;
}

export function PayslipPreview({
  payslip,
  employee,
  entry,
}: {
  payslip: MockPayslip;
  employee: MockEmployee;
  entry: MockRunEntry;
}) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTo, setEmailTo] = useState(employee.email);

  function sendEmail(event: FormEvent) {
    event.preventDefault();
    setEmailDialogOpen(false);
    toast.success("Email sent (mock)");
  }

  const basicKobo = entry.earnings[0]?.kobo ?? 0;
  const employerPension = Math.round(basicKobo * 0.1);

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/payslips"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Payslips
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Payslip preview
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <Button
          variant="brand"
          onClick={() => toast("PDF ready (mock)")}
        >
          <Download className="size-4" aria-hidden />
          Download PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => setEmailDialogOpen(true)}
        >
          <Mail className="size-4" aria-hidden />
          Send email
        </Button>
        <Button variant="ghost" onClick={() => toast("Resent (mock)")}>
          Resend
        </Button>
        <button
          type="button"
          onClick={() => toast("Copied")}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-border bg-slate-50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Copy className="size-3.5" aria-hidden />
          Password: {PASSWORD}
        </button>
      </div>

      <div className="mx-auto w-full max-w-[794px] rounded-sm border border-border bg-white p-10 text-sm text-slate-800 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand text-lg font-bold text-brand-foreground">
              P
            </div>
            <div>
              <p className="font-semibold">{COMPANY.name}</p>
              <p className="text-xs text-slate-500">{COMPANY.address}</p>
              <p className="text-xs text-slate-500">
                {COMPANY.phone} · {COMPANY.tin}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold tracking-wide text-brand">
              PAYSLIP
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {payslip.reference}
            </p>
            <p className="text-xs text-slate-500">Period: {payslip.period}</p>
            <p className="text-xs text-slate-500">Payment date: 28 Aug 2026</p>
          </div>
        </div>
        <div className="mt-4 h-1 rounded-full bg-brand" />

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Employee</p>
            <p className="font-medium">{employee.name}</p>
            <p className="text-xs text-slate-500">Code: {employee.code}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Department</p>
            <p>{employee.department}</p>
            <p className="text-xs text-slate-500">{employee.jobTitle}</p>
            <p className="text-xs text-slate-500">
              Bank: {employee.bankName} {maskAccount(employee.accountNumber)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Earnings
            </h2>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {entry.earnings.map((c) => (
                  <tr key={c.name} className="border-b border-slate-200">
                    <td className="py-1.5">{c.name}</td>
                    <td className="py-1.5 text-right tabular-nums">
                      {formatNaira(c.kobo)}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-1.5">Total earnings</td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatNaira(entry.grossKobo)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Deductions
            </h2>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {entry.deductions.map((c) => (
                  <tr key={c.name} className="border-b border-slate-200">
                    <td className="py-1.5">{c.name}</td>
                    <td className="py-1.5 text-right tabular-nums">
                      {formatNaira(c.kobo)}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-1.5">Total deductions</td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatNaira(entry.deductionsKobo)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Gross</span>
            <span className="tabular-nums">{formatNaira(entry.grossKobo)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-slate-600">Total deductions</span>
            <span className="tabular-nums">
              {formatNaira(entry.deductionsKobo)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2">
            <span className="font-semibold">Net pay</span>
            <span className="text-2xl font-bold tabular-nums text-brand">
              {formatNaira(entry.netKobo)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {nairaInWords(entry.netKobo)}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Employer contributions
          </h2>
          <table className="mt-2 w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-1.5">
                  Pension (employer 10% of basic)
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatNaira(employerPension)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          This is a system-generated payslip.
        </p>
      </div>

      {emailDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close email dialog"
            className="absolute inset-0 bg-black/50"
            onClick={() => setEmailDialogOpen(false)}
          />
          <form
            onSubmit={sendEmail}
            className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold">Send payslip</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="emailTo" className="text-sm font-medium text-label">
                  To
                </Label>
                <Input
                  id="emailTo"
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="rounded-lg border border-border bg-slate-50 p-3 text-sm">
                <p className="font-medium">Subject: Your payslip is ready</p>
                <p className="mt-1 text-muted-foreground">
                  Hi {employee.name.split(" ")[0]}, your payslip for{" "}
                  {payslip.period} is attached.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEmailDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="brand">
                <Send className="size-4" aria-hidden />
                Send
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
