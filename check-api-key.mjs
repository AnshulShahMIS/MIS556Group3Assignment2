import {loadServerEnv,verifyApiKey} from './server-env.mjs';
loadServerEnv();
const result=await verifyApiKey(process.env.OPENAI_API_KEY);
console.log(result.message);
process.exitCode=result.ok?0:1;
