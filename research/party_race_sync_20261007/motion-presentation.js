// Display-only poses. Never feed these positions back into physics or input replay.
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const position=(out,p)=>{out.x=p.x;out.y=p.y;out.z=p.z;return out;};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const lerp=(a,b,t)=>a+(b-a)*t;
const angle=p=>p.facing?Math.atan2(...p.facing):0;
const angleLerp=(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;

export function createLocalMotion(){
 let previous=null,current=null,lastAlpha=1;
 const reset=p=>{previous=position({},p);current=position({},p);};
 return {
  clear(){previous=current=null;},
  reset,
  push(p){if(!current){reset(p);return;}position(previous,current);position(current,p);},
  // Shift both endpoints on a small reconcile. Keeping their separation avoids
  // destroying the current interpolation on every authoritative packet.
  correct(p){if(!current){reset(p);return;}previous.x+=p.x-current.x;previous.y+=p.y-current.y;previous.z+=p.z-current.z;position(current,p);},
  settle(){if(current)position(previous,current);},
  sample(alpha,out){if(!current)return false;lastAlpha=clamp(alpha,0,1);out.x=lerp(previous.x,current.x,lastAlpha);out.y=lerp(previous.y,current.y,lastAlpha);out.z=lerp(previous.z,current.z,lastAlpha);return true;},
  snapshot(){return {alpha:lastAlpha,previous:previous&&{...previous},current:current&&{...current}};}
 };
}

export function createRemoteMotion({step=1/30,minDelay=.05,maxDelay=.15,maxSamples=32,snapDistance=12}={}){
 let key=null,latestTime=0,latestReceived=0,previousReceived=null,interval=step,jitter=0,cursor=null,lastFrame=null,playing=false;
 let resets=0,interpolated=0,holds=0;
 const tracks=new Map();
 const clear=()=>{tracks.clear();key=null;cursor=lastFrame=null;previousReceived=null;interval=step;jitter=0;};
 const delay=()=>clamp(interval*2+jitter*2,minDelay,maxDelay);
 return {
  clear,
  receive(state,now){
   const nextKey=`${state.round}:${state.map.id}:${state.seed}:${state.phase}`,t=state.elapsed;
   if(!Number.isFinite(t)||!Number.isFinite(now))return;
   if(key!==nextKey){clear();key=nextKey;resets++;}
   if(previousReceived!==null&&t<latestTime)return; // obsolete packet cannot rewind display
   if(previousReceived!==null&&t>latestTime){
    const serverDelta=t-latestTime,arrivalDelta=(now-previousReceived)/1000;
    // Long outages are not a new normal send rate. Keep the delay bounded.
    if(serverDelta<=.25&&arrivalDelta>=0&&arrivalDelta<=.5){interval=lerp(interval,serverDelta,.1);jitter=lerp(jitter,Math.abs(arrivalDelta-serverDelta),.1);}
   }
   latestTime=t;latestReceived=now;previousReceived=now;playing=state.phase==='playing';
   const present=new Set();
   for(const p of state.players){
    present.add(p.id);
    let track=tracks.get(p.id);if(!track){track={samples:[],display:{}};tracks.set(p.id,track);}
    const list=track.samples,last=list.at(-1);
    const sample={t,x:p.x,y:p.y,z:p.z,angle:angle(p),grounded:p.grounded,vy:p.vy||0,active:p.active,qualified:p.qualified,connected:p.connected};
    const discontinuity=last&&(distance(last,sample)>snapDistance||last.active!==sample.active||last.qualified!==sample.qualified||last.connected!==sample.connected);
    if(discontinuity){list.length=0;resets++;}
    if(list.at(-1)?.t===t)list[list.length-1]=sample;else list.push(sample);
    if(list.length>maxSamples)list.splice(0,list.length-maxSamples);
   }
   for(const id of tracks.keys())if(!present.has(id))tracks.delete(id);
  },
  frame(now){
   if(previousReceived===null)return;
   if(!playing){cursor=latestTime;lastFrame=now;return;}
   const target=latestTime+clamp((now-latestReceived)/1000,0,maxDelay)-delay();
   if(cursor===null)cursor=target;
   else {
    const dt=clamp((now-lastFrame)/1000,0,.1),error=target-(cursor+dt);
    // A monotonic playout clock: packet-arrival jitter changes its rate slightly,
    // not its position. Never extrapolate past the newest authoritative sample.
    cursor=Math.min(latestTime,cursor+dt*clamp(1+error*4,.8,1.2));
   }
   lastFrame=now;
  },
  sample(id,out){
   const track=tracks.get(id);if(!track)return null;
   const list=track.samples,display=track.display;
   const at=playing?cursor:latestTime;
   let a=list[0],b=a,alpha=0;
   if(at>=list.at(-1).t){a=b=list.at(-1);holds++;}
   else if(at>a.t){for(let i=1;i<list.length;i++)if(list[i].t>=at){a=list[i-1];b=list[i];alpha=clamp((at-a.t)/(b.t-a.t),0,1);interpolated++;break;}}
   else holds++;
   out.x=lerp(a.x,b.x,alpha);out.y=lerp(a.y,b.y,alpha);out.z=lerp(a.z,b.z,alpha);
   display.angle=angleLerp(a.angle,b.angle,alpha);display.grounded=a===b?a.grounded:a.grounded&&b.grounded;display.vy=lerp(a.vy,b.vy,alpha);
   return display;
  },
  snapshot(){return {delayMs:delay()*1000,cursorMs:cursor===null?null:cursor*1000,players:tracks.size,samples:[...tracks.values()].reduce((n,t)=>n+t.samples.length,0),interpolated,holds,resets};}
 };
}
