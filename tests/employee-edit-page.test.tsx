import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
}));

import EditEmployeePage from "@/app/(app)/employees/[id]/edit/page";

describe("edit employee page", () => {
  test("prefills the form from the employee record", async () => {
    const element = await EditEmployeePage({
      params: Promise.resolve({ id: "emp-001" }),
    });
    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: "Edit employee" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText<HTMLInputElement>("Full name").value,
    ).toBe("Adaeze Okafor");
    expect(
      screen.getByLabelText<HTMLInputElement>("Email").value,
    ).toBe("adaeze.okafor@paynest.local");
    expect(
      screen.getByLabelText<HTMLSelectElement>("Department").value,
    ).toBe("Finance");
    expect(
      screen.getByLabelText<HTMLSelectElement>("Status").value,
    ).toBe("Active");
  });

  test("renders the status field in edit mode", async () => {
    const element = await EditEmployeePage({
      params: Promise.resolve({ id: "emp-004" }),
    });
    render(element);

    expect(
      screen.getByLabelText<HTMLInputElement>("Full name").value,
    ).toBe("Tunde Bakare");
    expect(
      screen.getByLabelText<HTMLSelectElement>("Status").value,
    ).toBe("On Leave");
  });
});
