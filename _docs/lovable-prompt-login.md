# Lovable prompt — PayNest login screen only

Copy everything below the line into Lovable as a single prompt.

---

Build **one screen**: the login page for **PayNest**, a payroll and payslip management application for Nigerian companies. This is a design-only reference — I will port it into an existing Next.js + Tailwind + shadcn/ui project, so match that stack exactly.

## Hard constraints

- Build ONLY the login screen. No dashboard, no sidebar, no other pages.
- Do NOT connect Supabase or any backend, and do NOT implement real authentication.
- Use Tailwind CSS + shadcn/ui components only.
- The "Sign in" button should show a brief loading spinner state, then display a toast "Invalid email or password" for wrong credentials, and succeed ONLY for `admin@paynest.local` / `PayNest-Demo-2026` — on success, navigate to a minimal blank "/app" page that just says "Signed in as Adaeze Okafor (Super Admin)" with a link back to /login. Nothing else.
- Include a "Demo sign-in" secondary action that fills the form with those credentials automatically (one click, then the user presses Sign in).

## Design language — be precise

- **Feel:** official, corporate, trustworthy — a serious finance/HR product. No playful illustrations, no busy graphics.
- **Palette:**
  - Primary deep green: `#0F766E`–`#065F46` (emerald-700/800) for the Sign in button, focus rings, and accent details.
  - Background: dark and premium — deep slate (`#0B1220`–`#111827`) with a very subtle radial emerald glow behind the card, optional faint grid or gradient texture (restrained).
  - Card: white, `rounded-xl`, `border border-slate-200`, soft `shadow-lg`, comfortable padding (p-8).
- **Typography:** Inter. Clear hierarchy: wordmark, title ~text-2xl font-semibold, labels text-sm font-medium slate-700, helper text text-xs/text-sm slate-500.
- Money is not shown on this screen, but any Naira amounts elsewhere must use `Intl.NumberFormat("en-NG", { currency: "NGN" })` — not needed here.

## Screen layout

Full-viewport centered card on the dark backdrop. Small footer text fixed at the bottom of the viewport.

Card contents, top to bottom:
1. **Logotype:** a simple mark — rounded square with an emerald background containing a white "P" (or a minimal nest/coin glyph) — plus the wordmark "PayNest" beside it. Keep it clean and self-made with divs/SVG, no external image files.
2. **Title:** "Sign in to PayNest".
3. **Subtitle:** "Payroll and payslips for Nigerian companies" in slate-500.
4. **Form:**
   - Email field: label "Email", placeholder `you@company.com`, mail icon inside the input, shadcn Input with visible focus ring (emerald).
   - Password field: label "Password", lock icon, show/hide toggle (eye icon), placeholder `••••••••••`.
   - Validation states: empty submit shows inline field errors ("Enter your email", "Enter your password"); invalid email format shows "Enter a valid email address". Errors in red-600 text-xs beneath the field with a red border on the input.
   - Right-aligned "Forgot password?" link (text-emerald-700) — clicking it shows a toast "Password reset is coming soon".
5. **Buttons:**
   - Primary: "Sign in" full-width, emerald-700, hover emerald-800, loading spinner state while submitting.
   - Divider row: thin line with "or" centered.
   - Secondary: "Use demo account" — outline variant, fills the form with the demo credentials.
6. **Card footer:** "Need access? Contact your HR administrator." in slate-500 text-xs centered.

## Viewport footer

Centered at the bottom of the page, text-xs slate-500: "© 2026 PayNest · Built for Nigerian businesses".

## Details that make it beautiful

- Subtle entrance animation: card fades/slides in on mount (200–300ms).
- Inputs ~h-11 with comfortable spacing between fields (space-y-4+).
- Error toast and success handled with shadcn toast/sonner, positioned top-right.
- Fully responsive: card max-w-md, proper padding on mobile (px-4), no horizontal scroll on small screens.
- prefers-reduced-motion respected for the entrance animation.
- Light text selection color, emerald focus-visible outlines everywhere (accessibility).
- Dark enough backdrop that the white card floats clearly; ensure WCAG AA contrast on all text.

## Exclusions

No routing structure beyond /login and the minimal /app confirmation page, no database, no auth library, no additional screens or navigation, no dark/light toggle. Focus 100% on making this one screen pixel-perfect.
