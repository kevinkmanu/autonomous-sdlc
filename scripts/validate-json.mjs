import fs from 'node:fs';
import path from 'node:path';

const files = [
  'governance/plan-schema.json',
  '.github/rulesets/main-branch.json'
];

for (const file of files) {
  const filePath = path.resolve(file);
  JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Validated JSON: ${file}`);
}
