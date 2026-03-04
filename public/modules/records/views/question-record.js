/* ================================================================
   Records Module — views/question-record.js
   나의 질문함 — 카드 그리드 + 2단계 태그(출처+과목) + AI 토글
   ================================================================ */

import { state } from '../core/state.js';
import { DB } from '../core/api.js';
import { events, EVENTS } from '../core/events.js';
import { navigate } from '../core/router.js';
import { showXpPopup } from '../components/xp-popup.js';

let _autoTagTimer = null;

const SOURCE_TAGS = [
  { value: '수업', icon: '📖' },
  { value: '독서', icon: '📚' },
  { value: '수행평가', icon: '📝' },
  { value: '시험', icon: '📊' },
  { value: '창체', icon: '🎭' },
  { value: '기타', icon: '💭' },
];

const SUBJECT_TAGS = [
  { value: '국어', icon: '📕' },
  { value: '영어', icon: '📗' },
  { value: '수학', icon: '📘' },
  { value: '과학', icon: '📙' },
  { value: '기타', icon: '📓' },
];

const SUBJECT_COLORS = {
  '국어': '#EC4899', '영어': '#10B981', '수학': '#3B82F6',
  '과학': '#8B5CF6', '기타': '#F97316',
};

/* 세부 과목명 → 대분류 카테고리 */
function _getSubjectCategory(subject) {
  if (!subject) return '기타';
  if (['국어','문학','독서','화법','작문','언어','매체'].some(k => subject.includes(k))) return '국어';
  if (['영어','English'].some(k => subject.includes(k))) return '영어';
  if (['수학','미적분','확률','통계','기하'].some(k => subject.includes(k))) return '수학';
  if (['물리','화학','생명','지구','과학'].some(k => subject.includes(k))) return '과학';
  return '기타';
}

export function registerHandlers(RM) {
  RM.sendQuestion = () => sendQuestion();
  RM.sendQuestionOnEnter = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQuestion(); } };
  RM.selectQuestionSource = (src) => selectQuestionSource(src);
  RM.selectQuestionSubject = (subj) => selectQuestionSubject(subj);
  RM.handleQuestionCamera = (input) => handlePhotoInput(input);
  RM.handleQuestionGallery = (input) => handlePhotoInput(input);
  RM.sendPhotoQuestion = () => sendPhotoQuestion();
  RM.cancelPhotoPreview = () => { state._questionPhotoPreview = null; RM.render(); };
  RM.viewMyQuestion = (id) => viewMyQuestion(id);
  RM.backToQuestionList = () => { state._viewingMyQuestion = null; state._myQuestionDetail = null; RM.render(); };
  RM.submitMyAnswer = (qId) => submitMyAnswer(qId);
  RM.setMyQuestionFilter = async (f) => {
    state._myQuestionFilter = f;
    await DB.loadMyQuestions();
    RM.render();
  };
  RM.toggleQuestionResolved = (id, currentStatus) => toggleResolved(id, currentStatus);
  RM.toggleAiImprove = (id) => toggleAiImprove(id);
  RM.selectQuestionTag = (tag) => selectQuestionSource(tag);
}

/* ── 입력 / 전송 로직 ── */

function sendQuestion() {
  const el = document.getElementById('mq-chat-input');
  const text = el?.value?.trim();
  if (!text) return;
  el.value = '';
  state._pendingQuestionText = text;
  state._pendingQuestionImage = null;
  state._pendingQuestionSource = null;
  _startAutoTagTimer();
  navigate('record-question', { replace: true });
}

/* 사진 1200px 리사이즈 */
function _resizeImage(dataUrl, maxWidth) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function handlePhotoInput(input) {
  if (!input.files || input.files.length === 0) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    const resized = await _resizeImage(e.target.result, 1200);
    state._questionPhotoPreview = resized;
    navigate('record-question', { replace: true });
  };
  reader.readAsDataURL(input.files[0]);
  input.value = '';
}

function sendPhotoQuestion() {
  const memoEl = document.getElementById('mq-photo-memo');
  const memo = memoEl?.value?.trim() || '';
  const imageData = state._questionPhotoPreview;
  if (!imageData && !memo) return;
  state._pendingQuestionText = memo || '(사진 질문)';
  state._pendingQuestionImage = imageData;
  state._questionPhotoPreview = null;
  state._pendingQuestionSource = null;
  _startAutoTagTimer();
  navigate('record-question', { replace: true });
}

