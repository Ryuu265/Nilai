(() => {
'use strict';

// ===================== UTILITIES =====================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
const fmtDate = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtDateTime = d => new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ===================== STATE =====================
let state = {
  currentUser: null,
  users: [],
  classes: [],
  exams: [],
  sheets: [],
  auditLog: [],
  route: { view: 'login', params: {} },
  ui: {
    drawerOpen: false,
    showNames: false,
    activeTab: 'exams',
    reviewSheetId: null,
    reviewSheetIndex: 0,
  }
};

// ===================== SAMPLE DATA =====================
function initSampleData() {
  const userId = 'u1';
  const classId = 'c1';
  const examId = 'e1';

  state.users = [{ id: userId, name: 'Bu Sari', email: 'guru@koreksikilat.app', password: 'guru123' }];

  state.classes = [{
    id: classId, userId, name: '5A',
    students: [
      { id: 's1', code: '5A-01', name: 'Adi Pratama' },
      { id: 's2', code: '5A-05', name: 'Bunga Lestari' },
      { id: 's3', code: '5A-10', name: 'Citra Dewi' },
      { id: 's4', code: '5A-12', name: 'Dimas Saputra' },
      { id: 's5', code: '5A-15', name: 'Eka Putri' },
    ]
  }];

  state.exams = [{
    id: examId, classId, userId,
    name: 'Ulangan Matematika Bab 3',
    date: '2026-10-15',
    status: 'ready',
    numQuestions: 10,
    answerKey: { 1:'B', 2:'C', 3:'A', 4:'D', 5:'B', 6:'A', 7:'C', 8:'B', 9:'D', 10:'A' },
    weights: { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1 },
    penalty: 0,
    formula: '',
    createdAt: '2026-10-14T08:00:00'
  }];

  state.sheets = [
    {
      id: 'sh1', examId, classId,
      studentCode: '5A-01',
      answers: { 1:'B', 2:'C', 3:'A', 4:'D', 5:'B', 6:'A', 7:'C', 8:'B', 9:'D', 10:'A' },
      statuses: { 1:'correct', 2:'correct', 3:'correct', 4:'correct', 5:'correct', 6:'correct', 7:'correct', 8:'correct', 9:'correct', 10:'correct' },
      status: 'done', rawScore: 10, finalScore: 100,
      imageUrl: null,
      gradedAt: '2026-10-15T10:00:00'
    },
    {
      id: 'sh2', examId, classId,
      studentCode: '5A-05',
      answers: { 1:'B', 2:'C', 3:'B', 4:'D', 5:'B', 6:'A', 7:'C', 8:'A', 9:'D', 10:'B' },
      statuses: { 1:'correct', 2:'correct', 3:'wrong', 4:'correct', 5:'correct', 6:'correct', 7:'correct', 8:'wrong', 9:'correct', 10:'wrong' },
      status: 'done', rawScore: 7, finalScore: 70,
      imageUrl: null,
      gradedAt: '2026-10-15T10:05:00'
    },
    {
      id: 'sh3', examId, classId,
      studentCode: '5A-10',
      answers: { 1:'B', 2:'C', 3:'A', 4:'C', 5:'B', 6:'A', 7:'C', 8:'B', 9:'D', 10:'A' },
      statuses: { 1:'correct', 2:'correct', 3:'correct', 4:'wrong', 5:'correct', 6:'correct', 7:'correct', 8:'correct', 9:'correct', 10:'correct' },
      status: 'done', rawScore: 9, finalScore: 90,
      imageUrl: null,
      gradedAt: '2026-10-15T10:10:00'
    },
    {
      id: 'sh4', examId, classId,
      studentCode: '5A-12',
      answers: { 1:'B', 2:'A', 3:'A', 4:'D', 5:'C', 6:'A', 7:'C', 8:'B', 9:'A', 10:'A' },
      statuses: { 1:'correct', 2:'wrong', 3:'correct', 4:'correct', 5:'wrong', 6:'correct', 7:'correct', 8:'correct', 9:'wrong', 10:'correct' },
      status: 'done', rawScore: 7, finalScore: 70,
      imageUrl: null,
      gradedAt: '2026-10-15T10:15:00'
    },
    {
      id: 'sh5', examId, classId,
      studentCode: '5A-15',
      answers: { 1:'B', 2:'C', 3:'A', 4:'D', 5:'B', 6:'C', 7:'A', 8:'B', 9:'D', 10:'C' },
      statuses: { 1:'correct', 2:'correct', 3:'correct', 4:'correct', 5:'correct', 6:'wrong', 7:'wrong', 8:'correct', 9:'correct', 10:'wrong' },
      status: 'done', rawScore: 7, finalScore: 70,
      imageUrl: null,
      gradedAt: '2026-10-15T10:20:00'
    }
  ];

  state.auditLog = [
    { id: uid(), timestamp: '2026-10-14T08:00:00', userId, action: 'Membuat kelas 5A' },
    { id: uid(), timestamp: '2026-10-14T09:00:00', userId, action: 'Membuat ulangan "Ulangan Matematika Bab 3"' },
    { id: uid(), timestamp: '2026-10-15T09:00:00', userId, action: 'Mengonfirmasi kunci jawaban' },
  ];
}

// ===================== STORAGE =====================
function saveState() {
  try {
    const data = {
      users: state.users,
      classes: state.classes,
      exams: state.exams,
      sheets: state.sheets,
      auditLog: state.auditLog,
      currentUser: state.currentUser,
    };
    localStorage.setItem('koreksikilat_data', JSON.stringify(data));
  } catch (e) { console.warn('Gagal menyimpan:', e); }
}

function loadState() {
  try {
    const raw = localStorage.getItem('koreksikilat_data');
    if (raw) {
      const data = JSON.parse(raw);
      state.users = data.users || [];
      state.classes = data.classes || [];
      state.exams = data.exams || [];
      state.sheets = data.sheets || [];
      state.auditLog = data.auditLog || [];
      state.currentUser = data.currentUser || null;
      return true;
    }
  } catch (e) { console.warn('Gagal memuat:', e); }
  return false;
}

// ===================== AUDIT LOG =====================
function addAudit(action) {
  state.auditLog.push({
    id: uid(),
    timestamp: new Date().toISOString(),
    userId: state.currentUser?.id,
    action
  });
  saveState();
}

// ===================== TOAST =====================
function showToast(msg, type = '') {
  const container = $('#toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.remove(); }, 3000);
}

// ===================== MODAL =====================
function showModal(html, wide = false) {
  const overlay = $('#modal-overlay');
  const container = $('#modal-container');
  container.innerHTML = html;
  container.className = `modal-container ${wide ? 'wide' : ''}`;
  overlay.classList.remove('hidden');
  container.classList.remove('hidden');
}

function hideModal() {
  $('#modal-overlay').classList.add('hidden');
  $('#modal-container').classList.add('hidden');
}

function closeModalOnOverlay(e) {
  if (e.target.id === 'modal-overlay') hideModal();
}

// ===================== AUTH =====================
function login(email, password) {
  const user = state.users.find(u => u.email === email && u.password === password);
  if (user) {
    state.currentUser = user;
    saveState();
    navigate('home');
    showToast(`Selamat datang, ${user.name}!`, 'success');
  } else {
    showToast('Email atau kata sandi salah', 'error');
  }
}

function register(name, email, password) {
  if (state.users.find(u => u.email === email)) {
    showToast('Email sudah terdaftar', 'error');
    return;
  }
  const user = { id: uid(), name, email, password };
  state.users.push(user);
  state.currentUser = user;
  saveState();
  addAudit(`Akun dibuat: ${name}`);
  navigate('home');
  showToast('Akun berhasil dibuat!', 'success');
}

function logout() {
  state.currentUser = null;
  state.ui.drawerOpen = false;
  saveState();
  navigate('login');
}

// ===================== ROUTER =====================
function navigate(view, params = {}) {
  state.route = { view, params };
  state.ui.drawerOpen = false;
  render();
  window.scrollTo(0, 0);
}

// ===================== HELPERS =====================
function getMyClasses() {
  return state.classes.filter(c => c.userId === state.currentUser?.id);
}

function getClassById(id) {
  return state.classes.find(c => c.id === id);
}

function getExamById(id) {
  return state.exams.find(e => e.id === id);
}

function getExamsByClass(classId) {
  return state.exams.filter(e => e.classId === classId);
}

function getSheetsByExam(examId) {
  return state.sheets.filter(s => s.examId === examId);
}

function calcSheetScore(sheet, exam) {
  if (!exam || !sheet) return { correct: 0, wrong: 0, empty: 0, check: 0, rawScore: 0, finalScore: null };
  let correct = 0, wrong = 0, empty = 0, check = 0, rawScore = 0;
  const wrongNums = [], checkNums = [];

  for (let i = 1; i <= exam.numQuestions; i++) {
    const st = sheet.statuses?.[i] || 'empty';
    const w = exam.weights?.[i] || 1;
    if (st === 'correct') { correct++; rawScore += w; }
    else if (st === 'wrong') { wrong++; wrongNums.push(i); rawScore -= (exam.penalty || 0); }
    else if (st === 'empty') empty++;
    else if (st === 'check') { check++; checkNums.push(i); }
  }

  let finalScore = null;
  if (exam.formula && exam.formula.trim()) {
    try {
      const maxScore = Object.values(exam.weights).reduce((a, b) => a + b, 0);
      const expr = exam.formula
        .replace(/skor/gi, rawScore)
        .replace(/bobot/gi, maxScore)
        .replace(/benar/gi, correct)
        .replace(/salah/gi, wrong)
        .replace(/kosong/gi, empty);
      finalScore = Math.round(Function('"use strict"; return (' + expr + ')')() * 100) / 100;
    } catch (e) { finalScore = null; }
  }

  return { correct, wrong, empty, check, rawScore, finalScore, wrongNums, checkNums };
}

function statusLabel(s) {
  const map = { draft: 'Draf', pending: 'Menunggu Konfirmasi Kunci', ready: 'Siap Dinilai', done: 'Selesai' };
  return map[s] || s;
}

function statusBadgeClass(s) {
  const map = { draft: 'badge-gray', pending: 'badge-warning', ready: 'badge-info', done: 'badge-success' };
  return map[s] || 'badge-gray';
}

function sheetStatusBadge(s) {
  const map = {
    pending: ['badge-warning', 'Belum Tercocokkan'],
    reviewing: ['badge-warning', 'Cek Guru'],
    done: ['badge-success', 'Selesai']
  };
  return map[s] || ['badge-gray', s];
}

function parseBubbleCode(code) {
  if (!code) return null;
  const m = code.match(/^(\d)([A-F])(\d)(\d)$/);
  if (!m) return null;
  return { kelas: m[1], kelasHuruf: m[2], absenPul: m[3], absenSat: m[4], display: `${m[1]}${m[2]}-${m[3]}${m[4]}` };
}

function sanitizeExcelValue(v) {
  if (typeof v !== 'string') return v;
  if (/^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

// ===================== RENDER =====================
function render() {
  const app = $('#app');
  if (state.route.view === 'login') {
    app.innerHTML = renderLogin();
    return;
  }
  if (!state.currentUser) { navigate('login'); return; }

  app.innerHTML = renderShell();
  bindGlobalEvents();

  const content = $('#main-content');
  switch (state.route.view) {
    case 'home': content.innerHTML = renderHome(); break;
    case 'class': content.innerHTML = renderClass(); break;
    case 'exam': content.innerHTML = renderExam(); break;
    case 'review': content.innerHTML = renderReview(); break;
    case 'settings': content.innerHTML = renderSettings(); break;
    default: content.innerHTML = renderHome();
  }
  bindViewEvents();
}

function renderShell() {
  const u = state.currentUser;
  const initial = u.name.charAt(0).toUpperCase();
  return `
    <header class="header">
      <div class="header-left">
        <button class="icon-btn" data-action="toggle-drawer"><span class="material-icons">menu</span></button>
      </div>
      <div class="header-center">
        <h1 class="header-title">${getHeaderTitle()}</h1>
      </div>
      <div class="header-right">
        ${state.route.view === 'home' ? '<button class="icon-btn" data-action="create-class"><span class="material-icons">add</span></button>' : ''}
        <div class="avatar">${esc(initial)}</div>
      </div>
    </header>
    <div class="drawer-overlay ${state.ui.drawerOpen ? 'open' : ''}" data-action="close-drawer"></div>
    <nav class="drawer ${state.ui.drawerOpen ? 'open' : ''}">
      <div class="drawer-header">
        <div class="avatar">${esc(initial)}</div>
        <div>
          <div class="drawer-user-name">${esc(u.name)}</div>
          <div class="drawer-user-email">${esc(u.email)}</div>
        </div>
      </div>
      <div class="drawer-nav">
        <button class="drawer-item ${state.route.view === 'home' ? 'active' : ''}" data-action="nav" data-view="home">
          <span class="material-icons">home</span> Beranda
        </button>
        <button class="drawer-item ${state.route.view === 'class' ? 'active' : ''}" data-action="nav" data-view="class">
          <span class="material-icons">class</span> Kelas
        </button>
        <button class="drawer-item ${state.route.view === 'settings' ? 'active' : ''}" data-action="nav" data-view="settings">
          <span class="material-icons">settings</span> Pengaturan
        </button>
      </div>
    </nav>
    <div class="main">
      <div class="content" id="main-content"></div>
    </div>
  `;
}

function getHeaderTitle() {
  switch (state.route.view) {
    case 'home': return 'KoreksiKilat';
    case 'class': {
      const c = getClassById(state.route.params.classId);
      return c ? `Kelas ${esc(c.name)}` : 'Kelas';
    }
    case 'exam': {
      const e = getExamById(state.route.params.examId);
      return e ? esc(e.name) : 'Ulangan';
    }
    case 'review': return 'Tinjau Lembar';
    case 'settings': return 'Pengaturan';
    default: return 'KoreksiKilat';
  }
}

// ===================== LOGIN VIEW =====================
function renderLogin() {
  return `
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">
          <span class="material-icons">bolt</span>
          <h1>KoreksiKilat</h1>
        </div>
        <p class="login-subtitle">Penilaian jawaban cepat untuk guru SD</p>
        <div id="login-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" id="login-email" placeholder="guru@sekolah.id" value="guru@koreksikilat.app">
          </div>
          <div class="form-group">
            <label>Kata Sandi</label>
            <input type="password" class="form-input" id="login-password" placeholder="Masukkan kata sandi" value="guru123">
          </div>
          <button class="btn btn-primary btn-full" data-action="do-login">Masuk</button>
          <p class="login-toggle">Belum punya akun? <a data-action="show-register">Daftar di sini</a></p>
        </div>
        <div id="register-form" class="hidden">
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input type="text" class="form-input" id="reg-name" placeholder="Nama Anda">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" id="reg-email" placeholder="guru@sekolah.id">
          </div>
          <div class="form-group">
            <label>Kata Sandi</label>
            <input type="password" class="form-input" id="reg-password" placeholder="Minimal 6 karakter">
          </div>
          <button class="btn btn-primary btn-full" data-action="do-register">Daftar</button>
          <p class="login-toggle">Sudah punya akun? <a data-action="show-login">Masuk di sini</a></p>
        </div>
      </div>
    </div>
  `;
}

// ===================== HOME VIEW =====================
function renderHome() {
  const classes = getMyClasses();
  const colors = ['#1a73e8', '#0d904f', '#e8710a', '#9334e6', '#d93025', '#185abc'];

  let cards = classes.map((c, i) => `
    <div class="class-card" data-action="open-class" data-class-id="${c.id}">
      <div class="class-card-header" style="background:${colors[i % colors.length]}">
        <h3>${esc(c.name)}</h3>
      </div>
      <div class="class-card-body">
        <span>${c.students.length} siswa</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="section-header">
      <h2>Kelas Anda</h2>
    </div>
    <div class="card-grid">
      ${cards}
      <button class="add-card" data-action="create-class">
        <span class="material-icons">add</span>
        <span>Buat Kelas</span>
      </button>
    </div>
    ${classes.length === 0 ? `
      <div class="empty-state">
        <span class="material-icons">class</span>
        <h3>Belum ada kelas</h3>
        <p>Buat kelas pertama Anda untuk mulai menilai</p>
      </div>
    ` : ''}
  `;
}

// ===================== CLASS VIEW =====================
function renderClass() {
  const cls = getClassById(state.route.params.classId);
  if (!cls) return '<div class="empty-state"><h3>Kelas tidak ditemukan</h3></div>';

  const tab = state.ui.activeTab;
  let tabContent = '';
  if (tab === 'exams') tabContent = renderExamTab(cls);
  else if (tab === 'students') tabContent = renderStudentTab(cls);
  else if (tab === 'grades') tabContent = renderGradeTab(cls);

  return `
    <button class="back-btn mb-12" data-action="nav" data-view="home">
      <span class="material-icons" style="font-size:18px">arrow_back</span> Beranda
    </button>
    <div class="tabs">
      <button class="tab ${tab === 'exams' ? 'active' : ''}" data-action="tab" data-tab="exams">Ulangan</button>
      <button class="tab ${tab === 'students' ? 'active' : ''}" data-action="tab" data-tab="students">Siswa</button>
      <button class="tab ${tab === 'grades' ? 'active' : ''}" data-action="tab" data-tab="grades">Rekap Nilai</button>
    </div>
    ${tabContent}
    ${tab === 'exams' ? `
      <button class="fab" data-action="create-exam" data-class-id="${cls.id}">
        <span class="material-icons">add</span>
      </button>
    ` : ''}
  `;
}

function renderExamTab(cls) {
  const exams = getExamsByClass(cls.id);
  if (exams.length === 0) {
    return `
      <div class="empty-state">
        <span class="material-icons">assignment</span>
        <h3>Belum ada ulangan</h3>
        <p>Buat ulangan pertama untuk kelas ini</p>
        <button class="btn btn-primary" data-action="create-exam" data-class-id="${cls.id}">
          <span class="material-icons">add</span> Buat Ulangan
        </button>
      </div>
    `;
  }

  return `<div class="exam-list">${exams.map(e => {
    const sheets = getSheetsByExam(e.id);
    const doneCount = sheets.filter(s => s.status === 'done').length;
    return `
      <div class="exam-card" data-action="open-exam" data-exam-id="${e.id}" data-class-id="${cls.id}">
        <div class="exam-card-icon">
          <span class="material-icons">assignment</span>
        </div>
        <div class="exam-card-info">
          <h4>${esc(e.name)}</h4>
          <p>${fmtDate(e.date)} &middot; ${e.numQuestions} soal &middot; ${doneCount}/${cls.students.length} lembar dinilai</p>
        </div>
        <span class="badge ${statusBadgeClass(e.status)}">${statusLabel(e.status)}</span>
      </div>
    `;
  }).join('')}</div>`;
}

function renderStudentTab(cls) {
  const showNames = state.ui.showNames;
  return `
    <div class="toggle-row">
      <div class="toggle ${showNames ? 'on' : ''}" data-action="toggle-names"></div>
      <span class="toggle-label">Tampilkan nama siswa</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>No</th><th>Kode</th><th>Nama</th></tr></thead>
        <tbody>
          ${cls.students.map((s, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${esc(s.code)}</strong></td>
              <td>${showNames ? esc(s.name) : '••••••'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderGradeTab(cls) {
  const exams = getExamsByClass(cls.id);
  if (exams.length === 0) {
    return '<div class="empty-state"><p>Belum ada ulangan untuk ditampilkan</p></div>';
  }

  const showNames = state.ui.showNames;

  return `
    <div class="toggle-row">
      <div class="toggle ${showNames ? 'on' : ''}" data-action="toggle-names"></div>
      <span class="toggle-label">Tampilkan nama siswa</span>
    </div>
    <div class="flex gap-8 mb-16">
      <button class="btn btn-success btn-sm" data-action="export-excel" data-class-id="${cls.id}">
        <span class="material-icons" style="font-size:18px">download</span> Unduh Excel
      </button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            ${showNames ? '<th>Nama</th>' : ''}
            ${exams.map(e => `<th title="${esc(e.name)}">${esc(e.name.substring(0, 15))}${e.name.length > 15 ? '...' : ''}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${cls.students.map(s => {
            return `<tr>
              <td><strong>${esc(s.code)}</strong></td>
              ${showNames ? `<td>${esc(s.name)}</td>` : ''}
              ${exams.map(e => {
                const sheet = state.sheets.find(sh => sh.examId === e.id && sh.studentCode === s.code);
                if (!sheet) return '<td class="text-secondary">-</td>';
                const fs = sheet.finalScore != null ? sheet.finalScore : (sheet.rawScore != null ? sheet.rawScore : '-');
                return `<td><strong>${fs}</strong></td>`;
              }).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ===================== EXAM VIEW =====================
function renderExam() {
  const exam = getExamById(state.route.params.examId);
  const cls = getClassById(state.route.params.classId || state.exams.find(e => e.id === state.route.params.examId)?.classId);
  if (!exam || !cls) return '<div class="empty-state"><h3>Ulangan tidak ditemukan</h3></div>';

  const sheets = getSheetsByExam(exam.id);
  const doneCount = sheets.filter(s => s.status === 'done').length;
  const pendingCount = sheets.filter(s => s.status === 'pending').length;

  return `
    <button class="back-btn mb-12" data-action="nav" data-view="class" data-class-id="${cls.id}">
      <span class="material-icons" style="font-size:18px">arrow_back</span> Kelas ${esc(cls.name)}
    </button>

    <div class="flex items-center justify-between mb-16">
      <div>
        <h2 style="font-size:1.2rem;font-weight:500">${esc(exam.name)}</h2>
        <p class="text-sm text-secondary">${fmtDate(exam.date)} &middot; ${exam.numQuestions} soal</p>
      </div>
      <span class="badge ${statusBadgeClass(exam.status)}">${statusLabel(exam.status)}</span>
    </div>

    <div class="card-grid mb-20" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
      <div class="score-panel" style="margin:0">
        <div class="score-item">
          <div class="label">Status</div>
          <div class="value text-sm">${statusLabel(exam.status)}</div>
        </div>
      </div>
      <div class="score-panel" style="margin:0">
        <div class="score-item">
          <div class="label">Dinilai</div>
          <div class="value">${doneCount}/${cls.students.length}</div>
        </div>
      </div>
      <div class="score-panel" style="margin:0">
        <div class="score-item">
          <div class="label">Perlu Tinjauan</div>
          <div class="value" style="color:var(--warning)">${pendingCount}</div>
        </div>
      </div>
    </div>

    <div class="flex gap-8 mb-20" style="flex-wrap:wrap">
      ${exam.status === 'pending' ? `
        <button class="btn btn-primary" data-action="confirm-key" data-exam-id="${exam.id}">
          <span class="material-icons" style="font-size:18px">check_circle</span> Konfirmasi Kunci
        </button>
      ` : ''}
      ${exam.status === 'ready' || exam.status === 'done' ? `
        <button class="btn btn-outline" data-action="edit-key" data-exam-id="${exam.id}">
          <span class="material-icons" style="font-size:18px">edit</span> Ubah Kunci
        </button>
      ` : ''}
      ${(exam.status === 'ready' || exam.status === 'done') ? `
        <button class="btn btn-primary" data-action="upload-sheets" data-exam-id="${exam.id}" data-class-id="${cls.id}">
          <span class="material-icons" style="font-size:18px">camera_alt</span> Nilai Lembar
        </button>
      ` : ''}
      <button class="btn btn-outline" data-action="download-template" data-exam-id="${exam.id}">
        <span class="material-icons" style="font-size:18px">picture_as_pdf</span> Unduh Template
      </button>
    </div>

    <h3 class="mb-12" style="font-size:1rem;font-weight:500">Kunci Jawaban</h3>
    <div class="table-wrap mb-20">
      <table class="key-table">
        <thead>
          <tr>
            ${Array.from({length: exam.numQuestions}, (_, i) => `<th>${i + 1}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            ${Array.from({length: exam.numQuestions}, (_, i) => {
              const n = i + 1;
              return `<td><strong>${exam.answerKey[n] || '-'}</strong> <span class="text-xs text-secondary">(${exam.weights[n] || 1})</span></td>`;
            }).join('')}
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="mb-12" style="font-size:1rem;font-weight:500">Lembar Jawaban (${sheets.length})</h3>
    ${sheets.length === 0 ? `
      <div class="empty-state">
        <span class="material-icons">photo_camera</span>
        <h3>Belum ada lembar</h3>
        <p>Unggah foto atau scan lembar jawaban untuk mulai menilai</p>
      </div>
    ` : `
      <div class="sheet-list">
        ${sheets.map((s, idx) => {
          const [badgeCls, badgeText] = sheetStatusBadge(s.status);
          const student = cls.students.find(st => st.code === s.studentCode);
          return `
            <div class="sheet-item" data-action="open-review" data-sheet-id="${s.id}" data-exam-id="${exam.id}" data-index="${idx}">
              <div class="sheet-thumb" style="background:${s.status === 'done' ? 'var(--success-light)' : 'var(--warning-light)'};display:flex;align-items:center;justify-content:center;">
                <span class="material-icons" style="font-size:20px;color:${s.status === 'done' ? 'var(--success)' : 'var(--warning)'}">
                  ${s.status === 'done' ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div class="sheet-info">
                <div class="name">${esc(s.studentCode || 'Belum tercocokkan')} ${student && state.ui.showNames ? ` - ${esc(student.name)}` : ''}</div>
                <div class="meta">Benar: ${Object.values(s.statuses || {}).filter(v => v === 'correct').length}/${exam.numQuestions} &middot; Skor: ${s.rawScore ?? '-'}</div>
              </div>
              <span class="badge ${badgeCls}">${badgeText}</span>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}

// ===================== REVIEW VIEW =====================
function renderReview() {
  const sheet = state.sheets.find(s => s.id === state.ui.reviewSheetId);
  const exam = sheet ? getExamById(sheet.examId) : null;
  const cls = exam ? getClassById(exam.classId) : null;

  if (!sheet || !exam || !cls) {
    return '<div class="empty-state"><h3>Lembar tidak ditemukan</h3><button class="btn btn-primary" data-action="nav" data-view="home">Kembali</button></div>';
  }

  const score = calcSheetScore(sheet, exam);
  const sheets = getSheetsByExam(exam.id);
  const idx = state.ui.reviewSheetIndex;

  let answerRows = '';
  for (let i = 1; i <= exam.numQuestions; i++) {
    const ans = sheet.answers?.[i] || '';
    const st = sheet.statuses?.[i] || 'empty';
    const key = exam.answerKey[i] || '';
    const rowClass = st === 'correct' ? 'correct' : st === 'wrong' ? 'wrong' : st === 'check' ? 'check' : '';

    answerRows += `
      <div class="answer-row ${rowClass}">
        <span class="answer-num">${i}</span>
        <span class="answer-key">${key}</span>
        <div class="answer-options">
          ${['A','B','C','D'].map(opt => {
            let cls2 = 'answer-opt';
            if (ans === opt) {
              if (st === 'correct') cls2 += ' correct-opt';
              else if (st === 'wrong') cls2 += ' wrong-opt';
              else if (st === 'check') cls2 += ' check-opt';
              else cls2 += ' selected';
            }
            return `<button class="${cls2}" data-action="set-answer" data-sheet-id="${sheet.id}" data-num="${i}" data-val="${opt}">${opt}</button>`;
          }).join('')}
          <button class="answer-opt ${ans === '' && st === 'empty' ? 'selected' : ''}" data-action="set-answer" data-sheet-id="${sheet.id}" data-num="${i}" data-val="" style="font-size:.6rem">-</button>
        </div>
        <div class="answer-status">
          ${st === 'correct' ? '<span class="material-icons" style="color:var(--success)">check</span>' : ''}
          ${st === 'wrong' ? '<span class="material-icons" style="color:var(--danger)">close</span>' : ''}
          ${st === 'check' ? '<span class="material-icons" style="color:var(--warning)">help</span>' : ''}
        </div>
      </div>
    `;
  }

  const bubbleCode = parseBubbleCode(sheet.studentCode);

  return `
    <div class="flex items-center justify-between mb-16">
      <button class="back-btn" data-action="nav" data-view="exam" data-exam-id="${exam.id}" data-class-id="${cls.id}">
        <span class="material-icons" style="font-size:18px">arrow_back</span> Kembali
      </button>
      <div class="flex gap-8">
        ${idx > 0 ? `<button class="btn btn-outline btn-sm" data-action="prev-sheet"><span class="material-icons" style="font-size:18px">chevron_left</span> Sebelumnya</button>` : ''}
        ${idx < sheets.length - 1 ? `<button class="btn btn-outline btn-sm" data-action="next-sheet">Selanjutnya <span class="material-icons" style="font-size:18px">chevron_right</span></button>` : ''}
      </div>
    </div>

    ${sheet.status === 'pending' ? `
      <div class="bubble-code-panel">
        <h4>Kode Siswa (Bulatan)</h4>
        <p class="text-xs text-secondary mb-12">Lembar belum tercocokkan. Pilih siswa secara manual atau isi kode di bawah:</p>
        <div class="bubble-grid mb-12">
          <div class="bubble-col">
            <div class="bubble-col-label">Kelas</div>
            ${[1,2,3,4,5,6].map(n => `<div class="bubble-circle ${bubbleCode?.kelas == n ? 'filled' : ''}" data-action="set-bubble" data-col="kelas" data-val="${n}">${n}</div>`).join('')}
          </div>
          <div class="bubble-col">
            <div class="bubble-col-label">Kelas</div>
            ${['A','B','C','D','E','F'].map(l => `<div class="bubble-circle ${bubbleCode?.kelasHuruf === l ? 'filled' : ''}" data-action="set-bubble" data-col="huruf" data-val="${l}">${l}</div>`).join('')}
          </div>
          <div class="bubble-col">
            <div class="bubble-col-label">Pul.</div>
            ${[0,1,2,3,4,5,6,7,8,9].map(n => `<div class="bubble-circle ${bubbleCode?.absenPul == n ? 'filled' : ''}" data-action="set-bubble" data-col="puluhan" data-val="${n}">${n}</div>`).join('')}
          </div>
          <div class="bubble-col">
            <div class="bubble-col-label">Sat.</div>
            ${[0,1,2,3,4,5,6,7,8,9].map(n => `<div class="bubble-circle ${bubbleCode?.absenSat == n ? 'filled' : ''}" data-action="set-bubble" data-col="satuan" data-val="${n}">${n}</div>`).join('')}
          </div>
        </div>
        <div class="flex gap-8">
          <select class="form-input" id="manual-student" style="flex:1">
            <option value="">-- Pilih Siswa --</option>
            ${cls.students.map(s => `<option value="${esc(s.code)}" ${sheet.studentCode === s.code ? 'selected' : ''}>${esc(s.code)} - ${esc(s.name)}</option>`).join('')}
          </select>
          <button class="btn btn-primary btn-sm" data-action="assign-student" data-sheet-id="${sheet.id}">Cocokkan</button>
        </div>
      </div>
    ` : ''}

    <div class="review-layout">
      <div class="review-image-panel">
        ${sheet.imageUrl ? `<img src="${sheet.imageUrl}" alt="Lembar jawaban">` : `
          <div style="padding:40px;text-align:center;background:#f8f9fa;">
            <span class="material-icons" style="font-size:64px;color:var(--border)">image</span>
            <p class="text-sm text-secondary mt-8">Foto lembar jawaban</p>
          </div>
        `}
        <div class="review-image-info">
          <div class="flex items-center justify-between">
            <strong class="text-sm">${esc(sheet.studentCode || 'Belum tercocokkan')}</strong>
            <span class="badge ${sheetStatusBadge(sheet.status)[0]}">${sheetStatusBadge(sheet.status)[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="review-answer-panel">
          <div class="review-answer-header">
            <h3>Jawaban Terbaca</h3>
            <span class="text-xs text-secondary">${fmtDateTime(sheet.gradedAt || new Date())}</span>
          </div>
          <div class="answer-grid">
            ${answerRows}
          </div>
        </div>

        <div class="score-panel">
          <div class="score-grid">
            <div class="score-item">
              <div class="label">Benar</div>
              <div class="value" style="color:var(--success)">${score.correct}</div>
            </div>
            <div class="score-item">
              <div class="label">Salah</div>
              <div class="value" style="color:var(--danger)">${score.wrong}</div>
            </div>
            <div class="score-item">
              <div class="label">Kosong</div>
              <div class="value">${score.empty}</div>
            </div>
            <div class="score-item">
              <div class="label">Cek Guru</div>
              <div class="value" style="color:var(--warning)">${score.check}</div>
            </div>
            <div class="score-item">
              <div class="label">Skor Mentah</div>
              <div class="value">${score.rawScore}</div>
            </div>
            <div class="score-item">
              <div class="label">Nilai Akhir</div>
              <div class="value">${score.finalScore != null ? score.finalScore : '-'}</div>
            </div>
          </div>
          ${score.wrongNums.length > 0 ? `<p class="text-xs text-secondary mt-8">Nomor salah: ${score.wrongNums.join(', ')}</p>` : ''}
          ${score.checkNums.length > 0 ? `<p class="text-xs text-secondary mt-8" style="color:var(--warning)">Perlu tinjauan: ${score.checkNums.join(', ')}</p>` : ''}
        </div>

        <div class="flex gap-8 mt-16">
          <button class="btn btn-success" data-action="confirm-sheet" data-sheet-id="${sheet.id}">
            <span class="material-icons" style="font-size:18px">check_circle</span> Konfirmasi & Selesai
          </button>
          <button class="btn btn-danger" data-action="delete-sheet" data-sheet-id="${sheet.id}">
            <span class="material-icons" style="font-size:18px">delete</span> Hapus
          </button>
        </div>
      </div>
    </div>
  `;
}

// ===================== SETTINGS VIEW =====================
function renderSettings() {
  return `
    <h2 class="mb-20" style="font-size:1.2rem;font-weight:500">Pengaturan</h2>

    <div class="score-panel mb-16">
      <h3 style="font-size:1rem;font-weight:500;margin-bottom:12px">Privasi & Data</h3>
      <div class="form-group">
        <label>Simpan foto lembar jawaban</label>
        <select class="form-input" id="photo-retention">
          <option value="7">7 hari</option>
          <option value="30">30 hari</option>
          <option value="0">Hapus segera</option>
        </select>
      </div>
      <button class="btn btn-danger mt-12" data-action="delete-all-data">
        <span class="material-icons" style="font-size:18px">delete_forever</span> Hapus Semua Data Kelas
      </button>
    </div>

    <div class="score-panel mb-16">
      <h3 style="font-size:1rem;font-weight:500;margin-bottom:12px">Riwayat Perubahan</h3>
      <div style="max-height:300px;overflow-y:auto">
        ${state.auditLog.length === 0 ? '<p class="text-sm text-secondary">Belum ada riwayat</p>' :
          state.auditLog.slice().reverse().map(log => `
            <div class="audit-entry">
              <div class="time">${fmtDateTime(log.timestamp)}</div>
              <div class="action">${esc(log.action)}</div>
            </div>
          `).join('')
        }
      </div>
    </div>

    <div class="score-panel">
      <h3 style="font-size:1rem;font-weight:500;margin-bottom:12px">Akun</h3>
      <p class="text-sm">${esc(state.currentUser.name)}</p>
      <p class="text-sm text-secondary">${esc(state.currentUser.email)}</p>
      <button class="btn btn-outline mt-12" data-action="logout">
        <span class="material-icons" style="font-size:18px">logout</span> Keluar
      </button>
    </div>
  `;
}

// ===================== EVENT BINDING =====================
function bindGlobalEvents() {
  // Global delegated events are handled in bindViewEvents
}

function bindViewEvents() {
  document.addEventListener('click', handleClick);
  document.addEventListener('change', handleChange);
}

function handleClick(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;

  switch (action) {
    case 'toggle-drawer':
      state.ui.drawerOpen = !state.ui.drawerOpen;
      render();
      break;
    case 'close-drawer':
      state.ui.drawerOpen = false;
      render();
      break;
    case 'nav': {
      const view = target.dataset.view;
      const params = {};
      if (target.dataset.classId) params.classId = target.dataset.classId;
      if (target.dataset.examId) params.examId = target.dataset.examId;
      if (view === 'class' && params.classId) state.ui.activeTab = 'exams';
      navigate(view, params);
      break;
    }
    case 'open-class':
      state.ui.activeTab = 'exams';
      navigate('class', { classId: target.dataset.classId });
      break;
    case 'open-exam':
      navigate('exam', { examId: target.dataset.examId, classId: target.dataset.classId });
      break;
    case 'tab':
      state.ui.activeTab = target.dataset.tab;
      render();
      break;
    case 'toggle-names':
      state.ui.showNames = !state.ui.showNames;
      render();
      break;
    case 'create-class':
      showCreateClassModal();
      break;
    case 'create-exam':
      showCreateExamModal(target.dataset.classId);
      break;
    case 'do-login': {
      const email = $('#login-email')?.value?.trim();
      const pass = $('#login-password')?.value;
      if (email && pass) login(email, pass);
      break;
    }
    case 'do-register': {
      const name = $('#reg-name')?.value?.trim();
      const email = $('#reg-email')?.value?.trim();
      const pass = $('#reg-password')?.value;
      if (name && email && pass && pass.length >= 6) register(name, email, pass);
      else showToast('Lengkapi semua field (kata sandi min. 6 karakter)', 'error');
      break;
    }
    case 'show-register':
      $('#login-form')?.classList.add('hidden');
      $('#register-form')?.classList.remove('hidden');
      break;
    case 'show-login':
      $('#register-form')?.classList.add('hidden');
      $('#login-form')?.classList.remove('hidden');
      break;
    case 'confirm-key': {
      const exam = getExamById(target.dataset.examId);
      if (exam) {
        exam.status = 'ready';
        addAudit(`Kunci jawaban dikonfirmasi: ${exam.name}`);
        saveState();
        showToast('Kunci jawaban dikonfirmasi!', 'success');
        render();
      }
      break;
    }
    case 'edit-key':
      showEditKeyModal(target.dataset.examId);
      break;
    case 'upload-sheets':
      showUploadModal(target.dataset.examId, target.dataset.classId);
      break;
    case 'download-template':
      downloadTemplate(target.dataset.examId);
      break;
    case 'open-review': {
      state.ui.reviewSheetId = target.dataset.sheetId;
      state.ui.reviewSheetIndex = parseInt(target.dataset.index) || 0;
      navigate('review', { examId: target.dataset.examId });
      break;
    }
    case 'set-answer': {
      const sheetId = target.dataset.sheetId;
      const num = parseInt(target.dataset.num);
      const val = target.dataset.val;
      setAnswer(sheetId, num, val);
      break;
    }
    case 'set-bubble': {
      // Bubble code selection handled separately
      handleBubbleClick(target);
      break;
    }
    case 'assign-student': {
      const sel = $('#manual-student');
      if (sel && sel.value) {
        const sheet = state.sheets.find(s => s.id === target.dataset.sheetId);
        if (sheet) {
          sheet.studentCode = sel.value;
          sheet.status = 'reviewing';
          addAudit(`Kode siswa ditetapkan: ${sel.value}`);
          saveState();
          showToast('Siswa dicocokkan!', 'success');
          render();
        }
      } else {
        showToast('Pilih siswa terlebih dahulu', 'error');
      }
      break;
    }
    case 'confirm-sheet': {
      const sheet = state.sheets.find(s => s.id === target.dataset.sheetId);
      if (sheet) {
        sheet.status = 'done';
        sheet.gradedAt = new Date().toISOString();
        const exam = getExamById(sheet.examId);
        const score = calcSheetScore(sheet, exam);
        sheet.rawScore = score.rawScore;
        sheet.finalScore = score.finalScore;
        addAudit(`Lembar ${sheet.studentCode} dikonfirmasi: skor ${score.rawScore}`);
        updateExamStatus(exam.id);
        saveState();
        showToast('Lembar dikonfirmasi!', 'success');
        render();
      }
      break;
    }
    case 'delete-sheet': {
      if (confirm('Hapus lembar ini?')) {
        const sheetId = target.dataset.sheetId;
        const sheet = state.sheets.find(s => s.id === sheetId);
        state.sheets = state.sheets.filter(s => s.id !== sheetId);
        if (sheet) {
          addAudit(`Lembar ${sheet.studentCode || 'belum tercocokkan'} dihapus`);
          const exam = getExamById(sheet.examId);
          if (exam) updateExamStatus(exam.id);
        }
        saveState();
        showToast('Lembar dihapus', 'success');
        navigate('exam', state.route.params);
      }
      break;
    }
    case 'prev-sheet': {
      if (state.ui.reviewSheetIndex > 0) {
        state.ui.reviewSheetIndex--;
        const sheets = getSheetsByExam(state.route.params.examId);
        state.ui.reviewSheetId = sheets[state.ui.reviewSheetIndex]?.id;
        render();
      }
      break;
    }
    case 'next-sheet': {
      const sheets = getSheetsByExam(state.route.params.examId);
      if (state.ui.reviewSheetIndex < sheets.length - 1) {
        state.ui.reviewSheetIndex++;
        state.ui.reviewSheetId = sheets[state.ui.reviewSheetIndex]?.id;
        render();
      }
      break;
    }
    case 'export-excel':
      exportExcel(target.dataset.classId);
      break;
    case 'logout':
      logout();
      break;
    case 'delete-all-data':
      if (confirm('Yakin hapus SEMUA data? Tindakan ini tidak bisa dibatalkan.')) {
        state.classes = state.classes.filter(c => c.userId !== state.currentUser.id);
        state.exams = state.exams.filter(e => e.userId !== state.currentUser.id);
        state.sheets = state.sheets.filter(s => {
          const exam = getExamById(s.examId);
          return exam && exam.userId !== state.currentUser.id;
        });
        addAudit('Semua data kelas dihapus');
        saveState();
        showToast('Semua data dihapus', 'success');
        navigate('home');
      }
      break;
    case 'save-key-edit': {
      saveKeyEdit();
      break;
    }
    case 'import-excel':
      triggerExcelImport();
      break;
  }
}

function handleChange(e) {
  // Handle file inputs, selects, etc.
}

// ===================== ANSWER MANAGEMENT =====================
function setAnswer(sheetId, num, val) {
  const sheet = state.sheets.find(s => s.id === sheetId);
  if (!sheet) return;

  const exam = getExamById(sheet.examId);
  if (!exam) return;

  sheet.answers[num] = val;

  if (val === '') {
    sheet.statuses[num] = 'empty';
  } else if (val === exam.answerKey[num]) {
    sheet.statuses[num] = 'correct';
  } else {
    sheet.statuses[num] = 'wrong';
  }

  const score = calcSheetScore(sheet, exam);
  sheet.rawScore = score.rawScore;
  sheet.finalScore = score.finalScore;

  addAudit(`Jawaban ${sheet.studentCode || 'lembar'} no.${num} diubah ke ${val || 'kosong'}`);
  saveState();
  render();
}

function handleBubbleClick(target) {
  const col = target.dataset.col;
  const val = target.dataset.val;

  // Update bubble UI
  const colMap = { kelas: 'kelas', huruf: 'huruf', puluhan: 'puluhan', satuan: 'satuan' };
  const allBubbles = $$('.bubble-circle');
  allBubbles.forEach(b => {
    if (b.dataset.col === col) b.classList.remove('filled');
  });
  target.classList.add('filled');

  // Build code from current bubble state
  const filled = {};
  allBubbles.forEach(b => {
    if (b.classList.contains('filled')) filled[b.dataset.col] = b.dataset.val;
  });

  if (filled.kelas && filled.huruf && filled.puluhan !== undefined && filled.satuan !== undefined) {
    const code = `${filled.kelas}${filled.huruf}-${filled.puluhan}${filled.satuan}`;
    const sheet = state.sheets.find(s => s.id === state.ui.reviewSheetId);
    if (sheet) {
      const cls = getClassById(getExamById(sheet.examId)?.classId);
      const student = cls?.students.find(s => s.code === code);
      if (student) {
        sheet.studentCode = code;
        sheet.status = 'reviewing';
        addAudit(`Kode bulatan terdeteksi: ${code}`);
        saveState();
        showToast(`Kode ${code} tercocokkan!`, 'success');
      } else {
        showToast(`Kode ${code} tidak ditemukan di daftar siswa`, 'error');
      }
    }
  }
}

function updateExamStatus(examId) {
  const exam = getExamById(examId);
  const cls = getClassById(exam?.classId);
  if (!exam || !cls) return;

  const sheets = getSheetsByExam(examId);
  const doneCount = sheets.filter(s => s.status === 'done').length;

  if (doneCount >= cls.students.length && cls.students.length > 0) {
    exam.status = 'done';
  } else if (doneCount > 0) {
    exam.status = 'done';
  }
}

// ===================== MODALS =====================
function showCreateClassModal() {
  showModal(`
    <div class="modal-header">
      <h2>Buat Kelas</h2>
      <button class="icon-btn" onclick="hideModal()"><span class="material-icons">close</span></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Nama Kelas</label>
        <input type="text" class="form-input" id="class-name" placeholder="Mis. 5A, 3B">
      </div>
      <div class="form-group">
        <label>Daftar Siswa (Excel/CSV)</label>
        <p class="text-xs text-secondary mb-8">Format: kolom "Kode" dan "Nama". Kode berformat kelas+absen (mis. 5A-12).</p>
        <div class="upload-zone" id="excel-upload-zone" onclick="document.getElementById('class-excel-file').click()">
          <span class="material-icons">upload_file</span>
          <p>Klik untuk unggah file Excel/CSV</p>
          <input type="file" id="class-excel-file" accept=".xlsx,.xls,.csv" onchange="handleClassExcelUpload(event)">
        </div>
        <div id="excel-preview" class="mt-12"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="hideModal()">Batal</button>
      <button class="btn btn-primary" data-action="save-class">Buat Kelas</button>
    </div>
  `);

  // Override save action
  setTimeout(() => {
    const saveBtn = $('[data-action="save-class"]');
    if (saveBtn) {
      saveBtn.onclick = () => saveNewClass();
    }
  }, 0);
}

let pendingStudents = [];

function handleClassExcelUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws);

      if (rows.length === 0) {
        showToast('File kosong', 'error');
        return;
      }

      const students = [];
      const errors = [];
      const codes = new Set();

      rows.forEach((row, i) => {
        const code = row['Kode'] || row['kode'] || row['Kode Siswa'] || row['kode siswa'] || '';
        const name = row['Nama'] || row['nama'] || row['Nama Siswa'] || row['nama siswa'] || '';

        if (!code) { errors.push(`Baris ${i + 2}: kode kosong`); return; }
        if (codes.has(code)) { errors.push(`Baris ${i + 2}: kode ganda "${code}"`); }
        codes.add(code);
        students.push({ id: uid(), code: String(code), name: String(name || '') });
      });

      pendingStudents = students;

      let previewHtml = `<p class="text-sm fw-500 mb-8">${students.length} siswa terdeteksi</p>`;
      if (errors.length > 0) {
        previewHtml += `<div class="mb-8" style="color:var(--danger);font-size:.8rem">${errors.map(e => `<div>${esc(e)}</div>`).join('')}</div>`;
      }
      previewHtml += `<div class="table-wrap"><table><thead><tr><th>Kode</th><th>Nama</th></tr></thead><tbody>`;
      students.forEach(s => {
        previewHtml += `<tr><td>${esc(s.code)}</td><td>${esc(s.name)}</td></tr>`;
      });
      previewHtml += `</tbody></table></div>`;

      $('#excel-preview').innerHTML = previewHtml;
    } catch (err) {
      showToast('Gagal membaca file: ' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

function saveNewClass() {
  const name = $('#class-name')?.value?.trim();
  if (!name) { showToast('Nama kelas wajib diisi', 'error'); return; }

  if (pendingStudents.length === 0) {
    // Create class with no students, show message
    if (!confirm('Belum ada siswa. Buat kelas tanpa siswa?')) return;
  }

  const cls = {
    id: uid(),
    userId: state.currentUser.id,
    name,
    students: pendingStudents.length > 0 ? pendingStudents : []
  };

  state.classes.push(cls);
  addAudit(`Kelas "${name}" dibuat dengan ${cls.students.length} siswa`);
  pendingStudents = [];
  saveState();
  hideModal();
  showToast(`Kelas ${name} berhasil dibuat!`, 'success');
  navigate('class', { classId: cls.id });
}

function showCreateExamModal(classId) {
  showModal(`
    <div class="modal-header">
      <h2>Buat Ulangan</h2>
      <button class="icon-btn" onclick="hideModal()"><span class="material-icons">close</span></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Nama Ulangan</label>
        <input type="text" class="form-input" id="exam-name" placeholder="Mis. Ulangan Matematika Bab 3">
      </div>
      <div class="form-group">
        <label>Tanggal</label>
        <input type="date" class="form-input" id="exam-date" value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label>Jumlah Soal</label>
        <select class="form-input" id="exam-num-q">
          <option value="10">10 soal</option>
          <option value="20">20 soal</option>
          <option value="30">30 soal</option>
          <option value="40">40 soal</option>
          <option value="50">50 soal</option>
        </select>
      </div>
      <div class="form-group">
        <label>Kunci Jawaban (PDF opsional)</label>
        <p class="text-xs text-secondary mb-8">Unggah PDF atau masukkan kunci manual di langkah berikutnya.</p>
        <div class="upload-zone" onclick="document.getElementById('key-pdf-file').click()">
          <span class="material-icons">upload_file</span>
          <p>Klik untuk unggah PDF kunci</p>
          <input type="file" id="key-pdf-file" accept=".pdf" onchange="handleKeyPdfUpload(event)">
        </div>
      </div>
      <div class="form-group">
        <label>Pengurangan untuk jawaban salah (opsional)</label>
        <input type="number" class="form-input" id="exam-penalty" value="0" min="0" step="0.5">
      </div>
      <div class="form-group">
        <label>Rumus Nilai Akhir (opsional)</label>
        <input type="text" class="form-input" id="exam-formula" placeholder="Mis. (benar / bobot) * 100">
        <p class="text-xs text-secondary mt-8">Variabel: skor, bobot, benar, salah, kosong</p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="hideModal()">Batal</button>
      <button class="btn btn-primary" id="save-exam-btn">Buat Ulangan</button>
    </div>
  `);

  setTimeout(() => {
    const btn = $('#save-exam-btn');
    if (btn) btn.onclick = () => saveNewExam(classId);
  }, 0);
}

function handleKeyPdfUpload(e) {
  // PDF parsing would require a library - for now just note the file
  const file = e.target.files[0];
  if (file) {
    showToast('File PDF diterima. Kunci akan diinput manual.', 'success');
  }
}

function saveNewExam(classId) {
  const name = $('#exam-name')?.value?.trim();
  const date = $('#exam-date')?.value;
  const numQ = parseInt($('#exam-num-q')?.value) || 10;
  const penalty = parseFloat($('#exam-penalty')?.value) || 0;
  const formula = $('#exam-formula')?.value?.trim() || '';

  if (!name) { showToast('Nama ulangan wajib diisi', 'error'); return; }

  const answerKey = {};
  const weights = {};
  for (let i = 1; i <= numQ; i++) {
    answerKey[i] = '';
    weights[i] = 1;
  }

  const exam = {
    id: uid(),
    classId,
    userId: state.currentUser.id,
    name,
    date: date || new Date().toISOString().split('T')[0],
    status: 'draft',
    numQuestions: numQ,
    answerKey,
    weights,
    penalty,
    formula,
    createdAt: new Date().toISOString()
  };

  state.exams.push(exam);
  addAudit(`Ulangan "${name}" dibuat (${numQ} soal)`);
  saveState();
  hideModal();
  showToast('Ulangan berhasil dibuat!', 'success');

  // Show key entry modal
  setTimeout(() => showKeyEntryModal(exam.id), 300);
}

function showKeyEntryModal(examId) {
  const exam = getExamById(examId);
  if (!exam) return;

  let keyInputs = '';
  for (let i = 1; i <= exam.numQuestions; i++) {
    keyInputs += `
      <td style="text-align:center">
        <div class="text-xs text-secondary mb-8">${i}</div>
        <select class="form-input" style="width:60px;text-align:center" id="key-${i}">
          <option value="">-</option>
          <option value="A" ${exam.answerKey[i] === 'A' ? 'selected' : ''}>A</option>
          <option value="B" ${exam.answerKey[i] === 'B' ? 'selected' : ''}>B</option>
          <option value="C" ${exam.answerKey[i] === 'C' ? 'selected' : ''}>C</option>
          <option value="D" ${exam.answerKey[i] === 'D' ? 'selected' : ''}>D</option>
        </select>
      </td>
    `;
  }

  showModal(`
    <div class="modal-header">
      <h2>Input Kunci Jawaban</h2>
      <button class="icon-btn" onclick="hideModal()"><span class="material-icons">close</span></button>
    </div>
    <div class="modal-body">
      <p class="text-sm text-secondary mb-12">Pilih kunci jawaban untuk setiap nomor. Anda bisa mengubahnya nanti sebelum konfirmasi.</p>
      <div class="table-wrap">
        <table>
          <tbody>
            <tr>${keyInputs}</tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="hideModal()">Nanti Saja</button>
      <button class="btn btn-primary" id="save-key-btn">Simpan Kunci</button>
    </div>
  `, true);

  setTimeout(() => {
    const btn = $('#save-key-btn');
    if (btn) btn.onclick = () => {
      for (let i = 1; i <= exam.numQuestions; i++) {
        const val = $(`#key-${i}`)?.value || '';
        exam.answerKey[i] = val;
      }
      if (exam.status === 'draft') exam.status = 'pending';
      addAudit(`Kunci jawaban diinput untuk "${exam.name}"`);
      saveState();
      hideModal();
      showToast('Kunci jawaban disimpan!', 'success');
      render();
    };
  }, 0);
}

function showEditKeyModal(examId) {
  const exam = getExamById(examId);
  if (!exam) return;
  showKeyEntryModal(examId);
}

function showUploadModal(examId, classId) {
  showModal(`
    <div class="modal-header">
      <h2>Nilai Lembar Jawaban</h2>
      <button class="icon-btn" onclick="hideModal()"><span class="material-icons">close</span></button>
    </div>
    <div class="modal-body">
      <button class="camera-btn" onclick="document.getElementById('camera-input').click()">
        <span class="material-icons">photo_camera</span> Ambil Foto dengan Kamera
      </button>
      <div class="upload-zone" onclick="document.getElementById('sheet-files').click()">
        <span class="material-icons">cloud_upload</span>
        <p>Unggah foto atau scan (JPG, PNG)</p>
        <input type="file" id="sheet-files" accept="image/*" multiple onchange="handleSheetUpload(event, '${examId}', '${classId}')">
      </div>
      <input type="file" id="camera-input" accept="image/*" capture="environment" style="display:none" onchange="handleSheetUpload(event, '${examId}', '${classId}')">
      <div id="upload-progress" class="mt-12"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="hideModal()">Tutup</button>
    </div>
  `);
}

function handleSheetUpload(e, examId, classId) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const exam = getExamById(examId);
  const cls = getClassById(classId);
  if (!exam || !cls) return;

  const progress = $('#upload-progress');
  let processed = 0;

  files.forEach((file, idx) => {
    if (!file.type.startsWith('image/')) {
      showToast(`${file.name}: format tidak didukung`, 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast(`${file.name}: terlalu besar (maks 10MB)`, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const imageUrl = evt.target.result;

      // Create a sheet with random/unmatched status (simulating AI processing)
      const sheet = {
        id: uid(),
        examId,
        classId,
        studentCode: '',
        answers: {},
        statuses: {},
        status: 'pending',
        rawScore: 0,
        finalScore: null,
        imageUrl,
        gradedAt: new Date().toISOString()
      };

      // Simulate reading answers (random for demo)
      for (let i = 1; i <= exam.numQuestions; i++) {
        const opts = ['A', 'B', 'C', 'D', ''];
        const ans = opts[Math.floor(Math.random() * opts.length)];
        sheet.answers[i] = ans;
        if (ans === '') sheet.statuses[i] = 'empty';
        else if (ans === exam.answerKey[i]) sheet.statuses[i] = 'correct';
        else sheet.statuses[i] = 'wrong';
      }

      // Randomly assign a student code for demo (or leave unmatched)
      if (Math.random() > 0.2 && cls.students.length > 0) {
        const assigned = cls.students[Math.floor(Math.random() * cls.students.length)];
        sheet.studentCode = assigned.code;
        sheet.status = 'reviewing';
      }

      state.sheets.push(sheet);
      processed++;

      if (progress) {
        progress.innerHTML = `
          <div class="progress-bar"><div class="progress-fill" style="width:${(processed / files.length) * 100}%"></div></div>
          <p class="text-sm text-secondary">${processed}/${files.length} lembar diproses</p>
        `;
      }

      if (processed === files.length) {
        addAudit(`${files.length} lembar jawaban diunggah untuk "${exam.name}"`);
        saveState();
        showToast(`${files.length} lembar berhasil diproses!`, 'success');
        setTimeout(() => {
          hideModal();
          render();
        }, 1000);
      }
    };
    reader.readAsDataURL(file);
  });
}

// ===================== EXCEL EXPORT =====================
function exportExcel(classId) {
  const cls = getClassById(classId);
  if (!cls) return;

  const exams = getExamsByClass(classId);
  if (exams.length === 0) { showToast('Belum ada ulangan', 'error'); return; }

  const header = ['Kode', 'Nama'];
  exams.forEach(e => {
    header.push(`${e.name} - Benar`, `${e.name} - Salah`, `${e.name} - Kosong`, `${e.name} - Cek Guru`);
    header.push(`${e.name} - Nomor Salah`, `${e.name} - Nomor Cek Guru`);
    header.push(`${e.name} - Skor Mentah`, `${e.name} - Nilai Akhir`);
    header.push(`${e.name} - Jawaban Terbaca`);
  });

  const rows = [header];
  cls.students.forEach(s => {
    const row = [sanitizeExcelValue(s.code), sanitizeExcelValue(s.name)];
    exams.forEach(e => {
      const sheet = state.sheets.find(sh => sh.examId === e.id && sh.studentCode === s.code);
      if (!sheet) {
        row.push('-', '-', '-', '-', '-', '-', '-', '-', '-');
      } else {
        const score = calcSheetScore(sheet, e);
        const answerStr = Object.entries(sheet.answers || {}).map(([n, a]) => `${n}${a || '-'}`).join(' ');
        row.push(
          score.correct, score.wrong, score.empty, score.check,
          sanitizeExcelValue(score.wrongNums?.join(', ') || '-'),
          sanitizeExcelValue(score.checkNums?.join(', ') || '-'),
          score.rawScore,
          score.finalScore != null ? score.finalScore : '-',
          sanitizeExcelValue(answerStr || '-')
        );
      }
    });
    rows.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Nilai');
  XLSX.writeFile(wb, `Rekap_Nilai_${cls.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
  addAudit(`Excel diekspor untuk kelas ${cls.name}`);
  saveState();
  showToast('Excel berhasil diunduh!', 'success');
}

// ===================== PDF TEMPLATE =====================
function downloadTemplate(examId) {
  const exam = getExamById(examId);
  if (!exam) return;

  const numQ = exam.numQuestions;
  const colsPerRow = Math.min(5, numQ);
  const numRows = Math.ceil(numQ / colsPerRow);

  let questionsHtml = '<table style="border-collapse:collapse;width:100%;margin-top:20px">';
  for (let r = 0; r < numRows; r++) {
    questionsHtml += '<tr>';
    for (let c = 0; c < colsPerRow; c++) {
      const qNum = r * colsPerRow + c + 1;
      if (qNum <= numQ) {
        questionsHtml += `<td style="border:1px solid #ccc;padding:8px;text-align:center;width:20%">
          <strong>${qNum}</strong><br>
          <span style="font-size:12px">A &nbsp; B &nbsp; C &nbsp; D</span><br>
          <span style="font-size:10px;color:#999">&#9675; &#9675; &#9675; &#9675;</span>
        </td>`;
      }
    }
    questionsHtml += '</tr>';
  }
  questionsHtml += '</table>';

  const bubbleHtml = `
    <table style="border-collapse:collapse;margin:20px 0">
      <tr>
        <td style="border:1px solid #333;padding:10px;text-align:center;vertical-align:top">
          <strong>KODE SISWA</strong><br><br>
          <table style="margin:0 auto">
            <tr>
              <td style="padding:4px 8px;text-align:center">
                <div style="font-size:10px;margin-bottom:4px">Kelas</div>
                ${[1,2,3,4,5,6].map(n => `<div style="width:24px;height:24px;border:2px solid #333;border-radius:50%;margin:2px auto;display:flex;align-items:center;justify-content:center;font-size:10px">${n}</div>`).join('')}
              </td>
              <td style="padding:4px 8px;text-align:center">
                <div style="font-size:10px;margin-bottom:4px">Kelas</div>
                ${['A','B','C','D','E','F'].map(l => `<div style="width:24px;height:24px;border:2px solid #333;border-radius:50%;margin:2px auto;display:flex;align-items:center;justify-content:center;font-size:10px">${l}</div>`).join('')}
              </td>
              <td style="padding:4px 8px;text-align:center">
                <div style="font-size:10px;margin-bottom:4px">Puluhan</div>
                ${[0,1,2,3,4,5,6,7,8,9].map(n => `<div style="width:24px;height:24px;border:2px solid #333;border-radius:50%;margin:2px auto;display:flex;align-items:center;justify-content:center;font-size:10px">${n}</div>`).join('')}
              </td>
              <td style="padding:4px 8px;text-align:center">
                <div style="font-size:10px;margin-bottom:4px">Satuan</div>
                ${[0,1,2,3,4,5,6,7,8,9].map(n => `<div style="width:24px;height:24px;border:2px solid #333;border-radius:50%;margin:2px auto;display:flex;align-items:center;justify-content:center;font-size:10px">${n}</div>`).join('')}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const cornerMarkers = `
    <div style="position:relative;border:2px solid #333;padding:20px;margin:20px 0">
      <div style="position:absolute;top:-2px;left:-2px;width:20px;height:20px;background:#000"></div>
      <div style="position:absolute;top:-2px;right:-2px;width:20px;height:20px;background:#000"></div>
      <div style="position:absolute;bottom:-2px;left:-2px;width:20px;height:20px;background:#000"></div>
      <div style="position:absolute;bottom:-2px;right:-2px;width:20px;height:20px;background:#000"></div>
      <p style="text-align:center;color:#999;font-size:12px">Area jawaban (penanda sudut untuk pelurus)</p>
    </div>
  `;

  const html = `
    <!DOCTYPE html>
    <html><head><meta charset="UTF-8"><title>Template Lembar Jawaban - ${esc(exam.name)}</title>
    <style>body{font-family:Arial,sans-serif;padding:20px;max-width:800px;margin:0 auto}h1{font-size:18px}h2{font-size:14px;color:#666}</style>
    </head><body>
    <h1>LEMBAR JAWABAN</h1>
    <h2>${esc(exam.name)} &middot; ${numQ} soal</h2>
    ${bubbleHtml}
    ${cornerMarkers}
    ${questionsHtml}
    <p style="margin-top:20px;font-size:11px;color:#999">Hitamkan bulatan pada kolom kode siswa dan bulatan jawaban yang dipilih.</p>
    </body></html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Template_Lembar_${exam.name.replace(/\s+/g, '_')}.html`;
  a.click();
  URL.revokeObjectURL(url);

  addAudit(`Template lembar jawaban diunduh: ${exam.name} (${numQ} soal)`);
  saveState();
  showToast('Template berhasil diunduh!', 'success');
}

// ===================== INIT =====================
function init() {
  const loaded = loadState();
  if (!loaded || state.users.length === 0) {
    initSampleData();
    saveState();
  }

  if (state.currentUser) {
    navigate('home');
  } else {
    navigate('login');
  }
}

// Remove old event listeners before re-rendering
const origRender = render;
let renderCleanup = null;

// Patch render to clean up old listeners
const _render = render;
// We handle this by re-creating the DOM, which removes old listeners

// Expose hideModal globally for onclick handlers
window.hideModal = hideModal;
window.closeModalOnOverlay = closeModalOnOverlay;
window.handleClassExcelUpload = handleClassExcelUpload;
window.handleSheetUpload = handleSheetUpload;
window.handleKeyPdfUpload = handleKeyPdfUpload;

init();

})();
