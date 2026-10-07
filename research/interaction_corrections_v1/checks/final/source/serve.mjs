import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const prefix='/research/interaction_corrections_v1';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
export function startServer(port=4177){return new Promise(resolve=>{const server=http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}if(pathname==='/')pathname=prefix+'/index.html';if(pathname.endsWith('/'))pathname+='index.html';if(pathname==='/favicon.ico'){res.writeHead(204).end();return;}const file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)||pathname.split('/').some(x=>x.startsWith('.'))){res.writeHead(403).end('Outside public tree');return;}fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(err?'Not found':data);});});server.listen(port,'127.0.0.1',()=>resolve(server));});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const server=await startServer(Number(process.env.PORT||4177));console.log(`Interaction labs: http://127.0.0.1:${server.address().port}${prefix}/`);}
