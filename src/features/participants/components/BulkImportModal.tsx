import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X } from 'lucide-react';
import { ParticipantSegment, StudentLevelType } from '../../../types';

/* Modal de importação em massa de participantes (colar lista de nomes/e-mails).
 * Extraído de ParticipantsView.tsx. */

interface BulkImportModalProps {
  isOpen: boolean;
  importSegment: ParticipantSegment;
  setImportSegment: (segment: ParticipantSegment) => void;
  importLevel: StudentLevelType;
  setImportLevel: (level: StudentLevelType) => void;
  importText: string;
  setImportText: (text: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  importSegment,
  setImportSegment,
  importLevel,
  setImportLevel,
  importText,
  setImportText,
  onClose,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-4 space-y-3">
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
                  onClick={onClose}
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
  );
};
