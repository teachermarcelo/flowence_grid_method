// ============================================================
// Flowence Grid Method — dashboard.js (CORRIGIDO)
// Conecta no Supabase e popula todo o dashboard
// AGORA INCLUI: Turmas Ativas!
// ============================================================
(() => {
  'use strict';
  // ---------- 1. CLIENTE SUPABASE ----------
  if (!window.SUPABASE_CONFIG || !window.supabase) {
    console.error('[Flowence] supabase-config.js ou SDK do Supabase não carregado.');
    return;
  }
  const sb = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey
  );
  // Disponibiliza para outras páginas
  window.sb = sb;

  // ---------- 2. UTILITÁRIOS ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const fmtNumber = (n) => (n ?? 0).toLocaleString('pt-BR');
  const setStat = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = fmtNumber(value);
    el.classList.remove('shimmer');
  };
  const setStatError = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '—';
    el.classList.remove('shimmer');
    el.classList.add('stat-error');
  };

  const countRows = async (table, filterFn = null) => {
    let q = sb.from(table).select('*', { count: 'exact', head: true });
    if (filterFn) q = filterFn(q);
    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  };

  // Toast
  const toast = (msg, type = 'info') => {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-show'));
    setTimeout(() => {
      t.classList.remove('toast-show');
      setTimeout(() => t.remove(), 300);
    }, 3500);
  };
  window.toast = toast;

  // Status helpers — ✅ CORRIGIDO: Adicionado 'ativa' e 'Ativa'
  const STATUS_ACTIVE   = ['active', 'Active', 'ACTIVE', 'ativo', 'Ativo', 'ATIVO', 'ativa', 'Ativa'];
  const STATUS_COMPLETE = ['completed', 'Completed', 'completo', 'Completo', 'concluida', 'concluída', 'Concluída'];
  const STATUS_PENDING  = ['pending', 'Pending', 'pendente', 'Pendente'];

  // ---------- 3. STATS CARDS ----------
  async function loadStats() {
    const tasks = [
      ['stat-students', () => countRows('flowence_student', q => q.in('status', STATUS_ACTIVE))],
      ['stat-classes',  () => countRows('flowence_class',   q => q.in('status', STATUS_ACTIVE))],  // ✅ AGORA FUNCIONA
      ['stat-lessons',  () => countRows('flowence_lesson')],
      ['stat-missions', () => countRows('flowence_mission', q => q.in('status', STATUS_COMPLETE))],
      ['stat-materials', () => countRows('flowence_material')],
      ['stat-pending',   () => countRows('flowence_mission', q => q.in('status', STATUS_PENDING))],
    ];
    await Promise.all(tasks.map(async ([id, fn]) => {
      try { setStat(id, await fn()); }
      catch (err) {
        console.error('[stat]', id, err);
        setStatError(id);
      }
    }));
  }

  // ---------- 4. ALUNOS POR NÍVEL ----------
  async function loadLevels() {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
    try {
      const { data, error } = await sb
        .from('flowence_student')
        .select('level')
        .in('status', STATUS_ACTIVE);
      if (error) throw error;

      const counts = levels.reduce((acc, lv) => (acc[lv] = 0, acc), {});
      let total = 0;
      (data || []).forEach(row => {
        const lv = (row.level || '').toUpperCase();
        if (counts[lv] !== undefined) { counts[lv]++; total++; }
      });

      levels.forEach(lv => {
        const count = counts[lv];
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const countEl = document.getElementById(`level-count-${lv}`);
        const barEl   = document.getElementById(`level-bar-${lv}`);
        if (countEl) countEl.textContent = `${count} ${count === 1 ? 'aluno' : 'alunos'}`;
        if (barEl) {
          requestAnimationFrame(() => { barEl.style.width = `${pct}%`; });
        }
      });
    } catch (err) {
      console.error('[levels]', err);
      levels.forEach(lv => {
        const el = document.getElementById(`level-count-${lv}`);
        if (el) el.textContent = '—';
      });
    }
  }

  // ---------- 5. TEMAS DO MÊS ----------
  async function loadThemes() {
    const list = document.getElementById('theme-list');
    const monthLabel = document.getElementById('month-label');
    if (!list) return;

    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                   'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const now = new Date();
    const currentMonth = now.getMonth() + 1;

    list.innerHTML = '<div class="empty">Carregando temas…</div>';

    try {
      let { data, error } = await sb
        .from('flowence_assignment')
        .select('theme, level, month')
        .eq('month', currentMonth);
      if (error) throw error;

      let displayMonth = currentMonth;
      if (!data || data.length === 0) {
        const { data: all, error: err2 } = await sb
          .from('flowence_assignment')
          .select('theme, level, month')
          .order('month', { ascending: false });
        if (err2) throw err2;
        if (all && all.length > 0) {
          displayMonth = all[0].month;
          data = all.filter(r => r.month === displayMonth);
        }
      }

      if (monthLabel) monthLabel.textContent = `— ${meses[displayMonth - 1]}`;

      const grouped = {};
      (data || []).forEach(row => {
        const theme = (row.theme || '').trim();
        if (!theme) return;
        if (!grouped[theme]) grouped[theme] = { count: 0, levels: new Set() };
        grouped[theme].count++;
        if (row.level) grouped[theme].levels.add(row.level.toUpperCase());
      });

      const themes = Object.entries(grouped)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 4);

      if (themes.length === 0) {
        list.innerHTML = '<div class="empty">Nenhum tema atribuído este mês</div>';
        return;
      }

      list.innerHTML = themes.map(([name, info]) => {
        const levelsStr = [...info.levels].sort().join(' · ') || '—';
        return `
          <div class="topic">
            <span class="topic-icon">◎</span>
            <div class="topic-body">
              <div class="topic-title">${escapeHtml(name)}</div>
              <div class="topic-meta">${levelsStr} · ${info.count} ${info.count === 1 ? 'atribuição' : 'atribuições'}</div>
            </div>
          </div>`;
      }).join('');

    } catch (err) {
      console.error('[themes]', err);
      list.innerHTML = '<div class="empty empty-error">Erro ao carregar temas</div>';
    }
  }

  // ---------- 6. MISSÕES RECENTES ----------
  async function loadRecentMissions() {
    const list = document.getElementById('missions-list');
    if (!list) return;

    try {
      const { data, error } = await sb
        .from('flowence_mission')
        .select('id, description, status, level, due_date, completed_at, created_at, student_id')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;

      if (!data || data.length === 0) {
        list.innerHTML = '<div class="empty">Nenhuma missão registrada</div>';
        return;
      }

      const studentIds = [...new Set(data.map(m => m.student_id).filter(Boolean))];
      let studentMap = {};
      if (studentIds.length) {
        const { data: students } = await sb
          .from('flowence_student')
          .select('id, name')
          .in('id', studentIds);
        studentMap = Object.fromEntries((students || []).map(s => [s.id, s.name]));
      }

      list.innerHTML = data.map(m => {
        const statusClass = m.status === 'completed' ? 'mission-done'
                           : m.status === 'pending'   ? 'mission-pending'
                           : 'mission-other';
        const statusLabel = m.status === 'completed' ? 'Concluída'
                           : m.status === 'pending'   ? 'Pendente'
                           : (m.status || '—');
        const student = m.student_id ? (studentMap[m.student_id] || '—') : '—';
        const desc = m.description || 'Sem descrição';
        return `
          <div class="mission-row">
            <span class="mission-status ${statusClass}">${statusLabel}</span>
            <div class="mission-body">
              <div class="mission-desc" title="${escapeHtml(desc)}">${escapeHtml(truncate(desc, 60))}</div>
              <div class="mission-meta">${escapeHtml(student)} · ${m.level || '—'}</div>
            </div>
          </div>`;
      }).join('');

    } catch (err) {
      console.error('[missions]', err);
      list.innerHTML = '<div class="empty empty-error">Erro ao carregar missões</div>';
    }
  }

  // ---------- 7. PRÓXIMAS AULAS ----------
  async function loadUpcomingLessons() {
    const list = document.getElementById('lessons-list');
    if (!list) return;

    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await sb
        .from('flowence_lesson')
        .select('id, date, title, theme, level, class_id')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(3);
      if (error) throw error;

      if (!data || data.length === 0) {
        list.innerHTML = '<div class="empty">Nenhuma aula agendada</div>';
        return;
      }

      const classIds = [...new Set(data.map(l => l.class_id).filter(Boolean))];
      let classMap = {};
      if (classIds.length) {
        const { data: classes } = await sb
          .from('flowence_class')
          .select('id, name')
          .in('id', classIds);
        classMap = Object.fromEntries((classes || []).map(c => [c.id, c.name]));
      }

      list.innerHTML = data.map(l => {
        const className = l.class_id ? (classMap[l.class_id] || '—') : '—';
        const title = l.title || l.theme || 'Aula sem título';
        return `
          <div class="lesson-row">
            <div class="lesson-date">${formatDateBR(l.date)}</div>
            <div class="lesson-body">
              <div class="lesson-title">${escapeHtml(truncate(title, 50))}</div>
              <div class="lesson-meta">${escapeHtml(className)} · ${l.level || '—'}</div>
            </div>
          </div>`;
      }).join('');

    } catch (err) {
      console.error('[lessons]', err);
      list.innerHTML = '<div class="empty empty-error">Erro ao carregar aulas</div>';
    }
  }

  // ---------- 8. HELPERS ----------
  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>\"']/g, ch => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }

  function truncate(s, max) {
    s = String(s ?? '');
    return s.length > max ? s.slice(0, max - 1) + '…' : s;
  }

  function formatDateBR(d) {
    if (!d) return '—';
    const [y, m, day] = String(d).slice(0, 10).split('-');
    if (!y || !m || !day) return d;
    return `${day}/${m}`;
  }

  // ---------- 9. NAVEGAÇÃO DA SIDEBAR ----------
  function setupNav() {
    // Fallback pra data-href
    const map = {
      'Dashboard':   'index.html',
      'Alunos':      'alunos.html',
      'Turmas':      'turmas.html',
      'Níveis CEFR': 'niveis.html',
      'Temas Mensais': 'temas.html',
      'Atribuições': 'atribuicoes.html',
      'Aulas':       'aulas.html',
      'Materiais':   'materiais.html',
      'Missões':     'missoes.html',
      'O Método':    'metodo.html',
    };

    $$('.menu-item').forEach(item => {
      const href = item.dataset.href || map[item.textContent.trim()];
      if (!href) return;
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => { window.location.href = href; });
    });

    // ---------- MENU MOBILE ----------
    const hamburger = document.getElementById('hamburger');
    const sidebar   = document.getElementById('sidebar');
    const backdrop  = document.getElementById('sidebar-backdrop');

    if (hamburger && sidebar && backdrop) {
      const toggle = () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('show');
      };
      hamburger.addEventListener('click', toggle);
      backdrop.addEventListener('click', toggle);
    }
  }

  // ---------- 10. REFRESH MANUAL ----------
  function setupRefresh() {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        loadAll();
        toast('Atualizando dados…', 'info');
      }
    });
  }

  // ---------- 11. BOOT ----------
  async function loadAll() {
    $$('.stat-value').forEach(el => el.classList.add('shimmer'));
    await Promise.allSettled([
      loadStats(),
      loadLevels(),
      loadThemes(),
      loadRecentMissions(),
      loadUpcomingLessons(),
    ]);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setupRefresh();
    loadAll();
  });

})();
