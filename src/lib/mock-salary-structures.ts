import { MOCK_EMPLOYEES } from "@/lib/mock-employees";

export type SalaryStructureReason = "Initial" | "Review" | "Promotion";

export type MockSalaryStructure = {
  id: string;
  employeeId: string;
  effectiveDate: string;
  basicKobo: number;
  housingKobo: number;
  transportKobo: number;
  otherKobo: number;
  reason: SalaryStructureReason;
};

const STRUCTURE_BASES: {
  basicKobo: number;
  housingKobo: number;
  transportKobo: number;
  otherKobo: number;
  reason: SalaryStructureReason;
}[] = [
  {
    basicKobo: 45_000_000,
    housingKobo: 12_000_000,
    transportKobo: 6_000_000,
    otherKobo: 0,
    reason: "Initial",
  },
  {
    basicKobo: 52_000_000,
    housingKobo: 13_000_000,
    transportKobo: 6_000_000,
    otherKobo: 1_000_000,
    reason: "Promotion",
  },
];

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

export function getMockSalaryStructures(
  employeeId: string,
): MockSalaryStructure[] {
  const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);
  if (!employee) return [];

  const hireDate = new Date(employee.hireDate);
  const reviewDate = new Date(hireDate.getFullYear() + 1, hireDate.getMonth(), 1);

  return STRUCTURE_BASES.map((base, index) => ({
    id: `${employeeId}-structure-${index + 1}`,
    employeeId,
    effectiveDate:
      index === 0 ? employee.hireDate : toIsoDate(reviewDate),
    ...base,
  }));
}
