'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import { Class, Student, Assignment, Lesson } from './types'

// ============ CLASSES/TURMAS ============

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setClasses(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar turmas')
    } finally {
      setLoading(false)
    }
  }

  return { classes, loading, error, refetch: fetchClasses }
}

export function useCreateClass() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (data: Omit<Class, 'id' | 'created_at'>) => {
    try {
      setLoading(true)
      setError(null)
      const { data: newClass, error: err } = await supabase
        .from('classes')
        .insert([data])
        .select()
        .single()

      if (err) throw err
      return newClass as Class
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar turma'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading, error }
}

export function useUpdateClass() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(async (id: string, data: Partial<Class>) => {
    try {
      setLoading(true)
      setError(null)
      const { data: updated, error: err } = await supabase
        .from('classes')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      return updated as Class
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar turma'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { update, loading, error }
}

export function useDeleteClass() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const { error: err } = await supabase
        .from('classes')
        .delete()
        .eq('id', id)

      if (err) throw err
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar turma'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { delete: delete_, loading, error }
}

// ============ STUDENTS/ALUNOS ============

export function useStudents(classId?: string) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [classId])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      let query = supabase.from('students').select('*')

      if (classId) {
        query = query.eq('class_id', classId)
      }

      const { data, error: err } = await query.order('name', { ascending: true })

      if (err) throw err
      setStudents(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }

  return { students, loading, error, refetch: fetchStudents }
}

// ============ ASSIGNMENTS/ATRIBUIÇÕES ============

export function useAssignments(classId?: string) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssignments()
  }, [classId])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      let query = supabase.from('assignments').select('*')

      if (classId) {
        query = query.eq('class_id', classId)
      }

      const { data, error: err } = await query.order('created_at', { ascending: false })

      if (err) throw err
      setAssignments(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atribuições')
    } finally {
      setLoading(false)
    }
  }

  return { assignments, loading, error, refetch: fetchAssignments }
}

// ============ LESSONS/AULAS ============

export function useLessons(classId?: string) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLessons()
  }, [classId])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      let query = supabase.from('lessons').select('*')

      if (classId) {
        query = query.eq('class_id', classId)
      }

      const { data, error: err } = await query.order('created_at', { ascending: false })

      if (err) throw err
      setLessons(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar aulas')
    } finally {
      setLoading(false)
    }
  }

  return { lessons, loading, error, refetch: fetchLessons }
}

// Re-exports para compatibilidade
export type { Class, Student, Assignment, Lesson }
