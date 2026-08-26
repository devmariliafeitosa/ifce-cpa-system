import React from 'react';
import { Plus, X, Trash2, Loader2, Send } from 'lucide-react';
import { FormQuestionInput } from '../../../services/googleFormsService';

/* Modal de criação de formulário customizado (Google Form) com perguntas dinâmicas.
 * Extraído de GoogleFormsManager.tsx. */

interface CustomFormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  customTitle: string;
  setCustomTitle: (value: string) => void;
  customDescription: string;
  setCustomDescription: (value: string) => void;
  customQuestions: FormQuestionInput[];
  addQuestion: () => void;
  updateQuestion: (index: number, field: keyof FormQuestionInput, value: any) => void;
  removeQuestion: (index: number) => void;
  isSubmittingForm: boolean;
}

export const CustomFormBuilderModal: React.FC<CustomFormBuilderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customTitle,
  setCustomTitle,
  customDescription,
  setCustomDescription,
  customQuestions,
  addQuestion,
  updateQuestion,
  removeQuestion,
  isSubmittingForm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#006837]" />
            <h3 className="text-base font-bold text-slate-800">
              Criar Novo Google Form • CPA Tauá
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Título do Formulário *</label>
            <input
              type="text"
              required
              placeholder="Ex: Avaliação de Cursos Técnicos 2025.1"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Descrição / Instruções</label>
            <textarea
              rows={2}
              placeholder="Instruções aos discentes ou servidores respondentes do Campus Tauá..."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
            />
          </div>

          {/* Questions Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Perguntas do Questionário ({customQuestions.length})
              </h4>
              <button
                type="button"
                onClick={addQuestion}
                className="text-xs font-semibold text-[#006837] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Pergunta
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {customQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#006837] shrink-0">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Digite o enunciado da pergunta..."
                      value={q.title}
                      onChange={(e) => updateQuestion(idx, 'title', e.target.value)}
                      className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837]"
                    />
                    {customQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <label className="text-slate-500 font-medium">Tipo:</label>
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(idx, 'type', e.target.value as any)}
                        className="h-8 px-2 bg-white border border-slate-200 rounded-md text-xs font-medium focus:outline-none"
                      >
                        <option value="SCALE">Escala de Satisfação (1 a 5)</option>
                        <option value="RADIO">Múltipla Escolha (Opção Única)</option>
                        <option value="TEXT">Resposta de Texto Livre</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) => updateQuestion(idx, 'required', e.target.checked)}
                        className="accent-[#006837]"
                      />
                      <span>Obrigatória</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando no Google...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Criar e Publicar Formulário</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
