# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "Support for Overdue Todo Items — Users need a clear, visual way to identify which todos have not been completed by their due date. This helps users quickly spot overdue items without having to manually check dates against today's date."

## Constitution Alignment *(mandatory)*

- **Scope Fit**: Fully within scope. The todo app already stores due dates and completion
  status. This feature adds overdue visual treatment using existing data — no out-of-scope
  behaviours (filtering, searching, categorisation) are required.
- **Persistence Impact**: No new mutations. Due date and completed fields already persist
  through the backend. Overdue status is derived at display time from existing data and
  today's date; no storage schema changes are needed. The derivation is recalculated on
  every render using the current date at render time (`Date.now()`); no timer, interval,
  or refresh mechanism is introduced for midnight boundary transitions.
- **Testing Strategy**: Tests are written first and must fail before implementation:
  - Unit: `packages/frontend/src/utils/__tests__/dateUtils.test.js` — `isOverdue()`
    returns correct boolean for boundary values (yesterday → true, today → false,
    tomorrow → false, null/undefined → false).
  - Unit: `packages/frontend/src/components/__tests__/TodoCard.test.js` — `TodoCard`
    renders the "Overdue" badge when due date is past and todo is incomplete; does not
    render the badge when completed, when due today or future, or when no due date.
  - Integration: todo list renders a mix of overdue and non-overdue cards with correct
    visual treatment for each.
- **UI & Accessibility Impact**: Overdue styling must use the documented danger colour
  (`#c62828` / `#ef5350` in dark mode), must not rely on colour alone (label required),
  must provide an accessible name on the overdue indicator, must work in both light and
  dark mode, and must meet WCAG AA contrast. The indicator form is a danger-coloured
  badge/pill with the text "Overdue" rendered below the due date text in the card content
  area; the due date text itself retains its normal styling.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visual Overdue Indicator on Todo Cards (Priority: P1)

A user opens their todo list and can immediately see which incomplete todos have passed
their due date. Each overdue card displays the existing due date text unchanged plus a
danger-coloured badge/pill labelled "Overdue" directly below the due date, so the user
does not need to read or mentally compare individual dates.

**Why this priority**: This is the core value of the feature. Without it the feature
does not exist. It can be built and validated entirely without any other story.

**Independent Test**: Create a todo with a due date of yesterday marked as incomplete.
Load the todo list. Confirm the card displays the overdue indicator. Create a second todo
due yesterday but marked complete — confirm it shows no overdue indicator.

**Acceptance Scenarios**:

1. **Given** an incomplete todo whose due date is in the past, **When** the user views
   the todo list, **Then** the card displays a visible "Overdue" indicator in the danger
   colour.
2. **Given** a completed todo whose due date is in the past, **When** the user views the
   todo list, **Then** the card does NOT display an overdue indicator.
3. **Given** an incomplete todo whose due date is today, **When** the user views the
   todo list, **Then** the card does NOT display an overdue indicator.
4. **Given** an incomplete todo with no due date set, **When** the user views the todo
   list, **Then** the card does NOT display an overdue indicator.
5. **Given** an overdue todo, **When** the user marks it as complete, **Then** the
   overdue indicator disappears immediately without a page reload.

---

### User Story 2 — Accessible Overdue Label and Dark Mode Support (Priority: P2)

A user who relies on assistive technology or uses the app in dark mode receives the same
overdue signal as sighted users in light mode. The overdue state is communicated through
both colour and a visible text label, and contrast ratios satisfy WCAG AA.

**Why this priority**: The constitution mandates accessibility and dark/light mode parity.
This story hardens P1 for compliance. It can be validated independently of any future
enhancements.

**Independent Test**: Inspect the overdue indicator element and confirm it carries a
descriptive accessible name. Switch to dark mode; confirm the indicator uses the dark-mode
danger colour and maintains readable contrast.

**Acceptance Scenarios**:

1. **Given** an overdue card is rendered, **When** inspected with an accessibility tool,
   **Then** the overdue indicator has an accessible label ("Overdue") that is announced
   by screen readers.
2. **Given** the app is in dark mode and an overdue card is present, **When** the user
   views the list, **Then** the overdue indicator uses the dark-mode danger colour and
   meets WCAG AA contrast against the dark surface background.
