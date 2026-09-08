import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../lib/board.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {boardMethods,template,applyProposal,validConnection,quadrant,readBoard}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));

test('all board templates have valid parents, supported edges and serializable assistant context',()=>{
 for(const method of boardMethods){
  const b=template(method),seen=new Set();
  for(const n of b.nodes){assert(!seen.has(n.id));if(n.parentId)assert(seen.has(n.parentId));seen.add(n.id)}
  for(const e of b.edges){assert(seen.has(e.source));assert(seen.has(e.target))}
  assert.doesNotThrow(()=>JSON.stringify(readBoard(b,method)));
 }
 assert.equal(boardMethods.length,8);
});
test('trees reject cycles while process maps permit rework loops',()=>{
 const b=template('Causal Branching');
 assert.equal(validConnection(b,'Causal Branching','c3','c0'),false);
 assert.equal(validConnection(b,'Causal Branching','c2','c3'),true);
 const p=template('Process Map');assert.equal(validConnection(p,'Process Map','p4','p1'),true);
});
test('AI additions are append only, assumptions, and atomic on invalid edges',()=>{
 const b=template('Causal Branching'),before=structuredClone(b);
 const p={message:'Example',nodes:[{id:'new','kind':'Causal factor',label:'Possible scheduling issue',status:'Confirmed',x:1000,y:280}],edges:[{source:'c0',target:'new'}]};
 const result=applyProposal(b,'Causal Branching',p);
 assert.equal(result.nodes.length,b.nodes.length+1);assert.equal(result.nodes.at(-1).data.status,'Assumption');assert.deepEqual(b,before);
 assert.throws(()=>applyProposal(b,'Causal Branching',{...p,edges:[{source:'c3',target:'c0'}]}),/cycle/);assert.deepEqual(b,before);
 assert.throws(()=>applyProposal(b,'Causal Branching',{...p,nodes:[{...p.nodes[0],kind:'Unsupported'}]}));
 assert.throws(()=>applyProposal(b,'Causal Branching',{...p,nodes:[{...p.nodes[0],x:Infinity}]}));
});
test('AI uses upward connectors for causal conditions and preserves parent coordinates',()=>{
 const b=template('Events & Causal Factors Chart');
 const next=applyProposal(b,'Events & Causal Factors Chart',{message:'Example',nodes:[{id:'cond','kind':'Condition',label:'Example condition',x:750,y:60,parentId:'local'}],edges:[{source:'e1',target:'cond'}]});
 assert.equal(next.edges.at(-1).sourceHandle,'top-out');assert.equal(next.nodes.at(-1).parentId,'local');
 assert.deepEqual(readBoard(next,'Events & Causal Factors Chart').nodes.at(-1).position,{x:750,y:330});
});
test('matrix position yields correct quadrant and outside state',()=>{
 const b=template('Ease Benefit Matrix'),n=b.nodes.find(n=>n.id==='s1');
 assert.match(quadrant(n,b.nodes),/Highest priority/);
 assert.match(quadrant({...n,position:{x:100,y:430}},b.nodes),/Lowest priority/);
 assert.equal(quadrant({...n,position:{x:1100,y:430}},b.nodes),'Outside matrix');
});
test('groups preserve relative placement; invalid nested frames and invisible edges are rejected',()=>{
 const b=template('Brainstorming & Affinity Diagram');
 const p={message:'Example',nodes:[{id:'new-group',kind:'Group',label:'Ideas',x:1200,y:0},{id:'new-note',kind:'Note',label:'An idea',x:30,y:70,parentId:'new-group'}],edges:[]};
 const result=applyProposal(b,'Brainstorming & Affinity Diagram',p);assert.equal(result.nodes.at(-1).parentId,result.nodes.at(-2).id);
 assert.throws(()=>applyProposal(b,'Brainstorming & Affinity Diagram',{...p,edges:[{source:'new-group',target:'new-note'}]}));
 assert.throws(()=>applyProposal(b,'Brainstorming & Affinity Diagram',{...p,nodes:[{...p.nodes[0],parentId:'g1'}]}));
});
