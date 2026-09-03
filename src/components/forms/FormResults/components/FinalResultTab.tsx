import { Award } from 'lucide-react';
import React from 'react';
import type { CpaFinalResult, CpaSegmentResult } from '../utils/cpaMethodology';
import { CpaResultBadge } from './CpaResultBadge';

export interface ConsolidatedFinalRow {
  questionId: string;
  questionTitle: string;
  category: string;
  alunosResult: CpaSegmentResult;
  docentesResult: CpaSegmentResult;
  taesResult: CpaSegmentResult;
  finalResult: CpaFinalResult;
  alunosPct: number;
  docentesPct: number;
  taesPct: number;
}

interface FinalResultTabProps {
  consolidatedFinalRows: ConsolidatedFinalRow[];
}

export const FinalResultTab: React.FC<FinalResultTabProps> = ({ consolidatedFinalRows }) => {
  return (
        <div className="space-y-4">
          {/* CPA Rules Methodology Reference Box */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 text-xs border border-slate-800">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Regras de Combinação da CPA – Resultado Final Unificado
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Consolidação Multi-Segmento</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-center">
                <span className="block font-bold text-emerald-400">P + P</span>
                <span className="text-[10px] text-slate-300">Potencialidade</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/30 text-center">
                <span className="block font-bold text-rose-400">F + F</span>
                <span className="text-[10px] text-slate-300">Fragilidade</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-center">
                <span className="block font-bold text-purple-400">P + F</span>
                <span className="text-[10px] text-slate-300">Controvérsia</span>
              </div>
              <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-500/30 text-center">
                <span className="block font-bold text-sky-400">M + P</span>
                <span className="text-[10px] text-slate-300">Tend. Potencialidade</span>
              </div>
              <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-500/30 text-center">
                <span className="block font-bold text-orange-400">M + F</span>
                <span className="text-[10px] text-slate-300">Tend. Fragilidade</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/30 text-center">
                <span className="block font-bold text-amber-400">M + M</span>
                <span className="text-[10px] text-slate-300">Avaliação Mediana</span>
              </div>
            </div>
          </div>

          {/* Final Spreadsheet Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3 border-r border-slate-200 min-w-280px">Pergunta</th>
                    <th className="p-3 border-r border-slate-200">Categoria</th>
                    <th className="p-3 border-r border-slate-200 text-center">Alunos (Discentes)</th>
                    <th className="p-3 border-r border-slate-200 text-center">Docentes</th>
                    <th className="p-3 border-r border-slate-200 text-center">TAEs</th>
                    <th className="p-3 text-center">Resultado Final CPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {consolidatedFinalRows.map((row, idx) => (
                    <tr
                      key={row.questionId}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}
                    >
                      <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 max-w-[320px]">
                        {row.questionTitle}
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                          {row.category}
                        </span>
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center"><CpaResultBadge result={row.alunosResult} /></td>
                      <td className="p-3 border-r border-slate-200 text-center"><CpaResultBadge result={row.docentesResult} /></td>
                      <td className="p-3 border-r border-slate-200 text-center"><CpaResultBadge result={row.taesResult} /></td>
                      <td className="p-3 text-center bg-slate-50/80"><CpaResultBadge result={row.finalResult} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  );
};
