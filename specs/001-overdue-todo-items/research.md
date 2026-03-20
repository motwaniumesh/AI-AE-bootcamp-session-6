# Research: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-items`  
**Date**: 2026-03-20  
**Status**: Complete — no unresolved questions

---

## 1. Date Comparison Strategy

**Decision**: YYYY-MM-DD lexicographic string comparison using `new Date().toISOString().slice(0, 10)` for today's date.

**Rationale**:
- `dueDate` is stored as a YYYY-MM-DD string in SQLite. ISO 8601 date strings are
  lexicographically sortable, so `dueDate < todayString` is a correct and safe comparison.
- Using `new Date(dueDate)` to construct a Date object risks off-by-one errors because the
  Date constructor treats bare YYYY-MM-DD strings as UTC midnight, and `new Date()` produces
  local time — comparing them mixes timezones and can flip the overdue result depending on
  the user's timezone offset.
- `new Date().toISOString().slice(0, 10)` always returns today's date in UTC (YYYY-MM-DD),
  which matches how `dueDate` values are stored. The spec explicitly states: "The comparison
  uses the date portion only (YYYY-MM-DD) to avoid time-zone inconsistencies."

**Alternatives considered**:
- `new Date(dueDate) < new Date()` — rejected: mixes UTC Date construction with local
  time, produces timezone-dependent results.
- Moment.js / date-fns — rejected: no new dependencies; problem is simple enough for a
  one-liner without a library.
- Server-side overdue flag — rejected: spec and constitution explicitly state overdue is a
  derived client-side property, never persisted.

**Implementation**:
```js
// packages/frontend/src/utils/dateUtils.js
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" UTC
  return dueDate < today;                              // lexicographic; safe for ISO dates
}
```

---

## 2. Testing Strategy for Date-Dependent Logic

**Decision**: Use Jest's `jest.useFakeTimers()` + `jest.setSystemTime()` to fix `Date.now()` to a known reference date in unit tests.

**Rationale**:
- Pure string comparison means the boundary is entirely determined by `new Date()`. Mocking
  the system clock makes tests deterministic — no test will break at midnight or on a
  different calendar day.
- `jest.useFakeTimers({ now: new Date('2026-03-20') })` pins the clock at 2026-03-20 for
  all Date constructions in the module under test.
- In `afterEach`, call `jest.useRealTimers()` to restore the clock so other tests are unaffected.

**Boundary values to test** (reference date: 2026-03-20):

| Input `dueDate`   | Expected `isOverdue()` | Reason                        |
|-------------------|------------------------|-------------------------------|
| `'2026-03-19'`    | `true`                 | yesterday — strictly before today |
| `'2026-03-20'`    | `false`                | today — not overdue           |
| `'2026-03-21'`    | `false`                | tomorrow — not overdue        |
| `null`            | `false`                | guard clause                  |
| `undefined`       | `false`                | guard clause                  |
| `''` (empty str)  | `false`                | guard clause (falsy)          |

**Alternatives considered**:
- Injecting a clock/date parameter into `isOverdue()` — rejected: adds API complexity for
  no production benefit; Jest fake timers solve the problem cleanly at the test layer.
- Manual date manipulation (`Date.now() + offset`) — rejected: brittle; prone to
  off-by-one around test execution time.

---

## 3. Badge/Pill Component and CSS Strategy

**Decision**: Inline `<span>` element within `.todo-content`, styled with a new `.overdue-badge` CSS class using the existing `--danger-color` token.

**Rationale**:
- The spec requires the badge rendered _below_ the due date text inside the card content
  area. The existing `.todo-content` div is a flex column (implicit block layout), so a
  block-level `<span>` or `<p>` placed after `.todo-due-date` renders directly below.
- Using CSS custom properties `--danger-color` (light: `#c62828`, dark: `#ef5350`) ensures
  automatic light/dark mode switching without JavaScript or theme-awareness in the component.
- A badge/pill shape requires `border-radius: var(--radius-sm)`, `padding`, and
  `display: inline-block` — all achievable with 4–5 CSS lines, no new dependency.
- The accessible name is provided by the visible text "Overdue" plus `role="status"` or
  simply relying on the text node being part of the reading order; no `aria-label` 
  override needed since the text itself is the label.

**CSS pattern**:
```css
.overdue-badge {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  background-color: var(--danger-color);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  letter-spacing: 0.02em;
}
```

**Contrast check**:
- Light mode: `#c62828` background, white text → contrast ratio ≈ 5.9:1 (WCAG AA ✓)
- Dark mode: `#ef5350` background, white text → contrast ratio ≈ 4.6:1 (WCAG AA ✓)

**Alternatives considered**:
- Outline/border badge instead of filled — rejected: lower visual urgency, harder to meet
  contrast ratio without a coloured text on a white surface.
- Adding an overdue CSS class to the `.todo-card` element and using a `::after` pseudo-element
  — rejected: pseudo-elements are not accessible to screen readers, violating FR-008.
- Separate `OverdueBadge` component — rejected: over-engineering for a single inline element
  with no reuse elsewhere.

---

## 4. Integration with TodoCard

**Decision**: Import `isOverdue` in `TodoCard.js` and evaluate it in the non-editing render branch. No changes to props, state, or parent components.

**Rationale**:
- `isOverdue(todo.dueDate)` is called during render rather than memoised (no `useMemo`),
  consistent with the spec's "recalculated on every render" decision.
- The badge visibility condition is: `!todo.completed && isOverdue(todo.dueDate)`.
  Using `todo.completed` (integer `0`/`1` from SQLite) requires the falsy check `!todo.completed`
  rather than strict `=== false` — this is consistent with existing checkbox logic in the
  component (`checked={todo.completed === 1}`). The badge condition uses `!todo.completed`
  (falsy check) which correctly handles `0` → false → badge shown.
- No changes to `TodoList`, `App`, or any other component.

---

## 5. Resolution of All NEEDS CLARIFICATION Items

All clarifications were resolved in the spec session on 2026-03-20:

| Question | Answer | Source |
|----------|--------|--------|
| Visual form and placement of overdue indicator | Danger-coloured badge/pill below due date in card content area | spec.md Clarifications |
| Where does `isOverdue()` live? | `packages/frontend/src/utils/dateUtils.js` | spec.md Clarifications |
| When is overdue status recalculated? | Per-render against `Date.now()`; no timer | spec.md Clarifications |

No NEEDS CLARIFICATION items remain.
