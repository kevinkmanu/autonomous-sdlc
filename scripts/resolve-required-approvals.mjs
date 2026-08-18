import { readJsonInput, resolveRequiredApprovals, writeResult } from './phase3-authorization.mjs';

writeResult(resolveRequiredApprovals(await readJsonInput()));