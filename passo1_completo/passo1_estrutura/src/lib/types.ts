// Tipos para Turmas/Classes
export interface Class {
  id: string
  name: string
  description?: string
  level?: string
  created_at: string
  updated_at?: string
}

// Tipos para Alunos/Estudantes
export interface Student {
  id: string
  name: string
  email: string
  class_id?: string
  created_at: string
  updated_at?: string
}

// Tipos para Atribuições/Tarefas
export interface Assignment {
  id: string
  title: string
  description?: string
  class_id: string
  due_date?: string
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at?: string
}

// Tipos para Aulas
export interface Lesson {
  id: string
  title: string
  content?: string
  class_id: string
  created_at: string
  updated_at?: string
}

// Resposta genérica da API
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
