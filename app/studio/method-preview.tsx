'use client';
import {FileText,Network,BarChart3,Image as ImageIcon} from 'lucide-react';
import {type CaseItem,documentText,methodCatalog} from '@/lib/case-data';
import {lazy,Suspense} from 'react';
const SavedBoard=lazy(()=>import('./saved-preview').then(m=>({default:m.SavedBoard})));
const SavedDocument=lazy(()=>import('./saved-preview').then(m=>({default:m.SavedDocument})));
export function MethodPreview({item}:{item:CaseItem}){
 const definition=methodCatalog.find(m=>m.id===item.methodId);
 if(item.kind==='file')return item.mime?.startsWith('image/')?<img className="attachment-image" src={item.localUrl||`/api/files/${item.uploadId}`} alt={item.title}/>:<div className="file-preview"><FileText size={54}/><strong>{item.mime==='application/pdf'?'PDF document':item.title.split('.').pop()?.toUpperCase()+' file'}</strong><span>{Math.ceil((item.size||0)/1024)} KB</span></div>;
 if(definition?.type==='ui'||(definition?.type==='chart'&&!['gap','pareto'].includes(item.methodId||'')))return <div className="file-preview"><BarChart3 size={42}/><strong>{definition.name}</strong><span>Existing {definition.type==='ui'?'UI':'graph editor'} integration</span></div>;
 if(definition?.type==='chart')return <div className="chart-preview"><div className={'reference-crop '+(item.methodId==='gap'?'gap-crop':'pareto-crop')}><img src={item.methodId==='gap'?'/reference/step-1.png':'/reference/step-2.png'} alt={item.methodId==='gap'?'Sample gap graph: current 95 minutes, ideal 60 minutes, gap 35 minutes':'Sample Pareto chart of changeover delays'}/></div><span className="sample-label">Sample chart</span></div>;
 if(definition?.type==='flow'&&item.data?.nodes)return <Suspense fallback={<div className="loading">Loading preview…</div>}><SavedBoard key={item.id+item.updatedAt} item={item}/></Suspense>;
 return <Suspense fallback={<div className="loading">Loading preview…</div>}><SavedDocument key={item.id+item.updatedAt} item={item}/></Suspense>;
}
