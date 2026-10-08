import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as before from '../before/state.mjs';
import * as after from '../after/state.mjs';
import { loadFixture } from '../after/platform.mjs';
import { checkDependencies, dependencyViolations } from './dependencies.mjs';

const root = new URL('../', import.meta.url);
const fixture = before.deepFreeze(JSON.parse(await readFile(new URL('before/fixture.json', root), 'utf8')));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const cases = {
  move: [{ type: 'CHOOSE_COMMAND', command: 'move' }, { type: 'TARGET', target: { kind: 'waypoint', id: 'relay' } }, { type: 'COMMIT' }, { type: 'COMMIT' }],
  attackRecovery: [{ type: 'CHOOSE_COMMAND', command: 'attack' }, { type: 'ACTIVATE_UNIT', id: 'willow' }, { type: 'COMMIT' }, { type: 'ACTIVATE_UNIT', id: 'fang' }, { type: 'COMMIT' }],
  emptyRepeatedStop: [{ type: 'CLEAR' }, { type: 'STOP' }, { type: 'STOP' }, { type: 'COMMIT' }],
  selectionAndCancel: [{ type: 'SELECT', id: 'arrow', additive: true }, { type: 'SELECT', id: 'arrow', additive: true }, { type: 'CHOOSE_COMMAND', command: 'move' }, { type: 'TARGET', target: { kind: 'point', x: 480, y: 340 } }, { type: 'CANCEL' }],
  repeatedStop: [{ type: 'STOP' }, { type: 'STOP' }, { type: 'RESET' }, { type: 'RESET' }],
  invalidCoordinates: [{ type: 'CHOOSE_COMMAND', command: 'move' }, ...[-1, 961, NaN, Infinity].map(x => ({ type: 'TARGET', target: { kind: 'point', x, y: 340 } })), { type: 'TARGET', target: { kind: 'waypoint', id: 'missing' } }, { type: 'COMMIT' }],
  hoverFocusUnknown: [{ type: 'HOVER', id: 'fang' }, { type: 'FOCUS', key: 'attack' }, { type: 'CHOOSE_COMMAND', command: 'unknown' }, { type: 'UNKNOWN' }, { type: 'RESET' }],
  presets: fixture.presets.flatMap(name => [{ type: 'PRESET', name }, { type: 'RESET' }])
};

test('retained baseline hashes match provenance; unchanged domain/focus/fixture stay exact', async () => {
  const provenance = JSON.parse(await readFile(new URL('provenance.json', root), 'utf8'));
  for (const record of provenance.baseline_files) {
    const bytes = await readFile(new URL(record.copy, root));
    assert.equal(bytes.length, record.bytes);
    assert.equal(hash(bytes), record.sha256);
  }
  for (const name of ['state.mjs', 'focus.mjs', 'fixture.json']) {
    assert.deepEqual(await readFile(new URL('before/' + name, root)), await readFile(new URL('after/' + name, root)));
  }
});

for (const [name, actions] of Object.entries(cases)) {
  test('domain parity at every step: ' + name, () => {
    let left = before.createState(fixture), right = after.createState(fixture);
    for (const action of actions) {
      const priorLeft = structuredClone(left), priorRight = structuredClone(right);
      const input = structuredClone(action);
      left = before.transition(left, action, fixture);
      right = after.transition(right, action, fixture);
      assert.deepEqual(action, input, 'action input is not mutated');
      assert.deepEqual(left, right);
      assert.deepEqual(before.viewModel(left, fixture), after.viewModel(right, fixture));
      assert.deepEqual([...before.latestOrdersByUnit(left)], [...after.latestOrdersByUnit(right)]);
      // Public snapshots must remain serializable for the actual fixture/actions.
      assert.doesNotThrow(() => structuredClone(left));
      assert.deepEqual(priorLeft, priorRight);
    }
    if (name === 'move') assert.equal(right.committedOrders.length, 1, 'duplicate confirm cannot send twice');
    if (name === 'emptyRepeatedStop' || name === 'invalidCoordinates') assert.equal(right.committedOrders.length, 0);
    if (name === 'attackRecovery') assert.equal(right.committedOrders[0].target.id, 'fang');
  });
}

test('platform preserves relative URL and recursively freezes successful fixture', async () => {
  const loaded = await loadFixture(async url => {
    assert.equal(url, './fixture.json');
    return { ok: true, json: async () => structuredClone(fixture) };
  });
  assert.deepEqual(loaded, fixture);
  assert.ok(Object.isFrozen(loaded.units[0]));
  assert.throws(() => { loaded.units[0].hull = 0; }, TypeError);
});

test('platform HTTP, network, and JSON failures retain original error semantics', async () => {
  await assert.rejects(loadFixture(async () => ({ ok: false, json: () => assert.fail('must not decode') })), { message: 'Could not load the shared fixture' });
  const networkError = new TypeError('network unavailable');
  await assert.rejects(loadFixture(async () => { throw networkError; }), error => error === networkError);
  const jsonError = new SyntaxError('bad JSON');
  await assert.rejects(loadFixture(async () => ({ ok: true, json: async () => { throw jsonError; } })), error => error === jsonError);
});

test('module imports and browser capability ownership follow the published map', async () => {
  assert.deepEqual(await checkDependencies(new URL('after/', root)), []);
});

test('guard detects forbidden directions, DOM access, unmapped files, and dynamic imports', () => {
  assert.ok(dependencyViolations('state.mjs', "import { createView } from './view.mjs';").length);
  assert.ok(dependencyViolations('view.mjs', "import { bindControls } from './controllers.mjs';").length);
  assert.ok(dependencyViolations('state.mjs', 'document.querySelector("main")').length);
  assert.ok(dependencyViolations('controllers.mjs', 'transition(state, action, fixture)').length);
  assert.ok(dependencyViolations('view.mjs', "import('./platform.mjs')").length);
  assert.ok(dependencyViolations('manager.mjs', '').length);
  assert.deepEqual(dependencyViolations('view.mjs', "import { viewModel } from './state.mjs';"), []);
});
