/* ==============================
   학점플래너 CreditPlanner - Interactive Prototype v3
   학생 앱 UI 집중 리뉴얼
   ============================== */

// ==================== APP STATE ====================
const state = {
  mode: 'student',
  currentScreen: 'onboarding-welcome',
  studentTab: 'home',
  mentorTab: 'students',
  directorTab: 'overview',
  xp: 1240,
  level: 12,
  streak: 18,
  mood: null,
  selectedStudent: null,
  inputMode: 'keyword', // 'keyword' | 'voice' | 'photo'
  todayRecords: [
    { period: 1, subject: '국어', teacher: '박선영', done: true, question: null, summary: '윤동주 서시, 자아성찰, 저항시', color:'#FF6B6B' },
    { period: 2, subject: '수학', teacher: '김태호', done: true, question: { level: 'C-1', axis: 'curiosity', text: '치환적분과 부분적분 중 어떤 기준으로 선택하는 게 더 나은지, 나는 함수 구조로 판별하면 된다고 생각하는데 맞나요?' }, summary: '치환적분, 부분적분, 역함수', color:'#6C5CE7' },
    { period: 3, subject: '영어', teacher: '이정민', done: false, question: null, summary: '', color:'#00B894' },
    { period: 4, subject: '과학', teacher: '최은지', done: false, question: null, summary: '', color:'#FDCB6E' },
    { period: 5, subject: '한국사', teacher: '강민수', done: false, question: null, summary: '', color:'#74B9FF' },
    { period: 6, subject: '체육', teacher: '윤대현', done: false, question: null, summary: '', color:'#A29BFE' },
  ],
  missions: [
    { text: '수업 기록 3개 이상', icon: '📝', current: 2, target: 3, done: false },
    { text: '질문 1개 이상', icon: '❓', current: 1, target: 1, done: true },
    { text: '교학상장 도전!', icon: '🤝', current: 0, target: 1, done: false },
  ],
  weeklyData: {
    records: [4, 5, 6, 3, 5, 6, 2],
    questions: [1, 2, 1, 0, 2, 3, 1],
    days: ['월','화','수','목','금','토','일']
  },
  students: [
    { name: '김민준', grade: '2-3', today: '5/6', qLevel: 'B→C ↑', teach: 2, streak: 18, status: 'green', xp: 1240, level: 12 },
    { name: '이서연', grade: '2-3', today: '4/6', qLevel: 'A→B ↑', teach: 1, streak: 7, status: 'green', xp: 780, level: 8 },
    { name: '박지호', grade: '2-1', today: '3/6', qLevel: 'B 유지', teach: 0, streak: 3, status: 'yellow', xp: 520, level: 6 },
    { name: '정하은', grade: '2-3', today: '0/6', qLevel: '--', teach: 0, streak: 0, status: 'red', xp: 340, level: 4 },
    { name: '최윤서', grade: '2-2', today: '2/6', qLevel: 'B→A ↓', teach: 0, streak: 1, status: 'yellow', xp: 610, level: 7 },
    { name: '한도윤', grade: '2-1', today: '0/6', qLevel: '--', teach: 0, streak: 0, status: 'red', xp: 280, level: 3 },
    { name: '윤시우', grade: '2-2', today: '1/6', qLevel: 'A 유지', teach: 1, streak: 5, status: 'yellow', xp: 450, level: 5 },
    { name: '강예린', grade: '2-3', today: '6/6', qLevel: 'B→C ↑', teach: 3, streak: 25, status: 'green', xp: 1580, level: 14 },
    { name: '임준혁', grade: '2-1', today: '5/6', qLevel: 'B 유지', teach: 1, streak: 14, status: 'green', xp: 920, level: 10 },
    { name: '송채원', grade: '2-2', today: '4/6', qLevel: 'A→B ↑', teach: 2, streak: 10, status: 'green', xp: 860, level: 9 },
  ],
  notifications: [
    { icon: '🔔', title: '3교시 영어 끝!', desc: '지금 바로 기록해보세요', time: '방금 전', unread: true, bg: 'rgba(108,92,231,0.15)' },
    { icon: '🎯', title: '미션 완료 임박!', desc: '수업 기록 1개만 더하면 완료', time: '10분 전', unread: true, bg: 'rgba(255,215,0,0.15)' },
    { icon: '🏆', title: '이서연이 확인 완료', desc: '교학상장이 인정되었어요!', time: '1시간 전', unread: false, bg: 'rgba(0,184,148,0.15)' },
    { icon: '🔥', title: '18일 연속 스트릭!', desc: '대단해요! 최고 기록 갱신 중', time: '어제', unread: false, bg: 'rgba(255,99,71,0.15)' },
  ],
  // 과제 데이터
  assignments: [
    {
      id: 1,
      subject: '수학',
      title: '치환적분 연습문제 풀이',
      desc: '교재 p.142~148 연습문제 1~15번',
      type: '문제풀이',
      teacher: '김태호',
      dueDate: '2025-02-20',
      createdDate: '2025-02-14',
      color: '#6C5CE7',
      status: 'in-progress', // 'pending','in-progress','completed'
      progress: 60,
      plan: [
        { step: 1, title: '1~5번 기본 문제 풀기', date: '2/15', done: true },
        { step: 2, title: '6~10번 응용 문제 풀기', date: '2/17', done: true },
        { step: 3, title: '11~15번 심화 문제 풀기', date: '2/18', done: false },
        { step: 4, title: '오답 정리 및 복습', date: '2/19', done: false },
        { step: 5, title: '최종 점검 후 제출', date: '2/20', done: false },
      ]
    },
    {
      id: 2,
      subject: '영어',
      title: '영작문 에세이 제출',
      desc: 'My Future Career Plan 주제, A4 2장 분량',
      type: '에세이/작문',
      teacher: '이정민',
      dueDate: '2025-02-18',
      createdDate: '2025-02-12',
      color: '#00B894',
      status: 'in-progress',
      progress: 40,
      plan: [
        { step: 1, title: '주제 브레인스토밍 & 아웃라인', date: '2/13', done: true },
        { step: 2, title: '초안 작성 (body)', date: '2/15', done: true },
        { step: 3, title: '서론/결론 작성', date: '2/16', done: false },
        { step: 4, title: '문법 체크 & 수정', date: '2/17', done: false },
        { step: 5, title: '최종 제출', date: '2/18', done: false },
      ]
    },
    {
      id: 3,
      subject: '과학',
      title: '산화환원 실험 보고서',
      desc: '실험 결과 분석 및 결론 도출, 그래프 포함',
      type: '보고서',
      teacher: '최은지',
      dueDate: '2025-02-25',
      createdDate: '2025-02-15',
      color: '#FDCB6E',
      status: 'pending',
      progress: 0,
      plan: [
        { step: 1, title: '실험 데이터 정리', date: '2/17', done: false },
        { step: 2, title: '그래프 작성', date: '2/19', done: false },
        { step: 3, title: '결과 분석 작성', date: '2/21', done: false },
        { step: 4, title: '결론 및 고찰', date: '2/23', done: false },
        { step: 5, title: '최종 검토 후 제출', date: '2/25', done: false },
      ]
    },
    {
      id: 4,
      subject: '국어',
      title: '윤동주 시 감상문',
      desc: '서시 감상문 원고지 3장 분량, 자아성찰 관점',
      type: '감상문',
      teacher: '박선영',
      dueDate: '2025-02-14',
      createdDate: '2025-02-10',
      color: '#FF6B6B',
      status: 'completed',
      progress: 100,
      plan: [
        { step: 1, title: '시 반복 읽기 & 핵심 정리', date: '2/11', done: true },
        { step: 2, title: '감상문 초안 작성', date: '2/12', done: true },
        { step: 3, title: '수정 및 퇴고', date: '2/13', done: true },
        { step: 4, title: '최종 제출', date: '2/14', done: true },
      ]
    },
  ],
  assignmentFilter: 'all', // 'all','in-progress','pending','completed'
  editingAssignment: null,
  viewingAssignment: null,
  // 시간표 데이터 (동적 관리)
  timetable: {
    // 기본 학교 시간표 (요일별 교시)
    school: [
      // [월, 화, 수, 목, 금]
      ['국어','수학','영어','과학','국어'],     // 1교시
      ['수학','영어','국어','수학','과학'],     // 2교시
      ['영어','과학','수학','국어','영어'],     // 3교시
      ['과학','국어','과학','영어','수학'],     // 4교시
      ['한국사','체육','미술','한국사','체육'], // 5교시
      ['체육','한국사','체육','미술','동아리'], // 6교시
      ['창체','','','',''],                    // 7교시
    ],
    // 과목별 선생님 매핑
    teachers: {
      '국어':'박선영','수학':'김태호','영어':'이정민','과학':'최은지',
      '한국사':'강민수','체육':'윤대현','미술':'김소연','동아리':'윤대현','창체':'강민수'
    },
    // 과목 색상
    subjectColors: {
      '국어':'#FF6B6B','수학':'#6C5CE7','영어':'#00B894','과학':'#FDCB6E',
      '한국사':'#74B9FF','체육':'#A29BFE','미술':'#FD79A8','동아리':'#00CEC9','창체':'#E17055'
    },
    // 교시별 시간
    periodTimes: [
      {start:'08:30',end:'09:20'}, // 1교시
      {start:'09:30',end:'10:20'}, // 2교시
      {start:'10:30',end:'11:20'}, // 3교시
      {start:'11:30',end:'12:20'}, // 4교시
      {start:'13:20',end:'14:10'}, // 5교시
      {start:'14:20',end:'15:10'}, // 6교시
      {start:'15:20',end:'16:10'}, // 7교시
    ],
    // 학원 스케줄 (그리드: 요일별 슬롯, 평일2/주말4 → 4칸 통일 표시)
    academy: [
      { id:'ac1', name:'수학 심화반', academy:'대치 수학학원', day:'월', slot:1, startTime:'18:00', endTime:'20:00', color:'#E056A0', subject:'수학', memo:'미적분 심화 과정' },
      { id:'ac2', name:'영어 독해반', academy:'YBM 어학원', day:'수', slot:1, startTime:'18:00', endTime:'19:30', color:'#00B894', subject:'영어', memo:'수능 독해 유형 분석' },
      { id:'ac3', name:'과학 실험반', academy:'메가스터디 과학관', day:'금', slot:1, startTime:'17:00', endTime:'19:00', color:'#FDCB6E', subject:'과학', memo:'물리 실험 + 보고서' },
      { id:'ac4', name:'국어 논술반', academy:'대성학원', day:'토', slot:1, startTime:'10:00', endTime:'12:00', color:'#FF6B6B', subject:'국어', memo:'수능 비문학 집중' },
      { id:'ac5', name:'수학 문제풀이', academy:'대치 수학학원', day:'토', slot:2, startTime:'13:00', endTime:'15:00', color:'#6C5CE7', subject:'수학', memo:'모의고사 기출 풀이' },
    ],
  },
  // 시간표 편집 상태
  editingTimetable: false,
  editingAcademy: null, // null or academy id
  selectedTtCell: null, // {period, dayIdx}
  selectedAcSlot: null, // {day, slot} 학원 그리드 선택
  viewingAcademyDetail: null, // academy id 상세보기
  // 플래너 상태
  plannerView: 'daily', // 'daily','weekly','monthly'
  plannerDate: '2025-02-15', // 현재 선택 날짜
  plannerAiOpen: false,
  plannerAiMessages: [
    { role:'ai', text:'안녕 민준! 👋 플래너 AI 도우미예요. 일정 추가, 과제 계획 조정, 공부 시간 배분 등 무엇이든 도와줄게요!' },
  ],
  plannerAddOpen: false,
  // 통합 플래너 일정 데이터
  plannerItems: [
    // == 2/15 (토) ==
    { id:'p1', date:'2025-02-15', time:'07:00', endTime:'07:30', title:'기상 & 아침 루틴', category:'routine', color:'#A29BFE', icon:'☀️', done:true, aiGenerated:false },
    { id:'p2', date:'2025-02-15', time:'08:30', endTime:'09:20', title:'1교시 국어', category:'class', color:'#FF6B6B', icon:'📖', done:true, aiGenerated:false, detail:'윤동주 서시' },
    { id:'p3', date:'2025-02-15', time:'09:30', endTime:'10:20', title:'2교시 수학', category:'class', color:'#6C5CE7', icon:'📐', done:true, aiGenerated:false, detail:'치환적분' },
    { id:'p4', date:'2025-02-15', time:'10:30', endTime:'11:20', title:'3교시 영어', category:'class', color:'#00B894', icon:'🔤', done:false, aiGenerated:false, detail:'관계대명사' },
    { id:'p5', date:'2025-02-15', time:'11:30', endTime:'12:20', title:'4교시 과학', category:'class', color:'#FDCB6E', icon:'🔬', done:false, aiGenerated:false, detail:'산화환원' },
    { id:'p6', date:'2025-02-15', time:'13:20', endTime:'14:10', title:'5교시 한국사', category:'class', color:'#74B9FF', icon:'🏛️', done:false, aiGenerated:false },
    { id:'p7', date:'2025-02-15', time:'14:20', endTime:'15:10', title:'6교시 체육', category:'class', color:'#A29BFE', icon:'⚽', done:false, aiGenerated:false },
    { id:'p8', date:'2025-02-15', time:'15:30', endTime:'16:30', title:'[과제] 수학 11~15번 풀기', category:'assignment', color:'#6C5CE7', icon:'📋', done:false, aiGenerated:true, assignmentId:1, detail:'치환적분 연습문제 심화' },
    { id:'p9', date:'2025-02-15', time:'16:30', endTime:'17:30', title:'[과제] 영어 에세이 서론/결론', category:'assignment', color:'#00B894', icon:'📋', done:false, aiGenerated:true, assignmentId:2, detail:'My Future Career Plan' },
    { id:'p10', date:'2025-02-15', time:'17:30', endTime:'18:30', title:'코딩동아리 프로젝트', category:'activity', color:'#00CEC9', icon:'💻', done:false, aiGenerated:false, detail:'Python 그래프 시각화' },
    { id:'p11', date:'2025-02-15', time:'19:00', endTime:'20:00', title:'수학 복습 & 질문 정리', category:'study', color:'#6C5CE7', icon:'📝', done:false, aiGenerated:true, detail:'치환적분 오답노트' },
    { id:'p12', date:'2025-02-15', time:'20:00', endTime:'20:30', title:'저녁 루틴 & 하루 마무리', category:'routine', color:'#A29BFE', icon:'🌙', done:false, aiGenerated:false },
    // == 2/16 (일) ==
    { id:'p13', date:'2025-02-16', time:'09:00', endTime:'10:30', title:'[과제] 영어 에세이 마무리', category:'assignment', color:'#00B894', icon:'📋', done:false, aiGenerated:true, assignmentId:2 },
    { id:'p14', date:'2025-02-16', time:'10:30', endTime:'12:00', title:'[탐구] 치환적분 알고리즘 탐구', category:'explore', color:'#FF6B6B', icon:'🔬', done:false, aiGenerated:true, detail:'멘토 제안 탐구 주제' },
    { id:'p15', date:'2025-02-16', time:'14:00', endTime:'15:30', title:'자유 독서 & 메모', category:'personal', color:'#636e72', icon:'📚', done:false, aiGenerated:false, detail:'진로 관련 도서' },
    { id:'p16', date:'2025-02-16', time:'16:00', endTime:'17:00', title:'이서연에게 수학 가르치기', category:'teach', color:'#00B894', icon:'🤝', done:false, aiGenerated:false, detail:'치환적분 복습' },
    // == 2/17 (월) ==
    { id:'p17', date:'2025-02-17', time:'08:30', endTime:'15:10', title:'학교 수업 (6교시)', category:'class', color:'#6C5CE7', icon:'🏫', done:false, aiGenerated:false },
    { id:'p18', date:'2025-02-17', time:'15:30', endTime:'17:00', title:'[과제] 과학 실험 데이터 정리', category:'assignment', color:'#FDCB6E', icon:'📋', done:false, aiGenerated:true, assignmentId:3 },
    { id:'p19', date:'2025-02-17', time:'17:00', endTime:'18:00', title:'[과제] 영어 에세이 문법 체크', category:'assignment', color:'#00B894', icon:'📋', done:false, aiGenerated:true, assignmentId:2 },
    // == 2/18 (화) ==
    { id:'p20', date:'2025-02-18', time:'08:30', endTime:'15:10', title:'학교 수업 (6교시)', category:'class', color:'#6C5CE7', icon:'🏫', done:false, aiGenerated:false },
    { id:'p21', date:'2025-02-18', time:'15:30', endTime:'16:00', title:'[과제] 영어 에세이 최종 제출 🚨', category:'assignment', color:'#00B894', icon:'📋', done:false, aiGenerated:true, assignmentId:2, detail:'⚠️ 마감일!' },
    { id:'p22', date:'2025-02-18', time:'16:00', endTime:'17:30', title:'[과제] 수학 오답정리', category:'assignment', color:'#6C5CE7', icon:'📋', done:false, aiGenerated:true, assignmentId:1 },
    // == 2/19~20 ==
    { id:'p23', date:'2025-02-19', time:'15:30', endTime:'17:00', title:'[과제] 과학 그래프 작성', category:'assignment', color:'#FDCB6E', icon:'📋', done:false, aiGenerated:true, assignmentId:3 },
    { id:'p24', date:'2025-02-20', time:'08:30', endTime:'09:00', title:'[과제] 수학 최종제출 🚨', category:'assignment', color:'#6C5CE7', icon:'📋', done:false, aiGenerated:true, assignmentId:1, detail:'⚠️ 마감일!' },
  ],
};

// ==================== MAIN RENDER ====================

function renderScreen() {
  const container = document.getElementById('app-content');
  const deskContainer = document.getElementById('desktop-content');
  const phoneContainer = document.getElementById('phone-container');
  const desktopContainer = document.getElementById('desktop-container');

  if (state.mode === 'student') {
    phoneContainer.style.display = 'flex';
    desktopContainer.style.display = 'none';
    container.innerHTML = renderStudentApp();
    initStudentEvents();
  } else if (state.mode === 'mentor') {
    phoneContainer.style.display = 'none';
    desktopContainer.style.display = 'block';
    deskContainer.innerHTML = renderMentorDashboard();
    initMentorEvents();
  } else {
    phoneContainer.style.display = 'none';
    desktopContainer.style.display = 'block';
    deskContainer.innerHTML = renderDirectorDashboard();
    initDirectorEvents();
  }
}

// ==================== STUDENT APP ROUTER ====================

function renderStudentApp() {
  if (state.currentScreen.startsWith('onboarding')) return renderOnboarding();
  if (state.currentScreen === 'record-class') return renderRecordClass();
  if (state.currentScreen === 'record-question') return renderRecordQuestion();
  if (state.currentScreen === 'record-teach') return renderRecordTeach();
  if (state.currentScreen === 'record-activity') return renderRecordActivity();
  if (state.currentScreen === 'class-end-popup') return renderClassEndPopup();
  if (state.currentScreen === 'evening-routine') return renderEveningRoutine();
  if (state.currentScreen === 'weekly-report') return renderWeeklyReportStudent();
  if (state.currentScreen === 'record-history') return renderRecordHistory();
  if (state.currentScreen === 'notifications') return renderNotifications();
  if (state.currentScreen === 'record-assignment') return renderRecordAssignment();
  if (state.currentScreen === 'assignment-plan') return renderAssignmentPlan();
  if (state.currentScreen === 'assignment-list') return renderAssignmentList();
  if (state.currentScreen === 'planner-add') return renderPlannerAddItem();
  if (state.currentScreen === 'timetable-manage') return renderTimetableManage();
  if (state.currentScreen === 'academy-add') return renderAcademyAdd();

  let content = '';
  content += renderXpBar();
  switch(state.studentTab) {
    case 'home': content += renderHomeTab(); break;
    case 'record': content += renderRecordTab(); break;
    case 'planner': content += renderPlannerTab(); break;
    case 'growth': content += renderGrowthTab(); break;
    case 'my': content += renderMyTab(); break;
  }
  content += renderBottomNav();
  content += renderFab();
  // AI 플로팅 어시스턴트 (플래너 탭에서 항상 노출)
  if (state.studentTab === 'planner' && state.currentScreen === 'main') {
    content += renderPlannerAiFloat();
  }
  return content;
}

// ==================== XP BAR ====================
function renderXpBar() {
  const nextLevelXp = 1500;
  const pct = Math.min((state.xp / nextLevelXp * 100), 100).toFixed(0);
  return `
    <div class="xp-bar-container">
      <span class="xp-level">Lv.${state.level}</span>
      <div class="xp-bar"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
      <span class="xp-text">${state.xp.toLocaleString()}/${nextLevelXp.toLocaleString()}</span>
      <span class="streak-badge">🔥${state.streak}</span>
    </div>
  `;
}

