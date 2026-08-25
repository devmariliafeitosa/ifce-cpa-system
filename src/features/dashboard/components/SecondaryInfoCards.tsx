import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, FolderOpen, Calendar, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
import { SmartForm } from '../../../types';
import { NavTabId } from '../../../components/Sidebar';

/* Seção "Informações Complementares e Histórico" — 3 cards expansíveis
 * (Google Forms, histórico de questionários, calendário CPA).
 * Extraído de DashboardView.tsx. */

interface SecondaryInfoCardsProps {
  openSecondary: Record<string, boolean>;
  toggleSecondary: (key: string) => void;
  lastUpdateTime: string;
  smartForms: SmartForm[];
  onNavigateTab: (tab: NavTabId) => void;
}

export const SecondaryInfoCards: React.FC<SecondaryInfoCardsProps> = ({
  openSecondary,
  toggleSecondary,
  lastUpdateTime,
  smartForms,
  onNavigateTab,
}) => {
  return (
    <section id="sec-informacoes-secundarias" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-900 tracking-tight">
          Informações Complementares e Histórico
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          Clique nos cards para expandir detalhes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card Secundário 1: Integração Google Forms & Sincronização */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs transition-all">
          <button
            onClick={() => toggleSecondary('syncGoogleForms')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-extrabold text-slate-900 truncate">
                  Google Forms & Sincronização
                </h3>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  Integração ativa • Sincronizado
                </p>
              </div>
            </div>
            <div className="text-slate-400 shrink-0 ml-2">
              {openSecondary.syncGoogleForms ? (
                <ChevronUp className="w-4 h-4 text-[#006837]" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {openSecondary.syncGoogleForms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Status da Conexão:</span>
                    <span className="font-bold text-[#006837] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Ativa & Operacional
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Última Sincronização:</span>
                    <span className="font-bold text-slate-800">{lastUpdateTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Importação Automática:</span>
                    <span className="font-bold text-slate-800">Habilitada (Planilhas Google)</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('google-forms')}
                  className="w-full h-8 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Gerenciar Conexão Google Forms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Secundário 2: Histórico Recente de Questionários */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs transition-all">
          <button
            onClick={() => toggleSecondary('historicoQuestionarios')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-extrabold text-slate-900 truncate">
                  Histórico de Questionários
                </h3>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {smartForms.length} questionários registrados
                </p>
              </div>
            </div>
            <div className="text-slate-400 shrink-0 ml-2">
              {openSecondary.historicoQuestionarios ? (
                <ChevronUp className="w-4 h-4 text-[#006837]" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {openSecondary.historicoQuestionarios && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 bg-slate-50/50 p-3.5 space-y-2 text-xs"
              >
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {smartForms.slice(0, 4).map((form) => (
                    <div
                      key={form.id}
                      className="bg-white p-2 rounded-lg border border-slate-200/80 flex items-center justify-between text-[11px]"
                    >
                      <div className="truncate mr-2">
                        <span className="font-bold text-slate-800 block truncate">{form.title}</span>
                        <span className="text-[10px] text-slate-400">{form.responsesCount?.total || 0} respostas</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {form.status || 'Ativo'}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigateTab('formularios')}
                  className="w-full h-8 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Ver Todos os Questionários</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Secundário 3: Calendário e Ciclos da CPA */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs transition-all">
          <button
            onClick={() => toggleSecondary('calendarioCpa')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-lg shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-extrabold text-slate-900 truncate">
                  Ciclo & Calendário CPA
                </h3>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  Ciclo Trienal 2024–2026
                </p>
              </div>
            </div>
            <div className="text-slate-400 shrink-0 ml-2">
              {openSecondary.calendarioCpa ? (
                <ChevronUp className="w-4 h-4 text-[#006837]" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {openSecondary.calendarioCpa && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 text-xs"
              >
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Campanha Vigente:</span>
                    <span className="font-bold text-slate-800">Autoavaliação 2026.2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Fechamento do Relatório:</span>
                    <span className="font-bold text-slate-800">Outubro/2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Envio ao MEC/INEP:</span>
                    <span className="font-bold text-slate-800">Novembro/2026</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('relatorios')}
                  className="w-full h-8 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Consultar Relatórios Anteriores</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
