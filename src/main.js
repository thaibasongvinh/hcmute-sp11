const app = document.querySelector("#app");
const STORAGE = {
  called: "hcmute-sp11-called-v1",
  best: "hcmute-sp11-best-v1",
  preferences: "hcmute-sp11-preferences-v1"
};
const LETTERS = ["A", "B", "C", "D", "E", "F"];
const audioFiles = {
  click: "./audio/sfx/ui-click.mp3",
  correct: "./audio/sfx/correct.mp3",
  wrong: "./audio/sfx/wrong.mp3",
  summon: "./audio/sfx/gacha-charge.mp3"
};

let settings;
let questions;
let students;
let calledIds = new Set(readStored(STORAGE.called, []));
let preferences = { sfx: false, bgm: false, ...readStored(STORAGE.preferences, {}) };
let music;
let state = {
  screen: "home",
  questionIndex: 0,
  squadFilter: "all",
  search: "",
  responder: null,
  attemptsLeft: 0,
  answerState: null,
  selectedAnswer: null,
  feedback: null,
  score: 0,
  correctCount: 0
};

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage may be unavailable in a private browsing session.
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fullName(student) {
  return student.last + " " + student.first;
}

function initials(student) {
  const surname = student.last.trim().split(/\s+/).pop();
  return (surname.slice(0, 1) + student.first.slice(0, 1)).toLocaleUpperCase("vi");
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function sound(name) {
  if (!preferences.sfx) return;
  const audio = new Audio(audioFiles[name] || audioFiles.click);
  audio.volume = 0.28;
  audio.play().catch(() => {});
}

function toggleMusic() {
  if (!music) {
    music = new Audio("./audio/bgm/elegy-loop.mp3");
    music.loop = true;
    music.volume = 0.18;
  }
  if (preferences.bgm) music.play().catch(() => {});
  else music.pause();
}

function savePreferences() {
  saveStored(STORAGE.preferences, preferences);
  toggleMusic();
}

function squadNumbers() {
  return [...new Set(students.map((student) => Number(student.squad)))].sort((a, b) => a - b);
}

function countBySquad(squad) {
  const members = students.filter((student) => Number(student.squad) === Number(squad));
  const called = members.filter((student) => calledIds.has(student.id)).length;
  return { total: members.length, called };
}

function renderAudioControls() {
  return '<div class="audio-controls" aria-label="Cài đặt âm thanh">' +
    '<button class="icon-button" type="button" data-pref="sfx" aria-pressed="' + preferences.sfx + '" title="Bật hoặc tắt hiệu ứng"><span aria-hidden="true">◖</span><small>SFX</small></button>' +
    '<button class="icon-button" type="button" data-pref="bgm" aria-pressed="' + preferences.bgm + '" title="Bật hoặc tắt nhạc nền"><span aria-hidden="true">♫</span><small>NHẠC</small></button>' +
    '</div>';
}

function renderTopLine() {
  return '<div class="topline">' +
    '<span class="eyebrow"><i class="status-dot"></i>' + escapeHtml(settings.courseLabel) + ' <b>·</b> <em>' + escapeHtml(settings.sectionTag) + '</em></span>' +
    renderAudioControls() +
    '</div>';
}

function renderHome() {
  const calledCount = students.filter((student) => calledIds.has(student.id)).length;
  const best = Number(readStored(STORAGE.best, 0)) || 0;
  const squadStrip = students.slice(0, 14).map((student, index) =>
    '<span class="cadet-chip cadet-' + (index % 6) + '" title="' + escapeHtml(fullName(student)) + '">' +
    escapeHtml(initials(student)) + '</span>'
  ).join("");

  app.innerHTML =
    '<div class="page page-home">' +
      renderTopLine() +
      '<main class="home-content">' +
        '<div class="emblem-wrap"><span class="orbit orbit-one"></span><span class="orbit orbit-two"></span>' +
          '<img class="school-emblem" src="./assets/logo-ute-emblem-B-zi-VGZ.webp" alt="Biểu trưng HCM-UTE" />' +
        '</div>' +
        '<p class="school-name">' + escapeHtml(settings.schoolName) + '</p>' +
        '<h1>' + escapeHtml(settings.title) + '<span>' + escapeHtml(settings.lessonNumber) + '</span></h1>' +
        '<p class="home-description">' + escapeHtml(settings.description) + '</p>' +
        '<div class="home-actions">' +
          '<button class="button button-primary" data-action="start"><span aria-hidden="true">▶</span> BẮT ĐẦU NHIỆM VỤ</button>' +
          '<button class="button button-quiet" data-action="roster"><span aria-hidden="true">♧</span> DANH SÁCH LỚP</button>' +
        '</div>' +
        '<dl class="stats-grid">' +
          '<div class="stat"><dt>MỤC TIÊU</dt><dd>' + questions.length + '</dd></div>' +
          '<div class="stat"><dt>LỚP</dt><dd>' + students.length + ' NGƯỜI</dd></div>' +
          '<div class="stat"><dt>ĐÃ GỌI</dt><dd>' + calledCount + '/' + students.length + '</dd></div>' +
          '<div class="stat"><dt>KỶ LỤC</dt><dd>' + (best ? best : "—") + '</dd></div>' +
        '</dl>' +
        '<div class="cadet-strip" aria-label="Thành viên lớp">' + squadStrip + '</div>' +
      '</main>' +
      '<footer class="page-footer">NHẠC NỀN BẬT SAU LẦN TƯƠNG TÁC ĐẦU TIÊN · PHÍM A–F ĐỂ TRẢ LỜI</footer>' +
    '</div>';
}

function renderSquadMeters() {
  return squadNumbers().map((squad) => {
    const count = countBySquad(squad);
    return '<span class="squad-meter">TĐ ' + squad + ' · ' + (count.total - count.called) + '/' + count.total + '</span>';
  }).join("");
}

function renderFeedback(question) {
  if (state.answerState === "correct") {
    return '<div class="feedback feedback-correct" role="status">' +
      '<div><strong>CHÍNH XÁC · +' + state.feedback.points + ' ĐIỂM</strong><p>' + escapeHtml(question.explanation) + '</p></div>' +
      '<button class="button button-primary button-small" data-action="next">' +
      (state.questionIndex + 1 === questions.length ? "TỔNG KẾT" : "CÂU TIẾP THEO") + ' <span>→</span></button></div>';
  }
  if (state.answerState === "retry") {
    return '<div class="feedback feedback-retry" role="status"><div><strong>CHƯA CHÍNH XÁC · CÒN ' + state.attemptsLeft + ' CƠ HỘI</strong><p>Hãy xem lại các phương án rồi chọn lần nữa.</p></div></div>';
  }
  if (state.answerState === "revealed") {
    return '<div class="feedback feedback-retry" role="status">' +
      '<div><strong>ĐÁP ÁN ĐÚNG: ' + (LETTERS[question.correctIndex] || "?") + '</strong><p>' + escapeHtml(question.explanation) + '</p></div>' +
      '<button class="button button-primary button-small" data-action="next">' +
      (state.questionIndex + 1 === questions.length ? "TỔNG KẾT" : "CÂU TIẾP THEO") + ' <span>→</span></button></div>';
  }
  return "";
}

function renderMission() {
  const question = questions[state.questionIndex];
  const progress = Math.round((state.questionIndex / questions.length) * 100);
  const chancesRemaining = state.responder ? state.attemptsLeft : (Number(settings.attemptsPerQuestion) || 2);
  const locked = !state.responder || state.answerState === "correct" || state.answerState === "revealed";
  const choices = question.options.map((option, index) => {
    const isCorrect = (state.answerState === "revealed" || state.answerState === "correct") && index === Number(question.correctIndex);
    const isWrong = state.answerState === "retry" && index === state.selectedAnswer;
    return '<button class="answer-card ' + (isCorrect ? "is-correct" : "") + ' ' + (isWrong ? "is-wrong" : "") +
      '" data-action="answer" data-index="' + index + '" ' + (locked ? "disabled" : "") + '>' +
      '<span class="answer-letter">' + (LETTERS[index] || (index + 1)) + '</span>' +
      '<span>' + escapeHtml(option) + '</span></button>';
  }).join("");

  const responderPanel = state.responder
    ? '<div class="responder-card">' +
        '<div class="responder-avatar">' + escapeHtml(initials(state.responder)) + '</div>' +
        '<div class="responder-copy"><span class="label">ĐÃ TRIỆU HỒI · TIỂU ĐỘI ' + escapeHtml(state.responder.squad) + '</span>' +
          '<strong>' + escapeHtml(fullName(state.responder)) + '</strong>' +
          '<small>' + (state.answerState ? "Đã hoàn thành lượt trả lời" : "Chọn một phương án A–F để trả lời") + '</small>' +
        '</div></div>'
    : '<div class="call-copy">' +
        '<span class="label">CÂU ' + String(state.questionIndex + 1).padStart(2, "0") + ' / ' + questions.length + ' · CHƯA CÓ NGƯỜI TRẢ LỜI</span>' +
        '<h2>AI SẼ TRẢ LỜI CÂU NÀY?</h2>' +
        '<p>Bấm triệu hồi để chọn ngẫu nhiên một tiểu đội, rồi một người trong tiểu đội đó. Cả lớp được gọi một lượt trước khi bắt đầu vòng tiếp theo.</p>' +
        '<div class="squad-meters">' + renderSquadMeters() + '</div>' +
      '</div>';

  app.innerHTML =
    '<div class="page page-mission">' +
      '<header class="mission-bar">' +
        '<button class="icon-button home-icon" data-action="home" title="Về màn hình chính">⌂</button>' +
        '<img src="./assets/logo-ute-emblem-B-zi-VGZ.webp" alt="" class="mini-emblem" />' +
        '<span class="mission-counter">CÂU <b>' + String(state.questionIndex + 1).padStart(2, "0") + '</b> / ' + String(questions.length).padStart(2, "0") + '</span>' +
        '<div class="mission-progress"><div class="progress-track"><i style="width:' + progress + '%"></i></div>' +
          '<small>' + escapeHtml(settings.missionLabel) + ' · HẠ ' + state.correctCount + ' · ĐIỂM ' + String(state.score).padStart(2, "0") + '</small></div>' +
        '<strong class="score-badge">' + state.score + '</strong>' +
        renderAudioControls() +
      '</header>' +
      '<main class="mission-content">' +
        '<section class="question-panel">' +
          '<div class="question-meta"><span>MỤC TIÊU ' + String(state.questionIndex + 1).padStart(2, "0") + ' / ' + questions.length + '</span><i></i><span>' + escapeHtml(question.sector) + '</span>' +
          '<span class="chance-label">CƠ HỘI ' + "◆".repeat(chancesRemaining) + '</span></div>' +
          '<p class="question-status">' + (state.responder ? "● ĐÃ TRIỆU HỒI" : "● CHỜ TRIỆU HỒI") + '</p>' +
          '<h1>' + escapeHtml(question.question) + '</h1>' +
          '<p class="question-hint">CHỌN 1 TRONG ' + question.options.length + ' PHƯƠNG ÁN · ' + chancesRemaining + ' CƠ HỘI · PHÍM A–F HOẶC 1–6</p>' +
        '</section>' +
        '<section class="call-panel">' + responderPanel +
          (state.responder ? "" : '<button class="button button-primary summon-button" data-action="summon"><span aria-hidden="true">▣</span> TRIỆU HỒI</button>') +
        '</section>' +
        '<section class="answers-grid" aria-label="Các phương án trả lời">' + choices + '</section>' +
        renderFeedback(question) +
      '</main>' +
      '<footer class="page-footer">DỮ LIỆU NHIỆM VỤ ĐƯỢC LƯU TRÊN TRÌNH DUYỆT NÀY</footer>' +
    '</div>';
}

function rosterRows() {
  const query = state.search.trim().toLocaleLowerCase("vi");
  const filtered = students.filter((student) => {
    const matchesSquad = state.squadFilter === "all" || Number(student.squad) === Number(state.squadFilter);
    const matchesQuery = !query || fullName(student).toLocaleLowerCase("vi").includes(query);
    return matchesSquad && matchesQuery;
  });

  if (!filtered.length) return '<li class="empty-row">Không tìm thấy thành viên phù hợp.</li>';
  return filtered.map((student) =>
    '<li class="student-row">' +
      '<span class="student-avatar">' + escapeHtml(initials(student)) + '</span>' +
      '<span class="student-name">' + escapeHtml(fullName(student)) + '</span>' +
      '<span class="student-squad">TIỂU ĐỘI ' + escapeHtml(student.squad) + '</span>' +
      '<span class="student-state ' + (calledIds.has(student.id) ? "called" : "") + '">' + (calledIds.has(student.id) ? "ĐÃ GỌI" : "CHƯA GỌI") + '</span>' +
    '</li>'
  ).join("");
}

function renderRoster() {
  const filters = ['<button data-action="filter-squad" data-squad="all" class="' + (state.squadFilter === "all" ? "selected" : "") + '">TẤT CẢ · ' + students.length + '</button>']
    .concat(squadNumbers().map((squad) => {
      const count = countBySquad(squad);
      return '<button data-action="filter-squad" data-squad="' + squad + '" class="' +
        (String(state.squadFilter) === String(squad) ? "selected" : "") + '">TĐ ' + squad + ' · ' + count.total + '</button>';
    })).join("");

  app.innerHTML =
    '<div class="page page-roster">' +
      renderTopLine() +
      '<main class="roster-content">' +
        '<div class="roster-heading">' +
          '<button class="text-button" data-action="home">← MÀN HÌNH CHÍNH</button>' +
          '<p class="eyebrow">' + escapeHtml(settings.courseLabel) + ' · DANH SÁCH</p>' +
          '<h1>DANH SÁCH LỚP</h1>' +
          '<p>Đã gọi ' + calledIds.size + '/' + students.length + ' thành viên trong vòng hiện tại.</p>' +
        '</div>' +
        '<div class="roster-tools">' +
          '<label class="search-box"><span aria-hidden="true">⌕</span><input data-field="search" type="search" placeholder="Tìm theo họ và tên…" value="' + escapeHtml(state.search) + '" /></label>' +
          '<div class="squad-filters">' + filters + '</div>' +
        '</div>' +
        '<ul class="student-list" id="student-list">' + rosterRows() + '</ul>' +
      '</main>' +
    '</div>';
}

function renderSummary() {
  const percent = Math.round((state.correctCount / questions.length) * 100);
  app.innerHTML =
    '<div class="page page-summary">' +
      renderTopLine() +
      '<main class="summary-card">' +
        '<div class="summary-mark">✓</div>' +
        '<p class="eyebrow">NHIỆM VỤ HOÀN TẤT</p>' +
        '<h1>KẾT QUẢ <span>SP-11</span></h1>' +
        '<p class="summary-description">' + escapeHtml(settings.description) + '</p>' +
        '<div class="summary-stats">' +
          '<div><strong>' + state.score + '</strong><span>ĐIỂM</span></div>' +
          '<div><strong>' + state.correctCount + '/' + questions.length + '</strong><span>MỤC TIÊU HOÀN THÀNH</span></div>' +
          '<div><strong>' + percent + '%</strong><span>CHÍNH XÁC</span></div>' +
        '</div>' +
        '<div class="home-actions">' +
          '<button class="button button-primary" data-action="start">CHƠI LẠI</button>' +
          '<button class="button button-quiet" data-action="home">MÀN HÌNH CHÍNH</button>' +
        '</div>' +
      '</main>' +
    '</div>';
}

function render() {
  if (state.screen === "home") renderHome();
  else if (state.screen === "mission") renderMission();
  else if (state.screen === "roster") renderRoster();
  else renderSummary();
}

function startMission() {
  state = {
    ...state,
    screen: "mission",
    questionIndex: 0,
    responder: null,
    attemptsLeft: Number(settings.attemptsPerQuestion) || 2,
    answerState: null,
    selectedAnswer: null,
    feedback: null,
    score: 0,
    correctCount: 0
  };
  sound("click");
  render();
}

function summonResponder() {
  let available = students.filter((student) => !calledIds.has(student.id));
  if (!available.length) {
    calledIds.clear();
    saveStored(STORAGE.called, []);
    available = students.slice();
  }

  const availableSquads = squadNumbers().filter((squad) =>
    available.some((student) => Number(student.squad) === squad)
  );
  const squad = randomItem(availableSquads);
  state.responder = randomItem(available.filter((student) => Number(student.squad) === squad));
  calledIds.add(state.responder.id);
  saveStored(STORAGE.called, [...calledIds]);
  state.attemptsLeft = Number(settings.attemptsPerQuestion) || 2;
  state.answerState = null;
  state.selectedAnswer = null;
  state.feedback = null;
  sound("summon");
  render();
}

function submitAnswer(index) {
  const question = questions[state.questionIndex];
  if (!state.responder || state.answerState === "correct" || state.answerState === "revealed") return;
  if (!Number.isInteger(index) || index < 0 || index >= question.options.length) return;

  state.selectedAnswer = index;
  if (index === Number(question.correctIndex)) {
    const maxAttempts = Number(settings.attemptsPerQuestion) || 2;
    const points = Math.round((Number(settings.pointsPerQuestion) || 100) * (0.6 + 0.4 * (state.attemptsLeft / maxAttempts)));
    state.score += points;
    state.correctCount += 1;
    state.answerState = "correct";
    state.feedback = { points };
    const best = Math.max(Number(readStored(STORAGE.best, 0)) || 0, state.score);
    saveStored(STORAGE.best, best);
    sound("correct");
  } else {
    state.attemptsLeft = Math.max(0, state.attemptsLeft - 1);
    if (state.attemptsLeft === 0) state.answerState = "revealed";
    else state.answerState = "retry";
    sound("wrong");
  }
  render();
}

function nextQuestion() {
  if (state.questionIndex + 1 >= questions.length) {
    state.screen = "summary";
    render();
    return;
  }
  state.questionIndex += 1;
  state.responder = null;
  state.attemptsLeft = Number(settings.attemptsPerQuestion) || 2;
  state.answerState = null;
  state.selectedAnswer = null;
  state.feedback = null;
  render();
}

function returnHome() {
  state.screen = "home";
  state.search = "";
  state.squadFilter = "all";
  render();
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.pref) {
    const pref = button.dataset.pref;
    preferences[pref] = !preferences[pref];
    savePreferences();
    render();
    sound("click");
    return;
  }

  switch (button.dataset.action) {
    case "start":
      startMission();
      break;
    case "roster":
      state.screen = "roster";
      render();
      break;
    case "home":
      returnHome();
      break;
    case "summon":
      summonResponder();
      break;
    case "answer":
      submitAnswer(Number(button.dataset.index));
      break;
    case "next":
      nextQuestion();
      break;
    case "filter-squad":
      state.squadFilter = button.dataset.squad;
      renderRoster();
      break;
  }
});

