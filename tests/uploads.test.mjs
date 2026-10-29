import test from 'node:test';import assert from 'node:assert/strict';import {readResume} from '../dist/uploads.mjs';
const body='Education: MS Information Systems. Built SQL queries to analyze campus survey records.';
test('plain text resume preserves student wording',async()=>assert.equal(await readResume(new File([body],'resume.txt')),body));
test('Markdown resume is accepted as text',async()=>assert.equal(await readResume(new File([body],'resume.md')),body));
test('empty extracted input has actionable feedback',async()=>assert.rejects(()=>readResume(new File([''],'empty.txt')),/Little or no text/));
test('unsupported file has actionable feedback',async()=>assert.rejects(()=>readResume(new File([body],'resume.exe')),/PDF, DOCX/));
test('large upload is rejected before reading',async()=>assert.rejects(()=>readResume(new File([new Uint8Array(5*1024*1024+1)],'large.txt')),/5 MB/));
test('excessively long text is rejected',async()=>assert.rejects(()=>readResume(new File(['x'.repeat(40001)],'long.txt')),/40,000/));
