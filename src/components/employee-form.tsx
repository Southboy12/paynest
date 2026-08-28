"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS, EMPLOYEE_STATUSES } from "@/lib/mock-employees";
import { cn } from "@/lib/utils";

type FormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  hireDate?: string;
};

const selectClass =
  "h-10 cursor-pointer rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export type EmployeeFormValues = {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  status: string;
};

export function EmployeeForm({
  mode = "new",
  initial,
}: {
  mode?: "new" | "edit";
  initial?: Partial<EmployeeFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<EmployeeFormValues>({
    fullName: initial?.fullName ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    department: initial?.department ?? "",
    jobTitle: initial?.jobTitle ?? "",
    hireDate: initial?.hireDate ?? "",
    status: initial?.status ?? "Active",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  function setValue(key: keyof EmployeeFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!values.fullName.trim())
      next.fullName = "Enter the employee's full name";
    if (!values.email.trim()) next.email = "Enter the employee's email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address";
    if (!values.phone.trim())
      next.phone = "Enter the employee's phone number";
    if (!values.department) next.department = "Select a department";
    if (!values.jobTitle.trim()) next.jobTitle = "Enter the job title";
    if (!values.hireDate) next.hireDate = "Pick a hire date";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSaving(false);
    toast.success(mode === "edit" ? "Employee updated" : "Employee saved");
    router.push("/employees");
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          href="/employees"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Employees
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {mode === "edit" ? "Edit employee" : "New employee"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Add an employee and their employment details.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-medium text-label">
              Full name
            </Label>
            <Input
              id="fullName"
              placeholder="Ada Lovelace"
              value={values.fullName}
              onChange={(e) => setValue("fullName", e.target.value)}
              aria-invalid={!!errors.fullName}
              className={cn("h-10", errors.fullName && "border-destructive")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-label">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={(e) => setValue("email", e.target.value)}
              aria-invalid={!!errors.email}
              className={cn("h-10", errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-label">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+234 801 234 5678"
              value={values.phone}
              onChange={(e) => setValue("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              className={cn("h-10", errors.phone && "border-destructive")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="department"
              className="text-sm font-medium text-label"
            >
              Department
            </Label>
            <select
              id="department"
              value={values.department}
              onChange={(e) => setValue("department", e.target.value)}
              aria-invalid={!!errors.department}
              className={cn(selectClass, "w-full", errors.department && "border-destructive")}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-xs text-destructive">{errors.department}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="jobTitle"
              className="text-sm font-medium text-label"
            >
              Job title
            </Label>
            <Input
              id="jobTitle"
              placeholder="Payroll Analyst"
              value={values.jobTitle}
              onChange={(e) => setValue("jobTitle", e.target.value)}
              aria-invalid={!!errors.jobTitle}
              className={cn("h-10", errors.jobTitle && "border-destructive")}
            />
            {errors.jobTitle && (
              <p className="text-xs text-destructive">{errors.jobTitle}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="hireDate"
              className="text-sm font-medium text-label"
            >
              Hire date
            </Label>
            <Input
              id="hireDate"
              type="date"
              value={values.hireDate}
              onChange={(e) => setValue("hireDate", e.target.value)}
              aria-invalid={!!errors.hireDate}
              className={cn("h-10", errors.hireDate && "border-destructive")}
            />
            {errors.hireDate && (
              <p className="text-xs text-destructive">{errors.hireDate}</p>
            )}
          </div>

          {mode === "edit" && (
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-sm font-medium text-label">
                Status
              </Label>
              <select
                id="status"
                value={values.status}
                onChange={(e) => setValue("status", e.target.value)}
                className={cn(selectClass, "w-full")}
              >
                {EMPLOYEE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/employees">Cancel</Link>
          </Button>
          <Button type="submit" variant="brand" disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </section>
  );
}
