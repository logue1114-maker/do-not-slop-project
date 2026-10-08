import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, reduce, bindTabKeyboard } from '../specimens/semantics.mjs';

// These are pure Node tests. Keyboard targets below are explicit test doubles,
// not browser Elements, native key activation or accessibility-tree evidence.

test('initialState returns independent, complete local fixture states', () => {
  const first = initialState();
  const second = initialState();
  assert.notStrictEqual(first, second);
  assert.deepEqual(first, second);
  assert.deepEqual(first, {
    context: 'web', revision: 'after', webTab: 'draft', appTab: 'saved',
    format: 'audio', starred: false, saveCount: 0, pending: false,
    removed: false, beacons: 3, signalCount: 0, route: 'ridge', menuOpen: false, operation: 0,
  });
  first.starred = true;
  assert.equal(second.starred, false);
});

test('changing context resets local task state and preserves treatment', () => {
  const original = { ...initialState(), revision: 'before', starred: true,
    pending: true, saveCount: 2, menuOpen: true, beacons: 0 };
  const result = reduce(Object.freeze(original), { type: 'CONTEXT', value: 'app' });
  assert.deepEqual(result, { ...initialState(), context: 'app', revision: 'before', operation: original.operation + 1 });
  assert.equal(original.pending, true);
});

test('changing treatment preserves the same local content and task state', () => {
  const original = { ...initialState(), starred: true, pending: true, saveCount: 1 };
  const result = reduce(Object.freeze(original), { type: 'REVISION', value: 'before' });
  assert.deepEqual(result, { ...original, revision: 'before' });
});

test('reset restores resources and local task state while preserving context/treatment', () => {
  const original = { ...initialState(), context: 'game', revision: 'before',
    beacons: 0, signalCount: 3, route: 'shore', pending: true, removed: true };
  assert.deepEqual(reduce(original, { type: 'RESET' }), {
    ...initialState(), context: 'game', revision: 'before', operation: original.operation + 1,
  });
});

test('web/app tab transitions update their own selection field', () => {
  const web = reduce(initialState(), { type: 'TAB', value: 'details' });
  assert.equal(web.webTab, 'details');
  assert.equal(web.appTab, 'saved');
  const app = reduce({ ...web, context: 'app' }, { type: 'TAB', value: 'downloads' });
  assert.equal(app.appTab, 'downloads');
  assert.equal(app.webTab, 'details');
});

test('format and route transitions preserve independent fixture state', () => {
  const original = Object.freeze({ ...initialState(), starred: true });
  const format = reduce(original, { type: 'FORMAT', value: 'map' });
  assert.equal(format.format, 'map');
  assert.equal(format.route, 'ridge');
  const route = reduce(format, { type: 'ROUTE', value: 'shore' });
  assert.equal(route.route, 'shore');
  assert.equal(route.format, 'map');
  assert.equal(route.starred, true);
});

test('toggle state reverses without modifying other fixture fields', () => {
  const original = Object.freeze(initialState());
  const on = reduce(original, { type: 'STAR' });
  assert.equal(on.starred, true);
  assert.deepEqual(reduce(on, { type: 'STAR' }), original);
});

test('duplicate pending start is suppressed and does not mutate the fixture', () => {
  const original = Object.freeze(initialState());
  const pending = reduce(original, { type: 'SAVE_START' });
  assert.equal(pending.pending, true);
  assert.equal(pending.saveCount, 0);
  assert.equal(pending.operation, original.operation + 1);
  assert.strictEqual(reduce(pending, { type: 'SAVE_START' }), pending);
  assert.equal(original.pending, false);
});

test('one pending completion settles once; repeat completion is ignored', () => {
  const pending = reduce(initialState(), { type: 'SAVE_START' });
  const done = reduce(pending, { type: 'SAVE_DONE', operation: pending.operation });
  assert.equal(done.pending, false);
  assert.equal(done.saveCount, 1);
  assert.strictEqual(reduce(done, { type: 'SAVE_DONE', operation: pending.operation }), done);
  const secondPending = reduce(done, { type: 'SAVE_START' });
  const second = reduce(secondPending, { type: 'SAVE_DONE', operation: secondPending.operation });
  assert.equal(second.saveCount, 2);
});

test('completion while no operation is pending has no effect', () => {
  const idle = initialState();
  assert.strictEqual(reduce(idle, { type: 'SAVE_DONE', operation: idle.operation }), idle);
});

test('stale completion after reset/context replacement is ignored while idle', () => {
  const pending = reduce(initialState(), { type: 'SAVE_START' });
  const reset = reduce(pending, { type: 'RESET' });
  assert.strictEqual(reduce(reset, { type: 'SAVE_DONE', operation: pending.operation }), reset);
  const replaced = reduce(pending, { type: 'CONTEXT', value: 'app' });
  assert.strictEqual(reduce(replaced, { type: 'SAVE_DONE', operation: pending.operation }), replaced);
  assert.ok(reset.operation > pending.operation);
  assert.ok(replaced.operation > pending.operation);
});

