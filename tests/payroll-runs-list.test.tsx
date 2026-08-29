import { fireEvent, render, screen, within } from "@testing-library/react";
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

import { PayrollRunsList } from "@/components/payroll-runs-list";

function table() {
  return within(screen.getByRole("table"));
}

describe("payroll runs list", () => {
  test("renders the title and new payroll run link", () => {
    render(<PayrollRunsList />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Payroll runs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "New payroll run" }),
    ).toHaveAttribute("href", "/payroll/new");
  });

  test("shows the seeded runs with statuses and naira totals", () => {
    render(<PayrollRunsList />);

    expect(table().getByText("August 2026")).toBeInTheDocument();
    expect(table().getByText("July 2026")).toBeInTheDocument();
    expect(table().getAllByText("Draft").length).toBe(2);
    expect(table().getByText("Finalized")).toBeInTheDocument();
    expect(table().getByText("25 Jul 2026")).toBeInTheDocument();
    expect(table().getAllByText("₦5,040,000.00").length).toBe(3);
  });

  test("filters by status", () => {
    render(<PayrollRunsList />);

    fireEvent.change(screen.getByLabelText("Filter runs by status"), {
      target: { value: "Finalized" },
    });

    expect(table().getByText("July 2026")).toBeInTheDocument();
    expect(table().queryByText("August 2026")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 3")).toBeInTheDocument();
  });

  test("filters by period and clears filters", () => {
    render(<PayrollRunsList />);

    fireEvent.change(screen.getByLabelText("Filter runs by period"), {
      target: { value: "August 2026" },
    });

    expect(table().getByText("August 2026")).toBeInTheDocument();
    expect(table().queryByText("July 2026")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(table().getByText("July 2026")).toBeInTheDocument();
  });

  test("opens a run from its name", () => {
    render(<PayrollRunsList />);

    fireEvent.click(table().getByText("July 2026"));

    expect(routerPush).toHaveBeenCalledWith("/payroll/run-2026-07");
  });

  test("shows draft-only actions for drafts but not finalized runs", () => {
    render(<PayrollRunsList />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions for August 2026" }),
    );
    expect(
      screen.getByRole("menuitem", { name: "Open" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Duplicate" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Delete" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Close actions menu" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Actions for July 2026" }),
    );
    expect(
      screen.getByRole("menuitem", { name: "Open" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  test("open action navigates to the run detail", () => {
    render(<PayrollRunsList />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions for August 2026" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Open" }));

    expect(routerPush).toHaveBeenCalledWith("/payroll/run-2026-08");
  });
});
