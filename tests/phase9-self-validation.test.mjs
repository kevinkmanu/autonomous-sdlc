import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  checkPlanAuthorization,
  createAuthorizationRecord,
  validatePlanAcceptance
} from '../scripts/phase3-authorization.mjs';

const fixture = JSON.parse(fs.readFileSync('governance/fixtures/authorization-cases.json', 'utf8'));

describe('Phase 9 self-validation fixtures', () => {
  it('accepts the valid authorization fixture', () => {
    const record = createAuthorizationRecord({
      plan: fixture.plan,
      planCommit: fixture.currentCommit,
      approvals: fixture.approvals
    });

    expect(record.ok).toBe(true);
    expect(checkPlanAuthorization({
      plan: fixture.plan,
      authorization: record.authorization,
      implementationBranch: fixture.implementationBranch
    })).toMatchObject({ ok: true });
  });

  for (const testCase of fixture.invalidCases) {
    it(`rejects ${testCase.name}`, () => {
      const input = { ...fixture, ...testCase.overrides };
      const acceptance = validatePlanAcceptance({
        plan: input.plan,
        approvals: input.approvals,
        currentCommit: input.currentCommit
      });

      if (testCase.expectedCode === 'UNAUTHORIZED_IMPLEMENTATION') {
        const record = createAuthorizationRecord({
          plan: input.plan,
          planCommit: input.currentCommit,
          approvals: input.approvals
        });
        expect(checkPlanAuthorization({
          plan: input.plan,
          authorization: record.authorization,
          implementationBranch: input.implementationBranch
        })).toMatchObject({ ok: false, code: testCase.expectedCode });
      } else {
        expect(acceptance).toMatchObject({ ok: false, code: testCase.expectedCode });
      }
    });
  }
});
