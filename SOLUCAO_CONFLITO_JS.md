# 🔴 Problema Identificado: Conflito de JavaScript

## O Problema

Você tem **2 arquivos JavaScript** rodando na página de Turmas:

1. **dashboard.js** — Carrega dados do Supabase
2. **turmas.js** — Tenta carregar dados novamente

**Resultado:**
- ❌ Dados carregam duplicados (aparecem 2x)
- ❌ Às vezes desaparecem
- ❌ Há conflito de estado

---

## 🔍 Por que isto acontece?

### No seu `turmas.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="turmas.js"></script>  ← Este tenta criar window.sb
```

### No seu `index.html` (dashboard):

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="dashboard.js"></script>  ← Este também cria window.sb
```

**Quando você navega de Dashboard para Turmas:**
1. `dashboard.js` carrega e cria `window.sb` ✅
2. Você clica em "Turmas"
3. `turmas.html` carrega
4. `turmas.js` tenta criar `window.sb` NOVAMENTE 
5. Conflito! ⚠️

---

## ✅ Solução: Remover `turmas.js` da tag `<script>`

No seu `turmas.html`, **REMOVA esta linha:**

```html
<!-- ❌ REMOVA ISTO -->
<script src="turmas.js"></script>
```

**Deixe apenas:**

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>

<!-- ❌ NÃO CARREGUE turmas.js aqui -->

<script>
  // Setup de navegação + hamburger
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
```

---

## 🤔 Por que funciona assim?

Quando você **navega de Dashboard para Turmas**:

1. Dashboard.js já carregou `window.sb` ✅
2. `turmas.html` carrega
3. `turmas.js` procura por `window.sb` (existe!)
4. **Reutiliza o Supabase já carregado** ✅
5. **Sem conflito!** ✅

---

## 📝 Arquivo `turmas.html` Corrigido

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Turmas — Flowence Grid Method™</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="turmas-styles.css">
</head>
<body>
<div class="app">

  <div class="sidebar-backdrop" id="sidebar-backdrop"></div>

  <aside class="sidebar" id="sidebar">
    <div>
      <div class="logo">
        <div class="logo-title"><span>Flowence</span> <span>Grid</span></div>
        <div class="logo-subtitle">METHOD™ MANAGEMENT</div>
      </div>
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
    <div class="sidebar-footer">
      <div class="avatar">N</div>
      <div class="footer-text">
        <strong>Grid Method™ v1.0</strong>
        <small>Conectado ao Supabase</small>
      </div>
    </div>
  </aside>

  <main class="main">
    <header class="topbar">
      <button class="hamburger" id="hamburger" aria-label="Abrir menu">☰</button>
      <div class="page-title"><span>▣</span> Turmas</div>
      <div class="top-actions">
        <button id="btn-new" class="btn btn-primary">+ Nova Turma</button>
      </div>
    </header>

    <section class="content">

      <!-- TOOLBAR: Search + Filtros -->
      <div class="toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="search-input" placeholder="Buscar turma ou professor...">
        </div>
        <div class="filter-group">
          <select id="filter-level">
            <option value="">Todos os níveis</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
          <select id="filter-status">
            <option value="">Todos os status</option>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
          </select>
        </div>
      </div>

      <!-- QUICK STATS -->
      <div class="quick-stats">
        <div class="qstat">
          <div class="qstat-value" id="qs-total">0</div>
          <div class="qstat-label">Total Turmas</div>
        </div>
        <div class="qstat">
          <div class="qstat-value" id="qs-active">0</div>
          <div class="qstat-label">Turmas Ativas</div>
        </div>
        <div class="qstat">
          <div class="qstat-value" id="qs-shown">0</div>
          <div class="qstat-label">Mostradas</div>
        </div>
      </div>

      <!-- TABELA DE TURMAS -->
      <div class="table-wrapper">
        <div class="table-head">
          <div>TURMA</div>
          <div>PROFESSOR</div>
          <div>NÍVEL</div>
          <div>HORÁRIO</div>
          <div>DATA INÍCIO</div>
          <div>STATUS</div>
          <div>ALUNOS</div>
          <div>AÇÕES</div>
        </div>
        <div id="data-container">
          <!-- Renderizado por JS -->
        </div>
      </div>

    </section>

    <footer class="footer">Flowence Grid Method™ — Sistema de Gestão Educacional</footer>
  </main>

</div>

<!-- MODAL: Criar/Editar Turma -->
<div class="modal-overlay" id="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Nova Turma</h2>
      <button class="modal-close" id="modal-close">&times;</button>
    </div>
    <form id="form-main" class="modal-body">
      <input type="hidden" id="f-id">

      <div class="form-group">
        <label for="f-nome">Nome da Turma *</label>
        <input type="text" id="f-nome" required>
      </div>

      <div class="form-group">
        <label for="f-professor">Professor(a) *</label>
        <input type="text" id="f-professor" required>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="f-nivel">Nível *</label>
          <select id="f-nivel" required>
            <option value="">Selecione o nível</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>
        <div class="form-group">
          <label for="f-horario">Horário</label>
          <input type="text" id="f-horario" placeholder="Ex: Seg/Qua 14:00-15:30">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="f-data_inicio">Data Início</label>
          <input type="date" id="f-data_inicio">
        </div>
        <div class="form-group">
          <label for="f-status">Status *</label>
          <select id="f-status" required>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="f-observacoes">Observações</label>
        <textarea id="f-observacoes" rows="3" placeholder="Observações sobre a turma..."></textarea>
      </div>

      <div class="modal-footer">
        <button type="button" id="btn-cancel" class="btn btn-ghost">Cancelar</button>
        <button type="button" id="btn-save" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<!-- ❌ NÃO CARREGUE turmas.js aqui! -->

<script>
  // Setup de navegação + hamburger
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

<!-- ✅ CARREGUE turmas.js AQUI -->
<script src="turmas.js"></script>

</body>
</html>
```

---

## 🔑 Mudança Principal

```html
<!-- ❌ ANTES: turmas.js carregava muito cedo -->
<script src="turmas.js"></script>
<script>
  // Setup de nav
</script>

<!-- ✅ DEPOIS: turmas.js carrega por último -->
<script>
  // Setup de nav
</script>
<script src="turmas.js"></script>  ← Carrega por último
```

**Assim `turmas.js` encontra `window.sb` já carregado!** ✅

---

## 🚀 Passo a Passo

1. **Copie o HTML acima**
2. **Substitua seu `turmas.html`**
3. **Recarregue a página** (F5)
4. **Deve funcionar sem duplicatas!** ✅

---

## ✅ Resultado Esperado

- ✅ Dados carregam 1x (sem duplicatas)
- ✅ Busca funciona
- ✅ Filtros funcionam
- ✅ Modal funciona
- ✅ CRUD funciona
- ✅ Navegação funciona

Tenta aí! 🚀
