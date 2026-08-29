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

import { PayslipsList } from "@/components/payslips-list";

function table() {
  return within(screen.getByRole("table"));
}

describe("payslips list", () => {
  test("renders the title and all seeded payslips", () => {
    render(<PayslipsList />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Payslips" }),
    ).toBeInTheDocument();
    expect(table().getByText("Adaeze Okafor")).toBeInTheDocument();
    expect(table().getByText("Emeka Obi")).toBeInTheDocument();
    expect(table().getAllByText("Sent").length).toBe(6);
    expect(table().getByText("Pending")).toBeInTheDocument();
    expect(table().getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Showing 8 of 8")).toBeInTheDocument();
  });

  test("filters by delivery status", () => {
    render(<PayslipsList />);

    fireEvent.change(
      screen.getByLabelText("Filter payslips by delivery status"),
      { target: { value: "Failed" } },
    );

    expect(table().getByText("Emeka Obi")).toBeInTheDocument();
    expect(table().queryByText("Adaeze Okafor")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 8")).toBeInTheDocument();
  });

  test("clears filters", () => {
    render(<PayslipsList />);

    fireEvent.change(
      screen.getByLabelText("Filter payslips by delivery status"),
      { target: { value: "Sent" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(screen.getByText("Showing 8 of 8")).toBeInTheDocument();
  });

  test("view action navigates to the payslip preview", () => {
    render(<PayslipsList />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions for PS-2026-08-0001" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "View" }));

    expect(routerPush).toHaveBeenCalledWith("/payslips/emp-001-payslip");
  });

  test("shows resend for a failed payslip", () => {
    render(<PayslipsList />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions for PS-2026-08-0008" }),
    );

    expect(screen.getByRole("menuitem", { name: "Resend" })).toBeInTheDocument();
  });
});
