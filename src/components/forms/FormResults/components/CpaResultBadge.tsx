import React from 'react';
import type { CpaFinalResult, CpaSegmentResult } from '../utils/cpaMethodology';

interface CpaResultBadgeProps {
  result: CpaSegmentResult | CpaFinalResult;
}

export const CpaResultBadge: React.FC<CpaResultBadgeProps> = ({ result }) => {
    switch (result) {
      case 'Fragilidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            🟥 Fragilidade
          </span>
        );
      case 'Avaliação Mediana':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            🟨 Avaliação Mediana
          </span>
        );
      case 'Potencialidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-[#006837] border border-emerald-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            🟩 Potencialidade
          </span>
        );
      case 'Tendência de Fragilidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            🟧 Tendência de Fragilidade
          </span>
        );
      case 'Tendência de Potencialidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            🟦 Tendência de Potencialidade
          </span>
        );
      case 'Controvérsia':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            🟪 Controvérsia
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Sem Respostas
          </span>
        );
    }
  };
