(function() {
  'use strict';

  // Elementos DOM
  const DOM = {
    searchInput: document.getElementById('search-turmas'),
    filterNivel: document.getElementById('filter-nivel'),
    filterStatus: document.getElementById('filter-status'),
    table: document.getElementById('turmas-table'),
    tableBody: document.querySelector('#turmas-table tbody'),
    btnCriar: document.getElementById('btn-criar-turma'),
    modal: document.getElementById('modal-turma'),
    modalTitle: document.getElementById('modal-title'),
    formTurma: document.getElementById('form-turma'),
    btnCancelar: document.getElementById('btn-cancelar'),
    totalTurmas: document.getElementById('total-turmas'),
    turmasAtivas: document.getElementById('turmas-ativas'),
    totalAlunos: document.getElementById('total-alunos'),
    loading: document.querySelector('.loading')
  };

  // Dados globais
  let sb;
  let turmas = [];
  let alunosCount = {};
  let editingId = null;

  // Função auxiliar para escapar HTML
  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>\"']/g, m => map[m]);
  }

  // Função para formatar data
  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('pt-BR');
  }

  // Função debounce para buscas
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // Toast simples
  function createToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // Mostra/esconde loading/shimmer
  function showLoading(show) {
    if (DOM.loading) {
      DOM.loading.style.display = show ? 'block' : 'none';
    }
    DOM.table.classList.toggle('loading', show);
  }

  // Carrega contagem de alunos por turma
  async function loadAlunosCount() {
    const { data, error } = await sb.from('alunos').select('turma_id');
    if (error) {
      console.error('Erro ao carregar alunos:', error);
      return;
    }
    alunosCount = data.reduce((acc, { turma_id }) => {
      acc[turma_id] = (acc[turma_id] || 0) + 1;
      return acc;
    }, {});
  }

  // Carrega lista de turmas
  async function loadTurmas() {
    showLoading(true);
    try {
      const { data, error } = await sb.from('turmas').select('*').order('data_inicio', { ascending: false });
      if (error) throw error;
      turmas = data;
      await loadAlunosCount();
      updateQuickStats();
      render();
    } catch (error) {
      createToast('Erro ao carregar turmas: ' + error.message, 'error');
    } finally {
      showLoading(false);
    }
  }

  // Filtra turmas baseado em busca e filtros
  function filterTurmas() {
    const term = DOM.searchInput.value.toLowerCase();
    const nivel = DOM.filterNivel.value;
    const status = DOM.filterStatus.value;
    return turmas.filter(turma =>
      (turma.nome.toLowerCase().includes(term) || turma.professor?.toLowerCase().includes(term)) &&
      (nivel === '' || turma.nivel === nivel) &&
      (status === '' || turma.status === status)
    );
  }

  // Renderiza tabela
  function renderTable(filtered) {
    DOM.tableBody.innerHTML = filtered.length
      ? filtered.map(t => `
        <tr>
          <td>${escapeHtml(t.nome)}</td>
          <td>${escapeHtml(t.professor)}</td>
          <td>${t.nivel}</td>
          <td>${t.horario}</td>
          <td>${formatDate(t.data_inicio)}</td>
          <td>${t.status}</td>
          <td>${alunosCount[t.id] || 0}</td>
          <td>${escapeHtml(t.observacoes || '')}</td>
          <td>
            <button class="btn-edit" data-id="${t.id}">Editar</button>
            <button class="btn-delete" data-id="${t.id}">Deletar</button>
          </td>
        </tr>
      `).join('')
      : '<tr><td colspan="9">Nenhuma turma encontrada</td></tr>';
  }

  // Atualiza quick-stats
  function updateQuickStats() {
    const total = turmas.length;
    const ativas = turmas.filter(t => t.status === 'ativa').length;
    const totalAlu = Object.values(alunosCount).reduce((acc, v) => acc + (v || 0), 0);
    if (DOM.totalTurmas) DOM.totalTurmas.textContent = total;
    if (DOM.turmasAtivas) DOM.turmasAtivas.textContent = ativas;
    if (DOM.totalAlunos) DOM.totalAlunos.textContent = totalAlu;
  }

  // Renderiza tudo
  function render() {
    const filtered = filterTurmas();
    renderTable(filtered);
  }

  // Abre modal criar/editar
  function openModal(id = null) {
    editingId = id;
    DOM.modalTitle.textContent = id ? 'Editar Turma' : 'Nova Turma';
    const getInput = name => DOM.formTurma.querySelector(`[name="${name}"]`);

    if (id) {
      const turma = turmas.find(t => t.id === id);
      if (!turma) {
        createToast('Turma não encontrada', 'error');
        return;
      }
      ['nome', 'professor', 'horario', 'observacoes'].forEach(field => {
        getInput(field).value = turma[field] || '';
      });
      getInput('nivel').value = turma.nivel || '';
      getInput('status').value = turma.status || 'ativa';
      getInput('data_inicio').value = turma.data_inicio ? new Date(turma.data_inicio).toISOString().slice(0, 10) : '';
    } else {
      DOM.formTurma.reset();
      getInput('status').value = 'ativa';
    }
    DOM.modal.classList.add('active');
  }

  // Fecha modal
  function closeModal() {
    DOM.modal.classList.remove('active');
    editingId = null;
    DOM.formTurma.reset();
  }

  // Deleta turma com confirmação
  async function deleteTurma(id) {
    const turma = turmas.find(t => t.id === id);
    if (!window.confirm(`Confirma a exclusão da turma '${turma?.nome || id}'?`)) return;
    try {
      const { error } = await sb.from('turmas').delete().eq('id', id);
      if (error) throw error;
      createToast('Turma deletada com sucesso!');
      loadTurmas();
    } catch (error) {
      createToast('Erro ao deletar: ' + error.message, 'error');
    }
  }

  // Manipula submit do form
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    Object.keys(data).forEach(k => data[k] = (data[k] || '').trim());

    const required = ['nome', 'professor', 'nivel', 'horario', 'data_inicio'];
    for (let field of required) {
      if (!data[field]) {
        createToast(`Campo ${field.replace('_', ' ')} é obrigatório!`, 'error');
        return;
      }
    }

    try {
      if (editingId) {
        const { error } = await sb.from('turmas').update(data).eq('id', editingId);
        if (error) throw error;
        createToast('Turma atualizada!');
      } else {
        const { error } = await sb.from('turmas').insert([data]);
        if (error) throw error;
        createToast('Turma criada!');
      }
      closeModal();
      loadTurmas();
    } catch (error) {
      createToast('Erro ao salvar: ' + error.message, 'error');
    }
  }

  // Manipula cliques na tabela
  function handleTableClick(e) {
    if (e.target.matches('.btn-edit')) {
      openModal(parseInt(e.target.dataset.id));
    } else if (e.target.matches('.btn-delete')) {
      deleteTurma(parseInt(e.target.dataset.id));
    }
  }

  // Inicialização
  async function init() {
    sb = window.sb;
    if (!sb) {
      createToast('Supabase não carregado!', 'error');
      return;
    }

    // Listeners
    if (DOM.searchInput) DOM.searchInput.addEventListener('input', debounce(render, 300));
    if (DOM.filterNivel) DOM.filterNivel.addEventListener('change', render);
    if (DOM.filterStatus) DOM.filterStatus.addEventListener('change', render);
    if (DOM.btnCriar) DOM.btnCriar.addEventListener('click', () => openModal());
    if (DOM.btnCancelar) DOM.btnCancelar.addEventListener('click', closeModal);
    if (DOM.modal) DOM.modal.addEventListener('click', e => {
      if (e.target === DOM.modal) closeModal();
    });
    if (DOM.formTurma) DOM.formTurma.addEventListener('submit', handleSubmit);
    if (DOM.table) DOM.table.addEventListener('click', handleTableClick);

    await loadTurmas();
  }

  // Inicia quando DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
