# Lovable prompt — PayNest payroll runs list

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the **Payroll runs list** for **PayNest**, a payroll and payslip management application for Nigerian companies. This is a design-only reference — I will port it into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly. It is the "/payroll" screen reachable from the sidebar.

## Hard constraints

- Build ONLY the payroll runs list. No run creation, no run detail, no other screens — row actions may navigate to a minimal blank placeholder.
- Do NOT connect Supabase or any backend. All data is hardcoded mock data in local constants.
- Use Tailwind CSS + shadcn/ui components only (Input, Select, Button, Table, Badge, DropdownMenu, toast/sonner).
- Money uses `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })`, right-aligned, tabular-nums.

## Design language — be precise

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. Table-dense where data lives.
- **Palette:** primary deep green `#0F766E`–`#065F46` for the primary "New payroll run" button and focus rings; content background `#F8FAFC`; white cards with `border-slate-200`, `rounded-xl`, `shadow-sm`. Status badges: Draft = slate, Review = amber, Finalized = green.
- **Typography:** Inter. Page title ~text-2xl font-semibold; table text text-sm; money tabular-nums.

## Screen layout

**Page header:** title "Payroll runs" left, "New payroll run" button (solid emerald, plus icon) right.

**Filter row** (white card): Status select (All statuses / Draft / Review / Finalized) and Period month select (All periods / Jul 2026 / Aug 2026) — right side.

**Table** (white card):
- Columns: **Run** (name + period stacked, e.g. "August 2026" over "Period: 01–31 Aug 2026"), **Status** badge, **Employees**, **Gross** (right), **Deductions** (right), **Net** (right), **Finalized date**, and a ⋯ actions menu (Open, Duplicate, Delete-for-drafts-only).
- Seed 3 runs: **August 2026** (Draft), **July 2026** (Finalized, finalized 25 Jul 2026), **June 2026** (Draft). Realistic naira totals (e.g. Gross ₦4,500,000.00 · Deductions ₦213,500.00 · Net ₦4,286,500.00).
- Footer: "Showing X of Y" + pagination (single page is fine).

## Details that make it beautiful

- Draft runs show Duplicate + Delete in the menu; Finalized runs show Open only (or Open + a disabled note) — never show Delete on a finalized run.
- Row hover states; consistent iconography (lucide); money columns perfectly right-aligned.
- Responsive: table scrolls horizontally on small screens, filter row wraps.
- WCAG AA contrast; emerald focus-visible outlines.

## Exclusions

No run creation, no run detail/preview, no calculation, no workflow logic, no persistence, no API calls. Focus 100% on a clean, dense, pixel-perfect list.
