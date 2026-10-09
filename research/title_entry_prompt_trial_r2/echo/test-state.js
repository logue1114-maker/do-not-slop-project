'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { createSession } = require('./app.js');
let checks = 0;
function check(name, fn) { fn(); checks += 1; console.log('PASS ' + name); }

const state = createSession();
check('Initial menu: no expedition, Standard selected, volume 70, motion off', () => {
  assert.deepEqual(state.snapshot(), { view:'main', pendingDifficulty:'standard', expedition:null, settings:{volume:70,reduceMotion:false} });
});
check('Unavailable Continue cannot start an expedition', () => {
  assert.equal(state.continueExpedition(), false);
  assert.equal(state.snapshot().view, 'main');
  assert.equal(state.start(), false);
});
check('Setup Back creates no save', () => {
  state.openSetup(); state.selectDifficulty('story'); state.returnToMenu();
  assert.equal(state.snapshot().expedition, null);
});
check('Every fresh setup initially selects Standard', () => {
  state.openSetup(); assert.equal(state.snapshot().pendingDifficulty, 'standard');
});
check('Invalid difficulty values are rejected', () => {
  assert.equal(state.selectDifficulty('invalid'), false);
  assert.equal(state.snapshot().pendingDifficulty, 'standard');
});
check('Starting Story creates a survey session', () => {
  state.selectDifficulty('story'); assert.equal(state.start(), true);
  assert.equal(state.snapshot().view, 'survey');
  assert.deepEqual(state.snapshot().expedition, {id:1,difficulty:'story',signalRecorded:false});
});
check('Repeated Start is guarded after entry', () => {
  assert.equal(state.start(), false); assert.equal(state.snapshot().expedition.id, 1);
});
check('Recorded signal and difficulty resume in the same expedition', () => {
  state.scanSignal(); const saved = state.snapshot().expedition;
  state.returnToMenu(); assert.equal(state.continueExpedition(), true);
  assert.deepEqual(state.snapshot().expedition, saved);
});
check('Canceling another setup leaves the existing expedition intact', () => {
  const saved = state.snapshot().expedition;
  state.returnToMenu(); state.openSetup(); state.returnToMenu();
  assert.deepEqual(state.snapshot().expedition, saved);
});
check('Settings survive menu, credits, setup and survey routes', () => {
  state.open('settings'); state.setVolume(24); state.setReducedMotion(true);
  state.returnToMenu(); state.open('credits'); state.returnToMenu(); state.openSetup();
  state.start(); assert.deepEqual(state.snapshot().settings, {volume:24,reduceMotion:true});
  assert.equal(state.snapshot().expedition.difficulty, 'standard');
});
check('Volume clamps safely and rejects nonnumeric input', () => {
  state.setVolume(-9); assert.equal(state.snapshot().settings.volume, 0);
  state.setVolume(120); assert.equal(state.snapshot().settings.volume, 100);
  assert.equal(state.setVolume('abc'), false); assert.equal(state.snapshot().settings.volume, 100);
});
check('New page session is independent', () => {
  assert.equal(createSession().snapshot().expedition, null);
  assert.equal(createSession().snapshot().settings.volume, 70);
});

