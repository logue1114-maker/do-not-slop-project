import {readFile} from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=await readFile(new URL('./motion-presentation.js',import.meta.url),'utf8');
const {createLocalMotion,createRemoteMotion}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const player=(x=0,extra={})=>({id:'a',x,y:0,z:0,facing:[0,1],vy:0,grounded:true,active:true,qualified:false,connected:true,...extra});
const state=(t,p=player(),extra={})=>({elapsed:t,phase:'playing',round:0,map:{id:'port'},seed:1,players:[p],...extra});
const make=()=>createRemoteMotion({minDelay:.05,maxDelay:.05});

test('local fixed-tick poses interpolate without mutating physics',()=>{
 const m=createLocalMotion(),p={x:0,y:0,z:0};m.reset(p);p.x=.25;m.push(p);const out={};
 for(const alpha of [0,.25,.5,.75,1]){m.sample(alpha,out);close(out.x,.25*alpha);}
 assert.deepEqual(p,{x:.25,y:0,z:0});
});
test('small reconcile translates both endpoints; settle prevents repeated backwards motion when prediction pauses',()=>{
 const m=createLocalMotion(),out={};m.reset(player());m.push(player(.25));m.correct(player(.35));m.sample(.5,out);close(out.x,.225);
 m.settle();for(const a of [0,.2,.9]){m.sample(a,out);close(out.x,.35);}
});
test('local reset and clear do not carry old stage positions',()=>{
 const m=createLocalMotion(),out={};m.reset(player());m.push(player(1));m.reset(player(80));m.sample(0,out);assert.equal(out.x,80);m.clear();assert.equal(m.sample(.5,out),false);
});
test('remote interpolates timestamps instead of easing toward the latest target',()=>{
 const m=make(),out={};m.receive(state(0),0);m.receive(state(.1,player(1)),100);m.frame(100);m.sample('a',out);close(out.x,.5);
 // The display clock advances even without another packet.
 m.frame(125);m.sample('a',out);close(out.x,.75);assert.equal(m.snapshot().interpolated,2);
});
test('irregular arrivals cannot move a forward-only trajectory backwards',()=>{
 const m=createRemoteMotion(),out={},xs=[];m.receive(state(0),0);m.frame(0);
 for(let now=10;now<=500;now+=10){if(now===80)m.receive(state(.1,player(1)),now);if(now===220)m.receive(state(.2,player(2)),now);if(now===230)m.receive(state(.3,player(3)),now);if(now===440)m.receive(state(.4,player(4)),now);m.frame(now);m.sample('a',out);xs.push(out.x);}
 assert.ok(xs.every((x,i)=>!i||x>=xs[i-1]));assert.ok(xs.at(-1)<=4);assert.ok(m.snapshot().delayMs>=50&&m.snapshot().delayMs<=150);
});
test('packet loss holds newest position instead of inventing movement through walls',()=>{
 const m=make(),out={};m.receive(state(0),0);m.receive(state(.1,player(1)),100);
 for(let now=100;now<=10000;now+=16){m.frame(now);m.sample('a',out);assert.ok(out.x<=1);}
 close(out.x,1);assert.ok(m.snapshot().holds>0);
});
test('phase/map/seed/round boundaries reset history, obsolete packets do not rewind it',()=>{
 for(const extra of [{phase:'lobby'},{map:{id:'tiles'}},{seed:2},{round:1}]){
  const m=make(),out={};m.receive(state(1,player(1)),1000);m.receive(state(1.1,player(2)),1100);m.frame(1100);
  m.receive(state(0,player(90),extra),1200);m.frame(1200);m.sample('a',out);assert.equal(out.x,90);assert.equal(m.snapshot().samples,1);
 }
 const m=make(),out={};m.receive(state(2,player(2)),2000);m.receive(state(1,player(1)),2100);m.frame(2100);m.sample('a',out);assert.equal(out.x,2);
});
test('teleport, reconnect, elimination and qualification never glide across old positions',()=>{
 for(const p of [player(80),player(1,{connected:false}),player(1,{active:false}),player(1,{qualified:true})]){
  const m=make(),out={};m.receive(state(0),0);m.receive(state(.1,p),100);m.frame(100);m.sample('a',out);assert.equal(out.x,p.x);assert.equal(m.snapshot().samples,1);
 }
});
test('facing follows shortest angular arc, not a full spin',()=>{
 const m=make(),out={};m.receive(state(0,player(0,{facing:[Math.sin(3),Math.cos(3)]})),0);m.receive(state(.1,player(1,{facing:[Math.sin(-3),Math.cos(-3)]})),100);m.frame(100);const p=m.sample('a',out);close(p.angle,Math.PI);
});
test('history is bounded and departed players are removed; source snapshots are untouched',()=>{
 const m=make(),s=state(0);m.receive(s,0);const original=JSON.stringify(s);
 for(let i=1;i<100;i++)m.receive(state(i/30,player(i/30)),i*1000/30);
 assert.equal(m.snapshot().samples,32);assert.equal(JSON.stringify(s),original);
 m.receive(state(4,player(),{players:[]}),4000);assert.equal(m.snapshot().players,0);m.clear();assert.equal(m.snapshot().cursorMs,null);
});
