import React from 'react';
import { HelpCircle, Users, TrendingUp, Clock } from 'lucide-react';
import { ReportCampaignData } from '../../../data/reportsData';

/* Seção "Resumo da Campanha" — 4 indicadores compactos padronizados.
 * Extraído de ReportsView.tsx. */

interface ReportSummaryCardsProps {
  selectedCampaign: ReportCampaignData;
}

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({ selectedCampaign }) => {
  return (
    <section id="sec-resumo" className="scroll-mt-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Perguntas */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Perguntas
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {selectedCampaign.totalQuestions}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Itens no questionário
            </p>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Respondentes */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Respondentes
            </span>
            <span className="text-2xl font-black text-[#006837] tracking-tight leading-none mt-1 block">
              {selectedCampaign.totalResponses.toLocaleString('pt-BR')}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {selectedCampaign.totalResponses > 0 ? 'Participações validadas' : 'Nenhuma resposta'}
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-[#006837] rounded-xl shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Taxa de Resposta */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Taxa de Resposta
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {selectedCampaign.totalResponses > 0 ? `${selectedCampaign.responseRate}%` : '0%'}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {selectedCampaign.totalResponses > 0 ? 'Adesão da comunidade' : 'Sem respostas'}
            </p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Tempo Médio */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Tempo Médio
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {selectedCampaign.totalResponses > 0 ? selectedCampaign.avgResponseTime : '0 min'}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {selectedCampaign.totalResponses > 0 ? 'Duração média' : 'Sem dados'}
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
};
