import { readJsonInput, validatePlanAcceptance, writeResult } from './phase3-authorization.mjs';

writeResult(validatePlanAcceptance(await readJsonInput()));