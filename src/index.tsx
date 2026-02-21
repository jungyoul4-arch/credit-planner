import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-pages'

type Bindings = {
  OPENAI_API_KEY: string
  ANTHROPIC_API_KEY: string
  GEMINI_API_KEY: string
  PERPLEXITY_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.get('/static/*', serveStatic())

// ==================== Gemini → OpenAI 폴백 헬퍼 ====================
// Gemini API가 할당량 초과(429) 등으로 실패할 경우 OpenAI gpt-4o-mini로 자동 폴백

async function callGeminiWithFallback(opts: {
  geminiKey: string,
  openaiKey: string,
  prompt: string,
  jsonMode?: boolean,
  temperature?: number,
  inlineData?: { mime_type: string, data: string },
}) {
  const { geminiKey, openaiKey, prompt, jsonMode = true, temperature = 0.3, inlineData } = opts

  // Step 1: Gemini 시도
  try {
    const parts: any[] = [{ text: prompt }]
    if (inlineData) parts.push({ inline_data: inlineData })

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature,
            ...(jsonMode ? { responseMimeType: 'application/json' } : { maxOutputTokens: 2048 })
          }
        })
      }
    )

    if (geminiRes.ok) {
      const data: any = await geminiRes.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
      return { text, source: 'gemini' }
    }

    // Gemini 실패 → 폴백으로 진행
    console.log(`Gemini API 실패 (${geminiRes.status}), OpenAI로 폴백`)
  } catch (e) {
    console.log('Gemini API 에러, OpenAI로 폴백:', e)
  }

  // Step 2: OpenAI 폴백 (이미지가 있는 경우 이미지 없이 텍스트만 전송)
  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
    })
  })

  if (!openaiRes.ok) {
    const err = await openaiRes.text()
    throw new Error(`OpenAI 폴백도 실패: ${err}`)
  }

  const openaiData: any = await openaiRes.json()
  const text = openaiData.choices[0].message.content
  return { text, source: 'openai' }
}

// ==================== 2축 9단계 시스템 프롬프트 ====================

const SYSTEM_PROMPT_ANALYZE = `당신은 정율고교학점데이터센터의 "2축 9단계 질문 코칭 시스템 v2.0"에 따라 학생 질문을 분석하는 AI 코치입니다.

## 2축 9단계 분류 체계

### 축1: 호기심 사다리 (문제를 향한 질문)
- A-1 "뭐지?" (8XP): 사실·정의·공식 확인 질문
- A-2 "어떻게?" (10XP): 절차·방법·순서 확인 질문
- B-1 "왜?" (15XP): 이유·원리를 깊이 이해하려는 질문
- B-2 "만약에?" (20XP): 조건 변경 → 결과 예측하는 전략적 사고 질문
- C-1 "뭐가 더 나아?" (25XP): 서로 다른 방법 비교 + 자기 판단 제시
- C-2 "그러면?" (30XP): 배운 것을 새 상황에 적용/확장

### 축2: 성찰 질문 (내 풀이를 향한 질문)
- R-1 "어디서 틀렸지?" (15XP): 오류 위치 발견
- R-2 "왜 틀렸지?" (20XP): 오류 원인 분석 (개념부족/실수/해석오류)
- R-3 "다음엔 어떻게?" (25XP): 재발 방지 전략 수립

## B단계 이상 3대 필수 조건 (매우 엄격하게 적용!)
1. **구체적 대상**: 문제의 특정 부분(수식, 선지 번호, 표현 등)을 명확히 지목. "이거", "그거" 같은 모호한 표현이면 불합격
2. **자기 생각**: "나는 ~라고 생각한다/~것 같다" 등 학생 자신의 해석·추론이 반드시 포함. 이것이 가장 크리티컬한 조건!
3. **맥락 연결**: 지문·조건·풀이의 구체적 내용과 연결. 형식만 빌린 질문은 즉시 걸러냄

**꼼수 차단**: "왜"라는 단어가 있어도 자기 생각이 없으면 A단계. "만약에"가 있어도 구체적 조건 변경이 없으면 A단계.

## 응답 형식 (반드시 이 JSON 형식으로만 응답)
{
  "level": "B-1",
  "levelName": "왜?",
  "levelDesc": "이유·원리 탐구",
  "xp": 15,
  "axis": "curiosity",
  "checks": {
    "specificTarget": { "pass": true, "detail": "which와 that의 용법 구분을 지목했어" },
    "ownThought": { "pass": true, "detail": "'역사적으로 같은 기능이었을 것 같다'는 네 해석이 있어" },
    "contextLink": { "pass": true, "detail": "제한적/계속적 용법이라는 수업 내용과 연결됐어" }
  },
  "feedback": "단순한 규칙 암기가 아니라 그 배경의 '왜'를 묻고 있어. 훌륭한 호기심이야!",
  "nextHint": {
    "targetLevel": "B-2",
    "targetName": "만약에?",
    "hint": "만약 which가 제한적 용법에서도 쓰인다면 문장 의미가 어떻게 달라질까? 처럼 조건을 바꿔 예측해봐!"
  }
}`;

