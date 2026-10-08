// Presentation-only recovery when Confirm/Cancel disables the focused control.
// Native focus stays untouched for enabled controls and unrelated actions.
export function recoveryKeyAfterAction(actionType, focusedKey, isDisabled, selectedIds) {
  if (!['COMMIT', 'CANCEL'].includes(actionType) || !isDisabled || !['confirm', 'cancel'].includes(focusedKey)) return null;
  return selectedIds.length ? `unit:${selectedIds[0]}` : 'move';
}
