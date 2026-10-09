#!/usr/bin/env python3
"""Browser-free reader contract checks; never a visual acceptance test."""
from pathlib import Path
from html.parser import HTMLParser
import json, re, subprocess, xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parent
BASE = ROOT.parent
results = []
def check(name, passed, detail):
    results.append({'check':name,'status':'passed' if passed else 'failed','detail':detail})
class Markup(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.assets=[];self.links=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id'):self.ids.append(attrs['id'])
        if tag=='script' and attrs.get('src'):self.assets.append(attrs['src'])
        if tag=='link' and attrs.get('rel')=='stylesheet':self.assets.append(attrs.get('href'))
        if tag=='a' and attrs.get('href'):self.links.append(attrs['href'])
p=Markup();p.feed((ROOT/'index.html').read_text())
check('HTML unique IDs',len(p.ids)==len(set(p.ids)),f'{len(p.ids)} named elements')
check('Declared local assets',all((ROOT/a).is_file() for a in p.assets),', '.join(p.assets))
check('No external assets/fonts',all(not re.search(r'https?://',a) for a in p.assets) and not re.search(r'@import|url\(\s*[\x22\x27]?https?://',(ROOT/'reader.css').read_text()),'Only local JS/CSS and system font stacks')
js=(ROOT/'reader.js').read_text();needed=set(re.findall(r"\$\('([^']+)'\)",js))
check('DOM IDs used by behavior',not (needed-set(p.ids)),'Missing: '+', '.join(sorted(needed-set(p.ids))))
for f in ROOT.glob('*.js'):
    run=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    check('JavaScript syntax: '+f.name,run.returncode==0,run.stderr.strip() or 'Node parse passed')
node_code="""
const fs=require('fs'),vm=require('vm');const ctx={window:{},console};vm.createContext(ctx);
for(const name of ['data.js','diagrams.js'])vm.runInContext(fs.readFileSync(process.argv[1]+'/'+name,'utf8'),ctx);
const D=ctx.window.FrameworkReaderData,F=ctx.window.FrameworkDiagrams;
let svgs=[['hero',F.hero()],['planes',F.planes()],['anatomy',F.anatomy()],['states',F.state()]];
for(const r of D.routes)svgs.push(['route-'+r.id,F.composition(r)]);
for(const phase of Object.keys(D.phases))svgs.push(['phase-'+phase,F.sequence(phase)]);
for(const m of Object.keys(D.materials))for(const b of [false,true])svgs.push(['grammar-'+m+'-'+b,F.grammar(m,b)]);
for(const d of [false,true])for(const n of [false,true])svgs.push(['layers-'+d+'-'+n,F.ownership(d,n)]);
for(const b of [false,true])svgs.push(['mask-'+b,F.mask(b)]);
process.stdout.write(JSON.stringify({svgs,routes:D.routes,fallback:ctx.window.FrameworkReaderFallback}));
"""
run=subprocess.run(['node','-e',node_code,str(ROOT)],capture_output=True,text=True)
check('All diagram variants execute',run.returncode==0,run.stderr.strip() or 'Original SVG variants generated without a browser')
if run.returncode==0:
    out=json.loads(run.stdout);bad=[];ns={'s':'http://www.w3.org/2000/svg'}
    for name,code in out['svgs']:
        try:
            tree=ET.fromstring(code)
            if tree.attrib.get('role')!='img' or tree.find('s:title',ns) is None or tree.find('s:desc',ns) is None:bad.append(name+': missing SVG accessibility')
            ids={el.attrib.get('id') for el in tree.iter() if el.attrib.get('id')}
            if not set(tree.attrib.get('aria-labelledby','').split())<=ids:bad.append(name+': invalid aria-labelledby')
            if any(x in code for x in ['fill="GRID"','fill="HATCH"','marker-end="ARROW"']):bad.append(name+': unresolved SVG placeholder')
        except ET.ParseError as e:bad.append(name+': '+str(e))
    check('SVG XML and accessible descriptions',not bad,f"{len(out['svgs'])} variants; "+('; '.join(bad) or 'all valid'))
    mask_tree=ET.fromstring(dict(out['svgs'])['mask-true'])
    rects=mask_tree.findall('s:rect',ns)
    safe=next(r for r in rects if r.attrib.get('stroke')=='#155a79' and r.attrib.get('stroke-dasharray')=='5 4')
    face=next(r for r in rects if r.attrib.get('stroke')=='#a8956e')
    footer=next(r for r in rects if r.attrib.get('x')=='100' and r.attrib.get('width')=='235' and r.attrib.get('height')=='30')
    rows=[r for r in rects if r.attrib.get('fill')=='#e8eddf']
    def box(r):
        x,y,w,h=(float(r.attrib[k]) for k in ['x','y','width','height'])
        return x,y,x+w,y+h
    def contains(outer,inner):
        a,b,c,d=box(outer);e,f,g,h=box(inner)
        return a<=e and b<=f and c>=g and d>=h
    row_end=max(box(r)[3] for r in rows)
    footer_top,footer_bottom=box(footer)[1],box(footer)[3]
    gap=footer_top-row_end
    inset=box(safe)[3]-footer_bottom
    mask_ok=len(rows)==3 and contains(safe,footer) and contains(face,footer) and all(contains(safe,r) for r in rows) and gap>=6 and inset>=4
    check('Safe-mask footer geometry regression',mask_ok,f'Footer bottom={footer_bottom:g}, safe bottom={box(safe)[3]:g}, readable-face bottom={box(face)[3]:g}, row/footer gap={gap:g}, safe bottom inset={inset:g}; logical geometry only')

    route_required=['id','title','genres','condition','build','exception','inputs','outputs','tests','recipe_ids']
    check('Conditional route records',all(all(r.get(k) for k in route_required) for r in out['routes']),f"{len(out['routes'])} authored task routes with condition and exception")
    release=json.loads((BASE/'release/display.json').read_text())
    public_sources=json.loads((BASE/'release/sources.json').read_text())['sources']
    public_urls={record['url'] for record in public_sources}
    def provenance_urls(value):
        if isinstance(value,dict):
            if 'source_evidence' in value:
                for record in value['source_evidence']:
                    if record.get('url'):yield record['url']
            for child in value.values():yield from provenance_urls(child)
        elif isinstance(value,list):
            for child in value:yield from provenance_urls(child)
    exposed_urls=list(provenance_urls(release))+list(provenance_urls(out['fallback']))
    check('Public-safe loaded and fallback provenance', all(url in public_urls for url in exposed_urls), f'{len(exposed_urls)} exposed provenance references match the included public/authored source ledger; omitted case records cannot reappear in fallback')
    instruction_bytes=(BASE/'release/AI_INSTRUCTIONS.md').read_bytes()
    check('Full maker base exact embedding',isinstance(release.get('maker_instructions'),str) and release['maker_instructions'].encode('utf-8')==instruction_bytes,'display.maker_instructions must match complete AI_INSTRUCTIONS.md bytes')
    unmapped=[r['id'] for r in out['routes'] if not any(set(r['recipe_ids']) & ({p['id']}|set(p.get('candidate_ids',[]))) for p in release['recipes'])]
    check('Route-to-production recipe mapping',not unmapped,'Unmapped routes: '+', '.join(unmapped))
    missing=[d['path'] for d in release['downloads'] if not (ROOT/d['path']).is_file()]
    check('Release-declared downloads',not missing,'Missing: '+', '.join(missing))
    details=json.loads((BASE/'release/recipe-details.json').read_text())
    originals=[r['original_record'] for r in details['candidates'] if r['id'].startswith('RB-')]
    fallback={r['id']:r for r in out['fallback']['recipes']}
    check('Fallback prohibition fidelity',len(originals)==12 and all(fallback[r['id']].get('avoid',[])==r.get('do_not_apply',[]) for r in originals),'Bundled original do_not_apply retained as avoid, separate from exception; no raw-research dependency')
    check('Explicit fallback status', 'release data not loaded' in out['fallback']['status'].lower() and 'Current production packet did not load' in js,'Visible warning plus pinned research-extract status')
runtime=subprocess.run(['node',str(ROOT/'check-runtime.cjs')],capture_output=True,text=True)
check('Mock-DOM initializer and controls',runtime.returncode==0,runtime.stderr.strip() or 'Loaded/fallback modes, all 12 copy+download packets, exact full base, conditional subsets, source references, layer/mask/search; no browser/render/input acceptance')
report={'scope':'browser_free_structural_checks_only','visual_browser_QA':'not_run_in_this_report','target_game_render_and_input':'not_run','integration_links':{'home':'../../','production_packet':'../release/README.md','release':'../release/'},'checks':results}
(ROOT/'STRUCTURAL_CHECKS.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
raise SystemExit(1 if any(r['status']=='failed' for r in results) else 0)
