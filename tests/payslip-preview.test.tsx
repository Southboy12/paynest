import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const toastInfo = vi.fn();
const toastSuccess = vi.fn();
vi.mock("sonner", () => ({
  toast: Object.assign((message: string) => toastInfo(message), {
    error: (message: string) => toastInfo(message),
    success: (message: string) => toastSuccess(message),
  }),
}));

import { PayslipPreview } from "@/components/payslip-preview";
import { nairaInWords } from "@/lib/amount-in-words";
import { MOCK_EMPLOYEES } from "@/lib/mock-employees";
import { getMockRunEntries } from "@/lib/mock-payroll-runs";
import { getMockPayslipList } from "@/lib/mock-payslips";

function renderPreview() {
  const payslip = getMockPayslipList()[0];
  const employee = MOCK_EMPLOYEES[0];
  const entry = getMockRunEntries("run-2026-08")[0];
  render(
    <PayslipPreview payslip={payslip} employee={employee} entry={entry} />,
  );
  return { payslip, employee, entry };
}

describe("payslip preview", () => {
  test("renders the sheet header and reference", () => {
    const { payslip, employee } = renderPreview();

    expect(screen.getByText("PAYSLIP")).toBeInTheDocument();
    expect(screen.getByText(payslip.reference)).toBeInTheDocument();
    expect(screen.getByText("PayNest Demo Company")).toBeInTheDocument();
    expect(screen.getByText(employee.name)).toBeInTheDocument();
    expect(screen.getByText(`Code: ${employee.code}`)).toBeInTheDocument();
  });

  test("masks the bank account on the sheet", () => {
    renderPreview();

    expect(screen.getByText(/Bank: GTBank \*\*\*\*6789/)).toBeInTheDocument();
  });

  test("shows earnings and deductions with totals", () => {
    renderPreview();

    expect(screen.getByText("Total earnings")).toBeInTheDocument();
    expect(screen.getAllByText("Total deductions").length).toBeGreaterThan(0);
    expect(screen.getAllByText("₦630,000.00").length).toBeGreaterThan(0);
  });

  test("shows the summary band with net pay and amount in words", () => {
    const { entry } = renderPreview();

    expect(screen.getByText("Net pay")).toBeInTheDocument();
    expect(screen.getByText(nairaInWords(entry.netKobo))).toBeInTheDocument();
  });

  test("shows employer contributions and the system footer", () => {
    renderPreview();

    expect(
      screen.getByText("Pension (employer 10% of basic)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This is a system-generated payslip."),
    ).toBeInTheDocument();
  });

  test("action bar toasts for download and password copy", () => {
    renderPreview();

    fireEvent.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(toastInfo).toHaveBeenCalledWith("PDF ready (mock)");

    fireEvent.click(screen.getByRole("button", { name: /Password: k9/ }));
    expect(toastInfo).toHaveBeenCalledWith("Copied");
  });

  test("send email opens a dialog with an editable recipient", () => {
    renderPreview();

    fireEvent.click(screen.getByRole("button", { name: "Send email" }));

    expect(
      screen.getByRole("heading", { name: "Send payslip" }),
    ).toBeInTheDocument();
    const to = screen.getByLabelText("To") as HTMLInputElement;
    expect(to.value).toBe("adaeze.okafor@paynest.local");

    fireEvent.change(to, { target: { value: "hr@paynest.local" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(toastSuccess).toHaveBeenCalledWith("Email sent (mock)");
  });
});
