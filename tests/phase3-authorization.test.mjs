import { describe, expect, it } from 'vitest';
import {
  checkPlanAuthorization,
  createAuthorizationRecord,
  hashPlan,
  resolveRequiredApprovals,
  validateApprovalFreshness,
  validatePlanAcceptance
} from '../scripts/phase3-authorization.mjs';

const mediumPlan = {
  id: 'PLAN-0042',
  risk_class: 'medium',
  data_classification: 'internal'
};

const acceptedApprovals = [
  { user: 'alice', roles: ['business_owner'], state: 'APPROVED', commitSha: 'abc123' },
  { user: 'bob', roles: ['engineering'], state: 'APPROVED', commitSha: 'abc123' }
];

describe('Phase 3 plan authorization', () => {
  it('requires the configured approvals for a medium-risk plan', () => {
    expect(validatePlanAcceptance({
      plan: mediumPlan,
      approvals: acceptedApprovals,
      currentCommit: 'abc123'
    })).toMatchObject({ ok: true, planId: 'PLAN-0042' });

    expect(validatePlanAcceptance({
      plan: mediumPlan,
      approvals: acceptedApprovals.slice(0, 1),
      currentCommit: 'abc123'
    })).toMatchObject({ ok: false, code: 'MISSING_REQUIRED_APPROVAL' });
  });

  it('rejects approvals made against an earlier plan commit', () => {
    expect(validateApprovalFreshness({
      approvals: [{ ...acceptedApprovals[0], commitSha: 'old456' }],
      currentCommit: 'abc123'
    })).toMatchObject({ ok: false, code: 'STALE_APPROVAL' });
  });

  it('rejects an agent from approving its own plan', () => {
    expect(validatePlanAcceptance({
      plan: mediumPlan,
      approvals: [
        { user: 'github-actions[bot]', roles: ['business_owner'], state: 'APPROVED', commitSha: 'abc123' },
        acceptedApprovals[1]
      ],
      currentCommit: 'abc123'
    })).toMatchObject({ ok: false, code: 'AGENT_SELF_APPROVAL' });
  });

  it('adds security approval for confidential data', () => {
    expect(resolveRequiredApprovals({
      riskClass: 'medium',
      dataClassification: 'confidential'
    })).toMatchObject({
      ok: true,
      requiredApprovals: ['business_owner', 'engineering', 'security']
    });
  });

  it('creates and verifies an immutable authorization reference', () => {
    const result = createAuthorizationRecord({
      plan: mediumPlan,
      planCommit: 'abc123',
      approvals: acceptedApprovals,
      acceptedAt: '2026-08-18T10:00:00.000Z'
    });

    expect(result.ok).toBe(true);
    expect(result.authorization).toMatchObject({
      planId: 'PLAN-0042',
      planCommit: 'abc123',
      acceptedAt: '2026-08-18T10:00:00.000Z'
    });
    expect(result.authorization.planHash).toBe(hashPlan(mediumPlan));
    expect(checkPlanAuthorization({
      plan: mediumPlan,
      authorization: result.authorization,
      implementationBranch: 'feat/PLAN-0042-orders-export'
    })).toMatchObject({ ok: true });

    expect(checkPlanAuthorization({
      plan: { ...mediumPlan, title: 'Changed after acceptance' },
      authorization: result.authorization,
      implementationBranch: 'feat/PLAN-0042-orders-export'
    })).toMatchObject({ ok: false, code: 'UNAUTHORIZED_IMPLEMENTATION' });
  });
});
