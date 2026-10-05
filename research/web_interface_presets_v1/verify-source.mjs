import {fileURLToPath} from 'node:url';
process.chdir(path.dirname(fileURLToPath(import.meta.url)));
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const h=fs.readFileSync('index.html','utf8'),f=JSON.parse(fs.readFileSync('fixtures.json','utf8')),p=JSON.parse(fs.readFileSync('presets.json','utf8'));
const sha=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
assert.deepEqual(JSON.parse(h.match(/<script id="fixture" type="application\/json">([\s\S]*?)<\/script>/)[1]),f);
assert.equal(p.presets.length,6);assert.equal(new Set(p.presets.map(x=>x.layout_family)).size,6);
const lum=hex=>{const a=hex.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2];};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const contrast=[];
for(const preset of p.presets){const r=preset.roles;for(const [name,fg,bg,min] of [['body',r.text,r.canvas,4.5],['metadata',r.muted,r.canvas,4.5],['primary',r.primaryText,r.primary,4.5],['primaryHover',r.primaryText,r.primaryHover,4.5],['secondary',r.secondaryText,r.secondaryFill,4.5],['secondaryHover',r.secondaryText,r.secondaryHover,4.5],['success',r.success,r.surface,4.5],['error',r.error,r.surface,4.5],['destructive',r.destructive,r.surface,4.5],['destructiveHover',r.destructive,r.destructiveHover,4.5],['selectedText',r.text,r.selection.fill,4.5],['focusOnWhite',r.focus.color,r.canvas,3],['controlBoundary',r.controlBoundary,r.surface,3],['selectedBoundary',r.selection.border,r.selection.fill,3],['disabledText',r.disabledText,r.disabledFill,0]]){const value=ratio(fg,bg);contrast.push({purpose:preset.id,name,foreground:fg,background:bg,ratio:+value.toFixed(3),review_threshold:min,passed:value>=min,exception:name==='disabledText'?'No threshold asserted for disabled controls':null});assert.ok(value>=min,`${preset.id}/${name} ${value}`);}}
const functional=JSON.parse(fs.readFileSync('functional-requirements.json','utf8'));
for(const req of functional.requirements){assert.ok(!('roles' in req));assert.ok(!('menu' in req));assert.ok(!('design_instructions' in req));assert.ok(!('dimensions' in req));assert.ok(!('layout_family' in req));assert.deepEqual(req.fixture,f[req.id]);}
fs.writeFileSync('checks/structural-results.json',JSON.stringify({passed:true,generated:new Date().toISOString(),checks:['Embedded fixture exactly matches JSON mirror','Six different layout descriptions','Functional data isolated from preset design fields','90 declared semantic-role contrast pairs computed'],contrast_scope:'Declared role foreground/background pairs; not every pixel/state or WCAG certification',contrast},null,2)+'\n');
console.log('Embedded data, functional isolation and 90 role contrasts pass.');
