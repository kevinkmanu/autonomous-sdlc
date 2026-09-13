import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';

const repositoryRoot = path.resolve(import.meta.dirname, '..');

export function loadYaml(relativePath) {
  return parseYaml(fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8'));
}

export function resolveRequiredApprovals({ riskClass, dataClassification, riskMatrix = loadYaml('governance/risk-matrix.yaml') }) {
  const risk = riskMatrix.risk_classes?.[riskClass];
  if (!risk) {
    return { ok: false, code: 'UNKNOWN_RISK_CLASS', message: `Unknown risk class: ${riskClass}` };
  }

  const roles = [...risk.required_approvals];
  if (['confidential', 'regulated'].includes(dataClassification) && !roles.includes('security')) {
    roles.push('security');
  }

  return {
    ok: true,
    riskClass,
    dataClassification,
    requiredApprovals: roles,
    requiredGates: risk.required_gates,
    reviewerTeams: risk.reviewer_teams
  };
}

function isAgentPrincipal(principal, agentIdentities) {
  return Object.values(agentIdentities.identities ?? {})
    .filter((identity) => identity !== agentIdentities.identities?.human)
    .some((identity) => (identity.principals ?? []).includes(principal));
}

export function validateApprovalFreshness({ approvals, currentCommit }) {
  const stale = approvals.filter((approval) => approval.state === 'APPROVED' && approval.commitSha !== currentCommit);
  return stale.length === 0
    ? { ok: true, currentCommit }
    : { ok: false, code: 'STALE_APPROVAL', currentCommit, staleApprovals: stale.map((approval) => approval.user) };
}

export function validatePlanAcceptance({ plan, approvals, currentCommit, agentIdentities = loadYaml('governance/agent-identities.yaml') }) {
  if (!plan?.id || !currentCommit) {
    return { ok: false, code: 'INVALID_ACCEPTANCE_INPUT', message: 'A plan ID and current commit are required.' };
  }

  const freshness = validateApprovalFreshness({ approvals, currentCommit });
  if (!freshness.ok) return freshness;

  const required = resolveRequiredApprovals({
    riskClass: plan.risk_class,
    dataClassification: plan.data_classification
  });
  if (!required.ok) return required;

  const validApprovals = approvals.filter((approval) => approval.state === 'APPROVED');
  const rejectedAgentApprovals = validApprovals.filter((approval) => isAgentPrincipal(approval.user, agentIdentities));
  if (rejectedAgentApprovals.length > 0) {
    return {
      ok: false,
      code: 'AGENT_SELF_APPROVAL',
      approvers: rejectedAgentApprovals.map((approval) => approval.user)
    };
  }

  const approvedRoles = new Set(validApprovals.flatMap((approval) => approval.roles ?? []));
  const missingApprovals = required.requiredApprovals.filter((role) => !approvedRoles.has(role));
  if (missingApprovals.length > 0) {
    return { ok: false, code: 'MISSING_REQUIRED_APPROVAL', missingApprovals, requiredApprovals: required.requiredApprovals };
  }

  return {
    ok: true,
    planId: plan.id,
    currentCommit,
    approvers: validApprovals.map((approval) => approval.user),
    requiredApprovals: required.requiredApprovals
  };
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function hashPlan(plan) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalize(plan))).digest('hex');
}

export function createAuthorizationRecord({ plan, planCommit, approvals, acceptedAt = new Date().toISOString() }) {
  const acceptance = validatePlanAcceptance({ plan, approvals, currentCommit: planCommit });
  if (!acceptance.ok) return acceptance;

  return {
    ok: true,
    authorization: {
      planId: plan.id,
      planCommit,
      planHash: hashPlan(plan),
      approvers: acceptance.approvers,
      acceptedAt,
      riskClass: plan.risk_class,
      dataClassification: plan.data_classification,
      requiredApprovals: acceptance.requiredApprovals
    }
  };
}

export function checkPlanAuthorization({ plan, authorization, implementationBranch }) {
  const expectedPrefix = `feat/${plan.id}-`;
  const errors = [];
  if (!authorization || authorization.planId !== plan.id) errors.push('AUTHORIZATION_PLAN_MISMATCH');
  if (authorization?.planHash !== hashPlan(plan)) errors.push('AUTHORIZATION_HASH_MISMATCH');
  if (!implementationBranch?.startsWith(expectedPrefix)) errors.push('INVALID_IMPLEMENTATION_BRANCH');
  return errors.length === 0 ? { ok: true, planId: plan.id } : { ok: false, code: 'UNAUTHORIZED_IMPLEMENTATION', errors };
}

/**
 * Reads JSON from stdin.
 * @param {{ fallbackPath?: string }} [options] `fallbackPath` is a repository-relative file
 * used when stdin is empty; the fallback is announced on stderr and must resolve inside the
 * repository root. Without it, empty stdin throws.
 */
export async function readJsonInput({ fallbackPath } = {}) {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const input = Buffer.concat(chunks).toString('utf8').trim();
  if (input) return JSON.parse(input);
  if (!fallbackPath) throw new Error('No JSON input was provided on stdin.');

  const resolved = path.resolve(repositoryRoot, fallbackPath);
  if (resolved !== repositoryRoot && !resolved.startsWith(`${repositoryRoot}${path.sep}`)) {
    throw new Error(`Fallback input must stay inside the repository: ${fallbackPath}`);
  }
  process.stderr.write(`No JSON input on stdin; falling back to ${fallbackPath}.\n`);
  return JSON.parse(fs.readFileSync(resolved, 'utf8'));
}

export function writeResult(result) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}