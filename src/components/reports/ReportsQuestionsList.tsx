import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ReportsCategoryIcon } from "./ReportsCategoryIcon";

import type { ReportQuestion } from "../../data/reportsData";
import { ReportsQuestionItem } from "./ReportsQuestionItem";

interface QuestionGroup {
  area: string;
  questions: ReportQuestion[];
  potCount: number;
  medCount: number;
  fragCount: number;
  semRespCount: number;
}

interface ReportsQuestionsListProps {
  groups: QuestionGroup[];
  expandedAreaNames: Record<string, boolean>;
  expandedQuestionIds: Record<string, boolean>;
  campaignTotalResponses: number;
  onExpandAll: (expand: boolean) => void;
  onToggleArea: (area: string) => void;
  onToggleQuestion: (questionId: string) => void;
  onOpenQuestionDetails: (question: ReportQuestion) => void;
}

export function ReportsQuestionsList({
  groups,
  expandedAreaNames,
  expandedQuestionIds,
  campaignTotalResponses,
  onExpandAll,
  onToggleArea,
  onToggleQuestion,
  onOpenQuestionDetails,
}: ReportsQuestionsListProps) {
  return (
    <>
      {groups.length > 0 && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
          <span>
            Agrupadas por área ({groups.length} áreas ativas)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExpandAll(true)}
              className="hover:text-[#006837] font-semibold cursor-pointer underline decoration-dotted"
            >
              Expandir todas
            </button>

            <span>•</span>

            <button
              onClick={() => onExpandAll(false)}
              className="hover:text-slate-700 font-semibold cursor-pointer underline decoration-dotted"
            >
              Recolher todas
            </button>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="text-slate-400 text-lg font-bold">
            Nenhuma pergunta encontrada
          </div>

          <p className="text-xs text-slate-500">
            Tente ajustar os filtros de segmento, área, classificação ou
            busca acima.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const isAreaExpanded =
              expandedAreaNames[group.area] !== false;

            return (
              <div
                key={group.area}
                className="border border-slate-200/90 rounded-xl bg-white overflow-hidden shadow-2xs"
              >
                <div
                  onClick={() => onToggleArea(group.area)}
                  className="px-3.5 py-2 bg-slate-50/80 hover:bg-slate-100/80 transition-colors flex flex-wrap items-center justify-between gap-2 cursor-pointer border-b border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <button className="p-0.5 text-slate-500 hover:text-slate-800 rounded-md">
                      {isAreaExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#006837]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white border border-slate-200 rounded-md shadow-2xs">
                        <ReportsCategoryIcon category={group.area} />
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                        {group.area}
                      </h3>

                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                        {group.questions.length}{" "}
                        {group.questions.length === 1
                          ? "pergunta"
                          : "perguntas"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {group.semRespCount > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        ● {group.semRespCount} sem respostas
                      </span>
                    )}

                    {group.potCount > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-[#006837] border border-emerald-200">
                        ● {group.potCount} Potencialidades
                      </span>
                    )}

                    {group.medCount > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        ● {group.medCount} Medianas
                      </span>
                    )}

                    {group.fragCount > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                        ● {group.fragCount} Fragilidades
                      </span>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isAreaExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-2 space-y-1.5 bg-slate-50/20"
                    >
                      {group.questions.map((question, index) => (
                        <ReportsQuestionItem
                          key={question.id}
                          question={question}
                          index={index}
                          campaignTotalResponses={
                            campaignTotalResponses
                          }
                          isExpanded={
                            !!expandedQuestionIds[question.id]
                          }
                          onToggle={() =>
                            onToggleQuestion(question.id)
                          }
                          onOpenDetails={() =>
                            onOpenQuestionDetails(question)
                          }
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}