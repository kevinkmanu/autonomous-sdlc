---
id: PLAN-0000
title: "Short change title"
problem: "What problem requires a change?"
desired_outcome: "What observable outcome should users or operators get?"
scope:
  - "In-scope capability or behavior"
out_of_scope:
  - "Explicitly excluded capability"
acceptance_criteria:
  - id: AC-1
    text: "A verifiable behavior is true."
    test_ref: "tests/path/to/test.ts"
test_strategy:
  levels:
    - unit
  coverage_target: 85
  mutation_testing: false
  notes: "Describe important test boundaries."
risk_class: low
data_classification: internal
affected_paths:
  - "src/example/**"
dependencies_added: []
rollback:
  strategy: "Describe how the change is disabled or reverted."
  verification: "Describe how rollback is verified."
observability:
  metrics: []
  logs: []
  alerts: []
required_approvals:
  - business_owner
---

# PLAN-0000: Short change title

## Context

Describe the current behavior and why the change is needed.

## Implementation approach

Describe the intended approach without prescribing unnecessary implementation detail.

## Acceptance criteria

- [ ] AC-1: A verifiable behavior is true. (`tests/path/to/test.ts`)

## Risks and mitigations

Describe material risks, mitigations, and operational considerations.

## Authorization

This plan becomes implementation authorization only after an authorized user accepts the plan pull request, required risk-based approvals are complete, and the plan pull request is merged. The merge commit and plan hash are the immutable authorization reference.
