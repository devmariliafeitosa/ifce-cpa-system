import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  GraduationCap,
  UserCheck,
  Briefcase,
  UploadCloud,
  UserX,
  Plus,
  X,
  CheckCircle2,
  Building2,
  Mail,
  Shield,
} from 'lucide-react';

export const ParticipantsView: React.FC = () => {
  const [participants, setParticipants] = useState<any[]>([]); // Empty list as requested
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'todos' | 'alunos' | 'docentes' | 'taes'>('todos');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Participant Form Inputs
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSegment, setNewSegment] = useState<'alunos' | 'docentes' | 'taes'>('alunos');
  const [newMatricula, setNewMatricula] = useState('');

  const handleRegisterParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newParticipant = {
      id: `p-${Date.now()}`,
      name: newName,
      email: newEmail,
      segment: newSegment,
      matricula: newMatricula || '2025100' + Math.floor(Math.random() * 900 + 100),
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativo',
    };

    setParticipants([newParticipant, ...participants]);
    setNotification(`Participante "${newName}" cadastrado com sucesso!`);
    setTimeout(() => setNotification(null), 4000);

    setIsRegisterModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewMatricula('');
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricula.includes(searchTerm);
    const matchesSegment = segmentFilter === 'todos' || p.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Participantes
            </h1>
            <span className="bg-[#E8F5EE] text-[#006837] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#006837]/10">
              Gerenciamento • Campus Tauá
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Visualização e controle de acesso dos usuários cadastrados no sistema (Alunos, Docentes e TAEs).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Participante</span>
          </button>
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#006837]" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Segment Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Geral</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{participants.length}</p>
          <p className="text-[11px] text-slate-400">Usuários cadastrados</p>
        </div>

        <div className="bg-white rounded-2xl border border-indigo-100/80 p-4 shadow-2xs space-y-1 bg-indigo-50/20">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-semibold">Alunos (Discentes)</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-950">
            {participants.filter((p) => p.segment === 'alunos').length}
          </p>
          <p className="text-[11px] text-indigo-600/80">Discentes com acesso</p>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100/80 p-4 shadow-2xs space-y-1 bg-emerald-50/20">
          <div className="flex items-center justify-between text-[#006837]">
            <span className="text-xs font-semibold">Docentes</span>
            <UserCheck className="w-4 h-4 text-[#006837]" />
          </div>
          <p className="text-2xl font-bold text-emerald-950">
            {participants.filter((p) => p.segment === 'docentes').length}
          </p>
          <p className="text-[11px] text-[#006837]/80">Corpo docente registrado</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100/80 p-4 shadow-2xs space-y-1 bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-semibold">Técnicos (TAEs)</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-950">
            {participants.filter((p) => p.segment === 'taes').length}
          </p>
          <p className="text-[11px] text-amber-700/80">Servidores administrativos</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
          />
        </div>

        {/* Segment Tabs Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 w-full md:w-auto overflow-x-auto">
          {(['todos', 'alunos', 'docentes', 'taes'] as const).map((seg) => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer whitespace-nowrap ${
                segmentFilter === seg
                  ? 'bg-[#006837] text-white font-bold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {seg === 'todos'
                ? 'Todos os Públicos'
                : seg === 'alunos'
                ? 'Alunos'
                : seg === 'docentes'
                ? 'Docentes'
                : 'TAEs'}
            </button>
          ))}
        </div>
      </div>

      {/* List / Empty State */}
      {filteredParticipants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-2xs text-center space-y-5 max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <UserX className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-800">
              Nenhum participante cadastrado até o momento
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Ainda não existem usuários cadastrados no banco de dados da CPA do Campus Tauá. Você pode cadastrar participantes individualmente ou importar arquivos da base institucional.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Primeiro Participante</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Nome do Participante</th>
                  <th className="py-3.5 px-4">E-mail Institucional</th>
                  <th className="py-3.5 px-4">Matrícula</th>
                  <th className="py-3.5 px-4">Segmento</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.email}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{p.matricula}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.segment === 'alunos'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            : p.segment === 'docentes'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : 'bg-amber-50 text-amber-800 border border-amber-100'
                        }`}
                      >
                        {p.segment === 'alunos'
                          ? 'Aluno'
                          : p.segment === 'docentes'
                          ? 'Docente'
                          : 'TAE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                        ● {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-slate-400 hover:text-slate-700 font-semibold cursor-pointer">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#006837]" />
                <h3 className="text-base font-bold text-slate-900">
                  Cadastrar Participante
                </h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterParticipant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">E-mail Institucional *</label>
                <input
                  type="email"
                  required
                  placeholder="carlos.oliveira@aluno.ifce.edu.br"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Segmento *</label>
                <select
                  value={newSegment}
                  onChange={(e) => setNewSegment(e.target.value as any)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                >
                  <option value="alunos">Aluno (Discente)</option>
                  <option value="docentes">Docente (Professor)</option>
                  <option value="taes">Técnico Administrativo (TAE)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Matrícula (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: 2025100123"
                  value={newMatricula}
                  onChange={(e) => setNewMatricula(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
