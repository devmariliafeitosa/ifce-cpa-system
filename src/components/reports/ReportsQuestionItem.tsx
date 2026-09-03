import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
} from "lucide-react";

import type { ReportQuestion } from "../../data/reportsData";

interface ReportsQuestionItemProps {
  question: ReportQuestion;
  index: number;
  campaignTotalResponses: number;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenDetails: () => void;
}

export function ReportsQuestionItem({
  question,
  index,
  campaignTotalResponses,
  isExpanded,
  onToggle,
  onOpenDetails,
}: ReportsQuestionItemProps) {
  const isNoResponses =
    question.totalAnswers === 0 ||
    campaignTotalResponses === 0 ||
    question.classification === "Sem respostas";

  return (
    <div
      className={`border rounded-lg transition-all bg-white overflow-hidden ${
        isExpanded
          ? "border-[#006837] ring-1 ring-[#006837]/20 shadow-2xs"
          : "border-slate-200/80 hover:border-slate-300"
      }`}
    >
      <div
        onClick={onToggle}
        className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
          <span className="text-[10px] font-black text-slate-400 shrink-0 w-6">
            #{String(index + 1).padStart(2, "0")}
          </span>

          <div className="min-w-0 space-y-0.5 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-md">
                {question.category}
              </span>

              <span className="text-[9px] font-semibold text-slate-400">
                {question.segment}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
              {question.questionText}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {isNoResponses ? (
            <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
              SEM RESPOSTAS
            </span>
          ) : (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold whitespace-nowrap ${
                question.classification === "Potencialidade"
                  ? "bg-emerald-50 text-[#006837] border border-emerald-200"
                  : question.classification === "Mediana"
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {question.classification} • {question.approvalRate}%
            </span>
          )}

          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              isExpanded
                ? "bg-[#006837] text-white"
                : "bg-slate-100 hover:bg-emerald-50 hover:text-[#006837] text-slate-700"
            }`}
          >
            <span>{isExpanded ? "Fechar" : "Ver detalhes"}</span>

            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-slate-50/50 p-3.5 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white border border-slate-200/80 rounded-lg">
              <div>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {question.questionText}
                </p>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                  <span>
                    Área:{" "}
                    <strong className="text-slate-800">
                      {question.category}
                    </strong>
                  </span>

                  <span>•</span>

                  <span>
                    Segmento:{" "}
                    <strong className="text-slate-800">
                      {question.segment}
                    </strong>
                  </span>

                  <span>•</span>

                  <span>
                    Respostas:{" "}
                    <strong className="text-[#006837]">
                      {question.totalAnswers}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                {isNoResponses ? (
                  <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                    SEM RESPOSTAS
                  </span>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 block">
                      Satisfação alta:{" "}
                      <strong className="text-base font-black text-[#006837]">
                        {question.approvalRate}%
                      </strong>
                    </span>

                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006837]">
                      {question.classification}
                    </span>
                  </div>
                )}

                <button
                  onClick={onOpenDetails}
                  title="Abrir em modal completo"
                  className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-[#006837] rounded-lg transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isNoResponses ? (
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-center text-xs text-slate-500 font-medium">
                📋 Ainda não existem respostas registradas para esta
                pergunta.
              </div>
            ) : (
              <div className="space-y-1.5 bg-white p-3 border border-slate-200/80 rounded-lg">
                <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Distribuição de Respostas
                </h5>

                <div className="space-y-1.5 pt-1">
                  {question.alternatives.map((alternative, alternativeIndex) => (
                    <div
                      key={alternativeIndex}
                      className="space-y-0.5"
                    >
                      <div className="flex justify-between text-xs text-slate-700 font-medium">
                        <span>{alternative.option}</span>

                        <span className="font-bold text-slate-900">
                          {alternative.count} respostas (
                          {alternative.percentage}%)
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${alternative.percentage}%`,
                          }}
                          className={`h-full rounded-full transition-all ${
                            alternativeIndex === 0
                              ? "bg-[#006837]"
                              : alternativeIndex === 1
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}