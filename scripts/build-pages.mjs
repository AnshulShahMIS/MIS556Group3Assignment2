import {cpSync,existsSync,mkdirSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalizeApiBase} from '../dist/api-client.mjs';

export function buildPages({root=resolve(fileURLToPath(new URL('..',import.meta.url))),output,apiBaseUrl}={}){
 const sourceConfig=join(root,'dist','api-config.json');
 const configured=existsSync(sourceConfig)?JSON.parse(readFileSync(sourceConfig,'utf8')).apiBaseUrl:'';
 const base=normalizeApiBase(apiBaseUrl||configured||'');
 if(!base)throw Error('Set the public repository variable CAREER_COMPASS_API_URL to the deployed HTTPS backend URL before publishing. Do not set an API key here.');
 const destination=output||join(root,'.pages');
 if(existsSync(destination))throw Error('The Pages output folder already exists. Use a fresh build directory.');
 mkdirSync(destination,{recursive:true});
 const entries=readdirSync(join(root,'dist'),{withFileTypes:true});
 for(const entry of entries){
  if(entry.isSymbolicLink()||entry.name.startsWith('.env'))throw Error('Unexpected private file or link in public assets.');
  if(entry.name==='app.mjs'||entry.name==='style.css')continue;
  cpSync(join(root,'dist',entry.name),join(destination,entry.name),{recursive:true});
 }
 writeFileSync(join(destination,'api-config.json'),JSON.stringify({apiBaseUrl:base},null,2)+'\n');
 writeFileSync(join(destination,'.nojekyll'),'');
 const inspect=dir=>{for(const entry of readdirSync(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory())inspect(file);else if(readFileSync(file).includes(Buffer.from('sk-proj-')))throw Error('A possible API credential was found in the public build.');}};
 inspect(destination);return destination;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log('Pages artifact: '+buildPages({apiBaseUrl:process.env.CAREER_COMPASS_API_URL}));}
 catch(error){console.error(error.message);process.exitCode=1;}
}
