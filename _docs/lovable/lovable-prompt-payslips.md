# Lovable prompt — PayNest payslips list

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the **Payslips list** for **PayNest**, a payroll and payslip management application for Nigerian companies. This is a design-only reference — I will port it into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly. It is the "/payslips" screen reachable from the sidebar.

## Hard constraints

- Build ONLY the payslips list. No payslip preview, no sending flows, no other screens — row actions may toast or go to a minimal blank placeholder.
- Do NOT connect Supabase or any backend. All data is hardcoded mock data in local constants.
- Use Tailwind CSS + shadcn/ui components only (Input, Select, Button, Table, Badge, DropdownMenu, toast/sonner).
- Money uses `Intl.NumberFormat("en-NG", NGN)`, right-aligned, tabular-nums.

## Design language — be precise

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. Table-dense.
- **Palette:** primary deep green `#0F766E`–`#065F46` for focus rings and accents; content background `#F8FAFC`; white cards `border-slate-200` `rounded-xl` `shadow-sm`. Delivery badges: Sent = green, Pending = amber, Failed = red.
- **Typography:** Inter. Page title text-2xl semibold; table text-sm; money tabular-nums.

## Screen layout

**Page header:** title "Payslips" left.

**Filter row** (white card): Run select (All runs / August 2026 / July 2026) and Delivery status select (All statuses / Sent / Pending / Failed).

**Table** (white card):
- Columns: **Reference** (e.g. `PS-2026-08-0001`), **Employee** (avatar initials + name + email stacked), **Period**, **Net pay** (right), **Delivery status** badge, **Actions** (⋯ menu: View, Download PDF icon, Send/Resend).
- Seed ~8 rows from a finalized August 2026 run (all 8 employees), 6 Sent, 1 Pending, 1 Failed (red). Nigerian names, naira net pay.
- Footer: "Showing X of Y" + pagination.

## Details that make it beautiful

- Row hover states; the failed row's badge clearly stands out.
- Consistent iconography; money columns perfectly right-aligned.
- Responsive: table scrolls horizontally on small screens, filter row wraps.
- WCAG AA contrast; emerald focus-visible outlines.

## Exclusions

No payslip preview sheet, no real sending, no PDF, no persistence, no API calls. Focus 100% on a clean, dense, pixel-perfect list.
