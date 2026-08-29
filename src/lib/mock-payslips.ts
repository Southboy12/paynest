import { MOCK_EMPLOYEES } from "@/lib/mock-employees";
import { getMockRunEntries } from "@/lib/mock-payroll-runs";

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

export function getMockPayslipList(): MockPayslip[] {
  const entries = getMockRunEntries("run-2026-08");

  return MOCK_EMPLOYEES.map((employee, index) => {
    const status: MockPayslipStatus =
      index === MOCK_EMPLOYEES.length - 1
        ? "Failed"
        : index === 2
          ? "Pending"
          : "Sent";
    return {
      id: `${employee.id}-payslip`,
      employeeId: employee.id,
      reference: `PS-2026-08-${String(index + 1).padStart(4, "0")}`,
      period: "August 2026",
      netKobo: entries[index]?.netKobo ?? 0,
      status,
    };
  });
}
