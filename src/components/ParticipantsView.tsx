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
      // docente or tae
      if (digitsOnly.length !== 7) {
        return {
          isValid: false,
          errorMessage: `A matrícula SIAPE do servidor (${segment === 'docente' ? 'Docente' : 'TAE'}) deve conter exatamente 7 dígitos numéricos. Você digitou ${digitsOnly.length} dígito(s).`,
          formattedMatricula: trimmed,
        };
      }
    }

    // Format matricula string
    const formatted =
      segment === 'discente'
        ? digitsOnly
        : trimmed.toUpperCase().startsWith('SIAPE')
        ? `SIAPE ${digitsOnly}`
        : `SIAPE ${digitsOnly}`;

    // Validate Uniqueness (Chave Privada / Sem Repetição)
    const duplicate = participants.find((p) => {
      if (editingId && p.id === editingId) return false;
      const pDigits = (p.matricula || '').replace(/\D/g, '');
      return pDigits === digitsOnly || (p.matricula && p.matricula.trim().toLowerCase() === formatted.toLowerCase());
    });

    if (duplicate) {
      return {
        isValid: false,
        errorMessage: `A matrícula "${formatted}" já está cadastrada para o participante "${duplicate.name}". A matrícula deve ser única.`,
        formattedMatricula: formatted,
      };
    }

    return {
      isValid: true,
      formattedMatricula: formatted,
    };
  };

  // Open modal for NEW participant
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

  // Open modal for EDITING participant
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

  // Save Participant (Create or Edit)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setMatriculaError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Por favor, preencha o nome e o e-mail institucional.', 'danger');
      return;
    }

    // Validate Matrícula
    const validation = validateMatriculaInput(
      formData.matricula,
      formData.segment,
      editingParticipant?.id
    );

    if (!validation.isValid) {
      setMatriculaError(validation.errorMessage || 'Matrícula inválida.');
      showToast(validation.errorMessage || 'Matrícula inválida.', 'danger');
      return;
    }

    if (editingParticipant) {
      // Update existing
      setParticipants((prev) =>
        prev.map((item) =>
          item.id === editingParticipant.id
            ? {
                ...item,
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                segment: formData.segment,
                studentLevel: formData.segment === 'discente' ? formData.studentLevel : undefined,
                matricula: validation.formattedMatricula,
                campus: formData.campus,
                status: formData.status,
              }
            : item
        )
      );
      showToast(`Participante "${formData.name}" atualizado com sucesso!`, 'success');
    } else {
      // Create new
      const newParticipant: Participant = {
        id: `p-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        segment: formData.segment,
        studentLevel: formData.segment === 'discente' ? formData.studentLevel : undefined,
        matricula: validation.formattedMatricula,
        campus: formData.campus,
        status: formData.status,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      };

      setParticipants((prev) => [newParticipant, ...prev]);
      showToast(`Participante "${formData.name}" cadastrado com sucesso!`, 'success');
    }

    setIsModalOpen(false);
  };

  // Toggle Participant Status (Ativo <-> Inativo)
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

  // Delete Participant
  const handleDeleteParticipant = (id: string) => {
    const target = participants.find((p) => p.id === id);
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    if (target) {
      showToast(`Participante "${target.name}" removido da base.`, 'info');
    }
  };

  // Bulk Import Submit
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
      // Support comma/semicolon separation (e.g. "Nome, email@ifce.edu.br" or just email)
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      let name = parts[0];
      let email = parts[1] || parts[0];

      if (!email.includes('@')) {
        // If line is just name, synthesize email
        const cleanName = name.toLowerCase().replace(/\s+/g, '.');
        email = `${cleanName}@${importSegment === 'discente' ? 'aluno.ifce.edu.br' : 'ifce.edu.br'}`;
      }

      if (parts.length === 1 && line.includes('@')) {
        // If line was just an email
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

  // Filtered Participants Calculation
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

  // Statistics
  const stats = useMemo(() => {
    const total = participants.length;
    const discentes = participants.filter((p) => p.segment === 'discente');
    const docentes = participants.filter((p) => p.segment === 'docente').length;
    const taes = participants.filter((p) => p.segment === 'tae').length;
    const ativos = participants.filter((p) => p.status === 'Ativo').length;

    // Discentes level breakdown
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
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cadastro de Participantes
            </h1>
            <span className="bg-[#E8F5EE] text-[#006837] text-xs font-bold px-3 py-1 rounded-full border border-[#006837]/15 shadow-2xs">
              Comissão Própria de Avaliação • IFCE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Gerencie a base de usuários elegíveis para participação nas campanhas de avaliação institucional (Discentes, Docentes e TAEs).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Importar Lista</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
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
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs border ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-[#006837]'
                : notification.type === 'danger'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:opacity-75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Geral */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Geral</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stats.total}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {stats.ativosCount} Ativos
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                ({stats.total > 0 ? Math.round((stats.ativosCount / stats.total) * 100) : 0}% cadastrados)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Discentes (Alunos) */}
        <div className="bg-white rounded-2xl border border-indigo-100/90 p-5 shadow-2xs space-y-2 bg-indigo-50/20 hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-bold uppercase tracking-wider">Discentes (Alunos)</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-indigo-950 tracking-tight">{stats.discentesCount}</p>
            <p className="text-[11px] text-indigo-700/80 font-medium mt-1">
              Técnico, Graduação, Mestrado e Pós
            </p>
          </div>
        </div>

        {/* Card 3: Docentes */}
        <div className="bg-white rounded-2xl border border-emerald-100/90 p-5 shadow-2xs space-y-2 bg-emerald-50/20 hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between text-[#006837]">
            <span className="text-xs font-bold uppercase tracking-wider">Docentes</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#006837] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-950 tracking-tight">{stats.docentesCount}</p>
            <p className="text-[11px] text-emerald-800/80 font-medium mt-1">
              Corpo docente e pesquisadores IFCE
            </p>
          </div>
        </div>

        {/* Card 4: TAEs */}
        <div className="bg-white rounded-2xl border border-amber-100/90 p-5 shadow-2xs space-y-2 bg-amber-50/20 hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">Técnicos (TAEs)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-amber-950 tracking-tight">{stats.taesCount}</p>
            <p className="text-[11px] text-amber-800/80 font-medium mt-1">
              Servidores técnico-administrativos
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Top Row: Search & Primary Segment Buttons */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar participante por nome, e-mail ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Segment Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs font-semibold text-slate-600 overflow-x-auto scrollbar-none">
            {(
              [
                { id: 'todos', label: 'Todos os Públicos' },
                { id: 'discente', label: 'Discentes (Alunos)' },
                { id: 'docente', label: 'Docentes' },
                { id: 'tae', label: 'TAEs' },
              ] as const
            ).map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSegmentFilter(seg.id)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
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

        {/* Bottom Row: Additional Filters (Level for Discente, Status, Campus) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase tracking-wider text-[10px] mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Refinar:</span>
          </div>

          {/* Nível do Discente Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-700">Nível do Discente:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              disabled={segmentFilter === 'docente' || segmentFilter === 'tae'}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer disabled:opacity-40"
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
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {/* Campus Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Campus:</span>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
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

      {/* Participants Table Component */}
      {filteredParticipants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-2xs text-center space-y-4 max-w-xl mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <UserX className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Nenhum participante encontrado
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Nenhum registro corresponde aos filtros ou termo de busca aplicados. Tente ajustar os parâmetros ou cadastre um novo participante.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Participante</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Table Header Info */}
          <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-semibold">
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
                  <th className="py-3.5 px-4">Nome do Participante / E-mail</th>
                  <th className="py-3.5 px-4">Segmento</th>
                  <th className="py-3.5 px-4">Nível (Discente)</th>
                  <th className="py-3.5 px-4">Matrícula / SIAPE</th>
                  <th className="py-3.5 px-4">Campus</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Name and Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
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
                          <p className="font-bold text-slate-900 leading-tight group-hover:text-[#006837] transition-colors truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            {p.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Segment Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          p.segment === 'discente'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : p.segment === 'docente'
                            ? 'bg-emerald-50 text-[#006837] border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {p.segment === 'discente' ? (
                          <>
                            <GraduationCap className="w-3 h-3" /> Discente
                          </>
                        ) : p.segment === 'docente' ? (
                          <>
                            <UserCheck className="w-3 h-3" /> Docente
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-3 h-3" /> TAE
                          </>
                        )}
                      </span>
                    </td>

                    {/* Student Level (Conditional!) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {p.segment === 'discente' ? (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          🎓 {p.studentLevel || 'Graduação'}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal italic">—</span>
                      )}
                    </td>

                    {/* Matrícula / SIAPE */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {p.matricula || '—'}
                    </td>

                    {/* Campus */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {p.campus}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        title="Clique para alternar o status"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
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
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar Participante"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Participante"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F5EE] text-[#006837] flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {editingParticipant ? 'Editar Participante' : 'Cadastrar Novo Participante'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Preencha os dados institucionais para validação de acesso na CPA.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
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
                    className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium"
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
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="carlos.oliveira@aluno.ifce.edu.br"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-10 pl-9 pr-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium"
                    />
                  </div>
                </div>

                {/* Segmento */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Segmento Institucional</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 pt-0.5">
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
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
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

                {/* REGRA CONDICIONAL: CASO SEJA DISCENTE, MOSTRAR O NÍVEL */}
                {formData.segment === 'discente' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl"
                  >
                    <label className="text-xs font-bold text-indigo-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <span>Nível do Discente</span>
                        <span className="text-rose-500">*</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 font-semibold">Exigido para Discentes</span>
                    </label>

                    <select
                      required
                      value={formData.studentLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, studentLevel: e.target.value as StudentLevelType })
                      }
                      className="w-full h-10 px-3 text-xs bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-bold text-indigo-950"
                    >
                      <option value="Técnico">Técnico (Integrado / Subsequente)</option>
                      <option value="Graduação">Graduação (Bacharelado / Licenciatura / Tecnologia)</option>
                      <option value="Especialização">Pós-Graduação (Especialização)</option>
                      <option value="Mestrado">Mestrado</option>
                      <option value="Doutorado">Doutorado</option>
                    </select>
                  </motion.div>
                )}

                {/* Matrícula / SIAPE & Campus in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>{formData.segment === 'discente' ? 'Matrícula Acadêmica' : 'Número SIAPE'}</span>
                        <span className="text-rose-500">*</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Chave Única</span>
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
                      className={`w-full h-10 px-3 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 font-mono transition-colors ${
                        matriculaError
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-200 focus:ring-[#006837]/20 focus:border-[#006837]'
                      }`}
                    />
                    {matriculaError ? (
                      <p className="text-[10px] font-bold text-rose-600 flex items-start gap-1 mt-1 leading-tight">
                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{matriculaError}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-medium">
                        {formData.segment === 'discente'
                          ? 'Mínimo 10 e máximo 11 dígitos numéricos (SUAP / Q-Acadêmico).'
                          : 'Exatamente 7 dígitos numéricos (SIAPE do servidor público).'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Campus de Lotação</label>
                    <select
                      value={formData.campus}
                      onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                      className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium"
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
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'Ativo'}
                        onChange={() => setFormData({ ...formData, status: 'Ativo' })}
                        className="text-[#006837] focus:ring-[#006837]"
                      />
                      <span>Ativo (Pode responder aos formulários)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
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
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Excluir Participante?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Esta ação é irreversível. O participante não receberá mais os convites de avaliação da CPA.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteParticipant(deleteConfirmId)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/70 text-slate-700 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      Importação em Massa
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Cole uma lista de nomes e e-mails para cadastro simultâneo.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBulkImport} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Segmento do Lote</label>
                    <select
                      value={importSegment}
                      onChange={(e) => setImportSegment(e.target.value as ParticipantSegment)}
                      className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
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
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-950"
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
                    rows={6}
                    required
                    placeholder={`Exemplo:\nJuliana Souza, juliana@aluno.ifce.edu.br\nFernando Costa, fernando@aluno.ifce.edu.br`}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-mono leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
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
