import { spawnSync } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', fileURLToPath(new URL('before/tests.mjs', root)), fileURLToPath(new URL('tests/contracts.test.mjs', root))], { encoding: 'utf8' });
await mkdir(new URL('checks/', root), { recursive: true });
// Successful TAP contains test names/results, not execution-specific paths.
// Keep failures on the local console; do not publish an unsanitized stack trace.
if (result.status !== 0) { process.stdout.write(result.stdout); process.stderr.write(result.stderr); process.exitCode = result.status || 1; }
else {
  const summary = { scope: 'Preserved baseline tests and new contract/parity/dependency tests', node: process.version, tests: Number(result.stdout.match(/^# tests (\d+)/m)?.[1]), passed: Number(result.stdout.match(/^# pass (\d+)/m)?.[1]), failed: Number(result.stdout.match(/^# fail (\d+)/m)?.[1]), status: 'pass' };
  await writeFile(new URL('checks/unit-results.json', root), JSON.stringify(summary, null, 2) + '\n');
  process.stdout.write(JSON.stringify(summary) + '\n');
}
