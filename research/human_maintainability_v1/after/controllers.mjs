/** Translate browser input into domain actions. Rules stay in state.mjs.
 * Returns an idempotent disposer; callback identity is retained for removal.
 */
export function bindControls({ document, scenes, comparison, fixture, dispatch }) {
  const listeners = [];
  function listen(target, type, callback) {
    target.addEventListener(type, callback);
    listeners.push(() => target.removeEventListener(type, callback));
  }
  for (const article of scenes) {
    listen(article, 'click', event => {
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
      listen(unit, 'pointerenter', () => dispatch({ type: 'HOVER', id: unit.dataset.unit }));
      listen(unit, 'pointerleave', () => dispatch({ type: 'HOVER', id: null }));
    }
    listen(article, 'focusin', event => {
      const control = event.target.closest('[data-focus]');
      if (control) dispatch({ type: 'FOCUS', key: control.dataset.focus });
    });
    listen(article, 'focusout', event => {
      if (!article.contains(event.relatedTarget)) dispatch({ type: 'FOCUS', key: null });
    });
    listen(article, 'keydown', event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      const command = { m: 'move', a: 'attack' }[event.key.toLowerCase()];
      if (command) { event.preventDefault(); dispatch({ type: 'CHOOSE_COMMAND', command }); }
      else if (event.key.toLowerCase() === 's') { event.preventDefault(); dispatch({ type: 'STOP' }); }
      else if (event.key === 'Escape') { event.preventDefault(); dispatch({ type: 'CANCEL' }); }
    });
  }
  for (const button of document.querySelectorAll('[data-preset]')) listen(button, 'click', () => dispatch({ type: 'PRESET', name: button.dataset.preset }));
  listen(document.querySelector('#reset'), 'click', () => dispatch({ type: 'RESET' }));
  for (const button of document.querySelectorAll('.viewport-controls [data-frame]')) listen(button, 'click', () => {
    comparison.dataset.frame = button.dataset.frame;
    for (const choice of document.querySelectorAll('.viewport-controls [data-frame]')) choice.setAttribute('aria-pressed', String(choice === button));
  });

  return () => { for (const remove of listeners.splice(0).reverse()) remove(); };
}
