// ============================================================
// Flowence Grid Method — dashboard.js
// Supabase integration para o Dashboard
// ============================================================

const SUPABASE_URL = 'https://rvgcniaowzmsudzliozf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Z2NuaWFvd3ptc3Vkemxpb3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjQxNzQsImV4cCI6MjA5MTQwMDE3NH0.uwwKFLuK-XyPoXPrB6_CseRTiD9d-iyMQSPWrFw-l-I';

// ── Utilitário de fetch ──────────────────────────────────────
async function sb(table, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase error on ${table}: ${res.status}`);
  return res.json();
}

// ── Helpers ──────────────────────────────────────────────────
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = pct + '%';
}

// ── Temas mensais fixos (conforme o HTML original) ───────────
const MONTHLY_THEMES = {
  1:  { A1: 'Family & Home',        A2: 'Daily Routines',    B1: 'Travel Plans',       B2: 'Social Media',        C1: 'Philosophy of Mind' },
  2:  { A1: 'Colors & Clothes',     A2: 'Shopping',          B1: 'Health & Wellness',  B2: 'Technology Trends',   C1: 'Ethics & Society'   },
  3:  { A1: 'Animals & Nature',     A2: 'Weather',           B1: 'Education',          B2: 'Global Issues',       C1: 'Economics'          },
  4:  { A1: 'Numbers & Time',       A2: 'Transport',         B1: 'Culture & Arts',     B2: 'Science & Innovation',C1: 'Law & Justice'      },
  5:  { A1: 'Food and Drinks',      A2: 'Restaurants',       B1: 'Work and Career',    B2: 'Environment',         C1: 'Research Methods'   },
  6:  { A1: 'Sports & Games',       A2: 'Hobbies',           B1: 'Media & News',       B2: 'Politics',            C1: 'Artificial Intelligence' },
  7:  { A1: 'My Body',              A2: 'Health',            B1: 'History',            B2: 'Literature',          C1: 'Neuroscience'       },
  8:  { A1: 'School & Supplies',    A2: 'Classroom',         B1: 'Science',            B2: 'Psychology',          C1: 'Urban Planning'     },
  9:  { A1: 'Jobs & Professions',   A2: 'Work',              B1: 'Environment',        B2: 'Culture',             C1: 'Geopolitics'        },
  10: { A1: 'Feelings & Emotions',  A2: 'Relationships',     B1: 'Technology',         B2: 'Media',               C1: 'Cognitive Science'  },
  11: { A1: 'House & Furniture',    A2: 'Neighborhoods',     B1: 'Business',           B2: 'Economy',             C1: 'Philosophy'         },
  12: { A1: 'Celebrations',         A2: 'Traditions',        B1: 'World Events',       B2: 'Future Trends',       C1: 'Critical Thinking'  },
};

// ── Renderiza temas do mês atual ─────────────────────────────
function renderThemes() {
  const month = new Date().getMonth() + 1;
  const themes = MONTHLY_THEMES[month] || MONTHLY_THEMES[5];

  const levels = ['A1','A2','B1','B2','C1'];
  const container = document.getElementById('theme-list');
  if (!container) return;

  container.innerHTML = levels.map(lvl => `
    <div class="topic">
      <span class="badge ${lvl.toLowerCase()}">${lvl}</span>
      ${themes[lvl]}
    </div>
  `).join('');
}

// ── Renderiza gráfico de alunos por nível ────────────────────
function renderLevelChart(students) {
  const levels = ['A1','A2','B1','B2','C1'];
  const counts = {};
  levels.forEach(l => counts[l] = 0);

  students.forEach(s => {
    const lvl = (s.level || '').toUpperCase();
    if (counts[lvl] !== undefined) counts[lvl]++;
  });

  const max = Math.max(...Object.values(counts), 1);
  const colors = { A1:'green', A2:'blue', B1:'purple', B2:'orange', C1:'red' };

  levels.forEach(lvl => {
    setText(`level-count-${lvl}`, counts[lvl]);
    setWidth(`level-bar-${lvl}`, Math.round((counts[lvl] / max) * 100));
    // ajusta cor da barra
    const bar = document.getElementById(`level-bar-${lvl}`);
    if (bar) {
      bar.className = `progress-fill ${colors[lvl]}`;
    }
  });
}

// ── Renderiza missões recentes ────────────────────────────────
function renderMissions(missions) {
  const container = document.getElementById('missions-list');
  if (!container) return;

  if (!missions.length) {
    container.innerHTML = '<div class="empty">Nenhuma missão registrada.</div>';
    return;
  }

  const statusLabel = { pending: 'Pendente', completed: 'Completa', late: 'Atrasada' };
  const statusColor = { pending: 'orange', completed: 'green', late: 'red' };

  container.innerHTML = missions.slice(0, 4).map(m => `
    <div class="topic">
      <span class="badge ${statusColor[m.status] || 'a1'}">${statusLabel[m.status] || m.status}</span>
      ${m.description || 'Missão sem título'}
    </div>
  `).join('');
}

// ── Renderiza próximas aulas ──────────────────────────────────
function renderLessons(lessons) {
  const container = document.getElementById('lessons-list');
  if (!container) return;

  if (!lessons.length) {
    container.innerHTML = '<div class="empty">Nenhuma aula futura registrada.</div>';
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const upcoming = lessons
    .filter(l => l.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  if (!upcoming.length) {
    container.innerHTML = '<div class="empty">Nenhuma aula futura registrada.</div>';
    return;
  }

  container.innerHTML = upcoming.map(l => `
    <div class="topic">
      <span class="badge ${(l.level || 'a1').toLowerCase()}">${l.level || '–'}</span>
      ${l.title || l.theme || 'Aula'} — <span style="color:#64748b">${formatDate(l.date)}</span>
    </div>
  `).join('');
}

function formatDate(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

// ── Loader principal ──────────────────────────────────────────
async function loadDashboard() {
  try {
    const [students, classes, missions, materials, lessons] = await Promise.all([
      sb('flowence_student',    'select=id,level,status'),
      sb('flowence_class',      'select=id,status'),
      sb('flowence_mission',    'select=id,status,description,due_date&order=created_at.desc'),
      sb('flowence_material',   'select=id'),
      sb('flowence_lesson',     'select=id,date,title,theme,level&order=date.asc'),
    ]);

    // ── Cards de topo ────────────────────────────────────────
    const activeStudents = students.filter(s => s.status === 'Ativo').length;
    const activeClasses  = classes.filter(c => c.status === 'active' || c.status === 'Ativo').length;
    const totalLessons   = lessons.length;
    const completeMissions = missions.filter(m => m.status === 'completed' || m.status === 'Completa').length;
    const pendingMissions  = missions.filter(m => m.status === 'pending'   || m.status === 'Pendente').length;
    const totalMaterials   = materials.length;

    setText('stat-students',  activeStudents);
    setText('stat-classes',   activeClasses);
    setText('stat-lessons',   totalLessons);
    setText('stat-missions',  `${completeMissions}/${missions.length}`);
    setText('stat-materials', totalMaterials);
    setText('stat-pending',   pendingMissions);

    // ── Painéis ──────────────────────────────────────────────
    renderLevelChart(students);
    renderThemes();
    renderMissions(missions);
    renderLessons(lessons);

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
}

// ── Inicializa ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadDashboard);
