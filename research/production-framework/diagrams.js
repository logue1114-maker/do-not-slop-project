/* Original authored SVG teaching geometry. Nothing here is a game capture,
   a benchmark result, a production token, or copied third-party artwork. */
window.FrameworkDiagrams = (() => {
  const C={ink:'#183036',quiet:'#52666a',paper:'#fffef8',green:'#b7e4bf',orange:'#ba4c21',blue:'#155a79',line:'#bbc9bd',pale:'#e4eadd',red:'#a43934'};
  let instance=0;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rect=(x,y,w,h,fill=C.paper,stroke=C.ink,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
  const text=(x,y,s,size=13,fill=C.ink,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
  const line=(x,y,x2,y2,stroke=C.ink,extra='')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${stroke}" ${extra}/>`;
  const circle=(x,y,r,fill=C.paper,stroke=C.ink,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
  const path=(d,fill='none',stroke=C.ink,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
  const pill=(x,y,w,s,fill=C.ink,ink=C.paper)=>rect(x,y,w,30,fill,fill,'rx="2"')+text(x+w/2,y+20,s,11,ink,'text-anchor="middle" font-weight="700"');
  const label=(x,y,s,fill=C.quiet)=>text(x,y,s,10,fill,'font-family="monospace" letter-spacing=".6"');
  const svg=(w,h,title,desc,content)=>{
    const id=`diagram-${++instance}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc" font-family="Arial, Helvetica, sans-serif"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc><defs><pattern id="${id}-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#c9d3c5" stroke-width=".5"/></pattern><pattern id="${id}-hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#829577" stroke-width=".7"/></pattern><marker id="${id}-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="${C.orange}" stroke-width="1.2"/></marker></defs>${content.replaceAll('fill="GRID"',`fill="url(#${id}-grid)"`).replaceAll('fill="HATCH"',`fill="url(#${id}-hatch)"`).replaceAll('marker-end="ARROW"',`marker-end="url(#${id}-arrow)"`)}</svg>`;
  };
  const arrow=(d)=>path(d,'none',C.orange,'stroke-width="2" marker-end="ARROW"');
  const screen=(x,y,w,h)=>rect(x,y,w,h,'GRID',C.ink,'stroke-width="1.5"')+label(x+12,y+20,'SCHEMATIC / NOT A GAME CAPTURE');
  const protectedArea=(x,y,w,h,s)=>rect(x,y,w,h,'none',C.blue,'stroke-dasharray="5 4" stroke-width="1.5"')+label(x+10,y+19,s,C.blue);

  function hero(){
    let v=rect(0,0,420,332,'#e2e8dd','none');
    v+=label(12,17,'THE SCREEN IS THE DESIGN UNIT');
    v+=rect(30,40,354,195,'GRID',C.ink,'stroke-width="2"');
    v+=rect(45,56,62,19,C.paper,C.line)+text(53,69,'STATUS',8);
    v+=protectedArea(115,77,174,124,'TASK REGION');
    v+=path('M132 180L176 138L206 154L267 111','none',C.ink,'stroke-width="2"');
    v+=circle(176,138,8,C.green)+circle(267,111,8,C.green);
    v+=pill(292,179,76,'ACTION',C.orange);
    v+=label(44,220,'SCENE')+label(316,68,'UTILITY');
    v+=line(70,235,70,275,C.quiet)+line(198,235,198,275,C.quiet)+line(327,235,327,275,C.quiet);
    ['TASK','FAMILY','INPUT'].forEach((s,i)=>{let x=19+i*128;v+=rect(x,275,111,39,C.paper,C.ink)+text(x+55,299,s,11,C.ink,'text-anchor="middle" font-weight="700"');});
    return svg(420,332,'Whole-screen construction schematic','A screen contains a protected task region, status and an action group. Task, component family and input ownership are constructed together.',v);
  }
  function composition(route){
    let v=label(22,22,'CONSTRUCTION MAP / '+route.title.toUpperCase());
    v+=screen(22,36,656,250);
    const m=route.mode;
    if(m==='action'){
      v+=protectedArea(189,73,306,178,'AIM / THREAT / PATH');
      v+=circle(343,163,46,'none',C.blue)+line(332,163,354,163,C.blue)+line(343,152,343,174,C.blue);
      v+=path('M211 232L290 212L363 224L472 121','none',C.quiet,'stroke-width="2"');
      v+=rect(39,78,121,37,C.paper,C.line)+text(51,101,'Live status',12)+pill(526,226,127,'Action group');
      v+=label(528,97,'UTILITY');v+=arrow('M528 207L500 198');
    }else if(m==='path'){
      v+=protectedArea(112,78,441,174,'LANDING + ROUTE ENVELOPE');
      [[146,207,66],[246,166,63],[349,130,63],[465,102,54]].forEach(([x,y,w])=>{v+=rect(x,y,w,11,C.ink,C.ink);});
      v+=arrow('M171 193Q223 108 277 153Q325 72 380 117Q421 68 486 90');
      v+=circle(170,184,10,C.green)+pill(563,207,95,'Movement')+label(44,76,'PROGRESS')+label(41,265,'RECOVERY QUALIFIER');
    }else if(m==='racing'){
      v+=path('M260 262L320 83H402L462 262Z',C.pale,C.blue,'stroke-dasharray="5 4" stroke-width="2"');
      v+=path('M301 259L343 90M420 259L379 90','none',C.ink);v+=line(361,104,361,249,C.quiet,'stroke-dasharray="9 10"');
      v+=rect(338,210,46,33,C.green,C.ink,'rx="2"')+label(325,76,'ROUTE');
      v+=rect(42,78,143,57,C.paper,C.line)+text(55,101,'Position / time',12)+text(55,122,'Priority by task',10,C.quiet);
      v+=pill(515,225,132,'Actual controls')+label(521,91,'SPEED / STATUS');
    }else if(m==='board'){
      v+=protectedArea(126,73,349,189,'FULL RELEVANT BOARD');
      for(let y=0;y<4;y++)for(let x=0;x<6;x++)v+=rect(144+x*50,101+y*35,42,28,(x===2&&y===1)?C.green:C.paper,C.line);
      v+=path('M265 150L315 150L315 185','none',C.orange,'stroke-width="3"');
      v+=rect(500,107,158,74,C.paper,C.line)+text(513,130,'Legal move',13)+text(513,151,'Consequence',11,C.quiet)+pill(505,204,73,'Undo')+pill(585,204,72,'Reset',C.paper,C.ink);
    }else if(m==='turn'){
      v+=rect(40,82,134,133,C.paper,C.line)+text(54,105,'Current actor',12,C.ink,'font-weight="700"')+circle(102,150,27,C.green)+label(69,197,'IDENTITY');
      v+=rect(197,83,181,132,C.paper,C.line)+text(210,105,'Legal actions',12,C.ink,'font-weight="700"');
      ['Action A / cost','Action B / cost','Unavailable / reason'].forEach((s,i)=>v+=text(211,134+i*28,s,11,i===2?C.quiet:C.ink));
      v+=protectedArea(403,82,244,133,'TARGET + EFFECT');v+=circle(467,153,22,C.paper)+circle(570,153,22,C.green)+arrow('M491 153H542');
      v+=pill(398,234,144,'Select target',C.paper,C.ink)+pill(551,234,100,'Commit',C.orange)+arrow('M171 151H195');
    }else if(m==='strategy'){
      v+=protectedArea(40,79,408,184,'MAP / SYSTEM');
      [[88,151],[201,104],[245,211],[370,149]].forEach(([x,y],i)=>{v+=circle(x,y,17,i===2?C.green:C.paper);v+=text(x,y+4,String(i+1),11,C.ink,'text-anchor="middle"');});
      v+=line(104,144,186,111,C.quiet)+line(204,124,240,192,C.quiet)+line(261,200,354,161,C.quiet);
      v+=rect(476,76,180,190,C.paper,C.ink)+text(490,101,'Selected subject',13,C.ink,'font-weight="700"')+text(490,132,'Current / required',11)+text(490,159,'Command effect',11)+text(490,186,'Time stays explicit',10,C.quiet)+pill(489,219,153,'Local command');
    }else if(m==='resources'){
      v+=rect(43,76,612,192,C.paper,C.ink)+label(58,100,'IDENTITY')+label(235,100,'CURRENT / NEED')+label(415,100,'CONSEQUENCE')+label(568,100,'ACTION');
      ['Candidate A','Candidate B','Candidate C'].forEach((s,i)=>{let y=120+i*46;v+=line(55,y+33,642,y+33,C.line)+text(58,y+18,s,12)+text(251,y+18,i===1?'x < required':'x ≥ required',11)+text(416,y+18,'Actual effect',11,C.quiet)+pill(558,y,81,i===1?'Reason':'Commit',i===1?C.pale:C.ink,i===1?C.quiet:C.paper);});
    }else if(m==='objects'){
      v+=rect(40,80,126,183,C.paper,C.line)+label(51,100,'COLLECTION');
      for(let i=0;i<4;i++)v+=rect(53,115+i*33,100,26,i===1?C.green:C.paper,C.line)+text(63,133+i*33,'Object '+(i+1),11);
      v+=rect(190,80,198,183,C.pale,C.line)+path('M289 110L343 160L289 211L236 160Z',C.paper,C.ink)+label(218,247,'OBJECT IDENTITY');
      v+=rect(414,80,239,183,C.paper,C.ink)+text(428,105,'Selected object',13,C.ink,'font-weight="700"')+text(428,139,'Compare / attributes',12)+text(428,171,'Cost + requirements',11)+pill(429,218,207,'Actual commitment',C.orange);
    }else if(m==='gateway'){
      v+=rect(45,80,222,183,C.pale,C.line)+label(58,104,'SESSION / WORLD IDENTITY')+path('M65 231L104 178L148 211L199 142L245 231','none',C.ink,'stroke-width="2"');
      v+=rect(297,79,350,184,C.paper,C.ink)+text(317,111,'Enter this session',20,C.ink,'font-weight="700"')+text(317,143,'Only actual prerequisites',12)+line(316,159,624,159,C.line)+text(317,181,'Ready / blocked / loading',11,C.quiet)+pill(317,214,188,'Next commitment',C.orange)+label(523,235,'HELP / BACK');
    }else if(m==='rhythm'){
      v+=protectedArea(118,73,403,190,'INCOMING EVENTS + TIMING WINDOW');
      for(let i=0;i<4;i++){let x=156+i*91;v+=rect(x,104,68,145,C.paper,C.line);v+=circle(x+34,131+(i%2)*35,12,C.green);v+=line(x+7,225,x+61,225,C.orange,'stroke-width="3"');}
      v+=label(542,112,'SCORE / STATUS')+text(542,149,'Static feedback',11,C.quiet)+text(542,172,'beside timing',11,C.quiet);
    }else if(m==='story'){
      v+=protectedArea(44,78,253,186,'SCENE SUBJECT');v+=circle(168,137,25,C.paper)+path('M126 227V195Q167 160 210 195V227',C.pale,C.ink);
      v+=rect(323,79,328,184,C.paper,C.ink)+text(339,105,'Speaker / scene identity',13,C.ink,'font-weight="700"');
      [0,1,2].forEach(i=>v+=line(339,130+i*15,621-(i*25),130+i*15,C.quiet));
      v+=pill(339,190,296,'Legal choice A',C.green,C.ink)+pill(339,227,296,'Legal choice B',C.paper,C.ink);
    }else if(m==='arrange'){
      v+=protectedArea(45,81,409,183,'SPATIAL WORKSPACE');
      for(let i=0;i<5;i++)v+=line(68,119+i*29,432,119+i*29,C.line);
      v+=rect(196,135,91,72,C.green,C.ink)+rect(184,123,115,96,'none',C.blue,'stroke-dasharray="4 3"');
      [[184,123],[299,123],[184,219],[299,219]].forEach(([x,y])=>v+=rect(x-3,y-3,6,6,C.paper,C.blue));
      v+=arrow('M321 183Q348 175 366 138')+label(84,249,'PREVIEW ≠ COMMIT');
      v+=rect(480,80,175,185,C.paper,C.ink)+text(494,107,'Tool / selection',13,C.ink,'font-weight="700"')+text(494,138,'Valid placement',11)+text(494,164,'Transform values',11)+pill(493,222,150,'Place / commit');
    }
    v+=label(23,315,'MEASURE REAL VIEWPORT, CONTENT, CAMERA & INPUT BEFORE IMPLEMENTATION');
    return svg(700,340,route.title+' construction map',route.build+' Exception: '+route.exception,v);
  }
  function planes(){
    let v=label(23,26,'SCENE-DOMINANT / CONTINUOUS WORLD READING')+label(465,26,'DECISION-DOMINANT / COMPARISON & COMMIT');
    v+=screen(23,42,397,225)+screen(464,42,397,225);
    v+=protectedArea(104,90,206,134,'PATH / AIM');v+=path('M119 209L172 160L219 181L294 119','none',C.ink,'stroke-width="2"')+circle(172,160,9,C.green);
    v+=rect(36,82,56,22,C.paper,C.line)+label(39,98,'HUD')+pill(318,218,87,'Action');
    v+=rect(479,78,94,173,C.pale,C.line)+label(489,99,'SUBJECT');v+=path('M524 127L552 163L524 199L496 163Z',C.paper,C.ink);
    v+=rect(586,78,259,173,C.paper,C.ink)+text(601,104,'Identity + comparison',14,C.ink,'font-weight="700"')+text(601,135,'Current / required',12)+text(601,163,'Cost / consequence',12)+pill(603,202,224,'Local commitment',C.orange);
    v+=text(23,293,'Controls support scene reading.',12,C.quiet)+text(464,293,'The decision plane is the task.',12,C.quiet);
    return svg(886,318,'Scene and decision-plane construction comparison','The first arrangement protects a central world route and places small controls around it. The second prioritizes a subject and adjacent comparison, cost and commitment sheet. Both are conditional.',v);
  }
  function sequence(active){
    const stages=[['entry','ENTRY','Identity / next action'],['setup','SETUP, IF REAL','Prerequisites / readiness'],['play','FIRST ACTION','Object / input / consequence'],['return','RESULT & RETURN','Outcome / reset scope']];
    let v=label(22,24,'ONE LIFECYCLE / FOUR CONDITIONAL COMPOSITIONS');
    stages.forEach(([id,title,sub],i)=>{let x=22+i*221,selected=id===active;v+=rect(x,47,199,224,selected?C.paper:'#e5eadf',selected?C.orange:C.line,selected?'stroke-width="2"':'');v+=label(x+12,68,(i+1)+' / '+title,selected?C.orange:C.quiet);
      v+=rect(x+12,80,175,116,'GRID',C.line);
      if(id==='entry'){v+=text(x+28,109,'Session identity',13,C.ink,'font-weight="700"')+line(x+28,123,x+159,123,C.line)+pill(x+28,146,133,'Enter',C.orange);}
      else if(id==='setup'){v+=text(x+27,108,'Required choice',11)+rect(x+27,117,140,25,C.paper,C.ink)+text(x+35,134,'Value / condition',10)+pill(x+27,151,140,'Ready',C.ink);}
      else if(id==='play'){v+=protectedArea(x+36,100,109,76,'TASK')+circle(x+91,145,10,C.green)+text(x+27,188,'First input → consequence',9,C.quiet);}
      else{v+=text(x+28,109,'Actual outcome',14,C.ink,'font-weight="700"')+text(x+28,130,'Qualifier stays attached',9,C.quiet)+pill(x+28,152,63,'Retry',C.orange)+pill(x+99,152,71,'Return',C.paper,C.ink);}
      v+=text(x+12,221,sub,10,C.ink);v+=label(x+12,250,selected?'CURRENT CONSTRUCTION FOCUS':'RETAIN / REPLACE / RESTORE',selected?C.orange:C.quiet);
      if(i<3)v+=arrow(`M${x+202} 138H${x+217}`);
    });
    v+=line(810,288,113,288,C.blue)+path('M113 283L105 288L113 293','none',C.blue)+label(286,308,'ACTUAL RETURN PATH / PRESERVED STATE / RESET OR LOSS SCOPE',C.blue);
    return svg(900,331,'Entry to first action and return construction strip','Four schematics show entry identity, conditional setup, first playable action and result with return. The selected phase is '+active+'. The actual return path and preserved/reset state must be specified.',v);
  }
  function ownership(dialog,notice){
    let v=label(22,25,'OCCUPANCY MAP / SHARED COORDINATES')+label(574,25,'LAYER / INPUT / LIFETIME');
    v+=screen(22,43,516,280);
    v+=protectedArea(124,118,280,130,'LIVE HAZARD / ROUTE');
    v+=rect(36,79,102,35,C.paper,C.ink)+text(46,101,'Essential HUD',11);
    v+=rect(430,79,93,35,C.paper,C.ink)+text(444,101,'Utility',11);
    v+=path('M151 233L226 174L292 214L377 141','none',C.quiet,'stroke-width="2"');
    if(dialog){v+=rect(164,119,338,168,C.paper,C.orange,'stroke-width="2"')+text(183,146,'Decision dialog',16,C.ink,'font-weight="700"')+text(183,173,'Subject / cost / consequence',12)+pill(182,237,154,'Commit',C.orange)+pill(347,237,135,'Cancel',C.paper,C.ink);v+=label(40,305,'HUD RETAINED · WORLD INPUT SUSPENDED');}
    else{v+=circle(272,181,10,C.green)+pill(415,275,105,'World action');v+=label(40,305,'WORLD OWNS INPUT');}
    if(notice&&!dialog)v+=rect(160,79,239,28,C.green,C.ink)+text(173,97,'Nonurgent notice in reserved slot',10);
    if(notice&&dialog)v+=rect(577,280,281,41,C.pale,C.line)+text(590,304,'Notice queued until decision closes',11,C.quiet);
    const rows=[['Platform / safe area','system','persistent'],['HUD / hazard','read-only','retained'],['World + prompts',dialog?'suspended':'world input','active play'],['Decision dialog',dialog?'dialog input':'not open',dialog?'temporary':'inactive'],['Nonurgent notice',notice?(dialog?'queued':'read-only'):'not shown','bounded']];
    rows.forEach((r,i)=>{let y=54+i*44;v+=rect(574,y,286,40,(r[0]==='Decision dialog'&&dialog)?'#f6e5d7':C.paper,C.line)+text(586,y+16,r[0],11,C.ink,'font-weight="700"')+text(586,y+31,r[1]+' · '+r[2],10,C.quiet);});
    v+=label(22,351,'ILLUSTRATED POLICY: NONURGENT NOTICE QUEUES; ESSENTIAL HUD STAYS');
    return svg(884,376,'Shared layer occupancy and input ownership map','Essential HUD remains reserved. '+(dialog?'The decision dialog takes input and suspends world interaction. ':'The world takes input. ')+(notice?(dialog?'A nonurgent notice queues until the dialog closes.':'The notice uses a reserved top slot.'):'The notice is not shown.')+' This is a teaching policy; real live hazard and pause behavior must be declared.',v);
  }
  function anatomy(){
    let v=label(23,25,'EXPLODED BOUNDS / NOT A SINGLE RECTANGLE')+label(438,25,'TOP VIEW / CONTENT BUDGET');
    const layers=[{y:47,w:348,h:70,x:26,fill:'none',stroke:C.orange,name:'TARGET / input shell',dash:true},{y:131,w:321,h:64,x:40,fill:C.ink,stroke:C.ink,name:'SILHOUETTE / contour'},{y:210,w:288,h:50,x:57,fill:C.paper,stroke:C.blue,name:'FACE / readable surface'},{y:276,w:210,h:36,x:96,fill:C.green,stroke:C.ink,name:'INK / actual glyph extents'}];
    layers.forEach((a,i)=>{v+=rect(a.x,a.y,a.w,a.h,a.fill,a.stroke,a.dash?'stroke-dasharray="5 4" stroke-width="1.5"':'')+text(a.x+a.w/2,a.y+a.h/2+5,i===3?'Enter expedition':a.name,12,i===1?C.paper:C.ink,'text-anchor="middle" font-weight="700"');if(i>0)v+=line(a.x,a.y-13,a.x,a.y-3,C.line)+line(a.x+a.w,a.y-13,a.x+a.w,a.y-3,C.line);});
    v+=rect(438,64,367,159,'none',C.orange,'stroke-dasharray="5 4"');v+=rect(451,80,340,128,C.ink,C.ink);v+=rect(464,92,314,98,C.paper,C.blue);v+=rect(496,119,249,39,C.green,C.ink);
    v+=rect(497,120,32,37,'none',C.blue)+path('M506 140H521M515 134L522 140L515 146','none',C.ink,'stroke-width="2"')+text(541,145,'Enter expedition',16,C.ink,'font-weight="700"');
    v+=line(464,52,778,52,C.ink)+line(464,47,464,57,C.ink)+line(778,47,778,57,C.ink)+text(621,46,'face width = ink + slots + gaps + insets',10,C.quiet,'text-anchor="middle"');
    v+=line(819,92,819,190,C.ink)+line(814,92,824,92,C.ink)+line(814,190,824,190,C.ink)+text(835,148,'H',13);
    v+=label(466,184,'INSET')+label(545,183,'LIVE LABEL / BASELINE')+label(701,184,'INSET');
    v+=label(440,257,'PRESS: FIXED SHELL / MOVING FACE ONLY');
    [0,1].forEach(i=>{let x=452+i*185;v+=rect(x,274,155,61,'none',C.orange,'stroke-dasharray="4 3"')+rect(x+8,281,139,45,C.ink,C.ink)+rect(x+13,286+i*4,129,31,C.green,C.ink)+text(x+78,307+i*4,i?'PRESSED':'REST',11,C.ink,'text-anchor="middle" font-weight="700"');});
    v+=line(452,347,791,347,C.orange)+text(452,365,'Same target and neighbor footprint',11,C.quiet);
    v+=label(24,365,'SYMBOLIC GEOMETRY / RESOLVE REAL UNITS & LONGEST STRINGS');
    return svg(864,391,'Target silhouette face and ink exploded construction diagram','Four distinct bounds are stacked: stable interaction target, visible contour, readable face and actual label/icon ink. The top view shows live label, optional icon and insets. A press changes only the face, leaving the shell steady.',v);
  }
  function grammar(material,busy){
    const mat=window.FrameworkReaderData.materials[material];
    const bg=busy?'GRID':'#d9e4d0';
    let v=label(22,25,'ORIGINAL FAMILY SPECIMEN / '+mat.name.toUpperCase())+label(537,25,'STRUCTURAL AXES');
    v+=rect(22,43,487,279,bg,C.line);
    if(busy){v+=path('M24 239L104 115L191 233L274 92L358 196L418 132L508 249','none','#9dae94','stroke-width="12"');v+=circle(432,89,28,'none','#b5c2a9','stroke-width="5"');}
    v+=rect(39,60,451,239,material==='metal'?'#dbe4dd':material==='paper'?'#eee4c8':'#edf1e3',C.ink);
    const button=(x,y,w,s,role)=>{
      if(material==='metal'){
        let fill=role==='primary'?'#bd642e':role==='utility'?'#315b6e':'#d0d9d3';
        return path(`M${x+8} ${y+6}H${x+w-8}L${x+w} ${y+14}V${y+46}L${x+w-8} ${y+54}H${x+8}L${x} ${y+46}V${y+14}Z`,'#233b41',C.ink)+path(`M${x+8} ${y}H${x+w-8}L${x+w} ${y+8}V${y+39}L${x+w-8} ${y+47}H${x+8}L${x} ${y+39}V${y+8}Z`,fill,C.ink,'stroke-width="2"')+line(x+12,y+5,x+w-12,y+5,'#e3c697')+text(x+w/2,y+29,s,14,role==='status'?C.ink:C.paper,'text-anchor="middle" font-weight="700"');
      }
      if(material==='paper'){
        const fill=role==='primary'?'#873b29':role==='utility'?'#faf2dc':'#e4d8b7';
        return rect(x+3,y+4,w,47,'#c0ac7f','none')+path(`M${x} ${y+3}L${x+15} ${y}L${x+w-6} ${y+2}L${x+w} ${y+43}L${x+w-14} ${y+48}L${x+2} ${y+46}Z`,fill,'#715d37')+text(x+w/2,y+29,s,14,role==='primary'?C.paper:'#493e2f','text-anchor="middle" font-weight="700"');
      }
      let fill=role==='primary'?'#c7eab5':role==='utility'?C.paper:'#e0e6d6';
      return rect(x+4,y+5,w,45,C.ink,C.ink)+rect(x,y,w,45,fill,C.ink,'stroke-width="2"')+text(x+w/2,y+28,s,14,C.ink,'text-anchor="middle" font-weight="700"');
    };
    v+=text(57,89,'One edge / type / rank logic',16,C.ink,'font-weight="700"');
    v+=label(57,112,'COMMAND')+button(57,126,236,'Enter expedition','primary');
    v+=label(322,112,'UTILITY')+button(322,126,145,'Settings','utility');
    v+=label(57,210,'STATUS / NOT A COMMAND')+rect(57,223,410,48,material==='paper'?'#e6daba':'#dde5d6',C.line)+text(73,253,'Supplies',12)+text(447,253,'current / required',12,C.quiet,'text-anchor="end"');
    const axes=[['01','CONTOUR','Caps, corner, boundary mass'],['02','MATERIAL','Face / rim / body / shadow'],['03','TYPE','Baseline, role, actual glyphs'],['04','TEXTURE','Frequency outside ink field'],['05','COLOR','Role + state + scene pairing']];
    axes.forEach(([n,a,b],i)=>{let y=47+i*55;v+=text(540,y+15,n,11,C.orange,'font-family="monospace"')+text(574,y+15,a,11,C.ink,'font-weight="700"')+text(574,y+33,b,11,C.quiet)+line(538,y+43,835,y+43,C.line);});
    v+=label(22,350,'SAME TEACHING CONTENT / DIFFERENT COHERENT GRAMMARS / NO MEASURED BENEFIT CLAIM');
    return svg(860,376,mat.name+' material family construction specimen','A command, utility and read-only status share a chosen material grammar. '+mat.contour+'. '+mat.material+'. '+mat.type+'. '+mat.texture+'. '+mat.color+'. The background is '+(busy?'a synthetic busy underlay':'a quiet synthetic underlay')+', not a game scene.',v);
  }
  function mask(show){
    let v=label(22,25,'ORNAMENT CARRIER ≠ READABLE FACE')+label(470,25,'SLICE MAP / PRESERVE CAPS');
    v+=path('M37 75L67 55L367 55L400 81L393 269L363 292L66 288L37 263Z','#dbcba9',C.ink,'stroke-width="2"');
    v+=path('M37 75L85 96L75 142L39 157M399 80L350 99L361 144L396 156M41 264L91 245L82 210M390 268L344 245L351 211','none','#8c7650','stroke-width="3"');
    v+=rect(83,95,271,153,C.paper,'#a8956e');v+=text(100,121,'Panel identity',15,C.ink,'font-weight="700"')+line(100,133,336,133,C.line);
    [0,1,2].forEach(i=>v+=rect(100,145+i*21,236,17,'#e8eddf',C.line)+text(109,157+i*21,'Content row '+(i+1),9,C.quiet));
    v+=pill(100,210,235,'Stable footer action');
    if(show){v+=rect(94,104,249,140,'none',C.blue,'stroke-dasharray="5 4" stroke-width="2"')+rect(38,55,45,234,'HATCH','none')+rect(354,56,44,229,'HATCH','none')+rect(83,56,271,39,'HATCH','none')+rect(82,249,272,39,'HATCH','none');}
    v+=label(86,320,show?'BLUE: CONTENT-SAFE / HATCH: ORNAMENT':'SAFE MASK HIDDEN; BOUNDS STILL EXIST',C.blue);
    const x=485,y=63;v+=rect(x,y,325,138,C.paper,C.ink);
    [0,1,2].forEach(r=>[0,1,2].forEach(c=>{let cx=x+[0,44,281][c],cy=y+[0,36,102][r],w=[44,237,44][c],h=[36,66,36][r];v+=rect(cx,cy,w,h,(c!==1&&r!==1)?'#c7d9ba':c===1&&r===1?'HATCH':'#e7ecdf',C.line);}));
    v+=text(x+22,y+23,'FIX',9,C.ink,'text-anchor="middle"')+text(x+163,y+76,'STRETCH / TILE',12,C.ink,'text-anchor="middle"')+text(x+303,y+23,'FIX',9,C.ink,'text-anchor="middle"');
    v+=arrow('M562 218H732')+label(542,242,'WIDER FACE / FIXED CORNERS');
    v+=rect(485,255,325,43,C.ink,C.ink)+rect(491,261,313,29,C.paper,C.blue)+text(647,281,'Independent live label',12,C.ink,'text-anchor="middle"');
    v+=label(486,321,'TYPE + STATE ARE NOT BAKED INTO THE ART');
    return svg(850,347,'Ornament-safe mask and nine-slice construction map','A paper-like ornament carrier contains a quiet interior. The safe mask excludes decorative corners, rim and folds. A separate nine-slice map fixes corner pieces and stretches or tiles only the permitted middle. Text remains independent.',v);
  }
  function state(){
    let v=label(23,26,'PERSISTENT SELECTION + MOMENTARY FOCUS CAN COEXIST');
    [0,1,2].forEach(i=>{let x=24+i*215;v+=rect(x,55,194,67,i===1?C.green:C.paper,C.ink,'stroke-width="1.5"');v+=text(x+16,82,['Option A','Option B','Option C'][i],14,C.ink,'font-weight="700"');v+=text(x+16,106,i===1?'✓ Current selection':'Available alternative',10,C.quiet);if(i===1)v+=rect(x-5,50,204,77,'none',C.blue,'stroke-width="2"');});
    v+=label(28,149,'CHOICE'),v+=label(247,149,'CHOICE + CURRENT + FOCUS',C.blue),v+=label(459,149,'CHOICE');
    v+=line(28,173,813,173,C.line)+label(28,199,'MOTION CONTRACT / MOVING PART, FIXED SHELL, SETTLED MEANING');
    const steps=[['BEFORE','Ready',0],['DURING','Pressed',4],['SETTLED','✓ Selected',0]];
    steps.forEach(([a,b,shift],i)=>{let x=29+i*270;v+=label(x,224,a)+rect(x,238,234,74,'none',C.orange,'stroke-dasharray="5 4"')+rect(x+9,247,216,54,C.ink,C.ink)+rect(x+15,253+shift,204,35,C.green,C.ink)+text(x+117,276+shift,b,13,C.ink,'text-anchor="middle" font-weight="700"');if(i<2)v+=arrow(`M${x+240} 275H${x+262}`);});
    v+=label(28,340,'THE SETTLED MARKER CARRIES MEANING EVEN WITH REDUCED MOTION');
    return svg(850,365,'Independent selection focus and motion-state construction','Option B has a persistent current marker and a separate focus outline. The press sequence moves only the inner face within a fixed shell and settles into a visible selected marker. Motion is not the only meaning channel.',v);
  }
  return {hero,composition,planes,sequence,ownership,anatomy,grammar,mask,state};
})();
