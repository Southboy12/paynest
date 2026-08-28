# Lovable prompt — PayNest design prototype

Copy everything below the line into Lovable as a single prompt.

---

Build a **design-only prototype** of **PayNest**, a payroll and payslip management application for Nigerian companies. This is a UI/UX reference, not a product:

- **Do NOT connect Supabase or any real backend.** No database, no RLS, no API calls. Use hardcoded mock data in local files/constants so every screen renders realistically.
- The login page should exist visually; add a "Demo sign-in" button that navigates straight into the app without any real authentication. A role switcher in the user menu (Super Admin / HR Admin / Payroll Officer / HR Officer / Viewer) can toggle which buttons are visible, to demo the permission-aware UI.
- Use Tailwind CSS + shadcn/ui components only (I will port the design into a Next.js project that uses the same stack).
- Every screen below must exist, be navigable via the sidebar, and be filled with realistic Nigerian demo data (naira amounts, Nigerian names, Lagos addresses). No empty placeholder screens, no "coming soon" text.

## Design language — be precise and consistent

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. Clean lines, restrained color, table-dense where data lives, generous whitespace elsewhere. No playful illustrations.
- **Palette:**
  - Primary: deep green `#0F766E`–`#065F46` range (emerald-700/800). Use for primary buttons, active nav states, key accents.
  - Sidebar: dark (`#0B1220`–`#111827` slate) with light text; active item gets a green pill/background.
  - Content background: `#F8FAFC` neutral; cards white with subtle border (`border-slate-200`) and soft shadow-sm.
  - Status badge colors: Draft = slate, Review = amber, Finalized = green, Active = green, On Leave = blue, Terminated = slate/red-muted, Sent = green, Pending = amber, Failed = red.
- **Typography:** Inter. Page titles ~text-2xl font-semibold; section titles text-lg; table text text-sm; money in tabular-nums, right-aligned.
- **Money formatting:** always Naira with kobo: `₦550,000.00` (use `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })`).
- **Components:** shadcn/ui — sidebar (collapsible to a sheet/hamburger on mobile), cards, tables, dialogs, sheets, dropdown menus, select, date pickers, badges, tabs, toast notifications, skeleton loading states.
- Consistent page header pattern: breadcrumb or title left, primary action button right. Consistent card pattern: white, rounded-xl, border, shadow-sm, header with title + optional action.

## Layout shell

- Dark sidebar: PayNest logotype at top; nav items with icons: Dashboard, Employees, Payroll, Payslips, Audit Log, Settings (Settings shows sub-items: Company, Payslip, Email templates, Payroll rules); user + company footer at bottom.
- Light top bar: page context/company name left, right side: notifications bell with unread dot, user menu (name + role badge, role switcher, Sign out).
- On mobile: sidebar hidden behind hamburger → sheet.

## Screens (all with realistic mock data)

### 1. Login (/login)
Centered card on a subtle gradient/dark background: PayNest logo, "Sign in to PayNest", email + password fields, Sign in button, small footer "Payroll & payslips for Nigerian companies". Include the "Demo sign-in" button.

### 2. Dashboard (/)
Four stat cards with icons: Active employees (8), Draft payroll runs (1), Latest finalized run (August 2026 · Net ₦4,286,500.00), Failed deliveries (1) — each links somewhere. Below: a "Recent payroll runs" mini-table (3 rows: period, status badge, employees, net total) and a "Recent activity" feed (5 audit-style entries with icon, actor, action, time).

### 3. Employees list (/employees)
Toolbar: search input, filter dropdowns (Department, Job title, Status) + clear filters. Table columns: Employee (avatar initials + name + email stacked), Code, Department, Job title, Status badge, Actions (⋯ menu). 8 seeded employees with Nigerian names across Finance/Engineering/Operations/HR, mixed statuses (6 active, 1 on leave, 1 terminated). Top right: "New employee" button. Footer pagination. Show an empty-state variant design somewhere (e.g. when filters match nothing): icon + "No employees match" + reset filters button.

### 4. New/Edit employee (dialog or /employees/new)
Two-column form card: Full name, Email, Phone, Department (select), Job title, Hire date, Status (on edit only) — with inline validation states shown for one invalid example. Save/Cancel buttons.

### 5. Employee detail (/employees/:id)
Header card: avatar initials, name, code chip, department/job, status badge + status change dropdown, contact info. Tabs:
- **Overview:** personal + employment details grid; Bank details card with masked account `****1234` + "Reveal" affordance.
- **Salary history:** table of immutable structures (Effective date, Basic, Housing, Transport, Other, Reason) — 2 versions for this employee; "Add new structure" button opening a dialog with effective date, amounts, reason select (Initial/Review/Promotion).
- **Payslips:** list of this employee's payslips (reference, period, net pay, status).

### 6. Payroll runs list (/payroll)
Filters: Status, Period month. Table: Run (name + period), Status badge, Employees, Gross, Deductions, Net, Finalized date, ⋯ menu (Open, Duplicate, Delete for drafts). "New payroll run" button. Seed 2 runs: July 2026 finalized, August 2026 draft.

