# 🔗 Adicionar Coluna Links no Supabase

Execute este comando **no SQL Editor do Supabase**:

```sql
ALTER TABLE flowence_class ADD COLUMN IF NOT EXISTS links TEXT;
```

**Pronto!** A coluna `links` será armazenada como JSON (string).

---

## ✅ Como funciona

- Quando você **cria** um link: `{label: "Nome", url: "https://...", type: "Material"}`
- Links são **salvos como JSON** na coluna `links`
- Quando você **carrega** uma turma: JSON é convertido de volta para array
- Você pode ter **múltiplos links** por turma

---

Depois de executar o SQL, os 3 arquivos (HTML + JS + CSS) estão prontos para usar! 🚀
