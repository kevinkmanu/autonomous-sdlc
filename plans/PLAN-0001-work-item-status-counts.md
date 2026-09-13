---
id: PLAN-0001
title: "Add a pure function that counts work items by status"
problem: "The system has no simple way to summarize how many work items are in each status."
desired_outcome: "Provide a reusable pure function that returns status counts from a list of work items, without mutating input and with explicit invalid-status rejection."
scope:
  - "Export countWorkItemsByStatus from src/work-items/count-by-status.js."
  - "Count items with the proposed case-sensitive statuses todo, in_progress, and done."
  - "Return all supported status keys for non-empty valid input, including zero counts for unmatched statuses."
  - "Return an empty object for an empty input list without mutating the list or its items."
  - "Reject invalid status items with TypeError and add focused unit coverage."
out_of_scope:
  - "Work-item persistence, APIs, UI, workflow transitions, or integration with callers."
  - "Configurable status catalogs, status normalization, or changes to unrelated work-item fields."
  - "New dependencies or changes to tooling, governance, workflows, or configuration."
acceptance_criteria:
  - id: AC-1
    text: "For valid non-empty input, countWorkItemsByStatus returns exact counts for todo, in_progress, and done; repeated statuses increment their respective counts."
    test_ref: "tests/work-items/count-by-status.test.mjs#AC-1"
  - id: AC-2
    text: "For valid non-empty input, the returned object includes exactly the supported status keys and assigns zero to each status with no matching items."
    test_ref: "tests/work-items/count-by-status.test.mjs#AC-2"
  - id: AC-3
    text: "An empty input list returns an empty object {}, not a zero-filled status object."
    test_ref: "tests/work-items/count-by-status.test.mjs#AC-3"
  - id: AC-4
    text: "Successful and rejected calls leave the input list, item order, and item properties unchanged; valid frozen lists with frozen items can be counted."
    test_ref: "tests/work-items/count-by-status.test.mjs#AC-4"
  - id: AC-5
    text: "An item that is not a non-null, non-array object with its own status property equal to todo, in_progress, or done causes TypeError; missing, null, non-string, empty, unknown, and differently cased statuses are rejected without returning partial counts."
    test_ref: "tests/work-items/count-by-status.test.mjs#AC-5"
test_strategy:
  levels:
    - unit
  coverage_target: 85
  mutation_testing: false
  notes: "Use the existing Vitest runner and one test file with AC-1 through AC-5 in test names. Cover mixed and repeated statuses, single-status lists, empty input, frozen inputs, and invalid items at the beginning and after valid entries. Target at least 85 percent coverage of the new module; do not change tooling or add dependencies to measure it. Escalate unavailable coverage tooling rather than claiming an unmeasured result."
risk_class: low
data_classification: internal
affected_paths:
  - "src/work-items/**"
  - "tests/work-items/**"
dependencies_added: []
rollback:
  strategy: "Revert the implementation and associated unit tests through a human-reviewed rollback PR; no data migration, runtime configuration, or caller integration is involved."
  verification: "Confirm the new module and its tests are removed, run the existing repository verification checks, and confirm pre-change behavior is restored."
observability:
  metrics: []
  logs: []
  alerts: []
required_approvals:
  - business_owner
---

# PLAN-0001: Add a pure function that counts work items by status

## Context

Resolves #5 in kevinkmanu/autonomous-sdlc: [Add a small pure function that counts work items by status](https://github.com/kevinkmanu/autonomous-sdlc/issues/5).

The repository has no existing work-item status model or counting helper. A small reusable function will provide deterministic summaries without persistence or other side effects. Issue #5 does not specify a status vocabulary; this plan proposes the case-sensitive values `todo`, `in_progress`, and `done`, subject to explicit business-owner confirmation during plan acceptance. They are a proposed contract, not an existing domain convention.

## Implementation approach

Add the named export `countWorkItemsByStatus(items)` in `src/work-items/count-by-status.js`, using the repository's ES module format and no new dependencies. The input contract is an array of work-item objects. Each item must have its own `status` property with one of the three supported string values; other properties are ignored and preserved.

Return a fresh empty object for an empty list. For a non-empty list, initialize a fresh result with exactly `todo`, `in_progress`, and `done` set to zero. Validate each item before incrementing its corresponding count. Throw `TypeError` for invalid items or statuses without returning partial results. Do not normalize status strings, mutate input objects, sort the list, retain shared mutable state, or perform I/O. Validation of non-array top-level arguments is outside this array-input contract.

The developer implements only within `src/work-items/**`; the tester adds unit tests only within `tests/work-items/**`, after authorization. Use one proposed test file, `tests/work-items/count-by-status.test.mjs`, with test names containing the acceptance criterion IDs referenced by the front matter. Run it with `npx vitest run tests/work-items/count-by-status.test.mjs`, followed by the required repository gates. Test references describe planned coverage and do not imply tests already exist or pass.

## Acceptance criteria

- [ ] AC-1: Count mixed and repeated valid statuses exactly.
- [ ] AC-2: Include all supported keys with zero counts for unmatched statuses in non-empty input.
- [ ] AC-3: Return exactly `{}` for an empty list.
- [ ] AC-4: Preserve input order and properties on success and rejection, including support for frozen valid inputs.
- [ ] AC-5: Throw `TypeError` for invalid items or statuses without returning partial counts.

## Risks and mitigations

Risk is low and data classification is internal. The helper performs no network, filesystem, persistence, or logging operations and introduces no dependencies. Metrics, logs, and alerts are unnecessary for this pure function; deterministic unit tests provide verification without exposing work-item contents.

The main semantic risks are an unconfirmed status vocabulary, accidental mutation, and ambiguity between empty and non-empty zero-count results. Confirm the proposed vocabulary before accepting the plan, assert exact output objects, and test frozen inputs plus rejection after valid entries. Measure the 85 percent coverage target with available tooling; any need for dependency or configuration changes requires separate scope authorization. Rollback is a reviewed revert of the isolated module and its tests.

## Authorization

This is a proposed plan, not an accepted authorization. Implementation requires authorized human acceptance of the plan pull request, completion of the low-risk `business_owner` approval from the `product-owners` reviewer team, successful required gates (`plan_schema`, `plan_acceptance`, `ci`, `tests`, and `policy`), and human merge of the plan pull request. Acceptance includes confirmation of the proposed status vocabulary and behavior contract.

The merged plan commit and plan hash become the immutable authorization reference. Subsequent implementation and testing must remain within the listed affected paths and respective agent roles. No implementation branch, implementation code, or test code is created as part of this planning task.