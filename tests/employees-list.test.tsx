import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const toastInfo = vi.fn();
vi.mock("sonner", () => ({
  toast: Object.assign((message: string) => toastInfo(message), {
    error: (message: string) => toastInfo(message),
    success: (message: string) => toastInfo(message),
  }),
}));

const routerPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush }),
}));

import { EmployeesList } from "@/components/employees-list";

function searchEmployees(term: string) {
  fireEvent.change(screen.getByLabelText("Search employees"), {
    target: { value: term },
  });
}

function selectFilter(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe("employees list", () => {
  test("renders the page title, description, and new employee link", () => {
    render(<EmployeesList />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Employees" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New employee" })).toHaveAttribute(
      "href",
      "/employees/new",
    );
    expect(
      screen.getByLabelText("Search employees"),
    ).toBeInTheDocument();
  });

  test("shows the first page of employees with status badges", () => {
    render(<EmployeesList />);

    expect(screen.getByText("Adaeze Okafor")).toBeInTheDocument();
    expect(screen.getByText("Chinedu Adeyemi")).toBeInTheDocument();
    expect(screen.getByText("Tunde Bakare")).toBeInTheDocument();
    expect(screen.getByText("Ngozi Eze")).toBeInTheDocument();
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("On Leave").length).toBeGreaterThan(0);
    expect(screen.getByText("Showing 1–5 of 8")).toBeInTheDocument();
  });

  test("paginates through the list", () => {
    render(<EmployeesList />);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Showing 6–8 of 8")).toBeInTheDocument();
    expect(screen.getByText("Emeka Obi")).toBeInTheDocument();
    expect(screen.queryByText("Adaeze Okafor")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByText("Showing 1–5 of 8")).toBeInTheDocument();
    expect(screen.getByText("Adaeze Okafor")).toBeInTheDocument();
  });

  test("filters by department", () => {
    render(<EmployeesList />);

    selectFilter("Filter by department", "Finance");

    expect(screen.getByText("Adaeze Okafor")).toBeInTheDocument();
    expect(screen.getByText("Amara Osei")).toBeInTheDocument();
    expect(screen.queryByText("Chinedu Adeyemi")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1–3 of 3")).toBeInTheDocument();
  });

  test("filters by status", () => {
    render(<EmployeesList />);

    selectFilter("Filter by status", "Terminated");

    expect(screen.getByText("Emeka Obi")).toBeInTheDocument();
    expect(screen.queryByText("Adaeze Okafor")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1–1 of 1")).toBeInTheDocument();
  });

  test("filters by job title", () => {
    render(<EmployeesList />);

    selectFilter("Filter by job title", "HR Officer");

    expect(screen.getByText("Ibrahim Musa")).toBeInTheDocument();
    expect(screen.getByText("Showing 1–1 of 1")).toBeInTheDocument();
  });

  test("searches by name", () => {
    render(<EmployeesList />);

    searchEmployees("fatima");

    expect(screen.getByText("Fatima Bello")).toBeInTheDocument();
    expect(screen.queryByText("Chinedu Adeyemi")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1–1 of 1")).toBeInTheDocument();
  });

  test("shows the empty state and resets filters", () => {
    render(<EmployeesList />);

    searchEmployees("zzz-not-a-person");

    expect(screen.getByText("No employees match")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset filters" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));

    expect(screen.getByText("Showing 1–5 of 8")).toBeInTheDocument();
    expect(
      screen.getByLabelText<HTMLInputElement>("Search employees").value,
    ).toBe("");
  });

  test("opens the row actions menu", () => {
    render(<EmployeesList />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions for Adaeze Okafor" }),
    );

    expect(
      screen.getByRole("menuitem", { name: "View profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Edit" }),
    ).toBeInTheDocument();
  });

  test("edit action navigates to the edit route", () => {
    render(<EmployeesList />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions for Adaeze Okafor" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(routerPush).toHaveBeenCalledWith("/employees/emp-001/edit");
  });
});
