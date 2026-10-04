'use strict';
/* App-level event/renderer regression using a minimal DOM-shaped harness.
   Executes actual app.js + model.js. This is not a browser or visual audit. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const fixture = require('./fixture.js');
const model = require('./model.js');

function attributes(source) {
  const result = {};
  for (const match of source.matchAll(/([\w:-]+)(?:="([^"]*)"|='([^']*)')?/g)) result[match[1]] = (match[2] ?? match[3] ?? '');
  return result;
}
class Element {
  constructor(document, tag, attrs = {}, parent = null) {
    this.document = document; this.tagName = tag.toUpperCase(); this.attrs = attrs; this.parentElement = parent;
    this.dataset = {}; this.listeners = {}; this.children = []; this._html = ''; this.renderCount = 0;
    for (const [key,value] of Object.entries(attrs)) if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase())] = value;
    this.id = attrs.id; this.type = attrs.type || ''; this.value = attrs.value || '';
    this.disabled = Object.hasOwn(attrs,'disabled'); this.hidden = Object.hasOwn(attrs,'hidden'); this.open = Object.hasOwn(attrs,'open');
    this.checked = Object.hasOwn(attrs,'checked'); this.selectionStart = this.type === 'text' ? this.value.length : null; this.selectionEnd = this.selectionStart;
    this.classList = {add:()=>{}};
  }
  set innerHTML(html) {
    this._html = html; this.renderCount++;
    if (this.id === 'screen') {
      for (const element of this.children) this.document.removeTree(element);
      this.children = [];
      this.document.parse(html, this);
    }
  }
  get innerHTML() { return this._html; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  setAttribute(name,value) { this.attrs[name] = String(value); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  matches(selector) {
    if (selector.startsWith('.')) return (this.attrs.class || '').split(/\s+/).includes(selector.slice(1));
    if (selector.startsWith('[')) {
      const match = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
      return match && Object.hasOwn(this.attrs,match[1]) && (match[2] === undefined || this.attrs[match[1]] === match[2]);
    }
    return this.tagName.toLowerCase() === selector;
  }
  closest(selector) { let node = this; while (node) { if (node.matches(selector)) return node; node = node.parentElement; } return null; }
  querySelector(selector) {
    const parts = selector.split(/\s+/);
    return this.document.all().find(node => {
      if (!node.matches(parts.at(-1))) return false;
      if (!this.contains(node)) return false;
      return parts.length === 1 || Boolean(node.parentElement?.closest(parts[0]));
    }) || null;
  }
  contains(node) { while (node) { if (node === this) return true; node = node.parentElement; } return false; }
  focus() { this.document.activeElement = this; }
  setSelectionRange(start,end) { this.selectionStart = start; this.selectionEnd = end; }
  scrollIntoView() { this.scrolled = true; }
}
class Document {
  constructor() { this.ids = new Map(); this.listeners = {}; this.nodes = new Set(); this.body = new Element(this,'body'); this.nodes.add(this.body); this.activeElement = this.body; }
  all() { return [...this.nodes]; }
  removeTree(node) { for (const child of node.children) this.removeTree(child); if (node.id) this.ids.delete(node.id); this.nodes.delete(node); if (this.activeElement === node) this.activeElement = this.body; }
  parse(html,parent) {
    const stack = [parent];
    const voidTags = new Set(['input','meta','link','br','hr','img']);
    for (const token of html.matchAll(/<\/?[A-Za-z][^>]*>/g)) {
      const raw = token[0];
      const closing = /^<\//.test(raw); const tag = raw.match(/^<\/?([A-Za-z][\w-]*)/)[1].toLowerCase();
      if (closing) { for (let i=stack.length-1;i>0;i--) if (stack[i].tagName.toLowerCase() === tag) { stack.length = i; break; } continue; }
      const attrs = attributes(raw.slice(raw.indexOf(tag)+tag.length,-1));
      const element = new Element(this,tag,attrs,stack.at(-1));
      stack.at(-1).children.push(element); this.nodes.add(element); if(element.id) this.ids.set(element.id,element);
      if (!voidTags.has(tag) && !raw.endsWith('/>')) stack.push(element);
    }
  }
  getElementById(id) { return this.ids.get(id) || null; }
  querySelectorAll(selector) { return this.all().filter(node=>node.matches(selector)); }
  addEventListener(type,fn) { (this.listeners[type] ||= []).push(fn); }
  dispatch(type,target,extra={}) {
    const event = {type,target,...extra};
    for(const fn of target.listeners[type] || []) fn(event);
    for(const fn of this.listeners[type] || []) fn(event);
  }
}
function boot(search = '?view=after&screen=selection', transformSource = source => source) {
  const document = new Document(); document.parse(fs.readFileSync(path.join(__dirname,'index.html'),'utf8'),document.body);
  const windowListeners = {};
  const history = {entries:[], replaceState(state){this.entries[this.entries.length ? this.entries.length-1 : 0] = state;}, pushState(state){this.entries.push(state);}};
  const context = {document, BOOKING_FIXTURE:fixture, BookingModel:model, URLSearchParams, location:{search,href:'http://localhost:8765/'+search}, history, setTimeout, clearTimeout, console, TextEncoder, crypto:require('node:crypto').webcrypto, addEventListener(type,fn){(windowListeners[type] ||= []).push(fn);}};
  context.window = context; vm.createContext(context); vm.runInContext(transformSource(fs.readFileSync(path.join(__dirname,'app.js'),'utf8')),context,{filename:'app.js'});
  return {document,context,root:document.getElementById('screen'),history,windowListeners};
}
function find(env, attrs) { return env.document.all().find(node => Object.entries(attrs).every(([key,value])=>node.attrs[key] === value)); }
function click(env, attrs) { const node = find(env,attrs); assert.ok(node,'button exists: '+JSON.stringify(attrs)); node.focus(); env.document.dispatch('click',node); }
function input(env,id,value,extra={}) { const node = env.document.getElementById(id); assert.ok(node,'input exists: '+id); node.focus(); node.value = value; if(node.type === 'text') node.setSelectionRange(value.length,value.length); env.document.dispatch('input',node,extra); }
const results=[];
async function test(name,fn){try{await fn();results.push({name,status:'passed'});console.log('PASS',name);}catch(error){results.push({name,status:'failed',error:error.message});console.error('FAIL',name,error);process.exitCode=1;}}
(async()=>{
  await test('Negative control reproduces the browser defect when subscription is removed',()=>{
    const env=boot('?view=after&screen=selection',source=>source.replace(/  store\.subscribe\(state => \{\n[\s\S]*?\n  \}\);\n/,''));
    const before=env.root.renderCount; click(env,{'data-date':'2026-10-16'});
    assert.equal(env.context.bookingDemo.getState().draft.date,'2026-10-16');
    assert.equal(env.root.renderCount,before);
    assert.ok(!env.root.innerHTML.includes('예약 가능한 시간이 없습니다'));
    assert.equal(find(env,{'data-date':'2026-10-15'}).getAttribute('aria-pressed'),'true');
  });
  await test('Actual app date click rerenders empty day and next-day recovery',()=>{
    const env=boot(); const initialCount=env.root.renderCount;
    click(env,{'data-date':'2026-10-16'});
    assert.equal(env.context.bookingDemo.getState().draft.date,'2026-10-16');
    assert.ok(env.root.innerHTML.includes('예약 가능한 시간이 없습니다'));
    assert.ok(env.root.innerHTML.includes('2026-10-19'));
    assert.equal(find(env,{'data-date':'2026-10-16'}).getAttribute('aria-pressed'),'true');
    assert.equal(env.root.renderCount,initialCount+1);
    click(env,{'data-date':'2026-10-19'});
    assert.ok(!env.root.innerHTML.includes('예약 가능한 시간이 없습니다'));
    assert.ok(env.root.innerHTML.includes('10:00'));
  });
  await test('Actual app selection → review → Back rerenders and preserves values',()=>{
    const env=boot(); click(env,{'data-action':'edit-details'});
    input(env,'after-meeting_name','보존된 팀 회의'); input(env,'after-headcount','5');
    click(env,{'data-time':'11:00'}); click(env,{'data-action':'review'});
    assert.equal(env.context.bookingDemo.getState().phase,'review');
    assert.ok(env.root.innerHTML.includes('변경 내용 확인'));
    assert.ok(env.root.innerHTML.includes('26,000원 · 변경 확정(데모)'));
    assert.ok(env.root.innerHTML.includes('보존된 팀 회의 · 5명'));
    click(env,{'data-action':'back'});
    assert.equal(env.context.bookingDemo.getState().phase,'selection');
    assert.ok(env.root.innerHTML.includes('예약 시간 변경'));
    assert.equal(env.document.getElementById('after-meeting_name').value,'보존된 팀 회의');
    assert.equal(env.document.getElementById('after-headcount').value,'5');
    assert.equal(find(env,{'data-time':'11:00'}).getAttribute('aria-pressed'),'true');
  });
  await test('Actual app error correction clears old DOM error and summary without double render',()=>{
    const env=boot(); click(env,{'data-action':'edit-details'}); input(env,'after-headcount','7');
    const before=env.root.renderCount; click(env,{'data-action':'review'});
    assert.equal(env.root.renderCount,before+1); // no duplicate focusField render
    assert.ok(env.root.innerHTML.includes('인원은 1~6명으로 입력해 주세요'));
    assert.equal(env.document.activeElement.id,'after-headcount');
    input(env,'after-headcount','4');
    assert.ok(!env.root.innerHTML.includes('인원은 1~6명으로 입력해 주세요'));
    assert.equal(env.document.getElementById('after-headcount').getAttribute('aria-invalid'),null);
    click(env,{'data-action':'review'}); assert.equal(env.context.bookingDemo.getState().phase,'review');
  });
  await test('Actual app render subscription preserves text focus and caret',()=>{
    const env=boot(); click(env,{'data-action':'edit-details'});
    const node=env.document.getElementById('after-meeting_name'); node.focus(); node.value='회의 정보 보존'; node.setSelectionRange(3,3);
    env.document.dispatch('input',node);
    assert.equal(env.document.activeElement.id,'after-meeting_name');
    assert.equal(env.document.activeElement.selectionStart,3); assert.equal(env.document.activeElement.selectionEnd,3);
    assert.equal(env.document.activeElement.value,'회의 정보 보존');
  });
  await test('Actual app Korean composition keeps input node until one committed render',()=>{
    const env=boot(); click(env,{'data-action':'edit-details'});
    const node=env.document.getElementById('after-meeting_name'); node.focus();
    const before=env.root.renderCount; env.document.dispatch('compositionstart',node);
    for(const value of ['ㅎ','한','한국어 회의']){node.value=value;node.setSelectionRange(value.length,value.length);env.document.dispatch('input',node,{isComposing:true});assert.equal(env.document.getElementById('after-meeting_name'),node);}
    assert.equal(env.root.renderCount,before);
    env.document.dispatch('compositionend',node);
    assert.equal(env.root.renderCount,before+1);
    assert.equal(env.document.activeElement.value,'한국어 회의');
    // Browsers may send a final non-composing input with the same committed value.
    env.document.dispatch('input',env.document.activeElement,{isComposing:false});
    assert.equal(env.root.renderCount,before+1);
    assert.equal(env.context.bookingDemo.getState().details.meeting_name,'한국어 회의');
  });
  await test('Actual app checkbox → pending → conflict renders every store transition',async()=>{
    const env=boot(); const stale=env.document.getElementById('stale-toggle'); stale.checked=true; env.document.dispatch('change',stale);
    click(env,{'data-action':'review'}); click(env,{'data-action':'confirm'});
    assert.equal(env.context.bookingDemo.getState().phase,'confirming');
    assert.ok(env.root.innerHTML.includes('가상 변경 처리 중…'));
    assert.equal(find(env,{'data-action':'confirm'}).disabled,true);
    await new Promise(resolve=>setTimeout(resolve,1000));
    assert.equal(env.context.bookingDemo.getState().phase,'conflict');
    assert.ok(env.root.innerHTML.includes('14:00은 방금 예약되어 선택할 수 없습니다'));
    assert.ok(env.root.innerHTML.includes('15:00 선택'));
    assert.equal(find(env,{'data-time':'14:00'}).disabled,true);
    assert.equal(env.context.bookingDemo.getState().existingBooking.start,'10:00');
    click(env,{'data-time':'15:00'}); assert.equal(find(env,{'data-time':'15:00'}).getAttribute('aria-pressed'),'true');
    click(env,{'data-action':'review'}); click(env,{'data-action':'confirm'});
    await new Promise(resolve=>setTimeout(resolve,1000));
    assert.equal(env.context.bookingDemo.getState().phase,'success');
    assert.ok(env.root.innerHTML.includes('가상 변경 완료')); assert.ok(env.root.innerHTML.includes('15:00–16:00'));
  });
  const report={fixture_id:fixture.fixture_id,method:'Actual app.js and model.js executed in Node VM with DOM-shaped event harness; no browser engine',total:results.length,passed:results.filter(r=>r.status==='passed').length,failed:results.filter(r=>r.status==='failed').length,results,browser_runtime:'not represented by this test',rendered_visual:'not represented by this test',manual_keyboard:'not represented by this test'};
  fs.writeFileSync(path.join(__dirname,'app-wiring-test-results.json'),JSON.stringify(report,null,2)+'\n');
  console.log('\n'+report.passed+'/'+report.total+' app-wiring regressions passed. Actual browser QA remains separate.');
})();
