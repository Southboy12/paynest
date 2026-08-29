# Lovable prompt — PayNest new payroll run

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the **New payroll run** screen for **PayNest**, a payroll and payslip management application for Nigerian companies. This is a design-only reference — I will port it into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly. It opens from the payroll runs list ("New payroll run" button).

## Hard constraints

- Build ONLY the new payroll run screen. No list, no run detail, no other screens — a minimal back link to a placeholder list is enough.
- Do NOT connect Supabase or any backend; Save as draft just toasts "Draft saved" (mock), nothing persists.
- Use Tailwind CSS + shadcn/ui components only (Input, Label, Button, Checkbox, Select/DatePicker, Badge, toast/sonner).
- Mock data: 8 active employees with Nigerian names.

## Design language — be precise

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. Clean, structured form.
- **Palette:** primary deep green `#0F766E`–`#065F46` for the primary "Save as draft" button and focus rings; content background `#F8FAFC`; white cards with `border-slate-200`, `rounded-xl`, `shadow-sm`.
- **Typography:** Inter. Page title ~text-2xl font-semibold; labels text-sm slate-700; helper text text-xs slate-500.

## Screen layout

**Back link** top-left: "← Payroll runs". **Title:** "New payroll run".

**1. Run details card** (two-column grid):
- Run name (text input, placeholder "August 2026")
- Period start (date picker) and Period end (date picker)
- Payment date (date picker)

**2. Amber warning banner** (below run details, only when the chosen period overlaps a mock existing run): amber background, warning icon, text "Another run overlaps this period".

**3. Employee picker card:**
- Header: "Employees" title left; selection count chip right (e.g. "8 selected").
- Search input (filters the list).
- Table of active employees with a leading checkbox column and a "Select all" checkbox in the header (all 8 pre-selected). Columns: checkbox, Employee (avatar initials + name + email stacked), Department, Job title.
- The selection count chip updates live.

**4. Footer actions** (right-aligned): Cancel (outline) and **Save as draft** (solid emerald, loading state then toast "Draft saved").

## Details that make it beautiful

- Checkbox hover/focus states; the select-all reflects partial selection correctly.
- Money never appears on this screen.
- Fully responsive: grids collapse to one column on mobile.
- WCAG AA contrast; emerald focus-visible outlines.

## Exclusions

No real run creation, no overlap validation logic, no calculation, no persistence, no API calls. Focus 100% on a clean, pixel-perfect form with a live employee picker.
