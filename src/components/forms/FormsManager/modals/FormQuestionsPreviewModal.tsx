import { HelpCircle, X } from 'lucide-react';
import React from 'react';
import type { SmartQuestion } from '../../../../types';

interface FormQuestionsPreviewModalProps {
  isPreviewQuestionsModalOpen: boolean;
  setIsPreviewQuestionsModalOpen: (open: boolean) => void;
  formQuestions: SmartQuestion[];
}

export const FormQuestionsPreviewModal: React.FC<FormQuestionsPreviewModalProps> = ({
  isPreviewQuestionsModalOpen,
  setIsPreviewQuestionsModalOpen,
  formQuestions,
}) => {
  return (
    <>
      {/* MODAL SECUNDÁRIO: Ver Perguntas do Formulário */}
      {isPreviewQuestionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#006837]" />
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900">Perguntas Cadastradas</h4>
                  <p className="text-xs text-slate-500">Total de {formQuestions.length} questões no formulário</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewQuestionsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 divide-y divide-slate-100 flex-1">
              {formQuestions.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Nenhuma pergunta cadastrada.</p>
              ) : (
                formQuestions.map((q, idx) => (
                  <div key={q.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {idx + 1}. {q.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        {q.type === 'SCALE'
                          ? 'Escala Likert'
                          : q.type === 'RADIO'
                            ? 'Múltipla Escolha'
                            : q.type === 'CHECKBOX'
                              ? 'Caixa de Seleção'
                              : q.type === 'DROPDOWN'
                                ? 'Lista Suspensa'
                                : 'Sim / Não'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>Público: {q.audiences.includes('todos') ? 'Todos' : q.audiences.join(', ')}</span>
                      <span>•</span>
                      <span>Categoria: {q.category || 'Geral'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewQuestionsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