// ==================== BOTTOM NAV ====================
function renderBottomNav() {
  const tabs = [
    { id:'home', icon:'fa-house', label:'홈' },
    { id:'record', icon:'fa-pen-to-square', label:'기록' },
    { id:'planner', icon:'fa-calendar-check', label:'플래너' },
    { id:'growth', icon:'fa-chart-line', label:'성장' },
    { id:'my', icon:'fa-user', label:'마이' },
  ];
  return `
    <div class="bottom-nav">
      ${tabs.map(t => `
        <button class="nav-item ${state.studentTab===t.id?'active':''}" data-tab="${t.id}">
          <i class="fas ${t.icon}"></i>
          <span>${t.label}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function renderFab() {
  // 플래너 탭에서는 AI FAB가 대신 표시됨, 기록 탭에서는 이미 메뉴가 있으므로 불필요
  if (state.studentTab === 'planner' || state.studentTab === 'record') return '';
  return `<button class="fab" id="fab-btn"><i class="fas fa-plus"></i></button>`;
}

// ==================== ONBOARDING (S-01 ~ S-05) ====================

function renderOnboarding() {
  switch(state.currentScreen) {
    case 'onboarding-welcome': return renderOnboardingWelcome();
    case 'onboarding-info': return renderOnboardingInfo();
    case 'onboarding-career': return renderOnboardingCareer();
    case 'onboarding-timetable': return renderOnboardingTimetable();
    case 'onboarding-guide': return renderOnboardingGuide();
  }
}

function renderOnboardingWelcome() {
  return `
    <div class="onboarding-screen animate-in">
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center">
        <div class="onboarding-logo">
          <div class="logo-circle">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <h2>학점플래너</h2>
          <p>CreditPlanner</p>
        </div>
        <p style="text-align:center;color:var(--text-secondary);font-size:15px;line-height:1.8;margin-bottom:40px">
          고교학점제 시대,<br>
          <strong style="color:var(--text-primary)">학교생활의 모든 순간</strong>을 기록하고<br>
          <strong style="color:var(--primary-light)">생기부 경쟁력</strong>으로 만드세요
        </p>
        <div class="field-group" style="width:100%">
          <label class="field-label">초대 코드를 입력하세요</label>
          <input class="input-field" placeholder="JYCC-2025-XXXX" value="JYCC-2025-0314" style="text-align:center;font-size:16px;font-weight:600;letter-spacing:2px">
        </div>
      </div>
      <button class="btn-primary btn-glow" onclick="goScreen('onboarding-info')">
        시작하기 <i class="fas fa-arrow-right" style="margin-left:8px"></i>
      </button>
    </div>
  `;
}

function renderOnboardingInfo() {
  return `
    <div class="onboarding-screen animate-slide">
      <div class="onboarding-progress"><div class="onboarding-progress-fill" style="width:25%"></div></div>
      <span class="onboarding-step">1/4 기본 정보</span>
      <h1 class="onboarding-title">반갑습니다! 👋</h1>
      <p class="onboarding-desc">학점플래너를 시작하기 위한 기본 정보를 입력해주세요.</p>
      <div class="field-group">
        <label class="field-label">이름</label>
        <input class="input-field" placeholder="이름을 입력하세요" value="김민준">
      </div>
      <div class="field-group">
        <label class="field-label">학교</label>
        <div class="input-with-icon">
          <i class="fas fa-search"></i>
          <input class="input-field" placeholder="학교명 검색" value="정율고등학교" style="padding-left:40px">
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">학년</label>
        <div style="display:flex;gap:8px">
          <button class="grid-select-btn" style="flex:1">1학년</button>
          <button class="grid-select-btn active" style="flex:1">2학년</button>
          <button class="grid-select-btn" style="flex:1">3학년</button>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">반</label>
        <input class="input-field" placeholder="반" value="3반" style="width:120px">
      </div>
      <div style="flex:1"></div>
      <button class="btn-primary" onclick="goScreen('onboarding-career')">다음 <i class="fas fa-arrow-right" style="margin-left:6px"></i></button>
    </div>
  `;
}

function renderOnboardingCareer() {
  const fields = [
    {name:'인문', icon:'📚'}, {name:'사회', icon:'🌍'}, {name:'상경', icon:'💰'},
    {name:'자연', icon:'🔬'}, {name:'공학', icon:'⚙️'}, {name:'의약', icon:'🏥'},
    {name:'예체능', icon:'🎨'}, {name:'교육', icon:'👩‍🏫'}, {name:'탐색중', icon:'🔍'}
  ];
  return `
    <div class="onboarding-screen animate-slide">
      <div class="onboarding-progress"><div class="onboarding-progress-fill" style="width:50%"></div></div>
      <span class="onboarding-step">2/4 진로 방향</span>
      <h1 class="onboarding-title">어떤 분야에 관심 있나요? 🎯</h1>
      <p class="onboarding-desc">관심 계열을 선택하세요. 나중에 바꿀 수 있어요.</p>
      <div class="career-grid">
        ${fields.map((f,i) => `
          <button class="career-btn ${i===4?'active':''}" style="animation-delay:${i*0.04}s">
            <span class="career-icon">${f.icon}</span>
            <span class="career-name">${f.name}</span>
          </button>
        `).join('')}
      </div>
      <div class="field-group" style="margin-top:24px">
        <label class="field-label">관심 학과 (선택)</label>
        <input class="input-field" placeholder="예: 컴퓨터공학과" value="컴퓨터공학과">
      </div>
      <div style="flex:1"></div>
      <button class="btn-primary" onclick="goScreen('onboarding-timetable')">다음 <i class="fas fa-arrow-right" style="margin-left:6px"></i></button>
    </div>
  `;
}

function renderOnboardingTimetable() {
  const days = ['월','화','수','목','금'];
  const subjects = [
    ['국어','수학','영어','과학','국어'],
    ['수학','영어','국어','수학','과학'],
    ['영어','과학','수학','국어','영어'],
    ['과학','국어','과학','영어','수학'],
    ['한국사','체육','미술','한국사','체육'],
    ['체육','한국사','체육','미술','동아리'],
    ['창체','','','',''],
  ];
  const subjectColors = {
    '국어':'#FF6B6B','수학':'#6C5CE7','영어':'#00B894','과학':'#FDCB6E',
    '한국사':'#74B9FF','체육':'#A29BFE','미술':'#FD79A8','동아리':'#00CEC9','창체':'#E17055'
  };
  return `
    <div class="onboarding-screen animate-slide">
      <div class="onboarding-progress"><div class="onboarding-progress-fill" style="width:75%"></div></div>
      <span class="onboarding-step">3/4 시간표</span>
      <h1 class="onboarding-title">시간표를 등록하세요 📋</h1>
      <p class="onboarding-desc">빈 칸을 터치하면 과목을 선택할 수 있어요.</p>
      <div class="tt-editor">
        <div class="tt-editor-header"></div>
        ${days.map(d => `<div class="tt-editor-header">${d}</div>`).join('')}
        ${subjects.map((row, i) => `
          <div class="tt-editor-period">${i+1}</div>
          ${row.map(s => `
            <div class="tt-editor-cell ${s?'filled':''}" ${s?`style="background:${subjectColors[s]||'var(--bg-input)'}22;color:${subjectColors[s]||'var(--text-secondary)'};border-color:${subjectColors[s]||'var(--border)'}44"`:''}>
              ${s||'<i class="fas fa-plus" style="font-size:9px;opacity:0.3"></i>'}
            </div>
          `).join('')}
        `).join('')}
      </div>
      <div style="flex:1"></div>
      <button class="btn-primary" onclick="goScreen('onboarding-guide')" style="margin-top:20px">다음 <i class="fas fa-arrow-right" style="margin-left:6px"></i></button>
    </div>
  `;
}

function renderOnboardingGuide() {
  return `
    <div class="onboarding-screen animate-slide">
      <div class="onboarding-progress"><div class="onboarding-progress-fill" style="width:100%"></div></div>
      <span class="onboarding-step">4/4 시작 가이드</span>
      <h1 class="onboarding-title">이렇게 쓰면 돼요! ✨</h1>
      <p class="onboarding-desc">오늘 기록한 한 줄이, 3년 후 생기부의 한 문장이 됩니다.</p>
      
      <div class="guide-card stagger-1 animate-in">
        <div class="guide-icon-circle" style="background:rgba(108,92,231,0.15)">📝</div>
        <div class="guide-content">
          <h3>수업 끝나면 30초 기록</h3>
          <p>음성, 사진, 키워드 중 편한 방법으로</p>
        </div>
      </div>
      <div class="guide-card stagger-2 animate-in">
        <div class="guide-icon-circle" style="background:rgba(255,107,107,0.15)">❓</div>
        <div class="guide-content">
          <h3>질문이 있었다면 기록</h3>
          <p>AI가 2축 9단계로 질문을 코칭해줘요</p>
        </div>
      </div>
      <div class="guide-card stagger-3 animate-in">
        <div class="guide-icon-circle" style="background:rgba(0,184,148,0.15)">🤝</div>
        <div class="guide-content">
          <h3>친구에게 가르쳤다면 기록</h3>
          <p>교학상장! 가르치면서 배운 것이 세특의 보석</p>
        </div>
      </div>

      <div style="flex:1"></div>
      <div class="guide-bottom-hint">
        <span>🎮</span> 기록할수록 XP가 쌓이고 레벨이 올라가요!
      </div>
      <button class="btn-primary btn-glow" onclick="state.currentScreen='main';state.studentTab='home';renderScreen()">
        알겠어요, 시작! 🎉
      </button>
    </div>
  `;
}

// ==================== HOME TAB (H-01~H-05) ====================

function renderHomeTab() {
  const doneCount = state.todayRecords.filter(r => r.done).length;
  const total = state.todayRecords.length;
  const recordPct = Math.round(doneCount / total * 100);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '좋은 아침' : hour < 18 ? '좋은 오후' : '좋은 저녁';
  
  return `
    <div class="tab-content animate-in">
      <!-- Greeting -->
      <div class="home-greeting">
        <div>
          <h2>${greeting}, 민준! 👋</h2>
          <p>오늘도 호기심 사다리를 올라가볼까요? 🪜</p>
        </div>
        <div class="home-date" onclick="goScreen('notifications')" style="cursor:pointer;position:relative">
          <span class="date-day">15</span>
          <span class="date-month">2월 토</span>
          ${state.notifications.filter(n=>n.unread).length > 0 ? `<span style="position:absolute;top:-4px;right:-4px;width:8px;height:8px;background:var(--accent);border-radius:50%;border:2px solid var(--bg-dark)"></span>` : ''}
        </div>
      </div>

      <!-- Morning Routine Card -->
      <div class="card card-gradient-purple stagger-1 animate-in">
        <div class="card-header-row">
          <span class="card-title">☀️ 아침 루틴</span>
          <span class="xp-badge-sm">+10 XP</span>
        </div>
        <div class="routine-checklist">
          <div class="routine-item done">
            <i class="fas fa-check-circle"></i>
            <span>오늘 시간표 확인</span>
          </div>
          <div class="routine-item ${state.mood?'done':''}">
            <i class="fas ${state.mood?'fa-check-circle':'fa-circle'}"></i>
            <span>무드 체크</span>
          </div>
        </div>
        <div class="mood-selector">
          ${[
            {emoji:'😄', label:'최고'},
            {emoji:'🙂', label:'좋음'},
            {emoji:'😐', label:'보통'},
            {emoji:'😔', label:'별로'},
            {emoji:'😫', label:'힘듦'}
          ].map(m => `
            <button class="mood-btn ${state.mood===m.emoji?'active':''}" data-mood="${m.emoji}">
              <span class="mood-emoji">${m.emoji}</span>
              <span class="mood-label">${m.label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Today Timetable -->
      <div class="card stagger-2 animate-in">
        <div class="card-header-row">
          <span class="card-title">📋 오늘 시간표</span>
          <span class="card-subtitle">${doneCount}/${total} 기록완료</span>
        </div>
        <div class="timetable-progress">
          <div class="timetable-progress-fill" style="width:${recordPct}%"></div>
        </div>
        <div class="timetable-list">
          ${state.todayRecords.map((r, idx) => `
            <div class="tt-row ${r.done?'done':''} ${idx === doneCount && !r.done?'current':''}">
              <div class="tt-period-badge ${r.done?'done':idx===doneCount?'current':''}" style="${r.done?'':''}">
                ${r.done ? '<i class="fas fa-check" style="font-size:10px"></i>' : r.period}
              </div>
              <div class="tt-info">
                <span class="tt-subject-name" style="color:${r.color}">${r.subject}</span>
                ${r.done ? `<span class="tt-summary">${r.summary}</span>` : `<span class="tt-summary" style="opacity:0.4">${r.teacher} 선생님</span>`}
              </div>
              <div class="tt-action">
                ${r.done
                  ? `<span class="tt-done-badge">${r.question ? '<span class="tt-q-badge" style="margin-right:4px">질문</span>' :''}✅</span>`
                  : (idx === doneCount
                    ? `<button class="tt-record-btn" onclick="goScreen('class-end-popup')">기록하기</button>`
                    : `<span class="tt-locked"><i class="fas fa-lock" style="font-size:10px"></i></span>`
                  )
                }
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Daily Missions -->
      <div class="card stagger-3 animate-in">
        <div class="card-header-row">
          <span class="card-title">🎯 오늘의 미션</span>
          <span class="xp-badge-sm">완료 시 +30 XP</span>
        </div>
        ${state.missions.map((m,i) => `
          <div class="mission-row ${m.done?'done':''}">
            <div class="mission-icon">${m.icon}</div>
            <div class="mission-info">
              <span class="mission-text">${m.text}</span>
              <div class="mission-bar">
                <div class="mission-bar-fill" style="width:${Math.min(m.current/m.target*100,100)}%"></div>
              </div>
            </div>
            <span class="mission-count">${m.current}/${m.target}</span>
            ${m.done ? '<i class="fas fa-check-circle" style="color:var(--success);font-size:18px"></i>' : ''}
          </div>
        `).join('')}
      </div>

      <!-- Weekly Mini Chart -->
      <div class="card stagger-4 animate-in">
        <div class="card-header-row">
          <span class="card-title">📊 이번 주 현황</span>
          <button class="card-link" onclick="goScreen('weekly-report')">자세히 →</button>
        </div>
        <div class="weekly-mini-stats">
          <div class="mini-stat">
            <span class="mini-stat-value" style="color:var(--primary-light)">12</span>
            <span class="mini-stat-label">기록</span>
          </div>
          <div class="mini-stat-divider"></div>
          <div class="mini-stat">
            <span class="mini-stat-value" style="color:var(--accent)">5</span>
            <span class="mini-stat-label">질문</span>
          </div>
          <div class="mini-stat-divider"></div>
          <div class="mini-stat">
            <span class="mini-stat-value" style="color:var(--teach-green)">2</span>
            <span class="mini-stat-label">교학상장</span>
          </div>
          <div class="mini-stat-divider"></div>
          <div class="mini-stat">
            <span class="mini-stat-value" style="color:var(--question-b)">82%</span>
            <span class="mini-stat-label">B+C비율</span>
          </div>
        </div>
        <div class="weekly-bar-chart">
          ${state.weeklyData.days.map((d, i) => `
            <div class="weekly-bar-col">
              <div class="weekly-bar-stack">
                <div class="weekly-bar-q" style="height:${state.weeklyData.questions[i]*12}px"></div>
                <div class="weekly-bar-r" style="height:${state.weeklyData.records[i]*8}px"></div>
              </div>
              <span class="weekly-bar-label ${i===4?'style="color:var(--primary-light);font-weight:700"':''}">${d}</span>
            </div>
          `).join('')}
        </div>
        <div class="chart-legend">
          <span><span class="legend-dot" style="background:var(--primary)"></span>기록</span>
          <span><span class="legend-dot" style="background:var(--accent)"></span>질문</span>
        </div>
      </div>

      <!-- Upcoming Assignments Home Card -->
      ${state.assignments.filter(a => a.status !== 'completed').length > 0 ? `
      <div class="card stagger-5 animate-in">
        <div class="card-header-row">
          <span class="card-title">📋 다가오는 과제</span>
          <button class="card-link" onclick="goScreen('assignment-list')">전체보기 →</button>
        </div>
        <div class="upcoming-assignments">
          ${state.assignments.filter(a => a.status !== 'completed').sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).map(a => {
            const dDay = getDday(a.dueDate);
            const dDayText = dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`;
            const urgency = dDay <= 1 ? 'urgent' : dDay <= 3 ? 'warning' : 'normal';
            return `
            <div class="upcoming-assignment-card ${urgency}" onclick="state.viewingAssignment=${a.id};goScreen('assignment-plan')">
              <div class="ua-left">
                <div class="ua-dday-badge ${urgency}">${dDayText}</div>
              </div>
              <div class="ua-center">
                <div class="ua-subject-row">
                  <span class="ua-subject-dot" style="background:${a.color}"></span>
                  <span class="ua-subject">${a.subject}</span>
                  <span class="ua-type">${a.type}</span>
                </div>
                <div class="ua-title">${a.title}</div>
                <div class="ua-progress-row">
                  <div class="ua-progress-bar"><div class="ua-progress-fill" style="width:${a.progress}%;background:${a.color}"></div></div>
                  <span class="ua-progress-text">${a.progress}%</span>
                </div>
              </div>
              <div class="ua-right">
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
            `;
          }).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Quick Actions -->
      <div style="padding:0 16px 16px;display:flex;gap:8px;flex-wrap:wrap" class="stagger-6 animate-in">
        <button class="quick-action-btn" onclick="goScreen('evening-routine')">
          <i class="fas fa-moon"></i> 저녁 루틴
        </button>
        <button class="quick-action-btn" onclick="goScreen('class-end-popup')">
          <i class="fas fa-bell"></i> 수업종료 팝업
        </button>
        <button class="quick-action-btn" onclick="goScreen('assignment-list')">
          <i class="fas fa-clipboard-list"></i> 과제 관리
        </button>
      </div>
    </div>
  `;
}

// ==================== NOTIFICATIONS ====================

function renderNotifications() {
  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>🔔 알림</h1>
        <span class="card-subtitle">${state.notifications.filter(n=>n.unread).length}개 새 알림</span>
      </div>
      <div class="form-body">
        ${state.notifications.map((n,i) => `
          <div class="notification-item ${n.unread?'unread':''} stagger-${i+1} animate-in">
            <div class="notif-icon" style="background:${n.bg}">${n.icon}</div>
            <div class="notif-content">
              <div class="notif-title">${n.title}</div>
              <div class="notif-desc">${n.desc}</div>
            </div>
            <span class="notif-time">${n.time}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==================== RECORD TAB (R-01~R-06) ====================

function renderRecordTab() {
  return `
    <div class="tab-content animate-in">
      <div class="screen-header">
        <h1>📝 기록</h1>
      </div>
      
      <div class="record-type-grid">
        ${[
          { screen:'record-class', icon:'📝', bg:'rgba(108,92,231,0.15)', title:'수업 기록', desc:'30초 만에 오늘 수업을 기록', xp:'+10' },
          { screen:'record-assignment', icon:'📋', bg:'rgba(255,159,67,0.15)', title:'과제 기록', desc:'선생님 과제를 기록하고 계획', xp:'+15' },
          { screen:'record-question', icon:'❓', bg:'rgba(255,107,107,0.15)', title:'질문 코칭', desc:'2축 9단계 AI 코칭', xp:'+8~30' },
          { screen:'record-teach', icon:'🤝', bg:'rgba(0,184,148,0.15)', title:'교학상장', desc:'친구에게 가르친 경험', xp:'+30' },
          { screen:'record-activity', icon:'🏫', bg:'rgba(253,203,110,0.15)', title:'창체 / 동아리', desc:'비교과 활동 기록', xp:'+20' },
        ].map((item,i) => `
          <div class="record-type-card stagger-${i+1} animate-in" onclick="goScreen('${item.screen}')">
            <div class="record-type-icon" style="background:${item.bg}">${item.icon}</div>
            <div class="record-type-info">
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
            </div>
            <span class="xp-badge-sm">${item.xp}</span>
          </div>
        `).join('')}
      </div>

      <!-- Upcoming Assignments Mini -->
      ${state.assignments.filter(a => a.status !== 'completed').length > 0 ? `
      <div class="card stagger-6 animate-in">
        <div class="card-header-row">
          <span class="card-title">📋 진행 중인 과제</span>
          <button class="card-link" onclick="goScreen('assignment-list')">전체보기 →</button>
        </div>
        ${state.assignments.filter(a => a.status !== 'completed').slice(0, 2).map(a => {
          const dDay = getDday(a.dueDate);
          const dDayText = dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`;
          const urgency = dDay <= 1 ? 'urgent' : dDay <= 3 ? 'warning' : 'normal';
          return `
          <div class="assignment-mini-row" onclick="state.viewingAssignment=${a.id};goScreen('assignment-plan')">
            <div class="assignment-mini-dot" style="background:${a.color}"></div>
            <div class="assignment-mini-info">
              <span class="assignment-mini-subject">${a.subject}</span>
              <span class="assignment-mini-title">${a.title}</span>
            </div>
            <div class="assignment-mini-right">
              <span class="assignment-dday ${urgency}">${dDayText}</span>
              <div class="assignment-mini-bar"><div class="assignment-mini-bar-fill" style="width:${a.progress}%;background:${a.color}"></div></div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
      ` : ''}

      <!-- Recent Records Timeline -->
      <div class="card stagger-7 animate-in">
        <div class="card-header-row">
          <span class="card-title">📜 최근 기록</span>
          <button class="card-link" onclick="goScreen('record-history')">전체보기 →</button>
        </div>
        
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-dot" style="background:var(--primary)"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-time">오늘 2교시</span>
                <span class="timeline-subject">수학</span>
                <span class="q-level q-level-c">C-1</span>
              </div>
              <p class="timeline-text">치환적분과 부분적분의 선택 기준이 함수의 구조에 의존한다면...</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot" style="background:var(--accent)"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-time">오늘 1교시</span>
                <span class="timeline-subject">국어</span>
              </div>
              <p class="timeline-text">윤동주, 서시, 자아성찰, 저항시의 시대적 배경</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot" style="background:var(--teach-green)"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-time">어제</span>
                <span class="timeline-subject">교학상장 · 수학</span>
                <span style="color:var(--teach-green);font-size:12px">🤝</span>
              </div>
              <p class="timeline-text">이서연에게 치환적분 역함수 관점 설명 (15분)</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot" style="background:var(--accent-warm)"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-time">어제</span>
                <span class="timeline-subject">동아리</span>
              </div>
              <p class="timeline-text">코딩동아리 - Python으로 수학 그래프 시각화 프로젝트</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================== CLASS END POPUP ====================

function renderClassEndPopup() {
  const nextRecord = state.todayRecords.find(r => !r.done);
  const subject = nextRecord ? nextRecord.subject : '영어';
  const period = nextRecord ? nextRecord.period : 3;
  const teacher = nextRecord ? nextRecord.teacher : '이정민';
  const color = nextRecord ? nextRecord.color : '#00B894';
  
  return `
    <div class="popup-overlay animate-in">
      <div class="popup-card">
        <div class="popup-header">
          <div class="popup-bell"><i class="fas fa-bell"></i></div>
          <h2>${period}교시 <span style="color:${color}">${subject}</span> 수업 끝!</h2>
          <p>${teacher} 선생님</p>
        </div>

        <div class="popup-timer">
          <span class="timer-icon">⏱️</span>
          <span class="timer-text">30초면 OK!</span>
        </div>

        <p style="font-size:13px;color:var(--text-secondary);text-align:center;margin-bottom:12px">입력 방식 선택</p>
        <div class="input-modes">
          <button class="input-mode-btn ${state.inputMode==='voice'?'active':''}" data-input-mode="voice">
            <i class="fas fa-microphone"></i>
            <span>음성</span>
          </button>
          <button class="input-mode-btn ${state.inputMode==='photo'?'active':''}" data-input-mode="photo">
            <i class="fas fa-camera"></i>
            <span>사진</span>
          </button>
          <button class="input-mode-btn ${state.inputMode==='keyword'?'active':''}" data-input-mode="keyword">
            <i class="fas fa-keyboard"></i>
            <span>키워드</span>
          </button>
        </div>

        ${renderInputModeContent(subject)}

        <div class="field-group">
          <label class="field-label">💭 생각 한 줄 <span style="color:var(--text-muted)">(선택)</span></label>
          <input class="input-field" placeholder="이 수업에서 느낀 점, 궁금한 점...">
        </div>

        <div class="popup-question-ask">
          <span>❓ 질문이 있었나요?</span>
          <p style="font-size:11px;color:var(--text-muted);margin:4px 0 8px">AI가 2축 9단계로 질문을 코칭해줘요!</p>
          <div style="display:flex;gap:8px">
            <button class="btn-secondary" style="flex:1" onclick="goScreen('record-question')">🪜 호기심 질문</button>
            <button class="btn-secondary" style="flex:1;border-color:rgba(192,68,204,0.3);color:#C044CC" onclick="state._questionAxis='reflection';goScreen('record-question')">🪞 성찰 질문</button>
          </div>
          <button class="btn-ghost" style="width:100%;margin-top:6px;font-size:12px">질문 없어요</button>
        </div>

        <button class="btn-primary" onclick="completeClassRecord(${period-1})">
          기록 완료 +10 XP ✨
        </button>
        <button class="popup-skip" onclick="goScreen('main')">나중에 할게요</button>
      </div>
    </div>
  `;
}

function renderInputModeContent(subject) {
  if (state.inputMode === 'voice') {
    return `
      <div class="voice-recording-visual">
        <div class="voice-wave">
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
          <div class="voice-wave-bar"></div>
        </div>
        <p style="font-size:14px;font-weight:600;color:var(--primary-light)">🎙️ 녹음 중... 0:12</p>
        <p style="font-size:12px;color:var(--text-muted)">수업 내용을 말해주세요</p>
        <div style="display:flex;gap:12px;margin-top:4px">
          <button class="btn-secondary" style="padding:8px 20px;font-size:12px;border-radius:20px">
            <i class="fas fa-stop" style="color:var(--accent);margin-right:4px"></i> 중지
          </button>
          <button class="btn-secondary" style="padding:8px 20px;font-size:12px;border-radius:20px">
            <i class="fas fa-redo" style="margin-right:4px"></i> 다시
          </button>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">📝 AI 변환 결과</label>
        <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary);line-height:1.6;border:1px solid var(--border)">
          <span style="color:var(--success);font-size:11px;font-weight:600">[AI 변환]</span><br>
          오늘 ${subject} 시간에는 관계대명사 중에서 which와 that의 차이점을 배웠습니다. 제한적 용법과 계속적 용법의 구분이 중요했어요.
        </div>
      </div>
    `;
  } else if (state.inputMode === 'photo') {
    return `
      <div class="photo-capture-visual">
        <i class="fas fa-camera-retro"></i>
        <span>필기 사진을 촬영하세요</span>
        <span style="font-size:11px;color:var(--text-muted)">또는 앨범에서 선택</span>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <div style="flex:1;padding:8px;background:var(--bg-input);border:1px solid rgba(108,92,231,0.2);border-radius:var(--radius-md);text-align:center">
          <div style="width:100%;height:60px;background:rgba(108,92,231,0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:4px">
            <i class="fas fa-image" style="color:var(--primary-light);font-size:20px"></i>
          </div>
          <span style="font-size:10px;color:var(--text-muted)">필기 미리보기</span>
        </div>
        <div style="flex:1;padding:8px;background:var(--bg-input);border:1px dashed var(--border);border-radius:var(--radius-md);text-align:center">
          <div style="width:100%;height:60px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:4px">
            <i class="fas fa-plus" style="color:var(--text-muted);font-size:16px"></i>
          </div>
          <span style="font-size:10px;color:var(--text-muted)">추가 촬영</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">📝 AI OCR 추출 키워드</label>
        <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary);line-height:1.6;border:1px solid var(--border)">
          <span style="color:var(--success);font-size:11px;font-weight:600">[AI 인식]</span><br>
          관계대명사, which, that, 제한적 용법, 계속적 용법
        </div>
      </div>
    `;
  } else {
    return `
      <div class="field-group">
        <textarea class="input-field" placeholder="오늘 배운 핵심 키워드를 입력하세요" rows="2">관계대명사, which, that, 제한적용법</textarea>
      </div>
    `;
  }
}

// ==================== RECORD CLASS (R-01) ====================

function renderRecordClass() {
  const nextRecord = state.todayRecords.find(r => !r.done);
  const subject = nextRecord ? nextRecord.subject : '영어';
  const teacher = nextRecord ? nextRecord.teacher : '이정민';
  const period = nextRecord ? nextRecord.period : 3;
  const color = nextRecord ? nextRecord.color : '#00B894';

  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>수업 기록</h1>
        <span class="header-badge">${period}교시 ${subject}</span>
      </div>

      <div class="form-body">
        <div class="subject-indicator">
          <span class="subject-dot" style="background:${color}"></span>
          <span>${subject} · ${teacher} 선생님</span>
          <span class="period-badge">${period}교시</span>
        </div>

        <p style="font-size:13px;color:var(--text-secondary);text-align:center;margin-bottom:8px">입력 방식 선택</p>
        <div class="input-modes">
          <button class="input-mode-btn ${state.inputMode==='voice'?'active':''}" data-input-mode="voice"><i class="fas fa-microphone"></i><span>음성</span></button>
          <button class="input-mode-btn ${state.inputMode==='photo'?'active':''}" data-input-mode="photo"><i class="fas fa-camera"></i><span>사진</span></button>
          <button class="input-mode-btn ${state.inputMode==='keyword'?'active':''}" data-input-mode="keyword"><i class="fas fa-keyboard"></i><span>키워드</span></button>
        </div>

        ${renderInputModeContent(subject)}

        <div class="field-group">
          <label class="field-label">💭 나만의 생각 한 줄 <span style="color:var(--text-muted)">(선택)</span></label>
          <textarea class="input-field" placeholder="이 수업에서 느낀 점, 궁금한 점..." rows="2">which와 that의 차이가 단순히 문법 규칙이 아니라 의미 전달의 차이라는 게 흥미로웠다</textarea>
        </div>

        <div class="question-prompt">
          <p>❓ 질문이 떠올랐나요?</p>
          <p style="font-size:11px;color:var(--text-muted);margin:-4px 0 8px">2축 9단계 AI 코칭으로 사고의 깊이를 키워보세요!</p>
          <div style="display:flex;gap:12px">
            <button class="btn-secondary" style="flex:1" onclick="goScreen('record-question')">🪜 호기심 질문</button>
            <button class="btn-secondary" style="flex:1;border-color:rgba(192,68,204,0.3);color:#C044CC" onclick="state._questionAxis='reflection';goScreen('record-question')">🪞 성찰 질문</button>
          </div>
        </div>

        <button class="btn-primary" onclick="showXpPopup(10, '수업 기록 완료!')">완료 +10 XP ✨</button>
        <p class="input-timer">⏱️ 입력 시간: 22초</p>
      </div>
    </div>
  `;
}

// ==================== RECORD QUESTION (R-02) ====================

function renderRecordQuestion() {
  // 2축 9단계 질문 코칭 시스템 v2.0
  const questionLevels = {
    curiosity: [
      { id:'A-1', label:'뭐지?', name:'사실·정의 확인', xp:8, desc:'정해진 공식·정의를 확인하는 질문', icon:'👀', group:'A' },
      { id:'A-2', label:'어떻게?', name:'절차·방법 확인', xp:10, desc:'풀이 방법이나 순서를 묻는 질문', icon:'🔧', group:'A' },
      { id:'B-1', label:'왜?', name:'이유·원리 탐구', xp:15, desc:'개념의 의미와 원리를 깊이 이해하려는 질문', icon:'💡', group:'B' },
      { id:'B-2', label:'만약에?', name:'가능성 탐색', xp:20, desc:'조건을 변경하고 결과를 예측하는 전략적 사고', icon:'🔀', group:'B' },
      { id:'C-1', label:'뭐가 더 나아?', name:'비교·판단', xp:25, desc:'서로 다른 방법을 비교하고 자기 판단 제시', icon:'⚖️', group:'C' },
      { id:'C-2', label:'그러면?', name:'확장·창조', xp:30, desc:'배운 것을 새로운 상황에 적용/확장', icon:'🚀', group:'C' },
    ],
    reflection: [
      { id:'R-1', label:'어디서 틀렸지?', name:'오류 위치 발견', xp:15, desc:'틀린 지점을 특정하는 질문', icon:'🔍' },
      { id:'R-2', label:'왜 틀렸지?', name:'오류 원인 분석', xp:20, desc:'개념부족·실수·해석오류 등 원인 분석', icon:'🧪' },
      { id:'R-3', label:'다음엔 어떻게?', name:'재발 방지 전략', xp:25, desc:'구체적 다음 행동 전략 수립', icon:'🎯' },
    ]
  };

  const coachingMode = state._coachingMode || 'diagnosis'; // 'diagnosis' | 'challenge' | 'socrates'
  const diagResult = state._diagResult || null;
  const socratesStep = state._socratesStep || 0;

  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="state._coachingMode=null;state._diagResult=null;state._socratesStep=0;goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>질문 코칭</h1>
        <span class="header-badge">🧠 2축 9단계</span>
      </div>

      <div class="form-body">
        <!-- 시스템 소개 배너 -->
        <div class="coaching-banner animate-in">
          <div class="coaching-banner-icon">🧠</div>
          <div class="coaching-banner-text">
            <strong>2축 9단계 질문 코칭 시스템</strong>
            <p>"답이 아니라 사고의 심연으로" — 궁금함을 만드는 소크라테스 코칭</p>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">📚 과목</label>
          <div class="chip-row">
            ${['국어','수학','영어','과학','한국사'].map((s,i) => `<button class="chip ${i===2?'active':''}">${s}</button>`).join('')}
          </div>
        </div>

        <!-- 질문 유형 선택: 호기심 vs 성찰 + 정율질문방 -->
        <div class="field-group">
          <div class="field-label-row">
            <label class="field-label" style="margin-bottom:0">📋 질문 유형</label>
            <button class="btn-jyqr" onclick="openJeongyulQA()">
              <span class="jyqr-pulse"></span>
              <i class="fas fa-external-link-alt"></i>
              정율질문방 가기
            </button>
          </div>
          <div class="axis-selector">
            <button class="axis-btn ${!state._questionAxis || state._questionAxis==='curiosity'?'active':''}" onclick="state._questionAxis='curiosity';renderScreen()">
              <span class="axis-icon">🪜</span>
              <span>축1: 호기심 사다리</span>
              <small>문제를 향한 질문</small>
            </button>
            <button class="axis-btn ${state._questionAxis==='reflection'?'active':''}" onclick="state._questionAxis='reflection';renderScreen()">
              <span class="axis-icon">🪞</span>
              <span>축2: 성찰 질문</span>
              <small>내 풀이를 향한 질문</small>
            </button>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">❓ 질문 내용</label>
          <div class="question-input-wrap">
            <textarea class="input-field" rows="3" id="question-input" placeholder="${state._questionAxis==='reflection' ? '내가 어디서 틀렸는지, 왜 틀렸는지 생각을 적어주세요' : '수업 중 궁금한 점을 적어주세요. 자기 생각도 함께!'}">나는 관계대명사 which와 that이 역사적으로 같은 기능이었을 것 같은데, 왜 제한적/계속적 용법으로 나뉘게 된 건가요?</textarea>
            
            <!-- 이미지 첨부 미리보기 -->
            ${state._questionImages && state._questionImages.length > 0 ? `
            <div class="q-image-preview-row">
              ${state._questionImages.map((img, idx) => `
                <div class="q-image-preview-item">
                  <img src="${img}" alt="첨부 이미지 ${idx+1}">
                  <button class="q-image-remove" onclick="state._questionImages.splice(${idx},1);renderScreen()">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <!-- 이미지 첨부 버튼 바 -->
            <div class="q-attach-bar">
              <button class="q-attach-btn" onclick="document.getElementById('q-image-upload').click()">
                <i class="fas fa-image"></i>
                <span>사진 첨부</span>
              </button>
              <button class="q-attach-btn" onclick="document.getElementById('q-camera-capture').click()">
                <i class="fas fa-camera"></i>
                <span>촬영</span>
              </button>
              <span class="q-attach-hint">문제지, 풀이 과정 등을 찍어 올려보세요</span>
            </div>
            <input type="file" id="q-image-upload" accept="image/*" multiple style="display:none" onchange="handleQuestionImageUpload(this)">
            <input type="file" id="q-camera-capture" accept="image/*" capture="environment" style="display:none" onchange="handleQuestionImageUpload(this)">
          </div>
          <div class="input-hint">💡 <strong>B단계 이상</strong> 판정 조건: ① 구체적 대상 ② 자기 생각 ③ 맥락 연결</div>
        </div>

        <button class="btn-primary" style="margin-bottom:16px" onclick="analyzeQuestion()">
          <i class="fas fa-robot"></i> AI 질문 분석하기
        </button>

        <!-- 로딩 상태 -->
        ${coachingMode === 'loading' ? `
        <div class="ai-diagnosis-card animate-in" style="text-align:center;padding:32px 16px">
          <div class="loading-spinner-wrap">
            <div class="diag-loading-spinner"></div>
          </div>
          <p style="margin-top:12px;font-weight:600;color:var(--text-secondary)">🧠 AI가 질문을 분석하고 있어요...</p>
          <p style="font-size:10px;color:var(--text-muted);margin-top:4px">${state._questionImages && state._questionImages.length > 0 ? '📷 이미지 분석 → 질문 분석 2단계 진행 중' : '2축 9단계 기준으로 꼼꼼히 확인 중'}</p>
        </div>
        ` : ''}

        <!-- 이미지 분석 결과 (있을 경우) -->
        ${state._imageAnalysis && coachingMode === 'result' ? `
        <div class="ai-diagnosis-card animate-in" style="margin-bottom:10px;border-left:3px solid #FDCB6E">
          <div class="ai-header">
            <span class="ai-icon">📷</span>
            <span class="ai-title">이미지 분석 결과</span>
            <span style="margin-left:auto;font-size:9px;background:var(--bg-input);padding:2px 8px;border-radius:8px">Gemini</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">
            <div style="background:var(--bg-input);padding:6px 8px;border-radius:8px">
              <div style="font-size:8px;color:var(--text-muted)">과목</div>
              <div style="font-size:11px;font-weight:700">${state._imageAnalysis.subject || '미지정'}</div>
            </div>
            <div style="background:var(--bg-input);padding:6px 8px;border-radius:8px">
              <div style="font-size:8px;color:var(--text-muted)">단원</div>
              <div style="font-size:11px;font-weight:700">${state._imageAnalysis.topic || '미지정'}</div>
            </div>
          </div>
          ${state._imageAnalysis.extractedText ? `<div style="margin-top:8px;font-size:10px;color:var(--text-secondary);background:var(--bg-input);padding:8px;border-radius:8px;line-height:1.5"><strong>📝 인식 내용:</strong> ${state._imageAnalysis.extractedText}</div>` : ''}
          ${state._imageAnalysis.handwritingCheck ? `<div style="margin-top:6px;font-size:10px;color:var(--text-secondary);background:var(--bg-input);padding:8px;border-radius:8px"><strong>✏️ 필기 확인:</strong> ${state._imageAnalysis.handwritingCheck}</div>` : ''}
          ${state._imageAnalysis.analysis ? `<div style="margin-top:6px;font-size:10px;color:var(--text-secondary);background:var(--bg-input);padding:8px;border-radius:8px;line-height:1.5"><strong>🔍 분석:</strong> ${state._imageAnalysis.analysis}</div>` : ''}
        </div>
        ` : ''}

        <!-- AI 진단 결과 카드 (동적) -->
        ${coachingMode === 'result' && diagResult ? `
        <div class="ai-diagnosis-card animate-in">
          <div class="ai-header">
            <span class="ai-icon">📊</span>
            <span class="ai-title">질문 분석 결과</span>
            <span style="margin-left:auto;font-size:9px;background:var(--bg-input);padding:2px 8px;border-radius:8px">${diagResult.axis === 'reflection' ? '축2 성찰' : '축1 호기심'}</span>
          </div>
          <div class="diag-question-echo">
            <span class="diag-q-label">네 질문:</span>
            <span class="diag-q-text">"${(document.getElementById('question-input')?.value || '').replace(/"/g, '&quot;').substring(0,200)}"</span>
          </div>

          ${diagResult.error ? `
          <div style="background:#FFF3F3;padding:12px;border-radius:10px;margin-top:8px;border:1px solid #FFD0D0">
            <p style="font-size:11px;color:#E74C3C;font-weight:600">⚠️ 분석 중 오류가 발생했습니다</p>
            <p style="font-size:10px;color:var(--text-muted);margin-top:4px">${diagResult.error}</p>
            <button class="btn-ghost" style="margin-top:8px" onclick="analyzeQuestion()">
              <i class="fas fa-redo"></i> 다시 시도
            </button>
          </div>
          ` : `
          <!-- 3대 필수조건 체크리스트 -->
          ${diagResult.checks ? `
          <div class="diag-checklist">
            <div class="diag-check-item ${diagResult.checks.specificTarget?.pass ? 'pass' : 'fail'}">
              <span class="diag-check-icon">${diagResult.checks.specificTarget?.pass ? '✅' : '❌'}</span>
              <span class="diag-check-label">구체적 대상</span>
              <span class="diag-check-detail">${diagResult.checks.specificTarget?.detail || '확인 불가'}</span>
            </div>
            <div class="diag-check-item ${diagResult.checks.ownThought?.pass ? 'pass' : 'fail'}">
              <span class="diag-check-icon">${diagResult.checks.ownThought?.pass ? '✅' : '❌'}</span>
              <span class="diag-check-label">자기 생각</span>
              <span class="diag-check-detail">${diagResult.checks.ownThought?.detail || '확인 불가'}</span>
            </div>
            <div class="diag-check-item ${diagResult.checks.contextLink?.pass ? 'pass' : 'fail'}">
              <span class="diag-check-icon">${diagResult.checks.contextLink?.pass ? '✅' : '❌'}</span>
              <span class="diag-check-label">맥락 연결</span>
              <span class="diag-check-detail">${diagResult.checks.contextLink?.detail || '확인 불가'}</span>
            </div>
          </div>
          ` : ''}

          <!-- 진단 결과 -->
          <div class="diag-result">
            <span class="diag-arrow">→</span>
            <span class="q-level q-level-${(diagResult.level||'A-1').charAt(0).toLowerCase()}">${diagResult.level || '?'}</span>
            <span class="diag-result-name">"${diagResult.levelName || ''}" ${diagResult.levelDesc || ''} 단계!</span>
            <span class="diag-xp">XP +${diagResult.xp || 0}</span>
          </div>

          <!-- AI 피드백 -->
          ${diagResult.feedback ? `
          <div style="background:var(--bg-input);padding:10px 12px;border-radius:10px;margin-top:8px;font-size:11px;line-height:1.6;color:var(--text-secondary)">
            💬 ${diagResult.feedback}
          </div>
          ` : ''}

          <!-- 다음 단계 힌트 -->
          ${diagResult.nextHint ? `
          <div class="diag-hint">
            <span class="diag-hint-icon">💡</span>
            <div class="diag-hint-text">
              <strong>다음 단계 목표:</strong> ${diagResult.nextHint.hint || ''}
              → <span class="q-level q-level-${(diagResult.nextHint.targetLevel||'').charAt(0).toLowerCase()}">${diagResult.nextHint.targetLevel} "${diagResult.nextHint.targetName}"</span>
            </div>
          </div>
          ` : ''}

          <!-- 도전 / 확정 버튼 -->
          <div class="diag-actions">
            ${diagResult.nextHint ? `
            <button class="btn-challenge" onclick="startChallenge()">
              <i class="fas fa-fire"></i> ${diagResult.nextHint.targetLevel} 도전! 🔥
            </button>
            ` : ''}
            <button class="btn-ghost" onclick="showXpPopup(${diagResult.xp || 0}, '${diagResult.level || ''} ${diagResult.levelName || ''} 완료!')">
              괜찮아요 ✓
            </button>
          </div>
          `}
        </div>
        ` : ''}

        <!-- 도전 모드 -->
        ${coachingMode === 'challenge' ? `
        <div class="challenge-mode animate-in">
          <div class="challenge-header">
            <span>🔥</span>
            <h3>더 좋은 질문 도전!</h3>
            <p>${diagResult?.nextHint ? `${diagResult.nextHint.targetLevel} "${diagResult.nextHint.targetName}" 단계를 목표로 질문을 다시 만들어보세요` : '한 단계 높은 질문을 만들어보세요'}</p>
          </div>
          <textarea class="input-field" rows="3" id="challenge-input" placeholder="${diagResult?.nextHint?.hint || '더 깊은 사고가 담긴 질문을 작성해보세요!'}"></textarea>
          
          ${state._challengeLoading ? `
          <div style="text-align:center;padding:16px">
            <div class="diag-loading-spinner"></div>
            <p style="font-size:10px;color:var(--text-muted);margin-top:8px">도전 질문 분석 중...</p>
          </div>
          ` : ''}

          ${state._challengeResult ? `
          <div class="challenge-result animate-in" style="margin-top:8px">
            <span class="diag-arrow">→</span>
            <span class="q-level q-level-${(state._challengeResult.level||'A-1').charAt(0).toLowerCase()}" style="font-size:14px">${state._challengeResult.level}</span>
            <span>"${state._challengeResult.levelName}" ${state._challengeResult.levelDesc || ''}</span>
            <span class="diag-xp">XP +${state._challengeResult.xp || 0}${state._challengeResult.xp > (diagResult?.xp||0) ? ' (↑+5 보너스)' : ''}</span>
          </div>
          ${state._challengeResult.feedback ? `<div style="background:var(--bg-input);padding:8px 12px;border-radius:8px;margin-top:6px;font-size:10px;color:var(--text-secondary);line-height:1.5">💬 ${state._challengeResult.feedback}</div>` : ''}
          <div class="diag-actions" style="margin-top:8px">
            <button class="btn-primary" onclick="showXpPopup(${(state._challengeResult.xp||0) + (state._challengeResult.xp > (diagResult?.xp||0) ? 5 : 0)}, '${state._challengeResult.level} 도전 ${state._challengeResult.xp > (diagResult?.xp||0) ? '성공! +5 성장보너스 포함' : '완료!'}')">도전 완료! +${(state._challengeResult.xp||0) + (state._challengeResult.xp > (diagResult?.xp||0) ? 5 : 0)} XP ${state._challengeResult.xp > (diagResult?.xp||0) ? '🎉' : '✓'}</button>
          </div>
          ` : `
          ${!state._challengeLoading ? `
          <div class="diag-actions" style="margin-top:8px">
            <button class="btn-primary" onclick="submitChallenge()">
              <i class="fas fa-paper-plane"></i> 도전 질문 제출!
            </button>
            <button class="btn-ghost" onclick="state._coachingMode='result';state._challengeResult=null;renderScreen()">돌아가기</button>
          </div>
          ` : ''}
          `}
        </div>
        ` : ''}

        <!-- 선생님과 함께하기 모드 -->
        ${coachingMode === 'result' || coachingMode === 'diagnosis' ? `
        <div class="socrates-entry animate-in" style="margin-top:12px">
          <button class="btn-socrates" onclick="startSocrates()">
            <span class="socrates-icon">👨‍🏫</span>
            <div class="socrates-text">
              <strong>선생님과 함께하기</strong>
              <small>AI가 소크라테스식 질문으로 사고를 확장해줘요</small>
            </div>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        ` : ''}

        ${coachingMode === 'socrates' ? `
        <div class="socrates-mode animate-in">
          <div class="socrates-header">
            <span>👨‍🏫</span>
            <h3>선생님과 함께하기</h3>
            <p>AI 코치가 질문으로 사고를 이끌어줄게요 (Claude)</p>
          </div>
          <div class="socrates-chat" id="socrates-chat-area">
            ${(state._socratesMessages || []).filter(m => !m._hidden).map(m => {
              if (m.role === 'user') {
                return `<div class="socrates-msg student"><div class="socrates-bubble student-bubble"><p>${m.content}</p></div></div>`;
              } else {
                let parsed;
                try { parsed = typeof m.content === 'string' ? JSON.parse(m.content) : m.content; } catch { parsed = { message: m.content }; }
                return `<div class="socrates-msg ai">
                  <div class="socrates-avatar">${parsed.emoji || '🤖'}</div>
                  <div class="socrates-bubble">
                    <p>${parsed.message || m.content}</p>
                    ${parsed.questionLevel ? `<span class="socrates-stage-tag">이 질문은 ${parsed.questionLevel} "${parsed.questionLabel || ''}" 단계예요</span>` : ''}
                    ${parsed.encouragement ? `<div style="margin-top:6px;font-size:10px;color:var(--primary);font-weight:600">${parsed.encouragement}</div>` : ''}
                  </div>
                </div>`;
              }
            }).join('')}
            ${state._socratesLoading ? `
            <div class="socrates-msg ai">
              <div class="socrates-avatar">🤖</div>
              <div class="socrates-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
            </div>
            ` : ''}
          </div>
          ${state._socratesComplete ? `
          <div class="socrates-complete animate-in">
            <div class="socrates-complete-icon">🎉</div>
            <p><strong>대화 완료!</strong> 사고가 확장됐어요!</p>
            <p class="socrates-xp">🏆 소크라테스 코칭 완료 +30 XP</p>
            <button class="btn-primary" onclick="showXpPopup(30, '소크라테스 코칭 완료!')">
              완료! +30 XP 🏆
            </button>
          </div>
          ` : `
          <div class="socrates-input-row">
            <input class="input-field" style="flex:1" id="socrates-input" placeholder="생각을 적어주세요..." onkeydown="if(event.key==='Enter'){sendSocratesMessage()}">
            <button class="btn-primary" style="padding:10px 16px" onclick="sendSocratesMessage()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          `}
          <button class="btn-ghost" style="margin-top:8px;width:100%" onclick="state._coachingMode='result';state._socratesMessages=null;state._socratesComplete=false;renderScreen()">
            <i class="fas fa-arrow-left"></i> 분석 결과로 돌아가기
          </button>
        </div>
        ` : ''}

        <!-- 2축 9단계 분류표 (접이식) -->
        <details class="classification-details" style="margin-top:16px">
          <summary class="classification-summary">
            <i class="fas fa-list"></i> 2축 9단계 분류표 보기
          </summary>
          <div class="classification-table">
            <div class="ct-section">
              <div class="ct-section-title">
                <span>🪜 축1: 호기심 사다리</span>
                <small>보기(See) → 파기(Dig) → 넓히기(Expand)</small>
              </div>
              <div class="ct-group-header ct-group-a">A단계 · 보기(See)</div>
              ${questionLevels.curiosity.filter(q=>q.group==='A').map(q => `
              <div class="ct-row">
                <span class="ct-id">${q.id}</span>
                <span class="ct-label">${q.icon} "${q.label}"</span>
                <span class="ct-name">${q.name}</span>
                <span class="ct-xp">${q.xp}XP</span>
              </div>`).join('')}
              <div class="ct-group-header ct-group-b">B단계 · 파기(Dig) — 3대 필수조건 필요</div>
              ${questionLevels.curiosity.filter(q=>q.group==='B').map(q => `
              <div class="ct-row">
                <span class="ct-id">${q.id}</span>
                <span class="ct-label">${q.icon} "${q.label}"</span>
                <span class="ct-name">${q.name}</span>
                <span class="ct-xp">${q.xp}XP</span>
              </div>`).join('')}
              <div class="ct-group-header ct-group-c">C단계 · 넓히기(Expand)</div>
              ${questionLevels.curiosity.filter(q=>q.group==='C').map(q => `
              <div class="ct-row">
                <span class="ct-id">${q.id}</span>
                <span class="ct-label">${q.icon} "${q.label}"</span>
                <span class="ct-name">${q.name}</span>
                <span class="ct-xp">${q.xp}XP</span>
              </div>`).join('')}
            </div>
            <div class="ct-section" style="margin-top:12px">
              <div class="ct-section-title">
                <span>🪞 축2: 성찰 질문</span>
                <small>내 풀이를 돌아보는 질문</small>
              </div>
              ${questionLevels.reflection.map(q => `
              <div class="ct-row">
                <span class="ct-id">${q.id}</span>
                <span class="ct-label">${q.icon} "${q.label}"</span>
                <span class="ct-name">${q.name}</span>
                <span class="ct-xp">${q.xp}XP</span>
              </div>`).join('')}
            </div>
            <div class="ct-note">
              <strong>⚠️ B단계 이상 필수조건:</strong> ① 구체적 대상 지목 ② "나는 ~라고 생각한다" 자기 생각 ③ 맥락(지문·조건)과 연결
            </div>
          </div>
        </details>

        ${coachingMode !== 'challenge' && coachingMode !== 'socrates' && !diagResult ? `
        <button class="btn-primary" style="margin-top:12px" onclick="showXpPopup(15, '질문 기록 완료! B-1 이유·원리 탐구')">완료 +15 XP ✨</button>
        ` : ''}
      </div>
    </div>
  `;
}

function analyzeQuestion() {
  const questionInput = document.getElementById('question-input');
  const questionText = questionInput ? questionInput.value.trim() : '';
  if (!questionText) { alert('질문 내용을 입력해주세요!'); return; }
  
  const activeChip = document.querySelector('.field-group .chip.active');
  const subject = activeChip ? activeChip.textContent.trim() : '';
  const axis = state._questionAxis || 'curiosity';
  
  // 이미지가 있으면 먼저 이미지 분석
  if (state._questionImages && state._questionImages.length > 0) {
    analyzeWithImage(questionText, subject, axis);
    return;
  }
  
  state._diagLoading = true;
  state._diagResult = null;
  state._coachingMode = 'loading';
  renderScreen();
  
  fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: questionText, subject, axis })
  })
  .then(r => r.json())
  .then(result => {
    state._diagResult = result;
    state._diagLoading = false;
    state._coachingMode = 'result';
    renderScreen();
  })
  .catch(err => {
    state._diagLoading = false;
    state._coachingMode = 'diagnosis';
    alert('AI 분석 중 오류: ' + err.message);
    renderScreen();
  });
}

function analyzeWithImage(questionText, subject, axis) {
  state._diagLoading = true;
  state._coachingMode = 'loading';
  renderScreen();
  
  const firstImage = state._questionImages[0];
  const mimeMatch = firstImage.match(/^data:(image\/\w+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  
  // Step 1: Gemini 이미지 분석
  fetch('/api/image-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: firstImage, mimeType, subject })
  })
  .then(r => r.json())
  .then(imageResult => {
    state._imageAnalysis = imageResult;
    // Step 2: 이미지 분석 결과 + 질문을 함께 OpenAI에 전달
    const enrichedQuestion = questionText + 
      (imageResult.extractedText ? `\n\n[이미지 분석 내용: ${imageResult.extractedText}]` : '') +
      (imageResult.analysis ? `\n[이미지 문제 분석: ${imageResult.analysis}]` : '');
    
    return fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: enrichedQuestion, subject: imageResult.subject || subject, axis })
    });
  })
  .then(r => r.json())
  .then(result => {
    state._diagResult = result;
    state._diagLoading = false;
    state._coachingMode = 'result';
    renderScreen();
  })
  .catch(err => {
    state._diagLoading = false;
    state._coachingMode = 'diagnosis';
    alert('AI 분석 중 오류: ' + err.message);
    renderScreen();
  });
}

function sendSocratesMessage() {
  const input = document.getElementById('socrates-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  
  if (!state._socratesMessages) state._socratesMessages = [];
  state._socratesMessages.push({ role: 'user', content: text });
  state._socratesLoading = true;
  renderScreen();
  
  const activeChip = document.querySelector('.field-group .chip.active');
  const subject = activeChip ? activeChip.textContent.trim() : '';
  
  // API에 보낼 때 _hidden 메시지도 포함 (대화 맥락 유지)
  const apiMessages = state._socratesMessages.map(m => ({ role: m.role, content: m.content }));
  
  fetch('/api/coaching', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: apiMessages,
      subject,
      currentLevel: state._diagResult ? state._diagResult.level : 'A-2'
    })
  })
  .then(r => r.json())
  .then(result => {
    state._socratesMessages.push({ role: 'assistant', content: JSON.stringify(result) });
    state._socratesLoading = false;
    if (result.isComplete) state._socratesComplete = true;
    renderScreen();
    setTimeout(() => {
      const chat = document.getElementById('socrates-chat-area');
      if (chat) chat.scrollTop = chat.scrollHeight;
    }, 100);
  })
  .catch(err => {
    state._socratesLoading = false;
    alert('코칭 AI 오류: ' + err.message);
    renderScreen();
  });
}

