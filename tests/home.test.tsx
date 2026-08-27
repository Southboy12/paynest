import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "@/app/page";

test("home page renders the product name", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { level: 1 }),
  ).toHaveTextContent("PayNest");
});

test("home page describes the product", () => {
  render(<Home />);
  expect(
    screen.getByText(/payroll and payslip management/i),
  ).toBeInTheDocument();
});
