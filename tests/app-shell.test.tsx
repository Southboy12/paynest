import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi, describe } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

import { usePathname } from "next/navigation";

import AppLayout from "@/app/(app)/layout";
import AuditPage from "@/app/(app)/audit/page";
import DashboardPage from "@/app/(app)/dashboard/page";
import EmployeesPage from "@/app/(app)/employees/page";
import PayrollPage from "@/app/(app)/payroll/page";
import PayslipsPage from "@/app/(app)/payslips/page";
import SettingsPage from "@/app/(app)/settings/page";
import { NAV_ITEMS, NavLinks } from "@/components/nav-links";

function setPathname(pathname: string) {
  vi.mocked(usePathname).mockReturnValue(pathname);
}

beforeEach(() => {
  setPathname("/");
});

const MODULE_PAGES = [
  { name: "Dashboard", Page: DashboardPage },
  { name: "Employees", Page: EmployeesPage },
  { name: "Payroll", Page: PayrollPage },
  { name: "Payslips", Page: PayslipsPage },
  { name: "Settings", Page: SettingsPage },
  { name: "Audit Log", Page: AuditPage },
];

describe("module placeholder pages", () => {
  test.each(MODULE_PAGES)(
    "$name page renders its title and a description",
    ({ name, Page }) => {
      render(<Page />);
      const heading = screen.getByRole("heading", { level: 1, name });
      expect(heading).toBeInTheDocument();
      expect(heading.nextElementSibling).not.toBeEmptyDOMElement();
    },
  );
});

describe("sidebar navigation", () => {
  test("renders a link for every module", () => {
    render(<NavLinks />);
    for (const item of NAV_ITEMS) {
      expect(
        screen.getByRole("link", { name: item.label }),
      ).toHaveAttribute("href", item.href);
    }
  });

  test("covers all module routes", () => {
    expect(NAV_ITEMS.map((item) => item.href)).toEqual([
      "/dashboard",
      "/employees",
      "/payroll",
      "/payslips",
      "/settings",
      "/audit",
    ]);
  });

  test("highlights the current route", () => {
    setPathname("/payroll");
    render(<NavLinks />);

    expect(screen.getByRole("link", { name: "Payroll" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Dashboard" }),
    ).not.toHaveAttribute("aria-current");
  });
});

describe("app layout", () => {
  test("renders top bar, sidebar, and page content", () => {
    setPathname("/dashboard");
    render(
      <AppLayout>
        <p>Main content</p>
      </AppLayout>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("PayNest").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Dashboard" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("provides a toggle for narrow screens", () => {
    render(
      <AppLayout>
        <p>Main content</p>
      </AppLayout>,
    );

    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toBeInTheDocument();
  });
});
