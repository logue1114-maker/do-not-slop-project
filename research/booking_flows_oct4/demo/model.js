/* Shared local-only state machine. No storage, fetch, accounts, or external mutations. */
(function (root) {
  'use strict';
  const clone = (value) => JSON.parse(JSON.stringify(value));
  function canonical(value) {
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
    return JSON.stringify(value);
  }
  function endAt(start, minutes) {
    if (!/^\d\d:\d\d$/.test(start)) return '';
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + minutes;
    return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
  }
  class BookingStore {
    constructor(fixture, options = {}) {
      this.fixture = clone(fixture);
      this.delay = options.delay === undefined ? 900 : options.delay;
      this.listeners = new Set();
      this.operation = 0;
      this.reset('selection', false);
    }
    subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
    emit() { this.listeners.forEach(fn => fn(this.snapshot())); }
    snapshot() { return clone(this.state); }
    contract() { return {fixture: clone(this.fixture), state: this.snapshot()}; }
    contractForView(view) {
      if (!['before', 'after', 'compare'].includes(view)) throw new Error('Unknown presentation');
      return this.contract();
    }
    reset(preset = 'selection', notify = true) {
      this.operation++;
      this.state = {
        phase: preset === 'review' ? 'review' : 'selection',
        details: clone(this.fixture.details), draft: clone(this.fixture.draft),
        originalBooking: clone(this.fixture.existing_booking),
        existingBooking: clone(this.fixture.existing_booking),
        bookings: [clone(this.fixture.existing_booking)],
        availability: clone(this.fixture.availability),
        availabilityRevision: this.fixture.availability_revision,
        simulateStale: false, errors: {}, confirmationCount: 0,
        confirmedMutationCount: 0, invalidSelection: false
      };
      if (preset === 'conflict') {
        this.state.simulateStale = true;
        this.invalidateStale(false);
        this.state.phase = 'conflict';
      }
      if (notify) this.emit();
    }
    canEdit() { return !['confirming', 'success', 'cancelled'].includes(this.state.phase); }
    setDetail(field, value) {
      if (!this.canEdit() || !['meeting_name', 'headcount'].includes(field)) return false;
      const nextValue = field === 'headcount' && value !== '' ? Number(value) : value;
      if (Object.is(this.state.details[field], nextValue) && !this.state.errors[field]) return true;
      this.state.details[field] = nextValue;
      delete this.state.errors[field];
      this.emit(); return true;
    }
    chooseDate(date) {
      if (!this.canEdit() || !Object.hasOwn(this.fixture.availability, date)) return false;
      if (this.state.draft.date !== date) {
        this.state.draft = {date, start: '', end: '', status: 'selection_local_demo'};
        this.state.invalidSelection = false;
      }
      this.state.phase = 'selection'; this.state.errors = {}; this.emit(); return true;
    }
    chooseTime(start) {
      if (!this.canEdit()) return false;
      const slot = (this.state.availability[this.state.draft.date] || []).find(s => s.start === start);
      if (!slot || !slot.available) return false;
      this.state.draft.start = start;
      this.state.draft.end = endAt(start, this.fixture.room.duration_minutes);
      this.state.draft.status = 'selection_local_demo';
      this.state.invalidSelection = false;
      this.state.phase = 'selection';
      delete this.state.errors.start; delete this.state.errors.date;
      this.emit(); return true;
    }
    nextAvailableDate() {
      return Object.keys(this.state.availability).sort().find(date => date > this.state.draft.date && this.state.availability[date].some(s => s.available)) || null;
    }
    validation() {
      const errors = {};
      if (!Object.hasOwn(this.state.availability, this.state.draft.date)) errors.date = '예약 가능한 날짜를 선택해 주세요';
      const slot = (this.state.availability[this.state.draft.date] || []).find(s => s.start === this.state.draft.start);
      if (!slot || !slot.available) errors.start = this.state.invalidSelection ? this.state.draft.start + '은 선택할 수 없습니다. 다른 시간을 선택해 주세요' : '사용할 시간을 선택해 주세요';
      const name = this.state.details.meeting_name;
      if (typeof name !== 'string' || !name.trim() || name.trim().length > 60) errors.meeting_name = '회의명을 1~60자로 입력해 주세요';
      const count = this.state.details.headcount;
      if (!Number.isInteger(count) || count < 1 || count > this.fixture.room.capacity) errors.headcount = '인원은 1~' + this.fixture.room.capacity + '명으로 입력해 주세요';
      return errors;
    }
    review() {
      if (!this.canEdit()) return false;
      this.state.errors = this.validation();
      if (Object.keys(this.state.errors).length) { this.emit(); return false; }
      this.state.phase = 'review'; this.state.draft.status = 'review_local_demo'; this.emit(); return true;
    }
    back() {
      if (this.state.phase === 'confirming' || ['success', 'cancelled'].includes(this.state.phase)) return false;
      this.state.phase = 'selection'; this.emit(); return true;
    }
    navigatePhase(phase) {
      if (!this.canEdit() || !['selection', 'review', 'conflict'].includes(phase)) return false;
      if (phase === 'review' && Object.keys(this.validation()).length) phase = this.state.invalidSelection ? 'conflict' : 'selection';
      if (phase === 'conflict' && !this.state.invalidSelection) phase = 'selection';
      this.state.phase = phase; this.emit(); return true;
    }
    setStaleSimulation(enabled) {
      if (!this.canEdit()) return false;
      this.state.simulateStale = Boolean(enabled); this.emit(); return true;
    }
    invalidateStale(notify = true) {
      const stale = this.fixture.stale_slot_simulation;
      const slots = this.state.availability[stale.date] || [];
      const slot = slots.find(s => s.start === stale.start);
      if (slot) slot.available = false;
      this.state.availabilityRevision = 'fixture-v2-local';
      this.state.invalidSelection = this.state.draft.date === stale.date && this.state.draft.start === stale.start;
      if (this.state.invalidSelection) this.state.errors.start = stale.start + '은 방금 예약되어 선택할 수 없습니다';
      if (notify) this.emit();
    }
    async confirm() {
      if (this.state.phase !== 'review') return {ignored: true};
      this.state.errors = this.validation();
      if (Object.keys(this.state.errors).length) { this.state.phase = this.state.invalidSelection ? 'conflict' : 'selection'; this.emit(); return {invalid: true}; }
      const operation = ++this.operation;
      this.state.phase = 'confirming'; this.state.confirmationCount++;
      this.emit();
      await new Promise(resolve => setTimeout(resolve, this.delay));
      if (operation !== this.operation || this.state.phase !== 'confirming') return {cancelled: true};
      const stale = this.fixture.stale_slot_simulation;
      if (this.state.simulateStale && this.state.draft.date === stale.date && this.state.draft.start === stale.start) this.invalidateStale(false);
      this.state.errors = this.validation();
      if (Object.keys(this.state.errors).length) { this.state.phase = 'conflict'; this.emit(); return {conflict: true}; }
      const booking = {...this.state.existingBooking, date: this.state.draft.date, start: this.state.draft.start, end: this.state.draft.end, status: 'confirmed_local_demo'};
      this.state.existingBooking = booking;
      this.state.bookings = [clone(booking)];
      this.state.confirmedMutationCount++;
      this.state.phase = 'success'; this.state.draft.status = 'success_local_demo';
      this.emit(); return {success: true, booking: clone(booking)};
    }
    cancel() {
      if (['success', 'cancelled'].includes(this.state.phase)) return false;
      this.operation++;
      this.state.phase = 'cancelled'; this.state.errors = {};
      this.emit(); return true;
    }
  }
  const api = {BookingStore, canonical, clone, endAt};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BookingModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
