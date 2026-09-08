import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export function response(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}})}
export async function owner(){const user=await getChatGPTUser();if(user)return user.email;
 // An isolated identity for the supervised development preview. Removed in production.
 if(import.meta.env.DEV)return 'development-preview';
 return null;
}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return !origin||origin===new URL(request.url).origin}
export function database(){const db=(env as any).DB;if(!db)throw new Error('Saved work is temporarily unavailable. Your open edits have been kept.');return db}
export function bucket(){const r2=(env as any).FILES;if(!r2)throw new Error('File storage is temporarily unavailable. Please try again.');return r2}
export function storageError(error:unknown){console.error('Problem workspace storage failed',error instanceof Error?error.message:'Unknown error');return response({error:'Could not save or load your work. Your open edits have been kept. Please try again.'},503)}
