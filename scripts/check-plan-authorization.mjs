import { checkPlanAuthorization, readJsonInput, writeResult } from './phase3-authorization.mjs';

writeResult(checkPlanAuthorization(await readJsonInput()));