function handleQuestionImageUpload(input) {
  if (!input.files || input.files.length === 0) return;
  if (!state._questionImages) state._questionImages = [];
  
  Array.from(input.files).forEach(file => {
    if (state._questionImages.length >= 3) return; // 최대 3장
    const reader = new FileReader();
    reader.onload = (e) => {
      state._questionImages.push(e.target.result);
      renderScreen();
    };
    reader.readAsDataURL(file);
  });
  input.value = ''; // reset for re-upload
}

function startChallenge() {
  state._coachingMode = 'challenge';
  state._challengeResult = null;
  state._challengeLoading = false;
  renderScreen();
}

function submitChallenge() {
  const input = document.getElementById('challenge-input');
  const text = input ? input.value.trim() : '';
  if (!text) { alert('도전 질문을 입력해주세요!'); return; }

  const activeChip = document.querySelector('.field-group .chip.active');
  const subject = activeChip ? activeChip.textContent.trim() : '';
  const axis = state._questionAxis || 'curiosity';

  state._challengeLoading = true;
  renderScreen();

  fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: text, subject, axis })
  })
  .then(r => r.json())
  .then(result => {
    state._challengeResult = result;
    state._challengeLoading = false;
    renderScreen();
  })
  .catch(err => {
    state._challengeLoading = false;
    alert('도전 분석 중 오류: ' + err.message);
    renderScreen();
  });
}

