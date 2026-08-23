import React from 'react';
import { FileText, PieChart, Building2, HelpCircle } from 'lucide-react';

/* Trilho de navegação flutuante (lateral direita) com atalhos para cada seção do
 * relatório. Extraído de ReportsView.tsx. */

interface QuickNavRailProps {
  activeNavSection: 'resumo' | 'indicadores' | 'areas' | 'perguntas';
  scrollToSection: (sectionId: string) => void;
}

const NAV_ITEMS: { id: 'resumo' | 'indicadores' | 'areas' | 'perguntas'; label: string; icon: React.ElementType }[] = [
  { id: 'resumo', label: 'Resumo', icon: FileText },
  { id: 'indicadores', label: 'Indicadores', icon: PieChart },
  { id: 'areas', label: 'Áreas', icon: Building2 },
  { id: 'perguntas', label: 'Perguntas', icon: HelpCircle },
];

export const QuickNavRail: React.FC<QuickNavRailProps> = ({ activeNavSection, scrollToSection }) => {
  return (
    <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 bg-white/95 backdrop-blur-md border border-slate-200 p-2 rounded-2xl shadow-lg">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          title={label}
          className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
            activeNavSection === id
              ? 'bg-[#006837] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white text-slate-800 border border-slate-200 shadow-md text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
};
