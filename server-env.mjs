import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';

// Server-only configuration, outside the publicly served dist directory.
export function loadServerEnv(file=new URL('./.env',import.meta.url), env=process.env){
 let values;
 try { values=parseEnv(readFileSync(file,'utf8')); }
 catch(error){ if(error.code==='ENOENT')return; throw Error('Could not read the local server configuration.'); }
 if(env.OPENAI_API_KEY===undefined&&values.OPENAI_API_KEY)env.OPENAI_API_KEY=values.OPENAI_API_KEY;
 if(env.OPENAI_MODEL===undefined&&values.OPENAI_MODEL)env.OPENAI_MODEL=values.OPENAI_MODEL;
}

export async function verifyApiKey(key,{request=fetch}={}){
 if(typeof key!=='string'||!/^sk-[A-Za-z0-9_-]{20,}$/.test(key))return {ok:false,message:'No valid key format found. Run Setup-API-Key.cmd.'};
 try {
  const response=await request('https://api.openai.com/v1/models',{
   headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(15000)
  });
  if(response.ok)return {ok:true,message:'OpenAI accepted the key for listing models. Model generation, billing and model access have not been tested.'};
  const messages={401:'The key was rejected. Replace it and run setup again.',403:'Access was denied. Check the key and project permissions.',429:'The request was limited. Check project limits and billing, then retry.'};
  return {ok:false,message:messages[response.status]||`OpenAI returned HTTP ${response.status}. Try again later.`};
 } catch { return {ok:false,message:'Could not reach OpenAI within the time limit. Check your internet connection and retry.'}; }
}
