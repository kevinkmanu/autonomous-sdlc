import { createAuthorizationRecord, readJsonInput, writeResult } from './phase3-authorization.mjs';

writeResult(createAuthorizationRecord(await readJsonInput()));