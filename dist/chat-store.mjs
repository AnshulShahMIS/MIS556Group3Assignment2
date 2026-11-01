export const historyKey='career-compass-chats-v1';
const tags=new Set(['article','div','p','h3','small','b','span','details','summary','blockquote','button','label','input','a']);
const attrs=new Set(['class','aria-label','data-action','data-week','type']);
export function encodeNode(node){
 if(node.nodeType===3)return {text:node.textContent};
 if(node.nodeType!==1||!tags.has(node.localName))return null;
 const attributes={};for(const key of attrs)if(node.hasAttribute(key))attributes[key]=node.getAttribute(key);
 if(node.localName==='a')attributes.href=node.getAttribute('href');
 return {tag:node.localName,attributes,checked:node.localName==='input'&&node.checked,open:node.localName==='details'&&node.open,children:[...node.childNodes].map(encodeNode).filter(Boolean)};
}
export function decodeNode(data,document,depth=0){
 if(!data||depth>30)return document.createTextNode('');
 if(typeof data.text==='string')return document.createTextNode(data.text);
 if(!tags.has(data.tag))return document.createTextNode('');
 const node=document.createElement(data.tag);
 for(const [key,value]of Object.entries(data.attributes||{})){
  if(typeof value!=='string')continue;
  if(attrs.has(key)&&!(key==='type'&&value!=='checkbox'))node.setAttribute(key,value);
  if(data.tag==='a'&&key==='href'){
   try{const url=new URL(value,document.baseURI);if(['https:','http:'].includes(url.protocol)){node.href=url.href;node.target='_blank';node.rel='noopener noreferrer';}}catch{}
  }
 }
 if(data.tag==='input'){node.type='checkbox';node.checked=data.checked===true;}
 if(data.tag==='details')node.open=data.open===true;
 for(const child of (Array.isArray(data.children)?data.children:[]))node.append(decodeNode(child,document,depth+1));
 return node;
}
export function createChatStore(storage,{key=historyKey,maxChats=25,now=()=>Date.now()}={}){
 const read=()=>{
  const raw=storage.getItem(key);if(!raw)return [];
  const data=JSON.parse(raw);
  if(data.version!==1||!Array.isArray(data.chats)||data.chats.length>maxChats||data.chats.some(c=>!c||typeof c.id!=='string'||typeof c.title!=='string'||!c.state||typeof c.state!=='object')||new Set(data.chats.map(c=>c.id)).size!==data.chats.length)throw Error('Saved conversations could not be read. Export your current chat before clearing browser data.');
  return data.chats;
 };
 const write=chats=>storage.setItem(key,JSON.stringify({version:1,chats}));
 return {
  list(){return read().map(({id,title,updatedAt})=>({id,title,updatedAt})).sort((a,b)=>b.updatedAt-a.updatedAt);},
  get(id){return read().find(c=>c.id===id)||null;},
  put(id,title,state){const chats=read();const index=chats.findIndex(c=>c.id===id);if(index<0&&chats.length>=maxChats)throw Error('You have 25 saved chats. Delete one before creating another.');const chat={id,title:String(title||'New conversation').slice(0,70),updatedAt:now(),state};if(index<0)chats.push(chat);else chats[index]=chat;write(chats);return chat;},
  remove(id){write(read().filter(c=>c.id!==id));}
 };
}