test('old completion cannot settle a newer operation after reset or context replacement', () => {
  const first = reduce(initialState(), { type: 'SAVE_START' });
  for (const replacement of [{ type: 'RESET' }, { type: 'CONTEXT', value: 'app' }]) {
    const replaced = reduce(first, replacement);
    const second = reduce(replaced, { type: 'SAVE_START' });
    assert.strictEqual(reduce(second, { type: 'SAVE_DONE', operation: first.operation }), second);
    assert.strictEqual(reduce(second, { type: 'SAVE_DONE' }), second);
    const done = reduce(second, { type: 'SAVE_DONE', operation: second.operation });
    assert.equal(done.saveCount, 1);
    assert.equal(done.pending, false);
  }
});

test('removal invalidates pending work and stale completion cannot restore it', () => {
  const pending = reduce(initialState(), { type: 'SAVE_START' });
  const removed = reduce(pending, { type: 'REMOVE' });
  assert.equal(removed.pending, false);
  assert.equal(removed.removed, true);
  assert.ok(removed.operation > pending.operation);
  assert.strictEqual(reduce(removed, { type: 'SAVE_DONE', operation: pending.operation }), removed);
  const newPending = reduce(reduce(removed, { type: 'RESET' }), { type: 'SAVE_START' });
  assert.strictEqual(reduce(newPending, { type: 'SAVE_DONE', operation: pending.operation }), newPending);
});

test('local removal blocks new save starts and reset provides recovery', () => {
  const removed = reduce(initialState(), { type: 'REMOVE' });
  assert.equal(removed.removed, true);
  assert.strictEqual(reduce(removed, { type: 'SAVE_START' }), removed);
  const reset = reduce(removed, { type: 'RESET' });
  assert.equal(reset.removed, false);
  assert.equal(reduce(reset, { type: 'SAVE_START' }).pending, true);
});

test('signal consumes exactly one local beacon and exhausted activation is safe', () => {
  let state = { ...initialState(), context: 'game' };
  for (let index = 1; index <= 3; index++) {
    state = reduce(Object.freeze(state), { type: 'SIGNAL' });
    assert.equal(state.beacons, 3 - index);
    assert.equal(state.signalCount, index);
  }
  assert.strictEqual(reduce(state, { type: 'SIGNAL' }), state);
  assert.equal(state.beacons, 0);
});

test('disclosure state opens and closes; unknown events are ignored', () => {
  const original = initialState();
  const open = reduce(original, { type: 'MENU' });
  assert.equal(open.menuOpen, true);
  assert.deepEqual(reduce(open, { type: 'MENU' }), original);
  assert.strictEqual(reduce(original, { type: 'UNSUPPORTED' }), original);
});

function keyboardFixture() {
  const listeners = new Map();
  const selected = [];
  const focused = [];
  const tabs = ['first', 'second', 'third'].map(value => ({
    dataset: { tab: value },
    closest(selector) { return selector === '[role=tab]' ? this : null; },
    focus() { focused.push(value); },
  }));
  const parent = { querySelectorAll: selector => {
    assert.equal(selector, '[role=tab]'); return tabs;
  } };
  for (const tab of tabs) tab.parentElement = parent;
  const root = {
    addEventListener(type, listener) { assert.equal(type, 'keydown'); listeners.set(type, listener); },
    removeEventListener(type, listener) { assert.equal(listeners.get(type), listener); listeners.delete(type); },
    querySelector(selector) { return tabs.find(tab => selector === `[data-tab="${tab.dataset.tab}"]`); },
  };
  const dispose = bindTabKeyboard(root, value => selected.push(value));
  function key(index, value, target = tabs[index]) {
    let prevented = false;
    listeners.get('keydown')({ target, key: value, preventDefault() { prevented = true; } });
    return prevented;
  }
  return { tabs, listeners, selected, focused, dispose, key };
}

test('tab-key helper doubles: horizontal arrows wrap and automatically select/focus', () => {
  const fixture = keyboardFixture();
  assert.equal(fixture.key(0, 'ArrowLeft'), true);
  assert.equal(fixture.key(2, 'ArrowRight'), true);
  assert.equal(fixture.key(0, 'ArrowRight'), true);
  assert.deepEqual(fixture.selected, ['third', 'first', 'second']);
  assert.deepEqual(fixture.focused, fixture.selected);
});

test('tab-key helper doubles: Home/End select endpoints', () => {
  const fixture = keyboardFixture();
  assert.equal(fixture.key(1, 'Home'), true);
  assert.equal(fixture.key(1, 'End'), true);
  assert.deepEqual(fixture.selected, ['first', 'third']);
  assert.deepEqual(fixture.focused, fixture.selected);
});

test('tab-key helper doubles: unrelated keys/targets are ignored and listener can detach', () => {
  const fixture = keyboardFixture();
  for (const key of ['Enter', ' ', 'Tab', 'ArrowDown', 'Escape']) {
    assert.equal(fixture.key(0, key), false);
  }
  assert.equal(fixture.key(0, 'ArrowRight', { closest: () => null }), false);
  assert.deepEqual(fixture.selected, []);
  assert.deepEqual(fixture.focused, []);
  fixture.dispose();
  assert.equal(fixture.listeners.size, 0);
});
