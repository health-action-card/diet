/* 토요일까지 가벼워지기 — 앱 동작 (서버 없이 localStorage에 저장) */
(function () {
  'use strict';

  /* ---------- 1. 요일별 체크리스트 데이터 ---------- */
  // offset: 결혼식(토요일)까지 남은 날 수
  const DAYS = [
    {
      key: 'tue', short: '화', name: '화요일', offset: 4, theme: '식단 리셋', emoji: '🥚',
      desc: '단순하고 깨끗한 식사로 몸을 리셋하는 날',
      sections: [
        { icon: '🌅', title: '아침 루틴', items: [
          ['tue-weigh', '아침 공복 체중 측정', '화장실 다녀온 뒤 · 아래 기록 칸에 적어 두기'],
        ]},
        { icon: '🍽️', title: '식단', items: [
          ['tue-bf', '아침: 달걀 2개 + 무가당 요거트', ''],
          ['tue-lunch', '점심: 밥 2/3공기 + 생선 또는 고기 + 나물', ''],
          ['tue-dinner', '저녁: 두부 반 모 + 달걀 + 채소', ''],
        ]},
        { icon: '💧', title: '생활습관', items: [
          ['tue-water', '물 충분히 마시기', '한 번에 몰아서 말고 조금씩 자주'],
          ['tue-nooverEat', '저녁 과식하지 않기', '천천히 먹고 배부르기 전에 멈추기'],
        ]},
        { icon: '🏃‍♀️', title: '운동', items: [
          ['tue-walk', '8천 보 이상 걷기', '틈틈이 나눠 걸어도 OK'],
        ]},
      ],
    },
    {
      key: 'wed', short: '수', name: '수요일', offset: 3, theme: '복부 팽만 관리', emoji: '🍌',
      desc: '속이 편한 음식과 코어 운동으로 배를 가볍게',
      sections: [
        { icon: '🍽️', title: '식단', items: [
          ['wed-bf', '아침: 삶은 달걀 2개 + 바나나 1/2개', ''],
          ['wed-lunch', '점심: 닭가슴살 또는 소고기 + 밥 2/3공기', ''],
          ['wed-dinner', '저녁: 생선구이 + 익힌 채소 + 밥 소량', '생채소보다 익힌 채소가 속이 편해요'],
          ['wed-protein', '단백질 충분히 먹기', '끼니마다 손바닥 크기 단백질'],
        ]},
        { icon: '💧', title: '생활습관', items: [
          ['wed-water', '물 충분히 마시기', '조금씩 자주'],
          ['wed-nonight', '야식 먹지 않기', ''],
        ]},
        { icon: '🏃‍♀️', title: '운동', note: '유산소 30분 + 코어', items: [
          ['wed-ex-walk', '빠르게 걷기 20분', '살짝 숨이 찰 정도의 속도', '유산소'],
          ['wed-ex-bike', '실내 자전거 10분', '없으면 빠르게 걷기 10분 추가', '유산소'],
          ['wed-ex-deadbug', '데드버그 12회 × 2세트', '허리를 바닥에 붙인 채 팔다리 교차', '코어'],
          ['wed-ex-birddog', '버드독 10회 × 2세트', '네발 자세에서 반대쪽 팔·다리 뻗기', '코어'],
          ['wed-ex-plank', '플랭크 20초 × 2세트', '엉덩이가 처지지 않게', '코어'],
          ['wed-ex-bridge', '글루트 브릿지 15회 × 2세트', '엉덩이를 조이며 천천히', '마무리'],
          ['wed-ex-stretch', '가벼운 허리·골반 스트레칭', '5분, 아프지 않은 범위에서', '마무리'],
        ]},
      ],
    },
    {
      key: 'thu', short: '목', name: '목요일', offset: 2, theme: '허리라인 집중', emoji: '🍠',
      desc: '저염 식사와 코어 운동, 충분한 잠으로 라인 정리',
      sections: [
        { icon: '🍽️', title: '식단', items: [
          ['thu-bf', '아침: 달걀 2개 + 과일 조금', ''],
          ['thu-lunch', '점심: 일반식, 밥 2/3공기', '국물은 건더기 위주로'],
          ['thu-dinner', '저녁: 연어 또는 닭고기 + 익힌 채소 + 고구마 소량', ''],
          ['thu-lowsalt', '저염 식사하기', '국물·젓갈·라면·가공식품 줄이기'],
        ]},
        { icon: '🏃‍♀️', title: '운동', items: [
          ['thu-walk', '8천 보 이상 걷기', ''],
          ['thu-ex-deadbug', '데드버그 12회 × 2세트', '허리를 바닥에 붙인 채 팔다리 교차', '코어'],
          ['thu-ex-birddog', '버드독 10회 × 2세트', '네발 자세에서 반대쪽 팔·다리 뻗기', '코어'],
          ['thu-ex-plank', '플랭크 20초 × 2세트', '엉덩이가 처지지 않게', '코어'],
          ['thu-ex-bridge', '글루트 브릿지 15회 × 2세트', '엉덩이를 조이며 천천히', '마무리'],
          ['thu-ex-stretch', '가벼운 허리·골반 스트레칭', '5분, 아프지 않은 범위에서', '마무리'],
        ]},
        { icon: '🌙', title: '생활습관', items: [
          ['thu-sleep', '7시간 이상 수면하기', ''],
        ]},
      ],
    },
    {
      key: 'fri', short: '금', name: '금요일', offset: 1, theme: '결혼식 전날', emoji: '🌷',
      desc: '무리하지 않고 편안하게, 컨디션을 지키는 날',
      sections: [
        { icon: '🍽️', title: '식단', items: [
          ['fri-bf', '아침: 달걀 + 바나나', ''],
          ['fri-lunch', '점심: 밥 소량 + 닭고기 또는 생선', ''],
          ['fri-dinner', '저녁: 두부 또는 생선 + 익힌 채소 + 밥 조금', ''],
          ['fri-easy', '소화 편한 식사하기', '튀김·탄산·자극적인 음식 피하기'],
        ]},
        { icon: '💧', title: '생활습관', items: [
          ['fri-water', '평소처럼 충분히 수분 섭취', '일부러 물을 줄이지 않기'],
          ['fri-noover', '야식과 과식 피하기', ''],
          ['fri-sleep', '일찍 자기', '내일 아침 컨디션을 위해'],
        ]},
        { icon: '🚶‍♀️', title: '운동', items: [
          ['fri-walk', '가벼운 산책하기', '땀 흘릴 정도로 무리하지 않기'],
        ]},
      ],
    },
  ];

  const SATURDAY_TIPS = [
    ['🍳', '아침은 거르지 않기', '달걀·바나나처럼 가볍고 익숙한 음식으로 든든하게'],
    ['💧', '물은 평소처럼 마시기', '일부러 줄이면 컨디션과 피부가 먼저 지쳐요'],
    ['🧘‍♀️', '무리한 운동은 쉬기', '가벼운 스트레칭과 심호흡 정도면 충분해요'],
    ['🧂', '짜고 기름진 간식, 탄산음료는 살짝 줄이기', '식장 가기 전에는 편안한 음식으로'],
    ['✨', '바른 자세가 최고의 허리라인', '어깨 펴고, 배에 살짝 힘 주고, 턱은 가볍게'],
    ['💗', '맛있게 먹고 즐겁게 축하하기', '오늘은 기록보다 좋은 추억을 남기는 날'],
  ];
  const SATURDAY_MESSAGE = '오늘은 숫자보다 컨디션과 자신감! 가볍고 예쁜 모습으로 즐거운 하루 보내기!';

  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const STORE_KEY = 'saturday-light-v1';

  /* ---------- 2. 저장 / 불러오기 ---------- */
  function freshState() {
    return { wedding: toISO(nextSaturday(new Date())), checks: {}, metrics: {} };
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return freshState();
      const s = JSON.parse(raw);
      return {
        wedding: s.wedding || toISO(nextSaturday(new Date())),
        checks: s.checks || {},
        metrics: s.metrics || {},
      };
    } catch (e) {
      return freshState();
    }
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      toast('저장 공간을 쓸 수 없어요 (비공개 모드인지 확인)');
    }
  }

  /* ---------- 3. 날짜 계산 ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function toISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function dayNumber(d) { return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
  function nextSaturday(d) {
    const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    r.setDate(r.getDate() + ((6 - r.getDay() + 7) % 7));
    return r;
  }
  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function fmt(d) { return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + WEEKDAYS[d.getDay()] + ')'; }

  // 결혼식까지 남은 날 (오늘 기준)
  function daysLeft() { return dayNumber(fromISO(state.wedding)) - dayNumber(new Date()); }
  function todayDay() { const left = daysLeft(); return DAYS.find(d => d.offset === left) || null; }
  function dateOf(day) { return addDays(fromISO(state.wedding), -day.offset); }

  /* ---------- 4. 실천율 계산 ---------- */
  function allItems(day) { return day.sections.flatMap(s => s.items); }
  function dayStats(day) {
    const items = allItems(day);
    const done = items.filter(i => state.checks[i[0]]).length;
    return { done, total: items.length, pct: Math.round((done / items.length) * 100) };
  }
  function overallStats() {
    let done = 0, total = 0;
    DAYS.forEach(d => { const s = dayStats(d); done += s.done; total += s.total; });
    return { done, total, pct: Math.round((done / total) * 100) };
  }

  /* ---------- 5. 화면 그리기 ---------- */
  const $ = id => document.getElementById(id);
  let state = load();
  let selectedKey = null;
  let previewFinal = false;

  function pickDefaultTab() {
    const left = daysLeft();
    const t = todayDay();
    if (t) return t.key;
    return left > 4 ? 'tue' : 'fri';
  }

  function renderHeader() {
    const left = daysLeft();
    const pill = $('ddayPill');
    if (left > 0) pill.textContent = 'D-' + left;
    else if (left === 0) pill.textContent = 'D-DAY';
    else pill.textContent = 'D+' + (-left);

    const today = new Date();
    const t = todayDay();
    let info = fmt(today) + ' · ';
    if (t) info += '<b>관리 ' + (5 - t.offset) + '일차</b> / 4일';
    else if (left === 0) info += '<b>결혼식 당일 💐</b>';
    else if (left > 4) info += '시작까지 ' + (left - 4) + '일 남았어요';
    else info += '<b>관리 완료 🎉</b>';
    $('todayInfo').innerHTML = info;
  }

  function renderOverall() {
    const o = overallStats();
    const C = 2 * Math.PI * 50;
    $('ringFg').style.strokeDashoffset = String(C * (1 - o.pct / 100));
    $('overallPct').textContent = o.pct + '%';

    const t = todayDay();
    $('dayRates').innerHTML = DAYS.map(d => {
      const s = dayStats(d);
      return '<li class="' + (t && t.key === d.key ? 'is-today' : '') + '"><b>' + d.short + '</b>' +
        '<span class="bar"><i class="' + (s.pct === 100 ? 'full' : '') + '" style="width:' + s.pct + '%"></i></span>' +
        '<span class="pct">' + s.pct + '%</span></li>';
    }).join('');
  }

  function renderTabs() {
    const t = todayDay();
    $('tabs').innerHTML = DAYS.map(d => {
      const s = dayStats(d);
      const cls = ['tab'];
      if (d.key === selectedKey) cls.push('active');
      if (t && t.key === d.key) cls.push('today');
      if (s.pct === 100) cls.push('complete');
      return '<button class="' + cls.join(' ') + '" data-day="' + d.key + '" aria-pressed="' + (d.key === selectedKey) + '">' +
        '<b>' + d.short + '</b><small>' + s.pct + '%</small></button>';
    }).join('');
  }

  const CHECK_SVG = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function renderDay() {
    const day = DAYS.find(d => d.key === selectedKey);
    const s = dayStats(day);
    const left = daysLeft();
    let when = '';
    if (left === day.offset) when = ' · 오늘';
    else if (left < day.offset) when = ' · 지난 기록';

    let html =
      '<div class="day-head">' +
        '<div class="label">' + day.name + ' · ' + fmt(dateOf(day)).replace(/ \(.\)$/, '') + when + '</div>' +
        '<h2>' + day.emoji + ' ' + day.theme + '</h2>' +
        '<p>' + day.desc + '</p>' +
        '<div class="day-bar"><i id="dayBar" style="width:' + s.pct + '%"></i></div>' +
        '<div class="day-bar-text"><span id="dayCount">' + s.done + ' / ' + s.total + ' 완료</span><span id="dayPct">' + s.pct + '%</span></div>' +
      '</div>' +
      '<div id="celebrate"></div>';

    day.sections.forEach(sec => {
      html += '<div class="card"><h3 class="section-title"><span>' + sec.icon + '</span>' + sec.title +
        (sec.note ? '<small>' + sec.note + '</small>' : '') + '</h3>';
      let lastGroup = null;
      sec.items.forEach(([id, text, hint, group]) => {
        if (group && group !== lastGroup) { html += '<span class="group-label">' + group + '</span>'; lastGroup = group; }
        const done = !!state.checks[id];
        html += '<button class="check-item' + (done ? ' done' : '') + '" data-id="' + id + '" role="checkbox" aria-checked="' + done + '">' +
          '<span class="box">' + CHECK_SVG + '</span>' +
          '<span class="item-text"><span class="main">' + text + '</span>' + (hint ? '<span class="hint">' + hint + '</span>' : '') + '</span>' +
          '<span class="item-heart">💗</span></button>';
      });
      html += '</div>';
    });

    $('dayView').innerHTML = html;
    renderCelebrate(s);
    renderMetrics();
  }

  function renderCelebrate(s) {
    $('celebrate').innerHTML = s.pct === 100
      ? '<div class="celebrate">🎉 오늘 미션 모두 완료! 🎉<small>정말 잘했어요. 토요일의 나에게 큰 선물이에요 💗</small></div>'
      : '';
  }

  // 체크 1개만 바뀌었을 때 진행률만 갱신
  function updateProgress() {
    const day = DAYS.find(d => d.key === selectedKey);
    const s = dayStats(day);
    $('dayBar').style.width = s.pct + '%';
    $('dayCount').textContent = s.done + ' / ' + s.total + ' 완료';
    $('dayPct').textContent = s.pct + '%';
    renderCelebrate(s);
    renderOverall();
    renderTabs();
    if (!$('finalView').hidden) renderFinal();
  }

  function renderMetrics() {
    const day = DAYS.find(d => d.key === selectedKey);
    const m = state.metrics[day.key] || {};
    $('metricsTitle').textContent = day.name + ' 기록';
    $('weightInput').value = m.weight ?? '';
    $('waistInput').value = m.waist ?? '';
  }

  /* ---------- 6. 그래프 (SVG 직접 그리기) ---------- */
  function lineChart(values, color, unit) {
    const pts = values.map((v, i) => ({ v, i })).filter(p => typeof p.v === 'number');
    if (pts.length === 0) return '<div class="chart-empty">기록을 입력하면 그래프가 그려져요</div>';

    const W = 320, H = 150, L = 22, R = 22, T = 28, B = 30;
    const vs = pts.map(p => p.v);
    let min = Math.min(...vs), max = Math.max(...vs);
    if (max - min < 1) { const mid = (max + min) / 2; min = mid - 0.5; max = mid + 0.5; }
    const x = i => L + (i * (W - L - R)) / (DAYS.length - 1);
    const y = v => T + (1 - (v - min) / (max - min)) * (H - T - B);

    let svg = '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + unit + ' 변화 그래프">';
    // 요일 세로선 + 라벨
    DAYS.forEach((d, i) => {
      svg += '<line x1="' + x(i) + '" y1="' + (T - 8) + '" x2="' + x(i) + '" y2="' + (H - B) + '" stroke="#F0E6DA" stroke-dasharray="3 4"/>';
      svg += '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="13" fill="#8C7F7A">' + d.short + '</text>';
    });
    // 선 (연속된 점끼리 연결)
    if (pts.length > 1) {
      const d = pts.map((p, k) => (k ? 'L' : 'M') + x(p.i).toFixed(1) + ' ' + y(p.v).toFixed(1)).join(' ');
      svg += '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    // 점 + 값
    pts.forEach(p => {
      svg += '<circle cx="' + x(p.i) + '" cy="' + y(p.v) + '" r="6" fill="#fff" stroke="' + color + '" stroke-width="3"/>';
      svg += '<text x="' + x(p.i) + '" y="' + (y(p.v) - 11) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#4A3F3F">' + p.v + '</text>';
    });
    return svg + '</svg>';
  }

  function deltaText(values, unit) {
    const nums = values.filter(v => typeof v === 'number');
    if (nums.length < 2) return { text: '', down: false };
    const diff = Math.round((nums[nums.length - 1] - nums[0]) * 10) / 10;
    if (diff < 0) return { text: '처음보다 ' + Math.abs(diff) + unit + ' ↓', down: true };
    if (diff > 0) return { text: '처음보다 +' + diff + unit + ' (괜찮아요, 컨디션이 먼저!)', down: false };
    return { text: '처음과 같아요', down: false };
  }

  function metricSeries(key) { return DAYS.map(d => (state.metrics[d.key] || {})[key]); }

  function renderCharts() {
    const w = metricSeries('weight'), ws = metricSeries('waist');
    $('weightChart').innerHTML = lineChart(w, '#8FD9C4', 'kg');
    $('waistChart').innerHTML = lineChart(ws, '#F4A3B8', 'cm');
    const dw = deltaText(w, 'kg'), dws = deltaText(ws, 'cm');
    $('weightDelta').textContent = dw.text; $('weightDelta').className = dw.down ? 'down' : '';
    $('waistDelta').textContent = dws.text; $('waistDelta').className = dws.down ? 'down' : '';
  }

  /* ---------- 7. 토요일 최종 화면 ---------- */
  function renderFinal() {
    const show = daysLeft() <= 0 || previewFinal;
    const box = $('finalView');
    box.hidden = !show;
    $('previewBtn').hidden = daysLeft() <= 0;
    $('previewBtn').textContent = previewFinal ? '토요일 화면 닫기' : '토요일 화면 미리보기';
    if (!show) return;

    const o = overallStats();
    const perfect = DAYS.filter(d => dayStats(d).pct === 100).length;
    const ws = metricSeries('waist').filter(v => typeof v === 'number');
    const waistTxt = ws.length >= 2 ? (Math.round((ws[ws.length - 1] - ws[0]) * 10) / 10) + 'cm' : '-';

    box.innerHTML =
      '<p class="big">💐</p>' +
      '<h2>4일 관리 완료! 정말 수고했어요</h2>' +
      '<p class="final-message">' + SATURDAY_MESSAGE + '</p>' +
      '<div class="final-stats">' +
        '<div><b>' + o.pct + '%</b><span>전체 실천율</span></div>' +
        '<div><b>' + perfect + ' / 4</b><span>완벽한 날</span></div>' +
        '<div><b>' + waistTxt + '</b><span>허리둘레 변화</span></div>' +
      '</div>' +
      '<h3 class="section-title" style="justify-content:center">결혼식 당일 관리 팁</h3>' +
      '<ul class="tips">' + SATURDAY_TIPS.map(t => '<li><span>' + t[0] + '</span><div><b>' + t[1] + '</b><small>' + t[2] + '</small></div></li>').join('') + '</ul>';
  }

  /* ---------- 8. 작은 효과들 ---------- */
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }

  function confetti() {
    const layer = $('confetti');
    const pieces = ['💗', '🌸', '✨', '💚', '🎉', '🤍'];
    for (let i = 0; i < 34; i++) {
      const s = document.createElement('span');
      s.textContent = pieces[i % pieces.length];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
      s.style.animationDelay = Math.random() * 0.5 + 's';
      s.style.fontSize = 16 + Math.random() * 16 + 'px';
      layer.appendChild(s);
    }
    setTimeout(() => { layer.innerHTML = ''; }, 4200);
  }

  function renderAll() {
    renderHeader();
    renderOverall();
    renderTabs();
    renderDay();
    renderCharts();
    renderFinal();
    $('weddingInput').value = state.wedding;
  }

  /* ---------- 9. 이벤트 ---------- */
  // 체크박스 누르기 (켜기/끄기 모두 가능 = 직접 수정)
  $('dayView').addEventListener('click', e => {
    const btn = e.target.closest('.check-item');
    if (!btn) return;
    const id = btn.dataset.id;
    const day = DAYS.find(d => d.key === selectedKey);
    const before = dayStats(day).pct;

    if (state.checks[id]) delete state.checks[id]; else state.checks[id] = true;
    save();

    const done = !!state.checks[id];
    btn.classList.toggle('done', done);
    btn.setAttribute('aria-checked', String(done));
    if (navigator.vibrate && done) navigator.vibrate(12);
    updateProgress();

    if (before < 100 && dayStats(day).pct === 100) {
      confetti();
      toast(day.name + ' 미션 완료! 🎉');
    }
  });

  // 하단 요일 탭
  $('tabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    selectedKey = btn.dataset.day;
    renderTabs();
    renderDay();
    window.scrollTo({ top: document.querySelector('.progress-card').offsetTop + 150, behavior: 'smooth' });
  });

  // 체중 / 허리둘레 입력 (입력하는 즉시 저장)
  function bindMetric(inputId, field) {
    $(inputId).addEventListener('input', e => {
      const raw = e.target.value.trim();
      const m = state.metrics[selectedKey] || (state.metrics[selectedKey] = {});
      const v = parseFloat(raw);
      if (raw === '' || isNaN(v)) delete m[field];
      else m[field] = Math.round(v * 10) / 10;
      save();
      renderCharts();
      if (!$('finalView').hidden) renderFinal();
    });
    $(inputId).addEventListener('change', () => toast('저장했어요 ✓'));
  }
  bindMetric('weightInput', 'weight');
  bindMetric('waistInput', 'waist');

  // 결혼식 날짜 변경
  $('weddingInput').addEventListener('change', e => {
    if (!e.target.value) return;
    state.wedding = e.target.value;
    save();
    selectedKey = pickDefaultTab();
    renderAll();
    toast('날짜를 바꿨어요');
  });

  // 토요일 화면 미리보기
  $('previewBtn').addEventListener('click', () => {
    previewFinal = !previewFinal;
    renderFinal();
    if (previewFinal) $('finalView').scrollIntoView({ behavior: 'smooth' });
  });

  // 초기화 (확인 창)
  const modal = $('resetModal');
  $('resetBtn').addEventListener('click', () => { modal.hidden = false; $('cancelReset').focus(); });
  $('cancelReset').addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
  $('confirmReset').addEventListener('click', () => {
    const wedding = state.wedding;
    state = { wedding, checks: {}, metrics: {} };
    save();
    modal.hidden = true;
    selectedKey = pickDefaultTab();
    renderAll();
    toast('모든 기록을 지웠어요');
  });

  // 안드로이드: 설치 버튼
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    $('installBtn').hidden = false;
  });
  $('installBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $('installBtn').hidden = true;
  });

  // 앱을 다시 열었을 때 날짜가 바뀌었으면 화면 갱신
  let lastDay = toISO(new Date());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && toISO(new Date()) !== lastDay) {
      lastDay = toISO(new Date());
      selectedKey = pickDefaultTab();
      renderAll();
    }
  });

  /* ---------- 10. 시작 ---------- */
  selectedKey = pickDefaultTab();
  renderAll();
  save(); // 첫 실행 때 결혼식 날짜 저장

  // 토요일 당일 처음 열면 축하 효과 (하루 한 번)
  if (daysLeft() === 0) {
    try {
      const k = 'saturday-light-celebrated';
      if (localStorage.getItem(k) !== state.wedding) { localStorage.setItem(k, state.wedding); setTimeout(confetti, 400); }
    } catch (e) { /* 무시 */ }
  }

  // 오프라인 사용을 위한 서비스 워커 등록
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* 미리보기 환경 등에서는 무시 */ });
    });
  }
})();