const SYSTEM_PROMPT_COACHING = `당신은 정율고교학점데이터센터의 소크라테스식 AI 코치입니다.

## 코칭 원칙
1. **절대 답을 직접 주지 마세요.** 질문으로 학생이 스스로 깨닫게 유도하세요.
2. 당신이 던지는 모든 질문에 해당 질문의 2축 9단계 단계를 표시하세요.
3. 단계를 점진적으로 높여가세요: B-1 → B-2 → C-1 → C-2
4. 학생이 막히면 힌트를 주되, 절대 정답을 말하지 마세요.
5. 톤: 냉정하게 진단하고, 따뜻하게 격려하세요.

## 응답 형식 (반드시 이 JSON 형식으로만 응답)
{
  "message": "AI 코치의 질문 또는 피드백 텍스트",
  "questionLevel": "B-2",
  "questionLabel": "만약에?",
  "emoji": "🔀",
  "isComplete": false,
  "encouragement": ""
}

isComplete가 true이면 대화가 자연스럽게 마무리된 것이며, encouragement에 격려 메시지를 넣으세요.`;

const SYSTEM_PROMPT_IMAGE = `당신은 학생이 올린 문제지/풀이 이미지를 분석하는 AI입니다.

## 분석 내용
1. 이미지에서 텍스트/수식/그래프 등을 정확히 읽어내세요
2. 어떤 과목의 어떤 단원인지 파악하세요
3. 문제의 핵심 개념과 풀이에 필요한 사고를 설명하세요
4. 학생의 필기가 있다면 올바른지 확인하세요

## 응답 형식 (반드시 이 JSON 형식으로만 응답)
{
  "subject": "수학",
  "topic": "치환적분",
  "extractedText": "이미지에서 읽은 핵심 내용",
  "analysis": "문제/풀이에 대한 분석",
  "handwritingCheck": "필기 확인 결과 (필기가 있을 경우)",
  "suggestedQuestion": "이 문제에 대해 B단계 이상의 좋은 질문 예시"
}`;


// ==================== API 라우트: 질문 분석 (OpenAI) ====================

app.post('/api/analyze', async (c) => {
  try {
    const { question, subject, axis } = await c.req.json()
    if (!question) return c.json({ error: '질문 내용이 필요합니다' }, 400)

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_ANALYZE },
          { role: 'user', content: `과목: ${subject || '미지정'}\n질문 축: ${axis === 'reflection' ? '축2(성찰)' : '축1(호기심)'}\n\n학생 질문: "${question}"` }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    })

    if (!res.ok) {
      const err = await res.text()
      return c.json({ error: 'OpenAI API 오류', detail: err }, 500)
    }

    const data: any = await res.json()
    const result = JSON.parse(data.choices[0].message.content)
    return c.json(result)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// ==================== API 라우트: 소크라테스 코칭 (Claude) ====================

app.post('/api/coaching', async (c) => {
  try {
    const { messages, subject, currentLevel } = await c.req.json()
    if (!messages || messages.length === 0) return c.json({ error: '대화 내용이 필요합니다' }, 400)

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': c.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT_COACHING + `\n\n현재 학생의 질문 단계: ${currentLevel || 'A-2'}\n과목: ${subject || '미지정'}`,
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content
        }))
      })
    })

    if (!res.ok) {
      const err = await res.text()
      return c.json({ error: 'Claude API 오류', detail: err }, 500)
    }

    const data: any = await res.json()
    const text = data.content[0].text

    // JSON 파싱 시도, 실패하면 텍스트 그대로 반환
    try {
      const result = JSON.parse(text)
      return c.json(result)
    } catch {
      return c.json({
        message: text,
        questionLevel: '',
        questionLabel: '',
        emoji: '🤖',
        isComplete: false,
        encouragement: ''
      })
    }
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// ==================== API 라우트: 이미지 분석 (Gemini) ====================

