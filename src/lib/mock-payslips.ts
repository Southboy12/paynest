import { MOCK_EMPLOYEES } from "@/lib/mock-employees";

export type MockPayslipStatus = "Sent" | "Pending" | "Failed";

export type MockPayslip = {
  id: string;
  employeeId: string;
  reference: string;
  period: string;
  netKobo: number;
  status: MockPayslipStatus;
};

const PAYSLIP_PERIODS: {
  period: string;
  reference: string;
  netKobo: number;
  status: MockPayslipStatus;
}[] = [
  { period: "August 2026", reference: "PS-2026-08", netKobo: 486_000_000, status: "Sent" },
  { period: "July 2026", reference: "PS-2026-07", netKobo: 475_000_000, status: "Sent" },
  { period: "June 2026", reference: "PS-2026-06", netKobo: 452_000_000, status: "Pending" },
];

export function getMockPayslips(employeeId: string): MockPayslip[] {
  const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);
  if (!employee) return [];

  const sequence = Number(employee.id.slice(-3));

  return PAYSLIP_PERIODS.map((row, index) => ({
    id: `${employeeId}-payslip-${index + 1}`,
    employeeId,
    reference: `${row.reference}-${String(sequence).padStart(4, "0")}`,
    period: row.period,
    netKobo: row.netKobo,
    status: row.status,
  }));
}
