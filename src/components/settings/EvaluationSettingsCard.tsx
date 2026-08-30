import { Sliders } from "lucide-react";

interface EvaluationSettingsCardProps {
  defaultDuration: string;
  allowAnonymous: boolean;
  requireIdentification: boolean;
  singleResponsePerUser: boolean;
  onDefaultDurationChange: (value: string) => void;
  onAllowAnonymousChange: (value: boolean) => void;
  onRequireIdentificationChange: (value: boolean) => void;
  onSingleResponsePerUserChange: (value: boolean) => void;
}

export function EvaluationSettingsCard({
  defaultDuration,
  allowAnonymous,
  requireIdentification,
  singleResponsePerUser,
  onDefaultDurationChange,
  onAllowAnonymousChange,
  onRequireIdentificationChange,
  onSingleResponsePerUserChange,
}: EvaluationSettingsCardProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>

          <div>
            <h2 className="text-xs font-black text-slate-900 tracking-tight">
              Configurações das Avaliações
            </h2>

            <p className="text-[10px] text-slate-400 font-medium">
              Regras e diretrizes para aplicação de questionários
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <span>Duração Padrão das Campanhas</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Prazo de preenchimento
            </span>
          </label>

          <select
            value={defaultDuration}
            onChange={(e) => onDefaultDurationChange(e.target.value)}
            className="w-full h-8 px-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
          >
            <option value="15">15 dias corridos</option>
            <option value="30">30 dias corridos (Recomendado pela CPA)</option>
            <option value="45">45 dias corridos</option>
            <option value="60">60 dias corridos (Ciclo estendido)</option>
          </select>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
            <div>
              <span className="text-[11px] font-bold text-slate-800 block">
                Permitir respostas anônimas
              </span>

              <span className="text-[10px] text-slate-500 font-medium block">
                Garante sigilo do respondente nos relatórios públicos
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAllowAnonymousChange(!allowAnonymous)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                allowAnonymous ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                  allowAnonymous ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
            <div>
              <span className="text-[11px] font-bold text-slate-800 block">
                Exigir identificação de participante
              </span>

              <span className="text-[10px] text-slate-500 font-medium block">
                Valida matrícula ou e-mail institucional @ifce.edu.br
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                onRequireIdentificationChange(!requireIdentification)
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                requireIdentification ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                  requireIdentification ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
            <div>
              <span className="text-[11px] font-bold text-slate-800 block">
                Permitir apenas uma resposta por participante
              </span>

              <span className="text-[10px] text-slate-500 font-medium block">
                Impede envios duplicados no mesmo ciclo avaliativo
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                onSingleResponsePerUserChange(!singleResponsePerUser)
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                singleResponsePerUser ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                  singleResponsePerUser ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
