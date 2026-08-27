# PayNest

PayNest — a professional payroll and payslip management platform for Nigerian companies: employee management, salary structures, payroll runs with PAYE/Pension/NHF calculations, branded PDF payslips, and email delivery with a full audit trail.

- Product plan: [`_docs/plan.md`](_docs/plan.md)
- Task backlog: [`_docs/tasks.md`](_docs/tasks.md) (mirrored in GitHub Issues)

## Stack

Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS + shadcn/ui, Prisma + PostgreSQL, Redis + BullMQ, exceljs, Playwright/Chromium PDF generation.

Status: pre-development (planning complete, implementation starting).

## Getting started

- Set up PostgreSQL: run `docker compose up -d`, or use a local PostgreSQL installation
- Copy `.env.example` to `.env` (the default `DATABASE_URL` expects a `paynest_dev` database on `localhost:5432`)
- `npm install` - install dependencies (generates the Prisma client)
- `npx prisma migrate dev` - apply database migrations
- `npm run dev` - start the dev server (http://localhost:3000)
- `npm test` - run the test suite
- `npm run lint` - lint
- `npm run build` - production build

Requires Node 22 (`.nvmrc`).
