# Backlog — Nigerian Payroll & Payslip Platform (MVP)

Stack: Next.js 15 (App Router) + React + TypeScript, Tailwind + shadcn/ui, Prisma + PostgreSQL, Redis + BullMQ, exceljs, Playwright/Chromium for PDF, qpdf for encryption.

Tasks are ordered by rough dependency, but each one is written to be self-contained. Money values must always use decimal/minor units, never floats. Every task should include at least a minimal automated test for what it builds.

---

**Foundation**

## 1. Set up the empty project with a passing test
Goal: A fresh Next.js app with a working test suite.
Description: Scaffold a Next.js 15 project using the App Router, TypeScript, Tailwind CSS, and ESLint, and add Vitest as the test runner. Add one simple passing test (e.g. the home page renders) and make sure `npm run lint` and `npm test` both pass. Commit a proper `.gitignore` and a short README with setup commands.

## 2. Set up PostgreSQL with Prisma
Goal: The app can talk to a PostgreSQL database through Prisma with repeatable migrations.
Description: Add Prisma with the PostgreSQL provider and configure `DATABASE_URL` via `.env` (document the expected variables in the README). Create an initial tiny schema and generate a first migration. Add a script or test that verifies the database connection and that migrations apply cleanly.

## 3. App shell and navigation
Goal: A consistent layout with sidebar navigation and placeholder pages for every module.
Description: Add shadcn/ui and build the app shell: a sidebar with links to Dashboard, Employees, Payroll, Payslips, Settings, and Audit Log, plus a top bar. Each link targets a placeholder page that renders its title so navigation can be exercised. All styling must use Tailwind and the existing theme setup.

## 4. Email/password authentication
Goal: Users sign in and out with email and password; all app pages are protected.
Description: Integrate an auth library (e.g. better-auth), add a `User` model in Prisma, and build a login page. Protect every route except the login page, implement sign-out, and add tests covering that unauthenticated requests are redirected and valid credentials grant access.

## 5. Seed the first super admin user
Goal: A repeatable, idempotent script creates the initial admin account.
Description: Add a Prisma seed script that creates a Super Admin user from email/password values supplied via environment variables. Running the seed twice must not duplicate the user. Document the required env vars in the README.

## 6. Roles and permission guards
Goal: Role-based access control enforced by a central permission check.
Description: Add a role to `User`: super_admin, hr_admin, payroll_officer, hr_officer, viewer. Define a permission list (e.g. employees.manage, payroll.run, payroll.finalize, payroll.reopen, payslips.send, settings.manage, audit.view), map roles to permissions, and expose one guard helper used by both server code and UI. The viewer role must be read-only everywhere; include tests for representative allow/deny cases.

**Company setup**

## 7. Company profile
Goal: Capture the company identity and contact details that appear on payslips and emails.
Description: Build the company settings page for name, registration number (optional), Tax Identification Number, address, official email, and phone. Persist to a `Company` table (single company for now) with required-field validation. Structure records so a `companyId` can be added later without redesign.

## 8. Company logo and branding upload
Goal: Store the company logo and brand colors used across payslips and the UI.
Description: Add settings for logo upload (stored on local disk with a clean interface that can swap to object storage later) and one or two brand colors. Validate file type/size on upload and display the saved logo in settings. Include a test that settings round-trip save/load correctly.

## 9. Payslip configuration
Goal: Configure payslip numbering format and footer notes at company level.
Description: Add settings for the payslip number format (e.g. `PS-{YYYY}-{MM}-{SEQ}` or `PAY/{YYYY}/{MM}/{SEQ}`) and footer/notes text shown on payslips. Validate the format pattern and provide sensible defaults. Include a test that a format string produces the expected sample number.

## 10. Sensitive settings gating
Goal: Only authorized users (super_admin) can see or change sensitive settings.
Description: Mark sensitive settings (email provider credentials, PDF password policy, payroll tax rule values) and restrict their pages to super_admin using the permission guard. Unauthorized users should not see the settings entries at all. Include tests that non-super_admin roles are denied access.

**Employees**

## 11. Employee profiles
Goal: Create, view, and edit employee records with core profile fields.
Description: Add an `Employee` model with full name, email, phone, department, job title, and hire date, plus list/detail/create/edit pages. Validate email format and require the name. Store created-by/updated-by metadata on records for later audit use.

