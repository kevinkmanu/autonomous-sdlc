---
applyTo: "governance/**, .github/workflows/**, .github/CODEOWNERS, .github/copilot-instructions.md"
---

# Governance and Workflow Code Standards

Changes to governance, workflows, and agent constraints:

1. **Require governance-board CODEOWNERS approval.** All governance changes require human review.
2. **Document the rationale.** Changes to policy or agent constraints must include an ADR or issue link.
3. **Test local validation first.** Run `npm run verify && npm run policy:verify` locally before opening a PR.
4. **Maintain schema compliance.** Governance files must validate against their schemas.
5. **Cannot be made by agents.** Agents cannot modify or approve governance changes.
6. **Backwards compatibility.** Changes must not break existing accepted plans or ongoing work.
7. **Versioning.** Governance files should include a version field for tracking.
