import fs from 'node:fs';
import { load as parseYaml } from 'js-yaml';

const definitions = parseYaml(fs.readFileSync('governance/agent-definitions.yaml', 'utf8'));
const identities = parseYaml(fs.readFileSync('governance/agent-identities.yaml', 'utf8'));
const expectedAgents = ['orchestrator', 'planner', 'developer', 'tester', 'security_reviewer'];

if (definitions.version !== 1 || !Array.isArray(definitions.common_constraints)) {
  throw new Error('Agent definitions must declare version 1 and common constraints.');
}

for (const agentId of expectedAgents) {
  const agent = definitions.agents?.[agentId];
  const identity = identities.identities?.[agentId];

  if (!agent || !identity) {
    throw new Error(`Missing agent definition or identity: ${agentId}`);
  }

  for (const field of ['responsibilities', 'permitted_write_paths', 'handoffs', 'refusal_conditions', 'escalation_rules']) {
    if (!Array.isArray(agent[field]) || agent[field].length === 0) {
      throw new Error(`${agentId}.${field} must be a non-empty array.`);
    }
  }

  if (JSON.stringify(agent.permitted_write_paths) !== JSON.stringify(identity.allowed_write_globs)) {
    throw new Error(`${agentId} permitted write paths must match agent identity allowlist.`);
  }
}

console.log(`Validated agent definitions: ${expectedAgents.length} agents`);
