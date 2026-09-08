import {generateJSON} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {TableKit} from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {createWordBlob} from './export-docx';
export async function downloadDocument(data:any,title:string){
 const content=typeof data==='string'?generateJSON(data,[StarterKit,TableKit,TaskList,TaskItem.configure({nested:true})]):data;
 if(!content)throw new Error('The document is still opening. Please try again.');
 const blob=await createWordBlob(content as any,title);
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=(title.replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').trim()||'Method')+'.docx';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
