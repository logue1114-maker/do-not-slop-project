import { deepFreeze, createState, transition, viewModel, latestOrdersByUnit } from './state.mjs';
import { recoveryKeyAfterAction } from './focus.mjs';

const fixture = deepFreeze(await fetch('./fixture.json').then(response => {
  if (!response.ok) throw new Error('Could not load the shared fixture');
  return response.json();
}));
let state = createState(fixture);
const comparison = document.querySelector('#comparison');
const scenes = [];
const escapeText = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const shapes = {
  cruiser: '<path d="M0-22 13-6 10 13 0 21-10 13-13-6Z"/><path class="ship-detail" d="M0-15V14M-7 1H7"/>',
  frigate: '<path d="M0-20 10 0 8 16 0 11-8 16-10 0Z"/><path class="ship-detail" d="M0-11V9M-6 1H6"/>',
  tender: '<path d="M0-15 13-5 13 10 0 17-13 10-13-5Z"/><path class="ship-detail" d="M-8-2H8M-8 4H8M0-9V11"/>'
};
function worldMarkup(variant) {
  const stars = fixture.stars.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
  return `<svg class="world" viewBox="0 0 960 680" preserveAspectRatio="none" aria-hidden="true">
    <defs><radialGradient id="${variant}-nebula"><stop stop-color="#295169" stop-opacity=".33"/><stop offset="1" stop-color="#0c1821" stop-opacity="0"/></radialGradient><pattern id="${variant}-grid" width="120" height="85" patternUnits="userSpaceOnUse"><path d="M120 0H0V85" fill="none" stroke="#536574" stroke-opacity=".13"/></pattern></defs>
    <rect width="960" height="680" fill="#08141d"/><ellipse cx="474" cy="354" rx="550" ry="348" fill="url(#${variant}-nebula)"/><rect width="960" height="680" fill="url(#${variant}-grid)"/>
    <g fill="#bdd0d9" opacity=".6">${stars}</g>
    <g fill="none" stroke="#496570" opacity=".3"><ellipse cx="568" cy="453" rx="195" ry="137" stroke-dasharray="3 9"/><ellipse cx="568" cy="453" rx="278" ry="195"/><path d="M100 557 180 521 267 531 313 489"/></g>
    <g fill="#809eaa" font-size="11" font-family="monospace" opacity=".65"><text x="29" y="41">OUTER RELAY / SECTOR 07</text><text x="29" y="651">NAV GRID 960 × 680</text><text x="770" y="651">SYNTHETIC SCENE</text></g>
    <g class="fixture-movement" fill="none" stroke="#4e8caa" stroke-width="1.6" stroke-dasharray="6 8"><path d="M185 165 270 246"/><path d="M327 304 392 352"/></g>
    <path class="fixture-firing" d="M392 352 647 269" fill="none" stroke="#ab6a56" stroke-width="1.6" stroke-dasharray="2 7"/>
    <g class="orders"></g><g class="preview-lines"></g>
  </svg>`;
}
function unitMarkup(unit) {
  return `<button type="button" class="unit ${unit.team}" data-unit="${unit.id}" data-focus="unit:${unit.id}" style="left:${unit.x / 9.6}%;top:${unit.y / 6.8}%" aria-label="${escapeText(`${unit.name}, ${unit.team}, ${unit.role}, ${unit.hull}% hull`)}" aria-pressed="false"><span class="selection-marker" aria-hidden="true"></span><svg viewBox="-26 -27 52 54" aria-hidden="true">${shapes[unit.shape]}</svg><span class="unit-name">${unit.name}</span><span class="unit-state" aria-hidden="true"></span></button>`;
}
function makeScene(variant, title, subtitle) {
  const article = document.createElement('section');
  article.className = `comparison-panel variant-${variant}`;
  article.setAttribute('aria-label', title);
  article.dataset.variant = variant;
  article.innerHTML = `<header class="panel-header"><h2><span class="variant-letter">${variant.toUpperCase()}</span>${title}</h2><span>${subtitle}</span></header>
    <div class="scene" data-scene="${variant}"><div class="battlefield">
      ${worldMarkup(variant)}
      <button type="button" class="open-space" data-focus="space" aria-label="Open-space target. Click to choose a location; keyboard activation targets map center."></button>
      <span class="map-caption">${escapeText(fixture.title)}</span>
      ${fixture.units.map(unitMarkup).join('')}
      ${fixture.waypoints.map(point => `<button type="button" class="waypoint" data-waypoint="${point.id}" data-focus="waypoint:${point.id}" style="left:${point.x/9.6}%;top:${point.y/6.8}%" aria-label="${point.name}, valid move destination"><span aria-hidden="true">◇</span><small>${point.name}</small></button>`).join('')}
      <div class="target-marker" aria-hidden="true"></div>
    </div>
    <div class="hud" aria-label="Fleet selection and orders"><section class="selection-panel"><div class="hud-title"><h3>Selected fleet</h3><span class="group-id"></span></div><div class="selection-summary"></div><div class="selected-list"></div><button type="button" class="clear-selection" data-action="clear" data-focus="clear">Clear selection</button></section>
      <section class="command-panel"><div class="hud-title"><h3>Orders</h3><span class="armed-state"></span></div><div class="command-buttons"><button type="button" data-command="move" data-focus="move" aria-pressed="false">Move <kbd>M</kbd></button><button type="button" data-command="attack" data-focus="attack" aria-pressed="false">Attack <kbd>A</kbd></button><button type="button" data-action="stop" data-focus="stop">Stop <kbd>S</kbd></button></div><div class="target-summary"></div><div class="confirm-buttons"><button type="button" class="confirm" data-action="commit" data-focus="confirm">Confirm order</button><button type="button" data-action="cancel" data-focus="cancel">Cancel <kbd>Esc</kbd></button></div></section>
      <div class="feedback-panel"><p class="state-notice"></p><p class="state-error"></p><p class="last-order"></p></div>
    </div></div>
    <footer class="panel-footer"><span class="selection-foot"></span><span class="order-foot"></span></footer>`;
  comparison.append(article);
  scenes.push(article);
}
makeScene('a', 'High-footprint baseline', 'Authored starting point');
makeScene('b', 'Compact contextual proposal', 'Authored redesign');
document.querySelector('#fixture-label').textContent = 'One scene · one state';
function dispatch(action) {
  const old = state;
  const focusedControl = document.activeElement;
  const focusedScene = focusedControl?.closest?.('[data-scene]');
  state = transition(state, action, fixture);
  render();
  const recoveryKey = recoveryKeyAfterAction(action.type, focusedControl?.dataset?.focus, !!focusedControl?.disabled, state.selectedIds);
  if (recoveryKey && focusedScene) {
    // Stay in the originating variant, keep selection/hover intact, and avoid a scroll jump.
    focusedScene.querySelector(`[data-focus="${recoveryKey}"]`)?.focus({ preventScroll: true });
  }
  if (!['HOVER','FOCUS'].includes(action.type) && (state.error !== old.error || state.notice !== old.notice)) {
    document.querySelector('#live-status').textContent = state.error || state.notice;
  }
}
function makeLine(unit, target, className) {
  return `<path class="${className}" d="M${unit.x} ${unit.y}L${target.x} ${target.y}"/><circle class="${className}-end" cx="${target.x}" cy="${target.y}" r="7"/>`;
}
function render() {
  const model = viewModel(state, fixture);
  const orders = latestOrdersByUnit(state);
  for (const scene of scenes) {
    const selection = scene.querySelector('.selection-summary');
    selection.textContent = model.selectedCount ? `${model.selectedCount} ship${model.selectedCount === 1 ? '' : 's'} selected` : 'Nothing selected';
    scene.querySelector('.group-id').textContent = model.selectedCount ? `A1` : '—';
    // Text-only leaf replacements do not replace any focused interactive node.
    const list = scene.querySelector('.selected-list');
    list.style.setProperty('--selected-count', Math.max(1, model.selectedCount));
    const nextList = model.selected.map(unit => `<div class="selected-ship"><strong>${unit.name} <span>${unit.hull}% hull</span></strong><span>${unit.role}</span><span class="activity"><i class="movement-key"></i>${unit.movement}</span><span class="activity"><i class="firing-key"></i>${unit.firing}</span></div>`).join('') || '<div class="empty-selection">Select a friendly ship on the map.</div>';
    if (list.innerHTML !== nextList) list.innerHTML = nextList;
    scene.querySelector('.armed-state').textContent = state.command ? `${state.command === 'move' ? 'MOVE' : 'ATTACK'} ARMED` : 'READY';
    scene.querySelector('.target-summary').textContent = state.command
      ? `Target: ${model.targetName}${state.target ? state.target.valid ? ' · preview' : ' · invalid' : state.command === 'move' ? ' · choose open space' : ' · choose hostile ship'}`
      : 'Target: None';
    scene.querySelector('.state-notice').textContent = state.error ? '' : state.notice;
    scene.querySelector('.state-error').textContent = state.error || '';
    scene.querySelector('.last-order').textContent = model.lastOrder ? `Last sent: ${model.lastOrder.kind.toUpperCase()} · ${model.lastOrder.unitIds.length} ship${model.lastOrder.unitIds.length === 1 ? '' : 's'} · order ${model.lastOrder.id}` : 'No orders sent';
    scene.querySelector('.selection-foot').textContent = `Selection: ${model.selectedCount} · group ${model.group}`;
    scene.querySelector('.order-foot').textContent = `Preview: ${model.preview ? model.preview.kind : 'none'} · sent: ${state.committedOrders.length}`;
    scene.querySelector('[data-action="commit"]').disabled = !model.canConfirm;
    scene.querySelector('[data-action="cancel"]').disabled = !model.canCancel;
    scene.querySelector('[data-action="clear"]').disabled = !model.selectedCount;
    for (const button of scene.querySelectorAll('[data-command]')) button.setAttribute('aria-pressed', String(button.dataset.command === state.command));
    for (const button of scene.querySelectorAll('[data-unit]')) {
      const id = button.dataset.unit;
      const selected = state.selectedIds.includes(id);
      button.classList.toggle('selected', selected);
      button.classList.toggle('hovered', id === state.hoverId);
      button.classList.toggle('shared-focus', state.focusKey === `unit:${id}`);
      button.classList.toggle('invalid-target', state.target?.kind === 'unit' && state.target.id === id && !state.target.valid);
      button.classList.toggle('chosen-target', state.target?.kind === 'unit' && state.target.id === id && state.target.valid);
      button.setAttribute('aria-pressed', String(selected));
      button.querySelector('.unit-state').textContent = selected ? 'SELECTED' : '';
    }
    for (const control of scene.querySelectorAll('[data-focus]')) control.classList.toggle('shared-focus', control.dataset.focus === state.focusKey);
    scene.querySelector('.orders').innerHTML = [...orders.entries()].filter(([,order]) => order.kind !== 'stop').map(([id,order]) => makeLine(fixture.units.find(unit => unit.id === id), order, `committed-${order.kind}`)).join('');
    scene.querySelector('.preview-lines').innerHTML = state.preview ? state.preview.unitIds.map(id => makeLine(fixture.units.find(unit => unit.id === id), state.preview, `preview-${state.preview.kind}`)).join('') : '';
    const marker = scene.querySelector('.target-marker');
    marker.hidden = !state.preview;
    if (state.preview) { marker.style.left = `${state.preview.x / 9.6}%`; marker.style.top = `${state.preview.y / 6.8}%`; marker.className = `target-marker ${state.preview.kind}`; }
    scene.dataset.sharedState = JSON.stringify({ fixtureId: model.fixtureId, selectedIds: state.selectedIds, hoverId: state.hoverId, focusKey: state.focusKey, command: state.command, target: state.target, preview: state.preview, committedOrders: state.committedOrders, error: state.error });
  }
}
for (const article of scenes) {
  article.addEventListener('click', event => {
    const control = event.target.closest('button');
    if (!control) return;
    if (control.dataset.unit) dispatch({ type: 'ACTIVATE_UNIT', id: control.dataset.unit, additive: event.shiftKey });
    else if (control.dataset.waypoint) dispatch({ type: 'TARGET', target: { kind: 'waypoint', id: control.dataset.waypoint } });
    else if (control.classList.contains('open-space')) {
      const bounds = control.getBoundingClientRect();
      // Keyboard-generated clicks target the center; pointer clicks use fixture coordinates.
      const x = event.detail === 0 ? fixture.world.width / 2 : (event.clientX - bounds.left) / bounds.width * fixture.world.width;
      const y = event.detail === 0 ? fixture.world.height / 2 : (event.clientY - bounds.top) / bounds.height * fixture.world.height;
      dispatch({ type: 'TARGET', target: { kind: 'point', x: Math.round(x), y: Math.round(y) } });
    }
    else if (control.dataset.command) dispatch({ type: 'CHOOSE_COMMAND', command: control.dataset.command });
    else if (control.dataset.action) dispatch({ type: { clear: 'CLEAR', stop: 'STOP', commit: 'COMMIT', cancel: 'CANCEL' }[control.dataset.action] });
  });
  for (const unit of article.querySelectorAll('[data-unit]')) {
    unit.addEventListener('pointerenter', () => dispatch({ type: 'HOVER', id: unit.dataset.unit }));
    unit.addEventListener('pointerleave', () => dispatch({ type: 'HOVER', id: null }));
  }
  article.addEventListener('focusin', event => {
    const control = event.target.closest('[data-focus]');
    if (control) dispatch({ type: 'FOCUS', key: control.dataset.focus });
  });
  article.addEventListener('focusout', event => {
    if (!article.contains(event.relatedTarget)) dispatch({ type: 'FOCUS', key: null });
  });
  article.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    const command = { m: 'move', a: 'attack' }[event.key.toLowerCase()];
    if (command) { event.preventDefault(); dispatch({ type: 'CHOOSE_COMMAND', command }); }
    else if (event.key.toLowerCase() === 's') { event.preventDefault(); dispatch({ type: 'STOP' }); }
    else if (event.key === 'Escape') { event.preventDefault(); dispatch({ type: 'CANCEL' }); }
  });
}
for (const button of document.querySelectorAll('[data-preset]')) button.addEventListener('click', () => dispatch({ type: 'PRESET', name: button.dataset.preset }));
document.querySelector('#reset').addEventListener('click', () => dispatch({ type: 'RESET' }));
for (const button of document.querySelectorAll('.viewport-controls [data-frame]')) button.addEventListener('click', () => {
  comparison.dataset.frame = button.dataset.frame;
  for (const choice of document.querySelectorAll('.viewport-controls [data-frame]')) choice.setAttribute('aria-pressed', String(choice === button));
});
// Read-only verification hook; all UI actions still go through the single dispatcher.
window.fleetDemo = Object.freeze({ getState: () => structuredClone(state), getFixture: () => structuredClone(fixture), getViewModels: () => scenes.map(() => structuredClone(viewModel(state, fixture))) });
render();
