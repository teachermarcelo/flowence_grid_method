'use strict';

(function() {
  // ============================================================
  // Flowence Grid — turmas.js
  // Gerencia CRUD de turmas com Supabase
  // ============================================================

  // ---------- 1. VALIDAÇÃO DE SUPABASE ----------
  if (!window.SUPABASE_CONFIG || !window.supabase) {
    console.error('[Turmas] supabase-config.js não carregado');
    document.body.innerHTML = '<div style="padding:20px; color:red;">Erro: Supabase não configurado</div>';
    return;
  }

  const supabaseClient = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey
  );

  // ---------- 2. UTILITÁRIOS ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function normalizeStatus(status) {
    const lower = (status || '').toLowerCase().trim();
    if (lower === 'ativo' || lower === 'active') return 'ativa';
    return 'inativa';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  }

  function levelBadge(nivel) {
    if (!nivel) return '';
    const colors = {
      'A1': 'a1', 'A2': 'a2', 'B1': 'b1', 'B2': 'b2', 'C1': 'c1'
    };
    const colorClass = colors[nivel.toUpperCase()] || '';
    return `<span class="badge ${colorClass}">${esc(nivel)}</span>`;
  }

  function statusPill(status) {
    const norm = normalizeStatus(status);
    const isActive = norm === 'ativa';
    const pillClass = `pill ${isActive ? 'pill-green' : 'pill-gray'}`;
    const text = isActive ? 'Ativa' : 'Inativa';
    return `<span class="${pillClass}">● ${esc(text)}</span>`;
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // ---------- 3. ESTADO EM MEMÓRIA ----------
  let turmas = [];
  let alunos = [];

  // ---------- 4. CARREGAR DADOS ----------
  async function loadAll() {
    try {
      showToast('Carregando turmas...', 'info');

      // Carregar turmas
      const { data: classData, error: classError } = await supabaseClient
        .from('flowence_class')
        .select('*')
        .order('nome', { ascending: true });

      if (classError) throw classError;
      turmas = classData || [];

      // Carregar alunos para contar
      const { data: studentData, error: studentError } = await supabaseClient
        .from('flowence_student')
        .select('id, class_id');

      if (studentError) throw studentError;
      alunos = studentData || [];

      renderQuickStats();
      renderTable();
      showToast('Turmas carregadas', 'success');
    } catch (error) {
      console.error('[loadAll]', error);
      showToast(`Erro ao carregar: ${error.message}`, 'error');
      const container = $('#data-container');
      if (container) {
        container.innerHTML = `<div class="empty" style="grid-column:1/-1;">Erro ao carregar turmas. Verifique a conexão.</div>`;
      }
    }
  }

  // ---------- 5. FILTRAR ----------
  function getFiltered() {
    const search = ($('#search-input')?.value || '').toLowerCase().trim();
    const levelFilter = ($('#filter-level')?.value || '').toLowerCase().trim();
    const statusFilter = ($('#filter-status')?.value || '').toLowerCase().trim();

    return turmas.filter(turma => {
      const matchSearch = !search ||
        (turma.nome || '').toLowerCase().includes(search) ||
        (turma.professor || '').toLowerCase().includes(search);
      const matchLevel = !levelFilter || (turma.nivel || '').toLowerCase() === levelFilter;
      const matchStatus = !statusFilter || normalizeStatus(turma.status) === statusFilter;
      return matchSearch && matchLevel && matchStatus;
    });
  }

  // ---------- 6. RENDERIZAR STATS ----------
  function renderQuickStats() {
    const filtered = getFiltered();
    const total = turmas.length;
    const active = turmas.filter(t => normalizeStatus(t.status) === 'ativa').length;
    const shown = filtered.length;

    const qsTotal = $('#qs-total');
    if (qsTotal) qsTotal.textContent = total;

    const qsActive = $('#qs-active');
    if (qsActive) qsActive.textContent = active;

    const qsShown = $('#qs-shown');
    if (qsShown) qsShown.textContent = shown;
  }

  // ---------- 7. RENDERIZAR TABELA ----------
  function renderTable() {
    const container = $('#data-container');
    if (!container) return;

    const filtered = getFiltered();

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty" style="grid-column:1/-1; text-align:center; padding:40px 20px;">📚 Nenhuma turma encontrada</div>';
      return;
    }

    let html = '';
    filtered.forEach(turma => {
      const count = alunos.filter(s => s.class_id === turma.id).length;
      const avatar = (turma.nome || '').charAt(0).toUpperCase();
      const nomeEsc = esc(turma.nome || '');
      const professorEsc = esc(turma.professor || '');
      const horarioEsc = esc(turma.horario || '');
      const dataInicio = formatDate(turma.data_inicio);
      const levelB = levelBadge(turma.nivel);
      const statusP = statusPill(turma.status);

      html += `
        <div class="table-row">
          <div class="table-cell-turma">
            <div class="avatar">${avatar}</div>
            <div class="turma-info">
              <div class="turma-nome">${nomeEsc}</div>
              <div class="turma-meta">${professorEsc}</div>
            </div>
          </div>
          <div class="table-cell">${professorEsc}</div>
          <div class="table-cell">${levelB}</div>
          <div class="table-cell">${horarioEsc}</div>
          <div class="table-cell">${dataInicio}</div>
          <div class="table-cell">${statusP}</div>
          <div class="table-cell table-cell-center">${count}</div>
          <div class="table-cell table-cell-actions">
            <button class="btn-icon btn-edit" data-id="${turma.id}" title="Editar">✏️</button>
            <button class="btn-icon btn-del" data-id="${turma.id}" title="Deletar">🗑️</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ---------- 8. ABRIR MODAL ----------
  function openModal(id = null) {
    const modal = $('#modal-overlay');
    const title = $('.modal-title');
    const btnSave = $('#btn-save');

    if (!modal || !title) return;

    // Limpar form
    $('#f-id').value = '';
    $('#f-nome').value = '';
    $('#f-professor').value = '';
    $('#f-nivel').value = 'A1';
    $('#f-horario').value = '';
    $('#f-data_inicio').value = '';
    $('#f-status').value = 'ativa';
    $('#f-observacoes').value = '';

    // Se editando
    if (id) {
      const turma = turmas.find(t => t.id === id);
      if (!turma) {
        showToast('Turma não encontrada', 'error');
        return;
      }
      $('#f-id').value = turma.id;
      $('#f-nome').value = turma.nome || '';
      $('#f-professor').value = turma.professor || '';
      $('#f-nivel').value = turma.nivel || 'A1';
      $('#f-horario').value = turma.horario || '';
      $('#f-data_inicio').value = turma.data_inicio || '';
      $('#f-status').value = normalizeStatus(turma.status);
      $('#f-observacoes').value = turma.observacoes || '';
      title.textContent = 'Editar Turma';
    } else {
      title.textContent = 'Nova Turma';
    }

    modal.classList.add('show');
  }

  // ---------- 9. FECHAR MODAL ----------
  function closeModal() {
    const modal = $('#modal-overlay');
    if (modal) modal.classList.remove('show');
  }

  // ---------- 10. SALVAR TURMA ----------
  async function saveTurma() {
    const nome = ($('#f-nome').value || '').trim();
    const professor = ($('#f-professor').value || '').trim();
    const nivel = $('#f-nivel').value || '';
    const horario = ($('#f-horario').value || '').trim();
    const data_inicio = $('#f-data_inicio').value || null;
    const status = $('#f-status').value || 'ativa';
    const observacoes = ($('#f-observacoes').value || '').trim();

    // Validação
    if (!nome) {
      showToast('Nome da turma é obrigatório', 'error');
      $('#f-nome').focus();
      return;
    }
    if (!professor) {
      showToast('Professor é obrigatório', 'error');
      $('#f-professor').focus();
      return;
    }
    if (!nivel) {
      showToast('Nível é obrigatório', 'error');
      return;
    }

    const id = $('#f-id').value;
    const data = { nome, professor, nivel, horario, data_inicio, status, observacoes };

    try {
      if (id) {
        const { error } = await supabaseClient
          .from('flowence_class')
          .update(data)
          .eq('id', id);
        if (error) throw error;
        showToast('Turma atualizada com sucesso', 'success');
      } else {
        const { error } = await supabaseClient
          .from('flowence_class')
          .insert([data]);
        if (error) throw error;
        showToast('Turma criada com sucesso', 'success');
      }
      closeModal();
      loadAll();
    } catch (error) {
      console.error('[saveTurma]', error);
      showToast(`Erro ao salvar: ${error.message}`, 'error');
    }
  }

  // ---------- 11. DELETAR TURMA ----------
  async function deleteTurma(id) {
    const turma = turmas.find(t => t.id === id);
    if (!turma) return;

    if (!confirm(`Tem certeza que deseja deletar a turma "${turma.nome}"?`)) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('flowence_class')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Turma deletada com sucesso', 'success');
      loadAll();
    } catch (error) {
      console.error('[deleteTurma]', error);
      showToast(`Erro ao deletar: ${error.message}`, 'error');
    }
  }

  // ---------- 12. SETUP EVENTOS ----------
  function setupEvents() {
    // Botão novo
    const btnNew = $('#btn-new');
    if (btnNew) {
      btnNew.addEventListener('click', () => openModal());
    }

    // Botão salvar
    const btnSave = $('#btn-save');
    if (btnSave) {
      btnSave.addEventListener('click', (e) => {
        e.preventDefault();
        saveTurma();
      });
    }

    // Botão cancelar
    const btnCancel = $('#btn-cancel');
    if (btnCancel) {
      btnCancel.addEventListener('click', () => closeModal());
    }

    // Botão fechar modal
    const modalClose = $('#modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => closeModal());
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Fechar modal clicando no overlay
    const modal = $('#modal-overlay');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Busca com debounce
    const searchInput = $('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(() => {
        renderQuickStats();
        renderTable();
      }, 300));
    }

    // Filtro de nível
    const filterLevel = $('#filter-level');
    if (filterLevel) {
      filterLevel.addEventListener('change', () => {
        renderQuickStats();
        renderTable();
      });
    }

    // Filtro de status
    const filterStatus = $('#filter-status');
    if (filterStatus) {
      filterStatus.addEventListener('change', () => {
        renderQuickStats();
        renderTable();
      });
    }

    // Ações da tabela (event delegation)
    document.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit');
      if (editBtn) {
        openModal(editBtn.dataset.id);
        return;
      }

      const delBtn = e.target.closest('.btn-del');
      if (delBtn) {
        deleteTurma(delBtn.dataset.id);
        return;
      }
    });
  }

  // ---------- 13. INIT ----------
  document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    loadAll();
  });

})();
