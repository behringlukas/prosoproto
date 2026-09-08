export type Snapshot={text:string;data:any};
export type EditorProps={method:string;onSnapshot:(s:Snapshot)=>void;initialData?:any;persistLocally?:boolean;externalAssistant?:boolean;onController?:(controller:{apply:(p:any)=>void})=>void};
export function readSaved(key:string){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
export function saveLocal(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
export function download(name:string,data:unknown){const url=URL.createObjectURL(new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
