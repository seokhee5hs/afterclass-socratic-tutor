import { z } from 'zod';
import { body, course, db, isAdmin, json, runtime } from '@/lib/server';
export async function GET() { if(!await isAdmin()) return json({error:'교수자 계정으로 로그인해야 합니다.'},403); try { const rows=await db().prepare('SELECT * FROM questions ORDER BY created_at DESC LIMIT 500').all(); return json({questions:rows.results,course:await course(),aiReady:!!runtime().OPENAI_API_KEY}); } catch {return json({error:'질문함을 불러오지 못했습니다.'},503);} }
export async function POST(req:Request) { if(!await isAdmin()) return json({error:'관리자 권한이 없습니다.'},403); try {const p=await body(req);
  if(p.action==='settings') {const value=z.object({title:z.string().trim().min(1).max(100),week:z.string().trim().min(1).max(30),audience:z.string().trim().min(1).max(150),objective:z.string().trim().min(1).max(1000)}).parse(p.course); await db().prepare('INSERT INTO settings (id,value) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').bind('course',JSON.stringify(value)).run();}
  else if(p.action==='reply') {const value=z.object({id:z.string().uuid(),answer:z.string().trim().max(5000),status:z.enum(['new','draft','answered'])}).parse(p); if(value.status==='answered'&&!value.answer) return json({error:'답변을 먼저 작성해주세요.'},400); const result=await db().prepare('UPDATE questions SET answer=?,status=?,answered_at=? WHERE id=?').bind(value.answer,value.status,value.status==='answered'?new Date().toISOString():null,value.id).run(); if(!result.meta.changes) return json({error:'질문을 찾을 수 없습니다.'},404);}
  else if(p.action==='delete') { const id=z.string().uuid().parse(p.id); await db().prepare('DELETE FROM questions WHERE id=?').bind(id).run(); }
  else return json({error:'지원하지 않는 요청입니다.'},400);
  return json({ok:true});
} catch{return json({error:'저장하지 못했습니다. 입력 내용과 연결 상태를 확인해주세요.'},400);} }
