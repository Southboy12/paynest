import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const routerPush = vi.fn();
const routerRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush, refresh: routerRefresh }),
}));

const toastError = vi.fn();
const toastSuccess = vi.fn();
const toastInfo = vi.fn();

vi.mock("sonner", () => ({
  toast: Object.assign((message: string) => toastInfo(message), {
    error: (message: string) => toastError(message),
    success: (message: string) => toastSuccess(message),
  }),
}));

const signIn = vi.fn();
vi.mock("@/lib/auth-client", () => ({
  signIn: { email: (...args: unknown[]) => signIn(...args) },
}));

import { LoginScreen } from "@/components/login-screen";

const VALID_EMAIL = "admin@paynest.local";
const VALID_PASSWORD = "correct-password";

function typeInto(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), {
    target: { value },
  });
}

function clickButton(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}

beforeEach(() => {
  vi.clearAllMocks();
  signIn.mockResolvedValue({ data: null, error: null });
});

describe("LoginScreen", () => {
  test("renders the PayNest login card", () => {
    render(<LoginScreen />);

    expect(
      screen.getByRole("heading", { name: "Sign in to PayNest" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Use demo account" }),
    ).toBeInTheDocument();
  });

  test("shows inline errors for an empty submit", () => {
    render(<LoginScreen />);

    clickButton("Sign in");

    expect(screen.getByText("Enter your email")).toBeInTheDocument();
    expect(screen.getByText("Enter your password")).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });

  test("rejects a malformed email address", () => {
    render(<LoginScreen />);

    typeInto("Email", "not-an-email");
    typeInto("Password", VALID_PASSWORD);
    clickButton("Sign in");

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });

  test("toasts an error on invalid credentials and stays on the page", async () => {
    signIn.mockResolvedValueOnce({
      data: null,
      error: { message: "Invalid email or password" },
    });
    render(<LoginScreen />);

    typeInto("Email", VALID_EMAIL);
    typeInto("Password", "wrong-password");
    clickButton("Sign in");

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Invalid email or password"),
    );
    expect(signIn).toHaveBeenCalledWith({
      email: VALID_EMAIL,
      password: "wrong-password",
    });
    expect(routerPush).not.toHaveBeenCalled();
  });

  test("navigates to the app on a successful sign-in", async () => {
    signIn.mockResolvedValueOnce({
      data: { user: { name: "Super Admin" } },
      error: null,
    });
    render(<LoginScreen />);

    typeInto("Email", VALID_EMAIL);
    typeInto("Password", VALID_PASSWORD);
    clickButton("Sign in");

    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith("Welcome back, Super Admin"),
    );
    expect(routerPush).toHaveBeenCalledWith("/");
    expect(routerRefresh).toHaveBeenCalled();
  });

  test("toggles password visibility", () => {
    render(<LoginScreen />);

    const password = screen.getByLabelText("Password");
    typeInto("Password", "secret");

    expect(password).toHaveAttribute("type", "password");
    clickButton("Show password");
    expect(password).toHaveAttribute("type", "text");
  });

  test("fills the demo account credentials", () => {
    render(<LoginScreen />);

    clickButton("Use demo account");

    expect(screen.getByLabelText("Email")).toHaveValue("admin@paynest.local");
    expect(screen.getByLabelText("Password")).toHaveValue(
      "PayNest-SuperAdm1n-2026!xQ",
    );
  });

  test("announces the password reset feature as coming soon", () => {
    render(<LoginScreen />);

    clickButton("Forgot password?");

    expect(toastInfo).toHaveBeenCalledWith("Password reset is coming soon");
  });
});
