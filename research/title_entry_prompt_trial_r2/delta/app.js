(() => {
  'use strict';
  const app = document.getElementById('app');
  const views = ['menu', 'setup', 'settings', 'credits', 'survey'];
  const state = { view: 'menu', volume: 70, reduceMotion: false, session: null };
  const $ = (id) => document.getElementById(id);
  const announce = (message) => { $('announcement').textContent = message; };

  function updateContinue() {
    const button = $('continue-expedition');
    button.disabled = !state.session;
    $('continue-reason').textContent = state.session
      ? `Outer coast · ${state.session.difficulty === 'story' ? 'Story' : 'Standard'}`
      : 'No expedition in this session';
    button.querySelector('.lock').style.display = state.session ? 'none' : '';
  }

  function updateSurvey() {
    if (!state.session) return;
    const recorded = state.session.signalRecorded;
    $('survey-difficulty').textContent = state.session.difficulty === 'story' ? 'Story' : 'Standard';
    $('objective-title').textContent = recorded ? 'A voice in the static' : 'Listen to the coast';
    $('objective-description').textContent = recorded ? 'Relay 07 signal recorded. Survey complete.' : 'Record the signal from Relay 07.';
    $('target-status').textContent = recorded ? 'SIGNAL RECORDED' : 'SIGNAL DETECTED';
    $('record-label').textContent = recorded ? 'Signal logged' : 'Record signal';
    $('record-signal').disabled = recorded;
    $('objective-count').textContent = recorded ? 'COMPLETE' : '01 / 01';
    $('footer-note').textContent = recorded ? 'RELAY 07 / SIGNAL SAFELY LOGGED' : 'LOCAL SURVEY / CONNECTION ESTABLISHED';
  }

  function showView(view, focusId) {
    if (!views.includes(view)) return;
    state.view = view;
    app.dataset.view = view;
    views.forEach((name) => { $(`${name}-view`).hidden = name !== view; });
    if (view === 'menu') {
      updateContinue();
      $('footer-note').textContent = 'SOMEWHERE, A SIGNAL IS WAITING.';
    }
    if (view === 'survey') updateSurvey();
    if (focusId) $(focusId).focus({ preventScroll: true });
  }

  $('new-expedition').addEventListener('click', () => {
    const defaultDifficulty = document.querySelector('input[name="difficulty"][value="standard"]');
    defaultDifficulty.checked = true;
    showView('setup', 'setup-title');
  });
  $('setup-back').addEventListener('click', () => showView('menu', 'new-expedition'));
  $('start-expedition').addEventListener('click', () => {
    if (state.view !== 'setup') return;
    const selection = document.querySelector('input[name="difficulty"]:checked');
    state.session = { difficulty: selection ? selection.value : 'standard', signalRecorded: false };
    showView('survey', 'survey-title');
    announce(`Expedition started. ${state.session.difficulty === 'story' ? 'Story' : 'Standard'} difficulty. Objective: record the signal from Relay 07.`);
  });
  $('continue-expedition').addEventListener('click', () => {
    if (!state.session) return;
    showView('survey', 'survey-title');
    announce('Expedition resumed. Your survey progress has been kept.');
  });
  $('return-menu').addEventListener('click', () => showView('menu', 'continue-expedition'));
  $('record-signal').addEventListener('click', () => {
    if (!state.session || state.session.signalRecorded) return;
    state.session.signalRecorded = true;
    updateSurvey();
    $('return-menu').focus({ preventScroll: true });
    announce('Relay 07 signal recorded. Local survey complete. Progress is kept for this page session.');
  });
  $('open-settings').addEventListener('click', () => showView('settings', 'settings-title'));
  $('settings-back').addEventListener('click', () => showView('menu', 'open-settings'));
  $('master-volume').addEventListener('input', (event) => {
    state.volume = Number(event.target.value);
    $('volume-value').textContent = `${state.volume}%`;
    event.target.style.setProperty('--level', `${state.volume}%`);
  });
  $('reduce-motion').addEventListener('change', (event) => {
    state.reduceMotion = event.target.checked;
    document.body.classList.toggle('reduce-motion', state.reduceMotion);
  });
  $('open-credits').addEventListener('click', () => showView('credits', 'credits-title'));
  $('credits-close').addEventListener('click', () => showView('menu', 'open-credits'));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || state.view === 'menu') return;
    event.preventDefault();
    const returnFocus = { setup: 'new-expedition', settings: 'open-settings', credits: 'open-credits', survey: 'continue-expedition' };
    showView('menu', returnFocus[state.view]);
  });
  updateContinue();
})();
