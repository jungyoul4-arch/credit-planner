import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()

app.get('/static/*', serveStatic())

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>학점플래너 CreditPlanner - 프로토타입</title>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="/static/app.css" rel="stylesheet">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>">
</head>
<body>
  <div id="prototype-wrapper">
    <div id="device-frame">
      <div id="mode-selector">
        <button class="mode-btn active" data-mode="student">🎓 학생 앱</button>
        <button class="mode-btn" data-mode="mentor">👨‍🏫 멘토 대시보드</button>
        <button class="mode-btn" data-mode="director">🏢 원장 대시보드</button>
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