app.addEventListener("input", (event) => {
  if (event.target.matches('[data-field="search"]')) {
    state.search = event.target.value;
    const list = document.querySelector("#student-list");
    if (list) list.innerHTML = rosterRows();
  }
});

document.addEventListener("keydown", (event) => {
  if (state.screen !== "mission" || !state.responder || event.altKey || event.ctrlKey || event.metaKey) return;
  const key = event.key.toUpperCase();
  const letterIndex = LETTERS.indexOf(key);
  const numericIndex = Number.parseInt(key, 10) - 1;
  const index = letterIndex >= 0 ? letterIndex : numericIndex;
  if (index >= 0 && index < questions[state.questionIndex].options.length) submitAnswer(index);
});

async function loadContent() {
  const [loadedSettings, loadedQuestions, loadedStudents] = await Promise.all([
    fetch("./data/settings.json").then((response) => response.json()),
    fetch("./data/questions.json").then((response) => response.json()),
    fetch("./data/students.json").then((response) => response.json())
  ]);
  settings = loadedSettings;
  questions = loadedQuestions;
  students = loadedStudents;
  if (!Array.isArray(questions) || !questions.length || !Array.isArray(students) || !students.length) {
    throw new Error("Dữ liệu câu hỏi hoặc danh sách lớp đang trống.");
  }
  render();
}

loadContent().catch((error) => {
  app.innerHTML = '<main class="loading-screen load-error"><span class="loading-mark">HCM-UTE</span><h1>KHÔNG TẢI ĐƯỢC DỮ LIỆU</h1><p>' +
    escapeHtml(error.message) + '</p><small>Kiểm tra các tệp trong thư mục data/ rồi tải lại trang.</small></main>';
});



