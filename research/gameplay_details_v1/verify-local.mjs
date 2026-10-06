import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const results=[];
function check(name,fn){try{fn();results.push({name,status:'pass'});}catch(e){results.push({name,status:'fail',error:e.message});}}
check('Runtime parameter object exactly equals parameters.json',()=>{const embedded=read('index.html').match(/<script id="parameters" type="application\/json">([\s\S]*?)<\/script>/)[1];assert.deepEqual(JSON.parse(embedded),JSON.parse(read('parameters.json')));});
check('Classic JavaScript parses',()=>new vm.Script(read('app.js')));
check('Four supplied official/developer source URLs retained with confirmed/proposed boundaries',()=>{const s=JSON.parse(read('sources.json'));assert.equal(s.sources.length,4);for(const item of s.sources){assert(item.url.startsWith('https://'));assert(item.confirmed&&item.proposal&&item.not_confirmed);assert(read('app.js').includes(item.url));}});
check('No external runtime media/scripts/fonts; authored artifact and no experiment label',()=>{const html=read('index.html'),css=read('style.css');assert(!/(?:src|href)="https?:/i.test(html));assert(!/url\(\s*["']?https?:/i.test(css));assert(html.includes('no AI comparison experiment'));assert.equal(JSON.parse(read('parameters.json')).experiment_status,'not_performed');});
check('Only local authored package; relevant supporting deliverables exist',()=>{for(const f of ['README.md','DEVELOPER_SPEC.md','parameters.json','sources.json','serve.mjs','browser-checks.mjs'])assert(fs.existsSync(path.join(root,f)),f);});
const hashes=Object.fromEntries(['index.html','app.js','style.css','parameters.json','sources.json'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')]));
fs.mkdirSync(path.join(root,'checks'),{recursive:true});fs.writeFileSync(path.join(root,'checks','structural-results.json'),JSON.stringify({run_at:new Date().toISOString(),scope:'source/package checks, not browser execution',results,raw_file_sha256:hashes},null,2)+'\n');
console.log(JSON.stringify({passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length,results},null,2));if(results.some(r=>r.status==='fail'))process.exitCode=1;
