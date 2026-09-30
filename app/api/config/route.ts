import { course, json, runtime } from '@/lib/server';
export async function GET() { try { return json({ course: await course(), aiReady: !!runtime().OPENAI_API_KEY }); } catch { return json({error:'수업 정보를 불러오지 못했습니다. 새로고침해주세요.'},503); } }
