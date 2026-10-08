import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
export const root=import.meta.dirname;
export const before=path.join(root,'history/rejected-v2.0.4');
export const after=root;
export const out=path.join(root,'checks/public-title/captures');fs.mkdirSync(out,{recursive:true});
const require=createRequire(import.meta.url);
export const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH||'playwright-core');
export async function start(){
 const server=http.createServer((req,res)=>{
  const parts=decodeURIComponent(new URL(req.url,'http://localhost').pathname).split('/').filter(Boolean),arm=parts.shift();
  if(!['before','after'].includes(arm)||parts.some(x=>x==='..')){res.writeHead(404).end();return;}
  if(parts[0]==='research'&&parts[1]==='menu_placement_v1')parts.splice(0,2);
  let file=path.join(arm==='before'?before:after,...parts);
  if(parts.length===0||!path.extname(file))file=path.join(file,'index.html');
  const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};
  fs.readFile(file,(err,bytes)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'text/plain','Cache-Control':'no-store'});res.end(err?'Unavailable':bytes);});
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 return {server,browser,base:'http://127.0.0.1:'+server.address().port};
}
export async function fresh(browser,base,arm,profile,size,{safe='0',long=false,scale='1'}={}){
 const context=await browser.newContext({viewport:size,deviceScaleFactor:1});
 const page=await context.newPage();
 await page.goto(`${base}/${arm}/research/menu_placement_v1/`);
 await page.locator('#profile').selectOption(profile);
 await page.locator('#layout').selectOption('a');
 await page.locator('#safe').selectOption(safe);
 await page.locator('#annotate').uncheck();
 if(long)await page.locator('#long-labels').check();
 if(scale!=='1')await page.locator('#text-scale').selectOption(scale);
 await page.locator('#play-view').click();
 await page.waitForTimeout(100);
 await page.mouse.move(size.width-1,size.height-1);
 await page.evaluate(()=>document.activeElement?.blur());
 return {page,context};
}
