// ============================================================
// student-detail.js — Página dedicada do aluno com histórico
// ============================================================

(() => {
  'use strict';

  const sb = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey
  );

  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const params = new URLSearchParams(window.location.search);
  const studentId = params.get('id');

  function setupNav() {
    const map = {
      'Dashboard':'index.html','Alunos':'alunos.html','Turmas':'turmas.html',
      'Níveis CEFR':'niveis.html','Temas Mensais':'temas.html',
      'Atribuições':'atribuicoes.html','Aulas':'aulas.html',
      'Materiais':'materiais.html','Missões':'missoes.html','O Método':'metodo.html'
    };
    $$('.menu-item').forEach(el => {
      const label = el.textContent.trim();
      if (map[label]) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => { window.location.href = map[label]; });
      }
    });
  }

  function formatDate(d) {
    if (!d) return '—';
    const [y,m,day] = String(d).slice(0,10).split('-');
    return `${day}/${m}/${y}`;
  }

  function levelBadge(level) {
    const lv = (level || '').toUpperCase();
    const map = { A1:'a1', A2:'a2', B1:'b1', B2:'b2', C1:'c1' };
    return `<span class="badge ${map[lv] || 'a1'} badge-lg">${esc(lv)}</span>`;
  }

  function parseTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try { const p = JSON.parse(tags); return Array.isArray(p) ? p : []; }
    catch { return String(tags).split(',').map(t => t.trim()).filter(Boolean); }
  }

  const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  async function load() {
    if (!studentId) {
      $('#student-root').innerHTML = '<div class="empty empty-error">ID do aluno não fornecido</div>';
      return;
    }

    try {
      // Em paralelo: aluno, turma (se houver), links, notas, missões, atribuições, aulas (via turma)
      const studentRes = await sb.from('flowence_student').select('*').eq('id', studentId).single();
      if (studentRes.error) throw studentRes.error;
      const student = studentRes.data;

      const [classRes, linksRes, notesRes, missionsRes, assignsRes] = await Promise.all([
        student.class_id
          ? sb.from('flowence_class').select('*').eq('id', student.class_id).single()
          : Promise.resolve({ data: null }),
        sb.from('flowence_student_link').select('*').eq('student_id', studentId).order('created_at', { ascending: true }),
        sb.from('flowence_student_note').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
        sb.from('flowence_mission').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
        sb.from('flowence_assignment').select('*').eq('student_id', studentId).order('month', { ascending: true }),
      ]);

      // Aulas: vêm da turma do aluno
      let lessons = [];
      if (student.class_id) {
        const lRes = await sb.from('flowence_lesson').select('*').eq('class_id', student.class_id).order('date', { ascending: false }).limit(20);
        if (!lRes.error) lessons = lRes.data || [];
      }

      render({
        student,
        klass:       classRes.data,
        links:       linksRes.data || [],
        notes:       notesRes.data || [],
        missions:    missionsRes.data || [],
        assignments: assignsRes.data || [],
        lessons
      });
    } catch (err) {
      console.error(err);
      $('#student-root').innerHTML = `<div class="empty empty-error">Erro: ${esc(err.message || err)}</div>`;
    }
  }

  function render({ student, klass, links, notes, missions, assignments, lessons }) {
    document.title = `${student.name} — Flowence`;
    $('#page-student-name').textContent = student.name;

    $('#btn-edit').addEventListener('click', () => {
      window.location.href = `alunos.html?edit=${encodeURIComponent(student.id)}`;
    });

    const tags = parseTags(student.tags);
    const isActive = ['active', 'Ativo', 'ativo', 'ACTIVE'].includes(student.status);

    const pendingMissions   = missions.filter(m => ['pending', 'Pendente', 'pendente'].includes(m.status));
    const completedMissions = missions.filter(m => ['completed', 'Concluida', 'completo'].includes(m.status));

    $('#student-root').innerHTML = `

      <!-- HEADER do aluno -->
      <div class="student-header">
        <div class="student-avatar-lg">${esc((student.name || '?').charAt(0).toUpperCase())}</div>
        <div class="student-header-info">
          <h1 class="student-h1">${esc(student.name)}</h1>
          <div class="student-h1-meta">
            ${levelBadge(student.level)}
            <span class="text-muted">·</span>
            <span>Sublevel ${esc(student.sublevel || 1)}</span>
            <span class="text-muted">·</span>
            ${isActive ? '<span class="pill pill-green">● Ativo</span>' : `<span class="pill pill-gray">○ ${esc(student.status || 'Inativo')}</span>`}
          </div>
          ${tags.length ? `<div class="chip-list" style="margin-top:10px">${tags.map(t => `<span class="chip chip-purple">${esc(t)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="student-quick">
          <div class="qstat"><div class="qstat-value">${pendingMissions.length}</div><div class="qstat-label">Missões pendentes</div></div>
          <div class="qstat"><div class="qstat-value">${completedMissions.length}</div><div class="qstat-label">Concluídas</div></div>
          <div class="qstat"><div class="qstat-value">${assignments.length}</div><div class="qstat-label">Atribuições</div></div>
        </div>
      </div>

      <!-- INFO + TURMA + LINKS -->
      <div class="method-grid-2">
        <div class="panel">
          <div class="panel-title">📇 Contato e Informações</div>
          <div class="info-grid">
            <div class="info-row"><span class="info-label">Email</span><span>${esc(student.email || '—')}</span></div>
            <div class="info-row"><span class="info-label">Telefone</span><span>${esc(student.phone || '—')}</span></div>
            <div class="info-row"><span class="info-label">Nascimento</span><span>${formatDate(student.dob)}</span></div>
            <div class="info-row"><span class="info-label">Cadastrado</span><span>${formatDate(student.created_at)}</span></div>
          </div>
          ${student.notes ? `
            <div class="panel-subtitle" style="margin-top:14px">Observações</div>
            <p class="panel-text">${esc(student.notes)}</p>
          ` : ''}
        </div>

        <div class="panel">
          <div class="panel-title">🏫 Turma</div>
          ${klass ? `
            <div class="info-grid">
              <div class="info-row"><span class="info-label">Nome</span><span><strong>${esc(klass.name)}</strong></span></div>
              <div class="info-row"><span class="info-label">Nível</span><span>${levelBadge(klass.level)}</span></div>
              <div class="info-row"><span class="info-label">Horário</span><span>${esc(klass.schedule || '—')}</span></div>
              <div class="info-row"><span class="info-label">Professor</span><span>${esc(klass.teacher || '—')}</span></div>
            </div>
          ` : '<div class="empty">Aluno sem turma atribuída</div>'}

          <div class="panel-subtitle" style="margin-top:14px">🔗 Links externos</div>
          ${links.length ? `
            <div class="links-display">
              ${links.map(l => `
                <a href="${esc(l.url)}" target="_blank" rel="noopener" class="link-card">
                  <span class="link-type-icon">${iconForType(l.type)}</span>
                  <div>
                    <div class="link-card-label">${esc(l.label)}</div>
                    <div class="link-card-url">${esc(l.url)}</div>
                  </div>
                </a>
              `).join('')}
            </div>
          ` : '<div class="empty">Nenhum link cadastrado</div>'}
        </div>
      </div>

      <!-- MISSÕES + ATRIBUIÇÕES -->
      <div class="method-grid-2">
        <div class="panel">
          <div class="panel-title">🏆 Missões (${missions.length})</div>
          ${missions.length ? `
            <div class="mission-list">
              ${missions.slice(0, 10).map(m => `
                <div class="mission-row">
                  ${m.status === 'completed' || m.status === 'Concluida'
                    ? '<span class="mission-status mission-done">Concluída</span>'
                    : '<span class="mission-status mission-pending">Pendente</span>'}
                  <div class="mission-body">
                    <div class="mission-desc">${esc(m.description || 'Sem descrição')}</div>
                    <div class="mission-meta">${levelBadge(m.level)} ${m.due_date ? '· venc ' + formatDate(m.due_date) : ''}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<div class="empty">Nenhuma missão</div>'}
        </div>

        <div class="panel">
          <div class="panel-title">📅 Atribuições (${assignments.length})</div>
          ${assignments.length ? `
            <div class="assign-list">
              ${assignments.map(a => `
                <div class="assign-row">
                  <div class="assign-month">${MESES[(a.month || 1) - 1].slice(0, 3)}</div>
                  <div>
                    <div class="assign-theme">${esc(a.theme)}</div>
                    <div class="assign-meta">${levelBadge(a.level)} ${a.mission ? '· ' + esc(a.mission) : ''}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<div class="empty">Nenhuma atribuição</div>'}
        </div>
      </div>

      <!-- AULAS da turma -->
      ${lessons.length ? `
        <div class="panel">
          <div class="panel-title">📚 Últimas aulas da turma (${lessons.length})</div>
          <div class="lessons-list-page">
            ${lessons.map(l => `
              <div class="lesson-row">
                <div class="lesson-date">${formatDate(l.date)}</div>
                <div class="lesson-body">
                  <div class="lesson-title">${esc(l.title || l.theme || 'Aula')}</div>
                  <div class="lesson-meta">${levelBadge(l.level)} ${l.theme ? '· ' + esc(l.theme) : ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- NOTAS -->
      <div class="panel">
        <div class="panel-title">📝 Notas (${notes.length})</div>
        ${notes.length ? `
          <div class="notes-list">
            ${notes.map(n => `
              <div class="note-card">
                <div class="note-date">${formatDate(n.created_at)}</div>
                <p class="note-text">${esc(n.content)}</p>
              </div>
            `).join('')}
          </div>
        ` : '<div class="empty">Nenhuma nota registrada</div>'}
      </div>

      <div class="back-link-wrap">
        <a href="alunos.html" class="back-link">← Voltar à lista de alunos</a>
      </div>
    `;
  }

  function iconForType(type) {
    return { website:'🌐', material:'📚', exercise:'✏️', audio:'🎧', video:'🎬' }[type] || '🔗';
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    load();
  });
})();
