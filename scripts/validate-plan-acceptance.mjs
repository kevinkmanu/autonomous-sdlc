import { readJsonInput, validatePlanAcceptance, writeResult } from './phase3-authorization.mjs';

// Piped JSON validates a real plan acceptance; without stdin the governance fixture is used to
// validate the authorization implementation itself (as the Plan Gate workflow does).
const input = await readJsonInput({ fallbackPath: 'governance/fixtures/authorization-cases.json' });

writeResult(validatePlanAcceptance({
  plan: input.plan,
  approvals: input.approvals,
  currentCommit: input.currentCommit
}));