function _startAutoTagTimer() {
  if (_autoTagTimer) clearTimeout(_autoTagTimer);
  _autoTagTimer = setTimeout(() => {
    if (state._pendingQuestionText) selectQuestionSubject('기타');
  }, 3000);
}

/* 2단계 ① 출처 선택 */
function selectQuestionSource(src) {
  if (_autoTagTimer) { clearTimeout(_autoTagTimer); _autoTagTimer = null; }
  state._pendingQuestionSource = src;
  _startAutoTagTimer();
  navigate('record-question', { replace: true });
}

/* 2단계 ② 과목 선택 → 저장 */
async function selectQuestionSubject(subj) {
  if (_autoTagTimer) { clearTimeout(_autoTagTimer); _autoTagTimer = null; }
  const text = state._pendingQuestionText;
  const image = state._pendingQuestionImage;
  const source = state._pendingQuestionSource || '기타';
  if (!text) return;
  state._pendingQuestionText = null;
  state._pendingQuestionImage = null;
  state._pendingQuestionSource = null;

  const id = await DB.saveMyQuestion({
    subject: subj,
    source,
    title: text,
    content: '',
    imageData: image,
  });
  if (id) {
    showXpPopup(3, '질문 등록! +3 XP');
    events.emit(EVENTS.XP_EARNED, { amount: 3, label: '질문 등록' });
    await DB.loadMyQuestions();
    await DB.loadMyQuestionStats();
    navigate('record-question', { replace: true });
  }
}

async function toggleResolved(id, currentStatus) {
  const newResolved = currentStatus !== '답변완료';
  await DB.resolveMyQuestion(id, newResolved);
  if (newResolved) {
    showXpPopup(5, '질문 해결! +5 XP');
    events.emit(EVENTS.XP_EARNED, { amount: 5, label: '질문 해결' });
  }
  await DB.loadMyQuestions();
  await DB.loadMyQuestionStats();
  navigate('record-question', { replace: true });
}

async function viewMyQuestion(id) {
  state._viewingMyQuestion = id;
  const detail = await DB.getMyQuestionDetail(id);
  state._myQuestionDetail = detail;
  navigate('record-question', { replace: true });
}

async function submitMyAnswer(questionId) {
  const el = document.getElementById('mq-answer-input');
  const content = el?.value?.trim();
  if (!content) return;
  const result = await DB.saveMyAnswer(questionId, { content });
  if (result) {
    showXpPopup(5, '답변 작성! +5 XP');
    events.emit(EVENTS.XP_EARNED, { amount: 5, label: '답변 작성' });
    const detail = await DB.getMyQuestionDetail(questionId);
    state._myQuestionDetail = detail;
    await DB.loadMyQuestions();
    await DB.loadMyQuestionStats();
    navigate('record-question', { replace: true });
  }
}

async function toggleAiImprove(id) {
  const expanded = { ...(state._aiImproveExpanded || {}) };
  if (expanded[id]) {
    delete expanded[id];
    state._aiImproveExpanded = expanded;
    return;
  }
  expanded[id] = true;
  state._aiImproveExpanded = expanded;

  const q = (state._myQuestions || []).find(x => x.id === id);
  if (q && q.aiImproved) return;

  const improved = await DB.improveMyQuestion(id);
  if (improved) {
    const questions = state._myQuestions || [];
    const target = questions.find(x => x.id === id);
    if (target) target.aiImproved = improved;
    state._myQuestions = [...questions];
  }
}

/* ── 유틸 ── */

