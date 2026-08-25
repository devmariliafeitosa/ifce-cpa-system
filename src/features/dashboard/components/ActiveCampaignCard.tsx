import React from 'react';
import { Calendar, Eye, ChevronRight, PlusCircle } from 'lucide-react';
import { SmartForm } from '../../../types';
import { NavTabId } from '../../../components/Sidebar';

/* Seção "Campanha em andamento" — resumo da campanha ativa mais recente.
 * Extraído de DashboardView.tsx. */

interface ActiveCampaignCardProps {
  activeCampaign: SmartForm | undefined;
  activeCampaignResponses: number;
  activeCampaignRate: string;
  setSelectedCampaignDetail: (form: SmartForm) => void;
  onNavigateTab: (tab: NavTabId) => void;
}

export const ActiveCampaignCard: React.FC<ActiveCampaignCardProps> = ({
  activeCampaign,
  activeCampaignResponses,
  activeCampaignRate,
  setSelectedCampaignDetail,
  onNavigateTab,
}) => {
  return (
    <section id="sec-campanha-ativa" className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 text-[#006837] rounded-md">
            <Calendar className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight">
            Campanha em andamento
          </h2>
        </div>
        {activeCampaign && (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006837] border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006837] animate-pulse" />
            ATIVA
          </span>
        )}
      </div>

      {activeCampaign ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3
                className="text-sm font-bold text-slate-900 hover:text-[#006837] transition-colors cursor-pointer"
                onClick={() => setSelectedCampaignDetail(activeCampaign)}
              >
                {activeCampaign.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {/* NOTA: 'segmentoTarget' não existe em SmartForm — no código original
                    a expressão sempre caía no fallback estático abaixo (undefined || fallback).
                    Comportamento preservado ao extrair. */}
                {activeCampaign.campus || 'Campus Tauá'} • Discentes, Docentes e TAEs
              </p>
            </div>
            <button
              onClick={() => setSelectedCampaignDetail(activeCampaign)}
              className="self-start sm:self-auto px-2.5 py-1 text-xs font-bold text-[#006837] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detalhes rápidos</span>
            </button>
          </div>

          {/* Métricas da Campanha em Grid 3x1 */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/70 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Período de Vigência</span>
              <span className="font-bold text-slate-800 text-[11px] block mt-0.5">
                {activeCampaign.periodo || '15/09/2026 — 30/09/2026'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Respostas</span>
              <span className="font-extrabold text-slate-900 text-[11px] block mt-0.5">
                {activeCampaignResponses.toLocaleString('pt-BR')} respostas
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Adesão</span>
              <span className="font-black text-[#006837] text-[11px] block mt-0.5">
                {activeCampaignRate}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => onNavigateTab('formularios')}
              className="h-8 px-3.5 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <span>Ver na Gestão de Questionários</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center space-y-2">
          <p className="text-xs text-slate-500 font-medium">
            Não há nenhuma campanha em andamento no momento.
          </p>
          <button
            onClick={() => onNavigateTab('novo-formulario')}
            className="px-3.5 py-1.5 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Criar Novo Questionário</span>
          </button>
        </div>
      )}
    </section>
  );
};
