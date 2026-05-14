(function() {
  'use strict';

  // Verificação de Supabase
  if (!window.SUPABASE_CONFIG) {
    document.addEventListener('DOMContentLoaded', () => {
      showToast('Configuração do Supabase não encontrada.', 'error');
    });
    return;
  }

  // Inicialização do cliente Supabase
  const { createClient } = supabase;
  const supabaseClient = createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anon_key);

  // Funções auxiliares
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('toast-show'), 100);
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Estado em memória
  let turmas = [];
  let alunos = [];

  // Funções de utilidade
  function normalizeStatus(status) {
    const lower = (status || '').toLowerCase().trim();
    if (lower === 'ativo' || lower === 'active') return 'ativo';
    return 'inativo';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('pt-BR');
  }

  function levelBadge(nivel) {
    if (!nivel) return '';
    const colors = {
      'A1': 'a1',
      'A2': 'a2',
      'B1': 'b1',
      'B2': 'b2',
      'C1': 'c1'
    };
    const colorClass = colors[nivel.toUpperCase()] || '';
    return `<span class="badge ${colorClass}">${nivel}</span>`;
  }

  function statusPill(status) {
    const norm = normalizeStatus(status);
    const isActive = norm === 'ativo';
    const pillClass = `pill ${isActive ? 'pill-green' : 'pill-gray'}`;
    const text = isActive ? 'Ativo' : 'Inativo';
    return `<span class="${pillClass}">${text}</span>`;
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // setupNav()
  function setupNav() {
    const toggle = $('.sidebar-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
      });
    }
  }

  // loadAll()
  async function loadAll() {
    try {
      showToast('Carregando...', 'info');
      const { data: classData, error: classError } = await supabaseClient
        .from('flowence_class')
        .select('*')
        .order('nome', { ascending: true });
      if (classError) throw classError;
      turmas = classData || [];

      const { data: studentData, error: studentError } = await supabaseClient
        .from('flowence_student')
        .select('id, class_id');
      if (studentError) throw studentError;
      alunos = studentData || [];

      renderQuickStats();
      renderTable();
    } catch (error) {
      console.error('Erro ao carregar:', error);
      showToast(`Erro ao carregar: ${error.message}`, 'error');
      renderTableError('Falha ao carregar turmas.');
    }
  }

  // getFiltered()
  function getFiltered() {
    const search = ($('#search-input')?.value || '').toLowerCase().trim();
    const levelFilter = ($('#filter-level')?.value || '');
    const statusFilter = ($('#filter-status')?.value || '');
    return turmas.filter(turma => {
      const matchesSearch = !search ||
        (turma.nome || '').toLowerCase().includes(search) ||
        (turma.professor || '').toLowerCase().includes(search);
      const matchesLevel = !levelFilter || turma.nivel === levelFilter;
      const matchesStatus = !statusFilter || normalizeStatus(turma.status) === statusFilter;
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }

  // renderQuickStats()
  function renderQuickStats() {
    const filtered = getFiltered();
    const total = turmas.length;
    const activeCount = turmas.filter(t => normalizeStatus(t.status) === 'ativo').length;
    const shown = filtered.length;

    const qsTotal = $('#qs-total-value');
    if (qsTotal) qsTotal.textContent = total.toLocaleString();

    const qsActive = $('#qs-active-value');
    if (qsActive) qsActive.textContent = activeCount.toLocaleString();

    const qsShown = $('#qs-shown-value');
    if (qsShown) qsShown.textContent = shown.toLocaleString();
  }

  // Aux renderTableError
  function renderTableError(msg) {
    const container = $('#turmas-table');
    if (container) {
      container.innerHTML = `<div class="empty empty-error">${esc(msg)}</div>`;
    }
  }

  // renderTable()
  function renderTable() {
    const container = $('#turmas-table');
    if (!container) return;

    const filtered = getFiltered();
    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty">Nenhuma turma encontrada</div>';
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
        <div class="st-row">
          <div class="st-turma">
            <div class="st-avatar">${avatar}</div>
            <div class="st-nome">${nomeEsc}</div>
          </div>
          <div class="st-professor">${professorEsc}</div>
          <div class="st-nivel">${levelB}</div>
          <div class="st-horario">${horarioEsc}</div>
          <div class="st-data">${dataInicio}</div>
          <div class="st-status">${statusP}</div>
          <div class="st-alunos">${count}</div>
          <div class="st-actions">
            <button class="btn-icon btn-view" data-id="${turma.id}" title="Ver">👁️</button>
            <button class="btn-icon btn-edit" data-id="${turma.id}" title="Editar">✏️</button>
            <button class="btn-icon btn-del" data-id="${turma.id}" title="Deletar">🗑️</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  // openModal(id = null, readonly = false)
  function openModal(id = null, readonly = false) {
    const modal = $('#modal-overlay');
    if (!modal) return;

    const titleEl = $('.modal-title');
    if (!titleEl) return;

    const fieldIds = ['f-id', 'f-nome', 'f-professor', 'f-nivel', 'f-horario', 'f-data_inicio', 'f-status', 'f-observacoes'];
    const fields = fieldIds.map(fid => $(`#${fid}`)).filter(Boolean);

    if (id) {
      const turma = turmas.find(t => t.id === id);
      if (!turma) {
        showToast('Turma não encontrada.', 'error');
        return;
      }
      fields[0].value = turma.id;
      fields[1].value = turma.nome || '';
      fields[2].value = turma.professor || '';
      fields[3].value = turma.nivel || '';
      fields[4].value = turma.horario || '';
      fields[5].value = turma.data_inicio || '';
      fields[6].value = normalizeStatus(turma.status);
      fields[7].value = turma.observacoes || '';
      titleEl.textContent = readonly ? 'Visualizar Turma' : 'Editar Turma';
    } else {
      fields.forEach(f => f.value = '');
      fields[6].value = 'ativo'; // default
      titleEl.textContent = 'Nova Turma';
    }

    fields.slice(1).forEach(f => f.disabled = readonly);

    const btnSave = $('#btn-save');
    const btnCancel = $('#btn-cancel');
    if (readonly) {
      if (btnSave) btnSave.style.display = 'none';
      if (btnCancel) btnCancel.textContent = 'Fechar';
    } else {
      if (btnSave) btnSave.style.display = '';
      if (btnCancel) btnCancel.textContent = 'Cancelar';
    }

    modal.classList.add('show');
  }

  // closeModal()
  function closeModal() {
    const modal = $('#modal-overlay');
    if (modal) modal.classList.remove('show');
  }

  // saveTurma(e)
  async function saveTurma(e) {
    if (e) e.preventDefault();

    const nomeField = $('#f-nome');
    const nome = nomeField ? nomeField.value.trim() : '';
    if (!nome) {
      showToast('O nome da turma é obrigatório.', 'error');
      nomeField?.focus();
      return;
    }

    const data = {
      nome,
      professor: ($('#f-professor')?.value || '').trim(),
      nivel: $('#f-nivel')?.value || '',
      horario: ($('#f-horario')?.value || '').trim(),
      data_inicio: $('#f-data_inicio')?.value || null,
      status: $('#f-status')?.value || 'ativo',
      observacoes: ($('#f-observacoes')?.value || '').trim()
    };

    try {
      const id = $('#f-id')?.value;
      if (id) {
        const { error } = await supabaseClient
          .from('flowence_class')
          .update(data)
          .eq('id', id);
        if (error) throw error;
        showToast('Turma atualizada com sucesso!', 'success');
      } else {
        const { error } = await supabaseClient
          .from('flowence_class')
          .insert([data]);
        if (error) throw error;
        showToast('Turma criada com sucesso!', 'success');
      }
      closeModal();
      loadAll();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showToast(`Erro ao salvar: ${error.message}`, 'error');
    }
  }

  // deleteTurma(id)
  async function deleteTurma(id) {
    const turma = turmas.find(t => t.id === id);
    if (!turma) return;
    if (!confirm(`Deseja realmente deletar a turma "${esc(turma.nome)}"?`)) return;

    try {
      const { error } = await supabaseClient
        .from('flowence_class')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Turma deletada com sucesso!', 'success');
      loadAll();
    } catch (error) {
      showToast(`Erro ao deletar: ${error.message}`, 'error');
    }
  }

  // setupEvents()
  function setupEvents() {
    const modal = $('#modal-overlay');
    const btnNew = $('#btn-new-turma');
    const btnSave = $('#btn-save');
    const btnCancel = $('#btn-cancel');
    const modalClose = $('#modal-close');

    if (btnNew) btnNew.addEventListener('click', () => openModal());
    if (btnSave) btnSave.addEventListener('click', saveTurma);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Filtros
    const searchInput = $('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(() => {
        renderQuickStats();
        renderTable();
      }, 300));
    }

    const filterLevel = $('#filter-level');
    if (filterLevel) {
      filterLevel.addEventListener('change', () => {
        renderQuickStats();
        renderTable();
      });
    }

    const filterStatus = $('#filter-status');
    if (filterStatus) {
      filterStatus.addEventListener('change', () => {
        renderQuickStats();
        renderTable();
      });
    }

    // Ações da tabela (delegation)
    document.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.btn-view');
      if (viewBtn) {
        const id = viewBtn.dataset.id;
        openModal(id, true);
        return;
      }

      const editBtn = e.target.closest('.btn-edit');
      if (editBtn) {
        const id = editBtn.dataset.id;
        openModal(id, false);
        return;
      }

      const delBtn = e.target.closest('.btn-del');
      if (delBtn) {
        const id = delBtn.dataset.id;
        deleteTurma(id);
        return;
      }
    });
  }

  // DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setupEvents();
    loadAll();
  });

})();
