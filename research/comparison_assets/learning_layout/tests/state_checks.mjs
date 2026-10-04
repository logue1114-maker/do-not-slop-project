import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const base=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html=readFileSync(path.join(base,'same_fixture_learning.html'),'utf8');
const fixtureText=html.match(/<script id="fixture-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
const appCode=html.match(/<script id="learning-app">([\s\S]*?)<\/script>/)[1];
const fixture=JSON.parse(fixtureText), canonical=JSON.parse(readFileSync(path.join(base,'fixture.json'),'utf8'));
const norm=x=>JSON.parse(JSON.stringify(x));
const results=[], snapshots=[], listeners={}, scrollCalls=[];
const elements={
 'fixture-data':{textContent:fixtureText}, 'before-root':{innerHTML:''},'after-root':{innerHTML:''},
 'sync-status':{textContent:''},'case-select':{value:'baseline'}
};
const viewControls=['before','after'].map(view=>({dataset:{view},attributes:{},setAttribute(k,v){this.attributes[k]=v;}}));
const document={
 activeElement:null,body:{dataset:{}},
 getElementById(id){if(elements[id])return elements[id];if(id.endsWith('-lesson-workspace')&&Object.values(elements).some(e=>e.innerHTML?.includes(`id="${id}"`)))return {scrollIntoView(options){scrollCalls.push({id,options});}};return null;},
 querySelectorAll(selector){assert.equal(selector,'[data-command="VIEW"]');return viewControls;},
 querySelector(){return null;},
 addEventListener(name,callback){(listeners[name]??=[]).push(callback);}
};
const context=vm.createContext({document,window:{matchMedia(){return {matches:true};}}});
vm.runInContext(appCode,context,{filename:'same_fixture_learning.html#learning-app'});
const api=context.__learningComparison;
function test(name,fn){try{fn();results.push({name,status:'pass'});}catch(error){results.push({name,status:'fail',detail:error.message});}}
function capture(name){snapshots.push({name,caseId:api.getState().caseId,before:elements['before-root'].innerHTML,after:elements['after-root'].innerHTML,state:norm(api.getState())});}
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
function attrs(tag){const data={};for(const m of tag.matchAll(/([\w-]+)="([^"]*)"/g))data[m[1]]=decode(m[2]);return data;}
function buttonFor(view,command,courseId){
 const markup=view?elements[`${view}-root`].innerHTML:html;
 const tag=[...markup.matchAll(/<button\b[^>]*>/g)].map(m=>m[0]).find(tag=>{const a=attrs(tag);return a['data-command']===command&&(!courseId||a['data-course']===courseId);});
 assert.ok(tag,`Rendered ${command} button exists in ${view??'toolbar'}`);
 const a=attrs(tag);return {disabled:/\sdisabled(?:[\s>]|=)/.test(tag),dataset:{command:a['data-command'],course:a['data-course'],case:a['data-case'],view:a['data-view'],focusKey:a['data-focus-key']},closest(selector){if(selector==='.panel')return view?{classList:{contains:k=>k===view}}:null;throw new Error(`Unexpected closest ${selector}`);}};
}
function click(view,command,courseId){const button=buttonFor(view,command,courseId);const event={target:{closest(selector){assert.equal(selector,'button[data-command]');return button;}}};for(const fn of listeners.click)fn(event);}
function choose(view,value){
 const tag=[...elements[`${view}-root`].innerHTML.matchAll(/<input\b[^>]*>/g)].map(m=>m[0]).find(tag=>attrs(tag).value===String(value));assert.ok(tag,'Rendered answer exists');const a=attrs(tag);
 const target={id:a.id,value:a.value,matches(selector){assert.equal(selector,'input[data-command="ANSWER"]');return true;}};
 for(const fn of listeners.change)fn({target});
}
function setCase(caseId){for(const fn of listeners.change)fn({target:{id:'case-select',value:caseId}});}
function state(){return norm(api.getState());}
test('fixture inline JSON exactly matches fixture.json',()=>assert.deepEqual(fixture,canonical));
test('fixture has the same three unique course records',()=>{assert.equal(fixture.courses.length,3);assert.equal(new Set(fixture.courses.map(c=>c.id)).size,3);});
test('user approval is pending and identity is constructed comparison',()=>{assert.equal(api.getFixture().userApprovalStatus,'pending');assert.equal(api.getFixture().identity,'own_constructed_comparison');});
test('fixture and nested courses are immutable',()=>{assert.equal(Object.isFrozen(api.getFixture()),true);assert.equal(Object.isFrozen(api.getFixture().courses[0].lessons[0]),true);});
test('baseline progress and current lesson come from one state',()=>{assert.deepEqual(state().completed,fixture.initialCompleted);assert.equal(api.courseSnapshot('observe').next.id,'o3');assert.equal(state().selectedCourseId,'observe');});capture('baseline');
test('clicking rendered BEFORE open button opens one shared next lesson',()=>{click('before','OPEN_COURSE','observe');assert.deepEqual(state().active,{courseId:'observe',lessonId:'o3'});assert.equal(scrollCalls.at(-1).id,'before-lesson-workspace');});capture('open_from_before');
test('completion is blocked before checkpoint confirmation',()=>{const before=state();assert.equal(api.dispatch('COMPLETE_LESSON'),false);assert.deepEqual(state(),before);assert.equal(buttonFor('before','COMPLETE_LESSON').disabled,true);});
test('no answer shows recovery text without changing progress',()=>{click('after','SUBMIT_ANSWER');assert.equal(state().feedback.kind,'error');assert.match(state().feedback.text,/답을 하나/);assert.equal(state().completed.observe.length,2);});capture('no_answer');
test('wrong answer from AFTER stays unfinished in both views',()=>{choose('after',2);click('after','SUBMIT_ANSWER');assert.equal(state().feedback.kind,'error');assert.equal(state().ready,false);assert.equal(state().completed.observe.length,2);});capture('wrong_answer');
test('correct answer from BEFORE enables completion in both views',()=>{choose('before',0);click('before','SUBMIT_ANSWER');assert.equal(state().ready,true);assert.equal(buttonFor('before','COMPLETE_LESSON').disabled,false);assert.equal(buttonFor('after','COMPLETE_LESSON').disabled,false);});capture('correct_answer');
test('changing a checked answer revokes completion permission',()=>{choose('after',1);assert.equal(state().ready,false);assert.equal(api.dispatch('COMPLETE_LESSON'),false);choose('before',0);click('before','SUBMIT_ANSWER');});
test('clicking BEFORE complete synchronizes progress and next lesson',()=>{click('before','COMPLETE_LESSON');assert.equal(state().completed.observe.length,3);assert.equal(state().active.lessonId,'o4');assert.equal(api.courseSnapshot('observe').percent,50);});capture('completed_from_before');
test('stale double completion cannot finish the next lesson',()=>{const done=state().completed.observe.length;assert.equal(api.dispatch('COMPLETE_LESSON'),false);assert.equal(state().completed.observe.length,done);});
test('clicking AFTER complete synchronizes next progress transition',()=>{choose('after',1);click('after','SUBMIT_ANSWER');click('after','COMPLETE_LESSON');assert.equal(state().completed.observe.length,4);assert.equal(state().active.lessonId,'o5');});capture('completed_from_after');
test('closing lesson preserves progress',()=>{click('before','CLOSE_LESSON');assert.equal(state().active,null);assert.equal(state().completed.observe.length,4);});capture('closed_lesson');
test('switching course from AFTER updates selected focus and shared lesson',()=>{click('after','OPEN_COURSE','words');assert.equal(state().selectedCourseId,'words');assert.deepEqual(state().active,{courseId:'words',lessonId:'w1'});assert.equal(scrollCalls.at(-1).id,'after-lesson-workspace');});capture('other_course_selected');
test('selected-case RESET restores baseline without changing mobile choice',()=>{api.dispatch('VIEW',{view:'before'});api.dispatch('RESET');assert.equal(state().mobileView,'before');assert.deepEqual(state().completed,fixture.initialCompleted);assert.equal(state().active,null);});capture('reset_baseline');
test('rendered mobile-view button click routes through shared event handler',()=>{click(null,'VIEW');assert.equal(document.body.dataset.mobileView,'before');});
test('mobile toggle updates shared view state and aria-pressed controls',()=>{api.dispatch('VIEW',{view:'after'});assert.equal(document.body.dataset.mobileView,'after');assert.equal(viewControls[0].attributes['aria-pressed'],'false');assert.equal(viewControls[1].attributes['aria-pressed'],'true');assert.equal(api.dispatch('VIEW',{view:'missing'}),false);});
test('empty case removes enrollment and lesson from both views',()=>{setCase('empty');assert.deepEqual(state().enrolled,[]);assert.equal(state().active,null);assert.equal(state().selectedCourseId,null);});capture('empty');
test('empty restoration from rendered BEFORE button restores identical fixture',()=>{click('before','CASE');assert.equal(state().caseId,'baseline');assert.equal(state().enrolled.length,3);assert.deepEqual(state().completed,fixture.initialCompleted);});capture('empty_restored');
test('all-completed case has 100% and no next unfinished lesson',()=>{setCase('completed');fixture.courses.forEach(c=>{assert.equal(api.courseSnapshot(c.id).percent,100);assert.equal(api.courseSnapshot(c.id).next,undefined);});});capture('all_completed');
test('completed course opens real first lesson for review',()=>{click('after','OPEN_COURSE','observe');assert.equal(state().active.lessonId,'o1');assert.match(elements['after-root'].innerHTML,/복습을 마쳐도 진행률은 바뀌지 않습니다/);});capture('review_open');
test('review completion never duplicates or removes finished progress',()=>{const done=state().completed;choose('before',1);click('before','SUBMIT_ANSWER');click('after','COMPLETE_LESSON');assert.deepEqual(state().completed,done);assert.equal(state().active,null);});capture('review_finished');
test('long Korean title changes the same field in both views',()=>{setCase('long_title');assert.equal(api.courseSnapshot('observe').title,fixture.longTitle);assert.deepEqual(state().completed,fixture.initialCompleted);});capture('long_korean_title');
test('long-title lesson also inherits the same shared title',()=>{click('before','OPEN_COURSE','observe');assert.ok(elements['before-root'].innerHTML.includes(fixture.longTitle));assert.ok(elements['after-root'].innerHTML.includes(fixture.longTitle));});capture('long_korean_lesson');
test('invalid course, command, case and answer payloads are rejected',()=>{const before=state();assert.equal(api.dispatch('OPEN_COURSE',{courseId:'unknown'}),false);assert.equal(api.dispatch('CASE',{caseId:'unknown'}),false);assert.equal(api.dispatch('ANSWER',{value:999}),false);assert.equal(api.dispatch('ANSWER',{value:NaN}),false);assert.equal(api.dispatch('UNKNOWN'),false);assert.deepEqual(state(),before);});
test('finishing a full course reaches terminal 100% without phantom next lesson',()=>{setCase('baseline');click('after','OPEN_COURSE','words');for(const lesson of fixture.courses.find(c=>c.id==='words').lessons){choose('after',lesson.correctIndex);click('before','SUBMIT_ANSWER');click('after','COMPLETE_LESSON');}assert.equal(api.courseSnapshot('words').percent,100);assert.equal(state().active,null);assert.equal(api.courseSnapshot('words').next,undefined);});capture('course_completed_end_to_end');
test('every fixture lesson has usable text, three choices and one valid answer',()=>{fixture.courses.forEach(c=>c.lessons.forEach(l=>{assert.equal(l.body.length,2);assert.equal(l.options.length,3);assert.ok(Number.isInteger(l.correctIndex)&&l.correctIndex>=0&&l.correctIndex<3);assert.ok(l.question.length>0&&l.explanation.length>0&&l.minutes>0);}));});
process.stdout.write(JSON.stringify({results,snapshots}));
process.exitCode=results.some(r=>r.status==='fail')?1:0;
