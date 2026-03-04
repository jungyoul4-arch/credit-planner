/* ================================================================
   Records Module — views/photo-upload-v2.js
   사진 업로드 강화 — 태그, 순서 변경, 리사이즈
   ================================================================ */

import { state } from '../core/state.js';
import { navigate } from '../core/router.js';
import { getSubjectColor } from '../core/utils.js';

const TAG_OPTIONS = [
  { value: 'note', label: '노트', icon: '📝' },
  { value: 'print', label: '프린트', icon: '📄' },
  { value: 'textbook', label: '교과서', icon: '📚' },
  { value: 'other', label: '기타', icon: '📎' },
];

export function registerHandlers(RM) {
  RM.handlePhotoUploadV2 = (input) => handlePhotoUpload(input);
  RM.removePhotoV2 = (idx) => removePhoto(idx);
  RM.setPhotoTag = (idx, tag) => setPhotoTag(idx, tag);
  RM.movePhotoUp = (idx) => movePhoto(idx, -1);
  RM.movePhotoDown = (idx) => movePhoto(idx, 1);
  RM.startAiAnalysis = () => startAiAnalysis();
  RM.skipToManualEntry = () => skipToManual();
}

function resizeImage(file, maxWidth = 1200) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width <= maxWidth) {
          resolve(e.target.result);
          return;
        }
        const canvas = document.createElement('canvas');
        const ratio = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handlePhotoUpload(input) {
  if (!input.files || input.files.length === 0) return;
  if (!state._classPhotos) state._classPhotos = [];
  if (!state._classPhotoTags) state._classPhotoTags = [];

  const remaining = 15 - state._classPhotos.length;
  const files = Array.from(input.files).slice(0, remaining);

  for (const file of files) {
    const dataUrl = await resizeImage(file);
    state._classPhotos.push(dataUrl);
    state._classPhotoTags.push('note');
  }

  input.value = '';
  navigate(state.currentScreen, { replace: true });
}

function removePhoto(idx) {
  if (!state._classPhotos) return;
  state._classPhotos.splice(idx, 1);
  (state._classPhotoTags || []).splice(idx, 1);
  navigate(state.currentScreen, { replace: true });
}

function setPhotoTag(idx, tag) {
  if (!state._classPhotoTags) state._classPhotoTags = [];
  state._classPhotoTags[idx] = tag;
  navigate(state.currentScreen, { replace: true });
}

function movePhoto(idx, direction) {
  const photos = state._classPhotos || [];
  const tags = state._classPhotoTags || [];
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= photos.length) return;

  [photos[idx], photos[newIdx]] = [photos[newIdx], photos[idx]];
  [tags[idx], tags[newIdx]] = [tags[newIdx], tags[idx]];
  navigate(state.currentScreen, { replace: true });
}

function startAiAnalysis() {
  state._aiAnalyzing = true;
  state._aiAnalysisStep = 'analyzing';
  navigate('ai-loading');
}

function skipToManual() {
  const record = state.todayRecords[state._selectedPeriodIdx];
  if (record) {
    state._backfillDate = null;
    state._backfillPeriod = record.period;
    state._backfillSubject = record.subject;
    state._backfillTeacher = record.teacher || '';
  }
  navigate('record-class');
}

function _renderPhotoTile(photo, idx, tag) {
  const tagObj = TAG_OPTIONS.find(t => t.value === tag) || TAG_OPTIONS[0];
  const photos = state._classPhotos || [];

  return `
    <div class="pu-tile">
      <img class="pu-tile-img" src="${photo}" alt="사진 ${idx + 1}">
      <button class="pu-tile-delete" onclick="_RM.removePhotoV2(${idx})">&times;</button>
      <div class="pu-tile-order">
        ${idx > 0 ? `<button class="pu-order-btn" onclick="_RM.movePhotoUp(${idx})"><i class="fas fa-chevron-up"></i></button>` : ''}
        ${idx < photos.length - 1 ? `<button class="pu-order-btn" onclick="_RM.movePhotoDown(${idx})"><i class="fas fa-chevron-down"></i></button>` : ''}
      </div>
      <div class="pu-tile-tag">
        <select class="pu-tag-select" onchange="_RM.setPhotoTag(${idx}, this.value)">
          ${TAG_OPTIONS.map(t => `<option value="${t.value}" ${t.value === tag ? 'selected' : ''}>${t.icon} ${t.label}</option>`).join('')}
        </select>
      </div>
      <div class="pu-tile-num">${idx + 1}</div>
    </div>`;
}

export function renderPhotoUpload() {
  const record = state.todayRecords[state._selectedPeriodIdx];
  const subject = record ? record.subject : '수업';
  const period = record ? record.period : '';
  const color = record ? record.color : getSubjectColor(subject);
  const teacher = record ? record.teacher : '';

  const photos = state._classPhotos || [];
  const tags = state._classPhotoTags || [];
  const photoCount = photos.length;
  const canStartAi = photoCount > 0;

  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="_RM.nav('period-select')"><i class="fas fa-arrow-left"></i></button>
        <h1>사진 업로드</h1>
        <span class="header-badge">${period}교시 ${subject}</span>
      </div>
      <div class="form-body">
        <div class="subject-indicator">
          <span class="subject-dot" style="background:${color}"></span>
          <span>${subject}${teacher ? ' · ' + teacher + ' 선생님' : ''}</span>
          <span class="period-badge">${period}교시</span>
        </div>

        <div class="pu-instruction">
          <div class="pu-instruction-icon">📸</div>
          <div class="pu-instruction-text">
            <strong>필기 노트, 프린트, 교과서</strong>를 촬영해주세요
            <br><span style="color:var(--text-muted);font-size:12px">AI가 사진을 분석하여 수업 탐구 기록을 자동 정리합니다</span>
          </div>
        </div>

        <div class="pu-grid">
          ${photos.map((p, i) => _renderPhotoTile(p, i, tags[i] || 'note')).join('')}
          ${photoCount < 15 ? `
          <label class="pu-add-tile">
            <i class="fas fa-plus" style="font-size:24px;margin-bottom:4px"></i>
            <span>${photoCount > 0 ? '추가' : '사진 추가'}</span>
            <input type="file" accept="image/*" multiple style="display:none" onchange="_RM.handlePhotoUploadV2(this)">
          </label>
          ` : ''}
        </div>

        <div class="pu-photo-count">${photoCount}/15장</div>

        <div class="pu-actions">
          <button class="btn-primary pu-ai-btn ${canStartAi ? '' : 'disabled'}"
                  onclick="${canStartAi ? '_RM.startAiAnalysis()' : ''}"
                  ${canStartAi ? '' : 'disabled'}>
            <i class="fas fa-magic" style="margin-right:8px"></i>AI 정리 시작
          </button>
          <button class="pu-skip-btn" onclick="_RM.skipToManualEntry()">
            직접 입력할게요 →
          </button>
        </div>
      </div>
    </div>
  `;
}
