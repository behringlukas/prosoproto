import assert from 'node:assert/strict';
import test from 'node:test';
import {register} from 'node:module';
register('./case-storage-loader.mjs',import.meta.url);
const {default:worker}=await import('../dist/server/index.js');
const runtime={ASSETS:{fetch:async()=>new Response('',{status:404})}};
const ctx={waitUntil(){},passThroughOnException(){}};
function call(path,method='GET',body,email='owner@example.test',extra={}){const headers={...extra};if(email)headers['oai-authenticated-user-email']=email;if(body!==undefined&&!(body instanceof FormData))headers['Content-Type']='application/json';return worker.fetch(new Request('https://prototype.test'+path,{method,headers,body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body)}),runtime,ctx)}
test('case persistence preserves independent instances, rejects stale saves and isolates owners',async()=>{
 const anonymous=await call('/api/case','GET',undefined,null);assert.equal(anonymous.status,200);const guest=await anonymous.json();assert.equal(guest.temporary,true);assert.equal(guest.revision,0);assert.equal(guest.data.items.length,2);
 assert.equal((await call('/api/case','PUT',{data:guest.data,revision:0},null)).status,401);
 const first=await (await call('/api/case')).json();assert.equal(first.revision,0);
 const {data}=first;
 data.steps[2].fields[0]='Saved breakdown';
 data.items.push({id:'timeline-1',step:2,kind:'method',methodId:'timeline',title:'Timeline A',data:{nodes:[],edges:[]},text:'First independent board',updatedAt:new Date().toISOString()});
 data.items.push({id:'timeline-2',step:2,kind:'method',methodId:'timeline',title:'Timeline B',data:{nodes:[],edges:[]},text:'Second independent board',updatedAt:new Date().toISOString()});
 const saved=await call('/api/case','PUT',{data,revision:0});assert.equal(saved.status,200);assert.equal((await saved.json()).revision,1);
 const reopened=await (await call('/api/case')).json();assert.equal(reopened.data.steps[2].fields[0],'Saved breakdown');assert.equal(reopened.data.items.at(-1).text,'Second independent board');assert.equal(reopened.data.items.at(-2).text,'First independent board');
 assert.equal((await call('/api/case','PUT',{data,revision:0})).status,409);
 assert.equal((await call('/api/case','PUT',{data,revision:1},'owner@example.test',{origin:'https://other.test'})).status,403);
 const guestReload=await (await call('/api/case','GET',undefined,null)).json();assert.equal(guestReload.revision,0);assert.notEqual(guestReload.data.steps[2].fields[0],'Saved breakdown');
 const other=await (await call('/api/case','GET',undefined,'other@example.test')).json();assert.equal(other.revision,0);assert.equal(other.data.items.length,2);
 data.items.push({...data.items.at(-1)});assert.equal((await call('/api/case','PUT',{data,revision:1})).status,400);
});
test('uploaded attachment bytes survive retrieval and are restricted to their owner',async()=>{
 const body=new FormData();body.append('file',new File(['Synthetic QA attachment'], 'qa-note.txt',{type:'text/plain'}));
 assert.equal((await call('/api/files','POST',body,null)).status,401);
 const r=await call('/api/files','POST',body);assert.equal(r.status,200);const file=await r.json();
 const download=await call('/api/files/'+file.id);assert.equal(download.status,200);assert.equal(await download.text(),'Synthetic QA attachment');assert.equal(download.headers.get('Cache-Control'),'private, no-store');
 assert.equal((await call('/api/files/'+file.id,'GET',undefined,'other@example.test')).status,404);
 assert.equal((await call('/api/files/'+file.id,'GET',undefined,null)).status,401);
});
