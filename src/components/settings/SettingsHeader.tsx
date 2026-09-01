import { RotateCcw } from "lucide-react";

interface SettingsHeaderProps {
  onResetDefaults: () => void;
}

export function SettingsHeader({ onResetDefaults }: SettingsHeaderProps) {
  return (
    <div
      id="settings-header"
      className="bg-white border border-slate-200/90 rounded-xl px-4 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-700">
          Parâmetros & Preferências
        </span>

        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006837] text-[10px] font-extrabold border border-emerald-200">
          Painel Geral
        </span>
      </div>

      <button
        type="button"
        onClick={onResetDefaults}
        className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-center shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
        <span>Restaurar Padrões</span>
      </button>
    </div>
  );
}
