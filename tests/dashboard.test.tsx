import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import DashboardPage from "@/app/(app)/dashboard/page";

describe("dashboard page", () => {
  test("renders the page title", () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeInTheDocument();
  });

  test("renders the four stat cards", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Active employees")).toBeInTheDocument();
    expect(screen.getByText("Draft payroll runs")).toBeInTheDocument();
    expect(screen.getByText("Latest finalized run")).toBeInTheDocument();
    expect(screen.getByText("Failed deliveries")).toBeInTheDocument();

    expect(screen.getAllByText("8").length).toBeGreaterThan(0);
    expect(screen.getAllByText("August 2026").length).toBeGreaterThan(0);
    expect(screen.getByText("Net ₦4,286,500.00")).toBeInTheDocument();
  });

  test("links stat cards to their modules", () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole("link", { name: /Active employees/ }),
    ).toHaveAttribute("href", "/employees");
    expect(
      screen.getByRole("link", { name: /Draft payroll runs/ }),
    ).toHaveAttribute("href", "/payroll");
    expect(
      screen.getByRole("link", { name: /Failed deliveries/ }),
    ).toHaveAttribute("href", "/payslips");

    expect(screen.getAllByText("View all")).toHaveLength(4);
  });

  test("shows the recent payroll runs with status badges and net totals", () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole("heading", { name: "Recent payroll runs" }),
    ).toBeInTheDocument();

    for (const period of ["August 2026", "July 2026", "June 2026"]) {
      expect(screen.getAllByText(period).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText("Finalized")).toHaveLength(2);
    expect(screen.getAllByText("Draft")).toHaveLength(1);
    expect(screen.getByText("₦4,198,750.00")).toBeInTheDocument();
    expect(screen.getByText("₦4,512,800.00")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "View all runs" }),
    ).toHaveAttribute("href", "/payroll");
  });

  test("lists recent activity entries", () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole("heading", { name: "Recent activity" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Adaeze Okafor")).toBeInTheDocument();
    expect(screen.getByText(/Finalized payroll run/)).toBeInTheDocument();
    expect(screen.getByText(/Bulk send completed/)).toBeInTheDocument();
    expect(screen.getByText(/Delivery failed for PS-2026-08-0004/)).toBeInTheDocument();
    expect(screen.getAllByText("Yesterday").length).toBeGreaterThan(0);
  });
});