## 12. Employee IDs
Goal: Employees get auto-generated IDs that HR can override.
Description: On create, generate `EMP-0001`-style sequential IDs when none is supplied, and allow HR to specify a custom ID (e.g. `STAFF-001`) instead. Enforce uniqueness on IDs and add tests for sequential generation, custom IDs, and collision rejection.

## 13. Employee status and no hard delete
Goal: Track employee status without ever destroying employee data.
Description: Add a status field with Active, Inactive, On Leave, and Terminated values and a status-change action on the employee page. Provide no delete action anywhere so past payroll records always keep their employee reference. Include tests that status changes persist and no delete path exists.

## 14. Bank information with masking
Goal: Store bank details while preventing casual exposure of account numbers.
Description: Add bank name, account name, and account number fields editable on the employee page. Display account numbers masked (e.g. `****1234`) in all normal views, with full values shown only behind an explicit permission check. Include a test for the masking helper.

## 15. Employee search and filtering
Goal: Find employees quickly using combinable search and filters.
Description: Build the employee list with search across name, ID, email, and phone, plus filters for department, job title, and status. Filters must combine in a single database query rather than client-side over all rows. Include a test exercising at least one combined-filter case.

## 16. Salary structures with effective dates
Goal: Each employee has a versioned salary structure with a full history.
Description: Model salary structures as immutable records with an effective date, holding amounts for basic, housing, transport, and other configured components. Build UI to add a new structure (with a reason such as Initial, Review, Promotion) and a history view listing all versions by date. Include a test that the correct structure resolves for a given pay period date (latest effective on or before that date).

**Payroll configuration**

## 17. Earnings and deductions component catalog
Goal: Manage the list of earnings/deduction components used in salaries and payroll.
Description: Seed Nigerian defaults — earnings: Basic, Housing Allowance, Transport Allowance, Other Allowances, Bonus, Overtime, Commission; deductions: PAYE, Pension, NHF, Loan Repayment, Other — and let authorized users add or deactivate components. Mark PAYE, Pension, and NHF as system-calculated so their values come from rules, not manual entry. Include a test that the seeded defaults exist.

## 18. Payroll rules and rule versioning
Goal: Store PAYE/pension/NHF parameters in versioned records so past payroll is never rewritten.
Description: Create a `PayrollRuleVersion` model holding PAYE tax bands and relief rules, pension employee percentage, NHF percentage, and any caps, with an effective-from date. Payroll picks the rule version valid for its period, and finalized runs record which version was used. Include a test that the resolver picks the right version across a rule change.

**Calculation engine**

## 19. Payroll calculation engine
Goal: Pure functions that compute gross, each deduction, and net pay.
Description: Given component amounts and a rule version, compute gross earnings, taxable income (applying Nigerian consolidated relief rules), PAYE via progressive bands, pension (default employee 8% of pensionable basic/housing/transport), NHF (default 2.5% of basic where applicable), total deductions, and net pay. Implement as pure TypeScript with decimal/minor-unit math and no database access, plus thorough unit tests including zero-amount and band-boundary cases.

## 20. Calculation breakdown output
Goal: Every computed figure carries an explainable breakdown for HR review.
Description: Have the calculation engine also return a structured breakdown per deduction — for PAYE: taxable income, relief applied, per-band amounts, result; for pension/NHF: base, rate, result. Store the breakdown with payroll entries and expose a typed helper for UI rendering later. Include tests asserting breakdowns reconcile with final values.

**Payroll runs**

## 21. Create a payroll run
Goal: Start a new payroll for a chosen period and employee set.
Description: Build the create flow: enter period start, period end, and payment date, then select employees (all active employees selected by default, with add/remove). Create the run in Draft status and warn if another run overlaps the same period. Include validation tests (end after start, payment date).

## 22. Payroll line item snapshots
Goal: Materialize each employee's pay into immutable line entries for the run.
Description: On calculate, resolve each selected employee's applicable salary structure and copy component amounts into `PayrollEntry` records for the run, then allow one-off temporary earnings/deductions that apply only to this run. Entries must reference their source structure so history stays traceable. Include tests for structure resolution and adding one-off items.

