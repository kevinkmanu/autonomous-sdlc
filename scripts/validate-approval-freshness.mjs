import { readJsonInput, validateApprovalFreshness, writeResult } from './phase3-authorization.mjs';

writeResult(validateApprovalFreshness(await readJsonInput()));