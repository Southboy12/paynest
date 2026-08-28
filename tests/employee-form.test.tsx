import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const routerPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush }),
}));

const toastSuccess = vi.fn();
const toastInfo = vi.fn();
vi.mock("sonner", () => ({
  toast: Object.assign((message: string) => toastInfo(message), {
    error: (message: string) => toastInfo(message),
    success: (message: string) => toastSuccess(message),
  }),
}));

import { EmployeeForm } from "@/components/employee-form";

function typeInto(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function clickButton(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

function fillValidForm() {
  typeInto("Full name", "Ada Lovelace");
  typeInto("Email", "ada.lovelace@paynest.local");
  typeInto("Phone", "+234 801 234 5678");
  typeInto("Department", "Finance");
  typeInto("Job title", "Payroll Analyst");
  typeInto("Hire date", "2024-03-01");
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("new employee form", () => {
  test("renders the form fields and back link", () => {
    render(<EmployeeForm />);

    expect(
      screen.getByRole("heading", { level: 1, name: "New employee" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Department")).toBeInTheDocument();
    expect(screen.getByLabelText("Job title")).toBeInTheDocument();
    expect(screen.getByLabelText("Hire date")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Employees" }),
    ).toHaveAttribute("href", "/employees");
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/employees",
    );
  });

  test("does not show the status field when creating", () => {
    render(<EmployeeForm />);

    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
  });

  test("shows inline errors on an empty submit", () => {
    render(<EmployeeForm />);

    clickButton("Save");

    expect(
      screen.getByText("Enter the employee's full name"),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter the employee's email")).toBeInTheDocument();
    expect(
      screen.getByText("Enter the employee's phone number"),
    ).toBeInTheDocument();
    expect(screen.getByText("Select a department")).toBeInTheDocument();
    expect(screen.getByText("Enter the job title")).toBeInTheDocument();
    expect(screen.getByText("Pick a hire date")).toBeInTheDocument();
  });

  test("rejects a malformed email address", () => {
    render(<EmployeeForm />);

    typeInto("Full name", "Ada Lovelace");
    typeInto("Email", "not-an-email");
    typeInto("Phone", "+234 801 234 5678");
    typeInto("Department", "Finance");
    typeInto("Job title", "Payroll Analyst");
    typeInto("Hire date", "2024-03-01");
    clickButton("Save");

    expect(
      screen.getByText("Enter a valid email address"),
    ).toBeInTheDocument();
  });

  test("saves a valid employee and navigates back to the list", async () => {
    render(<EmployeeForm />);

    fillValidForm();
    clickButton("Save");

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith("Employee saved"),
    );
    expect(routerPush).toHaveBeenCalledWith("/employees");
  });

  test("shows the status field when editing", () => {
    render(<EmployeeForm mode="edit" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Edit employee" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  test("prefills the form from the initial values when editing", () => {
    render(
      <EmployeeForm
        mode="edit"
        initial={{
          fullName: "Tunde Bakare",
          email: "tunde.bakare@paynest.local",
          phone: "+234 806 444 5566",
          department: "Operations",
          jobTitle: "Operations Manager",
          hireDate: "2019-11-04",
          status: "On Leave",
        }}
      />,
    );

    expect(
      screen.getByLabelText<HTMLInputElement>("Full name").value,
    ).toBe("Tunde Bakare");
    expect(
      screen.getByLabelText<HTMLInputElement>("Email").value,
    ).toBe("tunde.bakare@paynest.local");
    expect(
      screen.getByLabelText<HTMLSelectElement>("Department").value,
    ).toBe("Operations");
    expect(
      screen.getByLabelText<HTMLSelectElement>("Status").value,
    ).toBe("On Leave");
  });
});
