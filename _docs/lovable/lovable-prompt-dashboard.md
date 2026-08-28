# Lovable prompt — PayNest dashboard + app shell

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the authenticated app shell and the **Dashboard** page for **PayNest**, a payroll and payslip management application for Nigerian companies. This is a design-only reference — I will port it into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly. The shell you design here (sidebar + top bar) becomes the reusable frame for every other screen, so make it polished and consistent.

## Hard constraints

- Build ONLY the app shell + the Dashboard page. The sidebar nav items may link to minimal placeholder pages (just a page title, nothing else) so the shell is navigable, but do NOT design any other content screen.
- Do NOT connect Supabase or any backend, and do NOT implement real authentication. The app opens directly on the dashboard. If you need an entry point, a one-click "Demo sign-in" page reusing the PayNest login card is allowed but must stay minimal.
- Use Tailwind CSS + shadcn/ui components only.
- All data is hardcoded mock data in local constants — no API calls. Use realistic Nigerian data: Nigerian names, naira amounts formatted with `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })` (e.g. `₦4,286,500.00`).
- The signed-in user is **Adaeze Okafor**, role **Super Admin**, company **PayNest Demo Company**.

## Design language — be precise

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. Clean lines, restrained color, generous whitespace. No playful illustrations, no busy graphics.
- **Palette:**
  - Primary deep green: `#0F766E`–`#065F46` (emerald-700/800) for primary buttons, active nav states, and key accents.
  - Sidebar: dark and premium — deep slate (`#0B1220`–`#111827`) with light text; the active nav item gets a green pill/background.
  - Content background: neutral `#F8FAFC`; cards white with subtle `border-slate-200` and soft `shadow-sm`, `rounded-xl`.
  - Status badge colors: Draft = slate, Review = amber, Finalized = green, Active = green, On Leave = blue, Terminated = slate/red-muted, Sent = green, Pending = amber, Failed = red.
- **Typography:** Inter. Page title ~text-2xl font-semibold; section titles text-lg; table text text-sm; money in tabular-nums, right-aligned.
- **Components:** shadcn/ui — sidebar, sheet (mobile), button, card, table, badge, dropdown menu, avatar, skeleton loading states.

## Layout shell

- **Sidebar (dark):** PayNest logotype at top (rounded square with emerald background containing a white "P", wordmark "PayNest" beside it — self-made with divs/SVG, no external images). Nav items with icons: Dashboard, Employees, Payroll, Payslips, Audit Log, Settings (Settings expands to sub-items: Company, Payslip, Email templates, Payroll rules). Active item: green pill/background. Footer at the bottom: avatar initials, name, role badge, and company name.
- **Top bar (light):** left — company name context "PayNest Demo Company"; right — notifications bell with an unread dot, and a user menu (avatar initials, name + role badge "Super Admin", role switcher Super Admin / HR Admin / Payroll Officer / HR Officer / Viewer, Sign out).
- **Mobile:** sidebar hidden behind a hamburger button that opens it as a sheet.

## Dashboard page

Page header: title "Dashboard" on the left; no primary action button needed (or a subtle "New payroll run" link if it looks balanced).

**1. Four stat cards** in a responsive grid (1 col mobile / 2 col tablet / 4 col desktop), each with an icon, label, and value — and a "view all" link that goes to the relevant placeholder page:
- **Active employees** — value `8` — link to Employees.
- **Draft payroll runs** — value `1` — link to Payroll.
- **Latest finalized run** — `August 2026` with `Net ₦4,286,500.00` — link to Payroll.
- **Failed deliveries** — value `1` — link to Payslips (value in red if it is non-zero).

**2. Recent payroll runs** — a mini-table (below the stat cards), 3 rows: period, status badge, employees, net total (right-aligned, tabular-nums):
- August 2026 · Finalized (green) · 8 employees · ₦4,286,500.00
- July 2026 · Finalized (green) · 8 employees · ₦4,198,750.00
- June 2026 · Draft (slate) · 8 employees · ₦4,512,800.00
- Footer link: "View all runs".

**3. Recent activity** — a feed (right of or below the runs table) of 5 audit-style entries, each with a small icon, actor name, action text, and relative timestamp:
- Adaeze Okafor · Finalized payroll run "August 2026" · 2h ago
- Chinedu Adeyemi · Generated 8 payslips for August 2026 · 4h ago
- Fatima Bello · Bulk send completed — 8/8 delivered · Yesterday
- System · Delivery failed for PS-2026-08-0004 (invalid recipient email) · Yesterday
- Tunde Bakare · Reopened payroll run "June 2026" · 2 days ago

## Details that make it beautiful

- Subtle entrance animation on page load (200–300ms, fade/slide) — respect `prefers-reduced-motion`.
- Stat card hover states (shadow lift, subtle border color change) so the page feels alive.
- Consistent iconography from lucide, consistent card padding, comfortable spacing.
- Avatar initials with a colored circle background for the user and activity actors.
- Bell shows a small unread dot; the user menu is a clean shadcn dropdown with a subtle divider before "Sign out".
- Fully responsive: no horizontal scroll on small screens; the sidebar collapses to a sheet on mobile.
- WCAG AA contrast on all text; emerald focus-visible outlines everywhere (accessibility).

## Exclusions

No other content screens, no real authentication, no database/Supabase, no real API calls, no email/PDF functionality, no dark/light toggle, no charts. Focus 100% on the shell + dashboard being pixel-perfect and consistent, since every future screen will inherit this frame.
