import { Sparkles } from 'lucide-react';
import React from 'react';
import type { CpaSegmentResult } from '../utils/cpaMethodology';
import { CpaResultBadge } from './CpaResultBadge';

export interface ConsolidatedSegmentRow {
  questionId: string;
  questionTitle: string;
  category: string;
  segmentKey: 'alunos' | 'docentes' | 'taes';
  segmentLabel: string;
  validCount: number;
  pctBaixo: number;
  pctMedio: number;
  pctAlto: number;
  result: CpaSegmentResult;
}

interface ConsolidationTabProps {
  consolidatedBySegment: ConsolidatedSegmentRow[];
}

export const ConsolidationTab: React.FC<ConsolidationTabProps> = ({ consolidatedBySegment }) => {
  return (
        <div className="space-y-4">
          {/* Legend Banner */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 text-xs border border-slate-800">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Metodologia CPA – Etapa 2: Intervalos de Nível de Satisfação (% Alto)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Cálculo Válido Exclui Opções Nulo/Inexistente</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/30 space-y-1">
                <span className="font-bold text-rose-400">0% a 49,99% → 🟥 Fragilidade</span>
                <p className="text-[11px] text-slate-300">Indica necessidade de intervenção imediata da gestão.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/30 space-y-1">
                <span className="font-bold text-amber-400">50% a 69,99% → 🟨 Avaliação Mediana</span>
                <p className="text-[11px] text-slate-300">Nível aceitável, necessitando de ações de aprimoramento.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-400">70% a 100% → 🟩 Potencialidade</span>
                <p className="text-[11px] text-slate-300">Ponto forte institucional e referência de boas práticas.</p>
              </div>
            </div>
          </div>

          {/* Spreadsheet Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3 border-r border-slate-200 min-w-280px">Pergunta</th>
                    <th className="p-3 border-r border-slate-200">Categoria</th>
                    <th className="p-3 border-r border-slate-200">Segmento</th>
                    <th className="p-3 border-r border-slate-200 text-center">Baixo</th>
                    <th className="p-3 border-r border-slate-200 text-center">Médio</th>
                    <th className="p-3 border-r border-slate-200 text-center">Alto</th>
                    <th className="p-3 border-r border-slate-200 text-center">% Alto</th>
                    <th className="p-3 text-center">Resultado CPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {consolidatedBySegment.map((row, idx) => (
                    <tr
                      key={`${row.questionId}-${row.segmentKey}`}
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
                      <td className="p-3 border-r border-slate-200 font-bold text-slate-800">
                        {row.segmentLabel}
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center font-mono text-slate-600">
                        {row.pctBaixo.toFixed(1)}%
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center font-mono text-slate-600">
                        {row.pctMedio.toFixed(1)}%
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center font-mono font-bold text-slate-900">
                        {row.pctAlto.toFixed(1)}%
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center font-mono font-bold text-[#006837] bg-emerald-50/50">
                        {row.pctAlto.toFixed(1)}%
                      </td>
                      <td className="p-3 text-center"><CpaResultBadge result={row.result} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  );
};
