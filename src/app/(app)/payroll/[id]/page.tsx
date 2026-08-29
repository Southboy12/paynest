import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RunDetail } from "@/components/run-detail";
import {
  getMockPayrollRuns,
  getMockRunEntries,
} from "@/lib/mock-payroll-runs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const run = getMockPayrollRuns().find((r) => r.id === id);
  return { title: run ? run.name : "Payroll run" };
}

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = getMockPayrollRuns().find((r) => r.id === id);

  if (!run) {
    notFound();
  }

  return <RunDetail run={run} entries={getMockRunEntries(id)} />;
}
