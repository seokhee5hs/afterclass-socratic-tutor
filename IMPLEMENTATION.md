# Afterclass

감성컴퓨팅 5주차 강의와 TEMPLATE 01을 적용한 학생용 튜터 및 교수자 질문함.

`/`: 학생 대화, 네 가지 강의 주제, 힌트, 학습 정리, 질문 제출.
`/admin`: 관리자 로그인, 질문함(10초 갱신), 검색, 답변 초안, 메일 앱 연결, 발송 확인, 삭제, 수업 설정, QR.

서버 D1에 질문/선택 첨부 대화/답변/설정을 저장. 학생 대화는 기본적으로 화면 메모리에만 유지. 이름·학번·이메일 필드는 AI 요청에서 제외. 자유 입력에 사용자가 개인정보를 작성하면 대화와 함께 전송될 수 있음.

ADMIN_EMAIL과 인증된 ChatGPT 이메일이 일치해야 관리자 API 접근 가능. 미설정 시 차단. OPENAI_API_KEY가 없으면 준비 질문 모드로 명확히 표시. 연결 시 Responses API의 구조화 출력, store:false 사용. 자동 이해도 평가는 실제 AI 연결 후 확인 필요.

이메일은 mailto로 교수자의 메일 앱을 열고 직접 발송. 초안 저장과 발송 확인을 구분. 자동 발송 기능은 없음.

## 강의 근거

사용자 제공 40쪽 PDF의 글꼴 매핑 문제로 텍스트 추출이 깨져 주요 페이지를 렌더링해 직접 확인. 원본은 사이트에 업로드하지 않음. lib/course.ts에 강의 요약과 페이지를 기록.

- 1–10쪽: 몸과 마음, 빠른/느린 처리, 자기 생존 메커니즘, Tandem.
- 11–20쪽: 감정과 의식, 상태 보고와 주관적 경험의 구분.
- 21–32쪽: 감성 지능의 이해/표현/조절/활용.
- 33–40쪽: 개인정보, 감정 조작, 개인차와 문화차, 투명성.

기계 의식과 감정 경험을 확정된 사실로 단정하지 않도록 튜터 지침에 명시.

## 실행

Node >=22.13.0. npm ci 후 .env.example을 .env로 복사. 배포 서버 값은 Sites secret으로 관리.
npm run db:generate, npm run build 후 생성된 drizzle SQL을 로컬 D1에 순서대로 적용. npm run dev로 실행.

Portable 개발 인증은 starter의 seedy@sites.test 모의 계정. 로컬 검증에서만 ADMIN_EMAIL을 이 계정으로 설정하며 프로덕션 설정과 분리.

## 운영 전 연결

OpenAI API key를 서버 secret으로 연결하고 실제 맞춤 대화 검증. 최초 게시된 비공개 사이트의 학생 접근 권한 설정. 교수자는 메일 앱에서 직접 발송. 개인정보 보관 및 삭제 운영은 수업 방침에 맞춰 설정.

공식 API 문서: https://developers.openai.com/api/docs/guides/structured-outputs

## 배포 검증

Sites의 공식 site-workflow.mjs와 package-site.sh를 사용한다. 배포 아카이브의 메타데이터와 마이그레이션은 반드시 dist/.openai/hosting.json 및 dist/.openai/drizzle/에 있어야 한다. 루트 .openai/에만 넣으면 데이터베이스 테이블 생성이 누락될 수 있다. 저장 전에 `node tests/check-artifact.mjs <archive>`로 경로를 검증한다. 배포 성공만으로 기능 정상 동작을 단정하지 않고 데이터베이스 테이블 목록과 실제 튜터 응답을 확인한다.
