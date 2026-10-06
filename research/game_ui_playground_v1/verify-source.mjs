import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),checks=[];
const check=(ok,name,evidence)=>checks.push({name,status:ok?'passed':'failed',evidence});
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const sandbox={window:{}};vm.runInNewContext(read('data.js'),sandbox);
for(const key of ['config','fixture'])check(JSON.stringify(JSON.parse(read(key+'.json')))===JSON.stringify(sandbox.window.PLAYGROUND_DATA[key]),key+' JSON matches actual runtime data',true);
const contract=JSON.parse(read('functional-contract.json')),config=JSON.parse(read('config.json'));
for(const [station,fields] of Object.entries(contract.settingInputs))for(const [key,spec] of Object.entries(fields)){const value=config[station][key];const valid=Array.isArray(spec)?spec.includes(value):spec==='boolean'?typeof value==='boolean':typeof value==='number'&&value>=spec.min&&value<=spec.max;check(valid,station+'.'+key+' default is in declared input domain',value);}
for(const file of fs.readdirSync(root).filter(f=>/\.m?js$/.test(f))){try{execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'});check(true,file+' syntax',true);}catch(e){check(false,file+' syntax',String(e.stderr));}}
const html=read('index.html');
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(/^(https?:|#)/.test(m[1]))continue;check(fs.existsSync(path.resolve(root,m[1])),'Local entry dependency/link '+m[1],m[1]);}
check(!/(?:https?:)?\/\/[^\s"']+\.(?:png|jpg|gif|woff|webp)/i.test(html+read('styles.css')),'Runtime does not embed third-party media/font URLs',true);
check(!/\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage/.test(read('app.js')),'No service calls or browser-storage economy',true);
function luminance(hex){const rgb=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
for(const [role,fg,bg] of [['lab text','#242923','#f3f0e8'],['lab muted','#60675f','#f3f0e8'],['game text','#f4f1e4','#24382f'],['game muted','#b7c5b7','#24382f'],['primary text','#233028','#e7bd73'],['blocked text','#acb6aa','#334139'],['positive delta','#a4e0b4','#20332a'],['negative delta','#ffb5a0','#20332a']]){const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);check(ratio>=4.5,role+' token contrast >=4.5',{fg,bg,ratio});}
try{const repo=path.resolve(root,'../..'),allowed=['README.md','docs/RESEARCH_INDEX.md','docs/CHANGELOG.md','docs/RIGHTS_AND_SCOPE.md','docs/VERIFICATION.md','docs/PROVENANCE.json','research/series_index.json','validation/validate_release.py','validation/release-checks.json','FILES.sha256.json'];const changed=execFileSync('git',['diff','--name-only','HEAD'],{cwd:repo,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);check(changed.every(p=>p.startsWith('research/game_ui_playground_v1/')||allowed.includes(p)),'Tracked changes stay within authorized package and integration metadata',changed);}catch(e){check(false,'Tracked-file preservation check',e.message);}
const result={timestamp:new Date().toISOString(),kind:'source/contract checks, distinct from browser input',checks,totals:{passed:checks.filter(x=>x.status==='passed').length,failed:checks.filter(x=>x.status==='failed').length}};
fs.writeFileSync(path.join(root,process.env.SOURCE_CHECK_REPORT||'source-checks.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result.totals));if(result.totals.failed)process.exitCode=1;
