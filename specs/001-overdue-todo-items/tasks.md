---
description: "Task list for 001-overdue-todo-items feature implementation"
---

# Tasks: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-items`
**Input**: Design documents from `specs/001-overdue-todo-items/`
**Branch**: `001-overdue-todo-items`
**Date**: 2026-03-20

**Tests**: Tests are REQUIRED for every user story and behavior change. Test tasks are listed
first within each story phase and MUST be written and confirmed failing before implementation begins.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Exact file paths are included in every task description

---

## Phase 1: Setup

**Purpose**: Confirm baseline project state before making any changes

- [ ] T001 Verify all pre-existing tests pass by running `npm run test:frontend` from repo root and recording current coverage baseline

**Checkpoint**: Baseline confirmed — all pre-existing tests pass and coverage is recorded

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared infrastructure that must exist before any user story work begins

**Note**: No foundational infrastructure changes are required for this feature. The project
structure, React app, SQLite backend, and test toolchain are all in place. The only new
directory (`packages/frontend/src/utils/`) is created implicitly when the first file is
written in Phase 3. Proceed directly to User Story phases.

**Checkpoint**: No blocking foundational work — user story phases can begin immediately after Phase 1

---

## Phase 3: User Story 1 — Visual Overdue Indicator on Todo Cards (Priority: P1) 🎯 MVP

**Goal**: Render a danger-coloured "Overdue" badge on any incomplete `TodoCard` whose
`dueDate` is strictly before today's date, derived entirely client-side with no backend changes.

**Independent Test**: Add an incomplete todo with yesterday's date → confirm the "Overdue"
badge renders below the due date text. Add a second todo with yesterday's date marked complete
→ confirm no badge appears.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST and confirm they FAIL before writing any implementation code.**

- [ ] T002 [P] [US1] Create `packages/frontend/src/utils/__tests__/dateUtils.test.js` with `isOverdue()` unit tests: pin clock to 2026-03-20 via `jest.useFakeTimers({ now: new Date('2026-03-20') })`, assert `'2026-03-19'` → `true`, `'2026-03-20'` → `false`, `'2026-03-21'` → `false`, `null` → `false`, `undefined` → `false`, `''` → `false`; restore clock in `afterEach`
- [ ] T003 [P] [US1] Extend `packages/frontend/src/components/__tests__/TodoCard.test.js` with overdue badge rendering tests: (a) incomplete todo with past due date renders element with text "Overdue"; (b) completed todo with past due date renders NO "Overdue" element; (c) incomplete todo due today renders NO "Overdue" element; (d) incomplete todo with no due date renders NO "Overdue" element; (e) incomplete todo with future due date renders NO "Overdue" element — pin clock to 2026-03-20 for each test

### Implementation for User Story 1

- [ ] T004 [US1] Create `packages/frontend/src/utils/dateUtils.js` exporting `isOverdue(dueDate)`: guard clause returning `false` for falsy input; compute `today = new Date().toISOString().slice(0, 10)`; return `dueDate < today` (lexicographic YYYY-MM-DD comparison) (depends on T002 failing first)
- [ ] T005 [P] [US1] Add `.overdue-badge` CSS class to `packages/frontend/src/App.css` after the `.todo-due-date` rule block: `display: inline-block; margin-top: 4px; padding: 2px 8px; background-color: var(--danger-color); color: #ffffff; font-size: 11px; font-weight: 600; border-radius: var(--radius-sm); letter-spacing: 0.02em;` (can run in parallel with T004)
- [ ] T006 [US1] Modify `packages/frontend/src/components/TodoCard.js`: import `isOverdue` from `'../utils/dateUtils'`; inside the non-editing return branch, render `{!todo.completed && isOverdue(todo.dueDate) && <span className="overdue-badge">Overdue</span>}` directly after the `todo-due-date` paragraph (depends on T004 and T005)
- [ ] T007 [US1] Run `npm run test:frontend` and confirm all US1 tests in `dateUtils.test.js` and `TodoCard.test.js` pass; confirm overall coverage remains ≥ 80%

**Checkpoint**: User Story 1 fully functional — overdue badge renders and hides correctly for all
acceptance scenarios; disappears immediately on toggle or due date edit via React re-render

---

## Phase 4: User Story 2 — Accessible Overdue Label and Dark Mode Support (Priority: P2)

**Goal**: Harden the overdue badge from Phase 3 to satisfy WCAG AA accessibility requirements
and confirm correct visual treatment in dark mode, ensuring the indicator is announced by
screen readers and is meaningful without colour.

**Independent Test**: Inspect the rendered overdue badge element — confirm it has an accessible
name readable by screen readers. Switch the app to dark mode — confirm the `.overdue-badge`
element uses `var(--danger-color)` which resolves to `#ef5350` in dark mode.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST and confirm they FAIL before writing any implementation code.**

