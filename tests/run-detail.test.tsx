import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const toastInfo = vi.fn();
const toastSuccess = vi.fn();
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

import { RunDetail } from "@/components/run-detail";
import {
  getMockPayrollRuns,
  getMockRunEntries,
  type MockPayrollRun,
} from "@/lib/mock-payroll-runs";

function runById(id: string): MockPayrollRun {
  const run = getMockPayrollRuns().find((r) => r.id === id);
  if (!run) throw new Error(`missing run ${id}`);
  return run;
}

function entriesFor(runId: string) {
  return getMockRunEntries(runId);
}

function reviewRun(): MockPayrollRun {
  const base = runById("run-2026-08");
  return { ...base, status: "Review" };
}

describe("run detail", () => {
  test("shows the header, locked note, and reopen for a finalized run", () => {
    render(<RunDetail run={runById("run-2026-07")} entries={entriesFor("run-2026-07")} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "July 2026" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Finalized")).toBeInTheDocument();
    expect(
      screen.getByText("Locked — finalized on 25 Jul 2026 by Adaeze Okafor"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reopen" }),
    ).toBeInTheDocument();
  });

  test("shows draft workflow buttons for a draft run", () => {
    render(<RunDetail run={runById("run-2026-08")} entries={entriesFor("run-2026-08")} />);

    expect(
      screen.getByRole("button", { name: "Submit for review" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Calculate" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  test("renders the totals bar and entries table", () => {
    const run = runById("run-2026-08");
    render(<RunDetail run={run} entries={entriesFor("run-2026-08")} />);

    expect(screen.getAllByText("Gross").length).toBeGreaterThan(0);
    expect(screen.getByText("Total deductions")).toBeInTheDocument();
    expect(screen.getByText("Net pay")).toBeInTheDocument();
    expect(screen.getByText(format(run.grossKobo))).toBeInTheDocument();

    const table = within(screen.getByRole("table"));
    expect(table.getByText("Adaeze Okafor")).toBeInTheDocument();
    expect(table.getByText("Chinedu Adeyemi")).toBeInTheDocument();
    expect(table.getByText("Override")).toBeInTheDocument();
    expect(table.getByText("One-off")).toBeInTheDocument();
  });

  test("opens the entry drawer with the PAYE breakdown", () => {
    render(<RunDetail run={runById("run-2026-08")} entries={entriesFor("run-2026-08")} />);

    fireEvent.click(screen.getByText("Adaeze Okafor"));

    expect(
      screen.getByText("How PAYE was calculated"),
    ).toBeInTheDocument();
    expect(screen.getByText("Monthly PAYE:")).toBeInTheDocument();
    expect(screen.getByText("Edit amount")).toBeInTheDocument();
  });

  test("override dialog requires a reason before saving", async () => {
    render(<RunDetail run={runById("run-2026-08")} entries={entriesFor("run-2026-08")} />);

    fireEvent.click(screen.getByText("Adaeze Okafor"));
    fireEvent.click(screen.getByText("Edit amount"));

    expect(
      screen.getByRole("heading", { name: "Override amount" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Required for audit trail")).toBeInTheDocument();

    const save = screen.getByRole("button", { name: "Save" });
    expect((save as HTMLButtonElement).disabled).toBe(true);

    fireEvent.change(screen.getByLabelText("Component"), {
      target: { value: "Basic" },
    });
    fireEvent.change(screen.getByLabelText("New amount (₦)"), {
      target: { value: "480000" },
    });
    fireEvent.change(screen.getByLabelText("Reason"), {
      target: { value: "Housing market adjustment" },
    });

    expect(
      (screen.getByLabelText("Original amount") as HTMLInputElement).value,
    ).toBe(format(45_000_000));
    expect((save as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(save);
    await vi.waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith("Override applied"),
    );
  });

  test("finalize dialog summarises the run and warns about locking", () => {
    render(<RunDetail run={reviewRun()} entries={entriesFor("run-2026-08")} />);

    fireEvent.click(screen.getByRole("button", { name: "Finalize" }));

    expect(
      screen.getByRole("heading", { name: "Finalize payroll run" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This will lock the run and generate 8 payslips/),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(toastSuccess).toHaveBeenCalledWith("Run finalized (mock)");
  });

  test("reopen dialog requires a reason", () => {
    render(<RunDetail run={runById("run-2026-07")} entries={entriesFor("run-2026-07")} />);

    fireEvent.click(screen.getByRole("button", { name: "Reopen" }));

    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect((confirm as HTMLButtonElement).disabled).toBe(true);

    fireEvent.change(screen.getByLabelText("Reason"), {
      target: { value: "Correcting a payslip error" },
    });
    expect((confirm as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(confirm);
    expect(toastSuccess).toHaveBeenCalledWith("Run reopened (mock)");
  });
});

function format(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(kobo / 100);
}
