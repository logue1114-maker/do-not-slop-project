import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(root,'../..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const author=JSON.parse(read('AUTHORING_RECORD.json')),base=author.publication_base_commit;
const git=(...args)=>{const result=spawnSync('git',args,{cwd:repo,encoding:'utf8'});assert.equal(result.status,0,result.stderr||result.stdout);return result.stdout;};
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const results=[],check=(name,fn)=>{try{fn();results.push({name,status:'pass'});}catch(error){results.push({name,status:'fail',message:error.message});}};
check('only additive package and minimal navigation changed',()=>{
  assert.equal(git('merge-base','--is-ancestor',base,'HEAD'),'');
  const allowed=file=>file.startsWith('research/menu_placement_v1/')||['README.md','docs/RESEARCH_INDEX.md'].includes(file);
  for(const file of git('diff','--name-only',base,'--','.').trim().split('\n').filter(Boolean))assert(allowed(file),file);
  for(const line of git('status','--porcelain','--untracked-files=all').split('\n').filter(Boolean))assert(allowed(line.slice(3)),line);
  for(const line of git('diff','--numstat',base,'--','README.md','docs/RESEARCH_INDEX.md').trim().split('\n').filter(Boolean)){
    const [added,removed,file]=line.split('\t');assert.equal(Number(removed),0,file);assert(Number(added)<=12,file);
  }
});
check('both prior research packages and concurrent Party Race work unchanged',()=>{
  assert.equal(git('diff',base,'--','research/game_ui_playground_v1','research/gameplay_details_v1','research/party_race_sync_20261007'),'');
});
check('current tested runtime and harness match frozen bytes',()=>{
  for(const file of JSON.parse(read('checks/review-candidate-2/source-hashes.json'))){
    assert.equal(sha(fs.readFileSync(path.join(root,file.file))),file.sha256,file.file);
    assert.equal(sha(fs.readFileSync(path.join(root,'checks/review-candidate-2/source',file.file))),file.sha256,file.file+' frozen');
  }
  const run=JSON.parse(read('checks/review-candidate-2/summary.json'));
  assert.equal(run.passed,25);assert.equal(run.failed,0);assert.deepEqual(run.errors,[]);
});
check('root navigation and package documentation resolve locally',()=>{
  for(const relative of ['README.md','docs/RESEARCH_INDEX.md']){
    const file=path.join(repo,relative),text=fs.readFileSync(file,'utf8');
    const links=[...text.matchAll(/\]\(([^)]+menu_placement_v1[^)]*)\)/g)].map(match=>match[1]);
    assert(links.length>=2,relative);for(const link of links)assert(fs.existsSync(path.resolve(path.dirname(file),link)),link);
  }
  for(const file of walk(root).filter(file=>file.endsWith('.md')&&!file.includes(path.sep+'checks'+path.sep))){
    for(const match of fs.readFileSync(file,'utf8').matchAll(/\]\(([^)]+)\)/g)){
      const link=match[1];if(/^(https?:|#)/.test(link))continue;
      assert(fs.existsSync(path.resolve(path.dirname(file),link.split('#')[0])),path.relative(root,file)+': '+link);
    }
  }
});
check('original assets and explicit rights/approval boundaries',()=>{
  const sources=JSON.parse(read('sources.json'));
  for(const key of ['third_party_screenshots_bundled','third_party_images_bundled','third_party_fonts_bundled','source_bodies_bundled'])assert.equal(sources.rights[key],false,key);
  assert.equal(author.approval.user_design,'pending');assert(author.approval.public_git_publication.includes('explicitly authorized'));
  assert.equal(author.approval.site_edit,'not performed');assert.equal(author.approval.plugin_installation,'not performed');
});
check('no external runtime assets or service calls',()=>{
  assert(!/<(?:img|script|link)[^>]+(?:src|href)=["']https?:/i.test(read('index.html')));
  assert(!/url\(\s*["']?https?:/i.test(read('style.css')));
  assert(!/\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/.test(read('app.js')));
});
check('public text has no workstation paths, private identifiers or credential-shaped strings',()=>{
  // Bounded high-confidence patterns; this is not a general secret detector.
  const disallowed=[/\b[A-Z]:\\/i,new RegExp('source_'+'thread_id'),/gh[pousr]_[a-z0-9]{20,}/i,/sk-(?:proj-)?[a-z0-9_-]{20,}/i,new RegExp('-----BEGIN [A-Z ]*'+'PRIVATE KEY-----')];
  for(const file of walk(root).filter(file=>/\.(?:md|json|html|css|js|mjs|txt)$/.test(file))){
    const text=fs.readFileSync(file,'utf8');for(const pattern of disallowed)assert(!pattern.test(text),path.relative(root,file));
  }
});
check('all package files match exact byte manifest',()=>{
  const manifest=JSON.parse(read('PACKAGE_MANIFEST.json'));
  const actual=walk(root).map(file=>path.relative(root,file).replaceAll('\\','/')).filter(file=>file!=='PACKAGE_MANIFEST.json').sort();
  assert.deepEqual(manifest.files.map(file=>file.file).sort(),actual);
  for(const file of manifest.files){const bytes=fs.readFileSync(path.join(root,file.file));assert.equal(bytes.length,file.bytes,file.file);assert.equal(sha(bytes),file.sha256,file.file);}
});
const record={at:new Date().toISOString(),scope:'bounded public source integration; not browser interaction, comprehensive secret detection, hardware validation or design acceptance',publication_base_commit:base,current_browser_run:'review-candidate-2',results};
console.log(JSON.stringify(record,null,2));
if(process.argv.includes('--record'))fs.writeFileSync(path.join(root,'checks/public-validation.json'),JSON.stringify(record,null,2)+'\n');
process.exitCode=results.some(result=>result.status==='fail')?1:0;
