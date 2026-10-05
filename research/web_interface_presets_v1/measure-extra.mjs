import {fileURLToPath} from 'node:url';
process.chdir(path.dirname(fileURLToPath(import.meta.url)));
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH||'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const page=await browser.newPage();
const measurements=JSON.parse(fs.readFileSync('checks/measurements.json','utf8'));
for(const viewport of [{width:1165,height:747},{width:390,height:844}]){await page.setViewportSize(viewport);await page.goto(pathToFileURL(path.resolve('index.html')).href);for(const id of ['shopping','information','course','community','work','booking']){await page.evaluate(()=>flowDemo.resetAll());if(viewport.width<=700)await page.locator('#example-select').selectOption(id);else await page.locator(`[data-example="${id}"]`).click();const extra=await page.evaluate(()=>{const visible=e=>e&&e.getBoundingClientRect().width>0;const box=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {label:e.textContent.trim()||e.getAttribute('aria-label')||e.id,x:+r.x.toFixed(2),y:+r.y.toFixed(2),width:+r.width.toFixed(2),height:+r.height.toFixed(2),font_size:s.fontSize,line_height:s.lineHeight,radius:s.borderRadius}};return {shared_gallery_menu:[...document.querySelectorAll('#gallery-nav button,#example-select')].filter(visible).map(box),task_navigation:[...document.querySelectorAll('#screen nav button,#screen nav a,#screen .outline button,#screen .forum-rail button,#screen .work-nav button,#screen .course-mobile summary,#screen #work-filter,#screen #category,#screen .service-choice,#screen .date-choice,#screen .slots button')].filter(visible).map(box),reading_heading:box(document.getElementById('view-title')),layout_columns:[...document.querySelectorAll('#screen .search-layout>*,#screen .course-layout>*,#screen .forum-layout>*,#screen .work-layout>*,#screen .booking-layout>*')].filter(visible).map(box)};});const entry=measurements.find(x=>x.purpose===id&&x.stage==='entry'&&x.viewport.width===viewport.width);Object.assign(entry,extra);}}
await browser.close();fs.writeFileSync('checks/measurements.json',JSON.stringify(measurements,null,2)+'\n');fs.writeFileSync('checks/final/measurements.json',JSON.stringify(measurements,null,2)+'\n');console.log('Menu, type and column geometry added to the 12 entry measurements.');