3. **Given** the overdue indicator conveys state via colour, **When** colour is perceived
   as absent (greyscale simulation), **Then** the text label "Overdue" remains visible
   and meaningful.

---

### Edge Cases

- **Today boundary**: A todo due today is NOT overdue; overdue means strictly before
  today's date (date-only comparison, no time component).
- **Time zone**: The comparison uses the date portion only (YYYY-MM-DD) to avoid
  time-zone inconsistencies between the browser and stored dates.
- **Due date edited to future**: When a user edits an overdue todo's due date to today or
  a future date, the overdue indicator disappears immediately after the edit is saved.
- **No due date**: Todos without a due date never display an overdue indicator.
- **All todos overdue**: The list must render correctly when every todo is overdue, with
  no layout or contrast degradation.
- **Midnight boundary (long-running session)**: Overdue state is recalculated per-render
  against `Date.now()`. If the page remains open past midnight, the indicator will update
  correctly on the next re-render (e.g., after the user interacts with any todo). No
  automatic timer or background refresh is implemented; this is accepted behaviour.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a visible "Overdue" indicator on any incomplete
  todo whose due date is strictly before today's date.
- **FR-002**: The system MUST NOT display an overdue indicator on completed todos,
  regardless of due date.
- **FR-003**: The system MUST NOT display an overdue indicator on todos with no due date.
- **FR-004**: The system MUST NOT display an overdue indicator on todos whose due date is
  today or in the future.
- **FR-005**: The overdue indicator MUST disappear immediately when a user marks an
  overdue todo as complete, without requiring a page reload.
- **FR-006**: The overdue indicator MUST disappear immediately when a user edits an
  overdue todo's due date to today or a future date.
- **FR-007**: The overdue indicator MUST be a badge/pill rendered below the due date text
  in the card content area, using the documented danger colour, and MUST include the
  visible text label "Overdue" (colour alone is insufficient). The due date text itself
  MUST retain its normal styling.
- **FR-008**: The overdue indicator MUST carry an accessible name readable by screen
  readers.
- **FR-009**: The overdue visual treatment MUST function correctly in both light and dark
  mode, using the corresponding danger-colour token for each mode.

### Out of Scope

- Filtering the list to show only overdue todos.
- Sorting the list to surface overdue todos at the top.
- Sending notifications or reminders for overdue todos.
- Highlighting or counting overdue items in the page header or title.
- Any server-side calculation or persistence of overdue status.
- Recurring todos or snooze-and-reschedule behaviours.

### Key Entities

- **Todo**: Existing entity. Relevant attributes: `dueDate` (optional date string,
  YYYY-MM-DD) and `completed` (boolean). Overdue status is a derived read-only property:
  `dueDate` is set, `dueDate` is strictly before today's date, and `completed` is false.
- **isOverdue utility**: A pure function exported from
  `packages/frontend/src/utils/dateUtils.js` with signature
  `isOverdue(dueDate: string | null | undefined): boolean`. Performs date-only string
  comparison (YYYY-MM-DD) against today; returns `false` for null, undefined, or
  dates ≥ today.

## Clarifications

### Session 2026-03-20

- Q: What is the exact visual form and placement of the overdue indicator on a TodoCard? → A: The due date text remains unchanged; a separate danger-coloured badge/pill labelled "Overdue" is rendered below the due date in the card content area (Option A).
- Q: Where does the `isOverdue()` date-comparison logic live? → A: Standalone pure utility function in `packages/frontend/src/utils/dateUtils.js` (Option A).
- Q: When is overdue status recalculated — per-render, on a timer, or on page load only? → A: Client-side, recalculated per-render against `Date.now()`; no timer or refresh mechanism needed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user with at least one overdue incomplete todo can identify it as overdue
  within 3 seconds of loading the todo list, without reading or comparing dates manually.
- **SC-002**: Zero false positives: completed todos, todos with no due date, and todos due
  today or later never show an overdue indicator under any combination of inputs.
- **SC-003**: The overdue indicator is announced correctly by a screen reader on the first
  pass through the todo list.
- **SC-004**: The danger-colour text used for the overdue indicator achieves at least a
  4.5:1 contrast ratio against its background in both light and dark mode.
- **SC-005**: All new behaviour paths are covered by unit and integration tests, and
  overall package test coverage remains at or above 80%.
