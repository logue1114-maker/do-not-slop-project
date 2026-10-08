import { createState, transition, viewModel } from './state.mjs';
import { recoveryKeyAfterAction } from './focus.mjs';
import { createView } from './view.mjs';
import { bindControls } from './controllers.mjs';

/** A mounted instance owns one shared in-memory state and its listeners.
 * No persistence or game simulation is introduced. dispose is idempotent.
 */
export function mountFleet(document, fixture) {
  let state = createState(fixture);
  // A fresh instance has no prior order to announce, including after host remount.
  document.querySelector('#live-status').textContent = '';
  const view = createView(document, fixture);
  const { scenes } = view;
  const render = () => view.render(state);
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

  const unbind = bindControls({ document, scenes, comparison: view.comparison, fixture, dispatch });
  const api = Object.freeze({
    getState: () => structuredClone(state),
    getFixture: () => structuredClone(fixture),
    getViewModels: () => scenes.map(() => structuredClone(viewModel(state, fixture)))
  });
  render();
  let disposed = false;
  return { api, dispose() {
    if (disposed) return;
    disposed = true;
    // Stop input before removing nodes, so no detached control can mutate state.
    unbind();
    view.dispose();
  } };
}
