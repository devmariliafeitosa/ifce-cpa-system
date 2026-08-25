import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Calendar } from 'lucide-react';
import { SmartForm } from '../../../types';
import { NavTabId } from '../../../components/Sidebar';

/* Modal de detalhes rápidos de uma campanha, aberto a partir do card "Campanha em
 * andamento". Extraído de DashboardView.tsx. */

interface CampaignQuickDetailModalProps {
  campaign: SmartForm | null;
  onClose: () => void;
  onNavigateTab: (tab: NavTabId) => void;
}

export const CampaignQuickDetailModal: React.FC<CampaignQuickDetailModalProps> = ({
  campaign,
  onClose,
  onNavigateTab,
}) => {
  return (
    <AnimatePresence>
      {campaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-xl space-y-4 relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-[#006837] rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {campaign.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {campaign.campus || 'Campus Tauá'} • Status: {campaign.status || 'Ativa'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Vigência</span>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    {campaign.periodo || '15/09/2026 — 30/09/2026'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Respostas Consolidadas</span>
                  <span className="font-extrabold text-[#006837] block mt-0.5">
                    {(campaign.responsesCount?.total || 0).toLocaleString('pt-BR')} respostas
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed px-1">
                {campaign.description || 'Questionário institucional destinado à coleta de dados e percepções de discentes, docentes e técnicos sobre as condições de ensino, infraestrutura e gestão.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('formularios');
                }}
                className="px-4 py-2 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>Gerenciar Questionário</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
