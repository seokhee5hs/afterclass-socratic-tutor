import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5173';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw Error('This test only permits local development.');
let cookie='';
async function call(path,body,auth=false){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json','Origin':base}:{}),...(auth?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
const config=await call('/api/config');assert.equal(config.status,200);assert.equal(config.data.course.title,'감성컴퓨팅');
assert.equal((await call('/api/admin')).status,403);
assert.equal((await call('/api/admin',{action:'delete',id:crypto.randomUUID()})).status,403);
assert.equal((await call('/api/questions',{name:'invalid'})).status,400);
const payload={id:crypto.randomUUID(),name:'통합검증 학생',studentId:'TEST2026',email:'smoke-test@example.invalid',topic:'body',question:'테스트 질문: 감정 모방과 감정 경험의 차이를 어떻게 확인할 수 있나요?',consent:true,transcript:[]};
assert.equal((await call('/api/questions',{...payload,consent:false})).status,400);
assert.equal((await call('/api/questions',payload)).status,201);
assert.equal((await call('/api/questions',payload)).status,201);
const reply=await call('/api/tutor',{topic:'body',action:'discuss',messages:[{role:'user',content:'회피 행동이 있다고 감정을 경험하는 것은 아닙니다.'}]});assert.equal(reply.status,200);assert.equal(reply.data.mode,'guided');assert.ok(reply.data.question);assert.equal(reply.data.hint,'');
const hint=await call('/api/tutor',{topic:'body',action:'hint',messages:[{role:'user',content:'모르겠습니다. 힌트를 주세요.'}]});assert.ok(hint.data.hint);
const summary=await call('/api/tutor',{topic:'body',action:'summary',messages:[{role:'user',content:'지금까지 학습을 정리해주세요.'}]});assert.ok(summary.data.summary);assert.match(summary.data.understanding,/자동 평가하지/);
const login=await fetch(base+'/signin-with-chatgpt?return_to=/admin',{redirect:'manual'});cookie=login.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');assert.ok(cookie);
try{
 const inbox=await call('/api/admin',null,true);assert.equal(inbox.status,200);assert.equal(inbox.data.questions.filter(q=>q.id===payload.id).length,1);
 assert.equal((await call('/api/admin',{action:'reply',id:payload.id,answer:'행동과 주관적 경험의 근거를 구분해보세요.',status:'draft'},true)).status,200);
 let q=(await call('/api/admin',null,true)).data.questions.find(q=>q.id===payload.id);assert.equal(q.status,'draft');assert.equal(q.answered_at,null);
 assert.equal((await call('/api/admin',{action:'reply',id:payload.id,answer:'',status:'answered'},true)).status,400);
 assert.equal((await call('/api/admin',{action:'reply',id:payload.id,answer:'발송 확인 테스트',status:'answered'},true)).status,200);
 q=(await call('/api/admin',null,true)).data.questions.find(q=>q.id===payload.id);assert.equal(q.status,'answered');assert.ok(q.answered_at);
 console.log('PASS: anonymous authorization, validation, consent, durable submission, idempotency, guided discussion/hint/summary, admin login, draft and answer status.');
}finally{const cleaned=await call('/api/admin',{action:'delete',id:payload.id},true);assert.equal(cleaned.status,200);}
console.log('PASS: test record removed; no real email was sent.');
