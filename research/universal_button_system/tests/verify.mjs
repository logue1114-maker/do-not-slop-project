import assert from 'node:assert/strict';
import { readFile, readdir, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import { initialState, reduce, bindTabKeyboard } from '../specimens/semantics.mjs';
import { icon, btn } from '../specimens/components/actions.mjs';
import { tabs } from '../specimens/components/selection.mjs';

// Source inspection + Node-only behavior. This script does not start a server,
// install software, make a network request or use a browser/DOM implementation.
const base = fileURLToPath(new URL('../', import.meta.url));
const checks = [];
let nodeTestRun;
const check = async (id, category, description, run) => {
  try {
    const detail = await run();
    checks.push({ id, category, description, status: 'passed', ...(detail ? { detail } : {}) });
    console.log(`PASS ${id}`);
  } catch (error) {
    checks.push({ id, category, description, status: 'failed', detail: error.message });
    console.log(`FAIL ${id}: ${error.message}`);
  }
};
const read = relative => readFile(path.join(base, relative), 'utf8');
async function filesBelow(relative) {
  const entries = await readdir(path.join(base, relative), { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesBelow(path.join(relative, entry.name))
    : [path.join(relative, entry.name)]))).flat().sort();
}
const specimens = await filesBelow('specimens');
const source = Object.fromEntries(await Promise.all(specimens.map(async file => [file, await read(file)])));
const render = source['specimens/render.mjs'];
const semantics = source['specimens/semantics.mjs'];
const tokens = source['specimens/tokens.css'];
const families = source['specimens/families.css'];
const contexts = source['specimens/contexts.css'];

