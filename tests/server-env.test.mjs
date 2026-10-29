import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadServerEnv,verifyApiKey} from '../server-env.mjs';

test('local key loader only sets the key and preserves an existing environment key',()=>{
 const dir=mkdtempSync(join(tmpdir(),'career-env-'));
 try {
  const file=join(dir,'.env');writeFileSync(file,'OPENAI_API_KEY=synthetic-local\nNODE_OPTIONS=untrusted\n');
  const env={};loadServerEnv(file,env);assert.deepEqual(env,{OPENAI_API_KEY:'synthetic-local'});
  const existing={OPENAI_API_KEY:'synthetic-existing'};loadServerEnv(file,existing);assert.equal(existing.OPENAI_API_KEY,'synthetic-existing');
  loadServerEnv(join(dir,'missing'),{});
 } finally { rmSync(dir,{recursive:true,force:true}); }
});

test('authentication check never returns key or provider error bodies',async()=>{
 const key='sk-synthetic_placeholder_only_123456';
 for(const status of [200,401,403,429,500]){
  const result=await verifyApiKey(key,{request:async(url,options)=>{
   assert.equal(url,'https://api.openai.com/v1/models');assert.equal(options.headers.Authorization,`Bearer ${key}`);
   return {ok:status===200,status,text:()=>{throw Error('Do not read arbitrary error bodies');}};
  }});
  assert.equal(result.ok,status===200);assert.equal(JSON.stringify(result).includes(key),false);
 }
 const unavailable=await verifyApiKey(key,{request:async()=>{throw Error(key)}});
 assert.equal(JSON.stringify(unavailable).includes(key),false);
 assert.equal((await verifyApiKey('invalid')).ok,false);
});
