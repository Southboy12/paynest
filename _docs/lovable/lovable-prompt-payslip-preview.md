# Lovable prompt — PayNest payslip preview

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the **Payslip preview** for **PayNest**, a payroll and payslip management application for Nigerian companies. This is the second most important screen — make it print-grade. Design-only reference ported into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly.

## Hard constraints

- Build ONLY the payslip preview: an action bar and a white A4-styled sheet on a gray backdrop. No list, no sending flows, no other screens — a back link to a placeholder list is enough.
- Do NOT connect Supabase or any backend; Download/Send/Resend just toast (mock), nothing happens.
- Use Tailwind CSS + shadcn/ui components only (Button, Dialog, Textarea, toast/sonner, lucide icons).
- Money uses `Intl.NumberFormat("en-NG", NGN)`, tabular-nums.

## Design language — be precise

- **Feel:** official, corporate, print-grade — like a real payslip document.
- **Palette:** primary deep green `#0F766E`–`#065F46` for the accent bar and Net pay; backdrop `#E2E8F0`-ish gray; sheet pure white with `shadow-lg`. Text: slate-900 headings, slate-600 body.
- **Typography:** Inter. Sheet text small but readable (text-xs/text-sm); Net pay large and bold.

## Screen layout

**Back link** top-left: "← Payslips".

**Action bar** (above the sheet, white): **Download PDF** (solid emerald, download icon), **Send email** (outline, mail icon — opens a dialog with an editable "To:" field and a template preview line), **Resend** (ghost), and a **password chip** if password protection is on: `Password: k9#Tq2mV…` with a copy button (toasts "Copied").

**The sheet** (white A4, max-w-[794px], mx-auto, subtle border):
1. **Header:** company logo + name + address/phone/TIN on the left; "PAYSLIP" title, reference `PS-2026-08-0001`, pay period, payment date on the right; a brand-green accent bar under the header.
2. **Employee block:** 2-column grid — Name, Employee code, Department, Job title, Bank (masked `****1234`).
3. **Two tables side by side:** **Earnings** (Basic ₦450,000.00, Housing ₦120,000.00, Transport ₦60,000.00, Other ₦0.00 + total) and **Deductions** (PAYE, Pension, NHF + total).
4. **Summary band:** Gross, Total deductions, and **Net pay** large/bold in green, plus an amount-in-words line ("Four Hundred and Eighty-Six Thousand Naira Only").
5. **Employer contributions** small table (e.g. Pension employer 10%).
6. **Footer:** note line from company settings + "This is a system-generated payslip."

## Details that make it beautiful

- The sheet looks like a real A4 document — generous padding, hairline table borders, aligned columns.
- Amount-in-words reads naturally for Nigerian naira.
- The accent bar gives the sheet a polished brand moment.
- Print-friendly: tables break cleanly, no clip-overs.
- Responsive: sheet scales down on mobile without breaking.

## Exclusions

No real PDF generation, no real email, no persistence, no API calls. Focus 100% on a print-grade, pixel-perfect payslip sheet.
