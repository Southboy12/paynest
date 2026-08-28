"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search, UserX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEPARTMENTS,
  EMPLOYEE_STATUSES,
  MOCK_EMPLOYEES,
  type MockEmployeeStatus,
} from "@/lib/mock-employees";

const STATUS_STYLES: Record<MockEmployeeStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "On Leave": "bg-blue-100 text-blue-700",
  Terminated: "bg-slate-200 text-slate-600",
};

const PAGE_SIZE = 5;
const ALL = "All";

const JOB_TITLES = Array.from(
  new Set(MOCK_EMPLOYEES.map((e) => e.jobTitle)),
).sort();

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

const selectClass =
  "h-10 cursor-pointer rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function EmployeesList() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [jobTitle, setJobTitle] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return MOCK_EMPLOYEES.filter((employee) => {
      const matchesSearch =
        term === "" ||
        employee.name.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.code.toLowerCase().includes(term);
      const matchesDepartment =
        department === ALL || employee.department === department;
      const matchesJobTitle =
        jobTitle === ALL || employee.jobTitle === jobTitle;
      const matchesStatus = status === ALL || employee.status === status;
      return (
        matchesSearch &&
        matchesDepartment &&
        matchesJobTitle &&
        matchesStatus
      );
    });
  }, [search, department, jobTitle, status]);

  const hasActiveFilters =
    search.trim() !== "" ||
    department !== ALL ||
    jobTitle !== ALL ||
    status !== ALL;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function resetFilters() {
    setSearch("");
    setDepartment(ALL);
    setJobTitle(ALL);
    setStatus(ALL);
    setPage(1);
    setOpenMenu(null);
  }

  function applyFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
    setOpenMenu(null);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Manage employee records and their profiles.
          </p>
        </div>
        <Button asChild variant="brand">
          <Link href="/employees/new">
            <Plus className="size-4" aria-hidden />
            New employee
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or code"
            aria-label="Search employees"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              setOpenMenu(null);
            }}
            className="h-10 pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by department"
            value={department}
            onChange={(e) => applyFilter(setDepartment, e.target.value)}
            className={selectClass}
          >
            <option value={ALL}>All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by job title"
            value={jobTitle}
            onChange={(e) => applyFilter(setJobTitle, e.target.value)}
            className={selectClass}
          >
            <option value={ALL}>All job titles</option>
            {JOB_TITLES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => applyFilter(setStatus, e.target.value)}
            className={selectClass}
          >
            <option value={ALL}>All statuses</option>
            {EMPLOYEE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={() => {
                resetFilters();
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-muted-foreground">
              <UserX className="size-6" aria-hidden />
            </span>
            <div>
              <p className="font-medium">No employees match</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Employee</th>
                    <th className="px-5 py-3 font-medium">Code</th>
                    <th className="px-5 py-3 font-medium">Department</th>
                    <th className="px-5 py-3 font-medium">Job title</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                            {initials(employee.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-card-foreground">
                              {employee.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {employee.code}
                      </td>
                      <td className="px-5 py-3">{employee.department}</td>
                      <td className="px-5 py-3">{employee.jobTitle}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[employee.status]}`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            aria-label={`Actions for ${employee.name}`}
                            aria-expanded={openMenu === employee.id}
                            onClick={() =>
                              setOpenMenu((current) =>
                                current === employee.id
                                  ? null
                                  : employee.id,
                              )
                            }
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          >
                            <MoreHorizontal className="size-4" aria-hidden />
                          </button>
                          {openMenu === employee.id && (
                            <>
                              <button
                                type="button"
                                aria-label="Close actions menu"
                                className="fixed inset-0 z-30 cursor-default"
                                onClick={() => setOpenMenu(null)}
                              />
                              <div
                                role="menu"
                                className="absolute right-0 z-40 mt-1 w-44 rounded-lg border border-border bg-card p-1 shadow-lg"
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    toast(
                                      "Employee profile screen is not implemented yet",
                                    );
                                  }}
                                  className="flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                                >
                                  View profile
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenMenu(null);
                                    toast(
                                      "Editing an employee is not implemented yet",
                                    );
                                  }}
                                  className="flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                                >
                                  Edit
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)}{" "}
                of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
