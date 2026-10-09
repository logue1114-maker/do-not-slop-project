/* Reader behavior and data adaptation. No external requests, third-party embeds,
   game simulation, analytics or persistent state. Only the sibling release JSON is fetched. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const D=window.FrameworkReaderData;
  const diagrams=window.FrameworkDiagrams;
  if(!D||!diagrams){console.error('Reader data/diagram module failed to load.');return;}
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const array=v=>Array.isArray(v)?v:v==null?[]:[v];
  const words=v=>typeof v==='string'?v:Array.isArray(v)?v.map(words).join('; '):v&&typeof v==='object'?Object.entries(v).map(([k,x])=>k.replaceAll('_',' ')+': '+words(x)).join('; '):String(v??'');
  const safeURL=(u)=>{try{const url=new URL(u,location.href);return ['http:','https:'].includes(url.protocol)?url.href:null;}catch{return null;}};
  const sourceLink=s=>{const u=safeURL(s.url);return u?`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(s.title||s.source_id||'Source')}</a>`:`<span>${esc(s.title||s.source_id||'Source')}</span>`;};
  let pack=window.FrameworkReaderFallback,route=D.routes[0],phase='entry',material='ink',dataState='loading';
  let selectedRecipes=[];

  function list(values){return '<ul>'+array(values).map(v=>'<li>'+esc(words(v))+'</li>').join('')+'</ul>';}
  function record(r,withSources=true){
    const groups=[['Input',r.input],['Process',r.process],['Output',r.output],['Test / verification',r.test],['Exception',r.exception],['Do not apply this way',r.avoid]];
    let out=`<article class="exact-record"><p class="recipe-status">${esc(r.id||'')} · ${esc((r.status||r.test_status||'conditional draft').replaceAll('_',' '))}</p><h4>${esc(r.title)}</h4>`;
    if(r.when||r.purpose)out+=`<p class="condition">${esc(r.when||r.purpose)}</p>`;
    out+='<div class="exact-grid">'+groups.filter(([,v])=>array(v).length).map(([k,v])=>`<section><h5>${esc(k)}</h5>${list(v)}</section>`).join('')+'</div>';
    if(withSources&&array(r.source_evidence).length)out+='<div class="sources">'+r.source_evidence.map(s=>sourceLink(s)+`<span class="recipe-status">${esc((s.access||'').replaceAll('_',' '))}</span><br>`).join('')+'</div>';
    return out+'</article>';
  }
  function recipesForRoute(r){
    return array(pack.recipes).filter(x=>r.recipe_ids.some(id=>x.id===id||array(x.candidate_ids).includes(id)));
  }
  function hasMakerBase(){return typeof pack.maker_instructions==='string'&&pack.maker_instructions.length>0;}
  function buildHandoff(){
    const completeBase=hasMakerBase();
    const lines=[`DO NOT SLOP — SELECTED-ROUTE MAKER PACKET`,`Data: ${pack.version||'unknown version'} / ${pack.status||'draft'}`,
      completeBase?'Instruction scope: full common maker base plus selected conditional route records. The actual target brief still must be resolved.':'INCOMPLETE INSTRUCTION PACKET: the current full maker instruction base is unavailable. These route research extracts must not be treated as a complete production handoff.',
      '', 'FULL COMMON WHOLE-SCREEN MAKER INSTRUCTIONS',
      'Source file: '+(pack.maker_instructions_source||'../release/AI_INSTRUCTIONS.md'),
      completeBase?pack.maker_instructions:'UNAVAILABLE: Load the current release/AI_INSTRUCTIONS.md together with the brief, exact applicable original rules, source records and selected conditional recipes before production.',
      '', 'SELECTED CONDITIONAL ROUTE',
      `Route: ${route.title} (${route.genres})`,`Condition: ${route.condition}`,`Composition: ${route.build}`,`Exception: ${route.exception}`,
      'Apply the common maker process to the whole real screen sequence. Add only recipes whose actual triggers match; do not force all catalog records into this route.',
      'Source files: ../release/AI_INSTRUCTIONS.md; ../release/brief.schema.json; ../release/recipe-catalog.json; ../release/recipe-details.json; ../release/sources.json.',
      '', 'Resolve the route-specific inputs in the real brief:',...route.inputs.map(x=>'- '+x),'',
      'These diagrams and route aids are original teaching geometry, not a target-game render, resolved production token set, or tested experiment.',
      '', 'Selected exact recipe records:'];
    selectedRecipes.forEach(r=>{
      lines.push('',`${r.id} — ${r.title}`,`WHEN: ${r.when||r.purpose||'Apply under the recorded condition.'}`);
      [['INPUT',r.input],['PROCESS',r.process],['OUTPUT',r.output],['TEST',r.test],['EXCEPTION',r.exception],['DO NOT APPLY THIS WAY',r.avoid]].forEach(([k,v])=>{if(array(v).length){lines.push(k+':',...array(v).map(x=>'- '+words(x)));}});
      array(r.source_evidence).forEach(s=>lines.push('SOURCE: '+s.title+' — '+s.url,'ACCESS: '+words(s.access),'OBSERVATION: '+words(s.observed),'LIMIT: '+words(s.limit)));
    });
    lines.push('', 'Route-specific inspection:',...route.tests.map(x=>'- '+x),'',
      'Acceptance: inspect actual whole scenes at the supported viewport/content/input envelope. Check long labels, changing counts, busy/bright/dark underlays, concurrent layers, release-away/cancel/repeat, and actual result/return behavior. Source/hash success, visual review, input tests, device checks and user approval are separate claims.',
      '', 'Known pack limits:',...array(pack.limits).map(x=>'- '+words(x)));
    return lines.join('\n');
  }
  function updateRoute(id){
    route=D.routes.find(r=>r.id===id)||D.routes[0];
    document.querySelectorAll('[data-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===route.id)));
    $('branch-title').textContent=route.title;
    $('branch-kind').textContent='TASK-LED ROUTE / '+route.genres.toUpperCase();
    $('branch-condition').textContent='Use when: '+route.condition;
    $('branch-build').textContent=route.build;
    $('branch-exception').textContent=route.exception;
    $('composition-diagram').innerHTML=diagrams.composition(route);
    $('composition-caption').textContent='Original construction diagram. '+route.build+' Diagram labels and shapes are symbolic, not a target-game screenshot.';
    selectedRecipes=recipesForRoute(route);
    $('branch-exact').innerHTML=record({id:'ROUTE-'+route.id.toUpperCase(),title:'Construction route requirements',status:'authored_navigation_aid',when:route.condition,input:route.inputs,process:[route.build],output:route.outputs,test:route.tests,exception:[route.exception]},false)+(selectedRecipes.length?`<p class="recipe-status">Selected production records: ${esc(selectedRecipes.map(x=>x.id).join(', '))}</p>`:'<p class="recipe-status">No matching exact release record was available. Resolve the recorded route requirements before implementation.</p>');
    $('ai-handoff').textContent=buildHandoff();
    $('handoff-status').textContent=hasMakerBase()?'Includes the full exact common maker instructions plus selected conditional recipes. Resolve the actual target brief before implementation.':'Incomplete handoff: current full maker instructions are unavailable. Route research extracts alone are not a complete production packet.';
  }
  function updateSequence(id){
    phase=id;
    document.querySelectorAll('[data-phase]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.phase===phase)));
    $('sequence-diagram').innerHTML=diagrams.sequence(phase);
    $('phase-title').textContent=D.phases[phase].title;
    $('phase-description').textContent=D.phases[phase].description;
    $('sequence-caption').textContent=D.phases[phase].caption+' Original authored storyboard, not verified gameplay.';
  }
  function updateOwnership(){
    const dialog=$('dialog-layer').checked,notice=$('notice-layer').checked;
    $('ownership-diagram').innerHTML=diagrams.ownership(dialog,notice);
    $('input-owner').textContent='Input owner: '+(dialog?'decision dialog':'world');
    $('ownership-caption').textContent='Original layer-construction diagram. '+(dialog?'Decision dialog takes input; essential HUD remains; ':'World holds input; ')+(notice?(dialog?'the nonurgent notice queues until the dialog closes.':'the nonurgent notice uses a reserved slot.'):'no notice is shown.')+' Real live/paused behavior and urgency must be verified in the target game.';
  }
  function updateGrammar(id){
    material=id;
    document.querySelectorAll('[data-material]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.material===material)));
    const m=D.materials[material],busy=$('busy-underlay').checked;
    $('grammar-diagram').innerHTML=diagrams.grammar(material,busy);
    $('grammar-caption').textContent='Original '+m.name.toLowerCase()+' construction specimen on a '+(busy?'synthetic busy':'synthetic quiet')+' underlay. It shows a command, utility and read-only status in one family. No source assets or measured improvement claim.';
    $('grammar-ledger').innerHTML=['contour','material','type','texture','color'].map(k=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(m[k])+'</dd></div>').join('');
  }
  function renderRecipes(){
    const q=$('recipe-filter').value.trim().toLowerCase();
    const rows=array(pack.recipes).filter(r=>words(r).toLowerCase().includes(q));
    $('recipe-count').textContent=rows.length+' of '+array(pack.recipes).length+' exact recipe records';
    $('recipe-records').innerHTML=rows.length?rows.map(r=>record(r)).join(''):'<p>No recipes match this search.</p>';
  }
  function updateDataStatus(){
    $('data-status').textContent=dataState==='loaded'?'Current production packet loaded · '+(pack.version||'version unspecified'):dataState==='fallback'?'Pinned research extracts only · current packet unavailable':'Pinned research extracts shown while current packet loads';
  }
  function renderPack(){
    updateDataStatus();
    updateRoute(route.id);
    $('stage-records').innerHTML=array(pack.stages).length?pack.stages.map(s=>record(s)).join(''):'<p class="fallback-notice">Current release stages are unavailable. Download links require the sibling release files; research extracts are shown below.</p>';
    renderRecipes();
    $('download-links').innerHTML=array(pack.downloads).map(d=>{
      const raw=d.path||'';
      // Downloads are same-origin relative documents from the release pack only.
      if(!raw.startsWith('../release/')||raw.includes('..',3)||raw.includes(':'))return '';
      return `<a href="${esc(raw)}" download>${esc(d.label)} ↓</a>`;
    }).join('');
    const sourceMap=new Map();
    [...array(pack.stages),...array(pack.recipes)].forEach(r=>array(r.source_evidence).forEach(s=>{if(s.url&&!sourceMap.has(s.url))sourceMap.set(s.url,s);}));
    $('source-records').innerHTML=[...sourceMap.values()].map(s=>`<article class="source-item"><strong>${sourceLink(s)}</strong><p>Access: ${esc((s.access||'Unspecified').replaceAll('_',' '))}</p><p>Observed: ${esc(words(s.observed))}</p><p>Limit: ${esc(words(s.limit))}</p></article>`).join('');
    $('evidence-limits').innerHTML=array(pack.limits).map(l=>'<li>'+esc(words(l))+'</li>').join('');
    $('evidence-limit').textContent='Research-backed draft. Long-video and Shorts frames remain unobserved. Source stills and teaching diagrams do not establish native input, target-game acceptance or a controlled comparison.';
  }
  function download(name,content,type){
    const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function bind(){
    $('branch-nav').innerHTML=D.routes.map(r=>`<button type="button" data-route="${esc(r.id)}" aria-pressed="${r.id===route.id}"><span>${esc(r.title)}</span><small>${esc(r.genres)}</small></button>`).join('');
    $('branch-nav').addEventListener('click',e=>{const b=e.target.closest('[data-route]');if(b)updateRoute(b.dataset.route);});
    document.querySelectorAll('[data-phase]').forEach(b=>b.addEventListener('click',()=>updateSequence(b.dataset.phase)));
    document.querySelectorAll('[data-material]').forEach(b=>b.addEventListener('click',()=>updateGrammar(b.dataset.material)));
    ['dialog-layer','notice-layer'].forEach(id=>$(id).addEventListener('change',updateOwnership));
    $('busy-underlay').addEventListener('change',()=>updateGrammar(material));
    $('show-mask').addEventListener('change',()=>$('mask-diagram').innerHTML=diagrams.mask($('show-mask').checked));
    $('recipe-filter').addEventListener('input',renderRecipes);
    $('copy-handoff').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(buildHandoff());$('copy-status').textContent=hasMakerBase()?'Full base and selected-route instructions copied':'Incomplete research instructions copied; full current base unavailable';}catch{const d=$('ai-handoff').closest('details');d.open=true;const selection=getSelection(),range=document.createRange();range.selectNodeContents($('ai-handoff'));selection.removeAllRanges();selection.addRange(range);$('copy-status').textContent='Instructions selected. Use your device’s copy command.';}});
    $('download-handoff').addEventListener('click',()=>{const value={artifact_type:hasMakerBase()?'selected_route_maker_packet':'incomplete_route_research_packet',instruction_completeness:hasMakerBase()?'complete_base_plus_selected_conditional_recipes':'incomplete_current_base_unavailable',pack_version:pack.version,pack_status:pack.status,maker_instructions:hasMakerBase()?pack.maker_instructions:null,maker_instructions_source:pack.maker_instructions_source||'../release/AI_INSTRUCTIONS.md',applicability_policy:'Apply common whole-screen process. Select recipes only when actual triggers match and exceptions are checked; no all-catalog applicability claim.',route,recipes:selectedRecipes,instructions:buildHandoff(),limits:pack.limits,visuals:'Original teaching diagrams; no game captures, production token values or experiment results.'};download('do-not-slop-'+route.id+'-packet.json',JSON.stringify(value,null,2),'application/json');$('copy-status').textContent=hasMakerBase()?'Full-base selected-route JSON download prepared':'Incomplete research JSON prepared; current full base unavailable';});
    const states=[['Rest','rest','Ready','Default command'],['Hover','hovered','Ready','Pointer support only'],['Focus','focused','Ready','Independent input outline'],['Pressed','pressed','Pressed','Fixed shell / moving face'],['Selected','selected','✓ Current','Persistent state marker'],['Unavailable','unavailable','Locked · reason','Readable condition'],['Pending','pending','… Working','Await real acknowledgement'],['Error','error','! Try again','Supported recovery']];
    $('state-rail').innerHTML=states.map(([n,c,l,why])=>`<div class="state-item" role="listitem"><b>${esc(n.toUpperCase())}</b><div class="specimen-control ${esc(c)}" aria-hidden="true">${esc(l)}</div><p>${esc(why)}</p></div>`).join('');
    $('state-caption').textContent='Original state-construction diagram. Current selection and focus use separate markers. Before/during/settled frames identify the moving part and preserve a fixed shell. These specimens are not actual input tests.';
    if('IntersectionObserver' in window){const links=[...document.querySelectorAll('.chapter-rail a')];const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach(e=>{links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));});},{rootMargin:'-90px 0px -65% 0px'});document.querySelectorAll('.chapter').forEach(s=>observer.observe(s));}
  }
  function init(){
    bind();$('hero-diagram').innerHTML=diagrams.hero();$('planes-diagram').innerHTML=diagrams.planes();$('anatomy-diagram').innerHTML=diagrams.anatomy();$('state-diagram').innerHTML=diagrams.state();$('mask-diagram').innerHTML=diagrams.mask(true);
    updateSequence('entry');updateOwnership();updateGrammar('ink');renderPack();
  }
  async function load(){
    try{const response=await fetch('../release/display.json',{cache:'no-store'});if(!response.ok)throw new Error('HTTP '+response.status);const current=await response.json();if(!Array.isArray(current.recipes)||!Array.isArray(current.stages))throw new Error('Missing release records');pack=current;dataState='loaded';renderPack();}
    catch(error){dataState='fallback';updateDataStatus();const notice=document.createElement('p');notice.className='fallback-notice';notice.setAttribute('role','status');notice.textContent='Current production packet did not load. You’re seeing pinned research extracts and original teaching diagrams. Current stage records and release downloads need the sibling release files.';document.querySelector('.scope-strip').after(notice);console.warn('Framework release data unavailable:',error.message);}
  }
  init();load();
})();
