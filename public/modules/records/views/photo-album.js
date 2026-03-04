/* ================================================================
   Records Module — views/photo-album.js
   사진 앨범 — 인스타 스타일 그리드, 과목/태그 필터, 풀스크린 뷰어
   태그: '필기' (AI 분석 대상) / '참고' (참고 사진)
   ================================================================ */

import { state } from '../core/state.js';
import { navigate } from '../core/router.js';
import { tryParseJSON } from '../core/utils.js';

// 기존 태그 → 필기/참고 매핑 (하위호환)
function _normalizeTag(tag) {
  if (tag === '필기') return '필기';
  if (tag === '참고') return '참고';
  // 레거시 태그 매핑
  if (tag === 'note') return '필기';
  return '참고'; // print, textbook, other → 참고
}

const TAG_LABELS = {
  '필기': '📝 필기',
  '참고': '📷 참고',
};

export function registerHandlers(RM) {
  RM.setAlbumFilter = (subject) => {
    state._albumFilter = subject;
    navigate(state.currentScreen, { replace: true });
  };
  RM.setAlbumTagFilter = (tag) => {
    state._albumTagFilter = tag;
    navigate(state.currentScreen, { replace: true });
  };
  RM.openAlbumPhoto = (recordId, photoIdx) => openPhoto(recordId, photoIdx);
  RM.closeAlbumViewer = () => closeViewer();
  RM.albumViewerPrev = () => navigateViewer(-1);
  RM.albumViewerNext = () => navigateViewer(1);
  RM.goToRecordFromAlbum = (recordId) => {
    state._viewingDbRecord = recordId;
    navigate('class-record-detail');
  };
}

let _viewerState = { recordId: null, photoIdx: 0, allPhotos: [] };

function _buildPhotoList() {
  const records = state._dbClassRecords || [];
  const filter = state._albumFilter || '전체';
  const tagFilter = state._albumTagFilter || '전체';

  const photoEntries = [];

  for (const r of records) {
    if (filter !== '전체' && r.subject !== filter) continue;

    const photos = r.photos || [];
    const tags = tryParseJSON(r.photo_tags, []);

    photos.forEach((photo, i) => {
      const photoUrl = typeof photo === 'string' ? photo : (photo.dataUrl || photo);
      const rawTag = tags[i] || 'note';
      const tag = _normalizeTag(rawTag);

      if (tagFilter !== '전체' && tag !== tagFilter) return;

      photoEntries.push({
        recordId: r.id,
        subject: r.subject,
        date: r.date,
        topic: r.topic || '',
        photoUrl,
        tag,
        photoIdx: i,
        hasAiLog: !!r.ai_credit_log,
      });
    });
  }

  // 날짜 내림차순 정렬
  photoEntries.sort((a, b) => b.date.localeCompare(a.date));
  return photoEntries;
}

function _groupByDate(entries) {
  const groups = {};
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  for (const entry of entries) {
    if (!groups[entry.date]) {
      const d = new Date(entry.date + 'T00:00:00+09:00');
      const dayName = dayNames[d.getDay()];
      const month = d.getMonth() + 1;
      const day = d.getDate();
      groups[entry.date] = {
        label: `${month}/${day} ${dayName}요일`,
        photos: [],
      };
    }
    groups[entry.date].photos.push(entry);
  }

  return Object.values(groups);
}

function openPhoto(recordId, photoIdx) {
  const allPhotos = _buildPhotoList();
  const idx = allPhotos.findIndex(p => p.recordId === recordId && p.photoIdx === photoIdx);
  _viewerState = { recordId, photoIdx, allPhotos, currentIdx: idx >= 0 ? idx : 0 };

  const overlay = document.getElementById('pa-viewer-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    _renderViewerContent();
  }
}

function closeViewer() {
  const overlay = document.getElementById('pa-viewer-overlay');
  if (overlay) overlay.style.display = 'none';
}

function navigateViewer(direction) {
  const newIdx = _viewerState.currentIdx + direction;
  if (newIdx < 0 || newIdx >= _viewerState.allPhotos.length) return;
  _viewerState.currentIdx = newIdx;
  _renderViewerContent();
}