app.post('/api/image-analyze', async (c) => {
  try {
    const { imageBase64, mimeType, subject } = await c.req.json()
    if (!imageBase64) return c.json({ error: '이미지 데이터가 필요합니다' }, 400)

    // base64 데이터에서 prefix 제거
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const fullPrompt = SYSTEM_PROMPT_IMAGE + `\n\n과목 힌트: ${subject || '미지정'}\n\n위 형식에 맞게 JSON으로만 응답하세요.`

    // Gemini 우선 시도 (이미지 지원) → 실패 시 OpenAI 폴백 (이미지 없이 텍스트만)
    const { text } = await callGeminiWithFallback({
      geminiKey: c.env.GEMINI_API_KEY,
      openaiKey: c.env.OPENAI_API_KEY,
      prompt: fullPrompt,
      jsonMode: true,
      temperature: 0.3,
      inlineData: { mime_type: mimeType || 'image/jpeg', data: cleanBase64 },
    })

    try {
      return c.json(JSON.parse(text))
    } catch {
      return c.json({ analysis: text })
    }
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// ==================== API 라우트: 고난도 문제 분석 (Claude) ====================

app.post('/api/deep-analyze', async (c) => {
  try {
    const { question, subject, context } = await c.req.json()
    if (!question) return c.json({ error: '질문 내용이 필요합니다' }, 400)

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': c.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: `당신은 고등학교 수준의 고난도 문제를 분석하는 전문 튜터입니다.
학생이 이해할 수 있도록 단계적으로 설명하되, 핵심 개념과 풀이 전략을 명확히 제시하세요.
답을 바로 주지 말고, 사고 과정을 안내하세요.

응답 형식 (JSON):
{
  "difficulty": "상/중/하",
  "keyConcepts": ["개념1", "개념2"],
  "thinkingSteps": ["1단계: ...", "2단계: ..."],
  "hint": "핵심 힌트",
  "commonMistakes": ["흔한 실수1"],
  "relatedTopics": ["관련 주제1"]
}`,
        messages: [
          { role: 'user', content: `과목: ${subject}\n${context ? `배경: ${context}\n` : ''}\n질문: ${question}` }
        ]
      })
    })

    if (!res.ok) {
      const err = await res.text()
      return c.json({ error: 'Claude API 오류', detail: err }, 500)
    }

    const data: any = await res.json()
    const text = data.content[0].text

    try {
      return c.json(JSON.parse(text))
    } catch {
      return c.json({ analysis: text })
    }
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// ==================== API 라우트: 시험 대비 코칭 (Gemini) ====================

app.post('/api/exam-coach', async (c) => {
  try {
    const { prompt } = await c.req.json()
    if (!prompt) return c.json({ error: '프롬프트가 필요합니다' }, 400)

    const { text } = await callGeminiWithFallback({
      geminiKey: c.env.GEMINI_API_KEY,
      openaiKey: c.env.OPENAI_API_KEY,
      prompt,
      jsonMode: false,
      temperature: 0.7,
    })

    return c.json({ plan: text })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// ==================== API 라우트: 탐구보고서 질문 진단 (Gemini Flash) ====================

const REPORT_DIAGNOSIS_PROMPT = `당신은 2축 9단계 질문 진단 전문가입니다.
학생의 탐구보고서 과정에서 나온 질문을 분석하여 수준을 판정하세요.

[2축 9단계]
호기심 축: A-1(뭐지? 8XP), A-2(어떻게? 10XP), B-1(왜? 15XP), B-2(만약에? 20XP), C-1(뭐가더나아? 25XP), C-2(그러면? 30XP)
성찰 축: R-1(어디서틀렸지? 15XP), R-2(왜틀렸지? 20XP), R-3(다음엔어떻게? 25XP)

[3대 필수조건 - B-1 이상 판정 시 모두 충족 필수]
① 구체적 대상: 어떤 부분에 대한 질문인지 특정
② 자기 생각: "나는 ~라고 생각하는데" 존재
③ 맥락 연결: 조건/지문/풀이와 구체적 연결

하나라도 빠지면 A 수준으로 하향. 애매하면 낮은 쪽.
"왜요?" → 자기생각 없으면 A. "만약 다르면?" → 뭐가 다른지 없으면 A.

반드시 JSON만 출력:
{
  "level": "B-1",
  "axis": "curiosity",
  "xp": 15,
  "diag": {
    "specific_target": {"met": true, "detail": "..."},
    "own_thinking": {"met": true, "detail": "..."},
    "context_connection": {"met": false, "detail": "..."}
  },
  "coaching_comment": "친근한 말투로 2~3문장. 칭찬+업그레이드 힌트",
  "upgrade_hint": "한 단계 올리려면 이렇게: '...'"
}`;

app.post('/api/report-diagnose', async (c) => {
  try {
    const { question, phase, projectTitle, subject } = await c.req.json()
    if (!question) return c.json({ error: '질문 내용이 필요합니다' }, 400)

    const fullPrompt = REPORT_DIAGNOSIS_PROMPT + `\n\n학생의 질문:\n"${question}"\n\n현재 탐구 단계: ${phase || '주제 선정'}\n탐구 주제: ${projectTitle || '미정'}\n과목: ${subject || '미지정'}\n\nJSON만 출력:`

    const { text } = await callGeminiWithFallback({
      geminiKey: c.env.GEMINI_API_KEY,
      openaiKey: c.env.OPENAI_API_KEY,
      prompt: fullPrompt,
      jsonMode: true,
      temperature: 0.3,
    })

    try {
      return c.json(JSON.parse(text))
    } catch {
      return c.json({ level: 'A-1', axis: 'curiosity', xp: 8, coaching_comment: text })
    }
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// ==================== API 라우트: 탐구보고서 AI 멘토 (Perplexity) ====================

app.post('/api/report-mentor', async (c) => {
  try {
    const { question, phase, projectTitle, subject, questionHistory } = await c.req.json()
    if (!question) return c.json({ error: '질문 내용이 필요합니다' }, 400)

    const histSummary = (questionHistory || []).slice(-5).map((q: any) =>
      `[${q.level}] ${q.text}`
    ).join('\n') || '(아직 없음)'

    const systemPrompt = `당신은 고등학생의 탐구 보고서를 돕는 AI 멘토입니다.

현재 탐구 단계: ${phase || '주제 선정'}
탐구 주제: ${projectTitle || '(아직 설정 안 됨)'}
과목: ${subject || '미지정'}

이 학생의 최근 질문 이력 (수준 포함):
${histSummary}

[규칙]
1. 답을 바로 주지 말고 학생이 스스로 생각하도록 질문을 던져주세요.
2. 학생의 질문 수준이 올라가도록 유도하세요.
3. 자료를 언급할 때는 출처를 반드시 밝혀주세요. (URL 포함)
4. 한국어로, 친근하지만 학술적으로 답변하세요.
5. 검색된 최신 자료가 있으면 활용하세요.
6. 관련 논문이나 연구가 있으면 소개해주세요.`

    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 1500,
        temperature: 0.5,
      })
    })

    if (!res.ok) {
      const err = await res.text()
      return c.json({ error: 'Perplexity API 오류', detail: err }, 500)
    }

    const data: any = await res.json()
    const text = data.choices?.[0]?.message?.content || '응답을 생성하지 못했습니다.'
    const citations = data.citations || []
    return c.json({ answer: text, citations })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})


// ==================== 헬스체크 ====================
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    services: {
      openai: !!c.env.OPENAI_API_KEY,
      anthropic: !!c.env.ANTHROPIC_API_KEY,
      gemini: !!c.env.GEMINI_API_KEY,
      perplexity: !!c.env.PERPLEXITY_API_KEY
    }
  })
})

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>정율사관학원 고교학점플래너 CreditPlanner</title>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="/static/app.css" rel="stylesheet">
  <link rel="icon" href="/static/logo.png">
</head>
<body>
  <div id="prototype-wrapper">
    <div id="device-frame">
      <div id="mode-header">
        <div class="mode-logo-row">
          <img src="/static/logo.png" alt="정율사관학원" class="mode-logo-img">
          <div class="mode-logo-text">
            <span class="mode-logo-title">고교학점플래너</span>
            <span class="mode-logo-sub">HS CreditPlanner</span>
          </div>
        </div>
      </div>
      <div id="mode-selector">
        <button class="mode-btn active" data-mode="student">🎓 학생 앱</button>
        <button class="mode-btn" data-mode="mentor">👨‍🏫 멘토 대시보드</button>
        <button class="mode-btn" data-mode="director">🏢 원장 대시보드</button>
      </div>
      <div id="device-preview-selector">
        <span class="device-preview-label">미리보기</span>
        <div class="device-preview-btns">
          <button class="device-preview-btn" data-device="phone" title="핸드폰 (390×844)">
            <i class="fas fa-mobile-alt"></i><span>핸드폰</span>
          </button>
          <button class="device-preview-btn" data-device="tablet" title="패드 (768×1024)">
            <i class="fas fa-tablet-alt"></i><span>패드</span>
          </button>
          <button class="device-preview-btn active" data-device="pc" title="PC (실제 화면 크기)">
            <i class="fas fa-desktop"></i><span>PC</span>
          </button>
        </div>
      </div>
      <div id="phone-container">
        <div id="phone-frame">
          <div id="status-bar">
            <span>9:41</span>
            <span><i class="fas fa-signal"></i> <i class="fas fa-wifi"></i> <i class="fas fa-battery-full"></i></span>
          </div>
          <div id="app-content"></div>
        </div>
      </div>
      <div id="tablet-container" style="display:none">
        <div id="tablet-status-bar">
          <span class="tablet-status-left">
            <img src="/static/logo.png" alt="" class="tablet-status-logo">
            <span class="tablet-status-title">고교학점플래너</span>
          </span>
          <span class="tablet-status-right">
            <i class="fas fa-signal"></i> <i class="fas fa-wifi"></i> <i class="fas fa-battery-full"></i>
            <span class="tablet-status-time">9:41</span>
          </span>
        </div>
        <div id="tablet-content"></div>
      </div>
      <div id="desktop-container" style="display:none">
        <div id="desktop-content"></div>
      </div>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
