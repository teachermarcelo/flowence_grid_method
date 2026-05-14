# 📐 Guia de Padrão — Flowence Grid Method™

## Estrutura Geral do Projeto

```
flowence-grid/
├── index.html           (Dashboard)
├── alunos.html         (Lista de Alunos) ✅ PRONTO
├── turmas.html         (Lista de Turmas) ⚙️ EM PROGRESSO
├── niveis.html         (Página de Níveis CEFR)
├── temas.html          (Página de Temas Mensais)
├── atribuicoes.html    (Página de Atribuições)
├── aulas.html          (Página de Aulas)
├── materiais.html      (Página de Materiais)
├── missoes.html        (Página de Missões)
├── metodo.html         (O Método - Info)
│
├── styles.css          (CSS Global - Variáveis + Layout)
├── [page]-styles.css   (CSS específico de cada página)
│
├── supabase-config.js  (Config Supabase)
├── dashboard.js        (Lógica Dashboard)
├── alunos.js          (Lógica Alunos)
├── turmas.js          (Lógica Turmas)
├── [page].js          (Lógica de cada página)
│
├── method-data.js     (Dados do Método - JSON)
├── method-render.js   (Renderização Método + Níveis)
```

---

## 1️⃣ ESTRUTURA HTML PADRÃO

Toda página segue este template:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nome da Página — Flowence Grid Method™</title>
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- CSS Global -->
  <link rel="stylesheet" href="styles.css">
  <!-- CSS Específico (se houver) -->
  <link rel="stylesheet" href="turmas-styles.css">
</head>
<body>
<div class="app">

  <!-- SIDEBAR + BACKDROP (Mobile) -->
  <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
  <aside class="sidebar" id="sidebar">
    <!-- Logo -->
    <div>
      <div class="logo">
        <div class="logo-title"><span>Flowence</span> <span>Grid</span></div>
        <div class="logo-subtitle">METHOD™ MANAGEMENT</div>
      </div>
      <!-- Nav Menu -->
      <nav>
        <div class="menu-section">
          <div class="menu-label">PRINCIPAL</div>
          <div class="menu-item" data-href="index.html"><span class="menu-icon">▦</span>Dashboard</div>
          <div class="menu-item" data-href="alunos.html"><span class="menu-icon">✉</span>Alunos</div>
          <div class="menu-item active" data-href="turmas.html"><span class="menu-icon">▣</span>Turmas</div>
        </div>
        <div class="menu-section">
          <div class="menu-label">PLANEJAMENTO</div>
          <div class="menu-item" data-href="niveis.html"><span class="menu-icon">⌁</span>Níveis CEFR</div>
          <div class="menu-item" data-href="temas.html"><span class="menu-icon">◎</span>Temas Mensais</div>
          <div class="menu-item" data-href="atribuicoes.html"><span class="menu-icon">▤</span>Atribuições</div>
          <div class="menu-item" data-href="aulas.html"><span class="menu-icon">◫</span>Aulas</div>
        </div>
        <div class="menu-section">
          <div class="menu-label">RECURSOS</div>
          <div class="menu-item" data-href="materiais.html"><span class="menu-icon">↗</span>Materiais</div>
          <div class="menu-item" data-href="missoes.html"><span class="menu-icon">🏆</span>Missões</div>
          <div class="menu-item" data-href="metodo.html"><span class="menu-icon">♡</span>O Método</div>
        </div>
      </nav>
    </div>
    <!-- Footer Sidebar -->
    <div class="sidebar-footer">
      <div class="avatar">N</div>
      <div class="footer-text">
        <strong>Grid Method™ v1.0</strong>
        <small>Conectado ao Supabase</small>
      </div>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="main">
    <!-- TOPBAR -->
    <header class="topbar">
      <button class="hamburger" id="hamburger" aria-label="Abrir menu">☰</button>
      <div class="page-title"><span>▣</span> Turmas</div>
      <div class="top-actions">
        <a class="action-link" href="alunos.html">✥ Aluno</a>
        <a class="action-link" href="aulas.html">♧ Aula</a>
      </div>
    </header>

    <!-- CONTENT SECTION -->
    <section class="content">

      <!-- TOOLBAR: Search + Filtros -->
      <div class="toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="search-input" placeholder="Buscar por nome...">
        </div>
        <div class="filter-group">
          <select id="filter-level">
            <option value="">Todos os Níveis</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
          <select id="filter-status">
            <option value="">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <!-- QUICK STATS (3 cards) -->
      <div class="quick-stats">
        <div class="qstat">
          <div class="qstat-value" id="qs-total-value">0</div>
          <div class="qstat-label">Total</div>
        </div>
        <div class="qstat">
          <div class="qstat-value" id="qs-active-value">0</div>
          <div class="qstat-label">Ativas</div>
        </div>
        <div class="qstat">
          <div class="qstat-value" id="qs-shown-value">0</div>
          <div class="qstat-label">Mostradas</div>
        </div>
      </div>

      <!-- TABELA PRINCIPAL -->
      <div class="table-wrapper">
        <div class="table-head">
          <div>COLUNA 1</div>
          <div>COLUNA 2</div>
          <div>COLUNA 3</div>
          <div>STATUS</div>
          <div>AÇÕES</div>
        </div>
        <div id="data-container">
          <!-- Renderizado por JS -->
        </div>
      </div>

    </section>

    <!-- FOOTER -->
    <footer class="footer">Flowence Grid Method™ — Sistema de Gestão Educacional</footer>
  </main>

