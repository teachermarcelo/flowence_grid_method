# 🔴 Problema Identificado: Navegação não funciona

## O que está acontecendo?

Você clica em "Turmas" mas a página **não carrega o turmas.js**, então:
- ✅ HTML carrega (você vê a página)
- ✅ Sidebar carrega (menu funciona)
- ✅ Topbar carrega (aparência OK)
- ❌ **Turmas.js NÃO carrega** (dados não aparecem)

---

## 🔍 Por que acontece?

No seu `dashboard.js` tem:

```javascript
function setupNav() {
  $$('.menu-item').forEach(item => {
    const href = item.dataset.href || map[item.textContent.trim()];
    if (!href) return;
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => { 
      window.location.href = href;  // ← Clica aqui
    });
  });
}
```

**O problema:**
1. Você clica em "Turmas"
2. `window.location.href = 'turmas.html'` funciona ✅
3. **Mas `turmas.html` carrega `turmas.js`** ✅
4. **E `turmas.js` tenta rodar, mas precisa de Supabase** ❌

---

## ✅ Solução: Verificar Supabase em turmas.js

Seu `turmas.js` começa assim:

```javascript
'use strict';

(function() {
  // Verificação de Supabase
  if (!window.SUPABASE_CONFIG || !window.supabase) {
    console.error('[Turmas] supabase-config.js não carregado');
    document.body.innerHTML = '<div style="padding:20px; color:red;">Erro: Supabase não configurado</div>';
    return;  // ← PARA AQUI se Supabase não existe
  }
```

**Se Supabase não está configurado, turmas.js para de executar.**

---

## 🔧 Como Verificar

### Passo 1: Abra o Console
```
Clique em Turmas
F12 (DevTools)
Aba "Console"
Procure por mensagens vermelhas
```

### Passo 2: Verifique qual erro aparece

#### Se aparecer isto:
```
[Turmas] supabase-config.js não carregado
```

**Solução:** `supabase-config.js` não carregou. Verifique:
- [ ] Arquivo existe?
- [ ] Está no mesmo diretório?
- [ ] Nome está correto? (case-sensitive)

#### Se aparecer isto:
```
ReferenceError: window.supabase is undefined
```

**Solução:** Script do Supabase não carregou. Verifique no HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```
Está antes de `supabase-config.js`?

#### Se aparecer isto:
```
Erro ao carregar: Cannot read property 'url' of undefined
```

**Solução:** `window.SUPABASE_CONFIG` não existe. Verifique `supabase-config.js`:
```javascript
window.SUPABASE_CONFIG = {
  url: 'https://...',
  anonKey: '...'
};
```

---

## 🚀 Solução Rápida

### Opção A: Copiar Supabase Config do index.html

Se `supabase-config.js` funciona em index.html, deve funcionar em turmas.html também.

Verificar em `turmas.html`:

```html
<body>
<!-- ... conteúdo ... -->

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>  <!-- ✅ Está aqui? -->
<script src="turmas.js"></script>
```

### Opção B: Testar Manualmente

1. Abra `turmas.html`
2. Abra Console (F12)
3. Cole isto:

```javascript
console.log('window.SUPABASE_CONFIG:', window.SUPABASE_CONFIG);
console.log('window.supabase:', window.supabase);
console.log('window.sb:', window.sb);
```

**Resultado esperado:**
```
window.SUPABASE_CONFIG: {url: "...", anonKey: "..."}
window.supabase: {createClient: ƒ, ...}
window.sb: createClient {...}
```

Se algum for `undefined`, encontramos o problema!

---

## 📋 Checklist de Debug

- [ ] Clico em "Turmas" e vejo página vazia ou com erro?
- [ ] F12 → Console → Tem mensagens vermelhas?
- [ ] `supabase-config.js` está sendo carregado?
- [ ] `window.SUPABASE_CONFIG` existe?
- [ ] `window.supabase` existe?
- [ ] `turmas.js` começa a executar?
- [ ] Tabela `flowence_class` existe no Supabase?
- [ ] Tem dados na tabela?

---

## 🎯 Próximo Passo

1. **Clique em Turmas**
2. **Abra Console (F12)**
3. **Compartilhe o erro que aparece em vermelho**

Aí eu digo exatamente como consertar! 🚀

---

## 💡 Se Funcionar

Se conseguir ver a tabela com dados, significa que tudo está OK!

- ✅ Navegação funciona
- ✅ Supabase conecta
- ✅ Dados carregam
- ✅ Busca e filtros funcionam
- ✅ CRUD funciona

Pronto para usar! 🎉
