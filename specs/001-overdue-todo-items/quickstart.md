# Quickstart: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-items`  
**Branch**: `001-overdue-todo-items`

---

## Prerequisites

- Node.js LTS installed
- `npm install` run from the repo root (or `npm run install:all`)

---

## Running the App

```bash
# From repo root — starts frontend (port 3000) and backend (port 3030) concurrently
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Tests

```bash
# Run all tests (frontend + backend)
npm test

# Run frontend tests only (with coverage)
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run frontend tests in watch mode
cd packages/frontend && npm run test:watch
```

Coverage threshold: **≥ 80%** across `packages/frontend/src/**/*.{js,jsx}`.

---

## What This Feature Adds

### 1. `isOverdue()` pure utility function

**File**: `packages/frontend/src/utils/dateUtils.js` *(new)*

```js
import { isOverdue } from '../utils/dateUtils';

isOverdue('2026-03-19')   // true  — yesterday
isOverdue('2026-03-20')   // false — today (not overdue)
isOverdue('2026-03-21')   // false — tomorrow
isOverdue(null)           // false — no due date
isOverdue(undefined)      // false — no due date
```

**Tests**: `packages/frontend/src/utils/__tests__/dateUtils.test.js` *(new)*

### 2. Overdue badge on `TodoCard`

**File**: `packages/frontend/src/components/TodoCard.js` *(modified)*

An incomplete todo whose due date is in the past renders a danger-coloured "Overdue"
badge directly below the due date text in the card content area.

```
┌──────────────────────────────────────────────┐
│  ☐  Fix the login bug                   ✎ ✕ │
│     Due: March 19, 2026                      │
│     [Overdue]                                │
└──────────────────────────────────────────────┘
```

- Badge is hidden when: todo is completed, no due date, or due date is today/future.
- Badge disappears immediately when the todo is marked complete or its due date is edited.

**Tests**: `packages/frontend/src/components/__tests__/TodoCard.test.js` *(modified)*

### 3. CSS badge styles

**File**: `packages/frontend/src/App.css` *(modified)*

The `.overdue-badge` class uses the `--danger-color` CSS token:
- Light mode: `#c62828` background, white text (contrast 5.9:1 ✓ WCAG AA)
- Dark mode: `#ef5350` background, white text (contrast 4.6:1 ✓ WCAG AA)

---

## Key Implementation Notes

| Topic | Detail |
|-------|--------|
| Date comparison | `dueDate < new Date().toISOString().slice(0, 10)` — YYYY-MM-DD string comparison avoids timezone issues |
| Overdue recalculation | Per-render; no timer, no interval, no `useEffect` |
| `todo.completed` type | SQLite returns `0`/`1`; badge condition uses `!todo.completed` (falsy check) |
| New directory | `packages/frontend/src/utils/` must be created |
| No backend changes | Feature is entirely client-side |

---

## Test-First Workflow

Per constitution Principle III: **write tests first, then implement.**

1. Create `packages/frontend/src/utils/__tests__/dateUtils.test.js` — tests for `isOverdue()`
2. Run `npm run test:frontend` → tests FAIL (expected — module doesn't exist yet)
3. Create `packages/frontend/src/utils/dateUtils.js` with `isOverdue()`
4. Run tests → they PASS
5. Extend `packages/frontend/src/components/__tests__/TodoCard.test.js` with overdue badge tests
6. Run tests → new tests FAIL
7. Modify `TodoCard.js` and `App.css`
8. Run tests → all PASS
9. Verify coverage remains ≥ 80%
