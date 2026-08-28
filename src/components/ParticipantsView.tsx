import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  GraduationCap,
  UserCheck,
  Briefcase,
  UserX,
  Plus,
  X,
  CheckCircle2,
  Building2,
  Mail,
  Shield,
  Edit3,
  Trash2,
  AlertTriangle,
  Upload,
  BookOpen,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Participant, ParticipantSegment, StudentLevelType } from '../types';
import { INITIAL_PARTICIPANTS } from '../data/participantsData';

const IFCE_CAMPI = [
  'Campus Tauá',
  'Campus Acaraú',
  'Campus Aracati',
  'Campus Baturité',
  'Campus Camocim',
  'Campus Canindé',
  'Campus Crateús',
  'Campus Crato',
  'Campus Fortaleza',
  'Campus Iguatu',
  'Campus Itapipoca',
  'Campus Juazeiro do Norte',
  'Campus Limoeiro do Norte',
  'Campus Maracanaú',
  'Campus Morada Nova',
  'Campus Quixadá',
  'Campus Sobral',
  'Campus Tianguá',
  'Campus Ubajara',
  'Campus Umirim',
];

export const ParticipantsView: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'todos' | ParticipantSegment>('todos');
  const [levelFilter, setLevelFilter] = useState<'todos' | StudentLevelType>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'Ativo' | 'Inativo'>('todos');
  const [campusFilter, setCampusFilter] = useState<string>('todos');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importSegment, setImportSegment] = useState<ParticipantSegment>('discente');
  const [importLevel, setImportLevel] = useState<StudentLevelType>('Graduação');

  // Notification Toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'danger' } | null>(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    segment: ParticipantSegment;
    studentLevel: StudentLevelType;
    matricula: string;
    campus: string;
    status: 'Ativo' | 'Inativo';
  }>({
    name: '',
    email: '',
    segment: 'discente',
    studentLevel: 'Graduação',
    matricula: '',
    campus: 'Campus Tauá',
    status: 'Ativo',
  });

  const [matriculaError, setMatriculaError] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper function to validate matricula (Uniqueness & Digit Length)
  const validateMatriculaInput = (
    rawMatricula: string,
    segment: ParticipantSegment,
    editingId?: string
  ): { isValid: boolean; errorMessage?: string; formattedMatricula: string } => {
    const trimmed = rawMatricula.trim();
    if (!trimmed) {
      return {
        isValid: false,
        errorMessage: 'A matrícula é obrigatória e atua como chave única do participante.',
        formattedMatricula: '',
      };
    }

    const digitsOnly = trimmed.replace(/\D/g, '');

    if (segment === 'discente') {
      if (digitsOnly.length < 10 || digitsOnly.length > 11) {
        return {
          isValid: false,
          errorMessage: `A matrícula do Discente deve conter entre 10 e 11 dígitos numéricos (SUAP / Q-Acadêmico). Você digitou ${digitsOnly.length} dígito(s).`,
          formattedMatricula: trimmed,
        };
      }
    } else {
      if (digitsOnly.length !== 7) {
        return {
          isValid: false,
          errorMessage: `A matrícula SIAPE do servidor (${segment === 'docente' ? 'Docente' : 'TAE'}) deve conter exatamente 7 dígitos numéricos. Você digitou ${digitsOnly.length} dígito(s).`,
          formattedMatricula: trimmed,
        };
      }
    }

    const duplicate = participants.find(
      (p) =>
        p.id !== editingId &&
        p.matricula &&
        p.matricula.replace(/\D/g, '') === digitsOnly
    );

    if (duplicate) {
      return {
        isValid: false,
        errorMessage: `Já existe um participante cadastrado com esta matrícula (${duplicate.name} - ${duplicate.segment}).`,
        formattedMatricula: trimmed,
      };
    }

    return {
      isValid: true,
      formattedMatricula: trimmed,
    };
  };

  const handleOpenCreateModal = () => {
    setEditingParticipant(null);
    setMatriculaError(null);
    setFormData({
      name: '',
      email: '',
      segment: 'discente',
      studentLevel: 'Graduação',
      matricula: '',
      campus: 'Campus Tauá',
      status: 'Ativo',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Participant) => {
    setEditingParticipant(p);
    setMatriculaError(null);
    setFormData({
      name: p.name,
      email: p.email,
      segment: p.segment,
      studentLevel: p.studentLevel || 'Graduação',
      matricula: p.matricula || '',
      campus: p.campus || 'Campus Tauá',
      status: p.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const matriculaCheck = validateMatriculaInput(
      formData.matricula,
      formData.segment,
      editingParticipant ? editingParticipant.id : undefined
    );

    if (!matriculaCheck.isValid) {
      setMatriculaError(matriculaCheck.errorMessage || 'Matrícula inválida.');
      return;
    }

    if (editingParticipant) {
      setParticipants((prev) =>
        prev.map((item) =>
          item.id === editingParticipant.id
            ? {
                ...item,
                name: formData.name.trim(),
                email: formData.email.trim(),
                segment: formData.segment,
                studentLevel: formData.segment === 'discente' ? formData.studentLevel : undefined,
                matricula: matriculaCheck.formattedMatricula,
                campus: formData.campus,
                status: formData.status,
              }
            : item
        )
      );
      showToast(`Participante "${formData.name}" atualizado com sucesso!`, 'success');
    } else {
      const newParticipant: Participant = {
        id: `p-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        segment: formData.segment,
        studentLevel: formData.segment === 'discente' ? formData.studentLevel : undefined,
        matricula: matriculaCheck.formattedMatricula,
        campus: formData.campus,
        status: formData.status,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      };

      setParticipants((prev) => [newParticipant, ...prev]);
      showToast(`Participante "${formData.name}" cadastrado com sucesso!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (p: Participant) => {
    const newStatus = p.status === 'Ativo' ? 'Inativo' : 'Ativo';
    setParticipants((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, status: newStatus } : item))
    );
    showToast(
      `Status de "${p.name}" alterado para ${newStatus.toLowerCase()}.`,
      newStatus === 'Ativo' ? 'success' : 'info'
    );
  };

  const handleDeleteParticipant = (id: string) => {
    const target = participants.find((p) => p.id === id);
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    if (target) {
      showToast(`Participante "${target.name}" removido da base.`, 'info');
    }
  };

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const lines = importText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let count = 0;
    const newItems: Participant[] = [];

    lines.forEach((line, idx) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      let name = parts[0];
      let email = parts[1] || parts[0];

      if (!email.includes('@')) {
        const cleanName = name.toLowerCase().replace(/\s+/g, '.');
        email = `${cleanName}@${importSegment === 'discente' ? 'aluno.ifce.edu.br' : 'ifce.edu.br'}`;
      }

      if (parts.length === 1 && line.includes('@')) {
        name = line.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        email = line;
      }

      newItems.push({
        id: `p-bulk-${Date.now()}-${idx}`,
        name: name,
        email: email,
        segment: importSegment,
        studentLevel: importSegment === 'discente' ? importLevel : undefined,
        matricula:
          importSegment === 'discente'
            ? `2026${Math.floor(1000000 + Math.random() * 9000000)}`
            : `SIAPE ${Math.floor(1000000 + Math.random() * 9000000)}`,
        campus: 'Campus Tauá',
        status: 'Ativo',
        createdAt: new Date().toLocaleDateString('pt-BR'),
      });
      count++;
    });

    setParticipants((prev) => [...newItems, ...prev]);
    setIsImportModalOpen(false);
    setImportText('');
    showToast(`${count} participantes importados com sucesso!`, 'success');
  };

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.matricula && p.matricula.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSegment = segmentFilter === 'todos' || p.segment === segmentFilter;

      const matchLevel =
        levelFilter === 'todos' ||
        (p.segment === 'discente' && p.studentLevel === levelFilter);

      const matchStatus = statusFilter === 'todos' || p.status === statusFilter;

      const matchCampus = campusFilter === 'todos' || p.campus === campusFilter;

      return matchQuery && matchSegment && matchLevel && matchStatus && matchCampus;
    });
  }, [participants, searchTerm, segmentFilter, levelFilter, statusFilter, campusFilter]);

  const stats = useMemo(() => {
    const total = participants.length;
    const discentes = participants.filter((p) => p.segment === 'discente');
    const docentes = participants.filter((p) => p.segment === 'docente').length;
    const taes = participants.filter((p) => p.segment === 'tae').length;
    const ativos = participants.filter((p) => p.status === 'Ativo').length;

    const discenteLevels = discentes.reduce((acc, curr) => {
      const level = curr.studentLevel || 'Graduação';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      discentesCount: discentes.length,
      docentesCount: docentes,
      taesCount: taes,
      ativosCount: ativos,
      discenteLevels,
    };
  }, [participants]);

  return (
    <div className="w-full max-w-[96%] 2xl:max-w-[1440px] mx-auto px-2 sm:px-4 py-4 space-y-4 select-none animate-in fade-in duration-200">
      {/* Barra de Ações e Resumo de Participantes */}
      <div
        id="participants-header"
        className="bg-white border border-slate-200/90 rounded-xl px-4 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Base Institucional</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006837] text-[10px] font-extrabold border border-emerald-200">
            {participants.length} cadastrados
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Importar Lista</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="h-8 px-3 bg-[#006837] hover:bg-[#00522b] text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar Participante</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between shadow-2xs border ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-[#006837]'
                : notification.type === 'danger'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:opacity-75 cursor-pointer text-slate-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Summary Stat Cards (4 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Geral */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Geral
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {stats.total}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              <strong className="text-[#006837] font-bold">{stats.ativosCount}</strong> ativos ({stats.total > 0 ? Math.round((stats.ativosCount / stats.total) * 100) : 0}%)
            </p>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Discentes (Alunos) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Discentes (Alunos)
            </span>
            <span className="text-2xl font-black text-indigo-950 tracking-tight leading-none mt-1 block">
              {stats.discentesCount}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Técnico, Graduação e Pós
            </p>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Docentes */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Docentes
            </span>
            <span className="text-2xl font-black text-[#006837] tracking-tight leading-none mt-1 block">
              {stats.docentesCount}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Professores do Campus
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-[#006837] rounded-xl shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: TAEs */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Técnicos (TAEs)
            </span>
            <span className="text-2xl font-black text-amber-900 tracking-tight leading-none mt-1 block">
              {stats.taesCount}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Técnico-administrativos
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar (Compact) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs space-y-2.5">
        {/* Top Row: Search & Segment Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-7 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837] focus:border-[#006837] font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Segment Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600 overflow-x-auto">
            {(
              [
                { id: 'todos', label: 'Todos' },
                { id: 'discente', label: 'Discentes' },
                { id: 'docente', label: 'Docentes' },
                { id: 'tae', label: 'TAEs' },
              ] as const
            ).map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSegmentFilter(seg.id)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap text-xs ${
                  segmentFilter === seg.id
                    ? 'bg-[#006837] text-white font-bold shadow-2xs'
                    : 'hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Additional Filters */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <Filter className="w-3 h-3" />
            <span>Filtros:</span>
          </div>

          {/* Nível do Discente Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500 font-medium">Nível:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              disabled={segmentFilter === 'docente' || segmentFilter === 'tae'}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer disabled:opacity-40 text-xs"
            >
              <option value="todos">Todos os Níveis</option>
              <option value="Técnico">Técnico</option>
              <option value="Graduação">Graduação</option>
              <option value="Especialização">Especialização</option>
              <option value="Mestrado">Mestrado</option>
              <option value="Doutorado">Doutorado</option>
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
            >
              <option value="todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {/* Campus Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Campus:</span>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
            >
              <option value="todos">Todos os Campi</option>
              {IFCE_CAMPI.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {(searchTerm || segmentFilter !== 'todos' || levelFilter !== 'todos' || statusFilter !== 'todos' || campusFilter !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSegmentFilter('todos');
                setLevelFilter('todos');
                setStatusFilter('todos');
                setCampusFilter('todos');
              }}
              className="text-[11px] font-bold text-[#006837] hover:underline ml-auto flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Participants Table Component (Compact) */}
      {filteredParticipants.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-8 shadow-2xs text-center space-y-3 max-w-md mx-auto my-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <UserX className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Nenhum participante encontrado
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nenhum registro corresponde aos filtros ou termo de busca aplicados.
            </p>
          </div>
          <div className="pt-1">
            <button
              onClick={handleOpenCreateModal}
              className="h-8 px-3 bg-[#006837] hover:bg-[#00522b] text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Participante</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Table Header Info */}
          <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>
              Exibindo <strong className="text-slate-900">{filteredParticipants.length}</strong> participante(s)
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Base institucional CPA IFCE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3.5">Participante / E-mail</th>
                  <th className="py-2.5 px-3.5">Segmento</th>
                  <th className="py-2.5 px-3.5">Nível (Discente)</th>
                  <th className="py-2.5 px-3.5">Matrícula / SIAPE</th>
                  <th className="py-2.5 px-3.5">Campus</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Name and Email */}
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            p.segment === 'discente'
                              ? 'bg-indigo-100 text-indigo-700'
                              : p.segment === 'docente'
                              ? 'bg-emerald-100 text-[#006837]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 leading-tight group-hover:text-[#006837] transition-colors truncate text-xs">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">
                            {p.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Segment Badge */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                          p.segment === 'discente'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : p.segment === 'docente'
                            ? 'bg-emerald-50 text-[#006837] border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {p.segment === 'discente' ? (
                          <>
                            <GraduationCap className="w-2.5 h-2.5" /> Discente
                          </>
                        ) : p.segment === 'docente' ? (
                          <>
                            <UserCheck className="w-2.5 h-2.5" /> Docente
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-2.5 h-2.5" /> TAE
                          </>
                        )}
                      </span>
                    </td>

                    {/* Student Level */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {p.segment === 'discente' ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          🎓 {p.studentLevel || 'Graduação'}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Matrícula / SIAPE */}
                    <td className="py-2.5 px-3.5 font-mono text-[10px] text-slate-600 whitespace-nowrap">
                      {p.matricula || '—'}
                    </td>

                    {/* Campus */}
                    <td className="py-2.5 px-3.5 text-slate-600 whitespace-nowrap text-xs">
                      {p.campus}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        title="Clique para alternar o status"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition-all ${
                          p.status === 'Ativo'
                            ? 'bg-emerald-100 text-[#006837] border border-emerald-200 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === 'Ativo' ? 'bg-[#006837]' : 'bg-slate-400'
                          }`}
                        />
                        {p.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Editar Participante"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Excluir Participante"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PARTICIPANT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#E8F5EE] text-[#006837] rounded-lg">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {editingParticipant ? 'Editar Participante' : 'Cadastrar Novo Participante'}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Preencha os dados institucionais para validação de acesso.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitForm} className="p-4 space-y-3">
                {/* Nome Completo */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Nome Completo</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo de Oliveira"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-8 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837] focus:border-[#006837] font-medium"
                  />
                </div>

                {/* E-mail Institucional */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>E-mail Institucional IFCE</span>
                      <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      @ifce.edu.br ou @aluno.ifce.edu.br
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="carlos.oliveira@aluno.ifce.edu.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837] focus:border-[#006837] font-medium"
                    />
                  </div>
                </div>

                {/* Segmento */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Segmento Institucional</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'discente', label: 'Discente (Aluno)' },
                        { id: 'docente', label: 'Docente' },
                        { id: 'tae', label: 'TAE (Técnico)' },
                      ] as const
                    ).map((seg) => (
                      <button
                        key={seg.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, segment: seg.id })}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all text-center cursor-pointer ${
                          formData.segment === seg.id
                            ? 'bg-[#E8F5EE] border-[#006837] text-[#006837] shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {seg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nível Discente */}
                {formData.segment === 'discente' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1 p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg"
                  >
                    <label className="text-xs font-bold text-indigo-950 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Nível do Discente</span>
                        <span className="text-rose-500">*</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 font-semibold">Exigido</span>
                    </label>

                    <select
                      required
                      value={formData.studentLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, studentLevel: e.target.value as StudentLevelType })
                      }
                      className="w-full h-8 px-2.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 font-bold text-indigo-950"
                    >
                      <option value="Técnico">Técnico (Integrado / Subsequente)</option>
                      <option value="Graduação">Graduação (Bacharelado / Licenciatura / Tecnologia)</option>
                      <option value="Especialização">Pós-Graduação (Especialização)</option>
                      <option value="Mestrado">Mestrado</option>
                      <option value="Doutorado">Doutorado</option>
                    </select>
                  </motion.div>
                )}

                {/* Matrícula & Campus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>{formData.segment === 'discente' ? 'Matrícula Acadêmica' : 'Número SIAPE'}</span>
                        <span className="text-rose-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={formData.segment === 'discente' ? 'Ex: 20241045012' : 'Ex: 1982736'}
                      value={formData.matricula}
                      onChange={(e) => {
                        setFormData({ ...formData, matricula: e.target.value });
                        if (matriculaError) setMatriculaError(null);
                      }}
                      className={`w-full h-8 px-2.5 text-xs bg-slate-50 border rounded-lg focus:outline-none font-mono transition-colors ${
                        matriculaError
                          ? 'border-rose-400 bg-rose-50/30'
                          : 'border-slate-200 focus:border-[#006837]'
                      }`}
                    />
                    {matriculaError && (
                      <p className="text-[10px] font-bold text-rose-600 flex items-start gap-1 mt-0.5 leading-tight">
                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{matriculaError}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Campus</label>
                    <select
                      value={formData.campus}
                      onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                      className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#006837] font-medium"
                    >
                      {IFCE_CAMPI.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-700">Status no Sistema</label>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'Ativo'}
                        onChange={() => setFormData({ ...formData, status: 'Ativo' })}
                        className="text-[#006837] focus:ring-[#006837]"
                      />
                      <span>Ativo</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'Inativo'}
                        onChange={() => setFormData({ ...formData, status: 'Inativo' })}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>Inativo</span>
                    </label>
                  </div>
                </div>

                {/* Modal Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-8 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-3 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    {editingParticipant ? 'Salvar Alterações' : 'Cadastrar Participante'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-sm w-full border border-slate-200 shadow-xl p-5 text-center space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Excluir Participante?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Esta ação é irreversível e removerá o participante da base da CPA.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="h-8 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteParticipant(deleteConfirmId)}
                  className="h-8 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BULK IMPORT MODAL */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      Importação em Massa
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Cole uma lista de nomes e e-mails para cadastro simultâneo.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBulkImport} className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Segmento do Lote</label>
                    <select
                      value={importSegment}
                      onChange={(e) => setImportSegment(e.target.value as ParticipantSegment)}
                      className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium"
                    >
                      <option value="discente">Discentes (Alunos)</option>
                      <option value="docente">Docentes</option>
                      <option value="tae">TAEs</option>
                    </select>
                  </div>

                  {importSegment === 'discente' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Nível do Lote</label>
                      <select
                        value={importLevel}
                        onChange={(e) => setImportLevel(e.target.value as StudentLevelType)}
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-indigo-950"
                      >
                        <option value="Técnico">Técnico</option>
                        <option value="Graduação">Graduação</option>
                        <option value="Especialização">Especialização</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Doutorado">Doutorado</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex justify-between">
                    <span>Nomes e E-mails (Um por linha)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Nome, email@ifce.edu.br</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder={`Exemplo:\nJuliana Souza, juliana@aluno.ifce.edu.br\nFernando Costa, fernando@aluno.ifce.edu.br`}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837] focus:border-[#006837] font-mono leading-relaxed"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="h-8 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-3 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer"
                  >
                    Processar Importação
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
