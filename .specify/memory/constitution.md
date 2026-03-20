<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template Principle 1 -> I. Scope Discipline
- Template Principle 2 -> II. Monorepo Boundary Integrity
- Template Principle 3 -> III. Test-First Behavior Verification
- Template Principle 4 -> IV. Accessible Themed Experience
- Template Principle 5 -> V. Immediate Persistence And Graceful Failure
Added sections:
- Delivery Constraints
- Workflow & Quality Gates
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ⚠ pending: None
Follow-up TODOs:
- None
-->

# AI Coding Assistant Enablement Bootcamp Session 6 Constitution

## Core Principles

### I. Scope Discipline
All changes MUST remain within the documented single-user todo application scope unless
the feature spec explicitly amends the functional requirements and this constitution in
the same change. Implementations MUST preserve the required todo behaviors: create,
view, edit, complete, delete with confirmation, newest-first ordering, required title,
optional due date, and backend persistence. Features explicitly listed as out of scope,
including authentication, collaboration, search, filtering, tags, bulk actions, undo,
and mobile-specific feature work, MUST NOT be introduced implicitly.

Rationale: The project is a constrained bootcamp application; scope discipline keeps the
codebase teachable, reviewable, and aligned with documented expectations.

### II. Monorepo Boundary Integrity
The repository MUST remain a JavaScript npm-workspaces monorepo with a React frontend in
`packages/frontend` and an Express backend in `packages/backend`. Changes MUST preserve
clear separation between UI, services, and API concerns; modules and components MUST have
single responsibilities; naming MUST follow the documented camelCase, PascalCase, and
UPPER_SNAKE_CASE conventions; imports MUST be ordered consistently; and files MUST retain
2-space indentation, LF line endings, and no trailing whitespace. Complex abstractions,
duplicate logic, and circular dependencies MUST be avoided unless justified in the plan.

Rationale: The codebase is intentionally small; maintainability depends on disciplined
boundaries and predictable structure rather than architectural ceremony.

### III. Test-First Behavior Verification
Every behavior change MUST begin with tests that define the expected outcome before the
implementation is considered complete. Frontend and backend work MUST add or update unit
and integration tests in colocated `__tests__/` directories, using descriptive names,
AAA structure, isolated data, and behavior-focused assertions. Root and package-level
test suites MUST pass before merge, overall coverage MUST remain at or above 80%, and
critical user workflows MUST receive explicit coverage.

Rationale: Test-first delivery is the project’s primary protection against regressions in
shared bootcamp exercises and enforces clarity about intended behavior.

### IV. Accessible Themed Experience
User-facing changes MUST follow the documented Halloween-themed, Material-inspired design
system and MUST preserve both light and dark mode behavior. Interfaces MUST remain
keyboard accessible, provide visible focus states, meet WCAG AA contrast expectations,
use descriptive labels for controls and icon buttons, and stay responsive across mobile,
tablet, and desktop breakpoints. Theme preference MUST persist for the user, and empty,
error, and confirmation states MUST be intentionally designed rather than left implicit.

Rationale: The UI guidelines are part of the product definition, not optional polish;
consistency and accessibility are required behaviors.

### V. Immediate Persistence And Graceful Failure
Todo mutations MUST persist immediately through the existing Express API and MUST provide
clear user feedback when operations fail. Implementations MUST validate data at module and
API boundaries, use meaningful error messages, and avoid silent failures. Storage changes
MUST stay compatible with the current basic todo persistence approach unless a feature spec
and plan explicitly justify a broader architectural change.

Rationale: Reliability in a simple app comes from predictable persistence semantics and
obvious failure handling, not from hidden retries or undefined states.

## Delivery Constraints

- Technology stack decisions for routine feature work MUST stay within React, Express,
	Jest, Testing Library, and the existing npm workspace tooling unless the change is an
	approved constitutional or architectural amendment.
- Feature specs MUST document scope boundaries, affected user stories, persistence impact,
	test strategy, and UI or accessibility impact before implementation planning begins.
- Documentation updates in `docs/` and feature artifacts in `specs/` MUST accompany any
	change that alters requirements, testing expectations, or user experience rules.
- Simplicity is mandatory: prefer the smallest coherent implementation that satisfies the
	accepted requirement, and document any deliberate complexity in the plan.

## Workflow & Quality Gates

- Every implementation plan MUST complete a Constitution Check covering scope,
	architecture boundaries, testing, UI accessibility, and persistence semantics before
	design or coding proceeds.
- Every task list MUST include test work for each user story and MUST identify any
	documentation, accessibility, or persistence tasks required by that story.
- Pull requests and reviews MUST verify that changed behavior is covered by tests, that
	the relevant workspace test commands pass, and that any deviation from the principles is
	explicitly justified and approved.
- When requirements or governance change, the constitution, dependent templates, and the
	affected docs MUST be updated in the same change set to avoid drift.

## Governance

This constitution is the authoritative process document for the repository. When guidance
in other files conflicts with it, this constitution takes precedence until the dependent
artifacts are brought back into sync.

Amendments MUST include: a documented rationale, updates to all affected templates and
guidance files, and a version bump selected by semantic versioning rules. MAJOR versions
apply to removed or fundamentally redefined principles, MINOR versions apply to new
principles or materially expanded governance, and PATCH versions apply to clarifications
that do not change expected team behavior.

Compliance review is mandatory at specification, planning, task generation, and pull
request review time. Reviewers MUST reject work that violates a core principle without an
approved documented exception.

**Version**: 1.0.0 | **Ratified**: 2026-03-20 | **Last Amended**: 2026-03-20
