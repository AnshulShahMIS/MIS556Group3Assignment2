// References remain in the expandable source panel, not the conversational prose.
export function conversationalReply(text){
 return String(text??'').replace(/(?:\r?\n)*^\s*Guidance sources:\s*(?:\[source:[^\]\r\n]+\][ \t]*)+(?:\r?\n|$)/gmi,'\n').trim();
}
