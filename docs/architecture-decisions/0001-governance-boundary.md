# ADR-0001: Keep Governance Evaluation Deterministic

- Status: accepted
- Date: 2026-08-18

## Decision

Governance policies evaluate one normalized JSON document. GitHub workflows and adapters are responsible for collecting pull request, plan, authorization, dependency, and commit data and producing that document.

## Rationale

Keeping Rego independent from GitHub APIs makes policy behavior deterministic, locally testable, and reusable by other CI systems. It also limits external credentials and keeps data collection separate from policy evaluation.

## Consequences

- Workflow adapters must validate the normalized input before invoking Conftest.
- Policy fixtures remain stable even when GitHub API responses change.
- GitHub-specific authentication, retries, and audit handling belong in the integration layer.
- A policy passing locally does not replace required GitHub approvals or repository rulesets.
