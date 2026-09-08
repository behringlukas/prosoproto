import {owner} from '@/lib/case-server';
import {requestSchema,askGemini} from '@/lib/gemini';
import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
const inflight=new Set<string>();
const recent=new Map<string,number>();
function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}})}
export async function POST(request:Request){
const identity=await owner();if(!identity)return json({error:'Sign in to this private prototype to use the assistant.'},401);
const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Request origin is not allowed.'},403);
let payload;try{const raw=await request.text();if(raw.length>150000)return json({error:'This board is too large for one assistant request. Use a smaller board.'},413);payload=requestSchema.parse(JSON.parse(raw))}catch{return json({error:'The board or message is invalid. Keep board text under 6,000 characters per element.'},400)}
const runtime=env as unknown as Record<string,string>;const key=runtime.GEMINI_API_KEY||process.env.GEMINI_API_KEY;const model=runtime.GEMINI_MODEL||process.env.GEMINI_MODEL||'gemini-3.5-flash-lite';if(!key)return json({error:'The Gemini connection is not configured on the server.'},503);
const now=Date.now();if(inflight.has(identity)||now-(recent.get(identity)||0)<2000)return json({error:'Please wait for the current request to finish.'},429);inflight.add(identity);recent.set(identity,now);
try{return json(await askGemini(payload,key,model,AbortSignal.timeout(45000)))}catch(e){return json({error:(e as Error).name==='TimeoutError'?'Gemini took too long. Please try again.':((e as Error).message.startsWith('Gemini ')?(e as Error).message:'The assistant could not connect. Please try again.')},502)}finally{inflight.delete(identity);for(const [u,time] of recent)if(Date.now()-time>60000)recent.delete(u)}
}
