# Agent Guide

## Docs

- `_docs/process.md` - how work is organized
- `_docs/task-template.md` - the structure every task must be groomed into
- `_docs/team/pm.md` - the Product Manager agent; grooms tasks before they are implemented
- `_docs/team/software-engineer.md` - the Software Engineer agent; implements one groomed task at a time
- `_docs/team/qa-engineer.md` - the QA Engineer agent; checks finished work against the issue's acceptance criteria
- `_docs/outdated/` - archived planning docs (product plan, architecture, original backlog); kept for context, superseded by the GitHub issue workflow

## Workflow

- Work on GitHub issues one at a time (see `_docs/process.md`).
- Before implementing, groom the issue into the template in `_docs/task-template.md` (using the PM process in `_docs/team/pm.md` if it hasn't been groomed already).
- Close an issue only when every acceptance criterion in it is met.
- Commit regularly.

## Commands

- `npm install` - install dependencies
- `npm test` - the whole test suite
- `npm test -- tests/<file>.test.ts` - one test file
- `npm run lint` - lint
- `npm run build` - production build

## Rules

- Dependencies live in `package.json`. Do not add one without asking.
- Money values use decimal/minor units only, never floats.
- The task backlog is the GitHub issues list. Issues labeled `MVP` (tasks 1-47) are the current scope; `post-MVP` issues are parked follow-ups created from out-of-scope items. `_docs/outdated/tasks.md` is the archived original backlog.
