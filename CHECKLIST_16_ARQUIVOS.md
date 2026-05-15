# ✅ CHECKLIST - 16 ARQUIVOS PRONTOS

## 📦 ARQUIVOS CRIADOS (Pronto para Copiar)

```
✅ AULAS (3 arquivos)
   ├─ aulas.html ............................ PRONTO
   ├─ aulas.js ............................. PRONTO (Vincula Turmas)
   └─ aulas-styles.css ..................... PRONTO

✅ MATERIAIS (3 arquivos)
   ├─ materiais.html ....................... PRONTO
   ├─ materiais.js ......................... PRONTO
   └─ materiais-styles.css ................. PRONTO

✅ MISSÕES (3 arquivos)
   ├─ missoes.html ......................... PRONTO
   ├─ missoes.js ........................... PRONTO
   └─ missoes-styles.css ................... PRONTO

✅ ATRIBUIÇÕES LINKADAS (3 arquivos)
   ├─ atribuicoes.html ..................... PRONTO (COM DROPDOWNS)
   ├─ atribuicoes-linkadas.js .............. PRONTO (Vincula Aluno+Turma)
   └─ atribuicoes-styles.css ............... PRONTO

✅ ATUALIZAÇÕES (2 arquivos)
   ├─ dashboard.js ......................... ✅ ATUALIZADO
   └─ SQL_TODAS_AS_TABELAS.md .............. PRONTO
```

---

## 🔄 TAREFAS (Na Ordem Certa)

### 1️⃣ Executar SQL no Supabase (5 minutos)

**URL:** https://app.supabase.com → seu-projeto → SQL Editor

**Cole TODO este código:**

```sql
-- AULAS
DROP TABLE IF EXISTS flowence_lesson CASCADE;
CREATE TABLE public.flowence_lesson (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  theme TEXT,
  description TEXT,
  date TEXT,
  start_time TEXT,
  end_time TEXT,
  class_id TEXT,
  level TEXT,
  teacher TEXT,
  location TEXT,
  content TEXT,
  links TEXT,
  objectives TEXT,
  homework TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_flowence_lesson_class ON flowence_lesson(class_id);
CREATE INDEX idx_flowence_lesson_date ON flowence_lesson(date);
CREATE INDEX idx_flowence_lesson_level ON flowence_lesson(level);
ALTER TABLE public.flowence_lesson ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.flowence_lesson FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.flowence_lesson FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.flowence_lesson FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.flowence_lesson FOR DELETE USING (true);

-- MATERIAIS
DROP TABLE IF EXISTS flowence_material CASCADE;
CREATE TABLE public.flowence_material (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  type TEXT,
  description TEXT,
  level TEXT,
  category TEXT,
  url TEXT,
  file_url TEXT,
  duration TEXT,
  teacher TEXT,
  class_id TEXT,
  lesson_id TEXT,
  tags TEXT,
  links TEXT,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_flowence_material_type ON flowence_material(type);
CREATE INDEX idx_flowence_material_level ON flowence_material(level);
CREATE INDEX idx_flowence_material_class ON flowence_material(class_id);
CREATE INDEX idx_flowence_material_lesson ON flowence_material(lesson_id);
ALTER TABLE public.flowence_material ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.flowence_material FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.flowence_material FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.flowence_material FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.flowence_material FOR DELETE USING (true);

-- MISSÕES
DROP TABLE IF EXISTS flowence_mission CASCADE;
CREATE TABLE public.flowence_mission (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  description TEXT NOT NULL,
  level TEXT,
  status TEXT DEFAULT 'pending',
  due_date TEXT,
  completed_at TEXT,
  student_id TEXT,
  class_id TEXT,
  theme TEXT,
  teacher TEXT,
  reward INTEGER DEFAULT 0,
  difficulty TEXT,
  type TEXT,
  links TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_flowence_mission_student ON flowence_mission(student_id);
CREATE INDEX idx_flowence_mission_class ON flowence_mission(class_id);
CREATE INDEX idx_flowence_mission_status ON flowence_mission(status);
CREATE INDEX idx_flowence_mission_level ON flowence_mission(level);
ALTER TABLE public.flowence_mission ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.flowence_mission FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.flowence_mission FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.flowence_mission FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.flowence_mission FOR DELETE USING (true);

-- ATRIBUIÇÕES
DROP TABLE IF EXISTS flowence_assignment CASCADE;
CREATE TABLE public.flowence_assignment (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  theme TEXT NOT NULL,
  description TEXT,
  level TEXT,
  start_date TEXT,
  due_date TEXT,
  status TEXT DEFAULT 'pendente',
  teacher TEXT,
  class_id TEXT,
  student_id TEXT,
  attachment_url TEXT,
  evaluation_criteria TEXT,
  max_score INTEGER DEFAULT 100,
  obtained_score INTEGER,
  feedback TEXT,
  completion_date TEXT,
  links TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_flowence_assignment_theme ON flowence_assignment(theme);
CREATE INDEX idx_flowence_assignment_status ON flowence_assignment(status);
CREATE INDEX idx_flowence_assignment_student ON flowence_assignment(student_id);
CREATE INDEX idx_flowence_assignment_class ON flowence_assignment(class_id);
CREATE INDEX idx_flowence_assignment_level ON flowence_assignment(level);
ALTER TABLE public.flowence_assignment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.flowence_assignment FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.flowence_assignment FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.flowence_assignment FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.flowence_assignment FOR DELETE USING (true);
```

