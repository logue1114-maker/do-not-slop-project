import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url)),require=createRequire(import.meta.url);
const bundledDriver=path.join(process.env.APPDATA||'','npm/node_modules/agbrowse/node_modules/playwright-core');
const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH||(fs.existsSync(bundledDriver)?bundledDriver:'playwright-core'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'screenshot-manifest.json'),'utf8'));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(process.platform==='win32'?path.join(process.env.ProgramFiles,'Google/Chrome/Application/chrome.exe'):undefined),args:['--disable-gpu']});
const page=await browser.newPage({viewport:{width:1500,height:1000},deviceScaleFactor:1});
const groups=[{name:'desktop',title:'Desktop · actual local runtime, original authored proposals',names:['01-minimap-desktop','02-inventory-compare-desktop','03-shop-confirm-desktop','shop-purchase-complete-desktop','04-hud-low-health-desktop','05-dialogue-reward-desktop'],columns:3},
{name:'mobile',title:'Mobile viewports · actual runtime; Play view and editor views',names:['play-view-minimap-844x390','play-view-hud-844x390','play-view-inventory-390x844','minimap-390x844','inventory-390x844','shop-390x844'],columns:3}];
const outputs=[];
for(const group of groups){const images=group.names.map(name=>{const s=manifest.screenshots.find(x=>x.name===name);const bytes=fs.readFileSync(path.join(root,s.file));return {s,uri:'data:image/png;base64,'+bytes.toString('base64')};});
  await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:30px;background:#eeeae0;color:#252c25;font-family:Arial,sans-serif}h1{font-size:24px;margin:0 0 8px}p{font-size:13px;margin:0 0 22px;color:#52604f}.sheet{display:grid;grid-template-columns:repeat(${group.columns},1fr);gap:20px}figure{margin:0;border:1px solid #a0ac98;background:#f5f2e9;padding:12px}figcaption{font-size:13px;font-weight:bold;line-height:1.5;margin-bottom:10px}img{display:block;width:100%;height:540px;object-fit:contain;object-position:top;background:#dfdfd4}.limits{margin-top:20px;font-size:12px}</style><h1>${group.title}</h1><p>Full-page captures scaled to fit. Original images and SHA-256 hashes are retained. No external product screenshots.</p><div class="sheet">${images.map(({s,uri})=>`<figure><figcaption>${s.name}<br>${s.viewport.width}×${s.viewport.height} CSS viewport · full page ${s.width}×${s.height}</figcaption><img src="${uri}" alt="${s.name}"></figure>`).join('')}</div><p class="limits">Browser viewport checks are not native-phone, controller, screen-reader, participant-study or design-approval evidence.</p></html>`);
  await page.waitForFunction(()=>[...document.images].every(x=>x.complete));await page.waitForTimeout(250);const filename='contact-sheet-'+group.name+'.png';await page.screenshot({path:path.join(root,filename),fullPage:true});const bytes=fs.readFileSync(path.join(root,filename));outputs.push({file:filename,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),sourceFiles:images.map(({s})=>({file:s.file,sha256:s.sha256})),treatment:'Labeled layout of uniformly contained/scaled unedited sources; no source cropping'});
}
fs.writeFileSync(path.join(root,'contact-sheets-manifest.json'),JSON.stringify({timestamp:new Date().toISOString(),outputs},null,2)+'\n');await browser.close();console.log('Two labeled contact sheets saved.');
