import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, X, Mail, GraduationCap, AlertTriangle } from 'lucide-react';
import { Participant, ParticipantSegment, StudentLevelType } from '../../../types';
import { IFCE_CAMPI } from '../data/ifceCampi';

/* Modal de cadastro/edição de participante. Extraído de ParticipantsView.tsx. */

export interface ParticipantFormData {
  name: string;
  email: string;
  segment: ParticipantSegment;
  studentLevel: StudentLevelType;
  matricula: string;
  campus: string;
  status: 'Ativo' | 'Inativo';
}

interface ParticipantFormModalProps {
  isOpen: boolean;
  editingParticipant: Participant | null;
  formData: ParticipantFormData;
  setFormData: React.Dispatch<React.SetStateAction<ParticipantFormData>>;
  matriculaError: string | null;
  setMatriculaError: (error: string | null) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ParticipantFormModal: React.FC<ParticipantFormModalProps> = ({
  isOpen,
  editingParticipant,
  formData,
  setFormData,
  matriculaError,
  setMatriculaError,
  onClose,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={onSubmit} className="p-4 space-y-3">
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
                  onClick={onClose}
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
  );
};
