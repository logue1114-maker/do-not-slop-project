#!/usr/bin/env python3
"""Static and JavaScript unit checks only; these do not measure usability."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,subprocess,tempfile
from datetime import datetime,timezone
import hashlib
P=Path(__file__).resolve().parent
rules=json.loads((P/'rules.json').read_text()); sources=json.loads((P/'sources.json').read_text())
checks=[]
def check(name,value):
 checks.append({'name':name,'result':'passed' if value else 'failed'})
 if not value: raise AssertionError(name)
check('exact_project_name',rules['project']==sources['project']=='Do Not Slop Project')
check('nine_rules',len(rules['rules'])==9)
ids=[r['id'] for r in rules['rules']]; src={s['id']:s for s in sources['sources']}
check('unique_rule_and_source_ids',len(set(ids))==9 and len(src)==len(sources['sources']))
for r in rules['rules']:
 check(r['id']+'_input_output_and_counterexample',all(r[k] for k in ['inputs','signals','before','after','operation','procedure','preserved_conditions','exceptions']) and all(r['tests'][k] for k in ['positive','negative']))
 check(r['id']+'_source_trace',all(x in src for x in r['source_ids']))
 check(r['id']+'_severity_enum',r['default_severity'] in ['R0','R1','R2'])
for s in sources['sources']:
 check(s['id']+'_quote_limit',not s['quote'] or len(s['quote']['text'].split())<=25)
 check(s['id']+'_has_scope_boundary',bool(s['boundary']) and s['url'].startswith('https://'))
public_text='\n'.join((P/name).read_text() for name in ['README.md','manual_ko.md','sources.json','rules.json','copy_examples.html'])
for source in sources['sources']:
 if source['quote']:
  quoted=source['quote']['text'];check(source['id']+'_aggregate_quote_limit',len(quoted.split())*public_text.count(quoted)<=25)
html=(P/'copy_examples.html').read_text();script=html.split('<script>')[1].split('</script>')[0]
check('html_korean_language','<html lang="ko">' in html)
check('state_selector_hidden_css_override',bool(re.search(r'#state-wrap\[hidden\]\s*\{\s*display\s*:\s*none\s*;?\s*\}',html)))
check('no_external_assets_or_network_calls',not re.search(r'(?:src|href)=[\"\']https?://|fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|WebSocket',html))
check('no_storage_or_external_mutations',not re.search(r'localStorage|sessionStorage|document\.cookie|form[^>]+action=',html))
check('protected_conditions_visible_in_examples',all(x in html for x in ['9,900','7일','자동 결제','10MB','14MB','30일','3개','8명','주 1회']))
class Markup(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.assets=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.append(d['id'])
  if tag in ['script','img','link','iframe'] and (d.get('src') or d.get('href')):self.assets.append(d)
m=Markup();m.feed(html);check('unique_static_dom_ids',len(m.ids)==len(set(m.ids)))
check('self_contained_assets',not m.assets)
with tempfile.TemporaryDirectory() as t:
 path=Path(t)/'script.js';path.write_text(script)
 subprocess.run(['node','--check',str(path)],check=True,capture_output=True)
check('javascript_syntax',True)
# This VM is a unit harness with fake DOM nodes, not a browser or visual test.
harness=r'''
const vm=require('vm'),fs=require('fs');
const nodes={};const node=()=>({innerHTML:'',textContent:'',hidden:false,value:'',handlers:{},addEventListener(name,fn){this.handlers[name]=fn}});
const document={querySelector(s){return nodes[s]||(nodes[s]=node())},querySelectorAll(){return []}};
const context=vm.createContext({document,window:{},console});
vm.runInContext(fs.readFileSync(process.argv[2],'utf8'),context);
let assertions=[];function ok(name,passed){assertions.push({name,result:passed?'passed':'failed'});if(!passed)throw Error(name)}
const demo=context.window.CopyDemo;ok('fixture_count',demo.fixtures.length===9);
for(const f of demo.fixtures){
 const before=demo.view(f,'before'),after=demo.view(f,'after');
 const actions=x=>[...x.matchAll(/data-action="([^"]+)"/g)].map(m=>m[1]);
 ok(f.rule+'_same_action_handlers',JSON.stringify(actions(before))===JSON.stringify(actions(after)));
 ok(f.rule+'_truthy_panels',before.includes('<h3>')&&after.includes('<h3>'));
 const inputFacts=JSON.stringify(f.fact);demo.view(f,'before');demo.view(f,'after');ok(f.rule+'_render_does_not_mutate_facts',inputFacts===JSON.stringify(f.fact));
 nodes['#case'].value=f.id;nodes['#case'].handlers.change();ok(f.rule+'_state_selector_hidden_attribute',nodes['#state-wrap'].hidden===!f.states);ok(f.rule+'_selector_renders',nodes['#after'].innerHTML===demo.view(f,'after'));
}
for(const state of ['filtered','first_use','forbidden','failed']){
 nodes['#case'].value='empty';nodes['#case'].handlers.change();nodes['#state'].value=state;nodes['#state'].handlers.change();
 const f=demo.fixtures.find(f=>f.id==='empty');const after=nodes['#after'].innerHTML;
 const expected={filtered:'필터 해제',first_use:'문서 추가',forbidden:'권한 요청',failed:'다시 불러오기'};
 ok('empty_'+state+'_correct_action',after.includes(expected[state]));
 ok('empty_'+state+'_truthful_fact_count',state==='filtered'?f.fact.allDocuments===12:state==='first_use'?f.fact.allDocuments===0:f.fact.allDocuments===null);
}
for(const state of ['running','succeeded','failed']){
 nodes['#case'].value='loading';nodes['#case'].handlers.change();nodes['#state'].value=state;nodes['#state'].handlers.change();
 const after=nodes['#after'].innerHTML;ok('loading_'+state+'_state_label',after.includes({running:'보고서 내보내기 중',succeeded:'보고서를 내보냈습니다',failed:'보고서를 내보내지 못했습니다'}[state]));
 ok('loading_'+state+'_completion_boundary',state==='succeeded'?after.includes('보고서 보기'):!after.includes('보고서를 내보냈습니다'));
 ok('loading_'+state+'_same_action_handlers',JSON.stringify([...nodes['#before'].innerHTML.matchAll(/data-action="([^"]+)"/g)].map(m=>m[1]))===JSON.stringify([...after.matchAll(/data-action="([^"]+)"/g)].map(m=>m[1])));
}
vm.runInContext("record('cancel_confirm')",context);ok('cancel_no_change_notice',nodes['#result'].textContent.includes('데이터 변경 없음'));
vm.runInContext("record('decline_offer')",context);ok('decline_no_subscription_notice',nodes['#result'].textContent.includes('구독 안 됨'));
console.log(JSON.stringify(assertions));
'''
with tempfile.TemporaryDirectory() as t:
 path=Path(t)/'script.js';path.write_text(script);runner=Path(t)/'unit.cjs';runner.write_text(harness)
 result=subprocess.run(['node',str(runner),str(path)],check=True,capture_output=True,text=True)
unit=json.loads(result.stdout)
report={'project':'Do Not Slop Project','validated_at_utc':datetime.now(timezone.utc).isoformat(),'static_checks':checks,'javascript_unit_checks':unit,'browser_visual_qa':{'status':'not_run','scope':'This validator performs static and fake-DOM JavaScript unit checks only','not_claimed':['Rendered desktop/mobile appearance','200% browser zoom','keyboard traversal','screen-reader announcements']},'hidden_selector_regression':{'reported_issue':'A state selector without options remained visible in a no-state case because author CSS overrode the HTML hidden default','source_fix':'Targeted #state-wrap[hidden] display:none rule','source_and_unit_check':'passed','wording_facts_and_handlers':'unchanged','browser_recheck':'pending after publication; CSS source and fake-DOM unit checks are not rendered-browser proof'},'user_research':{'status':'not_performed','no_usability_gain_claim':True},'third_party_source_reproduction':{'articles':'link_only','screenshots':'none','quotes':'two unique short labels; cumulative verbatim quote text stays at most 14 whitespace-delimited words for any one source across public files'},'network_or_publishing':'not_performed','artifact_sha256':{name:hashlib.sha256((P/name).read_bytes()).hexdigest() for name in ['README.md','manual_ko.md','sources.json','rules.json','copy_examples.html','validate.py']}}
(P/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(f"{len(checks)} static checks, {len(unit)} JavaScript unit checks passed. Browser visual QA not run by this validator; usability study not performed.")
