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

import { EmployeeDetail } from "@/components/employee-detail";
import { MOCK_EMPLOYEES } from "@/lib/mock-employees";
import { getMockPayslips } from "@/lib/mock-payslips";
import { getMockSalaryStructures } from "@/lib/mock-salary-structures";

function renderDetail() {
  const employee = MOCK_EMPLOYEES[0];
  render(
    <EmployeeDetail
      employee={employee}
      structures={getMockSalaryStructures(employee.id)}
      payslips={getMockPayslips(employee.id)}
    />,
  );
  return employee;
}

describe("employee detail", () => {
  test("renders the header card with name, code, role, status, and contact", () => {
    const employee = renderDetail();

    expect(
      screen.getByRole("heading", { level: 1, name: employee.name }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(employee.code).length).toBeGreaterThan(0);
    expect(
      screen.getByText(`${employee.department} · ${employee.jobTitle}`),
    ).toBeInTheDocument();
    expect(screen.getAllByText(employee.status).length).toBeGreaterThan(0);
    expect(
      screen.getByText(`${employee.email} · ${employee.phone}`),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Employees" })).toHaveAttribute(
      "href",
      "/employees",
    );
  });

  test("shows personal details and masks the bank account until revealed", () => {
    renderDetail();

    expect(
      screen.getByText("Personal & employment details"),
    ).toBeInTheDocument();
    expect(screen.getByText("****6789")).toBeInTheDocument();
    expect(screen.queryByText("0123456789")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reveal" }));
    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(screen.queryByText("****6789")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hide" }));
    expect(screen.getByText("****6789")).toBeInTheDocument();
  });

  test("lists salary structures with formatted money and reasons", () => {
    renderDetail();

    fireEvent.click(
      screen.getByRole("button", { name: "Salary history" }),
    );

    expect(
      screen.getByRole("heading", { name: "Salary history" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("₦450,000.00").length).toBeGreaterThan(0);
    expect(screen.getByText("₦120,000.00")).toBeInTheDocument();
    expect(screen.getByText("₦520,000.00")).toBeInTheDocument();
    expect(screen.getByText("Initial")).toBeInTheDocument();
    expect(screen.getByText("Promotion")).toBeInTheDocument();
  });

  test("opens the add new structure dialog and validates the effective date", () => {
    renderDetail();

    fireEvent.click(
      screen.getByRole("button", { name: "Salary history" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Add new structure" }),
    );

    expect(
      screen.getByRole("heading", { name: "Add new structure" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Reason")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Pick an effective date")).toBeInTheDocument();
  });

  test("lists the employee's payslips with status badges", () => {
    renderDetail();

    fireEvent.click(screen.getByRole("button", { name: "Payslips" }));

    expect(screen.getByText("PS-2026-08-0001")).toBeInTheDocument();
    expect(screen.getByText("August 2026")).toBeInTheDocument();
    expect(screen.getByText("₦4,860,000.00")).toBeInTheDocument();
    expect(screen.getAllByText("Sent").length).toBeGreaterThan(0);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
