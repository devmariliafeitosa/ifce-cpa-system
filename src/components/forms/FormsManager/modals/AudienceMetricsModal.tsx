import { BarChart2, X } from 'lucide-react';
import React from 'react';
import type { SmartForm } from '../../../../types';

interface AudienceMetricsModalProps {
  viewingMetricsForm: SmartForm | null;
  setViewingMetricsForm: (form: SmartForm | null) => void;
}

export const AudienceMetricsModal: React.FC<AudienceMetricsModalProps> = ({
  viewingMetricsForm,
  setViewingMetricsForm,
}) => {
  return (
    <>
      {/* MODAL 3: View Metrics by Target Audience Segment */}
      {viewingMetricsForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#006837]" />
                <h3 className="text-base font-bold text-slate-900">
                  Métricas por Público-Alvo • CPA Tauá
                </h3>
              </div>
              <button
                onClick={() => setViewingMetricsForm(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">{viewingMetricsForm.title}</h4>

              {/* Stat summary cards */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Total</p>
                  <p className="text-base font-bold text-slate-900">
                    {viewingMetricsForm.responsesCount.total}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-indigo-600 font-semibold uppercase">Alunos</p>
                  <p className="text-base font-bold text-indigo-900">
                    {viewingMetricsForm.responsesCount.alunos}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-700 font-semibold uppercase">Docentes</p>
                  <p className="text-base font-bold text-emerald-900">
                    {viewingMetricsForm.responsesCount.docentes}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-semibold uppercase">TAEs</p>
                  <p className="text-base font-bold text-amber-900">
                    {viewingMetricsForm.responsesCount.taes}
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Distribuição de Perguntas por Público
                </h5>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {viewingMetricsForm.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between gap-3"
                    >
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        #{idx + 1}. {q.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {q.audiences.includes('todos') ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Todos
                          </span>
                        ) : (
                          q.audiences.map((aud) => (
                            <span
                              key={aud}
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                aud === 'alunos'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : aud === 'docentes'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {aud === 'alunos' ? 'Alunos' : aud === 'docentes' ? 'Docentes' : 'TAEs'}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewingMetricsForm(null)}
                className="px-5 py-2 bg-[#006837] text-white text-xs font-semibold rounded-xl cursor-pointer"
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