</div>

<!-- MODAL (Criar/Editar) -->
<div class="modal-overlay" id="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Nova Entidade</h2>
      <button class="modal-close" id="modal-close">&times;</button>
    </div>
    <form id="form-main" class="modal-body">
      <!-- Campos do Formulário -->
      <div class="form-group">
        <label for="f-nome">Nome *</label>
        <input type="text" id="f-nome" required>
      </div>
      <div class="form-group">
        <label for="f-status">Status</label>
        <select id="f-status">
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      <div class="modal-footer">
        <button type="button" id="btn-cancel" class="btn btn-ghost">Cancelar</button>
        <button type="button" id="btn-save" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</div>

<!-- SCRIPTS -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="turmas.js"></script>
<script>
  // Setup de navegação + hamburger (presente em TODAS as páginas)
  (function() {
    document.querySelectorAll('.menu-item[data-href]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => { window.location.href = el.dataset.href; });
    });
    const h = document.getElementById('hamburger');
    const s = document.getElementById('sidebar');
    const b = document.getElementById('sidebar-backdrop');
    if (h && s && b) {
      const t = () => { s.classList.toggle('open'); b.classList.toggle('show'); };
      h.addEventListener('click', t);
      b.addEventListener('click', t);
    }
  })();
</script>
</body>
</html>
```

---

## 2️⃣ ESTRUTURA CSS PADRÃO

### styles.css (Global)
Define variáveis, layout base, sidebar, topbar, botões, badges, pills:

```css
:root {
  --bg:           #f8fafc;
  --surface:      #ffffff;
  --surface-2:    #f1f5f9;
  --border:       #e2e8f0;
  --text:         #0f172a;
  --text-2:       #475569;
  --text-3:       #64748b;
  --indigo:       #4f46e5;
  --radius-sm:    6px;
  --radius:       10px;
  --radius-lg:    14px;
  --t-fast:       150ms cubic-bezier(.4,0,.2,1);
  --t-med:        250ms cubic-bezier(.4,0,.2,1);
}

.app { display: flex; min-height: 100vh; }
.main { flex: 1; display: flex; flex-direction: column; }
.content { padding: 20px; flex: 1; overflow-y: auto; }

/* BOTÕES */
.btn {
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-fast);
}
.btn-primary { background: var(--indigo); color: white; }
.btn-ghost { background: transparent; }

