# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

## Summary

Add a visible "Overdue" danger-coloured badge/pill to any incomplete `TodoCard` whose
`dueDate` is strictly before today's date. Overdue status is derived client-side on every
render using a pure `isOverdue()` utility function; no backend or storage changes are
required. The badge uses the existing `--danger-color` CSS token, renders below the due
date text with an accessible label, and works in both light and dark mode.

## Technical Context

**Language/Version**: JavaScript (ES2020) — React 18.2.0 (frontend), Node.js LTS (backend, unchanged)  
**Primary Dependencies**: React 18.2.0, React Scripts 5.0.1, axios 1.6.2 (frontend, unchanged); `@testing-library/react` 14.0.0, `@testing-library/jest-dom` 5.17.0, `@testing-library/user-event` 14.5.1 (test utilities)  
**Storage**: SQLite via better-sqlite3 (backend) — **no schema changes**. Overdue status is derived at render time, never persisted.  
**Testing**: Jest (via react-scripts) + React Testing Library (frontend); `npm run test:frontend` (`react-scripts test --coverage --watchAll=false`). Backend tests unchanged.  
**Target Platform**: Web browser (Create React App SPA), desktop and mobile breakpoints  
**Project Type**: Web application (single-user todo SPA)  
**Performance Goals**: Per-render YYYY-MM-DD string comparison — O(1), no timer or interval overhead  
**Constraints**: Date-only comparison (no time component) to avoid timezone issues; WCAG AA contrast required; no new dependencies  
**Scale/Scope**: Single-user; feature touches one utility module, one component, one CSS file, two test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Scope Discipline** | PASS | Pure UI display change deriving overdue from existing `dueDate` + `completed` fields. No filtering, sorting, notifications, or out-of-scope behaviours introduced. |
| **II. Monorepo Boundary Integrity** | PASS | All changes in `packages/frontend`. New module: `src/utils/dateUtils.js` (single responsibility: date utilities). `TodoCard.js` updated for badge rendering. `App.css` updated for badge styles. Backend untouched. |
| **III. Test-First Behavior Verification** | PASS | Tests defined in spec before implementation: `src/utils/__tests__/dateUtils.test.js` (new) and `src/components/__tests__/TodoCard.test.js` (extended). All new behaviour paths covered. Coverage must remain ≥ 80%. |
| **IV. Accessible Themed Experience** | PASS | Badge uses `--danger-color` token (light: `#c62828`, dark: `#ef5350`); text label "Overdue" satisfies colour-independence; `aria-label` satisfies screen-reader requirement; badge tested in both themes. |
| **V. Immediate Persistence And Graceful Failure** | PASS | No mutations. Overdue is a derived read-only value; no persistence impact. No failure states introduced. |

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

*Note: No `contracts/` directory — this feature adds no new external API or interface contracts.*

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   └── services/
│   └── __tests__/
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── services/
        ├── styles/
        └── __tests__/
```

**Structure Decision**: Use the existing npm workspaces monorepo. All changes stay in
`packages/frontend/src`. A new `utils/` directory is introduced for the `isOverdue()`
pure function; this keeps the single-responsibility rule and makes it independently
testable. Backend is untouched.

**Files changed by this feature**:

```text
packages/frontend/src/
├── utils/                              # NEW directory
│   ├── dateUtils.js                    # NEW — isOverdue() pure function
│   └── __tests__/
│       └── dateUtils.test.js           # NEW — unit tests (write first)
├── components/
│   ├── TodoCard.js                     # MODIFIED — import isOverdue, render badge
│   └── __tests__/
│       └── TodoCard.test.js            # MODIFIED — add overdue badge tests
└── App.css                             # MODIFIED — add .overdue-badge styles
```

## Complexity Tracking

*No constitution violations. No entry required.*