function _renderViewerContent() {
  const container = document.getElementById('pa-viewer-content');
  if (!container) return;
  const photo = _viewerState.allPhotos[_viewerState.currentIdx];
  if (!photo) return;

  const total = _viewerState.allPhotos.length;
  const current = _viewerState.currentIdx + 1;

  container.innerHTML = `
    <img src="${photo.photoUrl}" style="max-width:100%;max-height:75vh;object-fit:contain;border-radius:8px">
    <div class="pa-viewer-info">
      <span>${photo.subject} · ${photo.date}</span>
      <span>${TAG_LABELS[photo.tag] || photo.tag}</span>
      <span>${current}/${total}</span>
    </div>
    ${photo.topic ? `<div class="pa-viewer-topic">${photo.topic}</div>` : ''}
    <button class="pa-viewer-link" onclick="_RM.closeAlbumViewer();_RM.goToRecordFromAlbum(${photo.recordId})">
      ${photo.hasAiLog ? '📋 수업 탐구 기록 보기' : '📝 수업 기록 보기'} →
    </button>
  `;
}

function _getSubjects() {
  const records = state._dbClassRecords || [];
  const subjects = new Set();
  for (const r of records) {
    if (r.photos && r.photos.length > 0) subjects.add(r.subject);
  }
  return Array.from(subjects);
}

export function renderPhotoAlbum() {
  const allPhotos = _buildPhotoList();
  const groups = _groupByDate(allPhotos);
  const subjects = _getSubjects();
  const filter = state._albumFilter || '전체';
  const tagFilter = state._albumTagFilter || '전체';

  const subjectTabs = ['전체', ...subjects].map(s => `
    <button class="pa-filter-tab ${filter === s ? 'active' : ''}" onclick="_RM.setAlbumFilter('${s}')">${s}</button>
  `).join('');

  const tagTabs = [
    { value: '전체', label: '전체' },
    { value: '필기', label: '📝 필기' },
    { value: '참고', label: '📷 참고' },
  ].map(t => `
    <button class="pa-filter-tab pa-tag-tab ${tagFilter === t.value ? 'active' : ''}" onclick="_RM.setAlbumTagFilter('${t.value}')">${t.label}</button>
  `).join('');

  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="_RM.nav('dashboard')"><i class="fas fa-arrow-left"></i></button>
        <h1>📷 사진 앨범</h1>
        <span class="header-badge">${allPhotos.length}장</span>
      </div>
      <div class="form-body">
        <div class="pa-filters">
          <div class="pa-filter-row">${subjectTabs}</div>
          <div class="pa-filter-row">${tagTabs}</div>
        </div>

        ${allPhotos.length === 0 ? `
          <div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
            <div style="font-size:48px;margin-bottom:16px">📷</div>
            <p style="font-size:15px">사진이 없습니다</p>
            <p style="font-size:13px;margin-top:4px">수업 기록에서 사진을 업로드해보세요</p>
          </div>
        ` : groups.map(group => `
          <div class="pa-date-group">
            <div class="pa-date-label">${group.label}</div>
            <div class="pa-grid">
              ${group.photos.map(p => `
                <div class="pa-grid-item" onclick="_RM.openAlbumPhoto(${p.recordId}, ${p.photoIdx})">
                  <img src="${p.photoUrl}" alt="${p.subject}" loading="lazy">
                  ${p.hasAiLog ? '<span class="pa-ai-badge">AI</span>' : ''}
                  <span class="pa-tag-badge pa-tag-${p.tag === '필기' ? 'note' : 'ref'}">${TAG_LABELS[p.tag] || p.tag}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 풀스크린 뷰어 오버레이 -->
      <div id="pa-viewer-overlay" class="pa-viewer-overlay" style="display:none" onclick="if(event.target===this)_RM.closeAlbumViewer()">
        <button class="pa-viewer-close" onclick="_RM.closeAlbumViewer()">&times;</button>
        <button class="pa-viewer-nav pa-viewer-prev" onclick="_RM.albumViewerPrev()"><i class="fas fa-chevron-left"></i></button>
        <div id="pa-viewer-content" class="pa-viewer-content"></div>
        <button class="pa-viewer-nav pa-viewer-next" onclick="_RM.albumViewerNext()"><i class="fas fa-chevron-right"></i></button>
      </div>
    </div>
  `;
}
