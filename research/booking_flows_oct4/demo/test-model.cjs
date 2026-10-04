'use strict';
/* Public, dependency-free model and static-source checks.
   These checks do not run a browser or measure accessibility or usability. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {BookingStore, canonical, clone, endAt} = require('./model.js');
const fixture = require('./fixture.js');
const fixtureBytes = fs.readFileSync(path.join(__dirname, '..', 'fixture.json'));
const fixtureJSON = JSON.parse(fixtureBytes.toString('utf8'));
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const modelSource = fs.readFileSync(path.join(__dirname, 'model.js'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
const digest = value => crypto.createHash('sha256').update(canonical(value)).digest('hex');
const createStore = preset => {
  const store = new BookingStore(fixture, {delay: 0});
  if (preset) store.reset(preset, false);
  return store;
};
function unchangedBooking(store) {
  const state = store.snapshot();
  assert.deepEqual(state.originalBooking, fixture.existing_booking);
  assert.deepEqual(state.existingBooking, fixture.existing_booking);
  assert.deepEqual(state.bookings, [fixture.existing_booking]);
  assert.equal(state.confirmedMutationCount, 0);
}
function sharedContract(store) {
  const before = store.contractForView('before');
  for (const view of ['after', 'compare']) {
    assert.deepEqual(store.contractForView(view), before);
    assert.equal(digest(store.contractForView(view)), digest(before));
  }
}
const results = [];
async function test(name, fn) {
  try {
    await fn();
    results.push({name, status: 'passed'});
    console.log('PASS', name);
  } catch (error) {
    const detail = String(error.message).split(__dirname).join('.');
    results.push({name, status: 'failed', detail});
    console.error('FAIL', name, detail);
    process.exitCode = 1;
  }
}
async function main() {
  await test('Bundled JavaScript fixture equals the preserved JSON values', () => assert.deepEqual(fixture, fixtureJSON));
  await test('Fixture explicitly identifies a fictional memory-only comparison', () => {
    assert.equal(fixture.fixture_id, 'BKF4-F01');
    assert.equal(fixture.synthetic, true);
    assert.equal(fixture.no_external_side_effects, true);
    assert.equal(fixture.persistence, 'memory_only_no_storage_no_network');
    assert.equal(fixture.price.charge_mode, 'local_simulation_only');
    assert.equal(fixture.conditions.all_amounts_are_synthetic, true);
  });
  await test('Synthetic total includes the room price and service fee', () => {
    assert.equal(fixture.price.total, fixture.price.room + fixture.price.service_fee);
    assert.equal(fixture.price.currency, 'KRW');
    assert.equal(fixture.price.tax_included, true);
  });
  await test('Canonical serialization sorts objects recursively without reordering arrays', () => {
    assert.equal(canonical({b: {z: 2, a: 1}, a: [3, 1]}), '{"a":[3,1],"b":{"a":1,"z":2}}');
    assert.equal(digest({b: 2, a: 1}), digest({a: 1, b: 2}));
    assert.notEqual(digest([1, 2]), digest([2, 1]));
  });
  await test('Clone isolates nested fixture records', () => {
    const copy = clone(fixture); copy.room.name = 'Changed'; copy.availability['2026-10-15'][0].available = false;
    assert.deepEqual(fixture, fixtureJSON);
  });
  await test('Time helper calculates the configured duration and rejects malformed starts', () => {
    assert.equal(endAt('14:00', 60), '15:00');
    assert.equal(endAt('09:45', 30), '10:15');
    for (const start of ['', '9:00', 'no-time']) assert.equal(endAt(start, 60), '');
  });
  await test('Initial selection uses one unchanged existing reservation', () => {
    const store = createStore(); const state = store.snapshot();
    assert.equal(state.phase, 'selection'); assert.deepEqual(state.draft, fixture.draft);
    assert.deepEqual(state.details, fixture.details); assert.deepEqual(state.availability, fixture.availability);
    assert.equal(state.confirmationCount, 0); unchangedBooking(store); sharedContract(store);
  });
  await test('Constructor copies input without modifying its nested availability', () => {
    const input = clone(fixture); const store = new BookingStore(input, {delay: 0});
    input.details.meeting_name = 'Outside edit'; input.availability['2026-10-15'][0].available = false;
    assert.deepEqual(store.snapshot().details, fixture.details);
    assert.deepEqual(store.snapshot().availability, fixture.availability);
    store.invalidateStale(false); assert.deepEqual(fixture, fixtureJSON);
  });
  await test('Snapshot and contract reads are detached from mutable state', () => {
    const store = createStore(); const snapshot = store.snapshot(); const contract = store.contract();
    snapshot.details.headcount = 99; contract.fixture.room.name = 'Outside edit'; contract.state.bookings.length = 0;
    assert.deepEqual(store.snapshot().details, fixture.details); assert.deepEqual(store.fixture, fixture);
    unchangedBooking(store);
  });
  await test('Presentation contract rejects unknown view names', () => assert.throws(() => createStore().contractForView('missing'), /Unknown presentation/));
  await test('Subscriptions receive snapshots and unsubscribe cleanly', () => {
    const store = createStore(); const seen = []; const stop = store.subscribe(state => {seen.push(state); state.details.headcount = 99;});
    store.setDetail('meeting_name', 'Changed meeting'); assert.equal(seen.length, 1); assert.equal(store.state.details.headcount, 4);
    stop(); store.setDetail('headcount', 5); assert.equal(seen.length, 1);
  });
  await test('Unchanged valid details do not trigger redundant emissions', () => {
    const store = createStore(); let emissions = 0; store.subscribe(() => emissions++);
    assert.equal(store.setDetail('meeting_name', fixture.details.meeting_name), true);
    assert.equal(store.setDetail('headcount', '4'), true); assert.equal(emissions, 0);
  });
  await test('Unsupported detail fields are rejected without changing state', () => {
    const store = createStore(); const initial = store.snapshot();
    assert.equal(store.setDetail('price', 0), false); assert.deepEqual(store.snapshot(), initial);
  });
  await test('Unavailable and unknown time choices preserve the selected draft', () => {
    const store = createStore(); const initial = store.snapshot();
    assert.equal(store.chooseTime('16:00'), false); assert.equal(store.chooseTime('12:00'), false);
    assert.deepEqual(store.snapshot(), initial); unchangedBooking(store);
  });
  await test('Unknown date choices preserve independent details and draft', () => {
    const store = createStore(); const initial = store.snapshot();
    assert.equal(store.chooseDate('2026-10-17'), false); assert.deepEqual(store.snapshot(), initial);
  });
  await test('Selecting the current date preserves its selected time', () => {
    const store = createStore(); store.chooseDate(fixture.draft.date);
    assert.deepEqual(store.snapshot().draft, fixture.draft); unchangedBooking(store);
  });
  await test('Changing date clears only the draft time and preserves details', () => {
    const store = createStore(); store.setDetail('meeting_name', '보존된 회의'); store.setDetail('headcount', 5);
    assert.equal(store.chooseDate('2026-10-16'), true);
    assert.deepEqual(store.snapshot().draft, {date: '2026-10-16', start: '', end: '', status: 'selection_local_demo'});
    assert.deepEqual(store.snapshot().details, {meeting_name: '보존된 회의', headcount: 5});
    unchangedBooking(store); sharedContract(store);
  });
  await test('Empty day offers the next available date and cannot enter review', () => {
    const store = createStore(); store.chooseDate('2026-10-16');
    assert.equal(store.nextAvailableDate(), '2026-10-19'); assert.equal(store.review(), false);
    assert.deepEqual(Object.keys(store.snapshot().errors), ['start']); assert.equal(store.snapshot().phase, 'selection');
    unchangedBooking(store);
  });
  await test('Last available date has no phantom next date', () => {
    const store = createStore(); store.chooseDate('2026-10-19'); assert.equal(store.nextAvailableDate(), null);
  });
  await test('Empty-day recovery requires explicit date and time choices', () => {
    const store = createStore(); store.chooseDate('2026-10-16'); store.chooseDate(store.nextAvailableDate());
    assert.equal(store.snapshot().draft.start, ''); assert.equal(store.chooseTime('10:00'), true);
    assert.equal(store.snapshot().draft.end, '11:00'); assert.equal(store.review(), true);
    unchangedBooking(store); sharedContract(store);
  });
  await test('Valid time choice uses the room duration and clears selection errors', () => {
    const store = createStore(); store.chooseDate('2026-10-19'); store.review(); store.chooseTime('14:00');
    assert.deepEqual(store.snapshot().draft, {date: '2026-10-19', start: '14:00', end: '15:00', status: 'selection_local_demo'});
    assert.deepEqual(store.snapshot().errors, {}); unchangedBooking(store);
  });
  for (const value of ['', '   ', 'x'.repeat(61), 123]) {
    await test('Meeting-name validation rejects ' + JSON.stringify(value), () => {
      const store = createStore(); store.setDetail('meeting_name', value);
      assert.ok(store.validation().meeting_name); assert.equal(store.review(), false); unchangedBooking(store);
    });
  }
  await test('Meeting-name boundaries accept 1 and 60 characters', () => {
    const store = createStore(); for (const value of ['x', '한'.repeat(60)]) {store.setDetail('meeting_name', value); assert.equal(store.validation().meeting_name, undefined);}
  });
  for (const value of ['', 0, 7, 2.5, 'not-a-number']) {
    await test('Headcount validation rejects ' + JSON.stringify(value), () => {
      const store = createStore(); store.setDetail('headcount', value);
      assert.ok(store.validation().headcount); assert.equal(store.review(), false); unchangedBooking(store);
    });
  }
  await test('Headcount boundaries accept integer strings from 1 through capacity', () => {
    const store = createStore(); for (const value of ['1', String(fixture.room.capacity)]) {store.setDetail('headcount', value); assert.equal(store.validation().headcount, undefined);}
  });
  await test('Detail correction clears that field error and permits review', () => {
    const store = createStore(); store.setDetail('meeting_name', ''); store.setDetail('headcount', 7); store.review();
    store.setDetail('meeting_name', 'Fixed meeting'); assert.equal(store.snapshot().errors.meeting_name, undefined);
    assert.ok(store.snapshot().errors.headcount); store.setDetail('headcount', 4);
    assert.deepEqual(store.snapshot().errors, {}); assert.equal(store.review(), true); unchangedBooking(store);
  });
  await test('Review then Back preserves edits and the chosen time', () => {
    const store = createStore(); store.setDetail('meeting_name', 'Edited meeting'); store.setDetail('headcount', 5); store.chooseTime('11:00');
    assert.equal(store.review(), true); const reviewed = store.snapshot(); assert.equal(store.back(), true);
    assert.equal(store.snapshot().phase, 'selection'); assert.deepEqual(store.snapshot().draft, reviewed.draft);
    assert.deepEqual(store.snapshot().details, reviewed.details); unchangedBooking(store); sharedContract(store);
  });
  await test('History-style navigation rejects invalid phases and invalid review', () => {
    const store = createStore(); const initial = store.snapshot();
    assert.equal(store.navigatePhase('missing'), false); assert.deepEqual(store.snapshot(), initial);
    store.chooseDate('2026-10-16'); assert.equal(store.navigatePhase('review'), true); assert.equal(store.snapshot().phase, 'selection');
    store.chooseDate('2026-10-15'); store.chooseTime('15:00'); store.navigatePhase('conflict'); assert.equal(store.snapshot().phase, 'selection');
  });
  await test('Confirm outside review is ignored without starting an operation', async () => {
    const store = createStore(); const initial = store.snapshot();
    assert.deepEqual(await store.confirm(), {ignored: true}); assert.deepEqual(store.snapshot(), initial);
  });
  await test('Confirmation revalidates edited review details before pending', async () => {
    const store = createStore('review'); store.setDetail('headcount', 7);
    assert.deepEqual(await store.confirm(), {invalid: true}); assert.equal(store.snapshot().phase, 'selection');
    assert.equal(store.snapshot().confirmationCount, 0); unchangedBooking(store);
  });
  await test('Pending blocks edits, Back, phase navigation and duplicate confirmation', async () => {
    const store = createStore('review'); const pending = store.confirm();
    assert.equal(store.snapshot().phase, 'confirming'); unchangedBooking(store); sharedContract(store);
    const before = store.snapshot();
    assert.equal(store.setDetail('meeting_name', 'Blocked'), false); assert.equal(store.chooseDate('2026-10-19'), false);
    assert.equal(store.chooseTime('15:00'), false); assert.equal(store.setStaleSimulation(true), false);
    assert.equal(store.back(), false); assert.equal(store.navigatePhase('selection'), false);
    assert.deepEqual(await store.confirm(), {ignored: true}); assert.deepEqual(store.snapshot(), before);
    assert.equal((await pending).success, true); assert.equal(store.snapshot().confirmationCount, 1);
  });
  await test('Success replaces one existing reservation exactly once with its original ID', async () => {
    const store = createStore('review'); const result = await store.confirm(); const state = store.snapshot();
    assert.equal(result.success, true); assert.equal(state.phase, 'success'); assert.equal(state.bookings.length, 1);
    assert.equal(state.existingBooking.id, fixture.existing_booking.id); assert.equal(state.confirmedMutationCount, 1);
    assert.deepEqual(state.existingBooking, {...fixture.existing_booking, date: fixture.draft.date, start: fixture.draft.start, end: fixture.draft.end});
    assert.deepEqual(state.originalBooking, fixture.existing_booking); assert.equal(state.draft.status, 'success_local_demo');
    result.booking.start = 'Outside edit'; assert.equal(store.snapshot().existingBooking.start, fixture.draft.start); sharedContract(store);
    const terminal = store.snapshot(); assert.deepEqual(await store.confirm(), {ignored: true}); assert.equal(store.cancel(), false);
    assert.equal(store.setDetail('headcount', 1), false); assert.equal(store.back(), false); assert.deepEqual(store.snapshot(), terminal);
  });
  await test('Stale recheck marks the chosen slot invalid without an automatic replacement', async () => {
    const store = createStore('review'); store.setDetail('meeting_name', 'Conflict meeting'); store.setStaleSimulation(true);
    assert.deepEqual(await store.confirm(), {conflict: true}); const state = store.snapshot();
    assert.equal(state.phase, 'conflict'); assert.equal(state.draft.start, '14:00'); assert.equal(state.invalidSelection, true);
    assert.equal(state.availabilityRevision, 'fixture-v2-local'); assert.ok(state.errors.start);
    assert.equal(state.availability['2026-10-15'].find(slot => slot.start === '14:00').available, false);
    assert.equal(state.details.meeting_name, 'Conflict meeting'); assert.equal(state.confirmationCount, 1);
    unchangedBooking(store); sharedContract(store);
  });
  await test('Conflict recovery uses an explicit available replacement and fresh confirmation', async () => {
    const store = createStore('conflict'); assert.equal(store.chooseTime('14:00'), false); assert.equal(store.review(), false);
    assert.equal(store.chooseTime('15:00'), true); assert.equal(store.snapshot().invalidSelection, false);
    assert.deepEqual(store.snapshot().errors, {}); assert.equal(store.review(), true); assert.equal((await store.confirm()).success, true);
    assert.equal(store.snapshot().existingBooking.start, '15:00'); assert.equal(store.snapshot().existingBooking.end, '16:00');
    assert.equal(store.snapshot().existingBooking.id, fixture.existing_booking.id); assert.equal(store.snapshot().confirmedMutationCount, 1);
    sharedContract(store);
  });
  await test('Disabling simulation does not silently restore a stale invalid slot', () => {
    const store = createStore('conflict'); store.setStaleSimulation(false);
    assert.equal(store.snapshot().invalidSelection, true); assert.equal(store.chooseTime('14:00'), false); unchangedBooking(store);
  });
  await test('History-style review navigation retains an invalid selection as conflict', () => {
    const store = createStore('conflict'); store.navigatePhase('review'); assert.equal(store.snapshot().phase, 'conflict');
    assert.equal(store.snapshot().draft.start, '14:00'); unchangedBooking(store);
  });
  await test('Stale simulation does not invalidate an explicitly selected alternative', async () => {
    const store = createStore(); store.setStaleSimulation(true); store.chooseTime('15:00'); store.review();
    assert.equal((await store.confirm()).success, true); assert.equal(store.snapshot().existingBooking.start, '15:00');
  });
  for (const preset of ['selection', 'review', 'conflict']) {
    await test('Cancellation from ' + preset + ' preserves the original booking', async () => {
      const store = createStore(preset); store.setDetail('meeting_name', 'Preserved edit');
      assert.equal(store.cancel(), true); assert.equal(store.snapshot().phase, 'cancelled');
      assert.equal(store.snapshot().details.meeting_name, 'Preserved edit'); assert.deepEqual(store.snapshot().errors, {});
      unchangedBooking(store); sharedContract(store); const terminal = store.snapshot();
      assert.equal(store.cancel(), false); assert.equal(store.chooseTime('15:00'), false); assert.deepEqual(await store.confirm(), {ignored: true});
      assert.deepEqual(store.snapshot(), terminal);
    });
  }
  await test('Cancellation during pending invalidates delayed completion', async () => {
    const store = createStore('review'); const pending = store.confirm(); assert.equal(store.cancel(), true);
    assert.deepEqual(await pending, {cancelled: true}); assert.equal(store.snapshot().phase, 'cancelled');
    assert.equal(store.snapshot().confirmationCount, 1); unchangedBooking(store); sharedContract(store);
  });
  await test('Reset during pending prevents a late mutation of the reset state', async () => {
    const store = createStore('review'); const pending = store.confirm(); store.reset('selection');
    assert.deepEqual(await pending, {cancelled: true}); assert.deepEqual(store.snapshot(), createStore().snapshot());
    unchangedBooking(store);
  });
  await test('A newer confirmation survives completion of an invalidated older operation', async () => {
    const store = createStore('review'); const older = store.confirm(); store.reset('review'); store.chooseTime('15:00'); store.review();
    const newer = store.confirm(); assert.deepEqual(await older, {cancelled: true}); assert.equal((await newer).success, true);
    assert.equal(store.snapshot().existingBooking.start, '15:00'); assert.equal(store.snapshot().confirmationCount, 1);
    assert.equal(store.snapshot().confirmedMutationCount, 1);
  });
  await test('Reset restores fixture availability, original booking and counters in every preset', () => {
    const store = createStore('conflict'); store.cancel();
    for (const preset of ['selection', 'review', 'conflict']) {
      store.reset(preset); const state = store.snapshot(); unchangedBooking(store); sharedContract(store);
      assert.equal(state.confirmationCount, 0); assert.equal(state.phase, preset);
      assert.equal(state.invalidSelection, preset === 'conflict');
      if (preset !== 'conflict') assert.deepEqual(state.availability, fixture.availability);
    }
  });
  await test('HTML loads only local scripts in fixture-model-app order', () => {
    const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)].map(match => match[1]);
    assert.deepEqual(scripts, ['fixture.js', 'model.js', 'app.js']);
    assert.ok(scripts.every(file => fs.existsSync(path.join(__dirname, file))));
    assert.ok(!/<script\b[^>]*>(?!\s*<\/script>)/.test(html));
    assert.ok(!/(?:src|href)="(?:https?:)?\/\//i.test(html));
  });
  await test('Static CSP blocks connection and form-submission destinations', () => {
    assert.match(html, /http-equiv="Content-Security-Policy"/);
    assert.match(html, /connect-src 'none'/); assert.match(html, /form-action 'none'/); assert.match(html, /base-uri 'none'/);
    assert.ok(!/<form\b/i.test(html));
  });
  await test('Fixed HTML IDs are unique and the comparison presets are explicit', () => {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const preset of ['selection', 'review', 'conflict']) assert.ok(html.includes('value="' + preset + '"'));
    assert.match(html, /가상 데모 · 실제 예약\/결제 없음/); assert.match(html, /사용성 실측 없음/);
  });
  await test('Runtime source has no explicit network or persistent-storage API calls', () => {
    for (const source of [app, modelSource]) {
      assert.ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/.test(source));
      assert.ok(!/\b(?:localStorage|sessionStorage|indexedDB)\b|document\.cookie\s*=/.test(source));
    }
    assert.ok(!/@import|url\(\s*['"]?(?:https?:)?\/\//i.test(styles));
  });
  await test('App source renders both presentations from the same subscribed store', () => {
    assert.equal((app.match(/new BookingStore\(/g) || []).length, 1);
    assert.equal((app.match(/store\.subscribe\(/g) || []).length, 1);
    assert.match(app, /getContract:view => store\.contractForView\(view\)/);
    assert.match(app, /ui\.view === 'compare'/); assert.match(app, /before\(s\)/); assert.match(app, /after\(s\)/);
  });
  await test('Static motion and text-wrapping guards remain in the authored styles', () => {
    assert.match(styles, /prefers-reduced-motion:reduce/); assert.match(styles, /overflow-wrap:anywhere/);
    assert.ok(!/position\s*:\s*sticky/i.test(styles));
  });
  await test('Tests leave the imported and preserved fixture values unchanged', () => {
    assert.deepEqual(fixture, fixtureJSON);
    assert.deepEqual(fs.readFileSync(path.join(__dirname, '..', 'fixture.json')), fixtureBytes);
  });
  const report = {
    fixture_id: fixture.fixture_id,
    method: 'Public Node model transitions and static-source checks; no browser engine',
    total: results.length, passed: results.filter(result => result.status === 'passed').length,
    failed: results.filter(result => result.status === 'failed').length,
    fixture_byte_sha256: crypto.createHash('sha256').update(fixtureBytes).digest('hex'),
    fixture_canonical_sha256: digest(fixture), results,
    browser_runtime: 'not_run', visual_rendering: 'not_run', manual_keyboard: 'not_run',
    accessibility_audit: 'not_run', usability_measurement: 'not_run'
  };
  fs.writeFileSync(path.join(__dirname, 'model-test-results.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(__dirname, 'model-test-results.md'), '# Public booking model/source checks\n\n' +
    `Command: \`node test-model.cjs\`\n\n${report.passed}/${report.total} checks passed; ${report.failed} failed.\n\n` +
    'Scope: fixture-value equivalence, isolated state and presentation contracts, validation, empty-day recovery, review/back navigation, stale conflict, duplicate confirmation, cancellation and reset races, and static local-only source guards.\n\n' +
    'Browser runtime, rendered visuals, real keyboard behavior, accessibility auditing, and usability measurement were not run.\n');
  console.log(`\n${report.passed}/${report.total} public model/source checks passed; ${report.failed} failed.`);
}
main().catch(error => { console.error(String(error.message).split(__dirname).join('.')); process.exitCode = 1; });