### 7. New payroll run (/payroll/new)
Step-like layout in one card: Run name, Period start/end date pickers, Payment date. Employee picker: search + checkbox table of active employees with "Select all" (pre-selected), selection count chip. Subtle amber warning banner: "Another run overlaps this period" (mock). Buttons: Save as draft / Cancel.

### 8. Run detail — preview (/payroll/:id) — the most important screen, make it beautiful
- Header: run name, period, payment date, status badge, workflow buttons depending on status (Draft: Submit for review · Calculate · Delete; Review: Finalize · Back to draft; Finalized: Reopen, disabled editing note "Locked — finalized on 25 Aug 2026 by Adaeze Okafor").
- Totals bar: three big stat tiles — Gross ₦…, Total deductions ₦…, Net pay ₦… (net highlighted in green).
- Entries table: Employee, Gross (right), Deductions (right), Net (right), one-off/override indicator chips, row click → entry drawer.
- **Entry drawer/sheet:** employee header, two-column earnings table and deductions table with per-component amounts, breakdown section: "How PAYE was calculated" — a clean step list (Gross → minus pension → minus NHF → taxable income → relief → band table with per-band amounts → monthly PAYE), and pension/NHF base × rate lines. "Edit amount" opens the override dialog.
- **Override dialog:** component select, original amount (read-only), new amount input, mandatory Reason textarea with helper text "Required for audit trail", Save disabled until reason filled.
- Finalize confirmation dialog: summary counts + "This will lock the run and generate 8 payslips" + Confirm.
- Reopen dialog: mandatory reason textarea.

### 9. Payslips list (/payslips)
Filters by run and delivery status. Table: Reference, Employee, Period, Net pay, Delivery status badge (Sent/Pending/Failed), Actions (View, Download PDF icon, Send/Resend). Seed ~8 rows from the finalized run, one Failed.

### 10. Payslip preview (/payslips/:id) — second most important, make it print-grade
A white A4-styled sheet on a gray backdrop:
- Header: company logo + name + address/phone/TIN left; "PAYSLIP" title, reference `PS-2026-07-0001`, pay period, payment date right — brand-color accent bar.
- Employee block: 2-column grid (Name, Employee code, Department, Job title, Bank masked).
- Two tables side by side: Earnings (Basic ₦450,000.00, Housing ₦120,000.00, Transport ₦60,000.00, …, total) and Deductions (PAYE, Pension, NHF, …, total).
- Summary band: Gross, Total deductions, **Net pay** large and bold, with amount-in-words line ("Four Hundred and Eighty-Six Thousand Naira Only").
- Employer contributions small table (pension employer 10% etc.).
- Footer note from company settings + "This is a system-generated payslip."
- Action bar above the sheet: Download PDF, Send email (opens recipient dialog with editable To: field + template preview), Resend, password chip if password protection is on (`Password: k9#Tq2mV…` with copy button).

### 11. Bulk send dialog (from a finalized run or payslips list)
Employee checkbox list with delivery preview, count summary, Send button → mock progress state (progress bar + per-row status flipping to Sent/Failed), completion summary toast.

### 12. Settings — four tabs
- **Company** (/settings/company): form card (name, registration no, TIN, address, official email, phone) + logo upload area + brand color picker.
- **Payslip** (/settings/payslip): number format input with token chips (`{YYYY}`, `{MM}`, `{SEQ}`) + live sample `PS-2026-08-0001`; footer note textarea.
- **Email templates** (/settings/email): subject + body editors with variable chips (`{{employee_name}}` etc.), live preview card showing the rendered email.
- **Payroll rules** (/settings/rules): current version card showing the PAYE band table (0% up to ₦800k, 15% … 25%), pension 8%, NHF 2.5%, effective-from date; "Create new version" dialog; history list of versions. Badge: "Changes only apply to future runs".

### 13. Audit log (/audit)
Filter row (Entity type, User, Action, Date range). Table: Timestamp, Actor (avatar initials + name), Action badge (employee.updated, payroll.finalized, override.applied…), Target, Reason, Detail expander showing old → new value chips (bank values shown masked). Pagination.

### 14. Notifications
Bell dropdown panel: 5 mock notifications (payroll finalized, payslips generated, bulk send completed, delivery failed, payroll reopened) with icons, unread dots, "Mark all read".

### 15. Viewer-mode demo
With the role switcher set to Viewer: all mutation buttons (New employee, Calculate, Finalize, Send, Save settings) disappear; sensitive Settings tab (Payroll rules) hidden; a subtle read-only indicator in the top bar.

## Strict exclusions

Do not build: real authentication, database/Supabase integration, real email sending, real PDF generation (the Download button can just toast "PDF ready" or open the print dialog), business logic beyond mock interactions, employee-facing portal, reports/charts, WhatsApp, attendance/leave features. Focus 100% on visual polish, consistency, and realistic data presentation.
