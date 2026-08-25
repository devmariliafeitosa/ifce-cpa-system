import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { NavTabId } from '../../../components/Sidebar';

/* Seção "Desempenho geral por área" — lista de 5 áreas + resumo de classificação.
 * Extraído de DashboardView.tsx. */

export interface EvaluatedArea {
  name: string;
  shortName: string;
  icon: React.ElementType;
  categoryKey: string;
  desc: string;
  status: 'POTENCIALIDADE' | 'AVALIAÇÃO MEDIANA' | 'FRAGILIDADE' | 'SEM RESPOSTAS';
  [key: string]: unknown;
}

export interface SituacaoGeral {
  potencialidades: number;
  medianas: number;
  fragilidades: number;
}

interface AreaPerformanceCardProps {
  evaluatedAreas: EvaluatedArea[];
  situacaoGeral: SituacaoGeral;
  setSelectedAreaDetail: (area: EvaluatedArea) => void;
  onNavigateTab: (tab: NavTabId) => void;
}

export const AreaPerformanceCard: React.FC<AreaPerformanceCardProps> = ({
  evaluatedAreas,
  situacaoGeral,
  setSelectedAreaDetail,
  onNavigateTab,
}) => {
  return (
    <section
      id="sec-desempenho-areas"
      className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3 flex-1 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-[#006837] rounded-md">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                Desempenho geral por área
              </h2>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('relatorios')}
            className="text-xs font-bold text-[#006837] hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>Ver relatórios</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Lista das 5 Áreas com clique para expansão inline/modal */}
        <div className="space-y-2 pt-2.5">
          {evaluatedAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.shortName}
                onClick={() => setSelectedAreaDetail(area)}
                className="bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 rounded-lg p-2.5 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-white border border-slate-200 rounded-md text-[#006837] group-hover:border-emerald-300 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#006837] transition-colors block truncate">
                      {area.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {area.desc}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md text-center ${
                      area.status === 'POTENCIALIDADE'
                        ? 'bg-emerald-100 text-[#006837] border border-emerald-200/80'
                        : area.status === 'AVALIAÇÃO MEDIANA'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200/80'
                        : area.status === 'FRAGILIDADE'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200/80'
                        : 'bg-slate-200/70 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {area.status}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006837] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo das Avaliações (Situação Geral) */}
      <div className="pt-3 border-t border-slate-100">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
          Resumo Geral das Avaliações
        </span>

        <div className="grid grid-cols-3 gap-2">
          {/* Potencialidades */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2 flex flex-col justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#006837]" />
              <span className="text-[10px] font-bold text-slate-700 truncate">Potencialidades</span>
            </div>
            <span className="text-base font-black text-[#006837] mt-1">
              {situacaoGeral.potencialidades}
            </span>
          </div>

          {/* Medianas */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 flex flex-col justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-slate-700 truncate">Medianas</span>
            </div>
            <span className="text-base font-black text-amber-600 mt-1">
              {situacaoGeral.medianas}
            </span>
          </div>

          {/* Fragilidades */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-lg p-2 flex flex-col justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-bold text-slate-700 truncate">Fragilidades</span>
            </div>
            <span className="text-base font-black text-rose-600 mt-1">
              {situacaoGeral.fragilidades}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
