import {z} from 'zod';
export type StepId=1|2;
export type MethodType='flow'|'docs'|'chart'|'ui';
export type MethodDefinition={id:string;name:string;editor:string;type:MethodType;steps:number[];description:string};
export const methodCatalog:MethodDefinition[]=[
 {id:'gap',name:'Gap Graph',editor:'Gap Graph',type:'chart',steps:[1,3],description:'Compare the actual result with the standard.'},
 {id:'voc',name:'VoC Matrix',editor:'VoC Matrix',type:'docs',steps:[2],description:'Capture customer needs, importance and actual performance.'},
 {id:'process',name:'Process Map',editor:'Process Map',type:'flow',steps:[2],description:'Map the process and identify where the problem occurs.'},
 {id:'timeline',name:'Timeline',editor:'Timeline',type:'flow',steps:[2],description:'Put events and changes in chronological order.'},
 {id:'series',name:'Time Series Chart',editor:'Time Series Chart',type:'chart',steps:[2,7],description:'See how performance changes over time.'},
 {id:'collection',name:'Data Collection Plan',editor:'Data Collection Plan',type:'docs',steps:[2,7],description:'Plan what to measure, how, when and by whom.'},
 {id:'tally',name:'Tally Chart',editor:'Tally Chart',type:'docs',steps:[2],description:'Record occurrences in an editable table.'},
 {id:'pareto',name:'Pareto Chart',editor:'Pareto Chart',type:'chart',steps:[2],description:'Identify the largest contributors to the problem.'},
 {id:'interviews',name:'Interviews',editor:'Interviews',type:'docs',steps:[2],description:'Record first-hand accounts and evidence to follow up.'},
 {id:'gemba',name:'Human Performance Observation / Gemba Card',editor:'Gemba Card',type:'docs',steps:[2,4],description:'Observe the task, working conditions and human performance.'},
 {id:'hop',name:'HOP Tier Cards',editor:'HOP Guide',type:'docs',steps:[2,4],description:'Use human performance prompts and capture discussion notes.'},
 {id:'human',name:'Human-Related Questions',editor:'Human-Related Questions',type:'docs',steps:[2,4],description:'Explore context, expectations, resources and support.'},
 {id:'target',name:'Target Graph',editor:'Target Graph',type:'chart',steps:[3],description:'Set the target performance.'},
 {id:'fishbone',name:'Fishbone / Ishikawa',editor:'Fishbone / Ishikawa',type:'flow',steps:[4],description:'Explore causes across the six categories.'},
 {id:'five-why',name:'5 Why',editor:'5 Why',type:'docs',steps:[4],description:'Follow the causal chain and record supporting evidence.'},
 {id:'causal',name:'Causal Branching',editor:'Causal Branching',type:'flow',steps:[4],description:'Break the problem into contributing factors.'},
 {id:'events',name:'Events & Causal Factors Chart',editor:'Events & Causal Factors Chart',type:'flow',steps:[4],description:'Connect events, conditions and systemic factors.'},
 {id:'fault',name:'Logic Fault Tree',editor:'Logic Fault Tree',type:'flow',steps:[4],description:'Explore combinations of failure events with logic gates.'},
 {id:'defense',name:'Defense Analysis',editor:'Defense Analysis',type:'docs',steps:[4],description:'Assess controls, barriers and safeguards.'},
 {id:'affinity',name:'Brainstorming & Affinity Diagram',editor:'Brainstorming & Affinity Diagram',type:'flow',steps:[5],description:'Collect and group ideas.'},
 {id:'ease',name:'Ease Benefit Matrix',editor:'Ease Benefit Matrix',type:'flow',steps:[5],description:'Position solutions by impact and ease.'},
 {id:'prioritization',name:'Prioritization Matrix',editor:'Prioritization Matrix',type:'ui',steps:[5],description:'Use the existing prioritization interface.'},
 {id:'error-traps',name:'Error Traps',editor:'Error Traps',type:'docs',steps:[5],description:'Identify error-prone conditions and ways to address them.'},
];
export const stepTitles={1:'Problem Clarification',2:'Problem Breakdown'};
export const fieldLabels={1:['What happened?','What should have happened?','What is the gap?','Impact','What are the measurements in place?'],2:['Who? What? Where? When? How much?']};
export type CaseItem={id:string;step:StepId;kind:'method'|'file';title:string;methodId?:string;data?:any;text?:string;updatedAt:string;uploadId?:string;localUrl?:string;mime?:string;size?:number};
export type CaseData={steps:Record<StepId,{fields:string[];done:boolean;date:string}>;items:CaseItem[]};
export const caseSchema=z.object({steps:z.object({'1':z.object({fields:z.array(z.string().max(20000)).length(5),done:z.boolean(),date:z.string().max(20)}),'2':z.object({fields:z.array(z.string().max(20000)).length(1),done:z.boolean(),date:z.string().max(20)})}),items:z.array(z.object({id:z.string().max(100),step:z.union([z.literal(1),z.literal(2)]),kind:z.enum(['method','file']),title:z.string().min(1).max(250),methodId:z.string().max(80).optional(),data:z.unknown().optional(),text:z.string().max(100000).optional(),updatedAt:z.string().max(50),uploadId:z.string().max(100).optional(),mime:z.string().max(150).optional(),size:z.number().optional()})).max(100)});
export function initialCase():CaseData{return {steps:{1:{done:true,date:'',fields:[
 'Packaging Line 3 changeovers averaged 95 minutes across 72 changeovers in the past four weeks, versus the 60-minute standard.',
 'Packaging Line 3 changeovers should consistently meet the 60-minute standard while maintaining QA line-clearance, documentation, and GMP requirements.',
 'Average changeover time is 35 minutes above the 60-minute standard (95 vs. 60 minutes).',
 'The gap is costing about 42 hours of packaging capacity per month.',
 'Duration, shift, product format, QA-clearance timing, documentation status, format-part availability, and cartoner adjustments.'
 ]},2:{done:false,date:'',fields:['Packaging operators, shift supervisors, QA personnel, warehouse/material handlers, maintenance technicians, and packaging engineering.\n\nChangeovers regularly exceed the 60-minute target, resulting in avoidable line downtime.\n\nSecondary Packaging Line 3, primarily during changes between carton, leaflet, and label formats.\n\nAcross all shifts and several product formats during the past four weeks.\n\n72 changeovers · 95-minute average · 35 minutes above standard.']}},items:[{id:'sample-gap',step:1,kind:'method',title:'Gap Graph',methodId:'gap',data:{sample:true},text:'Current: 95 min. Standard: 60 min. Gap: 35 min.',updatedAt:''},{id:'sample-pareto',step:2,kind:'method',title:'Avg delay per changeover',methodId:'pareto',data:{sample:true},text:'Illustrative delay ranking: clearance and documentation, format parts, equipment set-up, cleaning tools, handover ownership.',updatedAt:''}]}}
export function documentText(value:any):string {if(typeof value==='string')return value.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();if(!value)return '';return [value.text||'',...(value.content||[]).map(documentText)].filter(Boolean).join(' ')}