**Clique RUN (Ctrl+Enter)** ✅

**Aguarde 1-2 minutos**

---

### 2️⃣ Copiar 16 Arquivos para GitHub (3 minutos)

**Baixe todos estes arquivos dos outputs:**

```
aulas.html
aulas.js
aulas-styles.css

materiais.html
materiais.js
materiais-styles.css

missoes.html
missoes.js
missoes-styles.css

atribuicoes.html
atribuicoes-linkadas.js
atribuicoes-styles.css
```

**⚠️ IMPORTANTE: Atribuições**
- Delete `atribuicoes.js` (antigo)
- Baixe `atribuicoes-linkadas.js`
- Renomeie para `atribuicoes.js`

Ou copie direto sem renomear (o arquivo já aponta para o correto no HTML)

---

### 3️⃣ Fazer Git Push (2 minutos)

```bash
# No seu repositório local:

git add .
git commit -m "Add Aulas, Materiais, Missões e Atribuições Linkadas (16 arquivos)"
git push origin main

# Aguarde 2-5 minutos para o GitHub Pages atualizar
```

---

### 4️⃣ Testar Tudo (5 minutos)

Acesse: `https://seu-usuario.github.io/seu-repositorio/`

1. **Dashboard** → Verifique se carrega
2. **Aulas** → Clique "+ Nova Aula"
   - Preencha: Título, Turma (deve aparecer dropdown!)
   - Salve
   - Deve aparecer na tabela
3. **Materiais** → Clique "+ Novo Material"
   - Preencha: Título, Tipo
   - Salve
4. **Missões** → Clique "+ Nova Missão"
   - Preencha: Descrição, Aluno (deve aparecer dropdown!)
   - Salve
5. **Atribuições** → Clique "+ Nova Atribuição"
   - Preencha: Tema, Aluno (dropdown!), Turma (dropdown!)
   - Salve
   - **CRITICAL:** Verifique se aluno e turma aparecem na coluna de nome

---

## 🎯 SINAIS DE SUCESSO

✅ **SQL Executado com Sucesso:**
- Você vê 4 tabelas novas em **Supabase → Tables**

✅ **Arquivos no GitHub:**
- Você faz commit de 16 arquivos

✅ **GitHub Pages Funciona:**
- Página carrega em `https://seu-usuario.github.io/seu-repo/`

✅ **Aulas Funcionam:**
- Dropdown de Turmas aparece no modal
- Dados salvam no Supabase

✅ **Materiais Funcionam:**
- Tabela mostra materiais criados

✅ **Missões Funcionam:**
- Dropdown de Alunos aparece no modal
- Dados salvam

✅ **Atribuições LINKADAS:**
- Dropdown de Alunos aparece
- Dropdown de Turmas aparece
- Dados salvam
- Tabela mostra nome do aluno e turma (não IDs)

---

## ❌ PROBLEMAS COMUNS

### "Erro: table doesn't exist"
**Causa:** SQL não foi executado
**Solução:** Execute o SQL no Supabase

### "Dropdown vazio"
**Causa:** Tabelas `flowence_student` ou `flowence_class` vazias
**Solução:** Crie alguns alunos e turmas primeiro

### "Atribuição não salva"
**Causa:** Arquivo errado (`atribuicoes.js` antigo)
**Solução:** Use `atribuicoes-linkadas.js`

### "Links não funcionam"
**Causa:** URL inválida (falta `http://`)
**Solução:** Certifique-se que URL começa com `http://` ou `https://`

---

## 📊 RESUMO DO QUE FOI CRIADO

| Página | Status | Vinculações | Features |
|--------|--------|-------------|----------|
| Aulas | ✅ PRONTO | → Turmas | 5 seções, links, filtros |
| Materiais | ✅ PRONTO | (Standalone) | Tipos, URLs, dificuldade |
| Missões | ✅ PRONTO | → Alunos | Status, recompensa, filtros |
| Atribuições | ✅ LINKADA | → Alunos + Turmas | 6 seções, notas, feedback |

---

## 🚀 PRÓXIMO?

Depois que tudo estiver funcionando:

1. Criar dados de exemplo (alunos, turmas, aulas, etc)
2. Testar relatórios
3. Adicionar mais campos conforme necessário
4. Implementar notificações por email

---

**TUDO PRONTO PARA USAR!** 🎉

Qualquer dúvida, me avisa! 🚀
