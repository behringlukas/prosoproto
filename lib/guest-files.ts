const formats:Record<string,string>={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',pdf:'application/pdf',txt:'text/plain',csv:'text/csv',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
export function attachmentMime(file:{name:string;type:string;size:number}){
 if(!file.size||file.size>15*1024*1024)throw Error('Choose a non-empty file smaller than 15 MB.');
 const mime=file.type&&file.type!=='application/octet-stream'?file.type:formats[file.name.split('.').pop()?.toLowerCase()||''];
 if(!Object.values(formats).includes(mime))throw Error('Use PNG, JPG, WebP, PDF, Word, Excel, PowerPoint, TXT or CSV.');
 return mime;
}
