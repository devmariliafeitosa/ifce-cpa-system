import React from 'react';
import type { SmartForm } from '../../../../types';
import { classifyAnswer } from '../utils/cpaMethodology';

export interface ParticipantResponseRow {
  id: string;
  formId: string;
  campus: string;
  segment: string;
  respondentName: string;
  respondentEmail: string;
  date: string;
  answers: Record<string, string | number | undefined>;
}

interface ResponsesTabProps {
  selectedForm: SmartForm;
  rawResponses: ParticipantResponseRow[];
}

export const ResponsesTab: React.FC<ResponsesTabProps> = ({ selectedForm, rawResponses }) => {
  return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Respostas Individuais dos Participantes (Formato Planilha)
              </h3>
              <p className="text-xs text-slate-500">
                Cada linha representa o envio de um respondente identificado pelo e-mail institucional do IFCE.
              </p>
            </div>
            <span className="text-xs font-bold text-[#006837] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {rawResponses.length} registros encontrados
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 border-r border-slate-200">Respondente</th>
                  <th className="p-3 border-r border-slate-200">Segmento</th>
                  <th className="p-3 border-r border-slate-200">Campus</th>
                  <th className="p-3 border-r border-slate-200">Data</th>
                  {selectedForm.questions.slice(0, 4).map((q, idx) => (
                    <th key={q.id} className="p-3 border-r border-slate-200 max-w-150px truncate" title={q.title}>
                      P{idx + 1}: {q.title.slice(0, 20)}...
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rawResponses.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}>
                    <td className="p-3 font-semibold text-slate-900 border-r border-slate-200">
                      <div>{row.respondentName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{row.respondentEmail}</div>
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-emerald-50 text-[#006837] border border-emerald-200">
                        {row.segment}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 border-r border-slate-200 font-medium">{row.campus}</td>
                    <td className="p-3 text-slate-500 border-r border-slate-200">{row.date}</td>
                    {selectedForm.questions.slice(0, 4).map((q) => {
                      const val = row.answers[q.id] ?? '—';
                      const level = classifyAnswer(val);
                      const getLevelClassName = (lv: string): string => {
                        if (lv === 'Alto') return 'bg-emerald-50 text-emerald-800';
                        if (lv === 'Médio') return 'bg-amber-50 text-amber-800';
                        if (lv === 'Baixo') return 'bg-rose-50 text-rose-800';
                        return 'text-slate-400';
                      };
                      return (
                        <td key={q.id} className="p-3 border-r border-slate-200 font-medium">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${getLevelClassName(level)}`}
                          >
                            {String(val)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  );
};
