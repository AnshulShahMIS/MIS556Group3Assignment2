async function readDocx(buffer){const data=new DataView(buffer);let end=-1;for(let i=buffer.byteLength-22;i>=Math.max(0,buffer.byteLength-65557);i--){if(data.getUint32(i,true)===0x06054b50){end=i;break}}if(end<0)throw Error('The DOCX ZIP directory could not be read. Try pasting your resume text.');let at=data.getUint32(end+16,true);const count=data.getUint16(end+10,true);if(count>2000)throw Error('The DOCX archive has too many entries. Paste the text instead.');for(let i=0;i<count;i++){if(data.getUint32(at,true)!==0x02014b50)throw Error('Invalid DOCX directory.');const method=data.getUint16(at+10,true),size=data.getUint32(at+20,true),unpacked=data.getUint32(at+24,true),nameLen=data.getUint16(at+28,true),extra=data.getUint16(at+30,true),comment=data.getUint16(at+32,true),offset=data.getUint32(at+42,true),name=new TextDecoder().decode(new Uint8Array(buffer,at+46,nameLen));if(name==='word/document.xml'){if(unpacked>8e6)throw Error('The document text is too large. Paste the relevant sections instead.');const start=offset+30+data.getUint16(offset+26,true)+data.getUint16(offset+28,true);let bytes=new Uint8Array(buffer,start,size);if(method===8){const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));const reader=stream.getReader();const chunks=[];let total=0;while(true){const part=await reader.read();if(part.done)break;total+=part.value.byteLength;if(total>8000000){await reader.cancel();throw Error('The extracted document text exceeds the safety limit. Paste the relevant sections.')}chunks.push(part.value)}bytes=new Uint8Array(total);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.byteLength}}else if(method!==0)throw Error('Unsupported DOCX compression. Paste the text instead.');const xml=new DOMParser().parseFromString(new TextDecoder().decode(bytes),'application/xml');if(xml.querySelector('parsererror'))throw Error('Could not parse DOCX text.');return [...xml.getElementsByTagNameNS('*','p')].map(p=>[...p.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('')).join('\n')}at+=46+nameLen+extra+comment}throw Error('No document text found in this DOCX.')}

export async function readResume(file) {
 if(file.size > 5*1024*1024) throw Error('Please choose a resume smaller than 5 MB.');
 const ext=file.name.split('.').pop().toLowerCase(); let text='';
 if(['txt','md'].includes(ext)) text=await file.text();
 else if(ext==='docx') text=await readDocx(await file.arrayBuffer());
 else if(ext==='pdf') {
  const pdfjs=await import('./vendor/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc='./vendor/pdf.worker.mjs';
  const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,useSystemFonts:true}).promise;
  try { if(pdf.numPages>15) throw Error('Use a resume of 15 pages or fewer.');
   const pages=[];
   for(let n=1;n<=pdf.numPages;n++){const page=await pdf.getPage(n);const content=await page.getTextContent();pages.push(content.items.map(item=>item.str+(item.hasEOL?'\n':' ')).join(''));}
   text=pages.join('\n');
  } finally { await pdf.destroy(); }
 } else throw Error('Choose a PDF, DOCX, TXT, or MD file.');
 if(text.trim().length<40) throw Error('Little or no text was found. Scanned PDFs need OCR; paste the text instead.');
 if(text.length>40000) throw Error('This resume has more than 40,000 characters. Paste only the relevant sections.');
 return text;
}