## 23. Payroll preview and editing
Goal: HR reviews all computed entries and can adjust individual values before finalizing.
Description: Build the preview screen: a table of every employee with gross, deductions, and net pay plus run-level totals, with a recalculate action. Allow opening an individual entry to view its calculation breakdown and edit amounts (edits follow the override task's rules). Include a test that run totals sum correctly.

## 24. Overrides with mandatory reason
Goal: Manual changes to computed values are justified and recorded.
Description: When a computed value (e.g. PAYE) is edited, require a reason and store original value, new value, reason, user, and timestamp on the entry. Block saving an override without a reason and display existing override info on the entry. Include tests for the mandatory reason and recorded fields.

## 25. Payroll status workflow and finalization
Goal: Runs move Draft → Review → Finalized, and finalized runs are locked.
Description: Implement status transitions with permission checks (finalize requires the payroll.finalize permission) and block edits/recalculation once finalized. Finalization must trigger payslip generation for all entries (or a documented hook for it). Include tests for allowed and forbidden transitions.

## 26. Reopen finalized payroll
Goal: Authorized users can reopen a finalized run under strict controls.
Description: Add a reopen action restricted to authorized roles that requires a mandatory reason, records an audit event, and returns the run to Draft. Mark previously generated payslips as invalidated/superseded so they are regenerated after correction. Include tests for permission, mandatory reason, and audit recording.

## 27. Draft payroll deletion
Goal: Drafts can be deleted; finalized runs never can.
Description: Allow authorized users to delete a run only while its status is Draft, removing its entries and one-off items. The service layer must refuse deletion of any non-draft status, and no UI path should exist to bypass it. Include tests that deletion works for drafts only.

## 28. Duplicate a payroll
Goal: Start a new draft based on a previous run without copying stale totals.
Description: Add a Duplicate action: pick an existing run and a new period, and it creates a Draft with the same employee selection and one-off items, but re-resolves salary structures and recalculates all amounts for the new period and rule version. Never copy computed totals from the source run. Include a test proving amounts are recalculated, not copied.

## 29. Payroll history
Goal: Browse and open all previous payroll runs.
Description: Build the payroll list page showing period, status, employee count, gross/deductions/net totals, and created/finalized dates, filterable by status and period. Opening a run shows its preview (read-only when finalized) with links to its payslips. Include tests using seeded runs.

**Payslips**

## 30. Payslip records and numbering
Goal: Every finalized entry gets a payslip with a guaranteed-unique reference number.
Description: When a run is finalized, create one payslip per entry with a reference number built from the company's configured format (e.g. `PS-2026-08-0001`). Guarantee uniqueness under concurrent generation using a database sequence or unique constraint. Include tests for number generation and collision handling.

## 31. Payslip template and preview
Goal: Render a professional, branded payslip for any record.
Description: Build a server-rendered payslip layout showing company identity/logo, employee name/ID/department, pay period, earnings lines, deduction lines, gross, total deductions, net pay, payslip reference, employer contribution info where applicable, and footer notes, styled with company brand colors. Provide an in-app preview page and a standalone route that will serve as the PDF source. Include a render test with fixture data.

## 32. PDF generation and download
Goal: Payslips download as branded PDFs, individually or in bulk.
Description: Render payslip HTML to PDF with headless Chromium (Playwright) and expose single download plus bulk download as a ZIP. Store generated PDFs on local disk behind an interface that can later swap to object storage, and regenerate a PDF after a payslip is corrected. Include a test that produces a PDF from fixture data.

## 33. PDF password protection
Goal: Optionally password-protect payslip PDFs per company setting.
Description: Add a company-level ON/OFF setting; when ON, encrypt generated PDFs (e.g. via qpdf post-processing) using a generated non-guessable password, and surface that password to HR in the app for delivery. Keep the unencrypted PDF flow when OFF. Include tests covering both modes.

**Email delivery**

## 34. Email template configuration
Goal: Authorized users can customize the payslip delivery email.
Description: Provide settings for subject and body with variables `{{employee_name}}`, `{{pay_period}}`, `{{company_name}}`, and `{{payslip_number}}`, seeded with a professional Nigerian-appropriate default. Add a variable-substitution helper and a preview rendered with sample data. Include tests for substitution and unknown-variable handling.

## 35. Email driver abstraction
Goal: Sending email is decoupled from any specific provider.
Description: Define an email driver interface and ship a default driver using a managed transactional provider or env-configured SMTP, with a fake in-memory driver for tests. Company-level email provider settings (super_admin only) can be added behind the same interface later. All sending in the app must go through this interface. Include a test using the fake driver.

## 36. Send and resend a single payslip
Goal: Send one payslip by email, with recipient override and resend.
Description: Add Send/Resend actions on a payslip: use the employee's stored email by default but let HR change the recipient before sending, attach the PDF (passworded if enabled), and use the configured template. Resend reuses the same payslip without creating duplicates. Record each attempt with recipient, timestamp, and status. Include tests using the fake driver.

## 37. Bulk payslip sending
Goal: Send payslips to all or selected employees of a finalized run via a background queue.
Description: Add a bulk-send flow on a finalized run: choose all or selected employees, then enqueue one send job per payslip using BullMQ/Redis and show progress. Jobs must be idempotent (retries don't duplicate emails) and completion raises a summary notification. Include tests for selection validation and job enqueuing.

## 38. Delivery tracking and retries
Goal: Every payslip email has a tracked status and failed sends retry with limits.
Description: Record a delivery status per send — Pending, Sending, Sent, Failed — updated by the email jobs, with automatic retries (e.g. max 3 attempts with backoff). Show per-run delivery statuses in the UI and provide a manual Retry failed action. Include tests for status transitions and retry limits.

## 39. Automatic sending after finalization
Goal: Optionally email payslips automatically right after a run is finalized.
Description: Add a company-level toggle (default OFF); when ON, finalization automatically enqueues the same bulk-send flow; when OFF, sending stays manual. HR can always send or resend manually regardless of the toggle. Include tests that auto-send happens only when the toggle is ON.

**Notifications and audit**

## 40. In-app notifications
Goal: HR users see important events inside the app.
Description: Add a `Notification` model and a top-bar menu listing recent events: payroll finalized, payslips generated, bulk send completed, email delivery failed, payroll corrected/reopened. Support mark-as-read, and emit notifications from the existing domain events. Include tests that key events create notifications.

## 41. Audit trail recording
Goal: Every sensitive action is recorded with who, what, when, and why.
Description: Implement an audit log service recording events — employee created/updated/status changed, salary changed, payroll created/edited/finalized/reopened/deleted, calculation overridden, payslip generated/sent/resent, settings and permission changed — with user, action, old/new values where appropriate, and reason where required. Redact or mask sensitive values (e.g. bank details) before storage. Include tests for representative events and redaction.

## 42. Audit log viewer
Goal: Browse and filter the audit history, read-only.
Description: Build the audit log page listing events with user, action, target, timestamp, reason, and value changes, filterable by entity type, user, action, and date range. Restrict to roles with audit.view permission and never render masked values in full. Include tests for filters and permission gating.

**Bulk import**

## 43. Excel template downloads
Goal: HR can download official templates for bulk payroll uploads.
Description: Generate downloadable Excel templates via exceljs for both import types: full payroll (Employee ID, Basic, Housing, Transport, Bonus, PAYE, Pension, Other Deduction) and adjustment (Employee ID, Bonus, Overtime, Other Deduction). Include header instructions and an example row in each sheet. Include a test that the generated file has the expected headers.

## 44. Full payroll import with fail-safe validation
Goal: Import a completed full payroll file only when every row is valid.
Description: Parse the uploaded file against the official template, validating each row: Employee ID present, exists, unique in the file, numeric amounts. If any errors exist, import nothing and return a detailed per-row report (e.g. "Row 14 — Employee ID is missing"); on success, build a draft run's entries from the file. Include tests covering the listed error cases and one happy path.

## 45. Payroll adjustment import
Goal: Import one-off adjustments that layer onto saved salary structures.
Description: Parse adjustment uploads (Employee ID plus temporary earnings/deductions), validate with the same fail-safe semantics as full imports, and apply them to a selected draft run so the engine computes everything else from each employee's saved structure. Nothing is applied unless the entire file passes validation. Include tests for success and per-row error reporting.

**Wrap-up**

## 46. Dashboard
Goal: A landing page summarizing payroll state at a glance.
Description: Show active employee count, draft runs, the latest finalized run with totals, and failed email deliveries, with links to the relevant screens. Use read-only queries and respect role permissions (viewer sees the same data, no actions). Include a rendering smoke test.

## 47. End-to-end payroll flow test
Goal: Automated proof that the complete journey works.
Description: Write a Playwright test that seeds company, employees, and salary structures, then runs payroll, applies an override with reason, finalizes, generates payslips, downloads a PDF, and sends email via the fake driver, asserting statuses, delivery records, and audit entries along the way. Fix any gaps the test exposes. This task should be done after the others are in place.
