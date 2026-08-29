# Lovable prompt — PayNest payroll run detail (preview)

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the **Payroll Run Detail / Preview** for **PayNest**, a payroll and payslip management application for Nigerian companies. This is the MOST IMPORTANT screen — make it beautiful. Design-only reference ported into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly.

## Hard constraints

- Build ONLY the run detail screen: header, totals bar, entries table, entry drawer, override dialog, finalize and reopen dialogs. No list, no creation, no other screens — a back link to a placeholder list is enough.
- Do NOT connect Supabase or any backend; all interactions are mock (toasts, local UI state), nothing persists.
- Use Tailwind CSS + shadcn/ui components only (Button, Table, Badge, Dialog, Sheet, Select, Input, Label, Textarea, toast/sonner).
- Money uses `Intl.NumberFormat("en-NG", NGN)`, right-aligned, tabular-nums.

## Design language — be precise

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. Rich but restrained.
- **Palette:** primary deep green `#0F766E`–`#065F46`; content background `#F8FAFC`; white cards `border-slate-200` `rounded-xl` `shadow-sm`. Status: Draft = slate, Review = amber, Finalized = green. Net pay highlighted in green.
- **Typography:** Inter. Page title text-2xl semibold; totals text-2xl/3xl; table text-sm; money tabular-nums.

## Screen layout

**Back link:** "← Payroll runs".

**1. Header card:**
- Run name (title), period + payment date line (slate-500), status badge.
- Workflow buttons per status (mock): Draft → "Submit for review", "Calculate", "Delete". Review → "Finalize", "Back to draft". Finalized → "Reopen" and a note "Locked — finalized on 25 Aug 2026 by Adaeze Okafor" (inputs/tables disabled-looking).
- Delete / Reopen open confirmation dialogs.

**2. Totals bar** (three stat tiles): **Gross** ₦…, **Total deductions** ₦…, **Net pay** ₦… (net highlighted in green, largest).

**3. Entries table:** columns Employee (avatar initials + name + email), Gross (right), Deductions (right), Net (right), and small chips for one-off/override entries. Row click opens the **entry drawer**.

**Entry drawer** (right sheet): employee header (avatar, name, code), then:
- Two-column **earnings** table and **deductions** table with per-component amounts + totals.
- "How PAYE was calculated" breakdown: a clean step list — Gross → minus pension → minus NHF → taxable income → minus relief → band table (per-band rate and amount) → **monthly PAYE**; plus pension/NHF base × rate lines.
- "Edit amount" button opens the **override dialog**.

**Override dialog:** component select, original amount (read-only), new amount input, mandatory **Reason** textarea with helper "Required for audit trail". Save disabled until the reason is filled.

**Finalize confirmation dialog:** summary (run name, employee count, net total) + warning "This will lock the run and generate 8 payslips" + Confirm/Cancel.

**Reopen dialog:** mandatory reason textarea + Confirm/Cancel.

## Details that make it beautiful

- Consistent, well-spaced dialogs with dimmed backdrops; the entry drawer feels premium.
- The PAYE breakdown is the star: present it as a clean, scannable calculation card.
- Disabled/locked styling for finalized runs is obvious but tasteful.
- Fully responsive; tables scroll horizontally.
- WCAG AA contrast; emerald focus-visible outlines.

## Exclusions

No real calculation, no real overrides, no workflow persistence, no payslip generation, no API calls. Focus 100% on a stunning, pixel-perfect preview with working mock dialogs.
