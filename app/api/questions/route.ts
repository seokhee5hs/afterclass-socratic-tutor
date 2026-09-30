import { z } from 'zod';
import { body, db, json, rateLimit } from '@/lib/server';
import { topics } from '@/lib/course';
const schema = z.object({ id:z.string().uuid(), name:z.string().trim().min(1).max(50), studentId:z.string().trim().regex(/^[A-Za-z0-9-]{3,30}$/), email:z.string().trim().email().max(254), topic:z.string().refine(x=>topics.some(t=>t.id===x)), question:z.string().trim().min(5).max(3000), consent:z.literal(true), transcript:z.array(z.object({role:z.enum(['user','assistant']),content:z.string().max(5000)})).max(16).default([]) });
export async function POST(req: Request) { try { const parsed=schema.safeParse(await body(req)); if(!parsed.success) return json({error:'이름, 학번, 이메일, 질문(5자 이상)과 개인정보 수집 동의를 확인해주세요.'},400);
  if(!await rateLimit(req,'question',30)) return json({error:'잠시 쉬었다가 다시 제출해주세요.'},429);
  const p=parsed.data;
  await db().prepare('INSERT INTO questions (id,name,student_id,email,topic,question,transcript,status,answer,created_at) VALUES (?,?,?,?,?,?,?,\'new\',\'\',?) ON CONFLICT(id) DO NOTHING').bind(p.id,p.name,p.studentId,p.email,p.topic,p.question,JSON.stringify(p.transcript),new Date().toISOString()).run();
  return json({ok:true,id:p.id},201);
} catch { return json({error:'질문을 저장하지 못했습니다. 입력 내용은 유지되므로 다시 시도해주세요.'},503); } }
