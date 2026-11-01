import test from 'node:test';import assert from 'node:assert/strict';
import {createChatStore,historyKey,decodeNode} from '../dist/chat-store.mjs';
function memory(){const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};}
test('saved chats survive a fresh store and preserve separate contexts',()=>{
 const storage=memory();const store=createChatStore(storage,{now:()=>1});
 store.put('a','Interview',{resume:'Resume A',job:'Job A',liveHistory:[{role:'user',content:'Draft my introduction'}],messages:[{text:'Answer A'}]});
 store.put('b','Plan',{resume:'Resume B',job:'Job B',profile:{hoursPerWeek:5}});
 const reopened=createChatStore(storage);assert.equal(reopened.get('a').state.resume,'Resume A');assert.equal(reopened.get('b').state.profile.hoursPerWeek,5);assert.equal(reopened.get('a').state.liveHistory[0].content,'Draft my introduction');
});
test('updates from separate tabs retain the other chats and delete only the chosen chat',()=>{
 const storage=memory();const one=createChatStore(storage);const two=createChatStore(storage);
 one.put('a','First',{resume:'A'});two.put('b','Second',{resume:'B'});one.put('a','First updated',{resume:'A2'});
 assert.equal(two.list().length,2);two.remove('b');assert.equal(one.get('a').state.resume,'A2');assert.equal(one.get('b'),null);
});
test('quota failures and corrupted history do not overwrite previously saved chats',()=>{
 const storage=memory();const store=createChatStore(storage);store.put('a','Saved',{messages:[]});const original=storage.getItem(historyKey);
 const failing=createChatStore({getItem:storage.getItem,setItem(){throw Error('Quota exceeded')}});assert.throws(()=>failing.put('b','New',{messages:[]}),/Quota/);assert.equal(storage.getItem(historyKey),original);
 storage.setItem(historyKey,'corrupt');assert.throws(()=>store.put('c','Other',{messages:[]}));assert.equal(storage.getItem(historyKey),'corrupt');
});
test('history limit does not silently delete older conversations',()=>{
 const store=createChatStore(memory(),{maxChats:2});store.put('a','A',{});store.put('b','B',{});assert.throws(()=>store.put('c','C',{}),/Delete one/);assert.equal(store.list().length,2);
});
test('restored content never creates scripts or event-handler attributes',()=>{
 const created=[];const document={baseURI:'https://example.com/',createTextNode:text=>({text}),createElement:tag=>{const node={tag,attributes:{},append(){},setAttribute(k,v){this.attributes[k]=v}};created.push(node);return node;}};
 decodeNode({tag:'script',children:[{text:'alert(1)'}]},document);
 const link=decodeNode({tag:'a',attributes:{href:'javascript:alert(1)',onclick:'alert(1)',class:'source'},children:[{text:'Safe text'}]},document);
 assert.equal(created.some(n=>n.tag==='script'),false);assert.equal(link.href,undefined);assert.equal(link.attributes.onclick,undefined);assert.equal(link.attributes.class,'source');
});
