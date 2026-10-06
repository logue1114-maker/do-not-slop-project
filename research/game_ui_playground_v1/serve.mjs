import {createServer} from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.md':'text/plain','.png':'image/png'};
const server=createServer((req,res)=>{
  try{
    const uri=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(uri==='/favicon.ico'){res.writeHead(204);res.end();return;}
    let target=path.resolve(root,'.'+uri);
    if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    res.writeHead(200,{'Content-Type':(types[path.extname(target)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});
    fs.createReadStream(target).pipe(res);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(8765,'127.0.0.1',()=>console.log('http://127.0.0.1:8765/research/game_ui_playground_v1/'));
