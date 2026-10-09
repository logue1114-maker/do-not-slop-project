// Safe source/state checks using Node's built-in VM and a minimal DOM model.
// These checks do not launch or replace browser layout/interaction QA.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
const elements = new Map();
let radios = [];
let document;
class Element {
  constructor(id) { this.id = id; this.listeners = {}; this.style = { setProperty: (k, v) => { this.style[k] = v; } }; this.dataset = {}; this.hidden = false; this.disabled = false; this.textContent = ''; this.value = ''; this._checked = false; this.children = {}; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  dispatch(type) { if (type === 'click' && this.disabled) return; for (const fn of this.listeners[type] || []) fn({ target: this }); }
  focus() { document.activeElement = this; }
  querySelector(selector) { return this.children[selector]; }
  get checked() { return this._checked; }
  set checked(value) { this._checked = Boolean(value); if (value && radios.includes(this)) radios.filter((el) => el !== this).forEach((el) => { el._checked = false; }); }
}
for (const id of ids) elements.set(id, new Element(id));
const $ = (id) => { assert(elements.has(id), `Referenced element exists: ${id}`); return elements.get(id); };
const bodyClasses = new Set();
const documentEvents = {};
radios = ['story', 'standard'].map((value) => { const el = new Element(`difficulty-${value}`); el.value = value; return el; });
radios[1].checked = true;
$('continue-expedition').disabled = true;
$('continue-expedition').children['.lock'] = new Element('lock');
$('master-volume').value = '70';
for (const view of ['setup','settings','credits','survey']) $(`${view}-view`).hidden = true;
document = {
  body: { classList: { toggle: (name, on) => on ? bodyClasses.add(name) : bodyClasses.delete(name) } },
  getElementById: $,
  querySelector: (selector) => {
    if (selector === 'input[name="difficulty"]:checked') return radios.find((el) => el.checked);
    const value = selector.match(/value="([^"]+)"/);
    assert(value, `Known query selector: ${selector}`);
    return radios.find((el) => el.value === value[1]);
  },
  addEventListener: (type, fn) => { (documentEvents[type] ||= []).push(fn); },
  activeElement: null,
};
vm.runInNewContext(js, { document }, { filename: 'app.js' });
const click = (id) => $(id).dispatch('click');
const view = (expected) => {
  assert.equal($('app').dataset.view || 'menu', expected);
  for (const name of ['menu','setup','settings','credits','survey']) assert.equal($(`${name}-view`).hidden, name !== expected, `Visibility of ${name}`);
};
const escape = () => { const event = { key: 'Escape', preventDefault() { this.prevented = true; } }; (documentEvents.keydown || []).forEach((fn) => fn(event)); };
let checks = 0;
function test(name, fn) { fn(); checks++; console.log(`PASS ${name}`); }

test('Initial menu: Continue disabled, volume 70, reduced motion off, Standard selected', () => { view('menu'); assert($('continue-expedition').disabled); assert.equal($('continue-reason').textContent,'No expedition in this session'); assert.equal($('master-volume').value,'70'); assert(!$('reduce-motion').checked); assert(radios[1].checked); });
test('Disabled Continue cannot open a survey', () => { click('continue-expedition'); view('menu'); });
test('Setup Back creates no session and restores focus', () => { click('new-expedition'); view('setup'); assert.equal(document.activeElement.id,'setup-title'); radios[0].checked = true; click('setup-back'); view('menu'); assert($('continue-expedition').disabled); assert.equal(document.activeElement.id,'new-expedition'); });
test('Setup Escape creates no session; new setup defaults to Standard', () => { click('new-expedition'); assert(radios[1].checked); escape(); view('menu'); assert($('continue-expedition').disabled); });
test('Settings update and survive Back, Credits and Escape', () => { click('open-settings'); view('settings'); $('master-volume').value = '32'; $('master-volume').dispatch('input'); assert.equal($('volume-value').textContent,'32%'); assert.equal($('master-volume').style['--level'],'32%'); $('reduce-motion').checked = true; $('reduce-motion').dispatch('change'); assert(bodyClasses.has('reduce-motion')); click('settings-back'); view('menu'); assert($('continue-expedition').disabled); click('open-credits'); view('credits'); click('credits-close'); view('menu'); assert.equal(document.activeElement.id,'open-credits'); click('open-settings'); assert.equal($('master-volume').value,'32'); assert($('reduce-motion').checked); escape(); view('menu'); assert.equal(document.activeElement.id,'open-settings'); });
test('Credits Escape closes safely without creating progress', () => { click('open-credits'); escape(); view('menu'); assert($('continue-expedition').disabled); });
test('Story start opens survey with objective and difficulty', () => { click('new-expedition'); radios[0].checked = true; click('start-expedition'); view('survey'); assert.equal($('survey-difficulty').textContent,'Story'); assert.equal($('objective-description').textContent,'Record the signal from Relay 07.'); assert(!$('record-signal').disabled); });
test('Return enables Continue and resumes the same Story survey', () => { click('return-menu'); view('menu'); assert(!$('continue-expedition').disabled); assert.equal($('continue-reason').textContent,'Outer coast · Story'); assert.equal(document.activeElement.id,'continue-expedition'); click('continue-expedition'); view('survey'); assert.equal($('survey-difficulty').textContent,'Story'); assert(!$('record-signal').disabled); });
test('Signal progress survives Escape and Continue; repeat scan is inert', () => { click('record-signal'); assert($('record-signal').disabled); assert.equal($('target-status').textContent,'SIGNAL RECORDED'); assert.equal(document.activeElement.id,'return-menu'); click('record-signal'); escape(); view('menu'); click('continue-expedition'); view('survey'); assert.equal($('objective-count').textContent,'COMPLETE'); assert.equal($('survey-difficulty').textContent,'Story'); assert($('record-signal').disabled); });
test('Cancelling a new expedition preserves an existing survey', () => { click('return-menu'); click('new-expedition'); radios[1].checked = true; escape(); view('menu'); click('continue-expedition'); assert.equal($('survey-difficulty').textContent,'Story'); assert($('record-signal').disabled); });
test('New Standard start resets only expedition; rapid repeat Start is inert', () => { click('return-menu'); click('new-expedition'); assert(radios[1].checked); click('start-expedition'); view('survey'); assert.equal($('survey-difficulty').textContent,'Standard'); assert(!$('record-signal').disabled); click('record-signal'); click('start-expedition'); assert($('record-signal').disabled); click('return-menu'); click('open-settings'); assert.equal($('master-volume').value,'32'); assert($('reduce-motion').checked); $('reduce-motion').checked = false; $('reduce-motion').dispatch('change'); assert(!bodyClasses.has('reduce-motion')); escape(); view('menu'); });
test('Escape on the main menu stays on the main menu', () => { escape(); view('menu'); assert(!$('continue-expedition').disabled); });
console.log(`${checks} state scenarios passed; DOM IDs are unique.`);
