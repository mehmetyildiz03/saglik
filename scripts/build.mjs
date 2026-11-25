import {mkdir,cp,rm,copyFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});
for(const path of ['index.html','style.css','app.js','core.js','catalog.js','parser.js','body-map.js','health.js','evidence.js','measurement.js','.nojekyll'])await copyFile(path,'dist/'+path);
for(const path of ['pdf.mjs','pdf.worker.mjs'])await copyFile('node_modules/pdfjs-dist/build/'+path,'dist/vendor/'+path);
for(const path of ['cmaps','standard_fonts','wasm'])await cp('node_modules/pdfjs-dist/'+path,'dist/vendor/'+path,{recursive:true});
await copyFile('node_modules/pdfjs-dist/LICENSE','dist/vendor/LICENSE');
console.log('Static release created in dist/; PDF.js files are same-origin.');
