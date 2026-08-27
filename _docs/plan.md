# Nigerian Payroll & Payslip Management Platform

## Product Discovery & Brainstorming Scope

**Date:** 27 August 2026  
**Status:** Product discovery / brainstorming  
**Technical stack:** Next.js full-stack (TypeScript), chosen 27 August 2026

---

# 1. Product Vision

Build a professional Nigerian payroll and payslip management platform that allows HR teams to:

- Manage employees
- Manage salary structures and salary history
- Run payroll
- Calculate earnings and deductions
- Review and override calculations where necessary
- Generate professional payslips
- Download payslips as PDFs
- Send payslips by email
- Track payroll and delivery activity
- Maintain a detailed audit trail

The first version will solve the current company's real payroll/payslip problem. If successful, the product should later be capable of evolving into a multi-company SaaS platform for Nigerian companies.

---

# 2. Strategic Goal

## Primary direction

**Start by solving the current company's payroll problem, then potentially turn the solution into a product for other Nigerian companies.**

This means:

- The MVP should be useful for a real company immediately.
- The design should avoid assumptions that make future multi-company support difficult.
- The product should be Nigeria-first.
- Advanced HR features should not unnecessarily expand the MVP.

---

# 3. MVP Definition

The chosen direction is:

> **A professional payroll platform MVP with proper controls and future-ready architecture, while deliberately leaving advanced HR functionality for later phases.**

The MVP is more than a simple payslip generator, but it is not intended to become a complete HR management platform.

---

# 4. Main Users

## Primary user

**HR/Admin**

Employees will not have accounts in the MVP.

Employees receive payslips through email.

## Multiple users

The system should support multiple internal users with different roles and permissions.

Potential roles:

- Super Admin
- HR Admin
- Payroll Officer
- HR Officer
- Viewer/Auditor

The exact roles and permissions will be finalized later.

---

# 5. Authentication

For the MVP:

- Email + password login

Future possibilities such as 2FA can be added later.

---

# 6. Role-Based Access Control

The system should use permissions rather than giving every HR user full access.

Examples:

### Super Admin
- Full company/system access
- User management
- Payroll configuration
- Company settings
- Sensitive settings

### HR Admin
- Employee management
- Payroll
- Payslips
- Selected configuration

### Payroll Officer
- Create/process payroll
- Generate payslips

### HR Officer
- Employee management

### Viewer/Auditor
- Read-only access

Important actions, such as finalizing payroll, should be controlled by permissions.

---

# 7. Company Setup

The company setup should collect information relevant to payroll and payslips.

## Company identity

- Company name
- Company logo
- Company registration number (optional)
- Tax Identification Number, where applicable

## Contact information

- Company address
- Official email
- Phone number

## Payroll defaults

- Monthly payroll by default
- Nigerian Naira (₦)
- Payroll/tax configuration
- Pension settings
- NHF settings
- Default earnings components
- Default deductions components

## Payslip settings

- Payslip numbering format
- Company branding
- Brand colors
- Footer/notes
- Default payslip template
- PDF password-protection setting

Sensitive settings should only be editable by authorized users.

---

# 8. Employee Management

Each employee should have a profile.

## Employee information

Potential fields:

- Employee ID
- Full name
- Department
- Job title
- Email
- Phone number
- Employment status
- Salary structure
- Bank information

## Employee IDs

The system should:

- Automatically generate Employee IDs by default
- Allow HR to change the ID to match the company's existing numbering system

Example:

- Automatically generated: `EMP-0001`
- Company format: `STAFF-001`

---

# 9. Employee Status

MVP employee statuses:

- Active
- Inactive
- On Leave
- Terminated

Employees should not normally be permanently deleted.

Historical payroll and payslip records must remain available even when an employee leaves the company.

---

# 10. Employee Search and Filtering

HR should be able to search and filter employees using:

- Name
- Employee ID
- Email
- Phone
- Department
- Job title
- Status

Filters should be combinable.

Example:

- Department: Finance
- Status: Active
- Job title: Accountant

---

# 11. Employee Bank Information

The system can store:

- Bank name
- Account name
- Account number

