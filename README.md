# Autonomous SDLC Governance

This repository contains governance scaffolding for an enterprise software development lifecycle assisted by GitHub Copilot and GitHub Actions.

The repository currently defines the plan contract and governance policies. It does not contain application source code or production deployment credentials.

## Development

Requirements:

- Node.js 20 or later
- npm
- Conftest 0.69.0 or later

Install and validate the repository:

```powershell
npm ci
npm run verify
```

Policy verification can be run independently with `npm run policy:verify`.

## Lifecycle

A plan pull request must be accepted by an authorized user, pass its plan-specific governance checks, receive required risk-based approvals, and merge before implementation branch provisioning can begin.

See [docs/phase-reference.md](docs/phase-reference.md) for the implementation phases and current status.
