import { getChatGPTUser, chatGPTSignInPath } from '@/app/chatgpt-auth';
import { isAdmin } from '@/lib/server';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getChatGPTUser();if(!user||!await isAdmin())return <><header className="topbar"><a href="/" className="brand">afterclass<span className="brand-dot">.</span></a><a className="admin-link" href="/">학생 화면</a></header><main className="login-panel"><span className="mini-label">PROFESSOR ONLY</span><h2>교수자 질문함</h2><p>{user?'현재 로그인한 계정에는 관리자 권한이 없습니다. 등록된 교수자 계정으로 로그인해주세요.':'등록된 교수자 계정으로 로그인하면 학생 질문과 답변을 관리할 수 있습니다.'}</p>{user?<a className="primary" href="/signout-with-chatgpt?return_to=/admin" target="_top">계정 전환하기</a>:<a className="primary" href={chatGPTSignInPath('/admin')} target="_top">ChatGPT로 교수자 로그인</a>}</main></>;return <Admin email={user.email}/>;}
