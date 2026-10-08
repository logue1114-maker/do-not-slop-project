import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const repo = path.resolve(root, '../..');
const baseline = JSON.parse(await readFile(path.join(root, 'provenance.json'), 'utf8')).baseline_commit;
const prefix = 'research/human_maintainability_v1/';
const navigation = ['README.md', 'AGENTS.md', 'docs/CHANGELOG.md', 'docs/RIGHTS_AND_SCOPE.md', 'docs/VERIFICATION.md'];
const metadata = ['FILES.sha256.json'];
const checks = [];
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
function check(name, callback) {
  try { callback(); checks.push({ name, status: 'pass' }); }
  catch (error) { checks.push({ name, status: 'fail', detail: error.message }); }
}
async function walk(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    assert.ok(!item.isSymbolicLink(), 'No symlinks in public package');
    const file = path.join(directory, item.name);
    if (item.isDirectory()) files.push(...await walk(file)); else files.push(file);
  }
  return files;
}
const changed = git('diff', '--name-only', baseline, '--').trim().split('\n').filter(Boolean);
check('only additive package, scoped navigation and inventory change', () => assert.deepEqual(changed.filter(name => !name.startsWith(prefix) && !navigation.includes(name) && !metadata.includes(name)), []));
for (const name of navigation) {
  const original = git('show', `${baseline}:${name}`).split(/\r?\n/);
  const current = (await readFile(path.join(repo, name), 'utf8')).split(/\r?\n/);
  check('prior navigation/doc lines retained: ' + name, () => {
    let cursor = 0;
    for (const line of current) if (line === original[cursor]) cursor++;
    assert.equal(cursor, original.length);
  });
}
const provenance = JSON.parse(await readFile(path.join(root, 'provenance.json'), 'utf8'));
for (const record of provenance.baseline_files) {
  check('retained copy equals original Git blob: ' + record.copy, () => {
    const original = execFileSync('git', ['show', `${baseline}:${record.source}`], { cwd: repo });
    assert.equal(createHash('sha256').update(original).digest('hex'), record.sha256);
  });
}
const files = await walk(root);
const missing = [], sensitive = [], unsupported = [], runtimeHashes = {};
const patterns = [
  /\b(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{30,})\b/,
  /\b[A-Za-z]:[\\/]Users[\\/]/i,
  /https?:\/\/[^/\s:]+:[^/\s@]+@/,
  /https?:\/\/[^\s"<>]+[?&](?:sig|X-Amz-Signature|token|access_token)=/,
  /libfile_[A-Za-z0-9]{12,}|source_thread_id\s*[:=]/
];
for (const file of files) {
  const rel = path.relative(repo, file).split(path.sep).join('/');
  if (path.basename(file) !== '.gitattributes' && !['.md', '.mjs', '.json', '.html', '.css', '.patch'].includes(path.extname(file))) unsupported.push(rel);
  const text = await readFile(file, 'utf8');
  if (/\/(?:before|after|tests|change-example)\//.test(rel) && !rel.endsWith('.md')) runtimeHashes[rel.slice(prefix.length)] = createHash('sha256').update(await readFile(file)).digest('hex');
  if (patterns.some(pattern => pattern.test(text))) sensitive.push(rel);
  if (file.endsWith('.json')) check('valid JSON: ' + rel, () => JSON.parse(text));
  const targets = file.endsWith('.md') ? [...text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1])
    : file.endsWith('.html') ? [...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]) : [];
  for (const target of targets) {
    if (/^(?:[A-Za-z][A-Za-z0-9+.-]*:|#|\/\/)/.test(target)) continue;
    const destination = path.resolve(path.dirname(file), decodeURIComponent(target.split('#')[0]));
    const relative = path.relative(repo, destination);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { missing.push({ rel, target, reason: 'outside repository' }); continue; }
    try { await readFile(destination); } catch { missing.push({ rel, target, reason: 'missing local target' }); }
  }
}
// Check the newly exposed root README links against the actual local tree too.
for (const file of navigation) {
  const text = await readFile(path.join(repo, file), 'utf8');
  for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    if (!match[1].includes('human_maintainability_v1')) continue;
    try { await readFile(path.resolve(repo, path.dirname(file), match[1].split('#')[0])); }
    catch { missing.push({ rel: file, target: match[1], reason: 'missing new navigation target' }); }
  }
}
check('package and new navigation links resolve', () => assert.deepEqual(missing, []));
check('bounded credential/private-path/signed-link scan', () => assert.deepEqual(sensitive, []));
check('only public code/docs/data and test patch; no new media/dependency payload', () => assert.deepEqual(unsupported, []));
const report = { scope: 'New package local links/JSON/retained Git blobs/bounded sensitive-pattern scan; scoped insertion-only navigation and unchanged prior Git files', baseline_commit: baseline, prior_files_preserved_except_declared_navigation_and_inventory: true, runtime_sha256: runtimeHashes, checks, limitations: ['Bounded scan, not a legal/security certification', 'External URL liveness is separate', 'Does not certify earlier packages or global historical release receipts'] };
report.prior_files_preserved_except_declared_navigation_and_inventory = checks.every(item => item.status === 'pass');
await writeFile(path.join(root, 'checks/publication-results.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ checks: checks.length, passed: checks.filter(item => item.status === 'pass').length, failed: checks.filter(item => item.status === 'fail') }));
if (checks.some(item => item.status === 'fail')) process.exitCode = 1;
