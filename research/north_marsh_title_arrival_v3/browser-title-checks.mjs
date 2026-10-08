import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {start,fresh,out} from './public-test-runtime.mjs';
const {server,browser,base}=await start();
const captures=[],checks=[],errors=[];
const style='#exit-play{visibility:hidden!important}'; // Workshop navigation stays functional; excluded from clean task captures only.
const snap=p=>p.evaluate(()=>window.menuPlacementSnapshot());
const settle=p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
async function shot(page,name,extra={}){
 await settle(page);
 const file=path.join(out,name+'.png');
 await page.locator('#stage-a').screenshot({path:file,style,animations:'disabled',...extra});
 const bytes=fs.readFileSync(file);
 captures.push({file:name+'.png',pixels:[bytes.readUInt32BE(16),bytes.readUInt32BE(20)],sha256:crypto.createHash('sha256').update(bytes).digest('hex'),snapshot:await snap(page),capture:'actual Chromium rendering; no pixel retouch; teaching exit hidden only during screenshot'});
}
async function crop(page,name,box){
 const file=path.join(out,name+'.png');
 await page.screenshot({path:file,style,clip:box,animations:'disabled'});
 const bytes=fs.readFileSync(file);captures.push({file:name+'.png',pixels:[bytes.readUInt32BE(16),bytes.readUInt32BE(20)],clip:box,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),snapshot:await snap(page),capture:'native CSS-pixel crop; no scaling or retouch'});
}
async function check(name,fn){try{await fn();checks.push({name,status:'pass'});console.log('pass:',name);}catch(e){checks.push({name,status:'fail',detail:e.message});console.log('FAIL:',name,e.message);}}
const sameDataPairs=[];
try{
 for(const [profile,size] of [['desktop',{width:1440,height:900}],['portrait',{width:390,height:844}],['landscape',{width:844,height:390}]]){
  let oldState;
  for(const arm of ['before','after']){
   const {page,context}=await fresh(browser,base,arm,profile,size);page.on('pageerror',e=>errors.push(e.message));
   await shot(page,`${arm}-${profile}-default`);
   if(arm==='before')oldState=(await snap(page)).state;
   else{assert.deepEqual((await snap(page)).state,oldState);sameDataPairs.push({profile,viewport:size,before:'rejected 2.0.4',after:'unapproved 3.0.0',dataEqual:true});}
   await context.close();
  }
 }
 await check('title native actions, modal ownership and exact return focus',async()=>{
  const {page,context}=await fresh(browser,base,'after','desktop',{width:1440,height:900});
  try{
   assert.equal(await page.locator('.arrival-rail button').count(),3);
   await page.locator('#a-title-settings').click();await settle(page);
   assert.equal((await snap(page)).state.modal,'settings');assert.equal((await snap(page)).focus,'a-volume');
   assert.notEqual(await page.locator('.game-base').getAttribute('inert'),null);
   await shot(page,'after-desktop-settings');
   await page.keyboard.press('Shift+Tab');await settle(page);assert.equal((await snap(page)).focus,'a-close-settings');
   await page.keyboard.press('Tab');await settle(page);assert.equal((await snap(page)).focus,'a-volume');
   await page.keyboard.press('Escape');await settle(page);assert.equal((await snap(page)).focus,'a-title-settings');
   await shot(page,'after-desktop-settings-return-focus');
   await page.locator('#a-about').click();await settle(page);assert.equal((await snap(page)).focus,'a-close-about');
   await shot(page,'after-desktop-about');
   await page.locator('#a-close-about').click();await settle(page);assert.equal((await snap(page)).focus,'a-about');
   await shot(page,'after-desktop-about-return-focus');
   await page.keyboard.press('Tab');await page.locator('#a-enter').focus();await shot(page,'after-desktop-enter-focus');
   const b=await page.locator('#a-enter').boundingBox();await crop(page,'primary-focus-native',{x:Math.floor(b.x-14),y:Math.floor(b.y-14),width:Math.ceil(b.width+28),height:Math.ceil(b.height+28)});
  }finally{await context.close();}
 });
 await check('actual pointer down, drag-off face restore, canceled release, accepted release',async()=>{
  const {page,context}=await fresh(browser,base,'after','desktop',{width:1440,height:900});
  try{
   const b=await page.locator('#a-enter').boundingBox(),clip={x:Math.floor(b.x-14),y:Math.floor(b.y-14),width:Math.ceil(b.width+28),height:Math.ceil(b.height+28)};
   await crop(page,'primary-default-native',clip);
   await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await settle(page);
   assert.equal((await snap(page)).state.scene,'title');
   assert.equal(await page.locator('#a-enter .control-label').evaluate(e=>getComputedStyle(e).transform),'matrix(1, 0, 0, 1, 0, 1)');
   await shot(page,'after-desktop-enter-down');await crop(page,'primary-down-native',clip);
   await page.mouse.move(b.x+b.width+80,b.y+b.height/2);await settle(page);
   assert.equal(await page.locator('#a-enter .control-label').evaluate(e=>getComputedStyle(e).transform),'none');
   await shot(page,'after-desktop-enter-drag-off');await crop(page,'primary-cancel-native',clip);
   await page.mouse.up();await settle(page);assert.equal((await snap(page)).state.scene,'title');await shot(page,'after-desktop-enter-canceled');
   await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.up();await settle(page);
   assert.equal((await snap(page)).state.scene,'connect');assert.equal((await snap(page)).focus,'a-connect');
   await shot(page,'after-desktop-enter-accepted');
   await page.locator('#a-name').fill('Rowan arrival');await page.locator('#a-region').selectOption('Inland relay');
   await page.locator('#a-connection-back').click();await settle(page);assert.equal((await snap(page)).focus,'a-enter');
   await page.locator('#a-enter').click();assert.equal(await page.locator('#a-name').inputValue(),'Rowan arrival');assert.equal(await page.locator('#a-region').inputValue(),'Inland relay');
  }finally{await context.close();}
 });
 for(const [profile,size] of [['desktop',{width:1440,height:900}],['portrait',{width:390,height:844}],['landscape',{width:844,height:390}]])for(const safe of ['0','24','44']){
  await check(`${profile} inset ${safe}: targets, scroll reach and retained entry`,async()=>{
   const {page,context}=await fresh(browser,base,'after',profile,size,{safe});
   try{
    await shot(page,`after-${profile}-inset-${safe}`);
    for(const id of ['a-enter','a-title-settings','a-about']){
     await page.locator('#'+id).scrollIntoViewIfNeeded();
     const b=await page.locator('#'+id).boundingBox();assert(b.height>=(profile==='desktop'?44:48));assert(b.width>=48);assert(b.y>=Number(safe)-1);assert(b.y+b.height<=size.height-Number(safe)+1);
     if(profile==='landscape'){assert(b.x>=Number(safe)-1);assert(b.x+b.width<=size.width-Number(safe)+1);}
    }
    await page.locator('#a-enter').click();assert.equal((await snap(page)).state.scene,'connect');
    await page.locator('#a-connection-back').click();await settle(page);assert.equal((await snap(page)).focus,'a-enter');
   }finally{await context.close();}
  });
 }
 for(const [profile,size] of [['portrait',{width:390,height:844}],['landscape',{width:844,height:390}]]){
  await check(`${profile} long labels with 200% authored text model`,async()=>{
   const {page,context}=await fresh(browser,base,'after',profile,size,{safe:'44',long:true,scale:'2'});
   try{
    await page.locator('#a-enter').scrollIntoViewIfNeeded();await shot(page,`after-${profile}-long-text-200-model`);
    for(const id of ['a-enter','a-title-settings','a-about']){
     const e=page.locator('#'+id);await e.scrollIntoViewIfNeeded();assert(await e.evaluate(n=>n.scrollWidth<=n.clientWidth+1));assert((await e.boundingBox()).height>=48);
    }
    await page.locator('#a-about').click();await settle(page);await page.keyboard.press('Escape');await settle(page);assert.equal((await snap(page)).focus,'a-about');
    await page.locator('#a-enter').click();assert.equal((await snap(page)).state.scene,'connect');
   }finally{await context.close();}
  });
 }
 await check('portrait browser emulated touch keeps three actions and opener restoration',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true}),page=await context.newPage();
  try{
   await page.goto(`${base}/after/research/menu_placement_v1/`);await page.locator('#annotate').uncheck();await page.tap('#play-view');
   await page.tap('#a-title-settings');assert.equal((await snap(page)).state.modal,'settings');await page.tap('#a-close-settings');await settle(page);assert.equal((await snap(page)).focus,'a-title-settings');
   await page.tap('#a-about');await page.tap('#a-close-about');await settle(page);assert.equal((await snap(page)).focus,'a-about');
   await page.tap('#a-enter');assert.equal((await snap(page)).state.scene,'connect');
  }finally{await context.close();}
 });
 await check('left-title correction leaves centered title and play-world pixels unchanged',async()=>{
  for(const state of ['center','play']){
   const hashes=[];
   for(const arm of ['before','after']){
    const {page,context}=await fresh(browser,base,arm,'desktop',{width:1440,height:900});
    try{
     if(state==='center')await page.locator('#layout').selectOption('b',{force:true});
     else await page.locator('[data-inspect="play"]').evaluate(e=>e.click());
     await settle(page);await shot(page,`${arm}-${state}-scope-proof`);
     hashes.push(captures.at(-1).sha256);
    }finally{await context.close();}
   }
   assert.equal(hashes[0],hashes[1],`${state} pixels changed outside title-left scope`);
  }
 });
 const portrait=await fresh(browser,base,'after','portrait',{width:390,height:844});
 try{
  const b=await portrait.page.locator('#a-enter').boundingBox();await crop(portrait.page,'portrait-primary-native',{x:Math.floor(b.x-12),y:Math.floor(b.y-12),width:Math.ceil(b.width+24),height:Math.ceil(b.height+24)});
  const t=await portrait.page.locator('.scene-identity').boundingBox();await crop(portrait.page,'portrait-type-native',{x:Math.floor(t.x-12),y:Math.floor(t.y-12),width:Math.ceil(t.width+24),height:Math.ceil(t.height+24)});
  await crop(portrait.page,'portrait-station-material-native',{x:22,y:80,width:350,height:270});
 }finally{await portrait.context.close();}
 const {page,context}=await fresh(browser,base,'after','desktop',{width:1440,height:900});
 try{
  const b=await page.locator('.scene-identity').boundingBox();await crop(page,'type-native',{x:Math.floor(b.x-12),y:Math.floor(b.y-12),width:Math.ceil(b.width+24),height:Math.ceil(b.height+24)});
  await crop(page,'station-material-native',{x:820,y:230,width:570,height:380});
 }finally{await context.close();}
}finally{
 const result={version:'3.0.0-bounded-publication',finishedAt:new Date().toISOString(),browser:await browser.version(),checks,sameDataPairs,errors,unrun:['physical controller','physical phone and software keyboard','screen reader speech','native OS 200% text settings','Firefox/WebKit','human usability','formal aesthetic assessment and AAA quality'],sourcePixels:['God of War Armor Menu','Cyberpunk Update 2.2 Character Customization'],blockedSources:['AAA board Library HTTP403','Forza page HTTP403'],scope:'one left-title alternative; other cases inherited unchanged from rejected 2.0.4'};
 fs.writeFileSync(path.join(out,'native-captures.json'),JSON.stringify(captures,null,2));fs.writeFileSync(path.join(out,'title-sequence-results.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify({passed:checks.filter(x=>x.status==='pass').length,failed:checks.filter(x=>x.status==='fail').length,captures:captures.length,errors},null,2));
 await browser.close();await new Promise(r=>server.close(r));process.exitCode=checks.some(x=>x.status==='fail')?1:0;
}