function tags(markup) {
  return [...markup.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)].map(match => {
    const attributes = Object.fromEntries([...match[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
      .map(attribute => [attribute[1].toLowerCase(), attribute[2] ?? attribute[3] ?? attribute[4] ?? true]));
    return { tag: match[1].toLowerCase(), attributes };
  });
}
function generated(context, patch = {}) {
  // Evaluate only the existing string-template declarations, excluding module
  // bootstrap, document access, listeners, timers and render()/dispatch().
  const start = render.indexOf('function web()');
  const end = render.indexOf('function render()');
  assert.ok(start >= 0 && end > start, 'Recognizable specimen template boundaries required');
  const sandbox = vm.createContext({ state: { ...initialState(), context, ...patch }, icon, btn, tabs });
  return new vm.Script(`${render.slice(start, end)}\n${context}();`, {
    filename: 'specimens/render.mjs (template-only Node evaluation)',
  }).runInContext(sandbox, { timeout: 1000 });
}
function byId(markup, id) {
  const element = tags(markup).find(node => node.attributes.id === id);
  assert.ok(element, `Missing emitted #${id}`);
  return element;
}
function referenceIntegrity(markup, label) {
  const elements = tags(markup);
  const ids = elements.filter(element => typeof element.attributes.id === 'string').map(element => element.attributes.id);
  assert.equal(new Set(ids).size, ids.length, `${label}: duplicate emitted IDs`);
  for (const element of elements) {
    for (const attribute of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
      if (!element.attributes[attribute]) continue;
      for (const id of element.attributes[attribute].split(/\s+/)) {
        assert.ok(ids.includes(id), `${label}: ${attribute}="${id}" has no emitted target`);
      }
    }
  }
}

function renderFixture(context = 'web', revision = 'after') {
  // Deliberately tiny DOM-shaped test doubles: string innerHTML, hand-authored
  // selector lookup and fake callbacks. No layout, DOM parser, event bubbling,
  // native keyboard defaults, real clock or accessibility tree is implemented.
  const listeners = new Map();
  const documentListeners = new Map();
  const timers = new Map();
  const focusCalls = [];
  let nextTimer = 0;
  const localElement = (value, group) => ({
    value, name: group, checked: false, listeners: new Map(),
    addEventListener(type, listener) { this.listeners.set(type, listener); },
    fire(type) { this.listeners.get(type)({ target: this }); },
  });
  const contextInputs = ['web', 'app', 'game'].map(value => localElement(value, 'context'));
  const revisionInputs = ['before', 'after'].map(value => localElement(value, 'revision'));
  const reset = localElement('reset', '');
  const log = { textContent: '' };
  const root = {
    dataset: {}, innerHTML: '',
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type, listener) { if (listeners.get(type) === listener) listeners.delete(type); },
    querySelector(selector) {
      const id = selector.match(/^#(.+)$/)?.[1];
      const tab = selector.match(/^\[data-tab="(.+)"\]$/)?.[1];
      const node = tags(this.innerHTML).find(node => id ? node.attributes.id === id : node.attributes['data-tab'] === tab);
      return node ? element(node) : null;
    },
  };
  let document;
  function element(node) {
    const attributes = node.attributes;
    const model = {
      id: attributes.id, name: attributes.name, value: attributes.value,
      dataset: { tab: attributes['data-tab'] }, disabled: attributes.disabled === true,
      textContent: '', getAttribute: name => attributes[name] ?? null,
      closest(selector) {
        if (selector === 'button') return node.tag === 'button' ? this : null;
        if (selector === '[data-tab]') return attributes['data-tab'] ? this : null;
        if (selector === '[role=tab]') return attributes.role === 'tab' ? this : null;
        return null;
      },
      focus() { focusCalls.push(this.id); document.activeElement = this; },
    };
    model.parentElement = { querySelectorAll(selector) {
      assert.equal(selector, '[role=tab]');
      return tags(root.innerHTML).filter(node => node.attributes.role === 'tab')
        .map(node => node.attributes.id === model.id ? model : element(node));
    } };
    return model;
  }
  document = {
    activeElement: null,
    querySelector(selector) {
      if (selector === '#specimen') return root;
      if (selector === '#event-log') return log;
      if (selector === '#reset') return reset;
      return root.querySelector(selector);
    },
    querySelectorAll(selector) {
      if (selector === 'input[name=context]') return contextInputs;
      if (selector === 'input[name=revision]') return revisionInputs;
      throw new Error(`Unimplemented test-double selector: ${selector}`);
    },
    getElementById(id) { return root.querySelector(`#${id}`); },
    addEventListener(type, listener) { documentListeners.set(type, listener); },
  };
  const sandbox = vm.createContext({
    document, location: { search: `?context=${context}&revision=${revision}` }, URLSearchParams,
    initialState, reduce, bindTabKeyboard, icon, btn, tabs,
    setTimeout(callback, delay) { assert.equal(delay, 900); const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
  });
  new vm.Script(render.replace(/^import[^\n]*\n/gm, ''), {
    filename: 'specimens/render.mjs (actual bootstrap with DOM-shaped doubles)',
  }).runInContext(sandbox, { timeout: 1000 });
  const currentState = () => vm.runInContext('state', sandbox);
  const clickTarget = target => listeners.get('click')({ target });
  const click = id => {
    const button = root.querySelector(`#${id}`);
    assert.ok(button, `Test-double fixture has #${id}`);
    // Explicit ancestor mapping tests the handler contract, not DOM bubbling.
    clickTarget({ closest: selector => button.closest(selector) });
    return button;
  };
  const changeContext = value => contextInputs.find(input => input.value === value).fire('change');
  const changeRevision = value => revisionInputs.find(input => input.value === value).fire('change');
  const changeChoice = (name, value) => listeners.get('change')({ target: { name, value } });
  const flushTimer = () => {
    const entry = timers.entries().next().value;
    assert.ok(entry, 'Scheduled fake timer required');
    timers.delete(entry[0]); entry[1]();
  };
  return { root, log, document, listeners, documentListeners, timers, focusCalls, currentState,
    clickTarget, click, changeContext, changeRevision, changeChoice, flushTimer,
    reset: () => reset.fire('click') };
}

await check('module-syntax', 'node_syntax', 'Node parses every specimen .mjs without executing its browser bootstrap', () => {
  for (const file of specimens.filter(file => file.endsWith('.mjs'))) {
    const result = spawnSync(process.execPath, ['--check', path.join(base, file)], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${file}: ${result.stderr}`);
  }
});

await check('node-reducer-keyboard-suite', 'node_behavior', 'Pure reducer and explicit tab-key test-double behavior', () => {
  const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', path.join(base, 'tests/semantics.test.mjs')], {
    encoding: 'utf8', timeout: 15000,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  nodeTestRun = { description: 'Exact Node test process output', status: result.status === 0 ? 'passed' : 'failed',
    command: 'node --test --test-reporter=tap tests/semantics.test.mjs', exit_code: result.status, output };
  assert.equal(result.status, 0, output);
  return { tests: Number(output.match(/# tests (\d+)/)?.[1]),
    passed: Number(output.match(/# pass (\d+)/)?.[1]), failed: Number(output.match(/# fail (\d+)/)?.[1]) };
});

await check('html-csp-no-network', 'source', 'Every specimen HTML declares network-disabled, self-only script policy', () => {
  const htmlFiles = specimens.filter(file => file.endsWith('.html'));
  assert.ok(htmlFiles.includes('specimens/index.html'));
  assert.ok(htmlFiles.includes('specimens/golf.html'), 'Isolated golf fixture must exist');
  for (const file of htmlFiles) {
    const meta = tags(source[file]).find(element => element.tag === 'meta'
      && String(element.attributes['http-equiv']).toLowerCase() === 'content-security-policy');
    assert.ok(meta, `${file}: CSP meta required`);
    const policy = Object.fromEntries(meta.attributes.content.split(';').map(value => value.trim()).filter(Boolean)
      .map(value => { const [directive, ...values] = value.split(/\s+/); return [directive, values]; }));
    assert.deepEqual(policy['connect-src'], ["'none'"], `${file}: connect-src`);
    assert.deepEqual(policy['script-src'], ["'self'"], `${file}: script-src`);
    assert.deepEqual(policy['object-src'], ["'none'"], `${file}: object-src`);
    assert.deepEqual(policy['base-uri'], ["'none'"], `${file}: base-uri`);
    for (const script of tags(source[file]).filter(element => element.tag === 'script')) {
      assert.equal(typeof script.attributes.src, 'string', `${file}: externalized local module required`);
    }
    assert.doesNotMatch(source[file], /\son\w+\s*=/i, `${file}: inline event handler`);
  }
});

await check('specimen-source-no-network-primitives', 'source', 'Specimen code/assets contain no remote URLs or network-commit primitives', () => {
  for (const [file, content] of Object.entries(source)) {
    assert.doesNotMatch(content, /(?:https?:|wss?:)\/\//i, `${file}: remote URL`);
    if (file.endsWith('.mjs')) {
      assert.doesNotMatch(content, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\b/,
        `${file}: networking primitive`);
      assert.doesNotMatch(content, /\bimport\s*\(/, `${file}: dynamic code import`);
    }
    if (file.endsWith('.css')) {
      assert.doesNotMatch(content, /@import\b/i, `${file}: stylesheet import`);
      assert.doesNotMatch(content, /url\(\s*["']?(?:https?:)?\/\//i, `${file}: external CSS asset`);
    }
    if (file.endsWith('.html')) {
      for (const element of tags(content)) {
        for (const name of ['src', 'href']) {
          if (typeof element.attributes[name] === 'string') {
            assert.doesNotMatch(element.attributes[name], /^(?:[a-z]+:|\/\/)/i, `${file}: nonlocal ${name}`);
          }
        }
      }
    }
  }
  return { scanned: specimens };
});

await check('local-html-assets-and-links', 'source', 'Declared local specimen assets and document links exist on disk', async () => {
  for (const file of specimens.filter(file => file.endsWith('.html'))) {
    for (const element of tags(source[file])) {
      for (const name of ['src', 'href']) {
        const value = element.attributes[name];
        if (typeof value !== 'string' || value.startsWith('#')) continue;
        const relative = value.split(/[?#]/)[0];
        assert.ok(relative && !/^(?:[a-z]+:|\/\/)/i.test(relative), `${file}: local reference required`);
        await access(path.resolve(base, path.dirname(file), relative));
      }
    }
  }
});

await check('local-module-import-boundaries', 'source', 'Every authored specimen module imports existing local package code only', async () => {
  for (const file of specimens.filter(file => file.endsWith('.mjs'))) {
    for (const match of source[file].matchAll(/\b(?:from|import)\s*['"]([^'"]+)['"]/g)) {
      assert.match(match[1], /^\.\.?\//, `${file}: no bare/remote module import`);
      const resolved = path.resolve(base, path.dirname(file), match[1]);
      assert.ok(resolved.startsWith(`${path.join(base, 'specimens')}${path.sep}`), `${file}: import stays within specimen source`);
      await access(resolved);
    }
  }
});

await check('emitted-native-roles', 'node_template_structure', 'Generated template strings use buttons for commands, links for navigation, native radio choices and noninteractive meters', () => {
  for (const context of ['web', 'app', 'game']) {
    const elements = tags(generated(context));
    for (const element of elements.filter(element => element.tag === 'button')) {
      assert.equal(element.attributes.type, 'button', `${context}: explicit local command button`);
    }
    for (const element of elements.filter(element => element.attributes.href)) assert.equal(element.tag, 'a');
    for (const element of elements.filter(element => element.tag === 'svg')) assert.equal(element.attributes['aria-hidden'], 'true');
  }
  for (const context of ['app', 'game']) {
    const markup = generated(context);
    const choices = tags(markup).filter(element => element.tag === 'input');
    assert.equal(choices.length, 2, `${context}: native exclusive choices`);
    assert.ok(choices.every(element => element.attributes.type === 'radio'));
    assert.equal(new Set(choices.map(element => element.attributes.name)).size, 1);
    assert.equal(choices.filter(element => element.attributes.checked === true).length, 1);
    assert.match(markup, /<fieldset\b[^>]*>[\s\S]*?<legend\b/);
  }
  const game = generated('game');
  assert.match(game, /<div class="game-resource"><span>BEACONS<\/span><strong>/);
  assert.doesNotMatch(game, /<button[^>]*>[^<]*BEACONS/);
});

await check('emitted-aria-reference-integrity', 'node_template_structure', 'All generated IDREF attributes target emitted elements in tested local states', () => {
  for (const state of [{}, { webTab: 'details' }, { pending: true }, { removed: true }, { starred: true }]) {
    referenceIntegrity(generated('web', state), `web ${JSON.stringify(state)}`);
  }
  for (const state of [{}, { appTab: 'downloads' }, { menuOpen: true }, { pending: true }, { starred: true }]) {
    referenceIntegrity(generated('app', state), `app ${JSON.stringify(state)}`);
  }
  for (const state of [{}, { beacons: 0, signalCount: 3 }, { route: 'shore' }]) {
    referenceIntegrity(generated('game', state), `game ${JSON.stringify(state)}`);
  }
});

await check('emitted-tabs-selection-panel-wiring', 'node_template_structure', 'Each tab is selected/focusable exactly once and refers to its consistently present panel', () => {
  for (const [context, key, choices] of [['web', 'webTab', ['draft', 'details']], ['app', 'appTab', ['saved', 'downloads']]]) {
    for (const value of choices) {
      const markup = generated(context, { [key]: value });
      const elements = tags(markup);
      const tabs = elements.filter(element => element.attributes.role === 'tab');
      const panels = elements.filter(element => element.attributes.role === 'tabpanel');
      assert.equal(tabs.length, 2);
      assert.equal(panels.length, 2, `${context}: both panel references must resolve`);
      assert.equal(tabs.filter(tab => tab.attributes['aria-selected'] === 'true').length, 1);
      assert.equal(tabs.filter(tab => tab.attributes.tabindex === '0').length, 1);
      for (const tab of tabs) {
        const selected = tab.attributes['data-tab'] === value;
        assert.equal(tab.attributes['aria-selected'], String(selected));
        assert.equal(tab.attributes.tabindex, selected ? '0' : '-1');
        const panel = panels.find(panel => panel.attributes.id === tab.attributes['aria-controls']);
        assert.ok(panel, `${context}: panel for ${tab.attributes.id}`);
        assert.equal(panel.attributes['aria-labelledby'], tab.attributes.id);
        assert.equal(panel.attributes.hidden === true, !selected, `${context}: inactive panel hidden`);
      }
    }
  }
});

await check('emitted-stable-toggle-identity', 'node_template_structure', 'Toggle identity labels remain stable while aria-pressed changes', () => {
  for (const [context, id] of [['web', 'star-web'], ['app', 'star-app']]) {
    const off = generated(context);
    const on = generated(context, { starred: true });
    const offButton = byId(off, id);
    const onButton = byId(on, id);
    assert.equal(offButton.attributes['aria-pressed'], 'false');
    assert.equal(onButton.attributes['aria-pressed'], 'true');
    assert.equal(offButton.attributes['aria-label'], onButton.attributes['aria-label'], `${id}: stable accessible identity`);
    const label = markup => markup.match(new RegExp(`<button[^>]*id="${id}"[\\s\\S]*?<span class="control-label">([\\s\\S]*?)<\\/span>`))?.[1];
    assert.equal(label(off), label(on), `${id}: stable label slot`);
  }
});

await check('emitted-local-pending-and-unavailable', 'node_template_structure', 'Busy/exhausted/removed states preserve commands and reference readable local reasons', () => {
  for (const context of ['web', 'app']) {
    const markup = generated(context, { pending: true });
    const save = byId(markup, 'save');
    assert.equal(save.attributes.disabled, true);
    assert.equal(save.attributes['aria-busy'], 'true');
    assert.equal(typeof save.attributes['aria-describedby'], 'string');
    referenceIntegrity(markup, `${context} pending`);
  }
  const removed = generated('web', { removed: true });
  assert.equal(byId(removed, 'save').attributes.disabled, true);
  assert.equal(byId(removed, 'remove').attributes.disabled, true);
  const exhausted = generated('game', { beacons: 0, signalCount: 3 });
  assert.equal(byId(exhausted, 'signal').attributes.disabled, true);
  assert.equal(byId(exhausted, 'signal').attributes['aria-describedby'], 'beacon-reason');
  assert.match(exhausted, /No beacons remain\. Reset the local state to restock\./);
});

await check('before-after-protected-markup-parity', 'node_template_structure', 'Treatments generate exactly the same content/roles at matching fixture states', () => {
  for (const context of ['web', 'app', 'game']) {
    for (const state of [{}, { starred: true }, { pending: true }, { beacons: 0, signalCount: 3 }]) {
      assert.equal(generated(context, { ...state, revision: 'before' }), generated(context, { ...state, revision: 'after' }));
    }
  }
});

await check('source-pending-epoch-guards', 'source', 'Async callback is epoch-gated and context/reset clear and invalidate the timer', () => {
  assert.match(render, /const startedEpoch=epoch,operation=state\.operation/);
  assert.match(render, /if\(startedEpoch===epoch\)/);
  assert.match(render, /clearTimeout\(timer\);epoch\+\+;dispatch\(\{type:'CONTEXT'/);
  assert.match(render, /clearTimeout\(timer\);epoch\+\+;dispatch\(\{type:'RESET'/);
  assert.match(render, /clearTimeout\(timer\);epoch\+\+;dispatch\(\{type:'REMOVE'/);
  assert.match(render, /type:'SAVE_DONE',operation/);
  assert.match(semantics, /event\.operation===state\.operation/);
  assert.match(render, /case 'save':if\(state\.pending\)return/);
  return 'Source guard inspected; no real browser timer or native double-activation was exercised';
});

await check('source-input-boundaries', 'source', 'Handlers resolve containing controls and keep native command keys independent of custom tab keys', () => {
  assert.match(render, /event\.target\.closest\('\[data-tab\]'\)/);
  assert.match(render, /event\.target\.closest\('button'\)/);
  assert.match(render, /if\(!button\|\|button\.disabled\)return/);
  assert.match(render, /event\.target\.name==='format'/);
  assert.match(render, /event\.target\.name==='route'/);
  assert.match(render, /if\(event\.key==='Escape'&&state\.menuOpen\)/);
  assert.doesNotMatch(semantics + render, /event\.key===['"](?:Enter| |Space)['"]/);
});

await check('render-bootstrap-dom-shaped-doubles', 'node_dom_shaped_fixture', 'Actual render module initializes each context/treatment against explicit document doubles', () => {
  for (const context of ['web', 'app', 'game']) {
    for (const revision of ['before', 'after']) {
      const fixture = renderFixture(context, revision);
      assert.equal(fixture.root.dataset.context, context);
      assert.equal(fixture.root.dataset.revision, revision);
      assert.equal(fixture.root.innerHTML, generated(context, { revision }));
      referenceIntegrity(fixture.root.innerHTML, `${context}/${revision} module bootstrap`);
    }
  }
});

await check('render-local-save-reset-remove-doubles', 'node_dom_shaped_fixture', 'Actual local handlers suppress duplicate start and reject replaced callbacks with fake timers', () => {
  const fixture = renderFixture();
  const originalButton = fixture.click('save');
  fixture.clickTarget({ closest: selector => originalButton.closest(selector) });
  assert.equal(fixture.timers.size, 1);
  assert.equal(fixture.currentState().pending, true);
  assert.equal(fixture.currentState().operation, 1);
  fixture.changeRevision('before');
  assert.equal(fixture.currentState().pending, true);
  fixture.flushTimer();
  assert.equal(fixture.currentState().saveCount, 1);
  assert.equal(fixture.currentState().pending, false);
  fixture.click('save');
  const staleAfterReset = [...fixture.timers.values()][0];
  fixture.reset();
  assert.equal(fixture.timers.size, 0);
  fixture.click('save');
  staleAfterReset();
  assert.equal(fixture.currentState().saveCount, 0);
  assert.equal(fixture.currentState().pending, true);
  fixture.flushTimer();
  assert.equal(fixture.currentState().saveCount, 1);
  fixture.click('save');
  const staleAfterRemove = [...fixture.timers.values()][0];
  fixture.click('remove');
  assert.equal(fixture.timers.size, 0);
  assert.equal(fixture.currentState().pending, false);
  assert.equal(fixture.currentState().removed, true);
  staleAfterRemove();
  assert.equal(fixture.currentState().saveCount, 1);
  fixture.reset();
  fixture.click('save');
  const staleAfterContext = [...fixture.timers.values()][0];
  fixture.changeContext('app');
  fixture.click('save');
  staleAfterContext();
  assert.equal(fixture.currentState().saveCount, 0);
  assert.equal(fixture.currentState().pending, true);
  fixture.flushTimer();
  assert.equal(fixture.currentState().saveCount, 1);
});

await check('render-selection-disclosure-resource-doubles', 'node_dom_shaped_fixture', 'Actual selection, disclosure/Escape, toggle and resource handlers update local emitted strings', () => {
  const fixture = renderFixture('app');
  fixture.changeChoice('format', 'map');
  assert.equal(fixture.currentState().format, 'map');
  fixture.click('star-app');
  assert.equal(fixture.currentState().starred, true);
  assert.equal(byId(fixture.root.innerHTML, 'star-app').attributes['aria-pressed'], 'true');
  fixture.click('tab-downloads');
  assert.equal(fixture.currentState().appTab, 'downloads');
  let prevented = false;
  fixture.listeners.get('keydown')({ key: 'ArrowLeft', target: fixture.root.querySelector('#tab-downloads'),
    preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(fixture.currentState().appTab, 'saved');
  assert.equal(fixture.focusCalls.at(-1), 'tab-saved');
  fixture.click('menu');
  assert.equal(fixture.currentState().menuOpen, true);
  assert.notEqual(byId(fixture.root.innerHTML, 'app-menu').attributes.hidden, true);
  fixture.documentListeners.get('keydown')({ key: 'Escape' });
  assert.equal(fixture.currentState().menuOpen, false);
  assert.equal(byId(fixture.root.innerHTML, 'app-menu').attributes.hidden, true);
  assert.equal(fixture.focusCalls.at(-1), 'menu');
  fixture.changeContext('game');
  fixture.changeChoice('route', 'shore');
  assert.equal(fixture.currentState().route, 'shore');
  for (let index = 0; index < 4; index++) fixture.click('signal');
  assert.equal(fixture.currentState().signalCount, 3);
  assert.equal(fixture.currentState().beacons, 0);
  assert.equal(byId(fixture.root.innerHTML, 'signal').attributes.disabled, true);
});

await check('golf-isolated-static-role-anatomy', 'source', 'Isolated golf source preserves labels/native roles, IDREFs and scoped candidate inner-face anatomy', () => {
  const html = source['specimens/golf.html'];
  const css = source['specimens/golf.css'];
  const code = source['specimens/golf.mjs'];
  assert.equal(typeof html, 'string');
  assert.equal(typeof css, 'string');
  assert.equal(typeof code, 'string');
  referenceIntegrity(html, 'isolated golf HTML source');
  for (const id of ['create', 'join', 'refresh']) {
    const button = byId(html, id);
    assert.equal(button.tag, 'button');
    assert.equal(button.attributes.type, 'button');
  }
  assert.match(html, /class="golf-button__label">방 만들기<\/span>/);
  assert.match(html, /class="golf-button__face"/);
  for (const svg of tags(html).filter(node => node.tag === 'svg')) assert.equal(svg.attributes['aria-hidden'], 'true');
  assert.match(css, /#golf-fixture\[data-revision=after\] #create:active:not\(:disabled\) \.golf-button__face\{transform:translateY\(3px\)/);
  assert.match(css, /#golf-fixture\[data-revision=after\] #create \.golf-button__label\{[^}]*font-weight:600/);
  assert.match(code, /label\.textContent='방 만들기'/);
  assert.doesNotMatch(code, /(?:create|join)\.textContent\s*=/);
  return 'Source anatomy only; the final cascade, Korean font pixels, motion and geometry are not measured';
});

await check('golf-explicit-state-dom-shaped-doubles', 'node_dom_shaped_fixture', 'Actual isolated golf module toggles explicitly simulated local states and activation messages against doubles', () => {
  const elements = new Map();
  const label = { textContent: '방 만들기' };
  const make = (id, textContent = '') => {
    const model = { id, textContent, disabled: false, dataset: {}, listeners: new Map(), attributes: new Map(),
      addEventListener(type, callback) { this.listeners.set(type, callback); },
      setAttribute(name, value) { this.attributes.set(name, value); },
      querySelector(selector) { assert.equal(selector, '.golf-button__label'); return label; },
      fire(type) { this.listeners.get(type)({ target: this }); } };
    elements.set(`#${id}`, model); return model;
  };
  const fixture = make('golf-fixture');
  const create = make('create', '방 만들기');
  const join = make('join', '참가');
  const refresh = make('refresh', '새로고침');
  const reason = make('local-reason');
  const status = make('golf-status');
  const inputs = (name, values) => values.map(value => ({ ...make(`${name}-${value}`), name, value }));
  const revisions = inputs('revision', ['before', 'after']);
  const states = inputs('state', ['default', 'pending', 'disabled']);
  const document = {
    querySelector(selector) { assert.ok(elements.has(selector), `Known golf-double selector ${selector}`); return elements.get(selector); },
    querySelectorAll(selector) {
      if (selector === 'input[name=revision]') return revisions;
      if (selector === 'input[name=state]') return states;
      throw new Error(`Unimplemented golf-double selector ${selector}`);
    },
  };
  new vm.Script(source['specimens/golf.mjs'], { filename: 'specimens/golf.mjs (DOM-shaped doubles)' })
    .runInContext(vm.createContext({ document }), { timeout: 1000 });
  for (const revision of revisions) {
    revision.fire('change'); assert.equal(fixture.dataset.revision, revision.value);
  }
  states.find(state => state.value === 'pending').fire('change');
  assert.equal(create.disabled, true); assert.equal(join.disabled, true);
  assert.equal(create.attributes.get('aria-busy'), 'true');
  assert.match(reason.textContent, /No request is running/);
  states.find(state => state.value === 'disabled').fire('change');
  assert.equal(create.disabled, true); assert.equal(join.disabled, true);
  assert.equal(create.attributes.get('aria-busy'), 'false');
  states.find(state => state.value === 'default').fire('change');
  assert.equal(create.disabled, false); assert.equal(join.disabled, false);
  assert.equal(label.textContent, '방 만들기');
  for (const [index, button] of [create, join, refresh].entries()) {
    button.fire('click');
    assert.match(status.textContent, new RegExp(`local activation ${index + 1}\\.`));
    assert.match(status.textContent, /No room created, joined or refreshed/);
  }
  return 'Explicit callback/state-property checks only; native disabled input suppression is not modeled or claimed';
});

await check('source-scoped-tactile-press', 'source', 'Game tactile translation is authored on the inner face and scoped away from other families', () => {
  const activeRules = [...families.matchAll(/([^{}]+)\{([^{}]*\btransform\s*:[^{}]*)\}/g)];
  assert.ok(activeRules.length > 0);
  for (const [, selector, declarations] of activeRules) {
    assert.match(selector, /\[data-context=game\]/);
    assert.match(selector, /\.control-face/);
    assert.doesNotMatch(selector, /(?:^|,)\s*button(?:\s|:|\.)/);
    if (/translate/.test(declarations)) {
      assert.match(selector, /:active:not\(:disabled\)/);
      assert.match(selector, /control--primary/);
    }
  }
  assert.doesNotMatch(families, /(?:^|})\s*button[^{}]*\{[^{}]*(?:transform|box-shadow)/m);
  return 'Selector declarations inspected only; target/sibling bounds and final computed cascade remain unmeasured';
});

await check('source-focus-selection-reduced-motion', 'source', 'Authored focus, selected, pending and reduced-motion rules remain distinct', () => {
  assert.match(tokens, /button:focus-visible,a:focus-visible,input:focus-visible\{outline:3px/);
  assert.match(tokens, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(tokens, /transition:none!important;animation:none!important/);
  assert.match(contexts, /input:focus-visible\+span/);
  assert.match(contexts, /input:checked\+span/);
  assert.match(families, /\[aria-pressed=true\]/);
  assert.match(families, /\.control\.control:disabled/);
  assert.match(families, /\.control\.control\[aria-busy=true\]/);
  assert.match(tokens, /\.control\[aria-pressed=true\] \.selected-mark\{display:inline\}/);
  assert.match(families, /\.control--icon\[aria-pressed=true\] \.icon\{fill:currentColor/);
  assert.match(generated('app', { starred: true }), /class="selected-mark" aria-hidden="true">✓/);
});

await check('role-contract-coverage', 'source_contract', 'Machine-readable contract covers all documented control-role decisions', async () => {
  const contract = JSON.parse(await read('role-contracts.json'));
  const roleRecords = Array.isArray(contract) ? contract : contract.roles;
  assert.ok(Array.isArray(roleRecords), 'role-contracts.json must expose a roles array');
  const roleIds = roleRecords.map(role => role.id ?? role.role ?? role.name);
  assert.equal(new Set(roleIds).size, roleIds.length, 'Unique role identifiers required');
  assert.ok(roleIds.every(id => typeof id === 'string' && id), 'Every role has an identifier');
  const normalized = roleIds.map(id => id.toLowerCase().replace(/[ _]/g, '-'));
  const expected = ['primary', 'secondary', 'tertiary', 'icon', 'destructive', 'toggle', 'segment', 'tab', 'navigation', 'menu', 'hud'];
  for (const role of expected) assert.ok(normalized.some(id => id.includes(role)), `Missing ${role} role decision`);
  assert.ok(normalized.includes('menu-trigger') && normalized.includes('menu-row'), 'Trigger and row contracts remain distinct');
  for (const role of roleRecords) {
    assert.equal(typeof role.meaning, 'string', `${role.id}: explicit meaning`);
    for (const field of ['semantic_contract', 'visual_contract', 'protected']) {
      assert.ok(Array.isArray(role[field]) && role[field].length > 0, `${role.id}: ${field}`);
    }
    assert.ok(role.state_applicability && typeof role.state_applicability === 'object', `${role.id}: state applicability`);
  }
  return { role_count: roleIds.length, role_ids: roleIds,
    guide_role_decisions: 11, note: 'Primary/secondary/tertiary, presentation, hazard and context are separate decisions, not exclusive widget types' };
});

const artifacts = [...specimens, 'GUIDE.md', 'AI_INSTRUCTIONS.md', 'MAINTAINER_QUICKSTART.md', 'role-contracts.json',
  'tests/semantics.test.mjs', 'tests/verify.mjs'];
const hashes = [];
for (const relative of artifacts) {
  try {
    const content = await readFile(path.join(base, relative));
    hashes.push({ path: relative, bytes: content.length, sha256: createHash('sha256').update(content).digest('hex') });
  } catch (error) { hashes.push({ path: relative, status: 'missing', detail: error.code }); }
}
const passed = checks.filter(check => check.status === 'passed').length;
const failed = checks.filter(check => check.status === 'failed').length;
const report = {
  schema_version: 1,
  generated_at_utc: new Date().toISOString(),
  command: 'node tests/verify.mjs',
  runtime: { node: process.version, platform: process.platform, architecture: process.arch },
  scope: 'Focused source inspection, Node syntax, pure reducer, tab-key helper test doubles, template strings and actual module execution against explicit DOM-shaped doubles/fake timers. No browser/DOM implementation.',
  status: failed ? 'failed' : 'passed', summary: { passed, failed },
  evidence_boundaries: {
    source_review: 'run', node_behavior: 'run',
    template_structure: 'Node VM evaluates only existing template declarations; regex tag/attribute inspection is not DOM parsing or accessibility-tree validation',
    browser_render_and_input: { status: 'blocked',
      reason: 'Recorded preview attempts: installed Playwright has no downloaded browser executable; sandboxed Chromium fails a permitted socket; supported cloud browser localhost returns ERR_BLOCKED_BY_CLIENT. This suite did not retry or bypass those routes.' },
    geometry_and_computed_cascade: { status: 'not_run', reason: 'No available permitted browser runtime; authored CSS is not measured rendering' },
    screenshots: { status: 'not_run', reason: 'No rendered capture produced by this suite' },
    physical_touch_or_controller: { status: 'not_run', reason: 'No physical input device used' },
    assistive_technology: { status: 'not_run', reason: 'No screen reader or accessibility tree inspected' },
    human_review: { status: 'not_run', reason: 'These checks are automated/source-only' },
    production_integration: { status: 'not_run', reason: 'Local authored fixture only; no external service connection' },
    publication: { status: 'not_run', reason: 'No publication performed' },
  },
  checks, node_test_process: nodeTestRun, artifacts: hashes,
};
await mkdir(path.join(base, 'records'), { recursive: true });
await writeFile(path.join(base, 'records/source-test-results.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`\n${passed} passed, ${failed} failed. Report: records/source-test-results.json`);
process.exitCode = failed ? 1 : 0;
