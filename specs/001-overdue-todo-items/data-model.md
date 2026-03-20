# Data Model: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-items`  
**Date**: 2026-03-20

---

## Entities

### Todo *(existing — no schema changes)*

The `Todo` entity is already defined and persisted via better-sqlite3. This feature adds
no new fields, migrations, or backend mutations.

| Field       | Type                    | Constraints                          | Notes                              |
|-------------|-------------------------|--------------------------------------|------------------------------------|
| `id`        | integer                 | PRIMARY KEY AUTOINCREMENT            | Unchanged                          |
| `title`     | string (≤255 chars)     | NOT NULL                             | Unchanged                          |
| `completed` | integer (0 or 1)        | NOT NULL, default 0                  | Unchanged; `0` = incomplete, `1` = complete |
| `dueDate`   | string (YYYY-MM-DD)     | NULLABLE                             | Unchanged; null means no due date  |
| `createdAt` | ISO 8601 string         | NOT NULL                             | Unchanged                          |

### Derived property: `isOverdue`

`isOverdue` is NOT a stored field. It is a **read-only derived boolean** computed at
display time in the frontend.

**Definition**:
> A todo is overdue if and only if: `dueDate` is set AND `dueDate < today's date (YYYY-MM-DD)` AND `completed === 0 (or falsy)`.

**Derivation logic**:

```
isOverdue(dueDate: string | null | undefined) → boolean

  if dueDate is null, undefined, or empty string → return false
  today = new Date().toISOString().slice(0, 10)   // "YYYY-MM-DD" UTC
  return dueDate < today                          // lexicographic comparison on ISO dates
```

**Usage in render**:
```
show badge = !todo.completed && isOverdue(todo.dueDate)
```

---

## Validation Rules

| Rule | Source | Enforcement |
|------|--------|-------------|
| `isOverdue()` returns `false` for null/undefined/empty `dueDate` | FR-003 | guard clause in `dateUtils.js` |
| `isOverdue()` returns `false` when `dueDate === today` | FR-004 | strict `<` comparison (not `<=`) |
| `isOverdue()` returns `false` when `dueDate` is in the future | FR-004 | YYYY-MM-DD lexicographic ordering |
| Badge NOT shown when `todo.completed` is truthy | FR-002 | `!todo.completed` guard in `TodoCard.js` |
| Badge disappears immediately on toggle | FR-005 | React re-render; no additional state |
| Badge disappears immediately on due date edit to future | FR-006 | React re-render; no additional state |

---

## State Transitions

The overdue badge has no independent state. It tracks the existing `Todo` data:

```
TodoCard renders:
  ├── todo.completed is truthy                 → badge hidden (FR-002)
  ├── todo.dueDate is null/undefined/empty     → badge hidden (FR-003)
  ├── todo.dueDate >= today                    → badge hidden (FR-004)
  └── todo.dueDate < today AND !completed      → badge shown  (FR-001)

User marks todo complete:
  completed: 0 → 1  →  React re-render  →  badge hidden immediately (FR-005)

User edits dueDate to future or today:
  dueDate changes  →  React re-render  →  badge hidden immediately (FR-006)
```

---

## New Module

**`packages/frontend/src/utils/dateUtils.js`**

| Export     | Signature                                                  | Description                                |
|------------|------------------------------------------------------------|--------------------------------------------|
| `isOverdue` | `(dueDate: string | null | undefined) => boolean`         | Returns true iff dueDate is strictly before today's date (YYYY-MM-DD UTC comparison). Returns false for any falsy input. |

---

## No Backend Changes

This feature requires zero backend changes:

- No new API endpoints
- No new request/response fields
- No schema migrations
- No server-side overdue logic

Overdue status is derived entirely from existing data already available in the `Todo`
objects returned by the existing `GET /api/todos` endpoint.
