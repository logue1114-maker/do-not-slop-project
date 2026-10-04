// Gameplay/state is deliberately unaware of A/B presentation.
export function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
export function createState(fixture) {
  return { fixtureId: fixture.id, selectedIds: [...fixture.initialSelection], hoverId: null,
    focusKey: null, command: null, target: null, preview: null, committedOrders: [],
    error: null, notice: 'Ready. Choose a command or change the selection.', nextOrder: 1 };
}
const lookup = (fixture, id) => fixture.units.find(unit => unit.id === id);
const targetPoint = (fixture, target) => target?.kind === 'point' ? target
  : target?.kind === 'waypoint' ? fixture.waypoints.find(item => item.id === target.id)
  : target?.kind === 'unit' ? lookup(fixture, target.id) : null;
function pickTarget(state, fixture, target) {
  if (!state.command) return state;
  const point = targetPoint(fixture, target);
  let error = null;
  if (!state.selectedIds.length) error = 'Select a friendly ship before issuing an order.';
  else if (state.command === 'attack' && (target.kind !== 'unit' || lookup(fixture, target.id)?.team !== 'hostile'))
    error = 'Attack needs a hostile ship. This target is invalid; no order sent.';
  else if (state.command === 'move' && target.kind === 'unit')
    error = 'Move needs open space or the relay marker. This target is invalid; no order sent.';
  else if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.x > fixture.world.width || point.y < 0 || point.y > fixture.world.height)
    error = 'Choose a target inside the command map. No order sent.';
  return { ...state, target: { ...target, valid: !error }, error,
    preview: error ? null : { kind: state.command, unitIds: [...state.selectedIds], target: { ...target }, x: point.x, y: point.y },
    notice: error ? state.notice : 'Preview ready. Confirm order to send it.' };
}
export function transition(state, action, fixture) {
  switch (action.type) {
    case 'RESET': return createState(fixture);
    case 'HOVER': return { ...state, hoverId: action.id };
    case 'FOCUS': return { ...state, focusKey: action.key };
    case 'SELECT': {
      const unit = lookup(fixture, action.id);
      if (!unit || unit.team !== 'friendly') return { ...state, error: 'Select a friendly ship.' };
      const ids = action.additive
        ? state.selectedIds.includes(action.id) ? state.selectedIds.filter(id => id !== action.id) : [...state.selectedIds, action.id]
        : [action.id];
      return { ...state, selectedIds: ids, command: null, target: null, preview: null, error: null,
        notice: ids.length ? 'Selection updated. Choose a command.' : 'Nothing selected. Select a friendly ship.' };
    }
    case 'CLEAR': return { ...state, selectedIds: [], command: null, target: null, preview: null, error: null, notice: 'Nothing selected. Select a friendly ship.' };
    case 'CHOOSE_COMMAND': {
      if (!['move', 'attack'].includes(action.command)) return state;
      if (!state.selectedIds.length) return { ...state, error: 'Select a friendly ship before choosing a command.' };
      return { ...state, command: action.command, target: null, preview: null, error: null,
        notice: action.command === 'move' ? 'Choose open space or the relay marker.' : 'Choose a hostile ship.' };
    }
    case 'TARGET': return pickTarget(state, fixture, action.target);
    case 'ACTIVATE_UNIT': {
      const unit = lookup(fixture, action.id);
      if (state.command) return pickTarget(state, fixture, { kind: 'unit', id: action.id });
      if (unit?.team === 'friendly') return transition(state, { type: 'SELECT', id: action.id, additive: !!action.additive }, fixture);
      return { ...state, error: 'Fang is hostile. Select a friendly ship, then choose Attack.' };
    }
    case 'COMMIT': {
      if (!state.preview || state.error || !state.selectedIds.length) return { ...state, error: 'Choose a valid target before confirming. No order sent.' };
      const order = { ...state.preview, id: state.nextOrder };
      return { ...state, committedOrders: [...state.committedOrders, order], nextOrder: state.nextOrder + 1,
        command: null, target: null, preview: null, error: null, notice: `${order.kind === 'move' ? 'Move' : 'Attack'} order sent to ${order.unitIds.length} ship${order.unitIds.length === 1 ? '' : 's'}.` };
    }
    case 'STOP': {
      if (!state.selectedIds.length) return { ...state, error: 'Select a friendly ship before choosing Stop.' };
      const order = { kind: 'stop', unitIds: [...state.selectedIds], target: null, id: state.nextOrder };
      return { ...state, committedOrders: [...state.committedOrders, order], nextOrder: state.nextOrder + 1,
        command: null, target: null, preview: null, error: null, notice: `Stop order sent to ${order.unitIds.length} ship${order.unitIds.length === 1 ? '' : 's'}.` };
    }
    case 'CANCEL': return { ...state, command: null, target: null, preview: null, error: null,
      notice: 'Command cancelled. Selection kept; no new order sent.' };
    case 'PRESET': {
      let next = createState(fixture);
      if (action.name === 'empty') return transition(next, { type: 'CLEAR' }, fixture);
      if (action.name === 'selection') return transition(next, { type: 'SELECT', id: 'arrow', additive: true }, fixture);
      if (action.name === 'preview') {
        next = transition(next, { type: 'SELECT', id: 'arrow', additive: true }, fixture);
        next = transition(next, { type: 'CHOOSE_COMMAND', command: 'move' }, fixture);
        return transition(next, { type: 'TARGET', target: { kind: 'waypoint', id: 'relay' } }, fixture);
      }
      if (action.name === 'invalid') {
        next = transition(next, { type: 'CHOOSE_COMMAND', command: 'attack' }, fixture);
        return transition(next, { type: 'TARGET', target: { kind: 'unit', id: 'willow' } }, fixture);
      }
      return next;
    }
    default: return state;
  }
}
export function viewModel(state, fixture) {
  const selected = fixture.units.filter(unit => state.selectedIds.includes(unit.id));
  const point = targetPoint(fixture, state.target);
  const targetName = state.target ? point?.name || `Open space ${Math.round(point?.x || 0)}, ${Math.round(point?.y || 0)}` : 'None';
  return { fixtureId: fixture.id, units: fixture.units, selected, selectedCount: selected.length,
    group: selected.length ? fixture.group : 'None', hoverId: state.hoverId, focusKey: state.focusKey,
    command: state.command, target: state.target, targetName, preview: state.preview,
    committedOrders: state.committedOrders, error: state.error, notice: state.notice,
    canConfirm: !!state.preview && !state.error && !!selected.length,
    canCancel: !!state.command || !!state.preview || !!state.error,
    lastOrder: state.committedOrders.at(-1) || null };
}
export function latestOrdersByUnit(state) {
  const byUnit = new Map();
  for (const order of state.committedOrders) for (const id of order.unitIds) byUnit.set(id, order);
  return byUnit;
}
