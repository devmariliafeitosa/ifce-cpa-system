import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ReportDimensionResult, ReportQuestion } from '../../../data/reportsData';
import { getCategoryIcon } from '../utils/getCategoryIcon';

/* Drawer lateral com detalhes de uma dimensão/área avaliada: perguntas filtradas por
 * segmento e suas distribuições de resposta. Extraído de ReportsView.tsx. */

interface DimensionDrawerProps {
  dimension: ReportDimensionResult | null;
  campaignHasResponses: boolean;
  activeQuestionSegment: 'Todos' | 'Discentes' | 'Docentes' | 'TAEs';
  setActiveQuestionSegment: (segment: 'Todos' | 'Discentes' | 'Docentes' | 'TAEs') => void;
  drawerQuestions: ReportQuestion[];
  onClose: () => void;
}

export const DimensionDrawer: React.FC<DimensionDrawerProps> = ({
  dimension,
  campaignHasResponses,
  activeQuestionSegment,
  setActiveQuestionSegment,
  drawerQuestions,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {dimension && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 max-w-full flex pl-10"
            >
              <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-white rounded-lg shadow-xs border border-slate-200">
                      {getCategoryIcon(dimension.dimension)}
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        {dimension.dimension}
                      </h2>
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider mt-0.5 ${
                          dimension.classification === 'Sem respostas' || !campaignHasResponses
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : dimension.classification === 'Potencialidade'
                            ? 'bg-emerald-100 text-[#006837]'
                            : dimension.classification === 'Mediana'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {dimension.classification === 'Sem respostas' || !campaignHasResponses
                          ? 'Sem respostas'
                          : `${dimension.classification} (${dimension.potencialidadePct}%)`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="text-xs font-extrabold text-slate-600">
                      Segmento:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                      {(['Todos', 'Discentes', 'Docentes', 'TAEs'] as const).map((seg) => (
                        <button
                          key={seg}
                          onClick={() => setActiveQuestionSegment(seg)}
                          className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            activeQuestionSegment === seg
                              ? 'bg-white text-[#006837] shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {seg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Perguntas desta dimensão ({drawerQuestions.length})
                    </h3>

                    {drawerQuestions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                        Nenhuma pergunta encontrada para este segmento nesta área.
                      </div>
                    ) : (
                      drawerQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="p-3 border border-slate-200 rounded-xl space-y-2 bg-white"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-800 leading-snug">
                              {q.questionText}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                                q.totalAnswers === 0 || q.classification === 'Sem respostas'
                                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                  : 'bg-emerald-50 text-[#006837] border border-emerald-200 font-black'
                              }`}
                            >
                              {q.totalAnswers === 0 || q.classification === 'Sem respostas'
                                ? 'Sem respostas'
                                : `${q.approvalRate}%`}
                            </span>
                          </div>

                          {q.totalAnswers === 0 || !campaignHasResponses ? (
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 text-center font-medium">
                              📋 Sem respostas registradas para esta pergunta.
                            </div>
                          ) : (
                            <div className="space-y-1 pt-1">
                              {q.alternatives.map((alt, idx) => (
                                <div key={idx} className="space-y-0.5">
                                  <div className="flex justify-between text-[10px] text-slate-600">
                                    <span>{alt.option}</span>
                                    <span className="font-bold">{alt.percentage}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${alt.percentage}%` }}
                                      className={`h-full rounded-full ${
                                        idx === 0 ? 'bg-[#006837]' : idx === 1 ? 'bg-amber-400' : 'bg-rose-500'
                                      }`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
