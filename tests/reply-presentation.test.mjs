import test from 'node:test';
import assert from 'node:assert/strict';
import {conversationalReply} from '../dist/reply-presentation.mjs';

test('AI prose omits the generated source footer, including multiple sources',()=>{
 assert.equal(conversationalReply('Hello! How can I help?\n\nGuidance sources: [source:career-exploration]'),'Hello! How can I help?');
 assert.equal(conversationalReply('Your next step.\r\n\r\nGuidance sources: [source:resume] [source:interview]\r\n'),'Your next step.');
});
test('ordinary career advice and source discussions are preserved',()=>{
 const text='Explore two roles.\n\nGuidance sources: your campus career center can help.\nKeep a list of questions.';
 assert.equal(conversationalReply(text),text);
 assert.equal(conversationalReply('What does [source:career-exploration] mean?'),'What does [source:career-exploration] mean?');
});