Because this is sensitive information:

- Full account numbers should not be unnecessarily displayed.
- Where displayed, they can be masked.

Example:

`**** **** 1234`

The MVP is focused on payroll and payslip generation, not salary disbursement.

---

# 12. Salary Structure

Each employee should have a default salary structure.

Example:

- Basic salary
- Housing allowance
- Transport allowance
- Other allowances
- Other recurring earnings
- Applicable deductions

The employee's salary structure acts as a default for payroll.

However, payroll-specific values can override the default without changing the employee's permanent salary structure.

---

# 13. Salary History

The system should maintain salary history.

Example:

| Effective Date | Basic | Housing | Transport | Reason |
|---|---:|---:|---:|---|
| Jan 2026 | ₦400,000 | ₦100,000 | ₦50,000 | Initial salary |
| Jun 2026 | ₦450,000 | ₦120,000 | ₦60,000 | Salary review |
| Oct 2026 | ₦500,000 | ₦150,000 | ₦70,000 | Promotion |

Requirements:

- Salary changes should have effective dates.
- Historical salary records should not be overwritten.
- Payroll should determine which salary structure applies to the selected payroll period.

---

# 14. Permanent and Temporary Payroll Components

The system should support both permanent and temporary items.

## Permanent components

Examples:

- Basic salary
- Housing allowance
- Transport allowance
- Other recurring allowances

## Temporary earnings

Examples:

- Bonus
- Overtime
- Commission
- Arrears

## Temporary deductions

Examples:

- Loan repayment
- Salary advance
- Other applicable deductions

Temporary items apply only to the selected payroll unless HR explicitly makes them permanent.

---

# 15. Nigerian Payroll Components

The system should provide payroll components commonly found in Nigerian companies.

## Earnings

- Basic salary
- Housing allowance
- Transport allowance
- Other allowances
- Bonus
- Overtime
- Commission
- Other configurable earnings

## Deductions

- PAYE
- Pension
- NHF
- Loan deductions
- Other configurable deductions

## Payroll summary

- Gross earnings
- Total deductions
- Net salary

The application should provide common Nigerian components by default while allowing authorized users to add or configure components.

---

# 16. Payroll Rules

The system should provide Nigerian payroll/tax rules as defaults.

However:

- Rules should be configurable.
- Authorized users can adjust relevant settings.
- Historical payroll should not be affected by future rule changes.
- Payroll rules should eventually support versioning.

---

# 17. Automatic Calculations

The system should automatically calculate:

- Gross salary
- Applicable deductions
- Net salary

HR should still be able to override calculated values when necessary.

---

# 18. Calculation Overrides

If the system calculates:

> PAYE: ₦45,000

and HR changes it to:

> PAYE: ₦40,000

HR must provide a reason.

The system should record:

- Original calculated value
- New value
- Reason
- User who made the change
- Date/time

This information should also be reflected in the audit trail.

---

# 19. Calculation Transparency

HR should be able to understand how calculations were produced.

Example:

**PAYE: ₦42,500**

HR can view:

- Taxable income
- Rule/configuration used
- Relevant deductions
- Calculation result

The default interface should be simple, with detailed calculation breakdown available when needed.

---

# 20. Payroll Frequency

Salary is normally paid monthly.

However, HR should be able to run payroll at any time.

Possible use cases:

- Regular monthly payroll
- Off-cycle payroll
- Salary correction
- Bonus payment
- Final salary
- Other special payments

Monthly payroll is the default, not a restriction.

---

# 21. Payroll Periods

The system should support:

- Monthly periods
- Custom periods

HR should specify:

- Period start date
- Period end date
- Payment date

Example:

- Payroll: August 2026
- Pay period: 1 August – 31 August 2026
- Payment date: 25 August 2026

---

# 22. Creating a Payroll

When HR starts a payroll:

- Active employees are selected by default.
- HR can remove employees.
- HR can add/select specific employees.
- HR can run payroll for everyone or selected employees.

---

# 23. Payroll Workflow

The core MVP workflow should be:

**Create Payroll → Calculate → Preview → Edit → Recalculate → Finalize → Generate Payslips → Send**

