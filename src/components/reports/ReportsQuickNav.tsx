import {
  Building2,
  FileText,
  HelpCircle,
  PieChart,
} from "lucide-react";

type NavSection = "resumo" | "indicadores" | "areas" | "perguntas";

interface ReportsQuickNavProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export function ReportsQuickNav({
  activeSection,
  onNavigate,
}: ReportsQuickNavProps) {
  return (
    <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 bg-white/95 backdrop-blur-md border border-slate-200 p-2 rounded-2xl shadow-lg">
      <button
        onClick={() => onNavigate("resumo")}
        title="Resumo Geral"
        className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
          activeSection === "resumo"
            ? "bg-[#006837] text-white shadow-xs"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
      >
        <FileText className="w-4 h-4" />

        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white text-slate-800 border border-slate-200 shadow-md text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Resumo
        </span>
      </button>

      <button
        onClick={() => onNavigate("indicadores")}
        title="Indicadores Gerais"
        className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
          activeSection === "indicadores"
            ? "bg-[#006837] text-white shadow-xs"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
      >
        <PieChart className="w-4 h-4" />

        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white text-slate-800 border border-slate-200 shadow-md text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Indicadores
        </span>
      </button>

      <button
        onClick={() => onNavigate("areas")}
        title="Resultados por Área"
        className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
          activeSection === "areas"
            ? "bg-[#006837] text-white shadow-xs"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
      >
        <Building2 className="w-4 h-4" />

        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white text-slate-800 border border-slate-200 shadow-md text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Áreas
        </span>
      </button>

      <button
        onClick={() => onNavigate("perguntas")}
        title="Perguntas da Área"
        className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
          activeSection === "perguntas"
            ? "bg-[#006837] text-white shadow-xs"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
      >
        <HelpCircle className="w-4 h-4" />

        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white text-slate-800 border border-slate-200 shadow-md text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Perguntas
        </span>
      </button>
    </div>
  );
}
