import { topics } from './course.js';
const el = id => document.getElementById(id);
let topic = topics[0], turns = 0, entries = 0;
function text(tag, value, className) {
  const node = document.createElement(tag);
  node.textContent = value;
  if (className) node.className = className;
  return node;
}
function reply(question, hint = '', summary = '') {
  const card = text('div', '', 'tutor-message');
  const body = text('div', '', 'reply');
  body.append(text('div', '준비 질문 안내', 'speaker'));
  for (const [title, value, cls] of [['다음 질문', question, 'next-question'], ['짧은 힌트', hint, 'hint'], ['학습 정리', summary, 'summary']]) {
    if (!value) continue;
    const section = text('div', '', cls);
    section.append(text('b', title), text('p', value));
    body.append(section);
  }
  body.append(text('small', `강의자료 ${topic.pages}`, 'source'));
  card.append(body); el('conversation').append(card);
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function reset(next = topic) {
  if (entries && !window.confirm('현재 대화를 지우고 새로 시작할까요?')) return;
  topic = next; turns = 0; entries = 0;
  el('conversation').replaceChildren(); el('thought').value = '';
  el('goal').textContent = topic.goal;
  el('hint').disabled = el('summary').disabled = el('send').disabled = true;
  el('topics').replaceChildren();
  topics.forEach((item, i) => {
    const button = text('button', '', `topic ${item.id === topic.id ? 'active' : ''}`);
    button.setAttribute('aria-pressed', String(item.id === topic.id));
    const label = text('span', '');
    label.append(text('strong', item.title), text('small', `강의자료 ${item.pages}`));
    button.append(text('span', `0${i + 1}`, 'topic-number'), label);
    button.addEventListener('click', () => reset(item)); el('topics').append(button);
  });
  reply(topic.start);
}
el('thought').addEventListener('input', () => { el('send').disabled = !el('thought').value.trim(); });
el('composer').addEventListener('submit', event => {
  event.preventDefault(); const value = el('thought').value.trim(); if (!value) return;
  const message = text('div', '', 'student-message');
  message.append(text('span', '나의 생각'), text('p', value)); el('conversation').append(message);
  reply(topic.questions[Math.min(turns++, topic.questions.length - 1)]);
  entries++; el('thought').value = ''; el('send').disabled = true;
  el('hint').disabled = el('summary').disabled = false;
});
el('hint').addEventListener('click', () => reply(topic.questions[Math.min(Math.max(turns - 1, 0), topic.questions.length - 1)], topic.hint));
el('summary').addEventListener('click', () => reply(topic.questions.at(-1), '', `스스로 확인할 목표: ${topic.goal}\n작성한 답변을 돌아보고 잘 설명한 부분과 추가 확인이 필요한 부분을 각각 적어보세요. 준비 질문 모드는 이해 수준을 자동 평가하지 않습니다.`));
el('reset').addEventListener('click', () => reset());
reset();
