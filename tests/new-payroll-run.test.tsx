import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const toastSuccess = vi.fn();
const toastInfo = vi.fn();
vi.mock("sonner", () => ({
  toast: Object.assign((message: string) => toastInfo(message), {
    error: (message: string) => toastInfo(message),
    success: (message: string) => toastSuccess(message),
  }),
}));

const routerPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush }),
}));

import { NewPayrollRun } from "@/components/new-payroll-run";

const ACTIVE_COUNT = 6;

function table() {
  return within(screen.getByRole("table"));
}

describe("new payroll run", () => {
  test("renders run details fields and employee picker", () => {
    render(<NewPayrollRun />);

    expect(
      screen.getByRole("heading", { level: 1, name: "New payroll run" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Run name")).toBeInTheDocument();
    expect(screen.getByLabelText("Period start")).toBeInTheDocument();
    expect(screen.getByLabelText("Period end")).toBeInTheDocument();
    expect(screen.getByLabelText("Payment date")).toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText(`${ACTIVE_COUNT} selected`)).toBeInTheDocument();
  });

  test("pre-selects all active employees and lists only active ones", () => {
    render(<NewPayrollRun />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(ACTIVE_COUNT + 1); // + select all
    expect(
      (screen.getByLabelText("Select all") as HTMLInputElement).checked,
    ).toBe(true);
    expect(table().getByText("Adaeze Okafor")).toBeInTheDocument();
    expect(table().queryByText("Emeka Obi")).not.toBeInTheDocument();
  });

  test("updates the selection count when unchecking an employee", () => {
    render(<NewPayrollRun />);

    fireEvent.click(screen.getByLabelText("Select Adaeze Okafor"));
    fireEvent.click(screen.getByLabelText("Select Chinedu Adeyemi"));

    expect(screen.getByText(`${ACTIVE_COUNT - 2} selected`)).toBeInTheDocument();
  });

  test("filters the picker by search", () => {
    render(<NewPayrollRun />);

    fireEvent.change(screen.getByLabelText("Search run employees"), {
      target: { value: "Fatima" },
    });

    expect(table().getByText("Fatima Bello")).toBeInTheDocument();
    expect(table().queryByText("Adaeze Okafor")).not.toBeInTheDocument();
  });

  test("shows the overlap warning for a period that overlaps a seeded run", () => {
    render(<NewPayrollRun />);

    expect(screen.queryByText("Another run overlaps this period")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Period start"), {
      target: { value: "2026-08-01" },
    });
    fireEvent.change(screen.getByLabelText("Period end"), {
      target: { value: "2026-08-31" },
    });

    expect(
      screen.getByText("Another run overlaps this period"),
    ).toBeInTheDocument();
  });

  test("saves as draft and navigates back to the payroll list", async () => {
    render(<NewPayrollRun />);

    fireEvent.change(screen.getByLabelText("Run name"), {
      target: { value: "September 2026" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save as draft" }));

    await vi.waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith("Draft saved"),
    );
    expect(routerPush).toHaveBeenCalledWith("/payroll");
  });

  test("cancel links back to the payroll list", () => {
    render(<NewPayrollRun />);

    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/payroll",
    );
  });
});
