# Operational Guidance

## Onboarding

1. Map the logical CODEOWNERS handles in `.github/CODEOWNERS` to real organization teams.
2. Configure repository Actions permissions and allow the required workflow actions.
3. Apply `.github/rulesets/main-branch.json` to the repository's default branch.
4. Confirm the `CI` and `Governance Gates` workflows appear as required status checks.
5. Create and merge a low-risk plan pull request to verify the complete approval path.

## Escalation

Stop automated work when authorization, scope, approval, security, privacy, compliance, or safety information is missing or contradictory. Record the blocker in the agent state and route it to the designated human owner. Do not resolve a governance conflict by weakening a policy or bypassing a required review.

High and critical risk findings must be escalated to the security and engineering owners before implementation continues. Regulated or privacy-sensitive data concerns must also be escalated to the appropriate compliance or privacy owner.

## Break-glass handling

Break-glass changes are exceptional and require:

- A human owner and incident or change reference.
- A written reason, affected controls, and explicit expiration time.
- Security and engineering approval before the bypass is enabled.
- The smallest possible scope and shortest possible duration.
- A follow-up review that restores normal controls and records the outcome.

Break-glass access must never be used to approve an agent's own work, conceal a failure, or make an unreviewed production change.

## Audit expectations

Retain the plan identifier, authorization record, pull request, approvals, gate results, implementation commits, security findings, and any break-glass record for the repository's approved audit-retention period.
