import {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,CheckBox,ExternalHyperlink,HeadingLevel,WidthType,LevelFormat,AlignmentType,BorderStyle} from 'docx';
type RichNode={type:string;text?:string;attrs?:Record<string,any>;marks?:{type:string;attrs?:Record<string,any>}[];content?:RichNode[]};
// Consume the saved editor structure, preserving formatting instead of exporting its text summary.
export async function createWordBlob(content:RichNode,title:string){
 const numbering:any[]=[];
 function inline(nodes:RichNode[]=[]):any[]{return nodes.flatMap(n=>{
  if(n.type==='hardBreak')return [new TextRun({break:1})];
  if(n.type!=='text')return inline(n.content);
  const marks=n.marks||[],has=(type:string)=>marks.some(m=>m.type===type);
  const run=new TextRun({text:n.text||'',bold:has('bold'),italics:has('italic'),strike:has('strike'),underline:has('underline')?{}:undefined,font:has('code')?'Courier New':undefined});
  const href=marks.find(m=>m.type==='link')?.attrs?.href;
  return href&&/^https?:\/\//i.test(href)?[new ExternalHyperlink({link:href,children:[run]})]:[run];
 })}
 function blocks(nodes:RichNode[]=[],depth=0):any[]{return nodes.flatMap(n=>{
  if(n.type==='table'){
   const rows=n.content||[];const count=Math.max(1,...rows.map(r=>(r.content||[]).reduce((sum,c)=>sum+(c.attrs?.colspan||1),0)));
   const widths=Array.from({length:count},(_,i)=>Math.floor(9360/count)+(i<9360%count?1:0));
   const tableRows=rows.map(r=>{
    let column=0;
    const cells=(r.content||[]).map(c=>{
     const span=c.attrs?.colspan||1;
     const width=widths.slice(column,column+span).reduce((a,b)=>a+b,0);column+=span;
     const children=blocks(c.content,depth);
     return new TableCell({width:{size:width,type:WidthType.DXA},columnSpan:span,rowSpan:c.attrs?.rowspan||1,
      shading:c.type==='tableHeader'?{fill:'EAF4F2'}:undefined,
      margins:{top:100,bottom:100,left:120,right:120},children:children.length?children:[new Paragraph('')]});
    });
    return new TableRow({tableHeader:(r.content||[]).every(c=>c.type==='tableHeader'),children:cells});
   });
   return [new Table({width:{size:9360,type:WidthType.DXA},columnWidths:widths,indent:{size:120,type:WidthType.DXA},rows:tableRows}),new Paragraph({spacing:{after:80}})];
  }
  if(['bulletList','orderedList','taskList'].includes(n.type)){
   const reference='list-'+numbering.length;
   const ordered=n.type==='orderedList';
   if(n.type!=='taskList')numbering.push({reference,levels:Array.from({length:9},(_,level)=>({level,format:ordered?LevelFormat.DECIMAL:LevelFormat.BULLET,text:ordered?`%${level+1}.`:'•',start:ordered?(n.attrs?.start||1):1,alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:360*(level+1),hanging:200}}}}))});
   return (n.content||[]).flatMap(item=>{const children=item.content||[];const first=children[0]?.type==='paragraph'?children[0]:undefined;const level=Math.min(depth,8);return [new Paragraph({children:n.type==='taskList'?[new CheckBox({checked:!!item.attrs?.checked}),new TextRun(' '),...inline(first?.content)]:inline(first?.content),numbering:n.type==='taskList'?undefined:{reference,level},indent:n.type==='taskList'?{left:360*depth}:undefined,spacing:{after:100}}),...blocks(first?children.slice(1):children,depth+1)]});
  }
  if(n.type==='blockquote')return blocks(n.content,depth).map(p=>p instanceof Paragraph?(p as any):p);
  if(n.type==='horizontalRule')return [new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:4,color:'D9E3E9'}}})];
  if(n.type==='heading'||n.type==='paragraph'||n.type==='codeBlock')return [new Paragraph({children:inline(n.content),heading:n.type==='heading'?([HeadingLevel.HEADING_1,HeadingLevel.HEADING_2,HeadingLevel.HEADING_3,HeadingLevel.HEADING_4,HeadingLevel.HEADING_5,HeadingLevel.HEADING_6][Math.min(5,Math.max(0,(n.attrs?.level||1)-1))]):undefined,spacing:{after:120},alignment:n.attrs?.textAlign==='center'?AlignmentType.CENTER:n.attrs?.textAlign==='right'?AlignmentType.RIGHT:undefined})];
  return blocks(n.content,depth);
 })}
 const children=blocks(content.content);
 const document=new Document({
  title,creator:'Problem Solving',
  styles:{
   default:{document:{run:{font:'Arial',size:22,color:'34485B'},paragraph:{spacing:{after:120,line:276}}}},
   paragraphStyles:[
    {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Arial',size:36,bold:true,color:'18384D'},paragraph:{spacing:{before:120,after:200},keepNext:true}},
    {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Arial',size:26,bold:true,color:'244E61'},paragraph:{spacing:{before:220,after:100},keepNext:true}}
   ]
  },
  numbering:{config:numbering},
  sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},children:children.length?children:[new Paragraph(title)]}]
 });
 return Packer.toBlob(document);
}
