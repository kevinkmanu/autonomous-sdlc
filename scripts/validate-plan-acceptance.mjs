import { readJsonInput, validatePlanAcceptance, writeResult } from './phase3-authorization.mjs';

const input = await readJsonInput({ fallbackPath: 'governance/fixtures/authorization-cases.json' });

writeResult(validatePlanAcceptance({
  plan: input.plan,
  approvals: input.approvals,
  currentCommit: input.currentCommit
}));
