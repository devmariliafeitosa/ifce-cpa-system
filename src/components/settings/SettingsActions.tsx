import { Info, Save } from "lucide-react";

interface SettingsActionsProps {
  isSaving: boolean;
}

export function SettingsActions({ isSaving }: SettingsActionsProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Info className="w-4 h-4 text-[#006837] shrink-0" />

        <span>
          As alterações efetuadas serão aplicadas imediatamente a todas as
          sessões da CPA do Campus Tauá.
        </span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="h-8 px-4 bg-[#006837] hover:bg-[#00522b] text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
        >
          <Save className="w-3.5 h-3.5" />

          <span>{isSaving ? "Salvando..." : "Salvar Alterações"}</span>
        </button>
      </div>
    </div>
  );
}
