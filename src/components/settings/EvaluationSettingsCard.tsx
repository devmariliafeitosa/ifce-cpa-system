import { Check, ChevronDown, Sliders } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const durationOptions = [
  {
    value: "15",
    label: "15 dias corridos",
  },
  {
    value: "30",
    label: "30 dias corridos (Recomendado pela CPA)",
  },
  {
    value: "45",
    label: "45 dias corridos",
  },
  {
    value: "60",
    label: "60 dias corridos (Ciclo estendido)",
  },
];

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
  const [isDurationOpen, setIsDurationOpen] = useState(false);

  const durationDropdownRef = useRef<HTMLDivElement>(null);

  const selectedDuration =
    durationOptions.find((option) => option.value === defaultDuration) ??
    durationOptions[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        durationDropdownRef.current &&
        !durationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDurationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Cabeçalho */}
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

        {/* Duração Padrão */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <span>Duração Padrão das Campanhas</span>

            <span className="text-[10px] text-slate-400 font-normal">
              Prazo de preenchimento
            </span>
          </label>

          {/* Dropdown Customizado */}
          <div ref={durationDropdownRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isDurationOpen}
              onClick={() => setIsDurationOpen((current) => !current)}
              className={`w-full h-8 px-2.5 bg-slate-50/70 border rounded-lg text-xs font-semibold text-slate-800 transition-all flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white ${
                isDurationOpen
                  ? "border-[#006837] ring-1 ring-[#006837]"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="truncate text-left">
                {selectedDuration.label}
              </span>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isDurationOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDurationOpen && (
              <div
                role="listbox"
                className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden p-1"
              >
                {durationOptions.map((option) => {
                  const isSelected = option.value === defaultDuration;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onDefaultDurationChange(option.value);
                        setIsDurationOpen(false);
                      }}
                      className={`w-full min-h-8 px-2.5 py-2 rounded-md text-left text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 text-[#006837] font-bold"
                          : "text-slate-700 font-medium hover:bg-slate-50"
                      }`}
                    >
                      <span>{option.label}</span>

                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Regras */}
        <div className="space-y-2.5 pt-1">
          {/* Respostas anônimas */}
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
              aria-pressed={allowAnonymous}
              onClick={() => onAllowAnonymousChange(!allowAnonymous)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                allowAnonymous ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 bg-white rounded-full transition-all absolute top-0.5 ${
                  allowAnonymous ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Identificação */}
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
              aria-pressed={requireIdentification}
              onClick={() =>
                onRequireIdentificationChange(!requireIdentification)
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                requireIdentification ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 bg-white rounded-full transition-all absolute top-0.5 ${
                  requireIdentification ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Uma resposta por participante */}
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
              aria-pressed={singleResponsePerUser}
              onClick={() =>
                onSingleResponsePerUserChange(!singleResponsePerUser)
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                singleResponsePerUser ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 bg-white rounded-full transition-all absolute top-0.5 ${
                  singleResponsePerUser ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>Metodologia SINAES / CPA IFCE</span>

        <span className="text-blue-600 font-bold">Conforme</span>
      </div>
    </div>
  );
}
