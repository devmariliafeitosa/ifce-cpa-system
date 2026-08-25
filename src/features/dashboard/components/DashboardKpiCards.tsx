import React from 'react';
import { FileText, BarChart3, TrendingUp, Calendar } from 'lucide-react';

/* Grade de 4 indicadores principais do dashboard. Extraído de DashboardView.tsx. */

interface DashboardKpiCardsProps {
  activeFormsCount: number;
  totalResponses: number;
  overallParticipationRate: number;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({
  activeFormsCount,
  totalResponses,
  overallParticipationRate,
}) => {
  return (
    <section id="dashboard-indicadores-principais" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Indicador 1: Questionários Ativos */}
      <div
        id="metric-questionarios-ativos"
        className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between"
      >
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Questionários Ativos
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
            {activeFormsCount}
          </span>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Em andamento
          </p>
        </div>
        <div className="p-2.5 bg-emerald-50 text-[#006837] rounded-xl shrink-0">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      {/* Indicador 2: Respostas Recebidas */}
      <div
        id="metric-respostas-recebidas"
        className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between"
      >
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Respostas Recebidas
          </span>
          <span className="text-2xl font-black text-[#006837] tracking-tight leading-none mt-1 block">
            {totalResponses.toLocaleString('pt-BR')}
          </span>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Consolidadas no sistema
          </p>
        </div>
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>

      {/* Indicador 3: Taxa Média de Participação */}
      <div
        id="metric-taxa-participacao"
        className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between"
      >
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Taxa Média de Participação
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
            {totalResponses > 0 ? `${overallParticipationRate}%` : '0%'}
          </span>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Adesão institucional
          </p>
        </div>
        <div className="p-2.5 bg-emerald-50 text-[#006837] rounded-xl shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Indicador 4: Campanhas em Andamento */}
      <div
        id="metric-campanhas-andamento"
        className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between"
      >
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Campanhas em Andamento
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
            {activeFormsCount}
          </span>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Ciclos avaliativos abertos
          </p>
        </div>
        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
};
