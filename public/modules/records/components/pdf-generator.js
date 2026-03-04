/* ================================================================
   Records Module — components/pdf-generator.js
   MY CREDIT LOG PDF 생성 (window.print 기반)
   ================================================================ */

import { markKeywords, getAssignmentDisplayText } from '../core/utils.js';

export function generateCreditLogPDF(creditLog, subject, date) {
  if (!creditLog) return;

  const questions = creditLog.questions || [];
  const keywords = creditLog.keywords || [];

  const printHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>나의 수업 탐구 기록 - ${subject} ${date}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>
  @page { size: A4; margin: 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    color: #222;
    background: #fff;
    padding: 20px;
  }

  .cl-pdf-header {
    text-align: center;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 3px solid #1a237e;
  }
  .cl-pdf-title {
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 8px;
    color: #1a237e;
  }
  .cl-pdf-subtitle {
    font-size: 14px;
    letter-spacing: 6px;
    color: #666;
    margin-top: 4px;
    font-family: sans-serif;
  }
  .cl-pdf-meta {
    font-size: 14px;
    color: #888;
    margin-top: 8px;
    font-family: sans-serif;
  }

  .cl-pdf-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }
  .cl-pdf-box {
    border: 1.5px solid #333;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
  }
  .cl-pdf-box-half {
    flex: 1;
    border: 1.5px solid #333;
    border-radius: 8px;
    padding: 12px 16px;
  }
  .cl-pdf-label {
    font-size: 15px;
    font-weight: bold;
    font-family: sans-serif;
    color: #333;
    margin-bottom: 6px;
  }
  .cl-pdf-value {
    font-size: 16px;
    line-height: 1.7;
    min-height: 24px;
    color: #1a237e;
    font-weight: 500;
  }

  .cl-pdf-highlight {
    background: #fffde7;
    border: 1.5px solid #ffd600;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }

  .cl-pdf-question-box {
    border: 1.5px solid #1565c0;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }
  .cl-pdf-q-item {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px dotted #ccc;
  }
  .cl-pdf-q-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  .cl-pdf-q-num {
    font-family: sans-serif;
    font-weight: bold;
    font-size: 14px;
    color: #1565c0;
    margin-bottom: 4px;
  }
  .cl-pdf-q-original {
    font-size: 14px;
    color: #555;
    margin-bottom: 4px;
    line-height: 1.6;
  }
  .cl-pdf-q-original-label {
    font-size: 12px;
    font-family: sans-serif;
    color: #888;
  }
  .cl-pdf-q-improved {
    font-size: 14px;
    color: #1a237e;
    margin-top: 4px;
    line-height: 1.6;
    font-weight: 500;
  }
  .cl-pdf-q-improved-label {
    font-size: 12px;
    font-family: sans-serif;
    color: #1565c0;
    font-weight: 600;
  }

  .cl-pdf-keyword-box {
    border: 1.5px solid #333;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }
  .cl-pdf-keywords {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 15px;
    font-weight: 600;
    color: #1a237e;
  }
  .cl-pdf-kw-sep {
    color: #ccc;
  }

  .cl-pdf-assignment {
    border: 1.5px solid #333;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }
  .cl-mark {
    background: linear-gradient(transparent 40%, rgba(255,230,0,0.45) 40%, rgba(255,230,0,0.45) 85%, transparent 85%);
    padding: 0 2px;
  }
</style>
</head>
<body>
  <div class="cl-pdf-header">
    <div class="cl-pdf-title">나 의 수 업 탐 구 기 록</div>
    <div class="cl-pdf-subtitle">M Y &nbsp; C R E D I T &nbsp; L O G</div>
    <div class="cl-pdf-meta">${subject} · ${date}</div>
  </div>

  <div class="cl-pdf-row">
    <div class="cl-pdf-box-half">
      <div class="cl-pdf-label">📖 단원 / 주제 :</div>
      <div class="cl-pdf-value">${creditLog.topic || ''}</div>
    </div>
    <div class="cl-pdf-box-half">
      <div class="cl-pdf-label">📚 교과서 :</div>
      <div class="cl-pdf-value">${creditLog.pages || ''}</div>
    </div>
  </div>

  <div class="cl-pdf-highlight">
    <div class="cl-pdf-label">⭐ 선생님 강조 포인트</div>
    <div class="cl-pdf-value">${markKeywords((creditLog.highlights || '').replace(/\n/g, '<br>'), keywords)}</div>
  </div>

  <div class="cl-pdf-question-box">
    <div class="cl-pdf-label">💡 세특 소재 질문</div>
    ${questions.map((q, i) => `
      <div class="cl-pdf-q-item">
        <div class="cl-pdf-q-num">Q${i + 1}.</div>
        <div class="cl-pdf-q-original-label">💬 내가 쓴 질문</div>
        <div class="cl-pdf-q-original">${q.original || ''}</div>
        <div class="cl-pdf-q-improved-label">✨ 선생님께 이렇게 여쭤보세요</div>
        <div class="cl-pdf-q-improved">${markKeywords(q.improved || '', keywords)}</div>
      </div>
    `).join('')}
  </div>

  <div class="cl-pdf-keyword-box">
    <div class="cl-pdf-label">🔑 오늘 수업의 핵심 키워드 (최대 5개)</div>
    <div class="cl-pdf-keywords">
      ${keywords.map((kw, i) => `<span>${kw}</span>${i < keywords.length - 1 ? '<span class="cl-pdf-kw-sep">/</span>' : ''}`).join('')}
    </div>
  </div>

  <div class="cl-pdf-assignment">
    <div class="cl-pdf-label">📌 과제</div>
    <div class="cl-pdf-value">${getAssignmentDisplayText(creditLog.assignment)}</div>
  </div>
</body>
</html>`;

  // 새 창에서 인쇄
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
    return;
  }
  printWindow.document.write(printHtml);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}