function _formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMin = Math.floor((now - d) / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function _getSubjectColor(subject) {
  const cat = _getSubjectCategory(subject);
  return SUBJECT_COLORS[cat] || '#F97316';
}

/* ── 카드 헤더 정보 ── */
function _getCardHeaderInfo(q) {
  const srcTag = SOURCE_TAGS.find(t => t.value === (q.source || q.subject));
  const srcIcon = srcTag ? srcTag.icon : '💭';
  const srcName = q.source || q.subject || '기타';

  if (q.source) {
    let label = srcIcon + ' ' + srcName;
    if (q.subject && q.subject !== q.source) label += ' · ' + q.subject;
    if (q.period) label += ' ' + q.period + '교시';
    return { label, icon: srcIcon };
  }
  return { label: srcIcon + ' ' + srcName, icon: srcIcon };
}

/* ── 통계 배너 ── */
function _renderStats() {
  const stats = state._myQuestionStats;
  if (!stats) return '';
  return `
    <div style="display:flex;gap:6px;padding:0 16px 10px;overflow-x:auto">
      <div style="flex:1;min-width:0;text-align:center;padding:8px 4px;background:rgba(108,92,231,0.08);border-radius:10px">
        <div style="font-size:18px;font-weight:800;color:var(--primary-light)">${stats.total || 0}</div>
        <div style="font-size:10px;color:var(--text-muted)">전체</div>
      </div>
      <div style="flex:1;min-width:0;text-align:center;padding:8px 4px;background:rgba(255,107,107,0.08);border-radius:10px">
        <div style="font-size:18px;font-weight:800;color:#FF6B6B">${stats.unanswered || 0}</div>
        <div style="font-size:10px;color:var(--text-muted)">미해결</div>
      </div>
      <div style="flex:1;min-width:0;text-align:center;padding:8px 4px;background:rgba(0,184,148,0.08);border-radius:10px">
        <div style="font-size:18px;font-weight:800;color:#00B894">${stats.answered || 0}</div>
        <div style="font-size:10px;color:var(--text-muted)">해결완료</div>
      </div>
      <div style="flex:1;min-width:0;text-align:center;padding:8px 4px;background:rgba(255,159,67,0.08);border-radius:10px">
        <div style="font-size:18px;font-weight:800;color:#FF9F43">${stats.weeklyQuestions || 0}</div>
        <div style="font-size:10px;color:var(--text-muted)">이번 주</div>
      </div>
    </div>
  `;
}

/* ── AI 토글 영역 ── */
function _renderAiToggle(q) {
  const isExpanded = !!(state._aiImproveExpanded || {})[q.id];
  let html = `
    <div style="padding:0 12px 6px">
      <button onclick="event.stopPropagation();_RM.toggleAiImprove(${q.id})" style="
        width:100%;background:rgba(124,106,239,0.08);border:1px solid rgba(124,106,239,0.15);
        border-radius:8px;padding:6px 10px;font-size:11px;color:#a78bfa;cursor:pointer;
        display:flex;align-items:center;justify-content:center;gap:4px;transition:all 0.15s;
      ">✨ AI 추천 질문 ${isExpanded ? '▲' : '▼'}</button>
    </div>`;

  if (!isExpanded) return html;

  if (q.aiImproved) {
    html += `
      <div style="padding:0 12px 8px;font-size:12px;line-height:1.6">
        <div style="color:#8b949e;margin-bottom:4px">💬 내가 쓴 질문:</div>
        <div style="color:#c9d1d9;margin-bottom:8px;padding:6px 8px;background:rgba(255,255,255,0.03);border-radius:6px">${q.title}</div>
        <div style="color:#a78bfa;margin-bottom:4px">✨ 선생님께 이렇게 여쭤보세요:</div>
        <div style="color:#f0f6fc;font-weight:600;padding:6px 8px;background:rgba(124,106,239,0.08);border-radius:6px;border-left:3px solid #7c6aef">${q.aiImproved}</div>
      </div>`;
  } else {
    html += `
      <div style="padding:8px 12px;text-align:center">
        <div class="rpt-btn-spinner" style="width:20px;height:20px;margin:0 auto 6px"></div>
        <div style="font-size:11px;color:#8b949e">AI가 질문을 고도화하고 있어요...</div>
      </div>`;
  }
  return html;
}

/* ── 카드 렌더링 ── */
function _renderCard(q, idx) {
  const hdr = _getCardHeaderInfo(q);
  const isResolved = q.status === '답변완료';
  const color = _getSubjectColor(q.subject);
  const hasImage = !!q.imageKey;

  return `
    <div class="qb-card ${isResolved ? 'qb-card--resolved' : ''}" style="animation-delay:${idx * 0.05}s" role="article">
      <div class="qb-card__header">
        <span class="qb-card__source">${hdr.label}</span>
        <span class="qb-card__date">${q.date || _formatDate(q.createdAt)}</span>
        <span class="qb-card__status ${isResolved ? 'qb-card__status--resolved' : 'qb-card__status--open'}">
          ${isResolved ? '✅ 해결완료' : '미해결'}
        </span>
      </div>

      <div class="qb-card__img-wrap" onclick="_RM.viewMyQuestion(${q.id})">
        ${hasImage ? `
          <img class="qb-card__img" src="${q.imageKey}" alt="질문 사진" loading="lazy">
        ` : `
          <div class="qb-card__ph" style="background:linear-gradient(135deg, ${color}15, ${color}08)">
            ${hdr.icon}
          </div>
        `}
        <div class="qb-card__subject-bar" style="background:linear-gradient(transparent, ${color}cc)">
          ${hdr.label}
        </div>
      </div>

      <div class="qb-card__body" onclick="_RM.viewMyQuestion(${q.id})">
        <div class="qb-card__text">${q.title}</div>
      </div>

      ${_renderAiToggle(q)}

      <div class="qb-card__actions">
        ${q.answerCount > 0 ? `<span style="font-size:10px;color:#2dd4a8;margin-right:auto"><i class="fas fa-comment-dots"></i> 답변 ${q.answerCount}</span>` : '<span style="margin-right:auto"></span>'}
        <button class="qb-card__action-btn ${isResolved ? 'qb-card__action-btn--resolved' : 'qb-card__action-btn--resolve'}" onclick="event.stopPropagation();_RM.toggleQuestionResolved(${q.id},'${q.status}')">
          ${isResolved ? '✅ 해결완료' : '☐ 해결완료'}
        </button>
      </div>
    </div>
  `;
}

/* ── 펜딩 카드 + 2단계 태그 선택 ── */
function _renderPendingCard() {
  const text = state._pendingQuestionText;
  if (!text) return '';
  const image = state._pendingQuestionImage;
  const source = state._pendingQuestionSource;
  const isStep2 = !!source;
  const tags = isStep2 ? SUBJECT_TAGS : SOURCE_TAGS;
  const handler = isStep2 ? 'selectQuestionSubject' : 'selectQuestionSource';
  const srcTag = isStep2 ? SOURCE_TAGS.find(t => t.value === source) : null;
  const stepLabel = isStep2
    ? (srcTag ? srcTag.icon : '💭') + ' ' + source + ' 선택됨 → 과목을 선택하세요'
    : '출처를 선택하세요';

  return `
    <div style="grid-column:1/-1;margin-bottom:4px">
      <div class="qb-card" style="border:2px dashed rgba(108,92,231,0.4);opacity:0.85">
        ${image ? `
          <div class="qb-card__img-wrap">
            <img class="qb-card__img" src="${image}" alt="첨부 사진">
          </div>
        ` : ''}
        <div class="qb-card__body">
          <div class="qb-card__text">${text !== '(사진 질문)' ? text : ''}</div>
        </div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:8px;justify-content:center">
        ${tags.map(t => `
          <button onclick="_RM.${handler}('${t.value}')" style="
            padding:5px 12px;border-radius:20px;border:1px solid var(--border);
            background:var(--card-bg);color:var(--text-primary);
            font-size:12px;cursor:pointer;white-space:nowrap;transition:all 0.15s;
          ">${t.icon}${t.value}</button>
        `).join('')}
      </div>
      <div style="text-align:center;font-size:10px;color:var(--text-muted);margin-top:6px">
        ${stepLabel} (3초 후 자동 '기타')
      </div>
    </div>
  `;
}

/* ── 사진 프리뷰 오버레이 ── */
function _renderPhotoPreview() {
  const src = state._questionPhotoPreview;
  if (!src) return '';
  return `
    <div style="
      position:absolute;bottom:60px;left:0;right:0;
      background:var(--card-bg);border-top:1px solid var(--border);
      padding:12px 16px;z-index:50;
    ">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="position:relative;flex-shrink:0">
          <img src="${src}" style="width:80px;height:80px;object-fit:cover;border-radius:10px;border:1px solid var(--border)">
          <button onclick="_RM.cancelPhotoPreview()" style="
            position:absolute;top:-6px;right:-6px;width:20px;height:20px;
            border-radius:50%;background:rgba(0,0,0,0.7);color:#fff;border:none;
            font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;
          ">&times;</button>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px">
          <input type="text" id="mq-photo-memo" placeholder="사진에 대한 질문을 적어보세요..." style="
            width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--border);
            background:var(--bg);color:var(--text-primary);font-size:13px;box-sizing:border-box;
          ">
          <button onclick="_RM.sendPhotoQuestion()" style="
            align-self:flex-end;padding:6px 16px;border-radius:8px;border:none;
            background:var(--primary);color:#fff;font-size:12px;font-weight:700;cursor:pointer;
          ">보내기</button>
        </div>
      </div>
    </div>
  `;
}

/* ── 하단 입력바 ── */
function _renderInputBar() {
  return `
    <div style="
      position:sticky;bottom:0;left:0;right:0;
      background:var(--card-bg);border-top:1px solid var(--border);
      padding:8px 10px;display:flex;align-items:center;gap:6px;
      z-index:40;
    ">
      <label style="flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:50%;background:rgba(108,92,231,0.1);color:var(--primary-light);font-size:14px">
        📷
        <input type="file" accept="image/*" capture="camera" style="display:none" onchange="_RM.handleQuestionCamera(this)">
      </label>
      <label style="flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:50%;background:rgba(0,184,148,0.1);color:#00B894;font-size:14px">
        🖼️
        <input type="file" accept="image/*" style="display:none" onchange="_RM.handleQuestionGallery(this)">
      </label>
      <input type="text" id="mq-chat-input" placeholder="질문을 적어보세요..." onkeydown="_RM.sendQuestionOnEnter(event)" style="
        flex:1;padding:8px 12px;border-radius:20px;border:1px solid var(--border);
        background:var(--bg);color:var(--text-primary);font-size:13px;
        outline:none;min-width:0;
      ">
      <button onclick="_RM.sendQuestion()" style="
        flex-shrink:0;width:32px;height:32px;border-radius:50%;border:none;
        background:var(--primary);color:#fff;font-size:13px;cursor:pointer;
        display:flex;align-items:center;justify-content:center;
      "><i class="fas fa-arrow-up"></i></button>
    </div>
  `;
}

/* ── 질문 상세 (답변 스레드) ── */
function _renderQuestionDetail() {
  const detail = state._myQuestionDetail;
  if (!detail) {
    return `
      <div style="text-align:center;padding:40px 0">
        <div class="rpt-btn-spinner" style="width:28px;height:28px;margin:0 auto 10px"></div>
        <p style="color:var(--text-muted);font-size:13px">로딩 중...</p>
      </div>
    `;
  }

  const q = detail.question || detail;
  const answers = detail.answers || [];
  const isResolved = q.status === '답변완료';

  const srcTag = SOURCE_TAGS.find(t => t.value === (q.source || q.subject));
  const srcIcon = srcTag ? srcTag.icon : '💭';
  const srcName = q.source || q.subject || '기타';
  let headerLabel = srcIcon + ' ' + srcName;
  if (q.source && q.subject && q.subject !== q.source) headerLabel += ' · ' + q.subject;
  if (q.period) headerLabel += ' ' + q.period + '교시';

  return `
    <div style="flex:1;overflow-y:auto;padding:16px">
      <div style="background:#1c2333;border-radius:14px;padding:16px;margin-bottom:16px;border:${isResolved ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)'}">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;font-size:11px">
          <span style="font-weight:700;color:#8b949e">${headerLabel}</span>
          <span style="color:#484f58">${q.date || _formatDate(q.created_at)}</span>
          <span style="margin-left:auto;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;${isResolved ? 'background:rgba(45,212,168,0.15);color:#2dd4a8' : 'background:rgba(255,107,107,0.15);color:#FF6B6B'}">
            ${isResolved ? '✅ 해결완료' : '미해결'}
          </span>
        </div>
        ${q.image_key ? `<img src="${q.image_key}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;margin-bottom:10px">` : ''}
        <div style="font-size:15px;font-weight:700;color:#f0f6fc;line-height:1.6;word-break:break-word">${q.title || ''}</div>
        ${q.content ? `<div style="margin-top:6px;font-size:13px;color:#8b949e;line-height:1.6;white-space:pre-wrap">${q.content}</div>` : ''}
        ${q.ai_improved ? `
          <div style="margin-top:10px;padding:10px;background:rgba(124,106,239,0.08);border-radius:8px;border-left:3px solid #7c6aef">
            <div style="font-size:11px;color:#a78bfa;margin-bottom:4px">✨ 선생님께 이렇게 여쭤보세요:</div>
            <div style="font-size:13px;color:#f0f6fc;line-height:1.6;font-weight:600">${q.ai_improved}</div>
          </div>
        ` : ''}
      </div>

      ${_renderDetailAnswers(answers)}
    </div>

    ${_renderAnswerInput(q.id)}
  `;
}

function _renderDetailAnswers(answers) {
  if (answers.length === 0) {
    return '<div style="text-align:center;padding:24px 0;color:#484f58;font-size:13px">아직 답변이 없습니다</div>';
  }
  let html = `<div style="font-size:12px;font-weight:700;color:#8b949e;margin-bottom:8px">답변 ${answers.length}개</div>`;
  for (const a of answers) {
    html += `
      <div style="background:#242d3d;border-radius:12px;padding:14px;margin-bottom:8px;border-left:3px solid #2dd4a8">
        <div style="font-size:13px;color:#f0f6fc;line-height:1.6;white-space:pre-wrap">${a.content || ''}</div>
        <div style="font-size:10px;color:#484f58;margin-top:8px">${_formatDate(a.created_at)}</div>
      </div>`;
  }
  return html;
}

function _renderAnswerInput(questionId) {
  return `
    <div style="
      border-top:1px solid rgba(255,255,255,0.08);padding:8px 12px;
      display:flex;align-items:center;gap:8px;background:#1c2333;
    ">
      <input type="text" id="mq-answer-input" placeholder="답변이나 찾은 해답을 적어보세요..." onkeydown="if(event.key==='Enter'){event.preventDefault();_RM.submitMyAnswer(${questionId})}" style="
        flex:1;padding:8px 12px;border-radius:20px;border:1px solid rgba(255,255,255,0.08);
        background:#0d1117;color:#f0f6fc;font-size:13px;outline:none;
      ">
      <button onclick="_RM.submitMyAnswer(${questionId})" style="
        flex-shrink:0;padding:6px 14px;border-radius:20px;border:none;
        background:#2dd4a8;color:#fff;font-size:12px;font-weight:700;cursor:pointer;
      ">답변 +5</button>
    </div>
  `;
}

/* ── 메인 렌더 ── */
export function renderRecordQuestion() {
  if (state._viewingMyQuestion) {
    return `
      <div class="full-screen animate-slide" style="display:flex;flex-direction:column">
        <div class="screen-header" style="flex-shrink:0">
          <button class="back-btn" onclick="_RM.backToQuestionList()"><i class="fas fa-arrow-left"></i></button>
          <h1>❓ 질문 상세</h1>
        </div>
        ${_renderQuestionDetail()}
      </div>
    `;
  }

  const allQuestions = state._myQuestions || [];
  const filter = state._myQuestionFilter || '전체';
  const questions = filter === '전체'
    ? allQuestions
    : allQuestions.filter(q => _getSubjectCategory(q.subject) === filter);
  const filterTags = ['전체', ...SUBJECT_TAGS.map(t => t.value)];

  return `
    <div class="full-screen animate-slide" style="display:flex;flex-direction:column;position:relative">
      <div class="screen-header" style="flex-shrink:0">
        <button class="back-btn" onclick="_RM.nav('dashboard')"><i class="fas fa-arrow-left"></i></button>
        <h1>❓ 나의 질문함</h1>
        <span class="header-badge">${questions.length}개</span>
      </div>

      ${_renderStats()}

      <div style="padding:0 16px 8px;flex-shrink:0">
        <div class="chip-row">
          ${_renderFilterChips(filterTags, filter)}
        </div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:0 16px 16px">
        ${questions.length === 0 && !state._pendingQuestionText ? `
          <div style="text-align:center;padding:40px 20px;color:#484f58">
            <div style="font-size:44px;margin-bottom:10px">💬</div>
            <p style="font-size:14px;font-weight:600;color:#8b949e;margin-bottom:4px">궁금한 게 있으면 바로 적어보세요</p>
            <p style="font-size:12px">아래 입력창에 질문을 입력하면 됩니다</p>
          </div>
        ` : `
          <div class="qb-grid">
            ${_renderPendingCard()}
            ${questions.map((q, i) => _renderCard(q, i)).join('')}
          </div>
        `}
      </div>

      ${_renderPhotoPreview()}
      ${_renderInputBar()}
    </div>
  `;
}

function _renderFilterChips(filterTags, activeFilter) {
  return filterTags.map(f => {
    const tag = SUBJECT_TAGS.find(t => t.value === f);
    const label = tag ? tag.icon + f : f;
    return `<button class="chip ${f === activeFilter ? 'active' : ''}" onclick="_RM.setMyQuestionFilter('${f}')">${label}</button>`;
  }).join('');
}