The system should keep payroll processing flexible while maintaining controls.

---

# 24. Payroll Preview

Before finalization, HR should see a payroll preview.

Example:

| Employee | Gross | Deductions | Net Pay |
|---|---:|---:|---:|
| John Doe | ₦550,000 | ₦70,000 | ₦480,000 |
| Jane Smith | ₦420,000 | ₦55,000 | ₦365,000 |
| Peter Obi | ₦600,000 | ₦80,000 | ₦520,000 |

HR should be able to:

- Review all employees
- Edit individual payroll items
- Recalculate payroll
- Inspect calculation details

---

# 25. Payroll Status

The MVP workflow should support:

**Draft → Review → Approve/Finalize → Locked**

The exact user who can finalize payroll should be controlled by permissions.

---

# 26. Approval Workflow

For the MVP:

- One approval/finalization step

Future support:

- Multiple approval levels

Possible future flow:

**Payroll Officer → HR Manager → Finance Manager → Finalized**

The permission system should be designed so future approval workflows can be added.

---

# 27. Payroll Finalization

Once finalized:

- Payroll becomes locked.
- Finalized figures cannot simply be overwritten.
- Historical integrity must be preserved.
- Corrections must follow controlled processes.

---

# 28. Payroll Corrections

## Before finalization

HR can:

- Edit payroll
- Modify figures
- Regenerate payslips

## After finalization

The payroll should not be casually edited.

Corrections should use controlled adjustment/reversal or reopening processes.

---

# 29. Payroll Reopening

Authorized users should be able to reopen finalized payroll.

Requirements:

- Mandatory reason
- Audit log entry
- Authorized permission required

After reopening:

- Corrections can be made
- Payroll can be finalized again
- Historical audit information remains intact

---

# 30. Payroll Deletion

## Draft payroll

Can be deleted by an authorized user.

## Finalized payroll

Cannot be deleted.

This protects financial and historical records.

---

# 31. Payroll Duplication

HR should be able to duplicate an existing payroll.

Example:

**August 2026 Payroll**
→ Duplicate
→ **September 2026 Payroll (Draft)**

The duplicated payroll should:

- Use relevant employee salary structures/settings
- Recalculate for the new period
- Avoid blindly copying previous totals

---

# 32. Payroll History

HR should be able to view previous payroll runs.

Possible information:

- Payroll period
- Number of employees
- Status
- Payroll totals
- Creation/finalization dates

HR should be able to:

- Open historical payroll
- View historical payslips
- Download historical payslips

Initial retention can be limited, for example to 12 months, with future configuration possible.

---

# 33. Payslip Generation

The application should generate professional payslips suitable for Nigerian companies.

The payslip should include:

- Company information
- Company logo
- Employee name
- Employee ID
- Department/job information
- Payroll period
- Earnings
- Deductions
- Gross pay
- Total deductions
- Net pay
- Payslip reference number
- Relevant employer contribution information where applicable
- Footer/notes

---

# 34. Payslip Design

For the MVP:

- One professional default template

The template should look official and corporate.

The template should support company-level customization.

---

# 35. Payslip Customization

Authorized users should be able to configure:

- Company logo
- Company name
- Company address/contact information
- Brand colors
- Selected fields
- Footer/notes
- Payslip numbering format

Future:

- Multiple payslip templates

---

# 36. Payslip Numbering

Every payslip should have a unique reference number.

Examples:

- `PS-2026-08-0001`
- `PS-2026-08-0002`

Alternative:

- `PAY/2026/08/0001`

The company can configure the format, but the system must guarantee uniqueness.

---

# 37. Payslip Preview

HR should be able to preview the payslip before downloading or sending.

Example:

**Employee:** John Doe  
**Period:** August 2026  
**Gross:** ₦550,000  
**Deductions:** ₦70,000  
**Net Pay:** ₦480,000

Actions:

- Preview
- Download PDF
- Send email

---

# 38. PDF Generation

Payslips should be downloadable as PDF.

The PDF should support company branding and professional formatting.

---

# 39. PDF Security

PDF password protection should be configurable at the company level.

Possible setting:

