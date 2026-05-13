// ============================================================
// students.js — CRUD de alunos com modal, busca, filtros
// Tabelas: flowence_student, flowence_class, flowence_student_link
// ============================================================

(() => {
  'use strict';

  if (!window.SUPABASE_CONFIG || !window.supabase) {
    console.error('[students] Supabase não carregado');
    return;
  }
  const sb = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey
  );
  window.sb = sb;

  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  // Aceita variações de status
  const isActive = (s) => ['active', 'Ativo', 'ativo', 'ACTIVE'].includes(s);

  // Estado em memória
  let students = [];
  let classes  = [];
  let editingLinks = []; // links sendo editados no modal

  // ---------- TOAST ----------
  function toast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-show'));
    setTimeout(() => {
      t.classList.remove('toast-show');
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  // ---------- NAV SIDEBAR ----------
  function setupNav() {
    const map = {
      'Dashboard':'index.html', 'Alunos':'alunos.html', 'Turmas':'turmas.html',
      'Níveis CEFR':'niveis.html', 'Temas Mensais':'temas.html',
      'Atribuições':'atribuicoes.html', 'Aulas':'aulas.html',
      'Materiais':'materiais.html', 'Missões':'missoes.html', 'O Método':'metodo.html'
    };
    $$('.menu-item').forEach(el => {
      const href = el.dataset.href || map[el.textContent.trim()];
      if (!href) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => { window.location.href = href; });
    });

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

  // ---------- LOAD ----------
  async function loadAll() {
    try {
      const [studRes, classRes] = await Promise.all([
        sb.from('flowence_student').select('*').order('name', { ascending: true }),
        sb.from('flowence_class').select('id, name, level').order('name', { ascending: true })
      ]);
      if (studRes.error) throw studRes.error;
      if (classRes.error) throw classRes.error;

      students = studRes.data || [];
      classes  = classRes.data || [];

      populateClassFilters();
      renderTable();
      renderQuickStats();
    } catch (err) {
      console.error('[load]', err);
      $('#students-table').innerHTML = `<div class="empty empty-error">Erro ao carregar: ${esc(err.message || err)}</div>`;
    }
  }

  function populateClassFilters() {
    const sel = $('#filter-class');
    const fSel = $('#f-class');
    const opts = classes.map(c => `<option value="${esc(c.id)}">${esc(c.name)}${c.level ? ' · ' + esc(c.level) : ''}</option>`).join('');
    sel.innerHTML  = `<option value="">Todas as turmas</option>${opts}`;
    fSel.innerHTML = `<option value="">— Sem turma —</option>${opts}`;
  }

  // ---------- FILTROS ----------
  function getFiltered() {
    const q      = ($('#search-input').value || '').toLowerCase().trim();
    const fLevel = $('#filter-level').value;
    const fStat  = $('#filter-status').value;
    const fClass = $('#filter-class').value;

    return students.filter(s => {
      if (q) {
        const hay = `${s.name || ''} ${s.email || ''} ${s.phone || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (fLevel && (s.level || '').toUpperCase() !== fLevel) return false;
      if (fStat === 'active'   && !isActive(s.status)) return false;
      if (fStat === 'inactive' &&  isActive(s.status)) return false;
      if (fClass && s.class_id !== fClass) return false;
      return true;
    });
  }

  // ---------- RENDER ----------
  function renderQuickStats() {
    const total  = students.length;
    const active = students.filter(s => isActive(s.status)).length;
    const shown  = getFiltered().length;
    $('#qs-total').textContent  = total;
    $('#qs-active').textContent = active;
    $('#qs-shown').textContent  = shown;
  }

  function levelBadge(level) {
    const lv = (level || '').toUpperCase();
    const map = { A1:'a1', A2:'a2', B1:'b1', B2:'b2', C1:'c1' };
    const cls = map[lv] || 'a1';
    return `<span class="badge ${cls}">${esc(lv || '—')}</span>`;
  }

  function classNameOf(class_id) {
    if (!class_id) return '<span class="text-muted">—</span>';
    const c = classes.find(x => x.id === class_id);
    return c ? esc(c.name) : '<span class="text-muted">—</span>';
  }

  function statusPill(status) {
    if (isActive(status)) return `<span class="pill pill-green">● Ativo</span>`;
    return `<span class="pill pill-gray">○ ${esc(status || 'Inativo')}</span>`;
  }

  function renderTable() {
    const filtered = getFiltered();
    renderQuickStats();
    const table = $('#students-table');

    if (filtered.length === 0) {
      table.innerHTML = '<div class="empty">Nenhum aluno encontrado</div>';
      return;
    }

    table.innerHTML = `
      <div class="st-head">
        <div>Aluno</div>
        <div>Nível</div>
        <div>Turma</div>
        <div>Contato</div>
        <div>Status</div>
        <div></div>
      </div>
      ${filtered.map(s => `
        <div class="st-row" data-id="${esc(s.id)}">
          <div class="st-aluno">
            <div class="st-avatar">${esc((s.name || '?').charAt(0).toUpperCase())}</div>
            <div>
              <div class="st-name">${esc(s.name || '—')}</div>
              <div class="st-meta">${s.dob ? '🎂 ' + formatDate(s.dob) : '—'}</div>
            </div>
          </div>
          <div>${levelBadge(s.level)} <span class="text-muted">·${s.sublevel || 1}</span></div>
          <div class="st-class">${classNameOf(s.class_id)}</div>
          <div class="st-contact">
            ${s.email ? `<div title="${esc(s.email)}">✉ ${esc(s.email)}</div>` : ''}
            ${s.phone ? `<div>📱 ${esc(s.phone)}</div>` : ''}
            ${!s.email && !s.phone ? '<span class="text-muted">—</span>' : ''}
          </div>
          <div>${statusPill(s.status)}</div>
          <div class="st-actions">
            <button class="btn-icon btn-view"  title="Ver detalhes"   data-id="${esc(s.id)}">👁</button>
            <button class="btn-icon btn-edit"  title="Editar"         data-id="${esc(s.id)}">✏️</button>
            <button class="btn-icon btn-del"   title="Excluir"        data-id="${esc(s.id)}">🗑</button>
          </div>
        </div>
      `).join('')}
    `;

    // bind actions
    table.querySelectorAll('.btn-view').forEach(b => b.addEventListener('click', e => {
      const id = e.currentTarget.dataset.id;
      window.location.href = `aluno.html?id=${encodeURIComponent(id)}`;
    }));
    table.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', e => {
      openModal(e.currentTarget.dataset.id);
    }));
    table.querySelectorAll('.btn-del').forEach(b => b.addEventListener('click', e => {
      deleteStudent(e.currentTarget.dataset.id);
    }));
    table.querySelectorAll('.st-row').forEach(r => r.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      const id = r.dataset.id;
      window.location.href = `aluno.html?id=${encodeURIComponent(id)}`;
    }));
  }

  function formatDate(d) {
    if (!d) return '';
    const [y,m,day] = String(d).slice(0,10).split('-');
    return `${day}/${m}/${y}`;
  }

  // ---------- MODAL ----------
  function openModal(id = null) {
    editingLinks = [];
    if (id) {
      const s = students.find(x => x.id === id);
      if (!s) return;
      $('#modal-title').textContent = 'Editar Aluno';
      $('#f-id').value      = s.id;
      $('#f-name').value    = s.name || '';
      $('#f-email').value   = s.email || '';
      $('#f-phone').value   = s.phone || '';
      $('#f-dob').value     = s.dob || '';
      $('#f-status').value  = s.status || 'Ativo';
      $('#f-level').value   = (s.level || 'A1').toUpperCase();
      $('#f-sublevel').value = s.sublevel || 1;
      $('#f-class').value   = s.class_id || '';
      $('#f-tags').value    = parseTags(s.tags).join(', ');
      $('#f-notes').value   = s.notes || '';
      loadLinksForStudent(s.id);
    } else {
      $('#modal-title').textContent = 'Novo Aluno';
      $('#student-form').reset();
      $('#f-id').value = '';
      renderLinksList();
    }
    $('#modal-overlay').classList.add('open');
    setTimeout(() => $('#f-name').focus(), 100);
  }

  function closeModal() {
    $('#modal-overlay').classList.remove('open');
  }

  function parseTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      const p = JSON.parse(tags);
      return Array.isArray(p) ? p : [];
    } catch { return String(tags).split(',').map(t => t.trim()).filter(Boolean); }
  }

  // ---------- LINKS dinâmicos no modal ----------
  async function loadLinksForStudent(studentId) {
    try {
      const { data, error } = await sb
        .from('flowence_student_link')
        .select('id, label, url, type')
        .eq('student_id', studentId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      editingLinks = (data || []).map(l => ({ ...l, _existing: true }));
      renderLinksList();
    } catch (err) {
      console.error('[links]', err);
      editingLinks = [];
      renderLinksList();
    }
  }

  function renderLinksList() {
    const list = $('#links-list');
    if (editingLinks.length === 0) {
      list.innerHTML = '<div class="links-empty">Nenhum link adicionado</div>';
      return;
    }
    list.innerHTML = editingLinks.map((l, i) => `
      <div class="link-row">
        <input class="link-label" data-i="${i}" type="text" placeholder="Rótulo" value="${esc(l.label || '')}" />
        <input class="link-url"   data-i="${i}" type="url"  placeholder="https://…" value="${esc(l.url || '')}" />
        <select class="link-type" data-i="${i}">
          <option value="website"   ${l.type === 'website'   ? 'selected' : ''}>Website</option>
          <option value="material"  ${l.type === 'material'  ? 'selected' : ''}>Material</option>
          <option value="exercise"  ${l.type === 'exercise'  ? 'selected' : ''}>Exercício</option>
          <option value="audio"     ${l.type === 'audio'     ? 'selected' : ''}>Áudio</option>
          <option value="video"     ${l.type === 'video'     ? 'selected' : ''}>Vídeo</option>
        </select>
        <button type="button" class="btn-icon btn-rm-link" data-i="${i}" title="Remover">✕</button>
      </div>
    `).join('');

    list.querySelectorAll('.link-label').forEach(el => el.addEventListener('input', e => {
      editingLinks[e.target.dataset.i].label = e.target.value;
    }));
    list.querySelectorAll('.link-url').forEach(el => el.addEventListener('input', e => {
      editingLinks[e.target.dataset.i].url = e.target.value;
    }));
    list.querySelectorAll('.link-type').forEach(el => el.addEventListener('change', e => {
      editingLinks[e.target.dataset.i].type = e.target.value;
    }));
    list.querySelectorAll('.btn-rm-link').forEach(el => el.addEventListener('click', e => {
      editingLinks.splice(e.target.dataset.i, 1);
      renderLinksList();
    }));
  }

  $('#btn-add-link').addEventListener('click', () => {
    editingLinks.push({ label: '', url: '', type: 'website' });
    renderLinksList();
  });

  // ---------- SAVE ----------
  async function saveStudent(e) {
    e?.preventDefault();
    const id = $('#f-id').value || null;

    const name = $('#f-name').value.trim();
    if (!name) { toast('Nome é obrigatório', 'error'); return; }

    const payload = {
      name,
      email:    $('#f-email').value.trim() || null,
      phone:    $('#f-phone').value.trim() || null,
      dob:      $('#f-dob').value || null,
      status:   $('#f-status').value,
      level:    $('#f-level').value,
      sublevel: parseInt($('#f-sublevel').value) || 1,
      class_id: $('#f-class').value || null,
      notes:    $('#f-notes').value.trim() || null,
      tags:     JSON.stringify(
        $('#f-tags').value.split(',').map(t => t.trim()).filter(Boolean)
      ),
    };

    $('#btn-save').disabled = true;
    $('#btn-save').textContent = 'Salvando…';

    try {
      let studentId = id;

      if (id) {
        const { error } = await sb.from('flowence_student').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await sb.from('flowence_student').insert(payload).select().single();
        if (error) throw error;
        studentId = data.id;
      }

      // Sincroniza links
      await syncLinks(studentId);

      toast(id ? 'Aluno atualizado' : 'Aluno criado', 'success');
      closeModal();
      await loadAll();
    } catch (err) {
      console.error('[save]', err);
      toast('Erro ao salvar: ' + (err.message || err), 'error');
    } finally {
      $('#btn-save').disabled = false;
      $('#btn-save').textContent = 'Salvar';
    }
  }

  async function syncLinks(studentId) {
    // estratégia simples: deleta todos e reinsere
    const valid = editingLinks.filter(l => (l.label || '').trim() && (l.url || '').trim());

    const { error: delErr } = await sb
      .from('flowence_student_link')
      .delete()
      .eq('student_id', studentId);
    if (delErr) throw delErr;

    if (valid.length > 0) {
      const rows = valid.map(l => ({
        student_id: studentId,
        label: l.label.trim(),
        url:   l.url.trim(),
        type:  l.type || 'website'
      }));
      const { error: insErr } = await sb.from('flowence_student_link').insert(rows);
      if (insErr) throw insErr;
    }
  }

  // ---------- DELETE ----------
  async function deleteStudent(id) {
    const s = students.find(x => x.id === id);
    if (!s) return;
    if (!confirm(`Excluir o aluno "${s.name}"? Esta ação não pode ser desfeita.`)) return;

    try {
      // Apaga dependências primeiro (FK)
      await sb.from('flowence_student_link').delete().eq('student_id', id);
      await sb.from('flowence_student_note').delete().eq('student_id', id);
      await sb.from('flowence_mission').delete().eq('student_id', id);
      await sb.from('flowence_assignment').delete().eq('student_id', id);

      const { error } = await sb.from('flowence_student').delete().eq('id', id);
      if (error) throw error;

      toast('Aluno excluído', 'success');
      await loadAll();
    } catch (err) {
      console.error('[delete]', err);
      toast('Erro ao excluir: ' + (err.message || err), 'error');
    }
  }

  // ---------- BIND ----------
  function setupEvents() {
    $('#btn-new-student').addEventListener('click', () => openModal());
    $('#btn-save').addEventListener('click', saveStudent);
    $('#btn-cancel').addEventListener('click', closeModal);
    $('#modal-close').addEventListener('click', closeModal);
    $('#modal-overlay').addEventListener('click', e => {
      if (e.target.id === 'modal-overlay') closeModal();
    });
    $('#student-form').addEventListener('submit', saveStudent);

    let searchTimer;
    $('#search-input').addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(renderTable, 200);
    });
    $('#filter-level').addEventListener('change', renderTable);
    $('#filter-status').addEventListener('change', renderTable);
    $('#filter-class').addEventListener('change', renderTable);

    // ESC fecha modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && $('#modal-overlay').classList.contains('open')) {
        closeModal();
      }
    });
  }

  // ---------- BOOT ----------
  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setupEvents();
    loadAll();
  });
})();
