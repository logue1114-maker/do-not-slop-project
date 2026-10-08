import { viewModel, latestOrdersByUnit } from './state.mjs';
import { worldMarkup, shipShapes } from './assets.mjs';

/** Owns the two DOM scenes. render changes presentation, never domain state. */
export function createView(document, fixture) {
  const comparison = document.querySelector('#comparison');
  const scenes = [];
  const escapeText = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function unitMarkup(unit) {
    return `<button type="button" class="unit ${unit.team}" data-unit="${unit.id}" data-focus="unit:${unit.id}" style="left:${unit.x / 9.6}%;top:${unit.y / 6.8}%" aria-label="${escapeText(`${unit.name}, ${unit.team}, ${unit.role}, ${unit.hull}% hull`)}" aria-pressed="false"><span class="selection-marker" aria-hidden="true"></span><svg viewBox="-26 -27 52 54" aria-hidden="true">${shipShapes[unit.shape]}</svg><span class="unit-name">${unit.name}</span><span class="unit-state" aria-hidden="true"></span></button>`;
  }
  function makeScene(variant, title, subtitle) {
    const article = document.createElement('section');
    article.className = `comparison-panel variant-${variant}`;
    article.setAttribute('aria-label', title);
    article.dataset.variant = variant;
    article.innerHTML = `<header class="panel-header"><h2><span class="variant-letter">${variant.toUpperCase()}</span>${title}</h2><span>${subtitle}</span></header>
    <div class="scene" data-scene="${variant}"><div class="battlefield">
      ${worldMarkup(fixture, variant)}
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
  function makeLine(unit, target, className) {
    return `<path class="${className}" d="M${unit.x} ${unit.y}L${target.x} ${target.y}"/><circle class="${className}-end" cx="${target.x}" cy="${target.y}" r="7"/>`;
  }
  function render(state) {
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

  return { comparison, scenes, render, dispose() {
    for (const scene of scenes) scene.remove();
  } };
}