function startSocrates() {
  const questionInput = document.getElementById('question-input');
  const questionText = questionInput ? questionInput.value.trim() : '';
  const activeChip = document.querySelector('.field-group .chip.active');
  const subject = activeChip ? activeChip.textContent.trim() : '';

  state._coachingMode = 'socrates';
  state._socratesComplete = false;
  state._socratesLoading = true;
  
  // 시작 시 AI에게 첫 질문을 받기 위한 초기 메시지 구성
  const currentLevel = state._diagResult ? state._diagResult.level : 'A-2';
  const initMsg = questionText 
    ? `학생이 "${questionText}"라는 질문을 했습니다 (${subject}). 이 학생의 현재 질문 단계는 ${currentLevel}입니다. 이 질문을 바탕으로 사고를 확장시키는 소크라테스식 첫 질문을 해주세요.`
    : `${subject} 과목에 대해 학생과 소크라테스식 대화를 시작합니다. 학생의 현재 단계는 ${currentLevel}입니다. 사고를 자극하는 첫 질문을 해주세요.`;
  
  state._socratesMessages = [{ role: 'user', content: initMsg }];
  renderScreen();

  fetch('/api/coaching', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: state._socratesMessages,
      subject,
      currentLevel
    })
  })
  .then(r => r.json())
  .then(result => {
    state._socratesMessages.push({ role: 'assistant', content: JSON.stringify(result) });
    // 초기 시스템 메시지를 사용자에게 보이지 않게 처리
    state._socratesMessages[0]._hidden = true;
    state._socratesLoading = false;
    renderScreen();
    // 채팅 스크롤 하단으로
    setTimeout(() => {
      const chat = document.getElementById('socrates-chat-area');
      if (chat) chat.scrollTop = chat.scrollHeight;
    }, 100);
  })
  .catch(err => {
    state._socratesLoading = false;
    alert('코칭 AI 시작 오류: ' + err.message);
    state._coachingMode = 'result';
    renderScreen();
  });
}

function openJeongyulQA() {
  // 현재 선택된 과목 가져오기
  const activeChip = document.querySelector('.chip.active');
  const subject = activeChip ? activeChip.textContent.trim() : '';
  
  // 질문 내용 가져오기
  const questionInput = document.getElementById('question-input');
  const questionText = questionInput ? questionInput.value.trim() : '';
  
  // 질문 축(유형) 정보
  const axis = state._questionAxis || 'curiosity';
  const axisLabel = axis === 'reflection' ? '성찰질문' : '호기심질문';
  
  // URL 구성 — 쿼리 파라미터로 과목, 질문 내용 전달
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (questionText) params.set('question', questionText);
  params.set('type', axisLabel);
  params.set('from', 'creditplanner');
  
  const url = 'https://qa-tutoring-app.pages.dev/new?' + params.toString();
  
  // 인앱 오버레이 패널로 열기
  openQAPanel(url);
}

