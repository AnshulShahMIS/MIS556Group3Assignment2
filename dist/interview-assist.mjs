export function classifyInterviewRequest(text){
 const s=String(text).trim().toLowerCase().replace(/[’‘]/g,"'");
 if(!s||s.length>1200)return null;
 const topic=/tell (?:me|them|us) about (?:yourself|myself|me)|introduce (?:myself|yourself)|self[- ]introduction/.test(s)?'introduction':/weakness|weaknesses/.test(s)?'weakness':/strength|strengths/.test(s)?'strength':/why (?:do|would|are|should).{0,45}(?:role|job|company|hire)|why (?:this|the) (?:role|job|company)|interested in (?:this|the) (?:role|job)/.test(s)?'motivation':null;
 const request=/^(?:can |could |would |please |help |how |what |write |draft |give |create |come up|tell me |show |practice |mock |let|i (?:need|want|would like)|my interviewer|they ask)/.test(s);
 if(!request)return null;
 const drafting=/\b(draft|write|sample|example|suggest|compose)\b|come up with|help.{0,40}(?:answer|response)|how.{0,25}(?:answer|respond)|what (?:should|can|do) i say|answer instead|give me (?:an? )?(?:answer|response)/.test(s);
 const mock=/\bmock\b|role[- ]?play|simulate.{0,25}interview|ask me.{0,25}questions|(?:practice|start|begin).{0,35}interview|interview.{0,20}practice|practice.{0,35}tell me about/.test(s);
 if(drafting&&(topic||/interview|interviewer|answer|response/.test(s)))return {intent:'interview-draft',topic:topic||'custom'};
 if(mock)return {intent:'interview',topic:topic||null};
 if(topic)return {intent:'interview-draft',topic};
 if(/interview/.test(s))return {intent:'interview-help',topic:null};
 return null;
}
export function conversationControl(text){const s=String(text).trim().toLowerCase().replace(/[’‘]/g,"'");if(s.length>240)return null;if(/^(?:(?:can|could|would) you (?:please )?)?(?:stop asking(?: me)?(?: questions)?|stop|pause|cancel)(?:[.!?])?$/i.test(s))return 'stop';if(/^(?:stop|pause|cancel|quit|exit|leave interview(?: practice)?|stop (?:the |this )?(?:interview|practice|questions)|let'?s stop)[.!]?\s*$/.test(s))return 'stop';if(/^(?:no[, .]+(?:that|this|not|you|i (?:meant|want|asked))|not what i|that'?s not|that is not|you (?:misunderstood|didn'?t understand)|i (?:didn'?t|did not) (?:ask|mean)|stop asking)/.test(s))return 'correction';return null;}
function lines(text){return String(text||'').split(/\n|(?<=[.!?])\s+/).map(s=>s.replace(/^[-•*]\s*/,'').trim()).filter(Boolean)}
export function buildAnswerDraft({question='',topic='introduction',resume='',profile={},role='',details=''}={}){
 const context=[...lines(details),...lines(resume)];
 const rawDegree=String(profile.degree||'').trim()||context.find(s=>/\b(MS|MSc|BS|BSc|MBA|master'?s?|bachelor'?s?|pursuing|studying)\b/i.test(s));
 const degree=rawDegree?.replace(/^(?:degree|current role|background)\s*:\s*/i,'');
 const rawExample=context.find(s=>/\b(built|created|analy[sz]ed|developed|designed|implemented|tested|wrote|maintained|presented|collaborated|led|organized|resolved)\b/i.test(s));
 const example=rawExample&&!/\b(?:never|not|haven't|have not|didn't|did not)\b.{0,35}\b(?:built|created|analy[sz]ed|developed|designed|implemented|tested|wrote|maintained|presented|collaborated|led|organized|resolved)\b/i.test(rawExample)?rawExample.replace(/^(?:project|experience|example)\s*:\s*/i,''):null;
 role=role||context.find(line=>/^target (?:role|job)\s*:/i.test(line))?.replace(/^target (?:role|job)\s*:\s*/i,'')||'';
 const parts=[];
 if(degree)parts.push(/^(?:I\b|I['’]m\b)/i.test(degree)?degree.replace(/[.!?]+$/,'')+'.':`My background includes ${degree.replace(/[.!?]+$/,'')}.`);else parts.push("I'm [your current role or degree], with an interest in [relevant area].");
 if(topic==='introduction'){
  parts.push(example?`One experience I would highlight is this: ${example.replace(/[.!?]+$/,'')}.`:'A relevant experience is [a real project or responsibility], where I [your contribution] and [a result or lesson you can substantiate].');
  parts.push(`I'm interested in ${role&&role!=='Your target role'?role:'[the target role]'} because [your genuine reason for this opportunity]. I'd like to contribute [a relevant strength supported by your experience].`);
 }else if(topic==='weakness'){
  parts.splice(0,parts.length,"One area I'm actively improving is [a genuine area for growth]. I noticed it when [a specific example]. Since then, I've [steps you actually took], and [a verified sign of progress or lesson]. My next step is [your realistic plan].");
 }else if(topic==='strength'){
  parts.splice(0,parts.length,'One strength I bring is [a strength relevant to the job]. '+(example?`An example from my experience is: ${example.replace(/[.!?]+$/,'')}. `:'For example, [a real situation and your contribution]. ')+'That experience taught me [your actual lesson], which would help me [a responsibility in the target role].');
 }else if(topic==='motivation'){
  parts.splice(0,parts.length,`I'm interested in ${role&&role!=='Your target role'?role:'[this role]'} because [a specific responsibility or problem that genuinely interests you]. `+(example?`A relevant example from my experience is: ${example.replace(/[.!?]+$/,'')}. `:'My experience in [a real project or responsibility] connects to that work. ')+'I would like to contribute [evidence-backed strength] and learn more about [a genuine area of interest].');
 }else{
  parts.splice(0,parts.length,'[Answer the question directly]. One example is [a real situation]. My responsibility was [your task], and I [your actions and reasoning]. The outcome or lesson was [something you can substantiate]. This connects to the role because [the relevant link].');
 }
 const evidence=[degree,example].filter(Boolean);
 return {topic,question,text:parts.join(' '),evidence:[...new Set(evidence)],hasContext:evidence.length>0,note:'This is a fill-in template assembled with rules, not a live AI-generated answer. Any inserted education or project text is quoted from the details you supplied; placeholders must be replaced with truthful facts.',structure:topic==='introduction'?['Present: your current background','Past: one relevant example and your contribution','Future: why this opportunity fits']:['Answer directly','Support it with a real example','Explain the relevant outcome or lesson']};
}
