import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { defaultCourse, type Course } from './course';
export const runtime = () => env as unknown as { DB?: D1Database; ADMIN_EMAIL?: string; OPENAI_API_KEY?: string; OPENAI_MODEL?: string };
export function db() { const value = runtime().DB; if (!value) throw new Error('질문 저장소에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'); return value; }
export async function isAdmin() { const user = await getChatGPTUser(); return !!user && !!runtime().ADMIN_EMAIL && user.email.toLowerCase() === runtime().ADMIN_EMAIL!.trim().toLowerCase(); }
export async function course(): Promise<Course> { const row = await db().prepare('SELECT value FROM settings WHERE id = ?').bind('course').first<{value:string}>(); return row ? JSON.parse(row.value) : defaultCourse; }
export function json(value: unknown, status = 200) { return Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } }); }
export function sameOrigin(req: Request) { const origin = req.headers.get('origin'); return !origin || origin === new URL(req.url).origin; }
export async function body(req: Request) { if (!sameOrigin(req)) throw new Error('허용되지 않은 요청입니다.'); const text = await req.text(); if (text.length > 45000) throw new Error('입력 내용이 너무 깁니다.'); return JSON.parse(text); }
export async function rateLimit(req: Request, action: string, max: number) {
  const ip = req.headers.get('cf-connecting-ip') || 'local'; const now = Date.now(); const window = Math.floor(now / 3600000);
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + action + window));
  const key = Array.from(new Uint8Array(hash), x=>x.toString(16).padStart(2,'0')).join('');
  const result = await db().prepare('INSERT INTO limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+3600000).first<{count:number}>();
  await db().prepare('DELETE FROM limits WHERE expires < ?').bind(now).run();
  return !!result && result.count <= max;
}
