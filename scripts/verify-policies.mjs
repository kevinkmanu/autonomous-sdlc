import { spawnSync } from 'node:child_process';

const executable = process.platform === 'win32' ? 'where.exe' : 'which';
const lookup = spawnSync(executable, ['conftest'], { encoding: 'utf8' });

if (lookup.status !== 0) {
  console.error('Conftest is required for policy verification. Install it from https://www.conftest.dev/');
  process.exitCode = 1;
} else {
  const result = spawnSync('conftest', ['verify', '--policy', 'governance/policies'], { stdio: 'inherit' });
  process.exitCode = result.status ?? 1;
}