/* BADGES */
.badge { padding: 3px 8px; border-radius: 5px; font-size: 10px; font-weight: 700; }
.badge.a1 { background: #ccfbf1; color: #0f766e; }
.badge.b1 { background: #ede9fe; color: #7c3aed; }

/* PILLS */
.pill { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.pill-green { background: #dcfce7; color: #166534; }
.pill-gray { background: var(--surface-2); color: var(--text-3); }
```

### [page]-styles.css (Específico)
Define tabela, modal, form, responsive:

```css
/* TOOLBAR */
.toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.search-box input { padding: 9px 14px; border: 1px solid var(--border); }

/* QUICK STATS */
.quick-stats { display: flex; gap: 12px; margin-bottom: 16px; }
.qstat { padding: 12px 18px; min-width: 110px; }
.qstat-value { font-size: 24px; font-weight: 800; }

/* TABELA */
.table-wrapper { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.table-head { display: grid; grid-template-columns: 2fr 1.5fr 1fr 0.8fr 1fr; padding: 12px 16px; background: var(--surface-2); }
.table-row { display: grid; grid-template-columns: 2fr 1.5fr 1fr 0.8fr 1fr; padding: 12px 16px; border-bottom: 1px solid var(--border); }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: none; }
.modal-overlay.show { display: flex; }
.modal { background: var(--surface); border-radius: var(--radius-lg); max-width: 600px; }

/* FORM */
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.form-group input, .form-group select { padding: 9px 11px; border: 1px solid var(--border); }

@media (max-width: 720px) {
  .table-head { display: none; }
  .table-row { grid-template-columns: 1fr; }
  .modal { height: 100vh; border-radius: 0; }
}
```

---

## 3️⃣ ESTRUTURA JAVASCRIPT PADRÃO

```javascript
(function() {
  'use strict';

  // ===== CONFIG =====
  const { createClient } = supabase;
  const supabaseClient = createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anon_key);

  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  // ===== ESTADO =====
  let dados = [];
  let relacionados = [];

  // ===== FUNÇÕES AUXILIARES =====
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

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // ===== LÓGICA =====
  async function loadAll() {
    try {
      showToast('Carregando...', 'info');
      const { data, error } = await supabaseClient.from('tabela').select('*');
      if (error) throw error;
      dados = data || [];
      renderQuickStats();
      renderTable();
    } catch (error) {
      showToast(`Erro: ${error.message}`, 'error');
    }
  }

  function getFiltered() {
    const search = ($('#search-input')?.value || '').toLowerCase().trim();
    const filter = ($('#filter-level')?.value || '');
    return dados.filter(item => {
      const matchSearch = !search || (item.nome || '').toLowerCase().includes(search);
      const matchFilter = !filter || item.nivel === filter;
      return matchSearch && matchFilter;
    });
  }

  function renderQuickStats() {
    const filtered = getFiltered();
    $('#qs-total-value').textContent = dados.length;
    $('#qs-active-value').textContent = dados.filter(d => d.status === 'ativo').length;
    $('#qs-shown-value').textContent = filtered.length;
  }

  function renderTable() {
    const container = $('#data-container');
    const filtered = getFiltered();

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty">Nenhum dado encontrado</div>';
      return;
    }

    let html = '';
    filtered.forEach(item => {
      html += `
        <div class="table-row">
          <div>${esc(item.nome)}</div>
          <div>${item.nivel}</div>
          <div>${item.status}</div>
          <div class="table-actions">
            <button class="btn-icon btn-edit" data-id="${item.id}">✏️</button>
            <button class="btn-icon btn-del" data-id="${item.id}">🗑️</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function openModal(id = null, readonly = false) {
    const modal = $('#modal-overlay');
    const title = $('.modal-title');
    const btnSave = $('#btn-save');

    if (id) {
      const item = dados.find(d => d.id === id);
      $('#f-nome').value = item?.nome || '';
      title.textContent = 'Editar';
      btnSave.style.display = '';
    } else {
      $('#f-nome').value = '';
      title.textContent = 'Nova';
      btnSave.style.display = '';
    }

    modal.classList.add('show');
  }

  function closeModal() {
    $('#modal-overlay').classList.remove('show');
  }

  async function saveTurma(e) {
    e?.preventDefault();
    const nome = $('#f-nome').value.trim();
    if (!nome) {
      showToast('Nome obrigatório', 'error');
      return;
    }

    try {
      const id = $('#f-id').value;
      if (id) {
        await supabaseClient.from('tabela').update({ nome }).eq('id', id);
        showToast('Atualizado!', 'success');
      } else {
        await supabaseClient.from('tabela').insert([{ nome }]);
        showToast('Criado!', 'success');
      }
      closeModal();
      loadAll();
    } catch (error) {
      showToast(`Erro: ${error.message}`, 'error');
    }
  }

  async function deleteItem(id) {
    if (!confirm('Deletar?')) return;
    try {
      await supabaseClient.from('tabela').delete().eq('id', id);
      showToast('Deletado!', 'success');
      loadAll();
    } catch (error) {
      showToast(`Erro: ${error.message}`, 'error');
    }
  }

  // ===== EVENTOS =====
  function setupEvents() {
    $('#btn-new').addEventListener('click', () => openModal());
    $('#btn-save').addEventListener('click', saveTurma);
    $('#btn-cancel').addEventListener('click', closeModal);
    $('#modal-close').addEventListener('click', closeModal);

    $('#search-input').addEventListener('input', debounce(() => {
      renderQuickStats();
      renderTable();
    }, 300));

    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-edit')) {
        openModal(e.target.closest('.btn-edit').dataset.id);
      }
      if (e.target.closest('.btn-del')) {
        deleteItem(e.target.closest('.btn-del').dataset.id);
      }
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    loadAll();
  });

})();
```

---

## 4️⃣ CHECKLIST POR PÁGINA

### ✅ Alunos
- [x] Topbar com título
- [x] Toolbar: busca + 3 filtros
- [x] Quick stats: 3 cards
- [x] Tabela: Avatar + Dados
- [x] Modal: Criar/Editar
- [x] Responsivo

### ⚙️ Turmas (EM PROGRESSO)
- [x] Topbar
- [x] Toolbar
- [x] Quick stats
- [x] Tabela
- [ ] Modal completo
- [ ] Responsivo testar

### 📋 Próximas:
- [ ] Níveis CEFR
- [ ] Temas Mensais
- [ ] Atribuições
- [ ] Aulas
- [ ] Materiais
- [ ] Missões

---

## 5️⃣ PADRÃO DE NOMENCLATURA

### IDs HTML
```
Botões:           #btn-new, #btn-save, #btn-cancel, #btn-edit, #btn-del
Inputs:           #search-input, #filter-level, #filter-status
Formulário:       #f-nome, #f-email, #f-status (prefixo f-)
Containers:       #data-container, #modal-overlay, #sidebar, #hamburger
Stats:            #qs-total-value, #qs-active-value, #qs-shown-value
```

### Classes CSS
```
Tabela:           .table-wrapper, .table-head, .table-row, .table-actions
Formulário:       .form-group, .form-row, .modal-body, .modal-footer
Status:           .pill-green, .pill-gray
Badges:           .badge.a1, .badge.b1, .badge.c1
Ações:            .btn-icon, .btn-view, .btn-edit, .btn-del
```

### Funções JS
```
loadAll()           - Carrega dados do Supabase
getFiltered()       - Filtra dados
renderTable()       - Renderiza tabela
renderQuickStats()  - Atualiza stats
openModal(id)       - Abre modal
closeModal()        - Fecha modal
saveData()          - Salva no DB
deleteData(id)      - Deleta do DB
```

---

## 6️⃣ TABELA PADRÃO

```
Coluna 1:  Entidade (Avatar + Nome) — 2.2fr
Coluna 2:  Propriedade 1 — 1.5fr
Coluna 3:  Nível / Tipo — 0.8fr
Coluna 4:  Status — 0.8fr
Coluna 5:  Ações (Ver, Editar, Deletar) — 1fr
```

---

## 7️⃣ FLUXO DE DADOS

```
Página carrega → loadAll() 
  ↓ Supabase
  ↓ dados = [...] 
  ↓ renderTable() 
  ↓ renderQuickStats()

Usuário filtra → debounce(300ms)
  ↓ getFiltered()
  ↓ renderTable()
  ↓ renderQuickStats()

Usuário clica "+ Novo" → openModal()
  ↓ Limpa formulário
  ↓ Exibe modal

Usuário salva → saveTurma()
  ↓ Valida
  ↓ POST/UPDATE Supabase
  ↓ Toast (sucesso/erro)
  ↓ closeModal()
  ↓ loadAll() (atualiza lista)
```

---

## 8️⃣ RESPONSIVO PADRÃO

```css
Desktop (1024px+)
- Sidebar visível
- Tabela com 5+ colunas
- Toolbar em linha

Tablet (720px-1024px)
- Sidebar off-canvas (hamburger)
- Tabela com 2-3 colunas
- Toolbar empilhada

Mobile (<720px)
- Sidebar hidden
- Tabela → Cards
- Toolbar flexível
- Modal fullscreen
```

---

## ✨ PRÓXIMOS PASSOS

1. **Aplicar padrão em Turmas**
   - Remover placeholder
   - Integrar tabela + modal
   - Testar responsivo

2. **Clonar padrão para outras páginas**
   - Copiar HTML base
   - Adaptar nomes (Níveis, Temas, etc.)
   - Criar JS + CSS específicos

3. **Validar em todos os breakpoints**
   - Desktop 1920px
   - Tablet 768px
   - Mobile 375px

4. **Testar funcionalidade**
   - CRUD (Create, Read, Update, Delete)
   - Filtros
   - Toast notifications
   - Modal open/close
