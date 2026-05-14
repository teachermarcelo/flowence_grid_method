'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, Plus, Pencil, Trash2, School, Users, Calendar, Clock } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import {
  useClasses,
  useStudents,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  type Class,
} from '@/lib/hooks';
import { CEFR_DATA, LEVELS } from '@/lib/cefr-data';

// ── Badge helpers ──────────────────────────────────────────────

const levelBadgeClass: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  A2: 'bg-sky-100 text-sky-700 border-sky-200',
  B1: 'bg-violet-100 text-violet-700 border-violet-200',
  B2: 'bg-amber-100 text-amber-700 border-amber-200',
  C1: 'bg-rose-100 text-rose-700 border-rose-200',
};

const statusBadgeClass: Record<string, string> = {
  Ativa: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Inativa: 'bg-gray-100 text-gray-600 border-gray-200',
  Ativo: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Inativo: 'bg-gray-100 text-gray-600 border-gray-200',
};

// ── Form state type ────────────────────────────────────────────

interface ClassForm {
  name: string;
  level: string;
  teacher: string;
  schedule: string;
  startDate: string;
  status: string;
  notes: string;
}

const emptyForm: ClassForm = {
  name: '',
  level: 'A1',
  teacher: '',
  schedule: '',
  startDate: '',
  status: 'Ativa',
  notes: '',
};

// ── Component ──────────────────────────────────────────────────

export function ClassesView() {
  // Data hooks
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: students = [] } = useStudents();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  // Filter state
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [form, setForm] = useState<ClassForm>(emptyForm);

  // ── Filtered classes ─────────────────────────────────────────

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.teacher ?? '').toLowerCase().includes(q);
      const matchLevel = !filterLevel || c.level === filterLevel;
      const matchStatus = !filterStatus || c.status === filterStatus;
      return matchSearch && matchLevel && matchStatus;
    });
  }, [classes, search, filterLevel, filterStatus]);

  // ── Stats ────────────────────────────────────────────────────

  const stats = useMemo(() => {
    return {
      total: classes.length,
      active: classes.filter((c) => c.status === 'Ativa' || c.status === 'ativa').length,
      shown: filtered.length,
    };
  }, [classes, filtered]);

  // ── Students for a class ─────────────────────────────────────

  function getStudentsForClass(classId: string) {
    return students.filter((s) => s.classId === classId);
  }

  // ── Form handlers ────────────────────────────────────────────

  function openCreate() {
    setEditingClass(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(cls: Class) {
    setEditingClass(cls);
    setForm({
      name: cls.name,
      level: cls.level,
      teacher: cls.teacher ?? '',
      schedule: cls.schedule ?? '',
      startDate: cls.startDate ?? '',
      status: cls.status,
      notes: cls.notes ?? '',
    });
    setFormOpen(true);
  }

  function openStudents(cls: Class) {
    setViewingClass(cls);
    setStudentsDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      toast.error('Nome da turma é obrigatório');
      return;
    }

    const payload = {
      name: form.name.trim(),
      level: form.level,
      teacher: form.teacher.trim() || null,
      schedule: form.schedule.trim() || null,
      startDate: form.startDate || null,
      status: form.status,
      notes: form.notes.trim() || null,
    };

    try {
      if (editingClass) {
        await updateClass.mutateAsync({ id: editingClass.id, ...payload });
        toast.success('Turma atualizada com sucesso');
      } else {
        await createClass.mutateAsync(payload);
        toast.success('Turma criada com sucesso');
      }
      setFormOpen(false);
    } catch {
      toast.error('Erro ao salvar turma');
    }
  }

  async function handleDelete(cls: Class) {
    if (!window.confirm(`Tem certeza que deseja excluir a turma "${cls.name}"?`)) return;
    try {
      await deleteClass.mutateAsync(cls.id);
      toast.success('Turma excluída com sucesso');
    } catch {
      toast.error('Erro ao excluir turma');
    }
  }

  // ── Loading ──────────────────────────────────────────────────

  if (classesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <School className="h-10 w-10 animate-pulse text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando turmas...</p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Filter Bar ──────────────────────────────────────── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar turma ou professor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Level Filter */}
            <select
              className="h-9 px-3 border border-input rounded-md bg-white text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-fit"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="">Todos os níveis</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="h-9 px-3 border border-input rounded-md bg-white text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-fit"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
            </select>

            {/* New Class Button */}
            <Button onClick={openCreate} className="gap-2 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              Nova Turma
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Quick Stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Turmas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-xs text-muted-foreground mt-1">Turmas Ativas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.shown}</div>
            <div className="text-xs text-muted-foreground mt-1">Mostradas</div>
          </CardContent>
        </Card>
      </div>

      {/* ── Classes Table ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <School className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">Nenhuma turma encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turma</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Alunos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((cls) => {
                  const classStudents = getStudentsForClass(cls.id);
                  return (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {cls.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{cls.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cls.teacher || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={levelBadgeClass[cls.level] ?? ''}
                        >
                          {cls.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {cls.schedule ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {cls.schedule}
                          </div>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {cls.startDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(cls.startDate).toLocaleDateString('pt-BR')}
                          </div>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusBadgeClass[cls.status] ?? ''}
                        >
                          {cls.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">{classStudents.length}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(cls)}
                            title="Editar"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(cls)}
                            title="Excluir"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* ── Create / Edit Dialog ────────────────────────────── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? 'Editar Turma' : 'Nova Turma'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="class-name">Nome da Turma *</Label>
              <Input
                id="class-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Turma A1 Manhã"
              />
            </div>

            {/* Level */}
            <div className="grid gap-2">
              <Label htmlFor="class-level">Nível *</Label>
              <select
                id="class-level"
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher + Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class-teacher">Professor(a)</Label>
                <Input
                  id="class-teacher"
                  value={form.teacher}
                  onChange={(e) =>
                    setForm({ ...form, teacher: e.target.value })
                  }
                  placeholder="Nome do professor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class-schedule">Horário</Label>
                <Input
                  id="class-schedule"
                  value={form.schedule}
                  onChange={(e) =>
                    setForm({ ...form, schedule: e.target.value })
                  }
                  placeholder="Ex: Seg/Qua 18h"
                />
              </div>
            </div>

            {/* Start Date + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class-start-date">Data de Início</Label>
                <Input
                  id="class-start-date"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class-status">Status *</Label>
                <select
                  id="class-status"
                  className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="class-notes">Observações</Label>
              <Textarea
                id="class-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Observações sobre a turma..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createClass.isPending || updateClass.isPending}
            >
              {createClass.isPending || updateClass.isPending
                ? 'Salvando...'
                : editingClass
                  ? 'Atualizar'
                  : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Students Dialog ────────────────────────────── */}
      <Dialog open={studentsDialogOpen} onOpenChange={setStudentsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              {viewingClass?.name} – Alunos
            </DialogTitle>
          </DialogHeader>

          {viewingClass && (() => {
            const classStudents = getStudentsForClass(viewingClass.id);

            return classStudents.length === 0 ? (
              <div className="py-10 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhum aluno nesta turma.
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px]">
                                {student.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">
                              {student.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={levelBadgeClass[student.level] ?? ''}
                          >
                            {student.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusBadgeClass[student.status] ?? ''}
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
