import {writeFile} from 'node:fs/promises';
import {loadServerEnv} from '../server-env.mjs';
import {runOpenAICoach} from '../openai-agent.mjs';
loadServerEnv();
const message='Can you help me come up with answer for when they ask me to tell them about myself at a job interview';
try{
 const answer=await runOpenAICoach({message},{signal:AbortSignal.timeout(90000)});
 await writeFile(new URL('./live-smoke-result.json',import.meta.url),JSON.stringify({date:'2026-10-29',message,...answer},null,2));
 console.log(JSON.stringify({text:answer.text,model:answer.model,trace:answer.trace,usage:answer.usage,elapsedMs:answer.elapsedMs},null,2));
}catch(error){console.log('Live generation check: '+error.message);process.exitCode=1;}
