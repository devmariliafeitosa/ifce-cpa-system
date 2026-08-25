import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { NavTabId } from '../../../components/Sidebar';
import { EvaluatedArea } from './AreaPerformanceCard';

/* Modal de detalhes rápidos de uma área/dimensão avaliada, aberto a partir do card
 * "Desempenho geral por área". Extraído de DashboardView.tsx.
 * NOTA: 'selectedAreaDetail.description' não existe no objeto de área (o campo real é
 * 'desc') — no código original a expressão sempre caía no texto estático de fallback.
 * Comportamento preservado ao extrair (fallback fixo, sem acessar '.description'). */

interface AreaDetailModalProps {
  area: EvaluatedArea | null;
  onClose: () => void;
  onNavigateTab: (tab: NavTabId) => void;
}

export const AreaDetailModal: React.FC<AreaDetailModalProps> = ({ area, onClose, onNavigateTab }) => {
  return (
    <AnimatePresence>
      {area && (
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
                  {React.createElement(area.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {area.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Dimensão de Avaliação Institucional • CPA
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

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <p className="text-slate-600 font-medium leading-relaxed">
                Avaliação detalhada dos tópicos da dimensão institucional com base nas percepções de discentes, docentes e técnicos administrativos.
              </p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">Classificação Atual:</span>
                <span
                  className={`font-extrabold uppercase px-2.5 py-0.5 rounded-md text-[10px] ${
                    area.status === 'POTENCIALIDADE'
                      ? 'bg-emerald-100 text-[#006837] border border-emerald-200'
                      : area.status === 'AVALIAÇÃO MEDIANA'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : area.status === 'FRAGILIDADE'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {area.status}
                </span>
              </div>
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
                  onNavigateTab('relatorios');
                }}
                className="px-4 py-2 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>Abrir Relatório Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
