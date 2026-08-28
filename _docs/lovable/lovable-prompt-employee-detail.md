# Lovable prompt — PayNest employee detail

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the **Employee Detail** page for **PayNest**, a payroll and payslip management application for Nigerian companies. This is a design-only reference — I will port it into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly. It opens from the Employees list ("View profile" on a row's actions menu).

## Hard constraints

- Build ONLY the employee detail page: a header card and three tabs (Overview, Salary history, Payslips). Do NOT build the employees list, the new/edit employee form, or any other screen — a minimal back link to a placeholder list is enough.
- Do NOT connect Supabase or any backend, and do NOT implement real saving. Status changes, "Add new structure", and bank reveal are mock interactions: toggling UI state or showing a toast is fine, nothing persists.
- Use Tailwind CSS + shadcn/ui components only (Button, Input, Label, Select, Table, Badge, Dialog, tabs, toast/sonner).
- Mock data for ONE employee (e.g. Adaeze Okafor, code EMP-001, Chief Financial Officer, Finance). Use realistic Nigerian names and naira amounts formatted with `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })`.

## Design language — be precise

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. Clean lines, table-dense where data lives, generous whitespace elsewhere.
- **Palette:**
  - Primary deep green: `#0F766E`–`#065F46` (emerald-700/800) for accents, active tab underline, and the primary "Add new structure" button.
  - Content background: neutral `#F8FAFC`; cards white with `border-slate-200`, `rounded-xl`, soft `shadow-sm`.
  - Status badge colors: Active = green, On Leave = blue, Terminated = slate/red-muted; Sent = green, Pending = amber, Failed = red.
- **Typography:** Inter. Page title ~text-2xl font-semibold; section titles text-lg; table text text-sm; money right-aligned in tabular-nums.
- **Components:** shadcn/ui — tabs, table, badge, dialog (for "Add new structure"), toast.

## Screen layout

**Back link** top-left: "← Employees".

**1. Header card** (white card, generous padding):
- Large avatar circle with initials (brand green tint).
- Name (text-2xl semibold) with a small code chip beside it (e.g. `EMP-001`, slate-100 pill).
- Department · Job title below (slate-500).
- Contact info line: email · phone.
- Status badge (e.g. Active, green) with a small chevron — clicking opens a dropdown listing Active / On Leave / Terminated. Selecting an item toasts "Status change is not implemented yet" (mock).

**2. Tabs** (underline style, active tab gets a brand-colored bottom border): **Overview** | **Salary history** | **Payslips**.

**Overview tab:**
- Card "Personal & employment details": a 2-column label/value grid — Full name, Employee code, Email, Phone, Department, Job title, Hire date, Status.
- Card "Bank details": Account name, Bank name, and Account number shown MASKED as `****6789` with a "Reveal" button (text link). Clicking "Reveal" swaps to the full account number and shows "Hide" to mask again.

**Salary history tab:**
- Card header: "Salary history" title left, "Add new structure" button (solid emerald) right.
- Table: Effective date | Basic | Housing | Transport | Other | Reason — 2 rows for the employee (e.g. `01 Jan 2024 · Initial` with Basic ₦450,000.00 and a later `Promotion` version with a higher Basic). Money right-aligned, tabular-nums.
- "Add new structure" opens a dialog: Effective date (date input), Basic / Housing / Transport / Other (number inputs), Reason (select: Initial / Review / Promotion), Save (disabled until required fields filled) and Cancel. Save toasts "Structure saved" and closes (mock).

**Payslips tab:**
- Card "Payslips" with a table: Reference (e.g. `PS-2026-08-0001`), Period (e.g. `August 2026`), Net pay (right-aligned), Status badge (Sent / Pending / Failed). 2–3 rows.

## Details that make it beautiful

- Masked values stay masked everywhere until explicitly revealed; the reveal toggle is obvious and reversible.
- Consistent card styling and spacing across the three tabs; the active tab underline is clearly visible.
- Money uses `Intl.NumberFormat("en-NG", NGN)` with kobo decimals; tabular-nums so columns align.
- Dialog is centered with a dimmed backdrop, closes on Cancel, focus stays accessible.
- Fully responsive: header wraps, grids collapse to one column on mobile, tables scroll horizontally rather than breaking.
- WCAG AA contrast on all text; emerald focus-visible outlines (accessibility).

## Exclusions

No employees list, no new/edit employee form, no persistence, no API calls, no real status transitions, no real salary versioning, no payslip preview. Focus 100% on a polished, pixel-perfect detail page with tabs that ports cleanly into Next.js.
