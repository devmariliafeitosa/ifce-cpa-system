import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { SmartQuestion } from '../../../../types';

/* Prévia somente-leitura das perguntas cadastradas no formulário. Extraído de FormsManagerView.tsx.
 * NOTA: correção de bug ao extrair — o código original lia `q.text`/`q.dimension`, campos que não
 * existem em SmartQuestion (os campos reais são `title` e `category`), o que fazia a prévia sempre
 * renderizar em branco. O bug passava despercebido porque o componente-container original tinha
 * milhares de linhas e o `tsc` deixava de checar profundamente o corpo da função. */

interface QuestionsPreviewDialogProps {
  isOpen: boolean;
  questions: SmartQuestion[];
  onClose: () => void;
}

const QUESTION_TYPE_LABELS: Record<SmartQuestion['type'], string> = {
  SCALE: 'Escala',
  RADIO: 'Múltipla Escolha (única)',
  CHECKBOX: 'Múltipla Escolha (várias)',
  DROPDOWN: 'Lista Suspensa',
  YES_NO: 'Sim/Não',
};

export const QuestionsPreviewDialog: React.FC<QuestionsPreviewDialogProps> = ({ isOpen, questions, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#006837]" />
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900">Perguntas Cadastradas</h4>
              <p className="text-xs text-slate-500">Total de {questions.length} questões no formulário</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 divide-y divide-slate-100 flex-1">
          {questions.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">Nenhuma pergunta cadastrada.</p>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {idx + 1}. {q.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                    {QUESTION_TYPE_LABELS[q.type]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>Público: {q.audiences.includes('todos') ? 'Todos' : q.audiences.join(', ')}</span>
                  <span>•</span>
                  <span>Eixo: {q.category || 'Geral'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
