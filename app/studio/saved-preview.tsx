'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ReactFlow,ReactFlowProvider,Background,useNodesInitialized,useReactFlow} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useEditor,EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {TableKit} from '@tiptap/extension-table';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {MethodNode,FrameNode,MatrixNode,FreehandNode,JunctionNode} from './flow-nodes';
import type {CaseItem} from '@/lib/case-data';
const nodeTypes={method:MethodNode,frame:FrameNode,matrix:MatrixNode,freehand:FreehandNode,junction:JunctionNode};
function FitSavedBoard(){const ready=useNodesInitialized();const {fitView}=useReactFlow();useEffect(()=>{if(ready)void fitView({padding:.15,minZoom:.01,maxZoom:1})},[ready,fitView]);return null}
export function SavedBoard({item}:{item:CaseItem}){
 const nodes=useMemo(()=>item.data.nodes.map((n:any)=>({...n,selected:false,dragging:false})),[item.data]);
 const edges=useMemo(()=>item.data.edges.map((e:any)=>({...e,selected:false})),[item.data]);
 return <div className="saved-board-preview" role="img" aria-label={`${item.title} saved whiteboard preview`}><div inert aria-hidden="true" className="saved-board-content"><ReactFlowProvider><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false} panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false} preventScrolling={false} minZoom={.01} maxZoom={1} fitView fitViewOptions={{padding:.15,minZoom:.01,maxZoom:1}}><FitSavedBoard/><Background color="#d5dfe8" gap={22}/></ReactFlow></ReactFlowProvider></div></div>
}
export function SavedDocument({item}:{item:CaseItem}){
 const container=useRef<HTMLDivElement>(null);const [scale,setScale]=useState(.4);
 const editor=useEditor({extensions:[StarterKit,TableKit,TaskList,TaskItem.configure({nested:true})],content:item.data,editable:false,immediatelyRender:false});
 useEffect(()=>{if(!container.current)return;const observer=new ResizeObserver(([entry])=>setScale(Math.max(.01,(entry.contentRect.width-20)/850)));observer.observe(container.current);return()=>observer.disconnect()},[]);
 return <div ref={container} className="saved-document-preview" role="img" aria-label={`${item.title} saved document preview`}><div inert aria-hidden="true" className="saved-document-content" style={{transform:`scale(${scale})`}}><article className="paper"><div className="paper-meta">PROBLEM SOLVING <span>WORKING DOCUMENT</span></div><EditorContent editor={editor}/></article></div></div>
}