// Minimal event-wiring test double. This is not a browser or layout test.
class Classes {
  constructor(initial='') { this.values = new Set(initial.split(/\s+/).filter(Boolean)); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  contains(value) { return this.values.has(value); }
  toggle(value, force) { const enabled=force===undefined?!this.contains(value):force; enabled?this.add(value):this.remove(value); return enabled; }
}
class Element {
  constructor(id, attrs='') {
    this.id=id; this.listeners={}; this.dataset={}; this.textContent='';
    this.hidden=/\bhidden\b/.test(attrs); this.disabled=/\bdisabled\b/.test(attrs); this.checked=/\bchecked\b/.test(attrs);
    this.value=(attrs.match(/\bvalue="([^"]*)"/)||[])[1]||'';
    this.classList=new Classes((attrs.match(/\bclass="([^"]*)"/)||[])[1]||'');
    this.style={values:{},setProperty(name,value){this.values[name]=value;}};
    this.attributes={};
  }
  addEventListener(event,callback) { (this.listeners[event] ||= []).push(callback); }
  setAttribute(name,value) { this.attributes[name]=value; }
  emit(type, event={}) { if(type==='click'&&this.disabled)return; (this.listeners[type]||[]).forEach(callback=>callback(event)); }
  focus() { document.activeElement=this; this.emit('focus'); }
}
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const elements={};
for (const match of html.matchAll(/<[a-z][^>]*\bid="([^"]+)"[^>]*>/g)) elements[match[1]]=new Element(match[1],match[0]);
const menu=['new-expedition','continue-expedition','open-settings','open-credits'].map(id=>elements[id]);
const radios=['difficulty-story','difficulty-standard'].map(id=>elements[id]);
const document={
  body:new Element('body'), activeElement:null, listeners:{},
  getElementById(id){assert.ok(elements[id],'Missing DOM element '+id);return elements[id];},
  querySelectorAll(selector){if(selector==='#main-menu .command')return menu;if(selector==='input[name="difficulty"]')return radios;throw new Error('Unexpected selector '+selector);},
  addEventListener(event,callback){(this.listeners[event] ||= []).push(callback);},
  emit(type,event){(this.listeners[type]||[]).forEach(callback=>callback(event));}
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'app.js'),'utf8'),{document,setTimeout(){return 1;},clearTimeout(){}},{filename:'app.js'});
const click=id=>elements[id].emit('click');
const escape=()=>document.emit('keydown',{key:'Escape',preventDefault(){}});
const current=()=>document.body.dataset.view;
check('DOM initial render hides secondary views and disables Continue', () => {
  assert.equal(current(),'main');assert.equal(elements['continue-expedition'].disabled,true);
  assert.equal(elements['continue-reason'].textContent,'No saved expedition');
  assert.equal(elements['main-view'].hidden,false);
  for(const name of ['setup','settings','credits','survey'])assert.equal(elements[name+'-view'].hidden,true);
});
check('New expedition focuses Standard; Back returns focus with no save', () => {
  click('new-expedition');assert.equal(current(),'setup');assert.equal(document.activeElement.id,'difficulty-standard');
  click('setup-back');assert.equal(current(),'main');assert.equal(document.activeElement.id,'new-expedition');
  assert.equal(elements['continue-expedition'].disabled,true);
});
check('Settings input and Escape retain volume and Reduce motion', () => {
  click('open-settings');assert.equal(document.activeElement.id,'master-volume');
  elements['master-volume'].value='32';elements['master-volume'].emit('input');
  elements['reduce-motion'].checked=true;elements['reduce-motion'].emit('change');escape();
  assert.equal(current(),'main');assert.equal(document.activeElement.id,'open-settings');
  click('open-settings');assert.equal(elements['master-volume'].value,'32');assert.equal(elements['volume-value'].textContent,'32%');
  assert.equal(elements['reduce-motion'].checked,true);assert.equal(document.body.classList.contains('reduce-motion'),true);
  click('settings-back');assert.equal(elements['continue-expedition'].disabled,true);
});
check('Credits Close and Escape return to their invoking command', () => {
  click('open-credits');assert.equal(current(),'credits');assert.equal(document.activeElement.id,'credits-heading');
  click('credits-close');assert.equal(document.activeElement.id,'open-credits');
  click('open-credits');escape();assert.equal(current(),'main');assert.equal(document.activeElement.id,'open-credits');
});
check('DOM Story start shows the selected difficulty and objective', () => {
  click('new-expedition');elements['difficulty-standard'].checked=false;elements['difficulty-story'].checked=true;elements['difficulty-story'].emit('change');
  click('start-expedition');assert.equal(current(),'survey');assert.equal(document.activeElement.id,'survey-heading');
  assert.equal(elements['survey-difficulty'].textContent,'Story');assert.equal(elements['scan-signal'].disabled,false);
  assert.equal(elements['objective-title'].textContent,'Scan the station signal');
});
check('Return enables Continue; scan result resumes without losing settings', () => {
  click('scan-signal');assert.equal(elements['objective-title'].textContent,'Station signal recorded');
  assert.equal(elements['scan-signal'].disabled,true);click('return-menu');assert.equal(current(),'main');
  assert.equal(elements['continue-expedition'].disabled,false);assert.equal(document.activeElement.id,'continue-expedition');
  assert.match(elements['continue-reason'].textContent,/Story/);click('continue-expedition');
  assert.equal(current(),'survey');assert.equal(elements['survey-difficulty'].textContent,'Story');
  assert.equal(elements['objective-title'].textContent,'Station signal recorded');assert.equal(elements['master-volume'].value,'32');
});
check('Survey Escape holds the same expedition', () => {
  escape();assert.equal(current(),'main');click('continue-expedition');assert.equal(elements['objective-title'].textContent,'Station signal recorded');escape();
});
check('Canceling fresh setup preserves the existing Story save', () => {
  click('new-expedition');assert.equal(elements['difficulty-standard'].checked,true);escape();click('continue-expedition');
  assert.equal(elements['survey-difficulty'].textContent,'Story');assert.equal(elements['scan-signal'].disabled,true);escape();
});
check('Keyboard menu navigation wraps and marks its active command', () => {
  elements['new-expedition'].focus();elements['main-menu'].emit('keydown',{key:'ArrowUp',preventDefault(){}});
  assert.equal(document.activeElement.id,'open-credits');assert.equal(elements['open-credits'].classList.contains('is-selected'),true);
  elements['main-menu'].emit('keydown',{key:'Home',preventDefault(){}});assert.equal(document.activeElement.id,'new-expedition');
  elements['main-menu'].emit('keydown',{key:'ArrowDown',preventDefault(){}});assert.equal(document.activeElement.id,'continue-expedition');
});
check('Escape on main does not start or discard the expedition', () => {
  escape();assert.equal(current(),'main');assert.equal(elements['continue-expedition'].disabled,false);
});
check('Source has no external services, audio, or persistent storage calls', () => {
  const source=html+fs.readFileSync(path.join(__dirname,'styles.css'),'utf8')+fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
  assert.equal(/https?:\/\//.test(source),false);assert.equal(/<audio|new Audio|localStorage|sessionStorage|fetch\(/.test(source),false);
});
console.log('\n'+checks+' checks passed. Event tests use a DOM double; native browser and visual behavior remain unrun.');
