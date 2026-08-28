# Lovable prompt — PayNest new/edit employee form

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the **New/Edit Employee** form for **PayNest**, a payroll and payslip management application for Nigerian companies. This is a design-only reference — I will port it into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly. It opens from the Employees list ("New employee" button) and, in edit mode, from an employee's row actions.

## Hard constraints

- Build ONLY the new/edit employee form. Do NOT build the employees list, the employee detail page, or any other screen — a minimal back link to a placeholder list is enough.
- Do NOT connect Supabase or any backend, and do NOT implement real saving. The Save button can toast "Employee saved" and navigate back; nothing is persisted.
- Use Tailwind CSS + shadcn/ui components only (Input, Label, Select, Button, Card, toast/sonner).
- The form is a **two-column card** (single column on mobile), comfortable padding, consistent with the PayNest design system below.
- Fields, in order: Full name, Email, Phone, Department (select), Job title, Hire date, and Status (select — shown ONLY when editing, never when creating).
- Show inline validation states: submit with empty fields shows field-level errors in red under each input, with a red border on the invalid input.

## Design language — be precise

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. Clean lines, restrained color, generous whitespace. No playful illustrations.
- **Palette:**
  - Primary deep green: `#0F766E`–`#065F46` (emerald-700/800) for the Save button and focus rings.
  - Content background: neutral `#F8FAFC`; the form card is white with `border-slate-200`, `rounded-xl`, soft `shadow-sm`.
  - Field labels: slate-700 `text-sm font-medium`; helper/error text: red-600 `text-xs`.
- **Typography:** Inter. Page title ~text-2xl font-semibold; labels text-sm; inputs ~h-10.
- **Components:** shadcn/ui — Card, Input, Label, Select (native-style options fine), Button (Save = solid emerald, Cancel = outline), sonner toast for the save confirmation.

## Screen layout

A page header on the neutral background: back link to the Employees list ("← Employees") top-left, then:

- **Title:** "New employee" (or "Edit employee" when editing).
- **Form card** (max-w-2xl, centered), two-column grid (`grid-cols-1 sm:grid-cols-2`, `gap-4`):
  1. Full name — text input, placeholder e.g. `Ada Lovelace`
  2. Email — email input, placeholder `you@company.com`
  3. Phone — text/tel input, placeholder `+234 801 234 5678`
  4. Department — select with options Finance, Engineering, Operations, HR (placeholder "Select department")
  5. Job title — text input, placeholder e.g. `Payroll Analyst`
  6. Hire date — date input
  7. Status — select (Active / On Leave / Terminated) — **edit mode only**, rendered as the last field
- **Footer actions** (right-aligned below the card): Cancel (outline) and Save (solid emerald). Save toasts "Employee saved" then navigates back to the list.

## Details that make it beautiful

- Inline validation on submit: empty required fields show "Enter …"/"Select …" errors; an invalid email shows "Enter a valid email address".
- Focus-visible states: emerald ring on inputs and selects (accessibility).
- The Status select is clearly absent in create mode — never show it with a hidden/disabled trick.
- Fully responsive: the card stacks to one column on small screens, no horizontal scroll.
- WCAG AA contrast on all text.

## Exclusions

No list screen, no employee detail, no persistence, no API calls, no duplicate-email checks, no real authentication. Focus 100% on a pixel-perfect, accessible form card that ports cleanly into Next.js.