function openQAPanel(url) {
  // 이미 열려있으면 URL만 변경
  let overlay = document.getElementById('qa-overlay');
  if (overlay) {
    const iframe = overlay.querySelector('iframe');
    if (iframe) iframe.src = url;
    overlay.classList.add('qa-overlay-visible');
    return;
  }
  
  // 오버레이 생성
  overlay = document.createElement('div');
  overlay.id = 'qa-overlay';
  overlay.className = 'qa-overlay';
  overlay.innerHTML = `
    <div class="qa-panel">
      <div class="qa-panel-header">
        <div class="qa-panel-title">
          <span class="qa-panel-icon">💬</span>
          <span>정율질문방</span>
        </div>
        <div class="qa-panel-actions">
          <button class="qa-panel-btn" onclick="window.open(document.getElementById('qa-iframe').src, '_blank')" title="새 탭에서 열기">
            <i class="fas fa-external-link-alt"></i>
          </button>
          <button class="qa-panel-btn qa-panel-close" onclick="closeQAPanel()" title="닫기">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="qa-panel-body">
        <div class="qa-loading-bar">
          <div class="qa-loading-progress"></div>
        </div>
        <iframe id="qa-iframe" src="${url}" allow="camera;microphone"></iframe>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // iframe 로드 완료 시 로딩바 숨김
  const iframe = overlay.querySelector('iframe');
  iframe.addEventListener('load', () => {
    overlay.querySelector('.qa-loading-bar').style.opacity = '0';
  });
  
  // 약간의 딜레이 후 visible 클래스 추가 (애니메이션)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('qa-overlay-visible');
    });
  });
  
  // 배경 클릭으로 닫기
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeQAPanel();
  });
}

function closeQAPanel() {
  const overlay = document.getElementById('qa-overlay');
  if (!overlay) return;
  overlay.classList.remove('qa-overlay-visible');
  setTimeout(() => {
    overlay.remove();
  }, 300);
}

// ==================== RECORD TEACH (R-03) ====================

function renderRecordTeach() {
  const classmates = ['이서연 (2-3)','박지호 (2-1)','정하은 (2-3)','최윤서 (2-2)','한도윤 (2-1)'];
  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>교학상장 기록</h1>
        <span class="xp-badge-sm">+30 XP</span>
      </div>

      <div class="form-body">
        <div class="teach-hero">
          <span class="teach-hero-emoji">🤝</span>
          <h2>오늘 누군가에게 가르쳤나요?</h2>
        </div>

        <div class="field-group">
          <label class="field-label">👤 누구에게?</label>
          <div class="input-with-icon">
            <i class="fas fa-search"></i>
            <input class="input-field" placeholder="학생 검색..." style="padding-left:40px">
          </div>
          <div class="teach-student-list">
            ${classmates.map((s,i) => `
              <div class="teach-student-item ${i===0?'selected':''}">
                <div class="teach-avatar">${s[0]}</div>
                <span>${s}</span>
                ${i===0?'<i class="fas fa-check-circle" style="color:var(--success);margin-left:auto"></i>':''}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">📚 무엇을?</label>
          <div class="chip-row">
            ${['국어','수학','영어','과학','기타'].map((s,i) => `<button class="chip ${i===1?'active':''}">${s}</button>`).join('')}
          </div>
          <input class="input-field" placeholder="단원/주제" value="치환적분의 원리" style="margin-top:8px">
        </div>

        <div class="field-group">
          <label class="field-label">💡 어떻게 가르쳤나요?</label>
          <textarea class="input-field" rows="3" placeholder="설명 방식, 예시, 접근법 등">역함수 관점에서 접근하면 왜 특정 치환만 가능한지 이해할 수 있다고 설명함</textarea>
        </div>

        <div class="field-group">
          <label class="field-label">⏱️ 대략 몇 분?</label>
          <div class="chip-row">
            ${['5분','10분','15분','20분','30분+'].map((t,i) => `<button class="chip ${i===2?'active':''}">${t}</button>`).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">🔍 가르치면서 발견한 것 <span class="field-hint">세특의 보석! 💎</span></label>
          <textarea class="input-field" rows="3" placeholder="설명하다 보니 내가 모르고 있었던 것...">설명하다 보니 내가 왜 특정 형태만 치환이 되는지 정확히 모르고 있었다는 걸 알게 됨</textarea>
        </div>

        <div class="teach-confirm-box">
          📨 이서연에게 확인 요청을 보낼까요?
          <button class="btn-secondary" style="margin-top:8px;font-size:12px">확인 요청 보내기</button>
        </div>

        <button class="btn-primary" onclick="showXpPopup(30, '교학상장 기록 완료! 🏅')">기록 완료 +30 XP 🏅</button>
      </div>
    </div>
  `;
}

// ==================== RECORD ASSIGNMENT (과제 기록) ====================

function renderRecordAssignment() {
  const subjectColors = {
    '국어':'#FF6B6B','수학':'#6C5CE7','영어':'#00B894','과학':'#FDCB6E',
    '한국사':'#74B9FF','체육':'#A29BFE','미술':'#FD79A8','기타':'#636e72'
  };
  const editing = state.editingAssignment;
  const isEdit = editing !== null;
  const a = isEdit ? state.assignments.find(x => x.id === editing) : null;
  
  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="state.editingAssignment=null;goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>${isEdit ? '과제 수정' : '📋 과제 기록'}</h1>
        <span class="xp-badge-sm">+15 XP</span>
      </div>

      <div class="form-body">
        <div class="assignment-intro-card animate-in">
          <span class="assignment-intro-icon">📋</span>
          <div>
            <h3>선생님이 내 준 과제를 기록하세요</h3>
            <p>마감일까지의 계획도 함께 세울 수 있어요!</p>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">📚 과목</label>
          <div class="chip-row" id="assignment-subject-chips">
            ${['국어','수학','영어','과학','한국사','기타'].map((s,i) => `<button class="chip ${(isEdit && a.subject===s) || (!isEdit && i===1) ? 'active' : ''}" data-subject="${s}">${s}</button>`).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">📝 과제 제목</label>
          <input class="input-field" id="assignment-title" placeholder="예: 치환적분 연습문제 풀이" value="${isEdit ? a.title : ''}">
        </div>

        <div class="field-group">
          <label class="field-label">📄 상세 내용</label>
          <textarea class="input-field" id="assignment-desc" rows="3" placeholder="과제의 구체적인 내용, 범위, 조건 등을 적어주세요">${isEdit ? a.desc : ''}</textarea>
        </div>

        <div class="field-group">
          <label class="field-label">📂 과제 유형</label>
          <div class="assignment-type-grid">
            ${[
              {type:'문제풀이', icon:'✏️'},
              {type:'에세이/작문', icon:'📝'},
              {type:'보고서', icon:'📊'},
              {type:'감상문', icon:'📖'},
              {type:'프로젝트', icon:'🔬'},
              {type:'발표준비', icon:'🎤'},
              {type:'실험/실습', icon:'🧪'},
              {type:'기타', icon:'📌'},
            ].map((t,i) => `
              <button class="assignment-type-btn ${(isEdit && a.type===t.type) || (!isEdit && i===0) ? 'active' : ''}" data-atype="${t.type}">
                <span>${t.icon}</span><span>${t.type}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">👨‍🏫 선생님</label>
          <input class="input-field" id="assignment-teacher" placeholder="과제를 내 준 선생님" value="${isEdit ? a.teacher : ''}">
        </div>

        <div class="field-group">
          <label class="field-label">📅 마감일</label>
          <input class="input-field" type="date" id="assignment-due" value="${isEdit ? a.dueDate : '2025-02-22'}" style="color:var(--text-primary)">
        </div>

        <div class="assignment-plan-cta animate-in" onclick="saveAssignment(true)">
          <div class="plan-cta-icon">📅</div>
          <div class="plan-cta-content">
            <h3>제출 계획 세우기</h3>
            <p>마감일까지 단계별 플랜을 AI가 도와줘요!</p>
          </div>
          <i class="fas fa-chevron-right" style="color:var(--primary-light)"></i>
        </div>

        <button class="btn-primary" onclick="saveAssignment(false)">
          ${isEdit ? '과제 수정 완료' : '과제 기록 완료 +15 XP ✨'}
        </button>
      </div>
    </div>
  `;
}

// ==================== ASSIGNMENT PLAN (과제 계획) ====================

function renderAssignmentPlan() {
  const a = state.assignments.find(x => x.id === state.viewingAssignment);
  if (!a) { goScreen('main'); return ''; }
  
  const dDay = getDday(a.dueDate);
  const dDayText = dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`;
  const urgency = dDay <= 1 ? 'urgent' : dDay <= 3 ? 'warning' : 'normal';
  const donePlanSteps = a.plan.filter(p => p.done).length;
  const totalPlanSteps = a.plan.length;
  const planPct = totalPlanSteps > 0 ? Math.round(donePlanSteps / totalPlanSteps * 100) : 0;
  
  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="state.viewingAssignment=null;goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>📅 과제 계획</h1>
        <span class="assignment-dday ${urgency}" style="font-size:13px;padding:5px 12px">${dDayText}</span>
      </div>

      <div class="form-body">
        <!-- Assignment Summary Card -->
        <div class="assignment-summary-card animate-in" style="border-left:4px solid ${a.color}">
          <div class="asm-header">
            <div class="asm-subject" style="color:${a.color}">${a.subject}</div>
            <span class="asm-type">${a.type}</span>
          </div>
          <h2 class="asm-title">${a.title}</h2>
          <p class="asm-desc">${a.desc}</p>
          <div class="asm-meta">
            <span><i class="fas fa-user"></i> ${a.teacher} 선생님</span>
            <span><i class="fas fa-calendar"></i> ${formatDate(a.dueDate)} 까지</span>
          </div>
          <div class="asm-progress-row">
            <div class="asm-progress-bar"><div class="asm-progress-fill" style="width:${a.progress}%;background:${a.color}"></div></div>
            <span class="asm-progress-text">${a.progress}%</span>
          </div>
        </div>

        <!-- Plan Steps -->
        <div class="plan-section stagger-1 animate-in">
          <div class="card-header-row">
            <span class="card-title">📋 단계별 플랜</span>
            <span class="card-subtitle">${donePlanSteps}/${totalPlanSteps} 완료</span>
          </div>
          
          <div class="plan-progress-mini">
            <div class="plan-progress-bar"><div class="plan-progress-fill" style="width:${planPct}%;background:${a.color}"></div></div>
          </div>

          <div class="plan-steps">
            ${a.plan.map((step, i) => {
              const isNext = !step.done && (i === 0 || a.plan[i-1].done);
              return `
              <div class="plan-step ${step.done ? 'done' : ''} ${isNext ? 'next' : ''}">
                <div class="plan-step-check" onclick="togglePlanStep(${a.id}, ${i})">
                  ${step.done 
                    ? '<i class="fas fa-check-circle" style="color:var(--success);font-size:20px"></i>'
                    : isNext 
                      ? '<i class="far fa-circle" style="color:var(--primary-light);font-size:20px"></i>'
                      : '<i class="far fa-circle" style="color:var(--text-muted);font-size:20px"></i>'
                  }
                </div>
                <div class="plan-step-line ${i === a.plan.length - 1 ? 'last' : ''} ${step.done ? 'done' : ''}"></div>
                <div class="plan-step-content ${isNext ? 'highlight' : ''}">
                  <div class="plan-step-header">
                    <span class="plan-step-num">Step ${step.step}</span>
                    <span class="plan-step-date">${step.date}</span>
                  </div>
                  <span class="plan-step-title">${step.title}</span>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- AI Suggestion -->
        <div class="ai-plan-card stagger-2 animate-in">
          <div class="ai-header">
            <span class="ai-icon">🤖</span>
            <span class="ai-title">AI 플랜 제안</span>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-top:8px">
            ${dDay <= 3 
              ? `⚠️ 마감이 <strong style="color:var(--accent)">${dDay}일</strong> 남았어요! 오늘부터 하루 1단계씩 진행하면 충분히 완료할 수 있어요. 집중 시간을 확보하세요!`
              : `✅ 마감까지 <strong style="color:var(--success)">${dDay}일</strong> 남았어요. 현재 진행률 ${a.progress}%로 순조로운 편이에요. 꾸준히 하루에 1단계씩 진행해보세요!`
            }
          </p>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn-secondary" style="flex:1" onclick="state.editingAssignment=${a.id};goScreen('record-assignment')">
            <i class="fas fa-edit"></i> 수정
          </button>
          <button class="btn-primary" style="flex:2" onclick="goScreen('assignment-list')">
            <i class="fas fa-list"></i> 과제 목록
          </button>
        </div>

        ${a.status !== 'completed' ? `
        <button class="btn-ghost" style="width:100%;margin-top:8px;color:var(--success)" onclick="completeAssignment(${a.id})">
          ✅ 과제 완료 처리
        </button>
        ` : `
        <div class="assignment-completed-badge">
          <i class="fas fa-check-circle"></i> 이 과제는 완료되었습니다! 🎉
        </div>
        `}
      </div>
    </div>
  `;
}

// ==================== ASSIGNMENT LIST (과제 목록/관리) ====================

function renderAssignmentList() {
  const filter = state.assignmentFilter;
  const filtered = filter === 'all' 
    ? state.assignments 
    : state.assignments.filter(a => a.status === filter);
  
  const activeCount = state.assignments.filter(a => a.status !== 'completed').length;
  const completedCount = state.assignments.filter(a => a.status === 'completed').length;
  
  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="state.assignmentFilter='all';goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>📋 과제 관리</h1>
        <button class="header-add-btn" onclick="state.editingAssignment=null;goScreen('record-assignment')"><i class="fas fa-plus"></i></button>
      </div>

      <div class="form-body">
        <!-- Stats Summary -->
        <div class="assignment-stats-row animate-in">
          <div class="assignment-stat-card">
            <span class="assignment-stat-num" style="color:var(--primary-light)">${activeCount}</span>
            <span class="assignment-stat-label">진행 중</span>
          </div>
          <div class="assignment-stat-card">
            <span class="assignment-stat-num" style="color:var(--success)">${completedCount}</span>
            <span class="assignment-stat-label">완료</span>
          </div>
          <div class="assignment-stat-card">
            <span class="assignment-stat-num" style="color:var(--accent)">${state.assignments.filter(a => getDday(a.dueDate) <= 3 && a.status !== 'completed').length}</span>
            <span class="assignment-stat-label">긴급</span>
          </div>
        </div>

        <!-- Filter Chips -->
        <div class="chip-row" style="margin-bottom:16px" id="assignment-filter-chips">
          ${[
            {id:'all', label:'전체', count: state.assignments.length},
            {id:'in-progress', label:'진행 중', count: state.assignments.filter(a=>a.status==='in-progress').length},
            {id:'pending', label:'시작 전', count: state.assignments.filter(a=>a.status==='pending').length},
            {id:'completed', label:'완료', count: state.assignments.filter(a=>a.status==='completed').length},
          ].map(f => `<button class="chip ${filter===f.id?'active':''}" data-afilter="${f.id}">${f.label} (${f.count})</button>`).join('')}
        </div>

        <!-- Assignment Cards -->
        ${filtered.length === 0 ? `
          <div style="text-align:center;padding:40px 0;color:var(--text-muted)">
            <span style="font-size:40px">📭</span>
            <p style="margin-top:12px">해당하는 과제가 없습니다</p>
          </div>
        ` : ''}
        
        ${filtered.sort((a,b) => {
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (a.status !== 'completed' && b.status === 'completed') return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }).map((a, i) => {
          const dDay = getDday(a.dueDate);
          const dDayText = dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`;
          const urgency = a.status === 'completed' ? 'completed' : dDay <= 1 ? 'urgent' : dDay <= 3 ? 'warning' : 'normal';
          const donePlanSteps = a.plan.filter(p => p.done).length;
          return `
          <div class="assignment-card ${urgency} stagger-${i+1} animate-in" onclick="state.viewingAssignment=${a.id};goScreen('assignment-plan')">
            <div class="ac-top">
              <div class="ac-subject-badge" style="background:${a.color}22;color:${a.color};border:1px solid ${a.color}44">${a.subject}</div>
              <span class="ac-type">${a.type}</span>
              <span class="assignment-dday ${urgency}" style="margin-left:auto">${a.status === 'completed' ? '✅ 완료' : dDayText}</span>
            </div>
            <h3 class="ac-title">${a.title}</h3>
            <p class="ac-desc">${a.desc}</p>
            <div class="ac-bottom">
              <div class="ac-meta">
                <span><i class="fas fa-user"></i> ${a.teacher}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(a.dueDate)}</span>
              </div>
              <div class="ac-progress-row">
                <div class="ac-progress-bar"><div class="ac-progress-fill" style="width:${a.progress}%;background:${a.color}"></div></div>
                <span class="ac-progress-text">${a.progress}%</span>
                <span class="ac-plan-count">${donePlanSteps}/${a.plan.length}단계</span>
              </div>
            </div>
          </div>
          `;
        }).join('')}

        <!-- Add Assignment Button -->
        <button class="add-assignment-btn" onclick="state.editingAssignment=null;goScreen('record-assignment')">
          <i class="fas fa-plus-circle"></i> 새 과제 추가
        </button>
      </div>
    </div>
  `;
}

// ==================== ASSIGNMENT UTILITIES ====================

function getDday(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const due = new Date(dateStr);
  due.setHours(0,0,0,0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth()+1}/${d.getDate()}`;
}

function saveAssignment(goToPlan) {
  const subjectChip = document.querySelector('#assignment-subject-chips .chip.active');
  const typeBtn = document.querySelector('.assignment-type-btn.active');
  const title = document.getElementById('assignment-title')?.value || '';
  const desc = document.getElementById('assignment-desc')?.value || '';
  const teacher = document.getElementById('assignment-teacher')?.value || '';
  const dueDate = document.getElementById('assignment-due')?.value || '';
  const subject = subjectChip ? subjectChip.dataset.subject : '수학';
  const type = typeBtn ? typeBtn.dataset.atype : '문제풀이';
  
  const subjectColors = {
    '국어':'#FF6B6B','수학':'#6C5CE7','영어':'#00B894','과학':'#FDCB6E',
    '한국사':'#74B9FF','체육':'#A29BFE','미술':'#FD79A8','기타':'#636e72'
  };

  if (state.editingAssignment !== null) {
    const a = state.assignments.find(x => x.id === state.editingAssignment);
    if (a) {
      a.subject = subject;
      a.title = title || a.title;
      a.desc = desc || a.desc;
      a.type = type;
      a.teacher = teacher || a.teacher;
      a.dueDate = dueDate || a.dueDate;
      a.color = subjectColors[subject] || '#636e72';
    }
    state.editingAssignment = null;
    if (goToPlan) {
      state.viewingAssignment = a.id;
      goScreen('assignment-plan');
    } else {
      showXpPopup(5, '과제 수정 완료!');
    }
    return;
  }

  const newId = state.assignments.length > 0 ? Math.max(...state.assignments.map(a=>a.id)) + 1 : 1;
  const daysUntilDue = getDday(dueDate);
  const stepsCount = Math.max(3, Math.min(6, daysUntilDue));
  
  // Auto-generate plan steps
  const plan = [];
  const dueD = new Date(dueDate);
  const today = new Date();
  for (let i = 0; i < stepsCount; i++) {
    const stepDate = new Date(today.getTime() + ((dueD - today) / stepsCount) * (i + 1));
    const stepLabels = ['자료 조사 및 준비','초안 작성','본문 완성','검토 및 수정','최종 점검','제출'];
    plan.push({
      step: i + 1,
      title: stepLabels[i] || `${i+1}단계 진행`,
      date: `${stepDate.getMonth()+1}/${stepDate.getDate()}`,
      done: false
    });
  }

  const newAssignment = {
    id: newId,
    subject,
    title: title || '새 과제',
    desc: desc || '',
    type,
    teacher: teacher || '',
    dueDate,
    createdDate: new Date().toISOString().split('T')[0],
    color: subjectColors[subject] || '#636e72',
    status: 'pending',
    progress: 0,
    plan
  };
  
  state.assignments.push(newAssignment);

  if (goToPlan) {
    state.viewingAssignment = newId;
    goScreen('assignment-plan');
  } else {
    showXpPopup(15, '과제 기록 완료! 📋');
  }
}

function togglePlanStep(assignmentId, stepIdx) {
  const a = state.assignments.find(x => x.id === assignmentId);
  if (!a) return;
  a.plan[stepIdx].done = !a.plan[stepIdx].done;
  
  // Update progress
  const doneCount = a.plan.filter(p => p.done).length;
  a.progress = Math.round(doneCount / a.plan.length * 100);
  
  // Update status
  if (a.progress === 100) {
    a.status = 'completed';
  } else if (a.progress > 0) {
    a.status = 'in-progress';
  } else {
    a.status = 'pending';
  }
  
  renderScreen();
}

function completeAssignment(id) {
  const a = state.assignments.find(x => x.id === id);
  if (!a) return;
  a.status = 'completed';
  a.progress = 100;
  a.plan.forEach(p => p.done = true);
  showXpPopup(20, '과제 완료! 🎉');
}

// ==================== RECORD ACTIVITY (R-04 창체/동아리) ====================

function renderRecordActivity() {
  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>창체 / 동아리 기록</h1>
        <span class="xp-badge-sm">+20 XP</span>
      </div>

      <div class="form-body">
        <div class="field-group">
          <label class="field-label">📂 활동 유형</label>
          <div class="activity-type-grid">
            ${[
              {type:'club', icon:'🎭', name:'동아리'},
              {type:'volunteer', icon:'🤲', name:'봉사활동'},
              {type:'career', icon:'🎯', name:'진로활동'},
              {type:'self', icon:'🧠', name:'자율활동'},
            ].map((a,i) => `
              <button class="activity-type-btn ${i===0?'active':''}" data-type="${a.type}">
                <span>${a.icon}</span><span>${a.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">🏫 활동명</label>
          <input class="input-field" placeholder="예: 코딩동아리, 봉사활동..." value="코딩동아리 (CodingLab)">
        </div>

        <div class="field-group">
          <label class="field-label">📝 오늘 한 것</label>
          <textarea class="input-field" rows="3" placeholder="오늘 활동 내용을 간단히 적어주세요">Python matplotlib으로 수학 함수 그래프 시각화 프로젝트 진행. sin, cos 함수의 합성파 표현</textarea>
        </div>

        <div class="field-group">
          <label class="field-label">🔗 진로 연계 <span class="field-hint">(선택)</span></label>
          <input class="input-field" placeholder="이 활동이 진로와 어떻게 연결되나요?" value="프로그래밍 + 수학 시각화 = 데이터 사이언스">
        </div>

        <div class="field-group">
          <label class="field-label">💡 배운 점 / 느낀 점</label>
          <textarea class="input-field" rows="2" placeholder="활동하면서 느낀 점...">코드로 수학을 표현하니까 함수의 성질이 더 직관적으로 이해됨</textarea>
        </div>

        <div class="field-group">
          <label class="field-label">⏱️ 활동 시간</label>
          <div class="chip-row">
            ${['30분','1시간','1.5시간','2시간','2시간+'].map((t,i) => `<button class="chip ${i===1?'active':''}">${t}</button>`).join('')}
          </div>
        </div>

        <button class="btn-primary" onclick="showXpPopup(20, '창체 활동 기록 완료!')">기록 완료 +20 XP ✨</button>
      </div>
    </div>
  `;
}

// ==================== EVENING ROUTINE ====================

function renderEveningRoutine() {
  const doneCount = state.todayRecords.filter(r => r.done).length;
  const total = state.todayRecords.length;
  const questionCount = state.todayRecords.filter(r => r.question).length;
  
  return `
    <div class="full-screen animate-in">
      <div class="screen-header">
        <button class="back-btn" onclick="goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>🌙 저녁 루틴</h1>
        <span class="xp-badge-sm">+10 XP</span>
      </div>

      <div class="form-body">
        <div class="evening-summary-card">
          <h2>오늘 하루 수고했어요! 🌟</h2>
          <div class="evening-stats">
            <div class="evening-stat">
              <span class="evening-stat-num">${doneCount}/${total}</span>
              <span class="evening-stat-label">수업 기록</span>
            </div>
            <div class="evening-stat">
              <span class="evening-stat-num">${questionCount}</span>
              <span class="evening-stat-label">질문</span>
            </div>
            <div class="evening-stat">
              <span class="evening-stat-num">0</span>
              <span class="evening-stat-label">교학상장</span>
            </div>
          </div>
        </div>

        ${doneCount < total ? `
          <div class="card" style="margin:0 0 16px;border-color:rgba(243,156,18,0.3)">
            <div class="card-title" style="color:var(--warning)">⚠️ 아직 기록하지 않은 수업</div>
            ${state.todayRecords.filter(r => !r.done).map(r => `
              <div class="missing-record-row">
                <span>${r.period}교시 <span style="color:${r.color};font-weight:600">${r.subject}</span></span>
                <button class="btn-secondary" style="padding:6px 12px;font-size:12px" onclick="goScreen('record-class')">기록하기</button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card" style="margin:0 0 16px;border-color:rgba(0,184,148,0.3)">
            <div style="text-align:center;padding:8px 0">
              <span style="font-size:32px">🎉</span>
              <p style="font-size:14px;font-weight:600;color:var(--success);margin-top:8px">오늘 모든 수업을 기록했어요!</p>
            </div>
          </div>
        `}

        <div class="field-group">
          <label class="field-label">📝 오늘의 한 줄 메모</label>
          <textarea class="input-field" rows="2" placeholder="오늘 하루를 한 줄로 정리한다면?">수학 치환적분 질문이 B-1→C-1까지 사고의 심연을 돌파한 날!</textarea>
        </div>

        <div class="field-group">
          <label class="field-label">😊 오늘의 무드</label>
          <div class="mood-selector" style="justify-content:space-around">
            ${[
              {emoji:'😄', label:'최고'},
              {emoji:'🙂', label:'좋음'},
              {emoji:'😐', label:'보통'},
              {emoji:'😔', label:'별로'},
              {emoji:'😫', label:'힘듦'}
            ].map(m => `
              <button class="mood-btn ${m.emoji==='🙂'?'active':''}" data-mood="${m.emoji}">
                <span class="mood-emoji">${m.emoji}</span>
                <span class="mood-label">${m.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="evening-xp-preview">
          <div>오늘 획득 XP</div>
          <div class="evening-xp-total">+45 XP</div>
          <div class="evening-xp-breakdown">수업 기록 20 + 질문 15 + 루틴 10</div>
        </div>

        <button class="btn-primary btn-glow" onclick="showXpPopup(10, '저녁 루틴 완료! 🌙')">하루 마무리 +10 XP 🌙</button>
      </div>
    </div>
  `;
}

// ==================== WEEKLY REPORT (학생 미리보기) ====================

function renderWeeklyReportStudent() {
  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>📊 주간 리포트</h1>
        <span style="font-size:12px;color:var(--text-muted)">2월 2주차</span>
      </div>

      <div class="form-body">
        <div class="report-hero">
          <div class="report-hero-avatar">🎓</div>
          <h2>김민준의 이번 주</h2>
          <p>2월 10일 ~ 2월 15일</p>
        </div>

        <div class="report-stat-grid">
          ${[
            {num:'28', label:'수업 기록', sub:'/ 30수업 (93%)', color:'var(--primary-light)'},
            {num:'8', label:'질문', sub:'호기심4 성찰4', color:'var(--accent)'},
            {num:'2', label:'교학상장', sub:'수학, 영어', color:'var(--teach-green)'},
            {num:'🔥18', label:'스트릭', sub:'연속 기록', color:'var(--streak-fire)'},
          ].map(s => `
            <div class="report-stat-item">
              <span class="report-stat-num" style="color:${s.color}">${s.num}</span>
              <span class="report-stat-label">${s.label}</span>
              <span class="report-stat-sub">${s.sub}</span>
            </div>
          `).join('')}
        </div>

        <div class="card" style="margin:0 0 12px">
          <div class="card-title">📈 이번 주 하이라이트</div>
          <div class="highlight-item">
            <span class="highlight-badge" style="background:rgba(255,107,107,0.15);color:var(--accent)">호기심 사다리 성장</span>
            <p>영어에서 B-1("왜?") 단계 첫 등장! 관계대명사의 역사적 배경을 묻는 심층 질문</p>
          </div>
          <div class="highlight-item">
            <span class="highlight-badge" style="background:rgba(0,184,148,0.15);color:var(--teach-green)">교학상장</span>
            <p>수학 치환적분을 역함수 관점으로 설명하며 자신의 이해 빈틈도 발견</p>
          </div>
          <div class="highlight-item">
            <span class="highlight-badge" style="background:rgba(108,92,231,0.15);color:var(--primary-light)">사고의 심연 돌파</span>
            <p>수학 "치환적분" A-2→B-1→C-1 호기심 사다리 완주! +50 XP</p>
          </div>
        </div>

        <div class="card" style="margin:0 0 12px">
          <div class="card-title">🎯 다음 주 목표</div>
          ${[
            {icon:'❓', text:'영어 질문 B-2 "만약에?" 단계 도전'},
            {icon:'🤝', text:'교학상장 3회 이상'},
            {icon:'📝', text:'수업 기록 100% 달성'},
          ].map(g => `
            <div class="next-goal-item">
              <span class="next-goal-icon">${g.icon}</span>
              <span>${g.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ==================== RECORD HISTORY ====================

function renderRecordHistory() {
  const historyData = [
    { date: '오늘 · 2월 15일 (토)', items: [
      { type: '수업', color: 'var(--primary)', meta: '2교시 · 수학 · 김태호', text: '치환적분, 부분적분, 역함수', tags: [{q:'C-1 "뭐가 더 나아?"', style:'q-level q-level-c'}], xp: '+25' },
      { type: '수업', color: 'var(--accent)', meta: '1교시 · 국어 · 박선영', text: '윤동주 서시, 자아성찰, 저항시', tags: [], xp: '+10' },
    ]},
    { date: '어제 · 2월 14일 (금)', items: [
      { type: '교학상장', color: 'var(--teach-green)', meta: '수학 · 이서연에게', text: '치환적분 역함수 관점 설명 (15분)', tags: [], xp: '+30' },
      { type: '동아리', color: 'var(--accent-warm)', meta: '코딩동아리 CodingLab', text: 'Python matplotlib 수학 그래프 시각화', tags: [], xp: '+20' },
      { type: '수업', color: 'var(--primary)', meta: '5교시 · 과학 · 최은지', text: '산화환원 반응, 전자 이동', tags: [{q:'B-2 "만약에?"', style:'q-level q-level-b'}], xp: '+30' },
    ]},
  ];

  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="state.studentTab='record';goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>📜 기록 히스토리</h1>
      </div>

      <div class="form-body">
        <div class="chip-row" style="margin-bottom:16px">
          ${['전체','수업','질문','교학상장','창체'].map((c,i) => `<button class="chip ${i===0?'active':''}">${c}</button>`).join('')}
        </div>

        ${historyData.map(day => `
          <div class="history-date-header">${day.date}</div>
          ${day.items.map((item,i) => `
            <div class="history-card stagger-${i+1} animate-in">
              <div class="history-type-badge" style="background:${item.color}">${item.type}</div>
              <div class="history-content">
                <div class="history-meta">${item.meta}</div>
                <p>${item.text}</p>
                <div class="history-tags">
                  ${item.tags.map(t => `<span class="${t.style}" style="font-size:10px">${t.q}</span>`).join('')}
                  <span class="history-xp">${item.xp} XP</span>
                </div>
              </div>
            </div>
          `).join('')}
        `).join('')}
      </div>
    </div>
  `;
}

// ==================== PLANNER TAB ====================

function renderPlannerTab() {
  return `
    <div class="tab-content animate-in">
      <div class="planner-header">
        <h1>📅 플래너</h1>
        <div class="planner-view-toggle">
          ${['daily','weekly','monthly'].map(v => `
            <button class="pvt-btn ${state.plannerView===v?'active':''}" data-pview="${v}">
              ${v==='daily'?'일간':v==='weekly'?'주간':'월간'}
            </button>
          `).join('')}
        </div>
      </div>

      ${state.plannerView === 'daily' ? renderPlannerDaily() : ''}
      ${state.plannerView === 'weekly' ? renderPlannerWeekly() : ''}
      ${state.plannerView === 'monthly' ? renderPlannerMonthly() : ''}
    </div>
  `;
}

// ---- DAILY PLANNER ----
function renderPlannerDaily() {
  const d = new Date(state.plannerDate);
  const dayNames = ['일','월','화','수','목','금','토'];
  const todayItems = state.plannerItems.filter(i => i.date === state.plannerDate).sort((a,b) => a.time.localeCompare(b.time));
  const doneCount = todayItems.filter(i => i.done).length;
  const aiCount = todayItems.filter(i => i.aiGenerated).length;

  // 날짜 네비게이션 (5일)
  const dateDots = [];
  for (let offset = -2; offset <= 2; offset++) {
    const dd = new Date(d);
    dd.setDate(dd.getDate() + offset);
    const dateStr = dd.toISOString().split('T')[0];
    const itemCount = state.plannerItems.filter(i => i.date === dateStr).length;
    dateDots.push({ date: dateStr, day: dd.getDate(), dayName: dayNames[dd.getDay()], isToday: offset===0, hasItems: itemCount > 0, itemCount });
  }

  // 시간대 블록 생성
  const hours = [];
  for (let h = 7; h <= 22; h++) {
    const timeStr = `${String(h).padStart(2,'0')}:00`;
    const itemsInHour = todayItems.filter(item => {
      const itemH = parseInt(item.time.split(':')[0]);
      return itemH === h;
    });
    hours.push({ hour: h, time: timeStr, items: itemsInHour });
  }

  return `
    <!-- Date Navigator -->
    <div class="planner-date-nav">
      <button class="pdn-arrow" onclick="shiftPlannerDate(-1)"><i class="fas fa-chevron-left"></i></button>
      <div class="pdn-dates">
        ${dateDots.map(dd => `
          <button class="pdn-date ${dd.isToday?'active':''} ${dd.hasItems?'has-items':''}" onclick="state.plannerDate='${dd.date}';renderScreen()">
            <span class="pdn-dayname">${dd.dayName}</span>
            <span class="pdn-day">${dd.day}</span>
            ${dd.hasItems ? `<span class="pdn-dot"></span>` : ''}
          </button>
        `).join('')}
      </div>
      <button class="pdn-arrow" onclick="shiftPlannerDate(1)"><i class="fas fa-chevron-right"></i></button>
    </div>

    <!-- Daily Summary -->
    <div class="planner-daily-summary">
      <div class="pds-item"><span class="pds-num">${todayItems.length}</span><span class="pds-label">전체</span></div>
      <div class="pds-divider"></div>
      <div class="pds-item"><span class="pds-num" style="color:var(--success)">${doneCount}</span><span class="pds-label">완료</span></div>
      <div class="pds-divider"></div>
      <div class="pds-item"><span class="pds-num" style="color:var(--primary-light)">${aiCount}</span><span class="pds-label">AI 배치</span></div>
      <div class="pds-divider"></div>
      <div class="pds-item"><span class="pds-num" style="color:var(--accent)">${todayItems.filter(i=>i.category==='assignment'&&!i.done).length}</span><span class="pds-label">과제</span></div>
    </div>

    <!-- Timeline -->
    <div class="planner-timeline">
      ${hours.map(h => `
        <div class="pt-hour-row">
          <div class="pt-time">${h.hour}시</div>
          <div class="pt-content">
            ${h.items.length > 0 ? h.items.map(item => `
              <div class="pt-item ${item.done?'done':''} cat-${item.category}" onclick="togglePlannerItem('${item.id}')">
                <div class="pt-item-left">
                  <div class="pt-item-check">
                    ${item.done
                      ? '<i class="fas fa-check-circle" style="color:var(--success)"></i>'
                      : '<i class="far fa-circle"></i>'
                    }
                  </div>
                  <div class="pt-item-color" style="background:${item.color}"></div>
                </div>
                <div class="pt-item-body">
                  <div class="pt-item-title-row">
                    <span class="pt-item-icon">${item.icon}</span>
                    <span class="pt-item-title">${item.title}</span>
                  </div>
                  <div class="pt-item-meta">
                    <span>${item.time} ~ ${item.endTime}</span>
                    ${item.detail ? `<span class="pt-item-detail">· ${item.detail}</span>` : ''}
                  </div>
                </div>
                <div class="pt-item-right">
                  ${item.aiGenerated ? '<span class="pt-ai-badge">AI</span>' : ''}
                </div>
              </div>
            `).join('') : `
              <div class="pt-empty-slot" onclick="openPlannerAdd('${state.plannerDate}','${h.time}')">
                <i class="fas fa-plus" style="font-size:10px;opacity:0.4"></i>
              </div>
            `}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Add Button -->
    <div style="padding:0 16px 16px">
      <button class="add-assignment-btn" onclick="openPlannerAdd('${state.plannerDate}','')">
        <i class="fas fa-plus-circle"></i> 일정 추가
      </button>
    </div>
  `;
}

// ---- WEEKLY PLANNER ----
function renderPlannerWeekly() {
  const d = new Date(state.plannerDate);
  const dayOfWeek = d.getDay(); // 0=일 ~ 6=토
  const monday = new Date(d);
  monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const dayNames = ['월','화','수','목','금','토','일'];

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    const dateStr = dd.toISOString().split('T')[0];
    const items = state.plannerItems.filter(it => it.date === dateStr).sort((a,b) => a.time.localeCompare(b.time));
    const assignments = items.filter(it => it.category === 'assignment');
    // 이 날 마감인 과제
    const deadlines = state.assignments.filter(a => a.dueDate === dateStr && a.status !== 'completed');
    weekDays.push({ date: dateStr, day: dd.getDate(), dayName: dayNames[i], items, assignments, deadlines, isToday: dateStr === state.plannerDate });
  }

  const monthStr = `${monday.getFullYear()}.${String(monday.getMonth()+1).padStart(2,'0')}`;

  return `
    <div class="planner-week-header">
      <button class="pdn-arrow" onclick="shiftPlannerWeek(-1)"><i class="fas fa-chevron-left"></i></button>
      <span class="pw-month">${monthStr} · ${monday.getMonth()+1}/${monday.getDate()}~${weekDays[6].day}</span>
      <button class="pdn-arrow" onclick="shiftPlannerWeek(1)"><i class="fas fa-chevron-right"></i></button>
    </div>

    <div class="planner-week-grid">
      ${weekDays.map(wd => `
        <div class="pw-day ${wd.isToday?'today':''}" onclick="state.plannerDate='${wd.date}';state.plannerView='daily';renderScreen()">
          <div class="pw-day-header">
            <span class="pw-dayname">${wd.dayName}</span>
            <span class="pw-daynum ${wd.isToday?'today':''}">${wd.day}</span>
          </div>
          <div class="pw-items">
            ${wd.deadlines.map(dl => `
              <div class="pw-item pw-deadline">🚨 ${dl.subject} 마감</div>
            `).join('')}
            ${wd.items.slice(0, 4).map(item => `
              <div class="pw-item" style="border-left:2px solid ${item.color}">
                <span class="pw-item-time">${item.time.substring(0,5)}</span>
                <span class="pw-item-title">${item.title.replace('[과제] ','📋').replace('[탐구] ','🔬')}</span>
              </div>
            `).join('')}
            ${wd.items.length > 4 ? `<div class="pw-more">+${wd.items.length - 4}개 더</div>` : ''}
            ${wd.items.length === 0 && wd.deadlines.length === 0 ? `<div class="pw-empty">—</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Weekly Assignment Overview -->
    <div class="card" style="margin:12px 16px">
      <div class="card-header-row">
        <span class="card-title">📋 이번 주 과제 현황</span>
      </div>
      ${state.assignments.filter(a => {
        const due = new Date(a.dueDate);
        return due >= monday && due <= new Date(weekDays[6].date + 'T23:59:59') && a.status !== 'completed';
      }).map(a => {
        const dDay = getDday(a.dueDate);
        const dDayText = dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`;
        const urgency = dDay <= 1 ? 'urgent' : dDay <= 3 ? 'warning' : 'normal';
        return `
        <div class="pw-assignment-row" onclick="state.viewingAssignment=${a.id};goScreen('assignment-plan')">
          <span class="assignment-dday ${urgency}">${dDayText}</span>
          <span style="font-weight:600;flex:1;margin-left:8px">${a.subject} · ${a.title}</span>
          <span style="font-size:11px;color:var(--text-muted)">${a.progress}%</span>
        </div>`;
      }).join('') || '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:8px">이번 주 마감 과제 없음 ✅</p>'}
    </div>
  `;
}

// ---- MONTHLY PLANNER ----
function renderPlannerMonthly() {
  const d = new Date(state.plannerDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = state.plannerDate;

  const dayNames = ['일','월','화','수','목','금','토'];
  const cells = [];
  
  // 빈 셀
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const items = state.plannerItems.filter(it => it.date === dateStr);
    const deadlines = state.assignments.filter(a => a.dueDate === dateStr && a.status !== 'completed');
    cells.push({ day, dateStr, items, deadlines, isToday: dateStr === todayStr });
  }

  return `
    <div class="planner-month-header">
      <button class="pdn-arrow" onclick="shiftPlannerMonth(-1)"><i class="fas fa-chevron-left"></i></button>
      <span class="pm-title">${year}년 ${month+1}월</span>
      <button class="pdn-arrow" onclick="shiftPlannerMonth(1)"><i class="fas fa-chevron-right"></i></button>
    </div>

    <div class="planner-month-grid">
      ${dayNames.map(dn => `<div class="pm-day-header ${dn==='일'?'sun':dn==='토'?'sat':''}">${dn}</div>`).join('')}
      ${cells.map(cell => {
        if (!cell) return '<div class="pm-cell empty"></div>';
        const hasAssignment = cell.items.some(i => i.category === 'assignment');
        const hasClass = cell.items.some(i => i.category === 'class');
        const hasDeadline = cell.deadlines.length > 0;
        return `
          <div class="pm-cell ${cell.isToday?'today':''} ${hasDeadline?'deadline':''}" onclick="state.plannerDate='${cell.dateStr}';state.plannerView='daily';renderScreen()">
            <span class="pm-day-num">${cell.day}</span>
            <div class="pm-dots">
              ${hasClass ? '<span class="pm-dot" style="background:var(--primary)"></span>' : ''}
              ${hasAssignment ? '<span class="pm-dot" style="background:#FF9F43"></span>' : ''}
              ${cell.items.some(i => i.category === 'academy') ? '<span class="pm-dot" style="background:#E056A0"></span>' : ''}
              ${hasDeadline ? '<span class="pm-dot" style="background:var(--accent)"></span>' : ''}
            </div>
            ${cell.items.length > 0 ? `<span class="pm-count">${cell.items.length}</span>` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <!-- Legend -->
    <div class="pm-legend">
      <span><span class="pm-dot-lg" style="background:var(--primary)"></span>수업</span>
      <span><span class="pm-dot-lg" style="background:#FF9F43"></span>과제</span>
      <span><span class="pm-dot-lg" style="background:#E056A0"></span>학원</span>
      <span><span class="pm-dot-lg" style="background:var(--accent)"></span>마감</span>
    </div>

    <!-- Upcoming Deadlines -->
    <div class="card" style="margin:12px 16px">
      <div class="card-title">🚨 이번 달 마감 과제</div>
      ${state.assignments.filter(a => {
        const due = new Date(a.dueDate);
        return due.getMonth() === month && due.getFullYear() === year && a.status !== 'completed';
      }).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).map(a => {
        const dDay = getDday(a.dueDate);
        const dDayText = dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`;
        const urgency = dDay <= 1 ? 'urgent' : dDay <= 3 ? 'warning' : 'normal';
        return `
        <div class="pw-assignment-row" onclick="state.viewingAssignment=${a.id};goScreen('assignment-plan')">
          <span class="assignment-dday ${urgency}">${dDayText}</span>
          <span style="font-weight:600;flex:1;margin-left:8px">${a.subject} · ${a.title}</span>
          <span style="font-size:11px;color:var(--text-muted)">${formatDate(a.dueDate)}</span>
        </div>`;
      }).join('') || '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:8px">이번 달 마감 과제 없음 ✅</p>'}
    </div>
  `;
}

// ---- AI FLOATING ASSISTANT ----
function renderPlannerAiFloat() {
  if (state.plannerAiOpen) {
    return `
      <div class="planner-ai-panel animate-in">
        <div class="pai-header">
          <div class="pai-avatar">🤖</div>
          <div>
            <span class="pai-title">AI 플래너 도우미</span>
            <span class="pai-status">항상 대기 중</span>
          </div>
          <button class="pai-close" onclick="state.plannerAiOpen=false;renderScreen()"><i class="fas fa-times"></i></button>
        </div>
        <div class="pai-messages">
          ${state.plannerAiMessages.map(m => `
            <div class="pai-msg ${m.role}">
              ${m.role==='ai' ? '<span class="pai-msg-avatar">🤖</span>' : ''}
              <div class="pai-msg-bubble">${m.text}</div>
            </div>
          `).join('')}
        </div>
        <div class="pai-suggestions">
          ${[
            '오늘 남은 일정 정리해줘',
            '내일 공부 계획 짜줘',
            '과제 마감 일정 확인',
            '이번 주 비는 시간 찾아줘',
          ].map(s => `<button class="pai-suggestion" onclick="sendAiMessage('${s}')">${s}</button>`).join('')}
        </div>
        <div class="pai-input-row">
          <input class="pai-input" placeholder="AI에게 물어보세요..." id="pai-input-field" onkeypress="if(event.key==='Enter'){sendAiMessage(this.value);this.value=''}">
          <button class="pai-send" onclick="const inp=document.getElementById('pai-input-field');sendAiMessage(inp.value);inp.value=''"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    `;
  }
  return `
    <button class="planner-ai-fab" onclick="state.plannerAiOpen=true;renderScreen()">
      <span class="pai-fab-icon">🤖</span>
      <span class="pai-fab-pulse"></span>
    </button>
  `;
}

// ---- PLANNER ADD ITEM ----
function renderPlannerAddItem() {
  const prefillDate = state.plannerDate || '2025-02-15';
  const prefillTime = state._addTime || '';
  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="goScreen('main')"><i class="fas fa-arrow-left"></i></button>
        <h1>📝 일정 추가</h1>
      </div>
      <div class="form-body">
        <div class="field-group">
          <label class="field-label">📂 카테고리</label>
          <div class="planner-cat-grid" id="planner-cat-chips">
            ${[
              {id:'study',icon:'📝',name:'자습/복습'},
              {id:'assignment',icon:'📋',name:'과제'},
              {id:'explore',icon:'🔬',name:'탐구'},
              {id:'academy',icon:'🏢',name:'학원/과외'},
              {id:'activity',icon:'🏫',name:'창체/동아리'},
              {id:'personal',icon:'🎯',name:'개인 계획'},
              {id:'routine',icon:'☀️',name:'루틴'},
            ].map((c,i) => `
              <button class="planner-cat-btn ${i===0?'active':''}" data-pcat="${c.id}">
                <span>${c.icon}</span><span>${c.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">✏️ 제목</label>
          <input class="input-field" id="planner-add-title" placeholder="일정 제목을 입력하세요">
        </div>

        <div class="field-group">
          <label class="field-label">📝 상세 메모 <span class="field-hint">(선택)</span></label>
          <textarea class="input-field" id="planner-add-detail" placeholder="추가 내용이 있다면 적어주세요" rows="2"></textarea>
        </div>

        <div style="display:flex;gap:8px">
          <div class="field-group" style="flex:1">
            <label class="field-label">📅 날짜</label>
            <input class="input-field" type="date" id="planner-add-date" value="${prefillDate}" style="color:var(--text-primary)">
          </div>
          <div class="field-group" style="flex:1">
            <label class="field-label">⏰ 시작</label>
            <input class="input-field" type="time" id="planner-add-time" value="${prefillTime || '15:30'}" style="color:var(--text-primary)">
          </div>
          <div class="field-group" style="flex:1">
            <label class="field-label">⏰ 종료</label>
            <input class="input-field" type="time" id="planner-add-endtime" value="${prefillTime ? addHour(prefillTime) : '16:30'}" style="color:var(--text-primary)">
          </div>
        </div>

        <!-- AI Suggestion -->
        <div class="ai-plan-card">
          <div class="ai-header">
            <span class="ai-icon">🤖</span>
            <span class="ai-title">AI 추천</span>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-top:8px">
            지금 <strong style="color:var(--primary-light)">15:30~16:30</strong>이 비어있어요. 수학 과제가 D-5이니까 이 시간에 진행하면 좋겠어요! 📐
          </p>
        </div>

        <button class="btn-primary" onclick="addPlannerItem()">
          일정 추가 완료 ✨
        </button>
      </div>
    </div>
  `;
}

// ---- PLANNER UTILITIES ----

function shiftPlannerDate(offset) {
  const d = new Date(state.plannerDate);
  d.setDate(d.getDate() + offset);
  state.plannerDate = d.toISOString().split('T')[0];
  renderScreen();
}

function shiftPlannerWeek(offset) {
  const d = new Date(state.plannerDate);
  d.setDate(d.getDate() + (offset * 7));
  state.plannerDate = d.toISOString().split('T')[0];
  renderScreen();
}

function shiftPlannerMonth(offset) {
  const d = new Date(state.plannerDate);
  d.setMonth(d.getMonth() + offset);
  state.plannerDate = d.toISOString().split('T')[0];
  renderScreen();
}

function togglePlannerItem(id) {
  const item = state.plannerItems.find(i => i.id === id);
  if (item) {
    item.done = !item.done;
    renderScreen();
  }
}

function openPlannerAdd(date, time) {
  state.plannerDate = date;
  state._addTime = time;
  goScreen('planner-add');
}

function addHour(timeStr) {
  if (!timeStr) return '16:30';
  const [h, m] = timeStr.split(':').map(Number);
  return `${String(Math.min(h + 1, 23)).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function addPlannerItem() {
  const catBtn = document.querySelector('#planner-cat-chips .planner-cat-btn.active');
  const title = document.getElementById('planner-add-title')?.value || '';
  const detail = document.getElementById('planner-add-detail')?.value || '';
  const date = document.getElementById('planner-add-date')?.value || state.plannerDate;
  const time = document.getElementById('planner-add-time')?.value || '15:30';
  const endTime = document.getElementById('planner-add-endtime')?.value || '16:30';
  const category = catBtn ? catBtn.dataset.pcat : 'personal';

  const catMeta = {
    study:{color:'#6C5CE7',icon:'📝'}, assignment:{color:'#FF9F43',icon:'📋'},
    explore:{color:'#FF6B6B',icon:'🔬'}, academy:{color:'#E056A0',icon:'🏢'},
    activity:{color:'#00CEC9',icon:'🏫'},
    personal:{color:'#636e72',icon:'🎯'}, routine:{color:'#A29BFE',icon:'☀️'},
  };
  const meta = catMeta[category] || catMeta.personal;

  const newId = 'p' + (state.plannerItems.length + 100);
  state.plannerItems.push({
    id: newId, date, time, endTime,
    title: title || '새 일정',
    category, color: meta.color, icon: meta.icon,
    done: false, aiGenerated: false,
    detail: detail || undefined,
  });

  state.plannerDate = date;
  state.plannerView = 'daily';
  showXpPopup(5, '일정이 추가되었어요!');
}

function sendAiMessage(text) {
  if (!text || !text.trim()) return;
  state.plannerAiMessages.push({ role:'user', text: text.trim() });

  // AI 응답 시뮬레이션
  const responses = {
    '오늘 남은 일정 정리해줘': '오늘 남은 일정이에요 📋\n\n• 15:30 수학 과제 (11~15번)\n• 16:30 영어 에세이 서론/결론\n• 17:30 코딩동아리\n• 19:00 수학 복습\n• 20:00 저녁 루틴\n\n수학 과제부터 시작하면 시간 배분이 딱 맞을 거예요! 💪',
    '내일 공부 계획 짜줘': '내일(일요일) 계획을 짜봤어요 📅\n\n• 09:00~10:30 영어 에세이 마무리 (D-2!)\n• 10:30~12:00 치환적분 탐구 주제 정리\n• 14:00~15:30 자유 독서\n• 16:00~17:00 이서연 수학 가르치기\n\n영어 에세이 마감이 모레라서 오전에 끝내는 게 좋겠어요! ✅',
    '과제 마감 일정 확인': '진행 중인 과제 마감일이에요 🚨\n\n• 영어 에세이 → <strong>D-3 (2/18)</strong> 🟡\n• 수학 문제풀이 → D-5 (2/20)\n• 과학 보고서 → D-10 (2/25)\n\n영어 에세이에 집중하는 게 좋겠어요! 내일까지 서론/결론만 끝내면 여유 생겨요 👍',
    '이번 주 비는 시간 찾아줘': `이번 주 자유 시간이에요 ⏰\n\n• 토(오늘) 18:30~19:00 (30분)\n• 일 12:00~14:00 (2시간)\n• 일 17:00~ (자유)\n• 월 방과후 15:10~${state.timetable.academy.find(a=>a.day==='월')?state.timetable.academy.find(a=>a.day==='월').startTime:'자유'}\n• 화 방과후 16:00~\n${state.timetable.academy.length > 0 ? '\n⚠️ 학원 일정 고려: ' + state.timetable.academy.map(a=>a.day+' '+a.startTime+'~'+a.endTime).join(', ') : ''}\n\n학원 일정을 제외한 비는 시간에 과제나 복습을 추천해요! 📚`,
  };

  const academyToday = state.timetable.academy.length > 0 ? `\n학원 일정: ${state.timetable.academy.map(a=>`${a.day} ${a.name}(${a.startTime})`).join(', ')}` : '';
  const aiReply = responses[text.trim()] || `"${text.trim()}" 에 대해 확인해볼게요! 🔍\n\n현재 ${state.assignments.filter(a=>a.status!=='completed').length}개의 진행 중 과제와 ${state.plannerItems.filter(i=>i.date===state.plannerDate&&!i.done).length}개의 오늘 일정이 있어요.${academyToday}\n\n구체적으로 어떤 부분을 도와줄까요?`;

  setTimeout(() => {
    state.plannerAiMessages.push({ role:'ai', text: aiReply });
    renderScreen();
    // 스크롤 하단
    const msgBox = document.querySelector('.pai-messages');
    if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
  }, 500);

  renderScreen();
}

// ==================== GROWTH TAB (G-01~G-05) ====================

function renderGrowthTab() {
  // 2축 9단계 기반 성장 데이터
  const curiosityDist = [
    {id:'A-1', label:'A-1 뭐지?', pct:10, color:'var(--question-a)'},
    {id:'A-2', label:'A-2 어떻게?', pct:8, color:'var(--question-a)'},
    {id:'B-1', label:'B-1 왜?', pct:30, color:'var(--question-b)'},
    {id:'B-2', label:'B-2 만약에?', pct:22, color:'var(--question-b)'},
    {id:'C-1', label:'C-1 뭐가 더 나아?', pct:18, color:'var(--question-c)'},
    {id:'C-2', label:'C-2 그러면?', pct:12, color:'var(--question-c)'},
  ];
  const reflectionDist = [
    {id:'R-1', label:'R-1 어디서 틀렸지?', pct:35, color:'#E056A0'},
    {id:'R-2', label:'R-2 왜 틀렸지?', pct:40, color:'#C044CC'},
    {id:'R-3', label:'R-3 다음엔 어떻게?', pct:25, color:'#9B59B6'},
  ];
  const bcPct = 30 + 22 + 18 + 12; // B+C = 82%
  const r23Pct = 40 + 25; // R-2 + R-3 = 65%
  const curiosityStars = bcPct >= 80 ? 5 : bcPct >= 60 ? 4 : bcPct >= 40 ? 3 : bcPct >= 20 ? 2 : 1;
  const analysisStars = r23Pct >= 80 ? 5 : r23Pct >= 60 ? 4 : r23Pct >= 40 ? 3 : r23Pct >= 20 ? 2 : 1;

  return `
    <div class="tab-content animate-in">
      <div class="screen-header">
        <h1>📈 나의 성장</h1>
      </div>

      <!-- 성장 카드 스탯 (2축 기반) -->
      <div class="card stagger-1 animate-in">
        <div class="card-title">🃏 2축 성장 카드</div>
        <div class="growth-stats-2axis">
          <div class="growth-stat-box">
            <div class="growth-stat-header">
              <span class="growth-stat-icon">🪜</span>
              <span>탐구력</span>
            </div>
            <div class="growth-stat-stars">
              ${'★'.repeat(curiosityStars)}${'☆'.repeat(5-curiosityStars)}
            </div>
            <div class="growth-stat-detail">B+C 비율: ${bcPct}%</div>
            <div class="growth-stat-sub">호기심 사다리 분포</div>
          </div>
          <div class="growth-stat-box">
            <div class="growth-stat-header">
              <span class="growth-stat-icon">🪞</span>
              <span>분석력</span>
            </div>
            <div class="growth-stat-stars">
              ${'★'.repeat(analysisStars)}${'☆'.repeat(5-analysisStars)}
            </div>
            <div class="growth-stat-detail">R-2+R-3 비율: ${r23Pct}%</div>
            <div class="growth-stat-sub">성찰 질문 분포</div>
          </div>
        </div>
      </div>

      <!-- 축1: 호기심 사다리 분포 -->
      <div class="card stagger-2 animate-in">
        <div class="card-header-row">
          <span class="card-title">🪜 호기심 사다리 분포</span>
          <span class="card-subtitle">이번 달</span>
        </div>
        ${curiosityDist.map(q => `
          <div class="q-dist-row">
            <span class="q-dist-label">${q.label}</span>
            <div class="q-dist-bar"><div class="q-dist-fill" style="width:${q.pct}%;background:${q.color}"></div></div>
            <span class="q-dist-pct">${q.pct}%</span>
          </div>
        `).join('')}
        <div class="success-badge">B+C 비율: ${bcPct}% 🎯 (목표 40% 달성!)</div>
      </div>

      <!-- 축2: 성찰 질문 분포 -->
      <div class="card stagger-3 animate-in">
        <div class="card-header-row">
          <span class="card-title">🪞 성찰 질문 분포</span>
          <span class="card-subtitle">이번 달</span>
        </div>
        ${reflectionDist.map(q => `
          <div class="q-dist-row">
            <span class="q-dist-label">${q.label}</span>
            <div class="q-dist-bar"><div class="q-dist-fill" style="width:${q.pct}%;background:${q.color}"></div></div>
            <span class="q-dist-pct">${q.pct}%</span>
          </div>
        `).join('')}
        <div class="success-badge" style="background:rgba(192,68,204,0.12);color:#C044CC">R-2+R-3 비율: ${r23Pct}% 🎯</div>
      </div>

      <!-- 질문 진화 콤보 (2축 기반) -->
      <div class="card stagger-4 animate-in">
        <div class="card-title">🏆 질문 진화 콤보</div>
        <div class="combo-card">
          <div class="combo-header">
            <span>수학 "치환적분" — 사고의 심연 돌파! 🎉</span>
            <span class="combo-complete">+50 XP</span>
          </div>
          <div class="combo-flow">
            <span class="q-level q-level-a">A-2 어떻게?</span>
            <i class="fas fa-arrow-right combo-arrow"></i>
            <span class="q-level q-level-b">B-1 왜?</span>
            <i class="fas fa-arrow-right combo-arrow"></i>
            <span class="q-level q-level-c">C-1 뭐가 더 나아?</span>
            <span class="combo-bonus">🏆 레어 뱃지!</span>
          </div>
        </div>
        <div class="combo-card" style="margin-top:8px;border-color:rgba(192,68,204,0.3)">
          <div class="combo-header">
            <span>영어 "관계대명사" — 완벽한 성찰! 🪞</span>
            <span class="combo-complete" style="color:#C044CC">+40 XP</span>
          </div>
          <div class="combo-flow">
            <span class="q-level" style="background:rgba(224,86,160,0.15);color:#E056A0">R-1</span>
            <i class="fas fa-arrow-right combo-arrow"></i>
            <span class="q-level" style="background:rgba(192,68,204,0.15);color:#C044CC">R-2</span>
            <i class="fas fa-arrow-right combo-arrow"></i>
            <span class="q-level" style="background:rgba(155,89,182,0.15);color:#9B59B6">R-3</span>
            <span class="combo-bonus">🔍 분석력 뱃지!</span>
          </div>
        </div>
        <div class="combo-card" style="margin-top:8px;border-color:rgba(253,203,110,0.3)">
          <div class="combo-header">
            <span>과학 "산화환원" — 진행 중...</span>
            <span class="combo-progress">B-1까지</span>
          </div>
          <div class="combo-flow">
            <span class="q-level q-level-a">A-1</span>
            <i class="fas fa-arrow-right combo-arrow"></i>
            <span class="q-level q-level-b">B-1</span>
            <i class="fas fa-arrow-right combo-arrow"></i>
            <span class="combo-next">다음: B-2+ 도전!</span>
          </div>
        </div>
      </div>

      <!-- 효과 측정 지표 -->
      <div class="card stagger-5 animate-in">
        <div class="card-title">📊 핵심 효과 지표</div>
        <div class="kpi-grid">
          <div class="kpi-item">
            <span class="kpi-value" style="color:var(--question-c)">${bcPct}%</span>
            <span class="kpi-label">B+C 질문 비율</span>
            <span class="kpi-target">목표 40%</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-value" style="color:var(--primary-light)">68%</span>
            <span class="kpi-label">자기 생각 동반률</span>
            <span class="kpi-target">목표 60%</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-value" style="color:var(--accent)">54%</span>
            <span class="kpi-label">도전 선택률</span>
            <span class="kpi-target">목표 50%</span>
          </div>
          <div class="kpi-item">
            <span class="kpi-value" style="color:var(--teach-green)">45%</span>
            <span class="kpi-label">자발적 B+ 비율</span>
            <span class="kpi-target">목표 40%</span>
          </div>
        </div>
      </div>

      <div class="card stagger-6 animate-in">
        <div class="card-title">🤝 교학상장 통계</div>
        <div class="teach-stat-grid">
          <div class="teach-stat-item">
            <span class="teach-stat-num" style="color:var(--teach-green)">12</span>
            <span>이번 달 가르침</span>
          </div>
          <div class="teach-stat-item">
            <span class="teach-stat-num" style="color:var(--primary-light)">7</span>
            <span>도움 준 친구</span>
          </div>
        </div>
        <p style="font-size:12px;color:var(--text-secondary);margin-top:8px">주로 가르치는 과목: 수학(8), 과학(4)</p>
      </div>

      <div class="card stagger-7 animate-in">
        <div class="card-title">📚 과목별 기록 현황</div>
        ${[
          {subject:'수학', records:32, questions:15, bc:'72%', color:'#6C5CE7'},
          {subject:'영어', records:28, questions:8, bc:'48%', color:'#00B894'},
          {subject:'과학', records:24, questions:10, bc:'60%', color:'#FDCB6E'},
          {subject:'국어', records:26, questions:6, bc:'42%', color:'#FF6B6B'},
          {subject:'한국사', records:20, questions:3, bc:'20%', color:'#74B9FF'},
        ].map(s => `
          <div class="subject-record-row">
            <div class="subject-dot" style="background:${s.color}"></div>
            <span class="subject-name">${s.subject}</span>
            <span class="subject-stat">기록 ${s.records}</span>
            <span class="subject-stat">질문 ${s.questions}</span>
            <span class="subject-bc">B+C ${s.bc}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==================== MY TAB (M-01~M-05) ====================

function renderMyTab() {
  return `
    <div class="tab-content animate-in">
      <div class="screen-header">
        <h1>🎮 마이</h1>
      </div>

      <div class="card profile-card stagger-1 animate-in">
        <div class="profile-avatar">
          <span>🎓</span>
        </div>
        <h2 class="profile-name">김민준</h2>
        <p class="profile-title">Lv.${state.level} 깊이 파고드는 연구자</p>
        <p class="profile-school">정율고등학교 2학년 3반 · 공학 계열</p>
        <div class="profile-stats">
          <div class="profile-stat">
            <span class="profile-stat-value" style="color:var(--xp-gold)">${state.xp.toLocaleString()}</span>
            <span class="profile-stat-label">총 XP</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat-value" style="color:var(--streak-fire)">🔥${state.streak}</span>
            <span class="profile-stat-label">스트릭</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat-value">287</span>
            <span class="profile-stat-label">총 기록</span>
          </div>
        </div>
      </div>

      <div class="card stagger-2 animate-in">
        <div class="card-title">🏅 레벨 진행</div>
        <div class="level-progress-header">
          <span>Lv.12 연구자</span>
          <span style="color:var(--text-muted)">Lv.13까지 260 XP</span>
        </div>
        <div class="progress-bar" style="height:12px;border-radius:6px">
          <div class="progress-fill level-fill" style="width:83%"></div>
        </div>
        <div class="level-tier-row">
          ${[
            {range:'1-5', name:'탐험가'},
            {range:'6-10', name:'학습자'},
            {range:'11-15', name:'연구자', active:true},
            {range:'16-20', name:'멘토'},
            {range:'21-25', name:'설계자'},
            {range:'26-30', name:'개척자'},
          ].map(t => `
            <span class="level-tier ${t.active?'active':''}">${t.name}</span>
          `).join('')}
        </div>
      </div>

      <div class="card stagger-3 animate-in">
        <div class="card-header-row">
          <span class="card-title">🏆 업적 뱃지</span>
          <span class="card-subtitle">5/9 획득</span>
        </div>
        <div class="badge-grid">
          ${[
            {icon:'❓', name:'첫 질문', earned:true},
            {icon:'🔥', name:'7일 스트릭', earned:true},
            {icon:'🤝', name:'첫 번째 스승', earned:true},
            {icon:'🏆', name:'사고의 심연 돌파', earned:true, desc:'A→B→C 완주'},
            {icon:'🔍', name:'완벽한 성찰', earned:true, desc:'R-1→R-2→R-3'},
            {icon:'🌟', name:'완전한 사고자', earned:false, desc:'C-2 + R-3'},
            {icon:'⏰', name:'10시간 나눔', earned:false},
            {icon:'🔒', name:'30일 스트릭', earned:false, locked:true},
            {icon:'🔒', name:'질문 마스터', earned:false, locked:true, desc:'B+ 100개'},
          ].map(b => `
            <div class="badge-item ${b.earned?'earned':''} ${b.locked?'locked':''}">
              <span class="badge-icon">${b.icon}</span>
              <span class="badge-name">${b.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card stagger-4 animate-in">
        <div class="card-title">🔥 스트릭 현황</div>
        <div class="streak-display">
          <span class="streak-number">🔥 ${state.streak}일</span>
          <p>연속 기록 중! 대단해요!</p>
        </div>
        <div class="streak-milestones">
          ${[3,7,14,30].map(d => `
            <div class="streak-milestone ${state.streak>=d?'reached':''}">
              ${d}일 ${state.streak>=d?'✅':'🔒'}
            </div>
          `).join('')}
        </div>
        <div class="pause-card-info">
          😴 쉼표 카드 (주 1회) — 하루 쉬어도 스트릭 유지!
        </div>
      </div>

      <!-- 시간표 관리 메뉴 -->
      <div class="card stagger-5 animate-in">
        <div class="card-title">⚙️ 관리</div>
        <div class="my-menu-list">
          <div class="my-menu-item" onclick="goScreen('timetable-manage')">
            <div class="my-menu-icon" style="background:rgba(108,92,231,0.15)"><i class="fas fa-calendar-alt" style="color:var(--primary-light)"></i></div>
            <div class="my-menu-text">
              <span class="my-menu-title">📋 시간표 관리</span>
              <span class="my-menu-desc">학교 시간표 수정 & 학원 스케줄 관리</span>
            </div>
            <i class="fas fa-chevron-right" style="color:var(--text-muted)"></i>
          </div>
          <div class="my-menu-item" onclick="goScreen('assignment-list')">
            <div class="my-menu-icon" style="background:rgba(255,159,67,0.15)"><i class="fas fa-clipboard-list" style="color:#FF9F43"></i></div>
            <div class="my-menu-text">
              <span class="my-menu-title">📋 과제 관리</span>
              <span class="my-menu-desc">진행중 ${state.assignments.filter(a=>a.status!=='completed').length}개</span>
            </div>
            <i class="fas fa-chevron-right" style="color:var(--text-muted)"></i>
          </div>
        </div>
      </div>

      <div class="card stagger-6 animate-in">
        <div class="card-title">🃏 성장 카드</div>
        <div class="growth-card-preview">
          ${[
            {label:'탐구력 (B+C)', pct:82, color:'var(--question-c)'},
            {label:'분석력 (R-2+3)', pct:65, color:'#C044CC'},
            {label:'리더십', pct:82, color:'var(--teach-green)'},
            {label:'지구력', pct:90, color:'var(--streak-fire)'},
            {label:'자기생각률', pct:68, color:'var(--primary-light)'},
          ].map(s => `
            <div class="gc-stat">
              <span class="gc-label">${s.label}</span>
              <div class="gc-bar"><div class="gc-fill" style="width:${s.pct}%;background:${s.color}"></div></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ==================== TIMETABLE MANAGEMENT ====================

function renderTimetableManage() {
  const days = ['월','화','수','목','금'];
  const acDays = ['월','화','수','목','금','토','일'];
  const tt = state.timetable;
  const subjectList = ['국어','수학','영어','과학','한국사','체육','미술','동아리','창체',''];
  const maxSlots = 4;

  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="state.editingTimetable=false;state.selectedTtCell=null;state.selectedAcSlot=null;state.viewingAcademyDetail=null;goScreen('main');state.studentTab='my'"><i class="fas fa-arrow-left"></i></button>
        <h1>📋 시간표 관리</h1>
        <button class="header-action-btn" onclick="state.editingTimetable=!state.editingTimetable;state.selectedTtCell=null;state.selectedAcSlot=null;renderScreen()">
          <i class="fas ${state.editingTimetable ? 'fa-check' : 'fa-edit'}"></i>
          ${state.editingTimetable ? '완료' : '편집'}
        </button>
      </div>

      <div class="form-body">
        <!-- 학교 시간표 섹션 -->
        <div class="card animate-in" style="margin-bottom:16px">
          <div class="card-header-row">
            <span class="card-title">🏫 학교 시간표</span>
            ${state.editingTimetable ? '<span class="card-subtitle" style="color:var(--primary-light)">셀을 터치하여 수정</span>' : ''}
          </div>
          <div class="tt-editor">
            <div class="tt-editor-header"></div>
            ${days.map(d => `<div class="tt-editor-header">${d}</div>`).join('')}
            ${tt.school.map((row, pi) => `
              <div class="tt-editor-period">${pi+1}</div>
              ${row.map((s, di) => {
                const color = tt.subjectColors[s] || 'var(--text-muted)';
                const isSelected = state.selectedTtCell && state.selectedTtCell.period === pi && state.selectedTtCell.dayIdx === di;
                return `
                <div class="tt-editor-cell ${s?'filled':''} ${isSelected?'selected':''} ${state.editingTimetable?'editable':''}" 
                  ${s?`style="background:${color}22;color:${color};border-color:${color}44"`:''}
                  ${state.editingTimetable ? `onclick="selectTtCell(${pi},${di})"` : ''}>
                  ${s||'<i class="fas fa-plus" style="font-size:9px;opacity:0.3"></i>'}
                </div>`;
              }).join('')}
            `).join('')}
          </div>

          ${state.editingTimetable && state.selectedTtCell !== null ? `
          <div class="tt-edit-panel animate-in" style="margin-top:12px">
            <label class="field-label">과목 선택 (${state.selectedTtCell.period+1}교시 ${days[state.selectedTtCell.dayIdx]}요일)</label>
            <div class="tt-subject-selector">
              ${subjectList.map(s => {
                const color = tt.subjectColors[s] || 'var(--text-muted)';
                const current = tt.school[state.selectedTtCell.period][state.selectedTtCell.dayIdx];
                return `<button class="tt-subj-btn ${current===s?'active':''}" 
                  style="${s?`border-color:${color}44;color:${color}`:'color:var(--text-muted)'}" 
                  onclick="setTtSubject('${s}')">
                  ${s || '비움'}
                </button>`;
              }).join('')}
            </div>
            <div class="field-group" style="margin-top:8px">
              <label class="field-label">👨‍🏫 담당 선생님</label>
              <input class="input-field" id="tt-teacher-input" 
                placeholder="선생님 이름" 
                value="${tt.teachers[tt.school[state.selectedTtCell.period][state.selectedTtCell.dayIdx]] || ''}"
                onchange="setTtTeacher(this.value)">
            </div>
          </div>
          ` : ''}
        </div>

        <!-- 학원 시간표 그리드 섹션 -->
        <div class="card animate-in" style="margin-bottom:16px">
          <div class="card-header-row">
            <span class="card-title">🏢 학원 시간표</span>
            ${state.editingTimetable ? '<span class="card-subtitle" style="color:#E056A0">빈 칸을 터치하여 추가</span>' : '<span class="card-subtitle">클릭하여 상세보기</span>'}
          </div>
          <div class="ac-grid">
            <!-- 헤더 -->
            <div class="ac-grid-header"></div>
            ${acDays.map(d => `<div class="ac-grid-header ${d==='토'||d==='일'?'weekend':''}">${d}</div>`).join('')}
            <!-- 슬롯 rows -->
            ${Array.from({length: maxSlots}, (_, slotIdx) => `
              <div class="ac-grid-period">${slotIdx+1}</div>
              ${acDays.map(day => {
                const ac = tt.academy.find(a => a.day === day && a.slot === slotIdx + 1);
                const isSelected = state.selectedAcSlot && state.selectedAcSlot.day === day && state.selectedAcSlot.slot === slotIdx + 1;
                if (ac) {
                  return `
                  <div class="ac-grid-cell filled ${isSelected?'selected':''}" 
                    style="background:${ac.color}18;border-color:${ac.color}44"
                    onclick="${state.editingTimetable 
                      ? `state.editingAcademy='${ac.id}';goScreen('academy-add')` 
                      : `showAcademyDetail('${ac.id}')`}">
                    <div class="ac-cell-name" style="color:${ac.color}">${ac.name}</div>
                    <div class="ac-cell-time-ribbon" style="background:${ac.color}">${ac.startTime}~${ac.endTime}</div>
                  </div>`;
                } else {
                  return `
                  <div class="ac-grid-cell empty ${isSelected?'selected':''} ${state.editingTimetable?'editable':''}"
                    ${state.editingTimetable ? `onclick="addAcademyAtSlot('${day}',${slotIdx+1})"` : ''}>
                    ${state.editingTimetable ? '<i class="fas fa-plus" style="font-size:9px;opacity:0.3"></i>' : ''}
                  </div>`;
                }
              }).join('')}
            `).join('')}
          </div>
        </div>

        <!-- 학원 상세보기 패널 -->
        ${state.viewingAcademyDetail ? renderAcademyDetailPanel() : ''}

        <!-- 플래너 연동 안내 -->
        <div class="ai-plan-card animate-in">
          <div class="ai-header">
            <span class="ai-icon">🤖</span>
            <span class="ai-title">AI 자동 연동</span>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-top:8px">
            시간표와 학원 스케줄을 수정하면 <strong style="color:var(--primary-light)">플래너에 자동 반영</strong>됩니다. 
            AI가 학교 수업, 학원, 과제를 종합 분석하여 최적의 학습 계획을 제안해요! 📅
          </p>
        </div>
      </div>
    </div>
  `;
}

// 학원 상세보기 패널
function renderAcademyDetailPanel() {
  const ac = state.timetable.academy.find(a => a.id === state.viewingAcademyDetail);
  if (!ac) return '';

  return `
    <div class="ac-detail-panel animate-in" style="border-left:4px solid ${ac.color}">
      <div class="ac-detail-header">
        <div class="ac-detail-title-row">
          <span class="ac-detail-title" style="color:${ac.color}">${ac.name}</span>
          <button class="ac-detail-close" onclick="state.viewingAcademyDetail=null;renderScreen()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="ac-detail-subtitle">${ac.academy}</div>
      </div>
      <div class="ac-detail-body">
        <div class="ac-detail-row">
          <span class="ac-detail-icon">📅</span>
          <span class="ac-detail-label">요일</span>
          <span class="ac-detail-value">${ac.day}요일</span>
        </div>
        <div class="ac-detail-row">
          <span class="ac-detail-icon">⏰</span>
          <span class="ac-detail-label">시간</span>
          <span class="ac-detail-value">${ac.startTime} ~ ${ac.endTime}</span>
        </div>
        <div class="ac-detail-row">
          <span class="ac-detail-icon">📚</span>
          <span class="ac-detail-label">관련 과목</span>
          <span class="ac-detail-value">${ac.subject}</span>
        </div>
        ${ac.memo ? `
        <div class="ac-detail-row">
          <span class="ac-detail-icon">📝</span>
          <span class="ac-detail-label">메모</span>
          <span class="ac-detail-value">${ac.memo}</span>
        </div>
        ` : ''}
      </div>
      <div class="ac-detail-actions">
        <button class="btn-secondary" style="flex:1" onclick="state.editingAcademy='${ac.id}';state.viewingAcademyDetail=null;goScreen('academy-add')">
          <i class="fas fa-edit"></i> 수정
        </button>
        <button class="btn-ghost" style="flex:1;color:var(--accent)" onclick="deleteAcademy('${ac.id}');state.viewingAcademyDetail=null;renderScreen()">
          <i class="fas fa-trash"></i> 삭제
        </button>
      </div>
    </div>
  `;
}

function showAcademyDetail(id) {
  state.viewingAcademyDetail = state.viewingAcademyDetail === id ? null : id;
  renderScreen();
}

function addAcademyAtSlot(day, slot) {
  state.editingAcademy = null;
  state._prefillDay = day;
  state._prefillSlot = slot;
  goScreen('academy-add');
}

// 학원 추가/수정 화면
function renderAcademyAdd() {
  const editing = state.editingAcademy;
  const isEdit = editing !== null;
  const ac = isEdit ? state.timetable.academy.find(a => a.id === editing) : null;
  const prefillDay = state._prefillDay || '월';
  const prefillSlot = state._prefillSlot || 1;

  return `
    <div class="full-screen animate-slide">
      <div class="screen-header">
        <button class="back-btn" onclick="state.editingAcademy=null;state._prefillDay=null;state._prefillSlot=null;goScreen('timetable-manage')"><i class="fas fa-arrow-left"></i></button>
        <h1>${isEdit ? '🏢 학원 수정' : '🏢 학원 추가'}</h1>
      </div>

      <div class="form-body">
        <div class="academy-add-intro animate-in">
          <span style="font-size:32px">🏢</span>
          <div>
            <h3>${isEdit ? '학원 정보를 수정하세요' : '학원 일정을 등록하세요'}</h3>
            <p>등록한 학원 일정은 시간표와 플래너에 자동 표시됩니다</p>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">📝 수업명</label>
          <input class="input-field" id="ac-name" placeholder="예: 수학 심화반" value="${isEdit ? ac.name : ''}">
        </div>

        <div class="field-group">
          <label class="field-label">🏢 학원명</label>
          <input class="input-field" id="ac-academy" placeholder="예: 대치 수학학원" value="${isEdit ? ac.academy : ''}">
        </div>

        <div class="field-group">
          <label class="field-label">📚 관련 과목</label>
          <div class="chip-row" id="ac-subject-chips">
            ${['수학','영어','국어','과학','사회','기타'].map(s => 
              `<button class="chip ${(isEdit && ac.subject===s) || (!isEdit && s==='수학') ? 'active' : ''}" data-subject="${s}">${s}</button>`
            ).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">📅 요일</label>
          <div class="chip-row" id="ac-day-chips">
            ${['월','화','수','목','금','토','일'].map(d => 
              `<button class="chip ${(isEdit && ac.day===d) || (!isEdit && d===prefillDay) ? 'active' : ''}" data-day="${d}">${d}</button>`
            ).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">🔢 슬롯 (시간표 칸 위치)</label>
          <div class="chip-row" id="ac-slot-chips">
            ${[1,2,3,4].map(s => 
              `<button class="chip ${(isEdit && ac.slot===s) || (!isEdit && s===prefillSlot) ? 'active' : ''}" data-slot="${s}">${s}번째</button>`
            ).join('')}
          </div>
        </div>

        <div style="display:flex;gap:8px">
          <div class="field-group" style="flex:1">
            <label class="field-label">⏰ 시작 시간</label>
            <input class="input-field" type="time" id="ac-start" value="${isEdit ? ac.startTime : '18:00'}" style="color:var(--text-primary)">
          </div>
          <div class="field-group" style="flex:1">
            <label class="field-label">⏰ 종료 시간</label>
            <input class="input-field" type="time" id="ac-end" value="${isEdit ? ac.endTime : '20:00'}" style="color:var(--text-primary)">
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">🎨 색상</label>
          <div class="color-picker-row" id="ac-color-picker">
            ${['#E056A0','#6C5CE7','#00B894','#FDCB6E','#FF6B6B','#74B9FF','#00CEC9','#FF9F43'].map(c => 
              `<button class="color-pick-btn ${(isEdit && ac.color===c) || (!isEdit && c==='#E056A0') ? 'active' : ''}" 
                data-color="${c}" style="background:${c}" onclick="selectAcColor('${c}')"></button>`
            ).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">📝 메모 <span class="field-hint">(선택)</span></label>
          <textarea class="input-field" id="ac-memo" rows="2" placeholder="학원 수업 관련 메모">${isEdit ? (ac.memo || '') : ''}</textarea>
        </div>

        <!-- AI 제안 -->
        <div class="ai-plan-card animate-in">
          <div class="ai-header">
            <span class="ai-icon">🤖</span>
            <span class="ai-title">AI 시간 분석</span>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-top:8px">
            학원 일정을 등록하면 AI가 <strong style="color:var(--primary-light)">학교 수업 → 학원 → 자습</strong> 패턴을 분석하고,
            비는 시간에 과제나 복습을 배치해줘요! 📊
          </p>
        </div>

        <button class="btn-primary" onclick="saveAcademy()">
          ${isEdit ? '학원 수정 완료' : '학원 추가 완료'} ✨
        </button>
        ${isEdit ? `<button class="btn-ghost" style="width:100%;margin-top:8px;color:var(--accent)" onclick="deleteAcademy('${ac.id}');goScreen('timetable-manage')">삭제</button>` : ''}
      </div>
    </div>
  `;
}

// 시간표 관리 유틸리티
function selectTtCell(period, dayIdx) {
  if (state.selectedTtCell && state.selectedTtCell.period === period && state.selectedTtCell.dayIdx === dayIdx) {
    state.selectedTtCell = null;
  } else {
    state.selectedTtCell = { period, dayIdx };
  }
  renderScreen();
}

function setTtSubject(subject) {
  if (!state.selectedTtCell) return;
  const {period, dayIdx} = state.selectedTtCell;
  state.timetable.school[period][dayIdx] = subject;
  // todayRecords도 동기화 (오늘이 해당 요일이면)
  syncTodayRecords();
  renderScreen();
}

function setTtTeacher(name) {
  if (!state.selectedTtCell) return;
  const {period, dayIdx} = state.selectedTtCell;
  const subject = state.timetable.school[period][dayIdx];
  if (subject) {
    state.timetable.teachers[subject] = name;
    syncTodayRecords();
  }
}

function syncTodayRecords() {
  // 오늘 요일 인덱스 (월=0, 화=1, ..., 금=4)
  const today = new Date();
  const jsDay = today.getDay(); // 0=일, 1=월 ... 6=토
  const dayIdx = jsDay === 0 ? -1 : jsDay - 1; // 월~금만
  if (dayIdx < 0 || dayIdx > 4) return; // 주말이면 무시

  const tt = state.timetable;
  const newRecords = [];
  for (let pi = 0; pi < tt.school.length; pi++) {
    const subject = tt.school[pi][dayIdx];
    if (!subject) continue;
    const existing = state.todayRecords.find(r => r.period === pi + 1);
    newRecords.push({
      period: pi + 1,
      subject: subject,
      teacher: tt.teachers[subject] || '',
      done: existing ? existing.done : false,
      question: existing ? existing.question : null,
      summary: existing ? existing.summary : '',
      color: tt.subjectColors[subject] || '#636e72',
    });
  }
  if (newRecords.length > 0) {
    state.todayRecords = newRecords;
  }
}

function saveAcademy() {
  const name = document.getElementById('ac-name')?.value || '';
  const academy = document.getElementById('ac-academy')?.value || '';
  const subjectChip = document.querySelector('#ac-subject-chips .chip.active');
  const dayChip = document.querySelector('#ac-day-chips .chip.active');
  const slotChip = document.querySelector('#ac-slot-chips .chip.active');
  const startTime = document.getElementById('ac-start')?.value || '18:00';
  const endTime = document.getElementById('ac-end')?.value || '20:00';
  const colorBtn = document.querySelector('#ac-color-picker .color-pick-btn.active');
  const memo = document.getElementById('ac-memo')?.value || '';
  const subject = subjectChip ? subjectChip.dataset.subject : '수학';
  const day = dayChip ? dayChip.dataset.day : '월';
  const slot = slotChip ? parseInt(slotChip.dataset.slot) : 1;
  const color = colorBtn ? colorBtn.dataset.color : '#E056A0';

  if (state.editingAcademy) {
    const ac = state.timetable.academy.find(a => a.id === state.editingAcademy);
    if (ac) {
      ac.name = name || ac.name;
      ac.academy = academy || ac.academy;
      ac.subject = subject;
      ac.day = day;
      ac.slot = slot;
      ac.startTime = startTime;
      ac.endTime = endTime;
      ac.color = color;
      ac.memo = memo;
    }
    state.editingAcademy = null;
  } else {
    const newId = 'ac' + (Date.now() % 100000);
    state.timetable.academy.push({
      id: newId, name: name || '학원 수업', academy: academy || '',
      day, slot, startTime, endTime, color, subject, memo
    });
  }

  state._prefillDay = null;
  state._prefillSlot = null;

  // 플래너에 학원 일정 자동 추가
  syncAcademyToPlanner();
  showXpPopup(5, '학원 일정이 저장되었어요!');
}

function deleteAcademy(id) {
  state.timetable.academy = state.timetable.academy.filter(a => a.id !== id);
  // 플래너에서도 해당 학원 일정 제거
  state.plannerItems = state.plannerItems.filter(p => p.academyId !== id);
  renderScreen();
}

function selectAcColor(color) {
  document.querySelectorAll('#ac-color-picker .color-pick-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`#ac-color-picker .color-pick-btn[data-color="${color}"]`);
  if (btn) btn.classList.add('active');
}

function syncAcademyToPlanner() {
  // 학원 일정을 플래너에 반영 (향후 2주)
  const dayMap = {'일':0,'월':1,'화':2,'수':3,'목':4,'금':5,'토':6};
  const today = new Date();
  
  // 기존 학원 일정 제거
  state.plannerItems = state.plannerItems.filter(p => p.category !== 'academy');
  
  state.timetable.academy.forEach(ac => {
    const targetDay = dayMap[ac.day];
    if (targetDay === undefined) return;
    
    // 향후 14일 내에서 해당 요일 찾기
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === targetDay) {
        const dateStr = d.toISOString().split('T')[0];
        state.plannerItems.push({
          id: `pac_${ac.id}_${dateStr}`,
          date: dateStr,
          time: ac.startTime,
          endTime: ac.endTime,
          title: `🏢 ${ac.name}`,
          category: 'academy',
          color: ac.color,
          icon: '🏢',
          done: false,
          aiGenerated: false,
          detail: `${ac.academy} · ${ac.subject}`,
          academyId: ac.id,
        });
      }
    }
  });
}

// 앱 시작 시 학원 플래너 동기화
function initAcademySync() {
  syncAcademyToPlanner();
}

// ==================== MENTOR DASHBOARD ====================

function renderMentorDashboard() {
  return `
    <div class="desk-header">
      <div>
        <h1>🏫 학점플래너 <span style="color:var(--primary-light)">멘토</span></h1>
        <p style="font-size:13px;color:var(--text-secondary);margin-top:4px">박진수 멘토 | 담당 학생 20명</p>
      </div>
      <div class="desk-header-right">
        <span style="font-size:13px;color:var(--text-muted)">2025-02-15</span>
      </div>
    </div>
    <div class="desk-tabs">
      ${['students:📋 내 학생','alerts:🚨 경보(3)','reports:📊 리포트','coaching:📝 코칭노트','network:🤝 교학상장'].map(t => {
        const [id, label] = t.split(':');
        return `<button class="desk-tab ${state.mentorTab===id?'active':''}" data-mtab="${id}">${label}</button>`;
      }).join('')}
    </div>
    <div class="desk-body">${renderMentorTabContent()}</div>
  `;
}

function renderMentorTabContent() {
  switch(state.mentorTab) {
    case 'students': return renderMentorStudents();
    case 'alerts': return renderMentorAlerts();
    case 'reports': return renderMentorReports();
    case 'coaching': return renderMentorCoaching();
    case 'network': return renderMentorNetwork();
  }
}

function renderMentorStudents() {
  return `
    <div class="stats-row">
      <div class="stat-card"><div class="stat-label">오늘 기록률</div><div class="stat-value">85%</div><div class="stat-change stat-up">↑ 3%</div></div>
      <div class="stat-card"><div class="stat-label">주간 질문</div><div class="stat-value">67</div><div class="stat-change stat-up">↑ 12%</div></div>
      <div class="stat-card"><div class="stat-label">B+C 비율</div><div class="stat-value">52%</div><div class="stat-change stat-up">↑ 5%</div></div>
      <div class="stat-card"><div class="stat-label">교학상장</div><div class="stat-value">8회</div><div class="stat-change stat-up">↑ 23%</div></div>
    </div>
    <table class="student-table">
      <thead><tr><th>학생</th><th>학년</th><th>오늘</th><th>질문수준</th><th>교학상장</th><th>스트릭</th><th>상태</th></tr></thead>
      <tbody>
        ${state.students.map(s => `
          <tr onclick="state.selectedStudent='${s.name}';state.mentorTab='coaching';renderScreen()">
            <td style="font-weight:600">${s.name}</td><td>${s.grade}</td><td>${s.today}</td>
            <td><span style="color:${s.qLevel.includes('↑')?'var(--success)':s.qLevel.includes('↓')?'var(--danger)':'var(--text-secondary)'}">${s.qLevel}</span></td>
            <td>${s.teach}회</td><td>${s.streak>0?'🔥'+s.streak+'일':'-'}</td>
            <td><span class="status-dot status-${s.status}"></span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top:12px;display:flex;gap:12px;font-size:12px;color:var(--text-muted)">
      <span><span class="status-dot status-green" style="vertical-align:middle"></span> 양호 6명</span>
      <span><span class="status-dot status-yellow" style="vertical-align:middle"></span> 주의 2명</span>
      <span><span class="status-dot status-red" style="vertical-align:middle"></span> 경보 2명</span>
    </div>
  `;
}

function renderMentorAlerts() {
  return `
    <h3 style="margin-bottom:16px">🚨 주의가 필요한 학생</h3>
    <div class="alert-banner alert-red"><span>🔴</span> <strong>정하은</strong> — 3일 연속 미기록. 스트릭 0일. 상담 필요.</div>
    <div class="alert-banner alert-red"><span>🔴</span> <strong>한도윤</strong> — 3일 연속 미기록. 무드 2일 연속 😔.</div>
    <div class="alert-banner alert-yellow"><span>🟡</span> <strong>최윤서</strong> — 질문 수준 하락 추세 (B→A, 2주). 코칭 필요.</div>
    <div class="alert-banner alert-green" style="margin-top:20px"><span>✅</span> <strong>강예린</strong> — 질문 진화 콤보 달성! C-1 도달.</div>
    <div class="alert-banner alert-green"><span>✅</span> <strong>김민준</strong> — 수학 교학상장 허브 역할. 세특 활용 가능.</div>
  `;
}

function renderMentorReports() {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h3>📊 주간 리포트 관리</h3>
      <span style="font-size:13px;color:var(--text-muted)">2월 2주차 (2/10~2/15)</span>
    </div>
    <div class="report-preview">
      <div class="report-section"><div class="report-section-title">📝 이번 주 기록 현황</div><p>수업 기록: 28/30 (93%) | 질문: 8개 (A:2, B:4, C:2) | 교학상장: 2회</p></div>
      <div class="report-section"><div class="report-section-title">📈 질문 성장 포인트</div><p>"영어에서 B-1 질문 처음 등장. 관계대명사의 역사적 이유를 묻는 것은 원리 탐구의 시작."</p></div>
      <div class="report-section"><div class="report-section-title">🤝 교학상장 활동</div><p>"치환적분을 역함수 관점으로 설명하며 자신의 이해 빈틈도 발견."</p></div>
      <div class="report-section"><div class="report-section-title">🎯 코칭 방향</div><p>"수학 질문이 C단계 도달, 탐구 보고서 주제로 연결 제안 예정."</p></div>
      <div style="text-align:right;margin-top:12px"><button class="btn-secondary" style="margin-right:8px">수정</button><button class="btn-primary" style="width:auto;padding:10px 20px">발송</button></div>
    </div>
  `;
}

function renderMentorCoaching() {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h3>📝 코칭 노트 — 김민준</h3>
      <button class="btn-primary" style="width:auto;padding:8px 16px;font-size:13px">+ 새 노트</button>
    </div>
    <div class="coaching-note">
      <div class="coaching-note-date">📝 2025-02-15 (오늘)</div>
      <div class="coaching-note-content">수학 질문 C-1 도달. 치환적분 A-2→B-3→C-1 진화. 탐구 보고서 주제 연결 가능.</div>
      <div class="action-list">
        <div class="action-item"><span>☐</span> 탐구 주제 "적분 기법 선택의 알고리즘화" 제안</div>
        <div class="action-item"><span>☐</span> 영어 질문 B→C 유도 (관계대명사 심화)</div>
      </div>
    </div>
    <div class="coaching-note">
      <div class="coaching-note-date">📝 2025-02-07</div>
      <div class="coaching-note-content">영어 A단계 질문만. "왜?" 유도 필요.</div>
      <div class="action-list">
        <div class="action-item"><span style="color:var(--success)">☑</span> 영어 "이 문법이 왜 존재하는지" 질문 유도</div>
        <div class="action-item" style="color:var(--success)">→ 결과: 2/14에 B-1 질문 성공! ✅</div>
      </div>
    </div>
  `;
}

function renderMentorNetwork() {
  return `
    <h3 style="margin-bottom:16px">🤝 내 학생 교학상장 네트워크</h3>
    <div class="network-placeholder"><i class="fas fa-project-diagram"></i><p>교학상장 네트워크 시각화</p>
      <div style="text-align:left;font-size:13px;color:var(--text-secondary);line-height:2">
        <strong style="color:var(--teach-green)">김민준</strong> → 이서연 (수학 치환적분)<br>
        <strong style="color:var(--teach-green)">김민준</strong> → 박지호 (수학 미분)<br>
        <strong style="color:var(--teach-green)">강예린</strong> → 송채원 (영어 문법)<br>
        <strong style="color:var(--teach-green)">강예린</strong> → 윤시우 (과학 산화환원)<br>
        <strong style="color:var(--teach-green)">임준혁</strong> → 한도윤 (수학 벡터)
      </div>
    </div>
    <div class="insight-box" style="margin-top:16px">
      <h4 style="margin-bottom:8px">💡 AI 인사이트</h4>
      <div class="insight-item"><span>•</span> 김민준: 수학 허브 (3명 가르침) → 깊이 이해 확인</div>
      <div class="insight-item"><span>•</span> 강예린: 다과목 멘토 → 폭넓은 이해력</div>
      <div class="insight-item"><span>•</span> 정하은: 배우기만 함 → 가르칠 과목 탐색 필요</div>
    </div>
  `;
}

// ==================== DIRECTOR DASHBOARD ====================

function renderDirectorDashboard() {
  return `
    <div class="desk-header">
      <div>
        <h1>🏢 학점플래너 <span style="color:var(--accent)">원장</span></h1>
        <p style="font-size:13px;color:var(--text-secondary);margin-top:4px">정율고교학점데이터센터 | 498/500명</p>
      </div>
      <div class="desk-header-right"><span style="font-size:13px;color:var(--text-muted)">2025-02-15</span></div>
    </div>
    <div class="desk-tabs">
      ${['overview:📊 전체현황','questions:📈 질문분석','network:🤝 교학상장','mentors:👨‍🏫 멘토관리'].map(t => {
        const [id, label] = t.split(':');
        return `<button class="desk-tab ${state.directorTab===id?'active':''}" data-dtab="${id}">${label}</button>`;
      }).join('')}
    </div>
    <div class="desk-body">${renderDirectorTabContent()}</div>
  `;
}

function renderDirectorTabContent() {
  switch(state.directorTab) {
    case 'overview': return renderDirOverview();
    case 'questions': return renderDirQuestions();
    case 'network': return renderDirNetwork();
    case 'mentors': return renderDirMentors();
  }
}

function renderDirOverview() {
  return `
    <div class="stats-row">
      <div class="stat-card"><div class="stat-label">오늘 기록률</div><div class="stat-value" style="color:var(--success)">82%</div><div class="stat-change stat-up">↑ 3%</div></div>
      <div class="stat-card"><div class="stat-label">주간 질문</div><div class="stat-value" style="color:var(--primary-light)">1,247</div><div class="stat-change stat-up">↑ 12%</div></div>
      <div class="stat-card"><div class="stat-label">B+C 비율</div><div class="stat-value" style="color:var(--question-b)">48%</div><div class="stat-change stat-up">↑ 5%</div></div>
      <div class="stat-card"><div class="stat-label">교학상장</div><div class="stat-value" style="color:var(--teach-green)">156</div><div class="stat-change stat-up">↑ 23%</div></div>
    </div>
    <h3 style="margin-bottom:12px">🚨 주요 경보</h3>
    <div class="alert-banner alert-red">🔴 3일+ 미기록: 12명 (고1:7, 고2:3, 고3:2)</div>
    <div class="alert-banner alert-yellow">🟡 질문 수준 하락: 5명 (2주 연속)</div>
    <div class="alert-banner alert-yellow">🟡 무드 저하: 3명 (3일 연속)</div>
    <div class="alert-banner alert-green">✅ 질문 콤보 달성: 8명</div>
  `;
}

function renderDirQuestions() {
  return `
    <h3 style="margin-bottom:16px">📈 학년별 질문 수준 분포</h3>
    <div class="dir-grid">
      ${[
        {grade:'고1 (180명)', data:[{l:'A',p:60},{l:'B',p:35},{l:'C',p:5}]},
        {grade:'고2 (200명)', data:[{l:'A',p:40},{l:'B',p:45},{l:'C',p:15}]},
      ].map(g => `
        <div class="stat-card"><h4 style="margin-bottom:12px">${g.grade}</h4>
          ${g.data.map(q => `<div class="q-dist-row"><span class="q-dist-label">${q.l}단계</span><div class="q-dist-bar"><div class="q-dist-fill" style="width:${q.p}%;background:var(--question-${q.l.toLowerCase()})"></div></div><span class="q-dist-pct">${q.p}%</span></div>`).join('')}
        </div>
      `).join('')}
      <div class="stat-card dir-full"><h4 style="margin-bottom:12px">고3 (120명)</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
          ${[{l:'A',p:25},{l:'B',p:50},{l:'C',p:25}].map(q => `<div class="q-dist-row"><span class="q-dist-label">${q.l}단계</span><div class="q-dist-bar"><div class="q-dist-fill" style="width:${q.p}%;background:var(--question-${q.l.toLowerCase()})"></div></div><span class="q-dist-pct">${q.p}%</span></div>`).join('')}
        </div>
        <p style="margin-top:12px;font-size:13px;color:var(--success)">→ 학년↑ 질문수준↑ 확인 ✅</p>
      </div>
    </div>
  `;
}

function renderDirNetwork() {
  return `
    <h3 style="margin-bottom:16px">🤝 전체 교학상장 네트워크</h3>
    <div class="network-placeholder" style="height:300px"><i class="fas fa-project-diagram" style="font-size:64px"></i><p style="font-size:16px">500명 교학상장 네트워크 맵</p></div>
    <div class="dir-grid" style="margin-top:20px">
      <div class="stat-card">
        <h4 style="margin-bottom:12px">🏆 Top 5 교학상장 허브</h4>
        ${['강예린 (영어4, 과학3)','김민준 (수학3, 과학2)','임준혁 (수학2, 영어1)','송채원 (국어3)','박지호 (과학2)']
          .map((s,i) => `<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><strong>${i+1}.</strong> ${s}</div>`).join('')}
      </div>
      <div class="insight-box">
        <h4 style="margin-bottom:8px">💡 AI 인사이트</h4>
        <div class="insight-item"><span>•</span> 수학 교학상장 42%로 가장 활발</div>
        <div class="insight-item"><span>•</span> 고1 참여율 = 고2의 1/3 → 캠페인 필요</div>
        <div class="insight-item"><span>•</span> 교학상장 활발 학생 B+C 비율 1.8배</div>
      </div>
    </div>
  `;
}

function renderDirMentors() {
  const mentors = [
    {name:'박진수',students:20,rate:85,qbc:52,teach:8,color:'green'},
    {name:'이수현',students:20,rate:91,qbc:58,teach:12,color:'green'},
    {name:'김태호',students:20,rate:78,qbc:41,teach:5,color:'yellow'},
    {name:'정미래',students:20,rate:88,qbc:55,teach:10,color:'green'},
    {name:'최다은',students:20,rate:72,qbc:38,teach:4,color:'yellow'},
  ];
  return `
    <h3 style="margin-bottom:16px">👨‍🏫 멘토별 관리 현황</h3>
    <table class="student-table">
      <thead><tr><th>멘토</th><th>담당</th><th>기록률</th><th>B+C</th><th>교학상장</th><th>상태</th></tr></thead>
      <tbody>${mentors.map(m => `
        <tr><td style="font-weight:600">${m.name}</td><td>${m.students}명</td>
        <td><span class="mentor-rate" style="background:${m.rate>=80?'rgba(0,184,148,0.15);color:var(--success)':'rgba(243,156,18,0.15);color:var(--warning)'}">${m.rate}%</span></td>
        <td>${m.qbc}%</td><td>${m.teach}회/주</td><td><span class="status-dot status-${m.color}"></span></td></tr>
      `).join('')}</tbody>
    </table>
  `;
}

// ==================== UTILITIES ====================

function goScreen(screen) {
  state.currentScreen = screen;
  renderScreen();
  // Scroll to top on screen change
  const appContent = document.getElementById('app-content');
  if (appContent) appContent.scrollTop = 0;
}

function completeClassRecord(idx) {
  if (idx >= 0 && idx < state.todayRecords.length) {
    state.todayRecords[idx].done = true;
    state.todayRecords[idx].summary = '관계대명사, which, that, 제한적용법';
    state.missions[0].current = state.todayRecords.filter(r => r.done).length;
    if (state.missions[0].current >= state.missions[0].target) state.missions[0].done = true;
  }
  showXpPopup(10, '수업 기록 완료!');
}

function showXpPopup(amount, label) {
  state.xp += amount;
  const overlay = document.createElement('div');
  overlay.className = 'xp-popup-overlay';
  const popup = document.createElement('div');
  popup.className = 'xp-popup';
  popup.innerHTML = `
    <div class="xp-popup-icon">✨</div>
    <div class="xp-popup-amount">+${amount} XP</div>
    <div class="xp-popup-label">${label}</div>
    <div style="margin-top:16px">
      <div style="font-size:12px;color:var(--text-muted)">Lv.${state.level} 연구자</div>
      <div class="progress-bar" style="width:200px;margin:8px auto 0;height:8px;border-radius:4px">
        <div class="progress-fill level-fill" style="width:${Math.min((state.xp/1500*100),100).toFixed(0)}%"></div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${state.xp.toLocaleString()}/1,500 XP</div>
    </div>
    <div style="margin-top:8px;font-size:14px;color:var(--streak-fire);font-weight:700">🔥 ${state.streak}일 스트릭</div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
  
  const close = () => {
    overlay.style.opacity = '0';
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%,-50%) scale(0.9)';
    setTimeout(() => {
      if (document.body.contains(overlay)) overlay.remove();
      if (document.body.contains(popup)) popup.remove();
      state.currentScreen='main'; renderScreen();
    }, 200);
  };
  overlay.addEventListener('click', close);
  setTimeout(close, 2500);
}

// ==================== EVENT HANDLERS ====================

function initStudentEvents() {
  // Bottom nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => { state.studentTab = btn.dataset.tab; state.currentScreen = 'main'; renderScreen(); });
  });

  // FAB
  const fab = document.getElementById('fab-btn');
  if (fab) fab.addEventListener('click', () => { state.studentTab = 'record'; state.currentScreen = 'main'; renderScreen(); });

  // Mood buttons
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mood = btn.dataset.mood;
    });
  });

  // Input mode switcher
  document.querySelectorAll('[data-input-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.inputMode = btn.dataset.inputMode;
      renderScreen();
    });
  });

  // Question level rows
  document.querySelectorAll('.q-level-row').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('.q-level-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
    });
  });

  // Career buttons
  document.querySelectorAll('.career-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.career-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Activity type
  document.querySelectorAll('.activity-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.activity-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const siblings = chip.parentElement.querySelectorAll('.chip');
      siblings.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Grid select buttons
  document.querySelectorAll('.grid-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const siblings = btn.parentElement.querySelectorAll('.grid-select-btn');
      siblings.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Planner view toggle
  document.querySelectorAll('[data-pview]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.plannerView = btn.dataset.pview;
      renderScreen();
    });
  });

  // Planner category chips
  document.querySelectorAll('.planner-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.planner-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Assignment type buttons
  document.querySelectorAll('.assignment-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.assignment-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Assignment filter chips
  document.querySelectorAll('[data-afilter]').forEach(chip => {
    chip.addEventListener('click', () => {
      state.assignmentFilter = chip.dataset.afilter;
      renderScreen();
    });
  });

  // Assignment subject chips
  document.querySelectorAll('#assignment-subject-chips .chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('#assignment-subject-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Teach student list
  document.querySelectorAll('.teach-student-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.teach-student-item').forEach(i => {
        i.classList.remove('selected');
        const check = i.querySelector('.fa-check-circle');
        if (check) check.remove();
      });
      item.classList.add('selected');
      if (!item.querySelector('.fa-check-circle')) {
        const check = document.createElement('i');
        check.className = 'fas fa-check-circle';
        check.style.cssText = 'color:var(--success);margin-left:auto';
        item.appendChild(check);
      }
    });
  });

  // Growth chart
  const chartCanvas = document.getElementById('growth-chart');
  if (chartCanvas) {
    new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: ['3월','4월','5월','6월','7월'],
        datasets: [
          { label:'나의 성장', data:[1.2,1.8,2.5,3.2,3.8], borderColor:'#6C5CE7', backgroundColor:'rgba(108,92,231,0.1)', fill:true, tension:0.4, borderWidth:3, pointRadius:5, pointBackgroundColor:'#6C5CE7', pointBorderColor:'#fff', pointBorderWidth:2 },
          { label:'이상적 곡선', data:[1,1.8,2.6,3.4,4.2], borderColor:'#484F58', borderDash:[5,5], fill:false, tension:0.4, borderWidth:2, pointRadius:0 }
        ]
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:false}},
        scales:{
          y:{min:0,max:5,ticks:{callback:v=>['','A','B-1','B-2/3','C-1','C-2'][v],color:'#8B949E',font:{size:10}},grid:{color:'rgba(48,54,61,0.5)'}},
          x:{ticks:{color:'#8B949E',font:{size:11}},grid:{display:false}}
        }
      }
    });
  }
}

function initMentorEvents() {
  document.querySelectorAll('[data-mtab]').forEach(btn => {
    btn.addEventListener('click', () => { state.mentorTab = btn.dataset.mtab; renderScreen(); });
  });
}

function initDirectorEvents() {
  document.querySelectorAll('[data-dtab]').forEach(btn => {
    btn.addEventListener('click', () => { state.directorTab = btn.dataset.dtab; renderScreen(); });
  });
}

// ==================== MODE SWITCHER & INIT ====================

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mode = btn.dataset.mode;
    if (state.mode === 'student') { state.currentScreen = 'main'; state.studentTab = 'home'; }
    renderScreen();
  });
});

// 학원 플래너 동기화 초기화
initAcademySync();
renderScreen();
