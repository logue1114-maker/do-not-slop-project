import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const root = new URL('../implementation/', import.meta.url);
const packageRoot = new URL('../', import.meta.url);
const repoRoot = new URL('../../../', import.meta.url);
const record = JSON.parse(fs.readFileSync(new URL('run-record.json', packageRoot), 'utf8'));
const html = fs.readFileSync(new URL('index.html', root), 'utf8');
const fixture = JSON.parse(fs.readFileSync(new URL('fixture.json', packageRoot), 'utf8'));
const first = fs.readFileSync(new URL('first-pass/index.html', root), 'utf8');
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const results = [];
function check(name, run) { run(); results.push({ check: name, result: 'pass' }); }
function jpegSize(raw) {
  assert.equal(raw.readUInt16BE(0), 0xffd8);
  let offset = 2;
  while (offset < raw.length) {
    while (raw[offset] === 255) offset++;
    const marker = raw[offset++];
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = raw.readUInt16BE(offset);
    if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker))
      return [raw.readUInt16BE(offset + 5), raw.readUInt16BE(offset + 3)];
    offset += length;
  }
  throw new Error('Missing JPEG dimensions');
}
check('Exact declared input, implementation, and capture bytes', () => {
  for (const [path, expected] of Object.entries(record.input_sha256))
    assert.equal(hash(fs.readFileSync(new URL(path, repoRoot))), expected, path);
  for (const [path, expected] of Object.entries(record.artifact_sha256))
    assert.equal(hash(fs.readFileSync(new URL(path, packageRoot))), expected, path);
  for (const capture of record.screenshots) {
    const raw = fs.readFileSync(new URL(capture.path, packageRoot));
    assert.equal(hash(raw), capture.sha256);
    assert.deepEqual(jpegSize(raw), capture.frame_pixels);
    assert.equal(capture.source_sha256, record.artifact_sha256['implementation/index.html']);
  }
});
check('Only implementation repair was summary padding 10px to 12px', () => {
  const repaired = first.replace('padding: 10px 0; cursor: pointer;', 'padding: var(--space-3) 0; cursor: pointer;');
  assert.notEqual(repaired, first);
  assert.equal(repaired, html);
});
const panels = [...html.matchAll(/<section class="panel"[^>]*data-side="(before|after)"[^>]*>([\s\S]*?)<\/section>/g)];
check('Protected labels, titles, body line break, empty After body, records and order', () => {
  assert.equal(panels.length, 2);
  panels.forEach(([_, side, content], index) => {
    assert.equal(side, index === 0 ? 'before' : 'after');
    assert.ok(content.includes(fixture.comparison[side].label));
    assert.equal(content.match(/<h2>(.*?)<\/h2>/s)[1], fixture.comparison[side].title);
    const body = content.match(/<p class="source-body">([\s\S]*?)<\/p>/)?.[1] ?? '';
    assert.equal(body, fixture.comparison[side].body);
    const records = [...content.matchAll(/<li class="document"><span class="document-name">(.*?)<\/span><span class="document-date">(.*?)<\/span><\/li>/g)].map(match => ({ name: match[1], modified: match[2] }));
    assert.deepEqual(records, fixture.documents);
    assert.match(content, /<button class="find-document" type="button" data-side="(?:before|after)" disabled>Find a document<\/button>/);
  });
});
check('Single h1, visible boundary, native disclosure, empty initial live status, no dependencies', () => {
  assert.equal((html.match(/<h1>/g) ?? []).length, 1);
  assert.match(html, /<h1>Recent documents<\/h1>/);
  assert.match(html, /<p class="demo-boundary">Local educational demo\. Buttons record an intention; no navigation, saving, publishing, or transmission\.<\/p>/);
  assert.match(html, /<details class="facts-disclosure" id="shared-facts">\s*<summary>Shared facts<\/summary>/);
  assert.match(html, /id="demo-status" role="status" aria-live="polite" aria-atomic="true"><\/p>/);
  assert.equal((html.match(/Both specimens are authored examples\./g) ?? []).length, 1);
  assert.doesNotMatch(html, /<(?:link|img|iframe)\b|<script[^>]*\bsrc=|<a\b|fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/);
});
check('Same common card, row, action and focus styles; content-driven heights; prescribed responsive rules', () => {
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  for (const color of ['#FFFFFF','#202124','#5F6368','#DADCE0','#8A9099','#1F5FBF','#194F9E','#F5F6F7']) assert.ok(css.includes(color));
  assert.match(css, /align-items: start/);
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /outline: 3px solid var\(--primary\); outline-offset: 3px/);
  assert.doesNotMatch(css, /box-shadow|\.(?:before|after)|\[data-side|margin-top: auto/);
  assert.doesNotMatch(css.match(/\.specimen \{([^}]+)\}/)[1], /(?:^|;)\s*(?:height|min-height|max-height):/);
});
const element = (side) => ({ dataset: { side }, disabled: true, textContent: '', open: false, listeners: new Map(), addEventListener(type, callback) { this.listeners.set(type, callback); }, click() { if (!this.disabled) this.listeners.get('click')?.(); } });
const before = element('before'), after = element('after'), reset = element(), status = element(), facts = element();
const context = { window: {}, document: { getElementById: id => ({ reset, 'demo-status': status, 'shared-facts': facts })[id], querySelectorAll: selector => selector === '.find-document' ? [before, after] : [] } };
vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
const demo = context.window.CP01Demo;
check('Actual inline script: both actions enabled and shared intention log with accurate repeated counts', () => {
  assert.equal(before.disabled, false); assert.equal(after.disabled, false); assert.equal(reset.disabled, false);
  assert.equal(demo.actionLog.length, 0); assert.equal(status.textContent, '');
  before.click(); assert.equal(status.textContent, 'Finder intention recorded · 1 action');
  after.click(); assert.equal(status.textContent, 'Finder intention recorded · 2 actions');
  before.click(); assert.equal(status.textContent, 'Finder intention recorded · 3 actions');
  assert.equal(JSON.stringify(demo.actionLog), JSON.stringify([{ intention: 'find_document', side: 'before' }, { intention: 'find_document', side: 'after' }, { intention: 'find_document', side: 'before' }]));
});
check('Actual inline script: reset clears log, closes facts, preserves fixture; repeated reset/action safe', () => {
  const original = JSON.stringify(demo.fixture);
  facts.open = true; reset.click();
  assert.equal(demo.actionLog.length, 0); assert.equal(facts.open, false); assert.equal(status.textContent, 'Demo state reset');
  assert.equal(JSON.stringify(demo.fixture), original); assert.equal(JSON.stringify(demo.fixture), JSON.stringify(fixture));
  reset.click(); assert.equal(demo.actionLog.length, 0);
  after.click(); assert.equal(demo.actionLog.length, 1); assert.equal(status.textContent, 'Finder intention recorded · 1 action');
  assert.ok(Object.isFrozen(demo.fixture)); assert.ok(Object.isFrozen(demo.fixture.documents)); assert.ok(Object.isFrozen(demo.actionLog));
});
function luminance(hex) { const rgb = hex.match(/\w\w/g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4); return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2]; }
function ratio(a, b) { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05); }
const contrastPairs = [
  ['Main text / white', '202124', 'FFFFFF', 4.5],
  ['Metadata / white', '5F6368', 'FFFFFF', 4.5],
  ['White label / primary', 'FFFFFF', '1F5FBF', 4.5],
  ['White label / primary hover', 'FFFFFF', '194F9E', 4.5],
  ['Main text / secondary hover', '202124', 'F5F6F7', 4.5],
  ['Secondary boundary / white', '8A9099', 'FFFFFF', 3],
  ['Focus outline / white', '1F5FBF', 'FFFFFF', 3]
].map(([pair, foreground, background, minimum]) => ({ pair, ratio: Number(ratio(foreground, background).toFixed(2)), minimum }));
check('Used text and interactive-boundary/focus color contrasts', () => { contrastPairs.forEach(pair => assert.ok(pair.ratio >= pair.minimum, `${pair.pair}: ${pair.ratio}`)); });
const report = { title: 'CP01 guided iteration with guide v2', date: new Date().toISOString(), status: 'passed', counts: { check_groups: results.length, failed: 0 }, execution: 'Node inline-script VM with minimal DOM/event stubs; static HTML/CSS checks. This is not a browser or user test.', current_sha256: hash(html), first_pass_sha256: hash(first), checks: results, contrast_pairs: contrastPairs, specimen_boundary_ratio: Number(ratio('DADCE0','FFFFFF').toFixed(2)), limitations: ['No rendered layout, native keyboard, focus appearance, native disclosure, console, zoom/reflow, screen reader, native-phone, or human-usability check was performed by this local script. Separately recorded browser observations are not reproduced by this script.', 'Low-contrast neutral specimen/list boundaries are grouping separators, not the only signal for a control.'] };
fs.writeFileSync(new URL('source-results.json', new URL('.', import.meta.url)), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
