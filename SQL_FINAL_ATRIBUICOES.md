# 🔧 EXECUTAR AGORA NO SUPABASE

Cole **EXATAMENTE ISTO** no SQL Editor e clique RUN:

```sql
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

---

## ✅ Depois:

1. Recarregue a página (F5)
2. Clique "+ Nova Atribuição"
3. Preencha e salve
4. **Pronto!** ✅

Se der erro, me manda a mensagem de erro exata! 🚀
