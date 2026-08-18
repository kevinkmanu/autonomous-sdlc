# Rego Policy Contract

Policies in this directory evaluate one normalized JSON document supplied as `input`.

The input must provide:

- `plan.id`, `plan.affected_paths`, and `plan.dependencies_added`
- `authorization.planId` and `authorization.planHash`
- `pr.plan_id`, `pr.changed_files`, `pr.title`, and `pr.body`
- `pr.approvals`, `pr.commits`, `pr.author`, `pr.additions`, and `pr.deletions`
- `dependencies[]` with `name` and `license`

Each policy exposes deny messages. A compliant input produces no messages.

The policies intentionally use normalized input rather than calling GitHub APIs. Phase 6 workflows will construct this input from pull request and repository data before invoking Conftest.
