'use client';
import {useEditor,EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {TableKit} from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {useEffect,useState} from 'react';
import {EditorProps,readSaved,saveLocal} from '@/lib/editor-types';
import {docTemplates as templates} from '@/lib/doc-templates';
export default function Docs({method,onSnapshot,initialData,persistLocally=true}:EditorProps){const key=`studio-docs-${method}`;const [initial]=useState(()=>initialData??(persistLocally?readSaved(key):null)??templates[method]);const [saved,setSaved]=useState(true);const guide=method==='HOP Guide'&&persistLocally;const editor=useEditor({extensions:[StarterKit,TableKit.configure({table:{resizable:true}}),TaskList,TaskItem.configure({nested:true})],content:initial,editorProps:{attributes:{role:"textbox","aria-label":"Method document","aria-multiline":"true"}},immediatelyRender:false,editable:!guide,onUpdate:({editor})=>{const data=editor.getJSON();setSaved(persistLocally?saveLocal(key,data):true);onSnapshot({text:editor.getText(),data})}});
useEffect(()=>{if(editor)onSnapshot({text:editor.getText(),data:editor.getJSON()})},[editor,onSnapshot]);
if(!editor)return <div className="loading">Opening document…</div>;
const actions:[string,()=>void][]=[['Bold',()=>editor.chain().focus().toggleBold().run()],['Italic',()=>editor.chain().focus().toggleItalic().run()],['Heading',()=>editor.chain().focus().toggleHeading({level:2}).run()],['Bullets',()=>editor.chain().focus().toggleBulletList().run()],['Checklist',()=>editor.chain().focus().toggleTaskList().run()],['Table',()=>editor.chain().focus().insertTable({rows:3,cols:3,withHeaderRow:true}).run()],['Add row',()=>editor.chain().focus().addRowAfter().run()],['Add column',()=>editor.chain().focus().addColumnAfter().run()],['Undo',()=>editor.chain().focus().undo().run()],['Redo',()=>editor.chain().focus().redo().run()]];
return <div className="docs-stack"><div className="doc-toolbar">{guide?<span className="guide-badge">Reference guide · Read only</span>:actions.map(([label,fn])=><button className="chip" key={label} onClick={fn} disabled={['Add row','Add column'].includes(label)&&!editor.isActive('table')}>{label}</button>)}<small>{guide?'Selected guidance':!persistLocally?'Editing method':saved?'Saved locally':'Local storage full — export your work'}</small></div><div className="doc-scroll"><article className="paper"><div className="paper-meta">PROBLEM SOLVING <span>{guide?'REFERENCE':'WORKING DOCUMENT'}</span></div><EditorContent editor={editor}/></article></div></div>}
