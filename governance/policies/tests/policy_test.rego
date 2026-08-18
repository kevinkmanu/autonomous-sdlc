package sdlc

import rego.v1

valid_input := {
  "plan": {
    "id": "PLAN-0042",
    "affected_paths": ["src/orders/**"],
    "dependencies_added": []
  },
  "authorization": {
    "planId": "PLAN-0042",
    "planCommit": "abc123",
    "planHash": "hash123",
    "approved": true
  },
  "pr": {
    "plan_id": "PLAN-0042",
    "plan_commit": "abc123",
    "plan_hash": "hash123",
    "changed_files": ["src/orders/export.ts"],
    "human_approved_protected_paths": [],
    "title": "feat(orders): add export",
    "body": "Plan: PLAN-0042",
    "approvals": [{"actor_type": "User"}],
    "commits": [{"verified": true}],
    "author": "developer",
    "additions": 20,
    "deletions": 5,
    "large_change_approved": false
  },
  "dependencies": []
}

test_compliant_input if {
  denied := data.sdlc.deny with input as valid_input
  count(denied) == 0
}

test_rejects_unlinked_plan if {
  test_input := object.union(valid_input, {
    "pr": object.union(valid_input.pr, {"plan_id": "PLAN-9999"})
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}

test_rejects_scope_violation if {
  test_input := object.union(valid_input, {
    "pr": object.union(valid_input.pr, {"changed_files": ["src/payments/secret.ts"]})
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}

test_rejects_unsigned_commit if {
  test_input := object.union(valid_input, {
    "pr": object.union(valid_input.pr, {"commits": [{"verified": false}]})
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}

test_rejects_protected_path_without_approval if {
  test_input := object.union(valid_input, {
    "pr": object.union(valid_input.pr, {"changed_files": ["governance/policies/example.rego"]})
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}

test_rejects_unapproved_dependency if {
  test_input := object.union(valid_input, {
    "dependencies": [{"name": "untrusted-package", "license": "MIT"}]
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}

test_rejects_unapproved_license if {
  test_input := object.union(valid_input, {
    "dependencies": [{"name": "vitest", "license": "GPL-3.0"}]
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}

test_rejects_non_conventional_title if {
  test_input := object.union(valid_input, {
    "pr": object.union(valid_input.pr, {"title": "Add export"})
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}

test_rejects_bot_approval if {
  test_input := object.union(valid_input, {
    "pr": object.union(valid_input.pr, {"approvals": [{"actor_type": "Bot"}]})
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}

test_rejects_large_change_without_approval if {
  test_input := object.union(valid_input, {
    "pr": object.union(valid_input.pr, {
      "additions": 801,
      "deletions": 0,
      "large_change_approved": false
    })
  })
  denied := data.sdlc.deny with input as test_input
  count(denied) > 0
}
