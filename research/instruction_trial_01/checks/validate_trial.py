#!/usr/bin/env python3
"""Read-only CP01 package/source checks, except the scoped results receipt; no browser."""
import hashlib
import json
import re
import struct
import subprocess
import tempfile
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
results = []
def check(name, condition, detail=None):
    results.append({'name':name, 'passed':bool(condition), 'detail':detail})
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
class Node:
    def __init__(self,tag,attrs=None): self.tag=tag;self.attrs=dict(attrs or []);self.children=[]
    def text(self): return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
    def all(self,tag=None):
        answer=[]
        for c in self.children:
            if isinstance(c,Node):
                if tag is None or c.tag==tag: answer.append(c)
                answer.extend(c.all(tag))
        return answer
class DOM(HTMLParser):
    def __init__(self):super().__init__();self.root=Node('root');self.stack=[self.root]
    def handle_starttag(self,tag,attrs):
        node=Node(tag,attrs);self.stack[-1].children.append(node)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:self.stack.append(node)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:self.stack=self.stack[:i];break
    def handle_data(self,data):self.stack[-1].children.append(data)
def jpeg_size(raw):
    if raw[:2]!=b'\xff\xd8':return None
    pos=2
    while pos<len(raw):
        while pos<len(raw) and raw[pos]==255:pos+=1
        marker=raw[pos];pos+=1
        if marker in {0xd8,0xd9}:continue
        length=struct.unpack('>H',raw[pos:pos+2])[0]
        if marker in {0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf}:
            height,width=struct.unpack('>HH',raw[pos+3:pos+7]);return [width,height]
        pos+=length
    return None
record=json.loads((ROOT/'protocol/run-record.json').read_text())
fixture=json.loads((ROOT/'fixture.json').read_text())
for key in ('common_inputs_sha256','public_task_briefs_sha256'):
    for rel,expected in record[key].items():check('input_sha256:'+rel,sha(ROOT/rel)==expected)
for rel,expected in record['guided_only_instructions_sha256'].items():check('guided_instruction_sha256:'+rel,sha(REPO/record.get('guided_instruction_archive_paths', {}).get(rel, rel))==expected)
a=(ROOT/'prompts/A-plain.txt').read_bytes();b=(ROOT/'prompts/B-guided.txt').read_bytes()
check('identical_public_prompt_core',b==a+b'\nAdditional project instructions:\nBefore implementing, read AGENTS.md and guides/cp01-task-first.md in this workspace and apply them to this task.\n')
for rel in ('reference/reference-en.html','alpha/index.html','beta/index.html'):
    path=ROOT/rel;raw=path.read_text();dom=DOM();dom.feed(raw);nodes=dom.root.all()
    check('english:'+rel,any(n.tag=='html' and n.attrs.get('lang')=='en' for n in nodes))
    check('self_contained_resources:'+rel,not any(n.attrs.get(k,'').startswith(('http:','https:','//')) for n in nodes for k in ('src','href')))
    check('no_remote_service_api:'+rel,not re.search(r'\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(',raw))
    check('native_disclosure:'+rel,any(n.tag=='details' for n in nodes) and any(n.tag=='summary' and n.text()=='State and facts shared by both panels' for n in nodes))
    check('reset_label:'+rel,any(n.tag=='button' and n.text().strip()=='Reset demo state' for n in nodes))
    for side in ('before','after'):
        panel=next(n for n in nodes if n.attrs.get('id')==side);inside=panel.all();content=fixture['comparison'][side]
        check('specimen_title:'+rel+':'+side,[n.text() for n in inside if n.tag=='h3']==[content['title']])
        bodies=[n.text() for n in inside if n.tag=='p' and 'copy' in n.attrs.get('class','').split()]
        check('specimen_body:'+rel+':'+side,bodies==([content['body']] if content['body'] else []))
        files=next(n for n in inside if n.tag=='ul' and 'files' in n.attrs.get('class','').split())
        docs=[]
        for row in files.all('li'):
            name=next(n.text() for n in row.all('strong'));value=next(n.text() for n in row.all('small')).removeprefix('Modified: ')
            docs.append({'name':name,'modified':value})
        check('protected_records:'+rel+':'+side,docs==fixture['documents'])
        check('same_action:'+rel+':'+side,any(n.tag=='button' and n.attrs.get('data-action')=='find_document' and n.text().strip()=='Find a document' for n in inside))
    scripts=[n.text() for n in nodes if n.tag=='script' and n.attrs.get('type')!='application/json']
    with tempfile.NamedTemporaryFile(mode='w',suffix='.js') as temp:
        temp.write('\n'.join(scripts));temp.flush();run=subprocess.run(['node','--check',temp.name],capture_output=True,text=True)
        check('js_syntax:'+rel,run.returncode==0,run.stderr.strip() or None)
for arm,item in record['arms'].items():
    check('exact_first_pass_sha256:'+arm,sha(ROOT/item['output_path'])==item['sha256'])
    check('one_pass_no_implementation_repair:'+arm,item['first_pass_count']==1 and item['implementation_repairs']==0)
for image in record['screenshots']:
    path=ROOT/image['path'];check('capture_sha256:'+image['path'],sha(path)==image['sha256'])
    check('capture_dimensions:'+image['path'],jpeg_size(path.read_bytes())==image['frame_pixels'])
check('no_validated_winner',record['blinded_review']['validated_winner'] is None)
check('time_budget_deviation_disclosed',not record['time_budget']['fixed_budget_enforced'] and not record['time_budget']['duration_controlled'])
report={'scope':'Source/package hashes, public prompt relation, protected static content, self-contained resources, JS syntax and unchanged capture dimensions; no browser or user study','checked_at_utc':datetime.now(timezone.utc).isoformat(),'status':'passed' if all(r['passed'] for r in results) else 'failed','checks':results,'counts':{'checks':len(results),'failed':sum(not r['passed'] for r in results)},'limits':['No real browser execution or interaction reproduced','No full accessibility, human usability or causal-effect claim','Blinded review scores are descriptive, not a validated winner']}
(ROOT/'checks/package-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'status':report['status'],'counts':report['counts'],'failures':[r for r in results if not r['passed']]},indent=2))
raise SystemExit(report['status']!='passed')
