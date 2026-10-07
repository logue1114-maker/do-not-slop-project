import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const files=walk(root).filter(file=>path.basename(file)!=='PACKAGE_MANIFEST.json').map(file=>{
  const bytes=fs.readFileSync(file);
  return {file:path.relative(root,file).replaceAll('\\','/'),bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
}).sort((a,b)=>a.file.localeCompare(b.file,'en'));
const record=JSON.parse(fs.readFileSync(path.join(root,'AUTHORING_RECORD.json'),'utf8'));
const manifest={created_at:new Date().toISOString(),artifact_type:'original-authored-public-source',implementation_base_commit:record.base.commit,publication_base_commit:record.publication_base_commit,current_browser_run:'review-candidate-2',self_excluded:true,total_bytes:files.reduce((sum,file)=>sum+file.bytes,0),files};
fs.writeFileSync(path.join(root,'PACKAGE_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({files:files.length,bytes:manifest.total_bytes,self_excluded:true}));
