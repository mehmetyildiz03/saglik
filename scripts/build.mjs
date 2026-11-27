import {mkdir,cp,rm,copyFile,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const assets=['style.css','design.css','atlas.css','explore.css','analysis.css','app.js','core.js','catalog.js','parser.js','body-map.js','health.js','evidence.js','measurement.js','dashboard.js','physiology.js','lab-view.js','trend-view.js','appearance.js','atlas.js','explore.js','system-graphs.js','event-view.js','import-review.js','terminology.js','quality.js'];
const pkg=JSON.parse(await readFile('package.json','utf8'));
const hash=createHash('sha256');for(const p of ['index.html','package.json',...assets])hash.update(p+'\0').update(await readFile(p)).update('\0');
const release=hash.digest('hex').slice(0,20),dir='assets/'+release,root='dist/'+dir;
await rm('dist',{recursive:true,force:true});await mkdir(root+'/vendor',{recursive:true});
for(const p of assets)await copyFile(p,root+'/'+p);
for(const p of ['pdf.mjs','pdf.worker.mjs'])await copyFile('node_modules/pdfjs-dist/build/'+p,root+'/vendor/'+p);
for(const p of ['cmaps','standard_fonts','wasm'])await cp('node_modules/pdfjs-dist/'+p,root+'/vendor/'+p,{recursive:true});
await copyFile('node_modules/pdfjs-dist/LICENSE',root+'/vendor/LICENSE');
let html=await readFile('index.html','utf8');
for(const [attr,p] of [['href','style.css'],['href','design.css'],['href','atlas.css'],['href','explore.css'],['href','analysis.css'],['src','app.js']]){const key=attr+'="'+p+'"';if(!html.includes(key))throw Error('Missing entry asset '+p);html=html.replace(key,attr+'="'+dir+'/'+p+'"')}
await writeFile('dist/index.html',html);
await copyFile('.nojekyll','dist/.nojekyll');
const digests={};for(const p of assets)digests[p]=createHash('sha256').update(await readFile(root+'/'+p)).digest('hex');
await writeFile('dist/release.json',JSON.stringify({version:pkg.version,release,assetRoot:dir,digests},null,2));
console.log('Static release '+pkg.version+' at '+dir+'; styles and complete module graph share one immutable path.');
