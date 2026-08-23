import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ReportQuestion } from '../../../data/reportsData';

/* Modal compacto com detalhes completos de uma pergunta: distribuição de respostas
 * e comparativo por segmento. Extraído de ReportsView.tsx. */

interface QuestionDetailModalProps {
  question: ReportQuestion | null;
  campaignHasResponses: boolean;
  segmentBreakdown: ReportQuestion[];
  onClose: () => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  question,
  campaignHasResponses,
  segmentBreakdown,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {question && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header do Modal */}
            <div className="p-4 border-b border-slate-200 flex items-start justify-between bg-slate-50/80 gap-2">
              <div className="space-y-1 min-w-0 pr-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#006837] text-white">
                    {question.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                    Segmento: {question.segment}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {question.questionText}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {question.totalAnswers === 0 || !campaignHasResponses ? (
                <div className="py-8 px-4 text-center space-y-2 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto text-xl">
                    📋
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Sem respostas registradas para esta pergunta.
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Os resultados e gráficos serão atualizados assim que os participantes responderem ao questionário.
                  </p>
                </div>
              ) : (
                <>
                  {/* Status Geral */}
                  <div className="flex items-center justify-between p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Resultado da Avaliação
                      </span>
                      <span className="text-sm font-black text-[#006837]">
                        {question.classification}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-[#006837]">
                        {question.approvalRate}%
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 block">Aprovação Alta</span>
                    </div>
                  </div>

                  {/* Distribuição das Respostas */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-800">
                      Distribuição das Opções de Resposta
                    </h4>
                    <div className="space-y-2">
                      {question.alternatives.map((alt, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-700 font-semibold">
                            <span>{alt.option}</span>
                            <span className="font-bold text-slate-900">
                              {alt.count} ({alt.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${alt.percentage}%` }}
                              className={`h-full rounded-full transition-all ${
                                idx === 0
                                  ? 'bg-[#006837]'
                                  : idx === 1
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Breakdown por Segmento */}
                  {segmentBreakdown.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-extrabold text-slate-800">
                        Comparativo por Segmento de Respondentes
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {segmentBreakdown.map((s) => (
                          <div
                            key={s.segment}
                            className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center space-y-0.5"
                          >
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">
                              {s.segment}
                            </span>
                            <span className="text-sm font-black text-slate-900 block">
                              {s.totalAnswers > 0 ? `${s.approvalRate}%` : '0%'}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 block truncate">
                              {s.totalAnswers > 0 ? s.classification : 'Sem dados'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
