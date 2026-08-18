---
applyTo: "src/**, app/**, lib/**"
---

# Implementation Code Standards

Changes to application code must:

1. **Start from an accepted plan.** No implementation without Plan acceptance and required approvals.
2. **Respect scope containment.** Changes remain within the plan's affected_paths.
3. **Include tests.** Implementation must be paired with test coverage from the Testing Agent.
4. **Reference the plan ID.** Commit messages must include the plan ID (e.g., `Plan: PLAN-0042`).
5. **Pass security and policy checks.** CodeQL, dependency review, secrets detection, and Rego policies must pass.
6. **Avoid protected paths.** Do not modify `.github/`, `governance/`, or `infra/` in implementation PRs.
7. **Follow conventional commits.** Use `feat:`, `fix:`, `refactor:`, etc., with proper scope and body.