- Password protection ON/OFF

The system should avoid using easily guessable personal information as a default password.

---

# 40. Email Delivery

Email is the delivery channel for the MVP.

WhatsApp delivery has been intentionally removed from the MVP.

---

# 41. Email Sending

Recommended approach:

- Provide a default email sending method for initial use/testing.
- Allow companies to configure their own email sending solution later.

Possible future options:

- SMTP
- Google Workspace
- Microsoft 365
- Transactional email providers

---

# 42. Employee Contact Details

Employee profiles should store contact information.

At minimum:

- Email
- Phone number

When sending a payslip:

- Stored email is used by default.
- HR can change the recipient before sending.

---

# 43. Email Templates

The system should provide a professional default email template.

Authorized users can customize:

- Subject
- Message
- Greeting
- Company signature
- Attachment behavior

Template variables can include:

- `{{employee_name}}`
- `{{pay_period}}`
- `{{company_name}}`
- `{{payslip_number}}`

Example:

**Subject:** Your Payslip for August 2026

Dear John,

Your payslip for August 2026 is attached to this email.

Regards,  
HR Department

---

# 44. Sending Payslips

HR should be able to:

## Send individually

Useful when:

- Sending one employee's payslip
- Resending a payslip

## Send in bulk

HR can:

- Select all employees
- Select specific employees
- Send all selected payslips

---

# 45. Resending Payslips

The system should distinguish between:

## Resend

Sends the same finalized payslip again.

## Correct/Regenerate

Used when the payslip itself requires correction.

A resend should not unnecessarily create a duplicate payroll record.

---

# 46. Automatic Payslip Delivery

The company should be able to configure:

**Automatically send payslips after finalization: ON/OFF**

If ON:

**Finalize → Generate Payslips → Automatically Email Employees**

If OFF:

**Finalize → HR Reviews → HR Chooses When to Send**

HR should still be able to manually send or resend payslips.

---

# 47. Email Delivery Tracking

Each email should have a delivery status.

Possible statuses:

- Pending
- Sending
- Sent
- Delivered
- Failed

The system should:

- Track delivery status
- Retry failed emails
- Use reasonable retry limits
- Avoid duplicate or endless sending

---

# 48. Notifications

The system should provide:

- In-app notifications
- Email notifications

Examples:

- Payroll completed
- Payslips generated
- Bulk sending completed
- Email delivery failed
- Payroll requires review
- Payroll correction made

---

# 49. Audit Trail

The application should maintain a comprehensive audit trail.

Examples of actions:

- Employee created
- Employee updated
- Employee status changed
- Salary changed
- Payroll created
- Payroll edited
- Payroll finalized
- Payroll reopened
- Payroll deleted (draft only)
- Calculation overridden
- Payslip generated
- Payslip sent
- Payslip resent
- Settings changed
- User permissions changed

Each important event should record:

- User
- Action
- Relevant old/new values where appropriate
- Date/time
- Reason where required

The audit trail should be designed carefully to avoid exposing sensitive data unnecessarily.

---

# 50. Excel/CSV Bulk Upload

HR should be able to upload payroll data using Excel/CSV.

For the MVP:

- The application provides an official template.
- HR downloads the template.
- HR fills it in.
- HR uploads it.
- The system validates it.
- Errors are shown.
- HR fixes the file.
- HR uploads again.
- Payroll is imported only after validation succeeds.

The MVP should not try to automatically understand arbitrary spreadsheet formats.

---

# 51. Import Validation

The payroll import should be fail-safe.

If errors exist:

**Nothing should be imported.**

Instead, show a detailed error report.

Examples:

- Row 14 — Employee ID is missing
- Row 27 — Basic Salary must be a number
- Row 63 — Employee ID does not exist
- Row 81 — Duplicate Employee ID

This prevents partial or incorrect payroll creation.

---

# 52. Bulk Upload Types

The system should support two types of bulk uploads.

## Full Payroll Upload

Example:

`Employee ID | Basic | Housing | Transport | Bonus | PAYE | Pension | Other Deduction`

## Payroll Adjustment Upload

The system uses the employee's saved salary structure.

