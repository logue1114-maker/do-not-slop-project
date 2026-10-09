/* Minimal DOM/export contract fixture. Not a browser, visual or physical-input test. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=__dirname,release=JSON.parse(fs.readFileSync(path.join(root,'../release/display.json'),'utf8'));
const exactBase=fs.readFileSync(path.join(root,'../release/AI_INSTRUCTIONS.md'),'utf8');
const publicURLs=new Set(JSON.parse(fs.readFileSync(path.join(root,'../release/sources.json'),'utf8')).sources.map(s=>s.url));
async function fixture(fail){
  const nodes=new Map(),notices=[],clipboard=[],blobs=[];
  function node(id){if(!nodes.has(id))nodes.set(id,{id,innerHTML:'',textContent:'',value:'',checked:['notice-layer','show-mask'].includes(id),listeners:{},attrs:{},addEventListener(k,fn){this.listeners[k]=fn;},setAttribute(k,v){this.attrs[k]=v;},after(v){notices.push(v);},click(){},remove(){}});return nodes.get(id);}
  class FixtureURL extends URL{static createObjectURL(blob){blobs.push(blob);return 'blob:contract-fixture';}static revokeObjectURL(){}}
  class FixtureBlob{constructor(parts,options){this.parts=parts;this.options=options;}}
  const ctx={window:{},location:{href:'https://example.test/research/production-framework/'},console:{warn(){},error:console.error},URL:FixtureURL,Blob:FixtureBlob,setTimeout,navigator:{clipboard:{async writeText(t){clipboard.push(t);}}},fetch:async()=>{if(fail)throw new Error('fixture missing release');return {ok:true,json:async()=>release};},document:{getElementById:node,querySelector:s=>node(s),querySelectorAll:()=>[],createElement:tag=>node('created-'+tag),body:{appendChild(){}}}};
  vm.createContext(ctx);for(const f of ['data.js','diagrams.js','reader.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
  await new Promise(r=>setTimeout(r,10));
  const checks=[];const check=(n,p)=>checks.push({name:n,passed:!!p});
  check('Initial diagrams construct',node('hero-diagram').innerHTML.includes('<svg')&&node('anatomy-diagram').innerHTML.includes('<svg'));
  check('Loaded/fallback mode labeled',node('data-status').textContent.includes(fail?'current packet unavailable':'Current production packet loaded'));
  check('Fallback notice only on failure',notices.length===(fail?1:0));
  check('Exact records populated',node('recipe-records').innerHTML.includes(fail?'RB-01':'DNS-01'));
  for(const r of ctx.window.FrameworkReaderData.routes){
    node('branch-nav').listeners.click({target:{closest(){return {dataset:{route:r.id}};}}});
    check('Route '+r.id,node('branch-title').textContent===r.title&&node('ai-handoff').textContent.includes(r.condition));
    await node('copy-handoff').listeners.click();
    node('download-handoff').listeners.click();
    const copied=clipboard.at(-1),packet=JSON.parse(blobs.at(-1).parts.join(''));
    const expected=(fail?ctx.window.FrameworkReaderFallback:release).recipes.filter(x=>r.recipe_ids.some(id=>x.id===id||(x.candidate_ids||[]).includes(id))).map(x=>x.id);
    check('Conditional subset '+r.id,JSON.stringify(packet.recipes.map(x=>x.id))===JSON.stringify(expected));
    check('Public-only exported provenance '+r.id,packet.recipes.every(x=>(x.source_evidence||[]).every(s=>!s.url||publicURLs.has(s.url))));
    if(fail){
      check('Incomplete copy/download '+r.id,copied.includes('INCOMPLETE INSTRUCTION PACKET')&&packet.instructions.includes('INCOMPLETE INSTRUCTION PACKET')&&packet.maker_instructions===null&&packet.instruction_completeness==='incomplete_current_base_unavailable'&&node('handoff-status').textContent.includes('Incomplete handoff'));
    }else{
      check('Exact full base copy/download '+r.id,copied.split(exactBase).length===2&&packet.instructions.split(exactBase).length===2&&packet.maker_instructions===exactBase&&packet.instruction_completeness==='complete_base_plus_selected_conditional_recipes');
      check('Base precedes conditional route '+r.id,copied.indexOf(exactBase)<copied.indexOf('SELECTED CONDITIONAL ROUTE')&&packet.instructions.indexOf(exactBase)<packet.instructions.indexOf('SELECTED CONDITIONAL ROUTE'));
    }
    check('Source file references '+r.id,copied.includes('../release/AI_INSTRUCTIONS.md')&&copied.includes('../release/recipe-catalog.json')&&copied.includes('../release/sources.json'));
  }
  node('recipe-filter').value='unmatchable fixture word';node('recipe-filter').listeners.input();check('Empty search result',node('recipe-count').textContent.startsWith('0 of')&&node('recipe-records').innerHTML.includes('No recipes match'));
  node('dialog-layer').checked=true;node('dialog-layer').listeners.change();check('Dialog ownership control',node('input-owner').textContent==='Input owner: decision dialog');
  node('show-mask').checked=false;node('show-mask').listeners.change();check('Mask control',node('mask-diagram').innerHTML.includes('SAFE MASK HIDDEN'));
  return {mode:fail?'fallback':'loaded',checks};
}
(async()=>{const result=[await fixture(false),await fixture(true)];process.stdout.write(JSON.stringify(result));process.exitCode=result.some(x=>x.checks.some(c=>!c.passed))?1:0;})();
