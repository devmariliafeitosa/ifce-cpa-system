import { ReportsSelect } from "./ReportsSelect";
import { Filter, Search } from "lucide-react";

import type { ReportCampaignData } from "../../data/reportsData";

type QuestionSegment = "Todos" | "Discentes" | "Docentes" | "TAEs";

type ClassificationFilter =
  | "todas"
  | "Potencialidade"
  | "Mediana"
  | "Fragilidade"
  | "Sem respostas";

interface ReportsQuestionsToolbarProps {
  campaign: ReportCampaignData;
  selectedDimension: string;
  activeQuestionSegment: QuestionSegment;
  classificationFilter: ClassificationFilter;
  questionSearchTerm: string;
  filteredQuestionsCount: number;
  onSegmentChange: (segment: QuestionSegment) => void;
  onDimensionChange: (dimension: string) => void;
  onClassificationChange: (
    classification: ClassificationFilter,
  ) => void;
  onSearchChange: (term: string) => void;
}

export function ReportsQuestionsToolbar({
  campaign,
  selectedDimension,
  activeQuestionSegment,
  classificationFilter,
  questionSearchTerm,
  filteredQuestionsCount,
  onSegmentChange,
  onDimensionChange,
  onClassificationChange,
  onSearchChange,
}: ReportsQuestionsToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
      <div>
        <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
          Perguntas{" "}
          {selectedDimension !== "todas"
            ? `• ${selectedDimension}`
            : "• Todas as Áreas"}
        </h2>

        <p className="text-[10px] text-slate-500 font-medium">
          Exibindo {filteredQuestionsCount} perguntas filtradas
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          {(["Todos", "Discentes", "Docentes", "TAEs"] as const).map(
            (segment) => (
              <button
                key={segment}
                onClick={() => onSegmentChange(segment)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  activeQuestionSegment === segment
                    ? "bg-white text-[#006837] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {segment}
              </button>
            ),
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-lg px-2 py-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">
            Área:
          </span>

          <ReportsSelect
            value={selectedDimension}
            options={[
              {
                value: "todas",
                label: "Todas as Áreas",
              },
              ...campaign.dimensions.map((dimension) => ({
                value: dimension.dimension,
                label: dimension.dimension,
              })),
            ]}
            onChange={onDimensionChange}
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-lg px-2 py-1">
          <Filter className="w-3 h-3 text-[#006837]" />

          <ReportsSelect
            value={classificationFilter}
            options={[
              {
                value: "todas",
                label: "Todas as classificações",
              },
              {
                value: "Potencialidade",
                label: "Potencialidade (≥ 70%)",
              },
              {
                value: "Mediana",
                label: "Avaliação Mediana (50-69%)",
              },
              {
                value: "Fragilidade",
                label: "Fragilidade (< 50%)",
              },
              {
                value: "Sem respostas",
                label: "Sem respostas",
              },
            ]}
            onChange={(value) =>
              onClassificationChange(
                value as ClassificationFilter,
              )
            }
          />
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />

          <input
            type="text"
            value={questionSearchTerm}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Buscar pergunta..."
            className="w-36 sm:w-48 pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837]"
          />
        </div>
      </div>
    </div>
  );
}