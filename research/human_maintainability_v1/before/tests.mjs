import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { deepFreeze, createState, transition, viewModel, latestOrdersByUnit } from './state.mjs';
import { recoveryKeyAfterAction } from './focus.mjs';
const fixture = deepFreeze(JSON.parse(await readFile(new URL('./fixture.json', import.meta.url), 'utf8')));
const step = (state, action) => transition(state, action, fixture);
const run = actions => actions.reduce(step, createState(fixture));
const move = { type:'CHOOSE_COMMAND', command:'move' };
const attack = { type:'CHOOSE_COMMAND', command:'attack' };
const relay = { type:'TARGET', target:{kind:'waypoint',id:'relay'} };
const hostile = { type:'ACTIVATE_UNIT', id:'fang' };
const commit = { type:'COMMIT' };

test('fixture is immutable, with one friendly group and shared world coordinates', () => {
  assert.ok(Object.isFrozen(fixture)); assert.ok(Object.isFrozen(fixture.units));
  assert.throws(() => { fixture.units[0].hull = 0; }, TypeError);
  assert.equal(fixture.units.length, 4); assert.equal(fixture.world.width, 960); assert.equal(fixture.world.height, 680);
});
test('default state is selected Kestrel, no command, target or orders', () => {
  const state = createState(fixture); assert.deepEqual(state.selectedIds,['kestrel']);
  assert.equal(state.command,null); assert.equal(state.target,null); assert.equal(state.preview,null); assert.equal(state.committedOrders.length,0);
});
test('owned selection and Shift additive toggle are independent of hover', () => {
  let state = run([{type:'HOVER',id:'willow'},{type:'SELECT',id:'arrow',additive:true}]);
  assert.deepEqual(state.selectedIds,['kestrel','arrow']); assert.equal(state.hoverId,'willow');
  state = step(state,{type:'SELECT',id:'kestrel',additive:true}); assert.deepEqual(state.selectedIds,['arrow']);
});
test('focus and hover do not arm a command or change selection', () => {
  const state = run([{type:'HOVER',id:'fang'},{type:'FOCUS',key:'unit:willow'}]);
  assert.equal(state.hoverId,'fang'); assert.equal(state.focusKey,'unit:willow');
  assert.deepEqual(state.selectedIds,['kestrel']); assert.equal(state.command,null);
});
test('Move arms without dispatching and keeps selected group', () => {
  const state = run([move]); assert.equal(state.command,'move'); assert.deepEqual(state.selectedIds,['kestrel']); assert.equal(state.committedOrders.length,0); assert.equal(state.preview,null);
});
test('Move preview is distinct from committed order', () => {
  const preview = run([move,relay]); assert.equal(preview.preview.kind,'move'); assert.equal(preview.committedOrders.length,0); assert.equal(preview.target.valid,true);
  const sent = step(preview,commit); assert.equal(sent.committedOrders.length,1); assert.equal(sent.command,null); assert.equal(sent.preview,null); assert.deepEqual(sent.selectedIds,['kestrel']);
  assert.deepEqual(sent.committedOrders[0].target,{kind:'waypoint',id:'relay'});
});
test('pointer-style open-space coordinates commit unchanged', () => {
  const state = run([move,{type:'TARGET',target:{kind:'point',x:477,y:519}},commit]);
  assert.equal(state.committedOrders[0].x,477); assert.equal(state.committedOrders[0].y,519);
});
test('Attack only targets hostile units', () => {
  const valid = run([attack,hostile,commit]); assert.equal(valid.committedOrders[0].kind,'attack'); assert.equal(valid.committedOrders[0].target.id,'fang');
  for (const target of [{kind:'unit',id:'willow'},{kind:'waypoint',id:'relay'},{kind:'point',x:480,y:340}]) {
    const invalid = run([attack,{type:'TARGET',target},commit]); assert.equal(invalid.committedOrders.length,0); assert.ok(invalid.error); assert.equal(invalid.preview,null);
  }
});
test('Move does not accept friendly or hostile ships as destinations', () => {
  for (const id of ['kestrel','willow','fang']) {
    const state = run([move,{type:'ACTIVATE_UNIT',id},commit]); assert.equal(state.committedOrders.length,0); assert.ok(state.error); assert.deepEqual(state.selectedIds,['kestrel']);
  }
});
test('invalid target after a valid preview clears preview without committing', () => {
  const state = run([move,relay,{type:'ACTIVATE_UNIT',id:'willow'}]); assert.equal(state.preview,null); assert.equal(state.target.valid,false); assert.equal(state.committedOrders.length,0);
});
test('invalid target leaves an earlier committed order intact', () => {
  const state = run([move,relay,commit,attack,{type:'ACTIVATE_UNIT',id:'arrow'}]); assert.equal(state.committedOrders.length,1); assert.equal(state.committedOrders[0].kind,'move'); assert.ok(state.error);
});
test('choosing a new valid target recovers from an error', () => {
  const state = run([attack,{type:'ACTIVATE_UNIT',id:'willow'},hostile,commit]); assert.equal(state.error,null); assert.equal(state.committedOrders.length,1);
});
test('Stop commits immediately to selected ships, with no target', () => {
  const state = run([{type:'SELECT',id:'arrow',additive:true},{type:'STOP'}]); assert.equal(state.committedOrders[0].kind,'stop'); assert.deepEqual(state.committedOrders[0].unitIds,['kestrel','arrow']); assert.equal(state.committedOrders[0].target,null); assert.equal(state.preview,null);
});
test('commands and Stop fail safely for an empty selection', () => {
  for (const action of [move,attack,{type:'STOP'},commit]) {
    const state = run([{type:'CLEAR'},action]); assert.equal(state.committedOrders.length,0); assert.equal(state.command,null); assert.ok(state.error);
  }
});
test('Cancel keeps selection and previously committed orders', () => {
  const state = run([move,relay,commit,attack,hostile,{type:'CANCEL'}]); assert.deepEqual(state.selectedIds,['kestrel']); assert.equal(state.committedOrders.length,1); assert.equal(state.command,null); assert.equal(state.target,null); assert.equal(state.error,null);
});
test('selection changes invalidate an armed command and target', () => {
  const state = run([move,relay,{type:'SELECT',id:'willow'}]); assert.deepEqual(state.selectedIds,['willow']); assert.equal(state.command,null); assert.equal(state.preview,null);
});
test('target without armed command cannot dispatch or produce a preview', () => {
  const state = run([relay]); assert.equal(state.preview,null); assert.equal(state.committedOrders.length,0);
});
test('hostile activation while idle cannot select it', () => {
  const state = run([hostile]); assert.deepEqual(state.selectedIds,['kestrel']); assert.ok(state.error); assert.equal(state.command,null);
});
test('out-of-bounds, non-finite and missing move targets cannot commit', () => {
  for (const target of [{kind:'point',x:-1,y:30},{kind:'point',x:970,y:30},{kind:'point',x:50,y:Infinity},{kind:'waypoint',id:'missing'}]) {
    const state = run([move,{type:'TARGET',target},commit]); assert.equal(state.committedOrders.length,0); assert.ok(state.error);
  }
});
test('each required authored state preset has the intended semantics', () => {
  const models = Object.fromEntries(fixture.presets.map(name => [name,viewModel(run([{type:'PRESET',name}]),fixture)]));
  assert.equal(models.normal.selectedCount,1); assert.equal(models.selection.selectedCount,2);
  assert.equal(models.preview.preview.kind,'move'); assert.equal(models.preview.committedOrders.length,0);
  assert.ok(models.invalid.error); assert.equal(models.invalid.canConfirm,false);
  assert.equal(models.empty.selectedCount,0); assert.equal(models.empty.command,null);
});
test('Reset restores the complete initial state', () => {
  const state = run([{type:'HOVER',id:'fang'},{type:'FOCUS',key:'attack'},attack,hostile,commit,{type:'RESET'}]);
  assert.deepEqual(state,createState(fixture));
});
test('simultaneous movement/firing fixture fields remain present', () => {
  const model = viewModel(run([{type:'SELECT',id:'arrow'}]),fixture); assert.equal(model.selected[0].movement,'Escorting Kestrel'); assert.equal(model.selected[0].firing,'Firing at Fang');
});
test('a latest Stop overrides that ship’s drawn committed order', () => {
  const state = run([move,relay,commit,{type:'SELECT',id:'arrow'},{type:'STOP'}]);
  const orders = latestOrdersByUnit(state); assert.equal(orders.get('kestrel').kind,'move'); assert.equal(orders.get('arrow').kind,'stop');
});
test('every transition sequence yields equal A/B presentation data', () => {
  let state = createState(fixture);
  const actions = [{type:'HOVER',id:'willow'},{type:'FOCUS',key:'unit:willow'},{type:'SELECT',id:'arrow',additive:true},move,relay,commit,attack,{type:'ACTIVATE_UNIT',id:'willow'},hostile,commit,{type:'STOP'},{type:'CLEAR'},move,{type:'RESET'}];
  for (const action of actions) {
    state = step(state,action);
    const a = viewModel(state,fixture); const b = viewModel(state,fixture);
    assert.deepEqual(a,b); assert.strictEqual(a.units,fixture.units); assert.strictEqual(b.units,fixture.units);
  }
});
test('UI builds both variants through the same world and control template', async () => {
  const source = await readFile(new URL('./app.mjs',import.meta.url),'utf8');
  assert.equal((source.match(/let state = createState/g)||[]).length,1);
  assert.match(source,/makeScene\('a'/); assert.match(source,/makeScene\('b'/);
  assert.match(source,/state = transition\(state, action, fixture\)/);
  assert.match(source,/const x = event.detail === 0 \? fixture.world.width \/ 2/);
  assert.ok(!source.includes("event.key === 'Enter'")); assert.ok(!source.includes("document.addEventListener('keydown'"));
});

test('Confirm and Cancel recover only the disabled focused order control', () => {
  assert.equal(recoveryKeyAfterAction('COMMIT','confirm',true,['kestrel','arrow']),'unit:kestrel');
  assert.equal(recoveryKeyAfterAction('CANCEL','cancel',true,['arrow']),'unit:arrow');
  assert.equal(recoveryKeyAfterAction('CANCEL','confirm',true,['willow']),'unit:willow');
  assert.equal(recoveryKeyAfterAction('CANCEL','cancel',true,[]),'move');
});
test('focus recovery leaves enabled, unrelated and hover controls untouched', () => {
  for (const [action,key,disabled] of [['COMMIT','confirm',false],['CANCEL','move',false],['CANCEL','unit:arrow',false],['HOVER','cancel',true],['FOCUS','confirm',true],['RESET','confirm',true],['CLEAR','clear',true]])
    assert.equal(recoveryKeyAfterAction(action,key,disabled,['kestrel']),null);
});
test('UI focus repair is local to the captured scene and does not select or hover', async () => {
  const source = await readFile(new URL('./app.mjs',import.meta.url),'utf8');
  assert.match(source,/const focusedScene = focusedControl\?\.closest\?\.\('\[data-scene\]'\)/);
  assert.match(source,/focusedScene\.querySelector\(.*recoveryKey.*\)\?\.focus\(\{ preventScroll: true \}\)/);
  assert.ok(!source.includes("event.key === 'Enter'"));
});

test('three selected ships retain every fact, invalid target and prior order together', () => {
  const state = run([{type:'PRESET',name:'selection'},{type:'SELECT',id:'willow',additive:true},move,relay,commit,move,hostile]);
  const model = viewModel(state,fixture);
  assert.equal(model.selectedCount,3); assert.equal(model.command,'move'); assert.equal(model.target.id,'fang');
  assert.equal(model.target.valid,false); assert.ok(model.error); assert.equal(model.preview,null);
  assert.equal(model.committedOrders.length,1); assert.equal(model.lastOrder.kind,'move');
  for (const unit of model.selected) {
    const source = fixture.units.find(item => item.id === unit.id);
    for (const field of ['name','role','hull','movement','firing']) assert.equal(unit[field],source[field]);
  }
});
test('desktop A reserves a fixed inset without clipping or suppressing its HUD content', async () => {
  const css = await readFile(new URL('./style.css',import.meta.url),'utf8');
  assert.match(css,/\.comparison\[data-frame=wide\] \.variant-a \.hud\{top:8px;padding:10px\}/);
  assert.doesNotMatch(css,/\.variant-a \.hud\{[^}]*(?:max-height|overflow|display:none)/);
  assert.match(css,/\.comparison\[data-frame=wide\] \.variant-b \.hud\{bottom:5px;width:84%;grid-template-columns:1\.45fr 1fr\}/);
});
