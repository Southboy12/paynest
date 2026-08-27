# Process

Work is organized around GitHub issues.

- Tasks are GitHub issues, worked one at a time
- The backlog is the issues list, grouped by label (foundation, employees, payroll-runs, payslips, email-delivery, notifications-audit, bulk-import, wrap-up, company-setup, payroll-configuration, calculation-engine)
- Commit regularly

Backlog labels

- `MVP` - work in the current scope (tasks 1-47). This is what gets implemented next.
- `post-MVP` - deferred or parked work (tasks 48+). Only pulled in once the MVP is done.
- Out-of-scope items raised while grooming are filed as `post-MVP` issues so nothing is silently dropped.

Grooming gate

- Before an issue is implemented, the PM grooms it into the template in `_docs/task-template.md`.
- An issue is only ready to implement when all four template sections are filled in and every acceptance criterion is something you can check by looking at the result.

Close gate

- Close an issue only when every acceptance criterion in it is met.

Roles

- PM - grooms a task before anyone implements it, follows `_docs/team/pm.md`
- QA Engineer - checks finished work against the issue before it is closed, follows `_docs/team/qa-engineer.md`
