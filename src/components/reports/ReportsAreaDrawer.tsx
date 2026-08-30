import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ReportsCategoryIcon } from "./ReportsCategoryIcon";
import type {
  ReportDimensionResult,
  ReportQuestion,
} from "../../data/reportsData";

type QuestionSegment = "Todos" | "Discentes" | "Docentes" | "TAEs";

interface ReportsAreaDrawerProps {
  dimension: ReportDimensionResult | null;
  questions: ReportQuestion[];
  activeQuestionSegment: QuestionSegment;
  campaignTotalResponses?: number;
  onSegmentChange: (segment: QuestionSegment) => void;
  onClose: () => void;
}

export function ReportsAreaDrawer({
  dimension,
  questions,
  activeQuestionSegment,
  campaignTotalResponses,
  onSegmentChange,
  onClose,
}: ReportsAreaDrawerProps) {
  return (
    <AnimatePresence>
      {dimension && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed inset-y-0 right-0 max-w-full flex pl-10"
            >
              <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-white rounded-lg shadow-xs border border-slate-200">
                      <ReportsCategoryIcon category={dimension.dimension} />
                    </div>

                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        {dimension.dimension}
                      </h2>

                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider mt-0.5 ${
                          dimension.classification === "Sem respostas" ||
                          campaignTotalResponses === 0
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : dimension.classification === "Potencialidade"
                              ? "bg-emerald-100 text-[#006837]"
                              : dimension.classification === "Mediana"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {dimension.classification === "Sem respostas" ||
                        campaignTotalResponses === 0
                          ? "Sem respostas"
                          : `${dimension.classification} (${dimension.potencialidadePct}%)`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="text-xs font-extrabold text-slate-600">
                      Segmento:
                    </span>

                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                      {(
                        [
                          "Todos",
                          "Discentes",
                          "Docentes",
                          "TAEs",
                        ] as const
                      ).map((segment) => (
                        <button
                          key={segment}
                          onClick={() => onSegmentChange(segment)}
                          className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            activeQuestionSegment === segment
                              ? "bg-white text-[#006837] shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {segment}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Perguntas desta dimensão ({questions.length})
                    </h3>

                    {questions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                        Nenhuma pergunta encontrada para este segmento
                        nesta área.
                      </div>
                    ) : (
                      questions.map((question) => (
                        <div
                          key={question.id}
                          className="p-3 border border-slate-200 rounded-xl space-y-2 bg-white"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-800 leading-snug">
                              {question.questionText}
                            </h4>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                                question.totalAnswers === 0 ||
                                question.classification ===
                                  "Sem respostas"
                                  ? "bg-slate-100 text-slate-600 border border-slate-200"
                                  : "bg-emerald-50 text-[#006837] border border-emerald-200 font-black"
                              }`}
                            >
                              {question.totalAnswers === 0 ||
                              question.classification ===
                                "Sem respostas"
                                ? "Sem respostas"
                                : `${question.approvalRate}%`}
                            </span>
                          </div>

                          {question.totalAnswers === 0 ||
                          campaignTotalResponses === 0 ? (
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 text-center font-medium">
                              📋 Sem respostas registradas para esta
                              pergunta.
                            </div>
                          ) : (
                            <div className="space-y-1 pt-1">
                              {question.alternatives.map(
                                (alternative, index) => (
                                  <div
                                    key={index}
                                    className="space-y-0.5"
                                  >
                                    <div className="flex justify-between text-[10px] text-slate-600">
                                      <span>{alternative.option}</span>

                                      <span className="font-bold">
                                        {alternative.percentage}%
                                      </span>
                                    </div>

                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        style={{
                                          width: `${alternative.percentage}%`,
                                        }}
                                        className={`h-full rounded-full ${
                                          index === 0
                                            ? "bg-[#006837]"
                                            : index === 1
                                              ? "bg-amber-400"
                                              : "bg-rose-500"
                                        }`}
                                      />
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