The uploaded file contains temporary changes such as:

`Employee ID | Bonus | Overtime | Other Deduction`

The system then calculates the rest of the payroll.

---

# 53. Employee Accounts

Employees will not have accounts in the MVP.

Future possibility:

- Employee portal
- Payslip history
- PDF downloads
- Self-service access

For now:

- HR manages the system.
- Employees receive payslips through email.

---

# 54. Attendance and Leave

Attendance and leave management are not part of the MVP.

For now:

- HR manually enters attendance-related adjustments if required.

Future:

- Attendance integration
- Overtime integration
- Unpaid leave deductions
- Automated payroll adjustments

---

# 55. Employee Documents

Employee document management is not part of the MVP.

Future possibilities:

- Employment letters
- ID documents
- Tax documents
- Pension documents
- Other HR documents

The future system can add this module without turning the MVP into a full HR platform.

---

# 56. Reports

Reports are intentionally excluded from the MVP.

Future reports may include:

- Total payroll cost
- Gross salary totals
- Total deductions
- Total net salary
- PAYE totals
- Pension totals
- Department breakdowns
- Employee payroll summaries
- Payroll history reports

---

# 57. Currency

For the MVP:

**Nigerian Naira (₦) only**

Multi-currency support can be considered later.

---

# 58. WhatsApp

WhatsApp delivery is explicitly excluded from the MVP.

Possible future feature:

- WhatsApp Business API
- Automated payslip notifications
- Controlled employee communication

---

# 59. Features Excluded From MVP

The following are intentionally outside the MVP:

- WhatsApp payslip delivery
- Employee login
- Employee self-service portal
- Attendance management
- Leave management
- Automated overtime calculations
- Employee document management
- Payroll reports
- Multiple currencies
- Multiple payslip templates
- Multi-level approval workflows
- Automatic spreadsheet column mapping
- Salary payment/disbursement
- Full HR management functionality

---

# 60. Future Expansion

Potential Phase 2/3 features:

- Employee portal
- WhatsApp Business API integration
- Attendance integration
- Leave management
- Automated overtime calculations
- HR document management
- Payroll reports and analytics
- Multiple payslip templates
- Multi-level payroll approval
- Multi-currency
- More flexible spreadsheet imports
- External payroll/accounting integrations
- Salary payment/disbursement integrations
- Full multi-company SaaS onboarding

---

# 61. Non-Technical Product Structure

The product should conceptually revolve around:

**Company**  
→ **Users & Roles**  
→ **Employees**  
→ **Salary Structures & History**  
→ **Payroll Runs**  
→ **Payroll Items & Adjustments**  
→ **Payroll Calculations**  
→ **Payslips**  
→ **Email Delivery**  
→ **Notifications**  
→ **Audit Logs**

The system should clearly separate:

- Employee default salary structures
- Payroll-specific adjustments
- Current rules/configuration
- Historical finalized payroll records

This is important for future growth and multi-company support.

---

# 62. Core HR User Journey

## Initial setup

1. HR logs in.
2. HR completes company profile.
3. HR configures company branding.
4. HR configures payroll settings.
5. HR adds/imports employees.
6. HR configures employee salary structures.

## Running payroll

1. HR clicks **Run Payroll**.
2. HR selects payroll period.
3. Active employees are selected by default.
4. HR adds/removes employees if necessary.
5. System loads applicable salary structures.
6. HR adds temporary earnings/deductions where required.
7. System calculates payroll.
8. HR reviews the payroll preview.
9. HR edits individual employees if necessary.
10. Calculation overrides require a reason.
11. HR reviews detailed calculation information where needed.
12. Authorized user finalizes payroll.
13. Payroll becomes locked.

## Payslip process

1. System generates payslips.
2. HR previews payslips.
3. HR downloads PDFs or sends them by email.
4. If automatic sending is enabled, payslips are emailed after finalization.
5. Email delivery status is tracked.
6. Failed emails are retried.

---

# 63. Important Product Principles

1. **Accuracy first**  
   Payroll errors can have serious consequences.

2. **Auditability**  
   Important actions should be traceable.

3. **Historical integrity**  
   Finalized payroll should not be casually overwritten or deleted.

