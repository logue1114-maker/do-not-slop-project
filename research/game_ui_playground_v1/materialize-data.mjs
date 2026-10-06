import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),sandbox);
for(const key of ['config','fixture'])fs.writeFileSync(path.join(root,key+'.json'),JSON.stringify(sandbox.window.PLAYGROUND_DATA[key],null,2)+'\n');
console.log('Config and fixture JSON mirrored from runtime data.');
