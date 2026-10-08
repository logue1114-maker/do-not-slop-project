import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import { readFile, writeFile, cp, mkdtemp, rm, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');
const root = fileURLToPath(new URL('../', import.meta.url));
const temp = await mkdtemp(path.join(os.tmpdir(), 'fleet-theme-'));
const checks = [], errors = [], captured = [];
const mime = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const isTheme = url.pathname.startsWith('/theme/');
  const base = isTheme ? path.join(temp, 'after') : root;
  const suffix = isTheme ? url.pathname.slice('/theme/'.length) : url.pathname.slice(1);
  const file = path.resolve(base, decodeURIComponent(suffix));
  const relative = path.relative(base, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(403).end(); return; }
  try {
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'text/plain' }).end(content);
  } catch { res.writeHead(404).end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
async function check(name, callback) {
  if (process.env.QA_CASE && process.env.QA_CASE !== name) return;
  try { await callback(); checks.push({ name, status: 'pass' }); console.log('pass: ' + name); }
  catch (error) { checks.push({ name, status: 'fail', message: error.message }); console.log('FAIL: ' + name + ': ' + error.message); }
}
async function snapshot(page, styles = true) {
  return page.evaluate(styles => ({
    state: window.fleetDemo.getState(), fixture: window.fleetDemo.getFixture(), models: window.fleetDemo.getViewModels(),
    main: document.querySelector('main').innerHTML,
    focus: document.activeElement?.dataset?.focus || document.activeElement?.id || document.activeElement?.dataset?.frame || document.activeElement?.dataset?.preset || document.activeElement?.tagName,
    geometry: [...document.querySelectorAll('.scene,.hud,.unit,.waypoint,.command-buttons button,.scenario-controls button')].map(node => {
      const { x, y, width, height } = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return { x, y, width, height, ...(styles ? { color: style.color, background: style.backgroundColor, border: style.borderColor, padding: style.padding, outline: style.outline, fontSize: style.fontSize } : {}) };
    })
  }), styles);
}
async function compare(pages, styles = true) {
  // Chromium may blur a newly disabled focused button on its next frame.
  // Observe both pages after that native lifecycle step, not at unequal times.
  for (const page of pages) {
    // Background tabs can suspend animation frames. Make the observed page
    // eligible to render, and bound the wait instead of hanging the verifier.
    await page.bringToFront();
    await page.evaluate(() => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Render observation did not settle')), 5000);
      requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(timer); resolve(); }));
    }));
  }
  assert.deepEqual(await snapshot(pages[0], styles), await snapshot(pages[1], styles));
}
const clickBoth = async (pages, selector, options) => { for (const page of pages) await page.locator(selector).click(options); await compare(pages); };
const keyBoth = async (pages, selector, key) => { for (const page of pages) { await page.locator(selector).focus(); await page.keyboard.press(key); } await compare(pages); };
const a = '[data-variant="a"] ', b = '[data-variant="b"] ';
async function fresh(pages, viewport = { width: 1440, height: 1000 }) {
  for (const [index, page] of pages.entries()) {
    await page.setViewportSize(viewport);
    await page.mouse.move(0, 0);
    await page.goto(`${base}/${index ? 'after' : 'before'}/index.html`);
    await page.waitForFunction(() => !!window.fleetDemo);
  }
  await compare(pages);
}
async function capturePair(pages, name) {
  const bytes = [];
  for (const [index, page] of pages.entries()) {
    await page.evaluate(() => scrollTo(0, 0));
    bytes.push(await page.screenshot({ fullPage: true, animations: 'disabled' }));
    if (process.env.QA_CAPTURE_DIR) {
      await mkdir(process.env.QA_CAPTURE_DIR, { recursive: true });
      await writeFile(path.join(process.env.QA_CAPTURE_DIR, `${name}-${index ? 'after' : 'before'}.png`), bytes.at(-1));
    }
  }
  captured.push({ name, before_sha256: hash(bytes[0]), after_sha256: hash(bytes[1]), identical: bytes[0].equals(bytes[1]) });
  assert.deepEqual(bytes[0], bytes[1], 'same-state browser captures differ');
}
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const pages = [await context.newPage(), await context.newPage()];
  for (const page of pages) page.on('pageerror', error => errors.push(error.message));
  await check('initial full DOM, public hooks, computed styles and bounds', () => fresh(pages));
  await check('desktop same-state pixel capture', () => capturePair(pages, 'desktop-initial'));
  await check('selection, Shift toggle and cross-frame shared state', async () => {
    await clickBoth(pages, a + '[data-unit="arrow"]', { modifiers: ['Shift'] });
    assert.deepEqual((await snapshot(pages[1])).state.selectedIds, ['kestrel', 'arrow']);
    await clickBoth(pages, b + '[data-unit="arrow"]', { modifiers: ['Shift'] });
    assert.deepEqual((await snapshot(pages[1])).state.selectedIds, ['kestrel']);
  });
  await check('hover/focus are shared without selecting or arming', async () => {
    for (const page of pages) { await page.locator(a + '[data-unit="willow"]').hover(); await page.locator(b + '[data-unit="fang"]').focus(); }
    await compare(pages);
    const { state } = await snapshot(pages[1]);
    assert.equal(state.hoverId, 'willow'); assert.equal(state.command, null); assert.deepEqual(state.selectedIds, ['kestrel']);
  });
  await check('native Move, relay preview, Confirm and local focus recovery', async () => {
    await clickBoth(pages, a + '[data-command="move"]');
    await clickBoth(pages, b + '[data-waypoint="relay"]');
    assert.equal((await snapshot(pages[1])).state.committedOrders.length, 0);
    await clickBoth(pages, b + '[data-action="commit"]');
    const result = await snapshot(pages[1]);
    assert.equal(result.state.committedOrders.length, 1); assert.equal(result.focus, 'unit:kestrel');
  });
  await check('repeated disabled Confirm clicks cannot dispatch a second order', async () => {
    for (const page of pages) await page.locator(b + '[data-action="commit"]').evaluate(node => { node.click(); node.click(); });
    await compare(pages); assert.equal((await snapshot(pages[1])).state.committedOrders.length, 1);
  });
  await check('invalid friendly attack preserves prior order, then hostile target recovers', async () => {
    await clickBoth(pages, a + '[data-command="attack"]');
    await clickBoth(pages, a + '[data-unit="willow"]');
    const invalid = (await snapshot(pages[1])).state;
    assert.ok(invalid.error); assert.equal(invalid.committedOrders.length, 1); assert.equal(invalid.preview, null);
    await clickBoth(pages, b + '[data-unit="fang"]'); await clickBoth(pages, a + '[data-action="commit"]');
    assert.equal((await snapshot(pages[1])).state.committedOrders.length, 2);
  });
  await check('Stop repeats create separate orders, matching actual baseline semantics', async () => {
    await clickBoth(pages, a + '[data-action="stop"]'); await clickBoth(pages, a + '[data-action="stop"]');
    assert.equal((await snapshot(pages[1])).state.committedOrders.length, 4);
  });
  await check('empty selection repeated shortcuts fail without orders', async () => {
    await clickBoth(pages, '#reset'); await clickBoth(pages, b + '[data-action="clear"]');
    await keyBoth(pages, b + '[data-command="move"]', 'm'); await keyBoth(pages, b + '[data-command="move"]', 's');
    const state = (await snapshot(pages[1])).state; assert.equal(state.committedOrders.length, 0); assert.ok(state.error);
  });
  await check('Cancel clears error and keeps selected ships and committed records', async () => {
    await clickBoth(pages, '#reset'); await keyBoth(pages, a + '[data-command="move"]', 'm');
    await clickBoth(pages, a + '[data-waypoint="relay"]'); await keyBoth(pages, a + '[data-action="cancel"]', 'Escape');
    const state = (await snapshot(pages[1])).state; assert.equal(state.command, null); assert.equal(state.error, null); assert.deepEqual(state.selectedIds, ['kestrel']);
  });
  await check('Enter and Space retain native button action, scoped M/A/S/Escape', async () => {
    await keyBoth(pages, a + '[data-command="move"]', 'Enter');
    await keyBoth(pages, a + '.open-space', 'Space');
    assert.equal((await snapshot(pages[1])).state.preview.x, 480); assert.equal((await snapshot(pages[1])).state.preview.y, 340);
    await keyBoth(pages, a + '[data-action="commit"]', 'Enter');
    await keyBoth(pages, b + '[data-command="attack"]', 'a');
    await keyBoth(pages, b + '[data-action="cancel"]', 'Escape');
  });
  await check('pointer map coordinates use bounds and fixture world dimensions', async () => {
    await clickBoth(pages, '#reset'); await clickBoth(pages, a + '[data-command="move"]');
    for (const page of pages) {
      const box = await page.locator(a + '.open-space').boundingBox();
      await page.mouse.click(box.x + box.width * .45, box.y + box.height * .85);
    }
    await compare(pages); const preview = (await snapshot(pages[1])).state.preview;
    assert.equal(preview.x, 432); assert.equal(preview.y, 578);
  });
  await check('modifiers, repeat, and shortcuts outside a scene are ignored', async () => {
    await clickBoth(pages, '#reset');
    for (const page of pages) {
      await page.locator(a + '[data-command="move"]').focus();
      await page.keyboard.press('Control+m'); await page.keyboard.press('Alt+a'); await page.keyboard.press('Meta+s');
      await page.locator(a + '[data-command="move"]').evaluate(node => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', repeat: true, bubbles: true })));
      await page.locator('#reset').focus(); await page.keyboard.press('m');
    }
    await compare(pages); assert.equal((await snapshot(pages[1])).state.command, null);
  });
  await check('all authored presets and repeated reset match', async () => {
    for (const preset of ['normal', 'selection', 'preview', 'invalid', 'empty']) await clickBoth(pages, `[data-preset="${preset}"]`);
    await clickBoth(pages, '#reset'); await clickBoth(pages, '#reset');
    assert.equal((await snapshot(pages[1])).state.nextOrder, 1);
  });
  await check('public hook clones cannot mutate live fixture/state', async () => {
    for (const page of pages) await page.evaluate(() => { const state = window.fleetDemo.getState(); state.selectedIds.length = 0; const fixture = window.fleetDemo.getFixture(); fixture.units[0].hull = 0; });
    await compare(pages); assert.equal((await snapshot(pages[1])).fixture.units[0].hull, 92);
  });
  await check('frame configuration stays presentational and matches', async () => {
    const prior = (await snapshot(pages[1])).state;
    await clickBoth(pages, '[data-frame="narrow"]'); assert.deepEqual((await snapshot(pages[1])).state, prior);
    await clickBoth(pages, '[data-frame="wide"]');
  });
  for (const width of [390, 320]) await check(`native flows and computed geometry at ${width} CSS pixels`, async () => {
    await fresh(pages, { width, height: 844 });
    await clickBoth(pages, b + '[data-command="attack"]'); await clickBoth(pages, b + '[data-unit="fang"]'); await clickBoth(pages, b + '[data-action="commit"]');
    for (const page of pages) assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await capturePair(pages, `narrow-${width}-attack`);
  });
  await check('HTTP, network and invalid JSON loading fail before mounting, same as baseline', async () => {
    for (const mode of ['http', 'network', 'json']) {
      const outcomes = [];
      for (const variant of ['before', 'after']) {
        const page = await context.newPage(), failure = [];
        page.on('pageerror', error => failure.push({ name: error.name, message: error.message }));
        await page.route('**/fixture.json', route => mode === 'network' ? route.abort('failed') : route.fulfill({ status: mode === 'http' ? 503 : 200, contentType: 'application/json', body: mode === 'json' ? '{' : '{}' }));
        await page.goto(`${base}/${variant}/index.html`);
        await page.waitForFunction(() => !window.fleetDemo);
        await page.waitForTimeout(100);
        outcomes.push({ failures: failure, scenes: await page.locator('.scene').count(), hook: await page.evaluate(() => typeof window.fleetDemo) });
        await page.close();
      }
      assert.ok(outcomes[0].failures.length); assert.deepEqual(outcomes[0], outcomes[1]); assert.equal(outcomes[1].scenes, 0);
    }
  });
  await check('refactored dispose stops detached/global input and supports fresh remount', async () => {
    await fresh(pages);
    const result = await pages[1].evaluate(async () => {
      const entry = await import('./app.mjs'), hook = window.fleetDemo;
      const detached = document.querySelector('[data-variant="a"] [data-action="stop"]');
      detached.click();
      const beforeDispose = hook.getState();
      entry.dispose(); entry.dispose(); detached.click(); document.querySelector('[data-preset="empty"]').click();
      const stateAfterDispose = hook.getState(), sceneCount = document.querySelectorAll('.scene').length;
      const { mountFleet } = await import('./application.mjs');
      const mounted = mountFleet(document, hook.getFixture());
      const announcementAfterRemount = document.querySelector('#live-status').textContent;
      document.querySelector('[data-variant="a"] [data-action="stop"]').click();
      const stateAfterRemount = mounted.api.getState(); mounted.dispose();
      return { beforeDispose, stateAfterDispose, sceneCount, stateAfterRemount, announcementAfterRemount, hookRemoved: !window.fleetDemo };
    });
    assert.equal(result.sceneCount, 0); assert.equal(result.hookRemoved, true);
    assert.deepEqual(result.stateAfterDispose, result.beforeDispose);
    assert.equal(result.stateAfterDispose.committedOrders.length, 1);
    assert.equal(result.announcementAfterRemount, '', 'fresh instance must not announce an old order');
    assert.equal(result.stateAfterRemount.committedOrders.length, 1);
  });
  await check('isolated requested theme patch changes only tokens and rendered accent; domain unchanged', async () => {
    await cp(path.join(root, 'after'), path.join(temp, 'after'), { recursive: true });
    const patch = path.join(root, 'change-example/theme.patch');
    for (const args of [['apply', '--check', patch], ['apply', patch]]) {
      const result = spawnSync('git', args, { cwd: temp, encoding: 'utf8' }); assert.equal(result.status, 0, result.stderr);
    }
    const changed = [];
    for (const name of await readdir(path.join(root, 'after'))) if (!Buffer.from(await readFile(path.join(root, 'after', name))).equals(await readFile(path.join(temp, 'after', name)))) changed.push(name);
    assert.deepEqual(changed, ['tokens.css']);
    const left = await context.newPage(), right = await context.newPage();
    await left.goto(`${base}/after/index.html`); await right.goto(`${base}/theme/index.html`);
    for (const page of [left, right]) await page.waitForFunction(() => !!window.fleetDemo);
    await compare([left, right], false);
    const accent = page => page.locator('.viewport-controls [data-frame="wide"]').evaluate(node => getComputedStyle(node).borderColor);
    assert.equal(await accent(left), 'rgb(241, 205, 117)'); assert.equal(await accent(right), 'rgb(214, 233, 255)');
    for (const selector of [a + '[data-command="move"]', a + '[data-waypoint="relay"]', a + '[data-action="commit"]', b + '[data-command="attack"]', b + '[data-unit="fang"]', b + '[data-action="commit"]']) {
      for (const page of [left, right]) await page.locator(selector).click(); await compare([left, right], false);
    }
    assert.equal((await snapshot(right)).state.committedOrders.length, 2);
    await left.close(); await right.close();
  });
  await check('normal-flow browser page errors absent', () => assert.deepEqual(errors, []));
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
  const relative = path.relative(os.tmpdir(), temp);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Temporary cleanup target escaped temp directory');
  await rm(temp, { recursive: true, force: true });
  const report = { scope: 'Actual local headless Chrome, native click/key flows, bounded injected failures, refactored lifecycle, and isolated theme patch', selected_case: process.env.QA_CASE || 'all', browser: browser?.version(), checks, captures: captured, unrun: ['Physical devices/controllers', 'Screen readers and full accessibility', 'Independent human maintenance task/time measurement', 'Visual design approval', 'Exhaustive action space', 'Malformed fixture schema recovery (baseline has none)'] };
  const reportName = process.env.QA_REPORT_NAME || 'browser-results';
  if (!/^[a-z0-9-]+$/.test(reportName)) throw new Error('Invalid report name');
  await writeFile(path.join(root, 'checks', reportName + '.json'), JSON.stringify(report, null, 2) + '\n');
}
if (checks.some(check => check.status === 'fail')) process.exitCode = 1;