4. **Human control**  
   HR can review and override calculations, with proper reasons.

5. **Useful automation**  
   Calculations and bulk processing should reduce HR workload.

6. **Controlled configuration**  
   Companies can customize settings, but sensitive changes require authorization.

7. **Disciplined MVP scope**  
   Do not turn the first version into a complete HR management system.

8. **Future-ready design**  
   The product should be capable of evolving into a multi-company SaaS.

9. **Nigeria-first**  
   Payroll defaults should reflect Nigerian company practices.

10. **Security and privacy**  
    Employee salary and financial information must be treated as sensitive.

---

# 64. Final MVP Summary

The MVP will provide:

## HR & Users

- Email/password authentication
- Multiple HR users
- Role-based permissions
- Comprehensive audit trail

## Company

- Company profile
- Logo and branding
- Nigerian payroll configuration
- Payslip configuration

## Employees

- Employee profiles
- Employee IDs
- Employee statuses
- Salary structures
- Salary history
- Bank information
- Advanced search/filtering
- No normal permanent deletion

## Payroll

- Monthly default
- Custom payroll periods
- Run payroll anytime
- Select all or specific employees
- Saved salary structures
- Temporary earnings/deductions
- Automatic calculations
- Manual overrides with mandatory reason
- Payroll preview
- Calculation breakdown
- Draft/review/finalize workflow
- Locked finalized payroll
- Controlled reopening
- Draft deletion
- Payroll duplication
- Payroll history

## Payslips

- Professional default template
- Company branding
- Configurable payslip numbering
- Payslip preview
- PDF generation
- Optional PDF password protection
- PDF download

## Email

- Individual sending
- Bulk sending
- Resend
- Automatic sending option
- Configurable email setup
- Default + customizable email templates
- Delivery tracking
- Automatic retry
- In-app/email notifications

---

# 65. Next Product Discovery Stage

Technical implementation has intentionally been postponed.

Before choosing technologies or writing code, the next product discovery work should focus on:

1. Define the exact MVP screens/pages.
2. Define each screen's responsibilities.
3. Map the complete HR user journey in detail.
4. Define conceptual data entities.
5. Define payroll calculation rules and edge cases.
6. Define the exact Nigerian payroll components to support.
7. Define permissions for each role.
8. Define audit events.
9. Define Excel template columns.
10. Define the final payslip layout/content.
11. Define the complete email workflow.
12. Confirm the MVP vs Phase 2 boundary.
13. Only then move into technical architecture and technology selection.

---

# 66. Current Project Status

**Product scope:** Well defined  
**MVP direction:** Confirmed  
**Technical stack:** Confirmed — Option 3: Next.js full-stack (App Router) + React + TypeScript + PostgreSQL  
**Next focus:** Product screens, workflows, entities, payroll rules, and edge cases

---

# 67. Technology Decision (27 August 2026)

Selected stack: **Next.js 15 full-stack (App Router) + React 19 + TypeScript**.

Concrete working set agreed for implementation:

- **Framework/UI:** Next.js App Router, React Server Components, Tailwind CSS, shadcn/ui
- **ORM/Database:** Prisma + PostgreSQL (NUMERIC for money, JSONB for audit snapshots and rule versioning)
- **Auth/RBAC:** better-auth or Auth.js + permission middleware with `company_id` scoping from day one
- **Background jobs:** Redis + BullMQ for email sending, retries, and notifications
- **Email:** nodemailer behind a driver abstraction (managed transactional provider default, SMTP later)
- **Excel:** exceljs for templates and fail-safe import validation
- **PDF:** Playwright/Chromium HTML→PDF rendering, qpdf post-processing for password protection
- **Money handling:** Decimal/minor units only, never floats

Known trade-offs accepted with this choice:

- Auth, RBAC, and audit trail are assembled from libraries rather than provided by a batteries-included framework.
- Headless-Chromium PDF generation must be self-hosted; the app should be deployed to a VPS/container, not a serverless platform with execution limits.
- Strict discipline is required to avoid float arithmetic for money values.

---

## End of Brainstorming Scope Document
