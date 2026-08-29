import { MOCK_EMPLOYEES } from "@/lib/mock-employees";
import { getMockSalaryStructures } from "@/lib/mock-salary-structures";

export type MockRunStatus = "Draft" | "Review" | "Finalized";

export type MockPayrollRun = {
  id: string;
  name: string;
  periodRange: string;
  paymentDate: string;
  status: MockRunStatus;
  finalizedAt?: string;
  finalizedBy?: string;
  employees: number;
  grossKobo: number;
  deductionsKobo: number;
  netKobo: number;
};

export type MockRunEntry = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  grossKobo: number;
  deductionsKobo: number;
  netKobo: number;
  override: boolean;
  oneOff: boolean;
  earnings: { name: string; kobo: number }[];
  deductions: { name: string; kobo: number }[];
  payeKobo: number;
  pensionKobo: number;
  nhfKobo: number;
  taxableKobo: number;
  reliefKobo: number;
  chargeableKobo: number;
  bands: { label: string; rate: string; amountKobo: number }[];
};

const RUN_META: {
  id: string;
  name: string;
  periodRange: string;
  paymentDate: string;
  status: MockRunStatus;
  finalizedAt?: string;
  finalizedBy?: string;
}[] = [
  {
    id: "run-2026-08",
    name: "August 2026",
    periodRange: "01–31 Aug 2026",
    paymentDate: "28 Aug 2026",
    status: "Draft",
  },
  {
    id: "run-2026-07",
    name: "July 2026",
    periodRange: "01–31 Jul 2026",
    paymentDate: "28 Jul 2026",
    status: "Finalized",
    finalizedAt: "25 Jul 2026",
    finalizedBy: "Adaeze Okafor",
  },
  {
    id: "run-2026-06",
    name: "June 2026",
    periodRange: "01–30 Jun 2026",
    paymentDate: "28 Jun 2026",
    status: "Draft",
  },
];

const PERIOD_LABELS: Record<string, string> = {
  "run-2026-08": "Aug 2026",
  "run-2026-07": "Jul 2026",
  "run-2026-06": "Jun 2026",
};

function buildEntry(employeeId: string, index: number): MockRunEntry {
  const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);
  const structure = getMockSalaryStructures(employeeId)[0];
  const basicKobo = structure?.basicKobo ?? 45_000_000;
  const housingKobo = structure?.housingKobo ?? 12_000_000;
  const transportKobo = structure?.transportKobo ?? 6_000_000;
  const otherKobo = structure?.otherKobo ?? 0;

  const grossKobo = basicKobo + housingKobo + transportKobo + otherKobo;
  const pensionKobo = Math.round(grossKobo * 0.08);
  const nhfKobo = Math.round(grossKobo * 0.025);
  const taxableKobo = grossKobo - pensionKobo - nhfKobo;
  const reliefKobo = Math.round(grossKobo * 0.2);
  const chargeableKobo = Math.max(0, taxableKobo - reliefKobo);

  // PAYE is annualised: apply the bands to the yearly chargeable amount,
  // then divide by 12 for the monthly figure.
  const annualChargeableKobo = chargeableKobo * 12;
  const band1 = Math.min(annualChargeableKobo, 80_000_000);
  const band2 = Math.min(
    Math.max(annualChargeableKobo - 80_000_000, 0),
    320_000_000,
  );
  const band3 = Math.max(annualChargeableKobo - 400_000_000, 0);
  const payeKobo = Math.round(
    (band1 * 0 + band2 * 0.15 + band3 * 0.25) / 12,
  );

  const bands = [
    { label: "First ₦800,000", rate: "0%", amountKobo: band1 },
    { label: "Next ₦3,200,000", rate: "15%", amountKobo: band2 },
    { label: "Above ₦4,000,000", rate: "25%", amountKobo: band3 },
  ];

  const deductionsKobo = payeKobo + pensionKobo + nhfKobo;

  return {
    id: `${employeeId}-${index}`,
    employeeId,
    employeeName: employee?.name ?? `Employee ${index + 1}`,
    employeeCode: employee?.code ?? `EMP-${index + 1}`,
    grossKobo,
    deductionsKobo,
    netKobo: grossKobo - deductionsKobo,
    override: index === 2,
    oneOff: index === 5,
    earnings: [
      { name: "Basic", kobo: basicKobo },
      { name: "Housing", kobo: housingKobo },
      { name: "Transport", kobo: transportKobo },
      { name: "Other", kobo: otherKobo },
    ],
    deductions: [
      { name: "PAYE", kobo: payeKobo },
      { name: "Pension", kobo: pensionKobo },
      { name: "NHF", kobo: nhfKobo },
    ],
    payeKobo,
    pensionKobo,
    nhfKobo,
    taxableKobo,
    reliefKobo,
    chargeableKobo,
    bands,
  };
}

export function getMockRunEntries(runId: string): MockRunEntry[] {
  return MOCK_EMPLOYEES.map((employee, index) =>
    buildEntry(employee.id, index),
  ).filter(() => RUN_META.some((r) => r.id === runId));
}

export function getMockPayrollRuns(): MockPayrollRun[] {
  return RUN_META.map((meta) => {
    const entries = getMockRunEntries(meta.id);
    const grossKobo = entries.reduce((sum, e) => sum + e.grossKobo, 0);
    const deductionsKobo = entries.reduce(
      (sum, e) => sum + e.deductionsKobo,
      0,
    );
    return {
      ...meta,
      employees: entries.length,
      grossKobo,
      deductionsKobo,
      netKobo: grossKobo - deductionsKobo,
    };
  });
}

export function getPeriodLabel(runId: string): string {
  return PERIOD_LABELS[runId] ?? "Unknown period";
}
