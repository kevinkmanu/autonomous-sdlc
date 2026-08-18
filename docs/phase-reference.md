# Autonomous SDLC Phase Reference

This document is the working reference for the build sequence. The plan artifact is created before implementation, but implementation of the repository itself follows these phases.

## Phase 1 — Repository Foundation

Establish the project shell and operating conventions:

- Node.js package configuration and validation scripts
- TypeScript configuration for future validators and tests
- Git, editor, dependency-update, contribution, and security configuration
- Repository README and basic developer commands

Status: complete.

## Phase 2 — Governance Data Model

Define the machine-readable contracts that control plans and agent behavior:

- Plan JSON Schema
- Risk and approval matrix
- Protected paths
- Agent identity and write-path policy
- Dependency allowlist
- Plan template and example

Status: complete.

## Phase 3 — Plan Acceptance and Authorization Validation

Implement deterministic checks that ensure an authorized user accepts a plan through a pull request before implementation begins:

- Plan completeness and schema validation
- Authorized approver validation
- Approval freshness after plan changes
- Risk-based approval resolution
- Immutable authorization record
- Exact accepted-plan linkage for implementation branches

Status: complete. The deterministic authorization module, CLI checks, plan gate, and post-merge branch provisioning are implemented.

## Phase 4 — Policy Enforcement

Add declarative Rego policies and tests for scope, plan linkage, protected paths, dependencies, signed commits, and pull request hygiene.

Status: complete. Rego policies, policy tests, local verification, and the pinned Conftest GitHub Actions gate are implemented.

## Phase 5 — Copilot Agent Definitions

Define the Orchestrator, Planning, Development, Testing, and Security Review agents, including responsibilities, permitted paths, handoffs, refusal conditions, and escalation rules.

Status: complete. Agent charters, instructions, and reusable prompts are implemented in `.github/agents/`, `.github/instructions/`, and `.github/prompts/`.

## Phase 6 — GitHub Actions Workflows

Wire governance and engineering checks into GitHub:

- Plan pull request gates
- Branch provisioning after accepted-plan merge
- CI and test quality checks
- Security scanning
- Policy enforcement
- Provenance, deployment stub, and audit events

Status: complete. Plan gates, branch provisioning, CI, test quality, security scanning, policy enforcement, provenance, deployment shape, and audit logging are implemented in `.github/workflows/`.

## Phase 7 — CODEOWNERS and Repository Templates

Configure ownership, issue forms, pull request templates, Dependabot, and approval routing for governance, security, infrastructure, plans, tests, and application paths.

Status: in progress. CODEOWNERS, pull request governance checks, and issue forms are implemented; organization-specific team mapping and required-review rulesets remain.

## Phase 8 — Rulesets and Operational Documentation

Capture branch protection as code and document onboarding, escalation, break-glass handling, and architectural decisions.

Status: in progress. A main-branch ruleset definition, onboarding guidance, escalation and break-glass procedures, and an architecture decision record are implemented; applying the ruleset and configuring organization-specific owners remain.

## Phase 9 — Self-Validation

Use valid and intentionally invalid fixtures to prove that each governance control produces the expected result. Expose the complete local validation through `npm run verify`.

Status: in progress. Authorization fixtures and regression tests cover valid and invalid outcomes, and `npm run verify` executes the full local validation flow; live GitHub integration scenarios remain.

## Lifecycle Boundary

The Planning Agent may create only the plan branch and plan pull request. The implementation branch is created only after the plan PR passes plan-specific checks, receives authorized user acceptance and required risk-based approvals, and merges.
