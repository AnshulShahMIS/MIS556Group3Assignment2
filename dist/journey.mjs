export function suggestNextStep(result){
 if(!result)return {action:'resume',label:'Start with my experience',message:'Share your experience and a target opportunity so I can identify a useful next step.'};
 const uncertain=result.rows.find(r=>r.status==='needs-clarification');
 if(uncertain)return {action:'gaps',label:'Check the evidence together',message:`First, clarify the ${uncertain.skill} evidence. Your inputs include conflicting statements, so a learning recommendation would be premature.`};
 const listed=result.found.find(r=>r.status==='listed');
 if(listed)return {action:'resume-tips',label:'Strengthen my resume examples',message:`Start by adding a concrete example for ${listed.skill}, which is currently self-reported. Use experience you can explain before deciding that you need another course.`};
 const gap=result.gaps.find(r=>r.priority==='required')||result.gaps[0];
 if(gap)return {action:'plan',label:'Plan my next step',message:`Review ${gap.skill} next (${gap.priority} in the posting). Confirm whether you have evidence to add; if you do not, scope one practice project around your available time.`};
 return {action:'interview',label:'Practice explaining my experience',message:'Your recognized skills have positive evidence. Practice explaining your contribution and decisions, while checking qualifications outside the skill dictionary manually.'};
}
export function inferDocumentType(text){
 if(typeof text!=='string'||text.trim().length<100)return null;
 if(/^\s*(job description|target job|job posting)\s*:/i.test(text))return 'job';
 if(/^\s*(my resume|resume|curriculum vitae)\s*:/i.test(text))return 'resume';
 const sections=(text.match(/(?:^|\n)\s*(education|experience|skills|projects|employment|certifications)\s*:?\s*(?:\n|$)/gi)||[]).length;
 if(sections>=2)return 'resume';
 if(/\n/.test(text)&&/\b(responsibilities|qualifications|requirements)\b/i.test(text)&&/\b(required|preferred|we are|candidate|applicant|intern|position|role)\b/i.test(text))return 'job';
 return null;
}
