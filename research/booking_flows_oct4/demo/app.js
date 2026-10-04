(function () {
  'use strict';
  const {BookingStore, canonical, endAt} = window.BookingModel;
  const fixture = window.BOOKING_FIXTURE;
  const store = new BookingStore(fixture);
  const query = new URLSearchParams(location.search);
  const ui = {view: ['before', 'after', 'compare'].includes(query.get('view')) ? query.get('view') : 'after', openDetails: {before: true, after: false}, historyNavigation: false, composing: false, queuedState: null};
  const initialPreset = ['selection', 'review', 'conflict'].includes(query.get('screen')) ? query.get('screen') : 'selection';
  store.reset(initialPreset, false);
  if (query.get('capture') === '1') document.body.classList.add('capture-mode');
  const root = document.getElementById('screen');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const money = value => new Intl.NumberFormat('ko-KR').format(value) + '원';
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  function dateLabel(date, full = false) {
    const [y, m, d] = date.split('-').map(Number);
    if (!y || !m || !d) return '날짜 미선택';
    return (full ? y + '년 ' : '') + m + '월 ' + d + '일 (' + weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] + ')';
  }
  const timeLabel = booking => booking.start ? booking.start + '–' + booking.end : '시간을 선택해 주세요';
  const stepLabel = phase => ({selection:'01 / 시간 선택', review:'02 / 변경 확인', confirming:'02 / 변경 확인', conflict:'03 / 가용성 충돌', success:'가상 변경 결과', cancelled:'변경 취소 결과'}[phase]);
  const titles = {selection:'예약 시간 변경', review:'변경 내용 확인', confirming:'변경 내용 확인', conflict:'다른 시간을 선택해 주세요', success:'가상 변경 완료', cancelled:'변경을 취소했습니다'};
  const fieldLabels = {date:'예약 날짜', start:'이용 시간', meeting_name:'회의명', headcount:'인원'};
  let lastPhase = store.state.phase;
  history.replaceState({bookingDemo:true, phase:lastPhase}, '', location.href);

  function errorSummary(s, view) {
    const entries = Object.entries(s.errors);
    if (!entries.length || (s.phase === 'conflict' && entries.every(([key]) => key === 'start'))) return '';
    return '<section class="error-summary" role="alert"><strong>입력 내용을 확인해 주세요</strong><ul>' + entries.map(([field, text]) => '<li><button type="button" data-focus="' + field + '" data-pane="' + view + '">' + esc(fieldLabels[field]) + ': ' + esc(text) + '</button></li>').join('') + '</ul></section>';
  }
  function roomContext(s) {
    return '<div class="room-context"><span class="room-symbol" aria-hidden="true">M</span><div><strong>' + esc(fixture.room.name) + '</strong><span>정원 ' + fixture.room.capacity + '명 · ' + fixture.room.duration_minutes + '분</span></div><span class="timezone">' + esc(fixture.time_zone_label) + '</span></div>';
  }
  function oldStrip(s) {
    return '<div class="old-strip"><span>기존 예약</span><strong>' + dateLabel(s.originalBooking.date) + ' <span class="nowrap">' + timeLabel(s.originalBooking) + '</span></strong><span class="keep-tag">확정 전 유지</span></div>';
  }
  function fields(s, view, force = false) {
    const isOpen = force || ui.openDetails[view] || s.errors.meeting_name || s.errors.headcount;
    return '<details class="details-editor" data-pane="' + view + '"' + (isOpen ? ' open' : '') + '><summary>회의 정보 변경<span>' + esc(s.details.meeting_name || '회의명 미입력') + ' · ' + esc(s.details.headcount || '—') + '명</span></summary><div class="input-fields"><div class="field"><label for="' + view + '-meeting_name">회의명</label><input id="' + view + '-meeting_name" data-field="meeting_name" data-pane="' + view + '" type="text" maxlength="60" value="' + esc(s.details.meeting_name) + '" autocomplete="off" aria-describedby="' + view + '-meeting_name-help' + (s.errors.meeting_name ? ' ' + view + '-meeting_name-error' : '') + '"' + (s.errors.meeting_name ? ' aria-invalid="true"' : '') + (s.phase === 'confirming' ? ' disabled' : '') + '><span class="field-hint" id="' + view + '-meeting_name-help">1~60자</span>' + (s.errors.meeting_name ? '<p class="field-error" id="' + view + '-meeting_name-error">' + esc(s.errors.meeting_name) + '</p>' : '') + '</div><div class="field"><label for="' + view + '-headcount">인원</label><div class="number-input"><input id="' + view + '-headcount" data-field="headcount" data-pane="' + view + '" type="number" min="1" max="' + fixture.room.capacity + '" step="1" value="' + esc(s.details.headcount) + '" aria-describedby="' + view + '-headcount-help' + (s.errors.headcount ? ' ' + view + '-headcount-error' : '') + '"' + (s.errors.headcount ? ' aria-invalid="true"' : '') + (s.phase === 'confirming' ? ' disabled' : '') + '><span>명</span></div><span class="field-hint" id="' + view + '-headcount-help">최대 ' + fixture.room.capacity + '명</span>' + (s.errors.headcount ? '<p class="field-error" id="' + view + '-headcount-error">' + esc(s.errors.headcount) + '</p>' : '') + '</div></div></details>';
  }
  function detailsSummary(s, view) {
    return '<div class="meeting-summary"><div><span>회의 정보</span><strong>' + esc(s.details.meeting_name || '회의명 미입력') + ' · ' + esc(s.details.headcount || '—') + '명</strong></div>' + (store.canEdit() ? '<button class="text-button" type="button" data-action="edit-details" data-pane="' + view + '">변경</button>' : '') + '</div>';
  }
  function dateTime(s, view) {
    const dates = Object.keys(fixture.availability).sort();
    const slots = s.availability[s.draft.date] || [];
    const empty = !slots.some(slot => slot.available);
    const nextDate = store.nextAvailableDate();
    return '<section class="time-picker"><fieldset id="' + view + '-date-group" tabindex="-1"' + (s.errors.date ? ' aria-describedby="' + view + '-date-error"' : '') + '><legend><span class="section-number">01</span> 예약 날짜</legend><div class="date-options">' + dates.map(date => {
      const [y, m, d] = date.split('-').map(Number);
      const hasAvailability = s.availability[date].some(slot => slot.available);
      return '<button type="button" class="date-option" data-date="' + date + '" aria-pressed="' + (s.draft.date === date) + '"><span>' + m + '월</span><strong>' + d + '</strong><span>' + weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] + '요일</span>' + (view === 'after' ? '<small>' + (hasAvailability ? '시간 있음' : '시간 없음') + '</small>' : '') + '</button>';
    }).join('') + '</div>' + (s.errors.date ? '<p class="field-error" id="' + view + '-date-error">' + esc(s.errors.date) + '</p>' : '') + '</fieldset><fieldset class="slot-fieldset" id="' + view + '-start-group" tabindex="-1"' + (s.errors.start ? ' aria-describedby="' + view + '-start-error" aria-invalid="true"' : '') + '><legend><span class="section-number">02</span> 이용 시간 <span class="legend-meta">60분</span></legend><p class="date-context">' + dateLabel(s.draft.date) + ' · 한국 시간 (UTC+9)</p>' + (empty ? '<div class="empty-state"><span class="empty-symbol" aria-hidden="true">—</span><strong>예약 가능한 시간이 없습니다</strong><p>다른 날짜를 선택해 주세요</p>' + (nextDate ? '<button class="secondary" type="button" data-date="' + nextDate + '">' + dateLabel(nextDate) + ' 보기 <span aria-hidden="true">→</span></button>' : '') + '</div>' : '<div class="time-options">' + slots.map(slot => {
      const selected = slot.start === s.draft.start;
      const invalid = selected && !slot.available;
      return '<button type="button" class="time-option' + (invalid ? ' invalid-slot' : '') + '" data-time="' + slot.start + '" aria-pressed="' + selected + '"' + (!slot.available ? ' disabled' : '') + (invalid ? ' aria-invalid="true"' : '') + '><strong>' + slot.start + '<span>–' + endAt(slot.start, fixture.room.duration_minutes) + '</span></strong><span class="slot-status">' + (invalid ? '선택 무효' : !slot.available ? '예약 불가' : selected ? '선택됨' : '예약 가능') + (selected && !invalid ? ' <span aria-hidden="true">✓</span>' : '') + '</span></button>';
    }).join('') + '</div>') + (s.errors.start ? '<p class="field-error" id="' + view + '-start-error">' + esc(s.errors.start) + '</p>' : '') + '</fieldset></section>';
  }
  function compareTimes(s, compact = false) {
    return '<div class="booking-comparison' + (compact ? ' compact' : '') + '"><div class="booking-old"><span class="comparison-label">기존</span><div><strong>' + dateLabel(s.originalBooking.date) + '</strong><span class="comparison-time"><s>' + timeLabel(s.originalBooking) + '</s></span></div></div><div class="booking-new"><span class="comparison-label">변경 후</span><div><strong>' + dateLabel(s.draft.date) + '</strong><span class="comparison-time">' + timeLabel(s.draft) + '</span>' + (s.invalidSelection ? '<span class="invalid-label">선택 무효 · 다른 시간 필요</span>' : '') + '</div></div></div>';
  }
  function priceBlock() {
    return '<section class="price-block" aria-label="가상 비용 내역"><div class="section-heading"><h3>비용 내역</h3><span class="fiction-label">가상 금액 · 세금 포함</span></div><dl class="price-lines"><div><dt>회의실 · 60분</dt><dd>' + money(fixture.price.room) + '</dd></div><div><dt>서비스 수수료</dt><dd>' + money(fixture.price.service_fee) + '</dd></div><div class="total-line"><dt>총액</dt><dd>' + money(fixture.price.total) + '</dd></div></dl></section>';
  }
  function policyBlock() {
    return '<section class="policy-block"><h3>가상 취소 조건</h3><p><strong>10월 14일 14:00까지</strong> 취소 수수료 0원</p><p>이후 취소 수수료 <strong>' + money(fixture.conditions.late_cancellation_fee) + '</strong></p><span class="field-hint">한국 시간 (UTC+9) · 설명용 가상 정책</span></section>';
  }
  function continuity(s) {
    return '<p class="continuity"><span aria-hidden="true">↻</span> 확정 전에는 기존 예약이 유지됩니다. 확정하면 <strong>' + esc(s.originalBooking.id) + '</strong>의 날짜·시간만 교체합니다</p>';
  }
  function actions(s, view) {
    if (['success', 'cancelled'].includes(s.phase)) return '<button class="primary" type="button" data-action="reset">처음 상태로 돌아가기</button>';
    const confirming = s.phase === 'confirming';
    const review = s.phase === 'review' || confirming;
    const conflict = s.phase === 'conflict';
    return '<div class="action-stack"><button class="primary" type="button" data-action="' + (review ? 'confirm' : 'review') + '"' + (confirming || conflict ? ' disabled' : '') + '>' + (confirming ? '<span class="spinner" aria-hidden="true"></span> 가상 변경 처리 중…' : conflict ? '다른 시간을 선택해 주세요' : review ? money(fixture.price.total) + ' · 변경 확정(데모)' : '변경 내용 확인') + '<span aria-hidden="true">' + (!confirming && !conflict ? ' →' : '') + '</span></button>' + (review ? '<button class="secondary" type="button" data-action="back"' + (confirming ? ' disabled' : '') + '>시간 다시 선택</button>' : '') + '<button class="cancel-button" type="button" data-action="cancel">변경 취소</button></div>';
  }
  function conflictAlert(s) {
    return '<section class="conflict-alert" role="alert"><div><span class="alert-icon" aria-hidden="true">!</span><div><span class="eyebrow">가상 가용성 충돌</span><strong>14:00은 방금 예약되어 선택할 수 없습니다</strong><p>기존 예약과 입력한 회의 정보는 유지됩니다</p></div></div><button class="conflict-choice" type="button" data-time="15:00">15:00 선택 <span aria-hidden="true">→</span></button></section>';
  }
  function result(s, view) {
    const success = s.phase === 'success';
    return '<div class="result-layout"><section class="result-main"><div class="result-symbol ' + (success ? 'success-symbol' : '') + '" aria-hidden="true">' + (success ? '✓' : '↶') + '</div><h3>' + (success ? '선택한 시간으로 변경되었습니다' : '기존 예약은 그대로 유지됩니다') + '</h3><p>로컬 메모리에서만 처리된 가상 결과입니다</p>' + (success ? compareTimes(s) : '<div class="preserved-booking"><span>유지된 기존 예약</span><strong>' + dateLabel(s.existingBooking.date) + '</strong><b>' + timeLabel(s.existingBooking) + '</b></div>') + '<dl class="result-details"><div><dt>회의실</dt><dd>' + fixture.room.name + ' · 6명 · 60분</dd></div><div><dt>회의 정보</dt><dd>' + esc(s.details.meeting_name) + ' · ' + esc(s.details.headcount) + '명</dd></div><div><dt>예약 ID</dt><dd>' + s.existingBooking.id + ' · 로컬 예약 1건</dd></div><div><dt>시간대</dt><dd>' + fixture.time_zone_label + '</dd></div></dl><p class="fiction-result">실제 예약·결제·메일·계정 변경은 발생하지 않았습니다</p></section><aside class="summary-panel">' + priceBlock() + policyBlock() + '<p class="field-hint">' + (success ? '확인한 가상 변경안의 금액과 조건입니다' : '취소한 가상 변경안의 금액과 조건입니다. 청구 없음') + '</p>' + actions(s, view) + '</aside></div>';
  }
  function after(s) {
    const resultPhase = ['success', 'cancelled'].includes(s.phase);
    const review = ['review', 'confirming'].includes(s.phase);
    return '<article class="booking-screen after-screen" data-layout="after"><header class="screen-header"><div class="eyebrow">' + stepLabel(s.phase) + '</div><h1 tabindex="-1" id="after-title">' + titles[s.phase] + '</h1>' + roomContext(s) + '</header>' + errorSummary(s, 'after') + (resultPhase ? result(s, 'after') : (s.phase === 'conflict' ? conflictAlert(s) : '') + '<div class="booking-grid"><div class="main-panel">' + (review ? '<section class="review-comparison"><div class="section-heading"><h2>예약 변경 내용</h2><span class="fiction-label">한국 시간 (UTC+9)</span></div>' + compareTimes(s) + '<div class="duration-line">메이플 회의실 · 이용 시간 60분</div>' + detailsSummary(s, 'after') + fields(s, 'after') + '</section>' : oldStrip(s) + dateTime(s, 'after') + detailsSummary(s, 'after') + fields(s, 'after')) + '</div><aside class="summary-panel">' + (!review ? '<div class="summary-heading"><h2>변경안</h2><span>확정 전</span></div>' + compareTimes(s, true) : '<div class="summary-heading"><h2>확정 전 확인</h2><span>가상 변경</span></div>') + priceBlock() + policyBlock() + continuity(s) + actions(s, 'after') + '</aside></div>') + '</article>';
  }
  function before(s) {
    const resultPhase = ['success', 'cancelled'].includes(s.phase);
    const review = ['review', 'confirming'].includes(s.phase);
    const lead = s.phase === 'selection' ? '회의 준비를 시작해 볼까요?' : review ? '거의 완료되었습니다' : titles[s.phase];
    return '<article class="booking-screen before-screen" data-layout="before"><header class="screen-header"><div class="eyebrow">' + stepLabel(s.phase) + '</div><h1 tabindex="-1" id="before-title">' + lead + '</h1>' + roomContext(s) + '</header>' + errorSummary(s, 'before') + (resultPhase ? result(s, 'before') : '<section class="before-instructions"><h2>' + (review ? '선택하신 내용으로 변경을 진행합니다' : '예약 변경 안내') + '</h2><p>' + (review ? '아래 내용을 확인한 뒤 변경 확정 버튼을 눌러 주세요' : '회의 정보를 먼저 확인하고, 아래에서 날짜와 시간을 선택해 주세요') + '</p><div class="instruction-step"><span>1</span> 정보를 확인해 주세요 <span>2</span> 날짜와 시간을 선택해 주세요 <span>3</span> 변경을 확인해 주세요</div></section>' + (review ? '<section class="before-new-time"><span>선택하신 새로운 시간</span><strong>' + dateLabel(s.draft.date) + '</strong><b>' + timeLabel(s.draft) + '</b><p>선택하신 내용이 맞는지 한 번 더 확인해 주세요</p></section><section class="before-old-booking"><h2>예약 정보</h2>' + oldStrip(s) + detailsSummary(s, 'before') + fields(s, 'before', true) + '</section>' : '<section class="before-details"><h2>먼저 회의 정보를 확인해 주세요</h2>' + fields(s, 'before', true) + '<p class="repeated-copy">아래에서 이용하실 날짜와 시간을 선택하시면 됩니다</p></section>' + (s.phase === 'conflict' ? conflictAlert(s) : '') + dateTime(s, 'before') + '<section class="before-old-booking"><h2>변경할 예약</h2>' + compareTimes(s) + '</section>') + '<div class="before-price">' + priceBlock() + '</div><section class="before-reassurance"><h2>내용을 모두 확인해 주세요</h2><p>변경 확정 버튼을 누르면 선택하신 내용으로 변경됩니다. 확정 전까지는 아래 내용을 다시 확인할 수 있습니다</p></section><div class="before-policy">' + policyBlock() + '</div><div class="before-actions">' + continuity(s) + actions(s, 'before') + '</div>') + '</article>';
  }
  function render(s = store.snapshot()) {
    const active = document.activeElement;
    const saved = active && active.dataset.field ? {field:active.dataset.field, pane:active.dataset.pane, start:active.selectionStart, end:active.selectionEnd} : null;
    const focusedChoice = active && (active.dataset.date || active.dataset.time) ? {kind:active.dataset.date ? 'date' : 'time', value:active.dataset.date || active.dataset.time, pane:active.closest('[data-layout]')?.dataset.layout} : null;
    root.className = ui.view === 'compare' ? 'compare-view' : 'single-view';
    root.innerHTML = ui.view === 'compare' ? '<section class="comparison-pane"><div class="pane-label"><strong>Before</strong><span>의도적으로 만든 정보 위계 문제</span></div>' + before(s) + '</section><section class="comparison-pane"><div class="pane-label"><strong>After</strong><span>같은 정보 · 그룹과 여백 조정</span></div>' + after(s) + '</section>' : (ui.view === 'before' ? before(s) : after(s));
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', button.dataset.view === ui.view));
    document.getElementById('stale-toggle').checked = s.simulateStale;
    document.getElementById('stale-toggle').disabled = !store.canEdit();
    document.getElementById('simulation-note').textContent = s.simulateStale ? '시뮬레이션 준비됨: 10/15 14:00 확정 시 가상 충돌. 15:00은 직접 선택해야 합니다' : '';
    document.getElementById('hash-output').hidden = true;
    if (saved) {
      const replacement = document.getElementById(saved.pane + '-' + saved.field);
      if (replacement) { replacement.focus({preventScroll:true}); if (replacement.type === 'text' && saved.start !== null) replacement.setSelectionRange(saved.start, saved.end); }
    }
    if (focusedChoice && s.phase === lastPhase) {
      const choice = root.querySelector('[data-layout="' + focusedChoice.pane + '"] [data-' + focusedChoice.kind + '="' + focusedChoice.value + '"]');
      if (choice && !choice.disabled) choice.focus({preventScroll:true});
    }
    if (s.phase !== lastPhase) {
      document.getElementById('live-status').textContent = titles[s.phase];
      if (!ui.historyNavigation && ['selection', 'review', 'conflict'].includes(s.phase)) history.pushState({bookingDemo:true, phase:s.phase}, '', location.href);
      lastPhase = s.phase;
      if (!saved) document.getElementById((ui.view === 'before' ? 'before' : 'after') + '-title')?.focus({preventScroll:true});
    }
  }
  function focusField(field, pane) {
    if (['meeting_name', 'headcount'].includes(field)) {
      ui.openDetails[pane] = true;
      // Validation already renders and opens the errored editor through the subscription.
      // Render only if an explicit edit action still needs to reveal it.
      const editor = document.getElementById(pane + '-' + field)?.closest('.details-editor');
      if (!editor?.open) render();
    }
    const element = document.getElementById(pane + '-' + (['date', 'start'].includes(field) ? field + '-group' : field));
    if (element) { element.focus(); element.scrollIntoView({block:'center', behavior:'auto'}); }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.view) { ui.view = button.dataset.view; render(); return; }
    if (button.dataset.date) { store.chooseDate(button.dataset.date); return; }
    if (button.dataset.time) { store.chooseTime(button.dataset.time); return; }
    if (button.dataset.focus) { focusField(button.dataset.focus, button.dataset.pane); return; }
    const action = button.dataset.action;
    if (action === 'review') {
      if (!store.review()) focusField(Object.keys(store.state.errors)[0], ui.view === 'before' ? 'before' : 'after');
    } else if (action === 'confirm') store.confirm();
    else if (action === 'back') store.back();
    else if (action === 'cancel') store.cancel();
    else if (action === 'reset') { store.reset('selection'); document.getElementById('preset').value = 'selection'; }
    else if (action === 'edit-details') { ui.openDetails[button.dataset.pane] = true; render(); focusField('meeting_name', button.dataset.pane); }
  });
  // A single subscription is the app/store bridge. Defer replacement of the active
  // input node during Korean IME composition; commit once at compositionend.
  store.subscribe(state => {
    if (ui.composing) { ui.queuedState = state; return; }
    ui.queuedState = null;
    render(state);
  });
  document.addEventListener('compositionstart', event => {
    if (event.target.dataset.field) ui.composing = true;
  });
  document.addEventListener('compositionend', event => {
    if (!event.target.dataset.field) return;
    ui.composing = false;
    store.setDetail(event.target.dataset.field, event.target.value);
    if (ui.queuedState) { ui.queuedState = null; render(store.snapshot()); }
  });
  document.addEventListener('input', event => {
    if (event.target.dataset.field) {
      if (event.isComposing) ui.composing = true;
      store.setDetail(event.target.dataset.field, event.target.value);
    }
  });
  document.addEventListener('toggle', event => {
    if (event.target.matches?.('.details-editor')) ui.openDetails[event.target.dataset.pane] = event.target.open;
  }, true);
  document.getElementById('preset').value = initialPreset;
  document.getElementById('preset').addEventListener('change', event => { ui.openDetails.after = false; store.reset(event.target.value); });
  document.getElementById('test-toggle').addEventListener('click', event => {
    const panel = document.getElementById('test-panel'); panel.hidden = !panel.hidden;
    document.getElementById('test-toggle').setAttribute('aria-expanded', !panel.hidden);
  });
  document.getElementById('stale-toggle').addEventListener('change', event => store.setStaleSimulation(event.target.checked));
  document.getElementById('slow-toggle').addEventListener('change', event => { store.delay = event.target.checked ? 1800 : 900; });
  document.getElementById('reset-test').addEventListener('click', () => { ui.openDetails.after = false; store.reset(document.getElementById('preset').value); });
  async function getHashes() {
    if (!globalThis.crypto?.subtle) return {unavailable:'SHA-256은 localhost 또는 보안 컨텍스트에서 확인할 수 있습니다'};
    const digest = async value => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical(value))))].map(byte => byte.toString(16).padStart(2, '0')).join('');
    return {fixtureHash:await digest(fixture), stateHash:await digest(store.snapshot()), contractHash:await digest(store.contract())};
  }
  document.getElementById('show-hashes').addEventListener('click', async () => {
    const output = document.getElementById('hash-output');
    const hashes = await getHashes();
    output.hidden = false;
    output.innerHTML = hashes.unavailable ? '<p>' + hashes.unavailable + '</p>' : '<dl class="hash-list">' + Object.entries(hashes).map(([label, value]) => '<div><dt>' + label + '</dt><dd>' + value + '</dd></div>').join('') + '</dl><p>Before / After 모두 동일한 fixture와 상태를 읽습니다. 화면 구조를 바꿔도 hash는 유지됩니다</p>';
  });
  window.addEventListener('popstate', event => {
    if (event.state?.bookingDemo) { ui.historyNavigation = true; store.navigatePhase(event.state.phase); ui.historyNavigation = false; }
  });
  window.bookingDemo = Object.freeze({getState:() => store.snapshot(), getFixture:() => JSON.parse(JSON.stringify(fixture)), getHashes, getContract:view => store.contractForView(view), reset:preset => store.reset(preset), setView:view => {if (['before','after','compare'].includes(view)) {ui.view = view; render();}}});
  render();
})();
