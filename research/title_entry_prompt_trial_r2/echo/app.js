(function () {
  'use strict';

  function createSession() {
    const state = {
      view: 'main',
      pendingDifficulty: 'standard',
      expedition: null,
      settings: { volume: 70, reduceMotion: false }
    };
    let nextId = 1;
    const validDifficulties = new Set(['story', 'standard']);
    return {
      snapshot() { return JSON.parse(JSON.stringify(state)); },
      openSetup() { state.pendingDifficulty = 'standard'; state.view = 'setup'; },
      selectDifficulty(value) {
        if (!validDifficulties.has(value)) return false;
        state.pendingDifficulty = value;
        return true;
      },
      start() {
        if (state.view !== 'setup') return false;
        state.expedition = { id: nextId++, difficulty: state.pendingDifficulty, signalRecorded: false };
        state.view = 'survey';
        return true;
      },
      continueExpedition() {
        if (!state.expedition) return false;
        state.view = 'survey';
        return true;
      },
      open(view) {
        if (!['main', 'settings', 'credits'].includes(view)) return false;
        state.view = view;
        return true;
      },
      returnToMenu() { state.view = 'main'; },
      scanSignal() {
        if (state.view !== 'survey' || !state.expedition) return false;
        state.expedition.signalRecorded = true;
        return true;
      },
      setVolume(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) return false;
        state.settings.volume = Math.min(100, Math.max(0, Math.round(number)));
        return true;
      },
      setReducedMotion(value) { state.settings.reduceMotion = Boolean(value); }
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { createSession };
  if (typeof document === 'undefined') return;

  const session = createSession();
  const byId = id => document.getElementById(id);
  const views = ['main', 'setup', 'settings', 'credits', 'survey'];
  const menuButtons = Array.from(document.querySelectorAll('#main-menu .command'));
  const difficultyInputs = Array.from(document.querySelectorAll('input[name="difficulty"]'));
  const continueButton = byId('continue-expedition');
  const volumeInput = byId('master-volume');
  const reduceMotionInput = byId('reduce-motion');
  const scanButton = byId('scan-signal');
  let activeCommand = byId('new-expedition');
  let arrivalTimer = 0;

  function difficultyName(value) { return value === 'story' ? 'Story' : 'Standard'; }
  function announce(message) { byId('announcement').textContent = message; }
  function setActiveCommand(button) {
    if (!button || button.disabled) return;
    activeCommand = button;
    menuButtons.forEach(item => item.classList.toggle('is-selected', item === button));
  }
  function render() {
    const state = session.snapshot();
    document.body.dataset.view = state.view;
    document.body.classList.toggle('reduce-motion', state.settings.reduceMotion);
    views.forEach(name => { byId(name + '-view').hidden = state.view !== name; });
    byId('back-hint').hidden = state.view === 'main';
    continueButton.disabled = !state.expedition;
    byId('continue-reason').textContent = state.expedition
      ? difficultyName(state.expedition.difficulty) + ' · Local survey ready to resume'
      : 'No saved expedition';
    difficultyInputs.forEach(input => { input.checked = input.value === state.pendingDifficulty; });
    volumeInput.value = String(state.settings.volume);
    volumeInput.style.setProperty('--volume', state.settings.volume + '%');
    volumeInput.setAttribute('aria-valuetext', state.settings.volume + ' percent');
    byId('volume-value').textContent = state.settings.volume + '%';
    reduceMotionInput.checked = state.settings.reduceMotion;
    if (state.expedition) {
      const complete = state.expedition.signalRecorded;
      byId('survey-difficulty').textContent = difficultyName(state.expedition.difficulty);
      byId('objective-title').textContent = complete ? 'Station signal recorded' : 'Scan the station signal';
      byId('objective-detail').textContent = complete ? 'Survey complete. The signal is yours to follow.' : 'Find what the coast has been trying to say.';
      byId('scan-label').textContent = complete ? 'Signal recorded' : 'Scan signal ↗';
      scanButton.classList.toggle('recorded', complete);
      scanButton.disabled = complete;
      scanButton.setAttribute('aria-label', complete ? 'Listening station signal recorded' : 'Scan the listening station signal');
    }
    if (activeCommand.disabled) setActiveCommand(byId('new-expedition'));
  }
  function present(focusId) {
    render();
    clearTimeout(arrivalTimer);
    const state = session.snapshot();
    const current = byId(state.view + '-view');
    views.forEach(name => byId(name + '-view').classList.remove('entering'));
    if (!state.settings.reduceMotion) {
      current.classList.add('entering');
      arrivalTimer = setTimeout(() => current.classList.remove('entering'), 300);
    }
    if (focusId) {
      const focusTarget = byId(focusId);
      if (state.view === 'main') setActiveCommand(focusTarget);
      focusTarget.focus({ preventScroll: true });
    }
  }
  function returnToMenu() {
    const formerView = session.snapshot().view;
    const target = { setup: 'new-expedition', settings: 'open-settings', credits: 'open-credits', survey: 'continue-expedition' }[formerView];
    session.returnToMenu();
    present(target || 'new-expedition');
    if (formerView === 'survey') announce('Expedition held. Continue is now available.');
  }

  byId('new-expedition').addEventListener('click', () => {
    session.openSetup();
    present('difficulty-standard');
  });
  continueButton.addEventListener('click', () => {
    if (!session.continueExpedition()) return;
    present('survey-heading');
    announce('Resumed your ' + difficultyName(session.snapshot().expedition.difficulty) + ' expedition.');
  });
  byId('open-settings').addEventListener('click', () => { session.open('settings'); present('master-volume'); });
  byId('open-credits').addEventListener('click', () => { session.open('credits'); present('credits-heading'); });
  difficultyInputs.forEach(input => input.addEventListener('change', () => { if (input.checked) session.selectDifficulty(input.value); }));
  byId('start-expedition').addEventListener('click', () => {
    if (!session.start()) return;
    present('survey-heading');
    announce(difficultyName(session.snapshot().expedition.difficulty) + ' expedition started. Objective: scan the station signal.');
  });
  ['setup-back', 'settings-back', 'credits-close', 'return-menu'].forEach(id => byId(id).addEventListener('click', returnToMenu));
  volumeInput.addEventListener('input', () => { session.setVolume(volumeInput.value); render(); });
  reduceMotionInput.addEventListener('change', () => { session.setReducedMotion(reduceMotionInput.checked); render(); });
  scanButton.addEventListener('click', () => {
    if (!session.scanSignal()) return;
    render();
    byId('survey-heading').focus({ preventScroll: true });
    announce('Station signal recorded. Your local survey is complete.');
  });
  menuButtons.forEach(button => {
    button.addEventListener('pointerenter', () => setActiveCommand(button));
    button.addEventListener('focus', () => setActiveCommand(button));
  });
  byId('main-menu').addEventListener('keydown', event => {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const available = menuButtons.filter(button => !button.disabled);
    const index = available.indexOf(document.activeElement);
    let nextIndex = index;
    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = available.length - 1;
    else if (event.key === 'ArrowDown') nextIndex = (index + 1) % available.length;
    else nextIndex = (index - 1 + available.length) % available.length;
    event.preventDefault();
    available[nextIndex].focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || session.snapshot().view === 'main') return;
    event.preventDefault();
    returnToMenu();
  });
  render();
})();