- [ ] T008 [P] [US2] Extend `packages/frontend/src/components/__tests__/TodoCard.test.js` with an accessibility test: render an overdue `TodoCard` and query the badge via `screen.getByRole('status')` — confirm it is present in the document and its accessible name includes "Overdue" (depends on T006 complete)
- [ ] T009 [P] [US2] Extend `packages/frontend/src/components/__tests__/TodoCard.test.js` with a CSS class test: render an overdue `TodoCard` and confirm the badge element has `className` containing `overdue-badge`; confirm the badge element does NOT appear when `todo.completed === 1` (verifies that colour alone is supplemented by visible text and class) (depends on T006 complete)

### Implementation for User Story 2

- [ ] T010 [US2] Update the overdue badge in `packages/frontend/src/components/TodoCard.js` — change `<span className="overdue-badge">Overdue</span>` to `<span className="overdue-badge" role="status" aria-label="Overdue">Overdue</span>` to satisfy screen reader announcement (FR-008); the visible text "Overdue" also satisfies colour-independence (FR-007) (depends on T008 and T009 failing first)
- [ ] T011 [US2] Run `npm run test:frontend` and confirm all US2 accessibility tests pass; confirm coverage remains ≥ 80%; visually verify dark mode by inspecting `--danger-color` resolves to `#ef5350` in browser devtools with `[data-theme="dark"]`

**Checkpoint**: User Story 2 complete — overdue badge announced by screen readers, visible without
colour, and dark mode danger token confirmed

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final end-to-end validation and quality assurance across both user stories

- [ ] T012 [P] Execute all manual quickstart.md scenarios: (a) incomplete todo with past due date → badge shows; (b) completed past-due todo → no badge; (c) mark overdue todo complete → badge disappears immediately; (d) edit overdue todo due date to future → badge disappears immediately; (e) render list where every todo is overdue → no layout degradation
- [ ] T013 [P] Run full monorepo test suite via `npm test` from repo root and confirm frontend AND backend tests all pass with no regressions
- [ ] T014 Verify WCAG AA contrast ratios in browser devtools: light mode `#c62828` on white background ≥ 4.5:1 ✓; dark mode `#ef5350` on dark surface ≥ 4.5:1 ✓ (reference: research.md contrast check results)

**Checkpoint**: Feature complete, all acceptance criteria met, ready for pull request

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Baseline)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: N/A — no blocking work; proceed to Phase 3 after Phase 1
- **Phase 3 (US1)**: Depends on Phase 1 — MUST complete before Phase 4 (US2 extends US1 implementation)
- **Phase 4 (US2)**: Depends on T006 (US1 `TodoCard.js` modification complete)
- **Phase 5 (Polish)**: Depends on Phase 3 AND Phase 4 both complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 baseline check. No dependency on US2.
- **User Story 2 (P2)**: Depends on T006 (US1 implementation) to extend. Tests T008/T009 can be written in parallel with T007 verification.

### Within Each User Story

1. Tests MUST be written and confirmed FAILING before implementation begins
2. `dateUtils.js` (T004) must precede `TodoCard.js` modification (T006)
3. `App.css` changes (T005) can run in parallel with `dateUtils.js` (T004)
4. Run and verify tests (T007 / T011) after all implementation tasks in the story

### Parallel Opportunities

- **T002 + T003**: Write `dateUtils` tests and extend `TodoCard` tests in parallel (different files, both write-test phase)
- **T004 + T005**: Implement `dateUtils.js` and add CSS to `App.css` in parallel (different files, no dependency between them)
- **T008 + T009**: Both within `TodoCard.test.js` — prefer sequential to avoid merge conflicts; can be parallelised by different developers working on separate `it()` blocks
- **T012 + T013**: Manual quickstart and full test suite can run concurrently in Phase 5

---

## Parallel Execution Examples

### User Story 1 (full parallelism within story)

```
T001 (baseline)
  └─→ T002 + T003 (parallel: write failing tests)
        └─→ T004 + T005 (parallel: implement dateUtils + CSS)
              └─→ T006 (TodoCard integration: depends on T004 + T005)
                    └─→ T007 (verify tests pass + coverage)
```

### User Story 2 (extends US1 output)

```
T006 complete
  └─→ T008 + T009 (write failing accessibility tests)
        └─→ T010 (add role + aria-label to badge)
              └─→ T011 (verify tests pass + coverage)
```

### Polish (parallel opportunities)

```
T011 complete
  └─→ T012 + T013 (parallel: manual scenarios + full test suite)
        └─→ T014 (WCAG contrast verification)
```

---

## Implementation Strategy

**MVP Scope**: User Story 1 alone (T001–T007) delivers the complete end-user value of the feature.
User Story 2 (T008–T011) hardens it for accessibility compliance and dark mode parity.

**Incremental delivery order**:
1. **Phase 1** (T001) → Baseline confirmed
2. **Phase 3 US1** (T002–T007) → **Ship MVP**: overdue badge visible and functional
3. **Phase 4 US2** (T008–T011) → Accessibility and dark mode hardened
4. **Phase 5** (T012–T014) → Polish, verified, PR-ready
