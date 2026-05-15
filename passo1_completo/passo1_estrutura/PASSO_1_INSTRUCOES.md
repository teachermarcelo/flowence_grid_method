# ✅ PASSO 1: Estrutura Base Next.js

## 📋 O que foi criado?

7 arquivos de configuração + 2 arquivos de biblioteca base:

```
├── package.json                    (Dependências)
├── tsconfig.json                   (TypeScript)
├── next.config.js                  (Next.js)
├── tailwind.config.js              (Tailwind)
├── postcss.config.js               (PostCSS)
├── .env.example                    (Variáveis de ambiente)
├── src/lib/
│   ├── types.ts                    (Tipos TypeScript)
│   ├── hooks.ts                    (Hooks customizados)
│   └── supabase.ts                 (Cliente Supabase)
└── src/components/ui/
    ├── card.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── input.tsx
    ├── label.tsx
    ├── textarea.tsx
    ├── avatar.tsx
    ├── dialog.tsx
    └── table.tsx
```

## 🚀 Como Implementar

### Passo 1.1: Copiar arquivos de configuração

Pegue estes 6 arquivos dos `/outputs/` e coloque na **raiz do projeto**:

```bash
# Na sua máquina, dentro da pasta flowence_grid_method-main/

cp package.json .
cp tsconfig.json .
cp next.config.js .
cp tailwind.config.js .
cp postcss.config.js .
cp .env.example .
```

Ou **manualmente:**
- Abra cada arquivo no `/outputs/`
- Copie o conteúdo
- Crie o arquivo na raiz do projeto

### Passo 1.2: Criar pastas de biblioteca

```bash
mkdir -p src/lib
mkdir -p src/components/ui
```

### Passo 1.3: Criar arquivos em `src/lib/`

Pegue estes 3 arquivos de `/outputs/` e coloque em `src/lib/`:

```
src/lib/
├── types.ts      ← Copie do outputs
├── hooks.ts      ← Copie do outputs
└── supabase.ts   ← Copie do outputs
```

### Passo 1.4: Criar componentes UI em `src/components/ui/`

O arquivo `/outputs/ui-components.tsx` tem 8 componentes.  
O arquivo `/outputs/ui-components-extended.tsx` tem 2 componentes.

**Separe cada um em seu próprio arquivo:**

```
src/components/ui/
├── card.tsx          ← Do ui-components.tsx (linhas 1-52)
├── badge.tsx         ← Do ui-components.tsx (linhas 54-70)
├── button.tsx        ← Do ui-components.tsx (linhas 72-110)
├── input.tsx         ← Do ui-components.tsx (linhas 112-130)
├── label.tsx         ← Do ui-components.tsx (linhas 132-150)
├── textarea.tsx      ← Do ui-components.tsx (linhas 152-170)
├── avatar.tsx        ← Do ui-components.tsx (linhas 172-206)
├── dialog.tsx        ← Do ui-components-extended.tsx (linhas 1-78)
└── table.tsx         ← Do ui-components-extended.tsx (linhas 80-160)
```

**Se achar complicado separar**, posso fazer isso pra você no próximo passo.

### Passo 1.5: Configurar `.env.local`

Crie um arquivo `.env.local` **na raiz** com suas credenciais Supabase:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://sua-instancia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-secreta
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Passo 1.6: Instalar dependências

```bash
npm install
```

Isso vai instalar:
- React 18
- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- Lucide icons
- Sonner (toasts)

### Passo 1.7: Rodar o projeto

```bash
npm run dev
```

Abra: http://localhost:3000

Você verá:
- Página de turmas com o layout existente
- Componentes UI funcionando
- Erros sobre componentes faltantes (normal, vamos criar no passo 2)

---

## ✅ Verificação

Se conseguiu rodar `npm run dev` sem erros graves, você completou o **PASSO 1**! 🎉

**Checklist de sucesso:**
- [ ] `package.json` na raiz
- [ ] `tsconfig.json` na raiz
- [ ] `next.config.js` na raiz
- [ ] `tailwind.config.js` na raiz
- [ ] `postcss.config.js` na raiz
- [ ] `.env.local` com credenciais Supabase
- [ ] `src/lib/types.ts` criado
- [ ] `src/lib/hooks.ts` criado
- [ ] `src/lib/supabase.ts` criado
- [ ] `src/components/ui/` com 9 componentes
- [ ] `npm install` executado sem erros
- [ ] `npm run dev` funcionando

---

## 🎯 O que vem no Passo 2?

Depois que você confirmar que o projeto roda:

**PASSO 2:** Criar a página inicial (`src/app/page.tsx`) com dashboard básico

Isso vai te dar uma visão geral do sistema antes de migrar as páginas antigas.

---

## ⚠️ Se não rodar

**Erro comum:** Módulos não encontrados (por exemplo, `@/components/ui/card`)

**Solução:**
1. Certifique-se que `tsconfig.json` tem o `paths`
2. Verifique que os componentes estão na pasta correta
3. Rode `npm install` novamente
4. Delete a pasta `.next` e tente `npm run dev` de novo

---

## 💬 Quando terminar este passo:

Responda com:
- ✅ "Consegui rodar!" (se tudo deu certo)
- ❌ "Deu erro em..." (qual erro apareceu)
- ❓ "Tenho dúvida em..." (qual parte não entendeu)

Aí avanço pro **PASSO 2** 👊
