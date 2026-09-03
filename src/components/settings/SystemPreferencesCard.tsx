import { Building2 } from "lucide-react";

import { SettingsSelect } from "./SettingsSelect";

interface SystemPreferencesCardProps {
  systemName: string;
  defaultCampus: string;
  currentAcademicPeriod: string;
  onSystemNameChange: (value: string) => void;
  onDefaultCampusChange: (value: string) => void;
  onCurrentAcademicPeriodChange: (value: string) => void;
}

const campusOptions = [
  {
    value: "Campus Tauá",
    label: "IFCE • Campus Tauá",
  },
  {
    value: "Campus Crateús",
    label: "IFCE • Campus Crateús",
  },
  {
    value: "Campus Canindé",
    label: "IFCE • Campus Canindé",
  },
  {
    value: "Campus Iguatu",
    label: "IFCE • Campus Iguatu",
  },
  {
    value: "Campus Cedro",
    label: "IFCE • Campus Cedro",
  },
  {
    value: "Reitoria",
    label: "IFCE • Reitoria Geral",
  },
];

const academicPeriodOptions = [
  {
    value: "2025.2",
    label: "2025.2 (Próximo Semestre)",
  },
  {
    value: "2025.1",
    label: "2025.1 (Semestre Vigente)",
  },
  {
    value: "2024.2",
    label: "2024.2 (Semestre Anterior)",
  },
  {
    value: "2024.1",
    label: "2024.1 (Histórico)",
  },
];

export function SystemPreferencesCard({
  systemName,
  defaultCampus,
  currentAcademicPeriod,
  onSystemNameChange,
  onDefaultCampusChange,
  onCurrentAcademicPeriodChange,
}: SystemPreferencesCardProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="p-1.5 bg-emerald-50 text-[#006837] rounded-lg">
            <Building2 className="w-4 h-4" />
          </div>

          <div>
            <h2 className="text-xs font-black text-slate-900 tracking-tight">
              Preferências do Sistema
            </h2>

            <p className="text-[10px] text-slate-400 font-medium">
              Parâmetros institucionais e contexto acadêmico padrão
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 block">
            Nome do Sistema / Instituição
          </label>

          <input
            type="text"
            value={systemName}
            onChange={(event) => onSystemNameChange(event.target.value)}
            className="w-full h-8 px-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all"
            placeholder="Nome do sistema"
            required
          />

          <p className="text-[10px] text-slate-400 font-medium">
            Exibido nos cabeçalhos, formulários e relatórios emitidos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">
              Campus Padrão
            </label>

            <SettingsSelect
              value={defaultCampus}
              options={campusOptions}
              onChange={onDefaultCampusChange}
              ariaLabel="Selecionar campus padrão"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">
              Ano / Período Atual
            </label>

            <SettingsSelect
              value={currentAcademicPeriod}
              options={academicPeriodOptions}
              onChange={onCurrentAcademicPeriodChange}
              ariaLabel="Selecionar período acadêmico atual"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>Identificador Institucional: IFCE-CPA-TAU</span>

        <span className="text-[#006837] font-bold">Ativo</span>
      </div>
    </div>
  );
}
