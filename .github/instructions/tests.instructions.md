---
applyTo: "tests/**, test/**, spec/**"
---

# Test Code Standards

Tests added by the Testing Agent must:

1. **Verify acceptance criteria.** Each test references a specific AC from the plan.
2. **Cover happy path and error cases.** Unit, integration, and e2e tests as specified in the plan's test_strategy.
3. **Meet coverage targets.** Patch coverage >= the plan's coverage_target (default 85%).
4. **Support mutation testing.** Tests must be strong enough to catch code mutations.
5. **Avoid skips and assertions-free tests.** No `skip()`, `xit()`, or tests with no assertions.
6. **Reference the plan ID.** Comments in tests should reference the plan (e.g., `// Plan: PLAN-0042, AC-1`).
7. **Be executable.** All tests must pass before the implementation PR is marked ready for review.
