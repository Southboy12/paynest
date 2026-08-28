import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileClock,
  FileText,
  RotateCcw,
  Send,
  Users,
  Wallet,
} from "lucide-react";

import { formatNaira } from "@/lib/money";

export const metadata: Metadata = {
  title: "Dashboard",
};

const STAT_CARDS = [
  {
    label: "Active employees",
    value: "8",
    href: "/employees",
    icon: Users,
    tint: "bg-brand/10 text-brand",
  },
  {
    label: "Draft payroll runs",
    value: "1",
    href: "/payroll",
    icon: FileClock,
    tint: "bg-amber-100 text-amber-700",
  },
  {
    label: "Latest finalized run",
    value: "August 2026",
    sub: `Net ${formatNaira(428_650_000)}`,
    href: "/payroll",
    icon: Wallet,
    tint: "bg-brand/10 text-brand",
  },
  {
    label: "Failed deliveries",
    value: "1",
    href: "/payslips",
    icon: AlertCircle,
    tint: "bg-red-100 text-red-600",
    valueTone: "text-red-600",
  },
];

type RunStatus = "Finalized" | "Draft";

const RUN_STATUS_STYLES: Record<RunStatus, string> = {
  Finalized: "bg-emerald-100 text-emerald-700",
  Draft: "bg-slate-100 text-slate-600",
};

const RECENT_RUNS: {
  period: string;
  status: RunStatus;
  employees: number;
  netKobo: number;
}[] = [
  { period: "August 2026", status: "Finalized", employees: 8, netKobo: 428_650_000 },
  { period: "July 2026", status: "Finalized", employees: 8, netKobo: 419_875_000 },
  { period: "June 2026", status: "Draft", employees: 8, netKobo: 451_280_000 },
];

const ACTIVITY_AVATAR_TONES = [
  "bg-brand/15 text-brand",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-slate-200 text-slate-600",
  "bg-amber-100 text-amber-700",
];

const RECENT_ACTIVITY = [
  {
    actor: "Adaeze Okafor",
    action: 'Finalized payroll run "August 2026"',
    time: "2h ago",
    icon: CheckCircle2,
  },
  {
    actor: "Chinedu Adeyemi",
    action: "Generated 8 payslips for August 2026",
    time: "4h ago",
    icon: FileText,
  },
  {
    actor: "Fatima Bello",
    action: "Bulk send completed — 8/8 delivered",
    time: "Yesterday",
    icon: Send,
  },
  {
    actor: "System",
    action: "Delivery failed for PS-2026-08-0004 (invalid recipient email)",
    time: "Yesterday",
    icon: AlertCircle,
  },
  {
    actor: "Tunde Bakare",
    action: 'Reopened payroll run "June 2026"',
    time: "2 days ago",
    icon: RotateCcw,
  },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

function StatusBadge({ status }: { status: RunStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${RUN_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of payroll activity and key metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card, index) => (
          <Link
            key={card.label}
            href={card.href}
            className="group animate-card-in rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.tint}`}
              >
                <card.icon className="size-4" aria-hidden />
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-brand">
                View all
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              {card.label}
            </p>
            <p
              className={`mt-1 text-2xl font-semibold tracking-tight ${card.valueTone ?? ""}`}
            >
              {card.value}
            </p>
            {card.sub && (
              <p className="text-sm text-muted-foreground">{card.sub}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="animate-card-in rounded-xl border border-border bg-card shadow-sm lg:col-span-2" style={{ animationDelay: "280ms" }}>
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Recent payroll runs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-2 font-medium">Period</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                  <th className="px-5 py-2 font-medium">Employees</th>
                  <th className="px-5 py-2 text-right font-medium">
                    Net total
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_RUNS.map((run) => (
                  <tr
                    key={run.period}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3 font-medium">{run.period}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-5 py-3">{run.employees}</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      {formatNaira(run.netKobo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-5 py-3">
            <Link
              href="/payroll"
              className="text-sm font-medium text-brand hover:underline"
            >
              View all runs
            </Link>
          </div>
        </div>

        <div className="animate-card-in rounded-xl border border-border bg-card shadow-sm" style={{ animationDelay: "360ms" }}>
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Recent activity</h2>
          </div>
          <ul className="divide-y divide-border">
            {RECENT_ACTIVITY.map((entry, index) => (
              <li key={`${entry.actor}-${index}`} className="flex gap-3 px-5 py-3">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${ACTIVITY_AVATAR_TONES[index % ACTIVITY_AVATAR_TONES.length]}`}
                >
                  {initials(entry.actor)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-card-foreground">
                    <span className="font-medium">{entry.actor}</span>{" "}
                    {entry.action}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {entry.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
