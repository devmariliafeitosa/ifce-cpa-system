import { Eye, Layers } from "lucide-react";

import type { ReactNode } from "react";

import type {
  ReportCampaignData,
  ReportDimensionResult,
} from "../../data/reportsData";

interface ReportsAreasProps {
  campaign: ReportCampaignData;
  selectedDimension: string;
  onShowAll: () => void;
  onSelectArea: (dimension: string) => void;
  onOpenArea: (dimension: ReportDimensionResult) => void;
  getCategoryIcon: (category: string) => ReactNode;
}

export function ReportsAreas({
  campaign,
  selectedDimension,
  onShowAll,
  onSelectArea,
  onOpenArea,
  getCategoryIcon,
}: ReportsAreasProps) {
  return (
    <section id="sec-areas" className="scroll-mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Resultados por Área Avaliada
          </h2>

          <p className="text-[10px] text-slate-500 font-medium">
            Selecione uma área para filtrar as perguntas abaixo
          </p>
        </div>

        {selectedDimension !== "todas" && (
          <button
            onClick={onShowAll}
            className="text-xs font-bold text-[#006837] hover:underline cursor-pointer"
          >
            Exibir Todas as Áreas
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
        <div
          onClick={() => onSelectArea("todas")}
          className={`bg-white border rounded-xl px-3 py-2 h-[82px] transition-all flex flex-col justify-between relative cursor-pointer ${
            selectedDimension === "todas"
              ? "border-[#006837] ring-2 ring-[#006837]/20 shadow-2xs bg-emerald-50/20"
              : "border-slate-200/90 hover:border-slate-300 hover:shadow-2xs"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-emerald-100 text-[#006837] rounded-md flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>

            <h3 className="text-xs font-extrabold text-slate-900 truncate">
              Todas as Áreas
            </h3>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-bold text-slate-500">
              {campaign.totalQuestions} perguntas
            </span>

            <span className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase bg-emerald-100 text-[#006837]">
              Visão Geral
            </span>
          </div>
        </div>

        {campaign.dimensions.map((dimension) => {
          const isSelected = selectedDimension === dimension.dimension;
          const isNoResponses = campaign.totalResponses === 0;

          return (
            <div
              key={dimension.dimension}
              onClick={() =>
                onSelectArea(
                  isSelected ? "todas" : dimension.dimension,
                )
              }
              className={`bg-white border rounded-xl px-3 py-2 h-[82px] transition-all flex flex-col justify-between relative cursor-pointer ${
                isSelected
                  ? "border-[#006837] ring-2 ring-[#006837]/20 shadow-2xs bg-emerald-50/20"
                  : "border-slate-200/90 hover:border-slate-300 hover:shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="p-1 bg-slate-100 rounded-md flex-shrink-0">
                    {getCategoryIcon(dimension.dimension)}
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-900 truncate">
                    {dimension.dimension}
                  </h3>
                </div>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenArea(dimension);
                  }}
                  title="Ver Detalhes da Área"
                  className="p-1 hover:bg-emerald-100 text-[#006837] rounded-md transition-colors cursor-pointer flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                {isNoResponses ? (
                  <>
                    <span className="text-[10px] font-medium text-slate-400">
                      Status:
                    </span>

                    <span className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      Sem respostas
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base font-black text-slate-900 tracking-tight">
                      {dimension.potencialidadePct}%
                    </span>

                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                        dimension.classification === "Potencialidade"
                          ? "bg-emerald-100 text-[#006837]"
                          : dimension.classification === "Mediana"
                            ? "bg-amber-100 text-amber-800"
                            : dimension.classification === "Fragilidade"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {dimension.classification}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}