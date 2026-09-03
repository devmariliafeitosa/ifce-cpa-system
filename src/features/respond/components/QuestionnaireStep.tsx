import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, SendHorizonal } from "lucide-react";

import type { FormParticipantAnswer, SmartForm, SmartQuestion } from "../../../types";

const SCALE_LABELS: Record<number, string> = {
  1: "Péssimo",
  2: "Ruim",
  3: "Mediano",
  4: "Bom",
  5: "Ótimo",
};

interface QuestionnaireStepProps {
  form: SmartForm;
  questions: SmartQuestion[];
  onBack: () => void;
  onSubmit: (answers: FormParticipantAnswer[]) => void;
  isSubmitting?: boolean;
}

type AnswerValue = string | string[];

export const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  form,
  questions,
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [missingIds, setMissingIds] = useState<string[]>([]);

  const setAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setMissingIds((prev) => prev.filter((id) => id !== questionId));
  };

  const toggleCheckboxOption = (questionId: string, option: string) => {
    const current = (answers[questionId] as string[] | undefined) ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswer(questionId, next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = questions
      .filter((q) => q.required)
      .filter((q) => {
        const value = answers[q.id];
        if (Array.isArray(value)) return value.length === 0;
        return !value || !value.toString().trim();
      })
      .map((q) => q.id);

    if (missing.length > 0) {
      setMissingIds(missing);
      document
        .getElementById(`q-${missing[0]}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload: FormParticipantAnswer[] = questions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => ({ questionId: q.id, value: answers[q.id] }));

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="p-6 sm:p-8 pb-4 space-y-1 border-b border-slate-100">
        <h2 className="text-base font-extrabold text-slate-900">
          {form.title}
        </h2>
        <p className="text-xs text-slate-500">
          Todas as perguntas são objetivas — não há campos de texto livre.
          {" "}Os campos marcados com{" "}
          <span className="text-rose-500 font-bold">*</span> são obrigatórios.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
        {questions.map((question, index) => {
          const isMissing = missingIds.includes(question.id);
          return (
            <div
              id={`q-${question.id}`}
              key={question.id}
              className={`space-y-2.5 pb-5 ${
                index < questions.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-slate-400 mt-0.5">
                  {index + 1}.
                </span>
                <p className="text-sm font-bold text-slate-800 leading-snug">
                  {question.title}
                  {question.required && (
                    <span className="text-rose-500 font-bold"> *</span>
                  )}
                </p>
              </div>
              {question.description && (
                <p className="text-xs text-slate-500 pl-5">
                  {question.description}
                </p>
              )}

              <div className="pl-5">
                {question.type === "SCALE" && (
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const selected = answers[question.id] === String(n);
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setAnswer(question.id, String(n))}
                          className={`flex flex-col items-center justify-center gap-1 h-16 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            selected
                              ? "bg-[#006837] text-white border-[#006837] shadow-xs"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <span className="text-base leading-none">{n}</span>
                          <span className="text-[9px] font-semibold leading-tight text-center px-0.5">
                            {SCALE_LABELS[n]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {question.type === "YES_NO" && (
                  <div className="grid grid-cols-2 gap-2">
                    {["Sim", "Não"].map((opt) => {
                      const selected = answers[question.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswer(question.id, opt)}
                          className={`h-10 rounded-lg text-sm font-bold border transition-all cursor-pointer ${
                            selected
                              ? "bg-[#006837] text-white border-[#006837]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {question.type === "RADIO" && (
                  <div className="space-y-1.5">
                    {(question.options ?? []).map((opt) => {
                      const selected = answers[question.id] === opt;
                      return (
                        <label
                          key={opt}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                            selected
                              ? "bg-emerald-50 border-[#006837] text-slate-900"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={selected}
                            onChange={() => setAnswer(question.id, opt)}
                            className="text-[#006837] focus:ring-[#006837]"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {question.type === "CHECKBOX" && (
                  <div className="space-y-1.5">
                    {(question.options ?? []).map((opt) => {
                      const current =
                        (answers[question.id] as string[] | undefined) ?? [];
                      const selected = current.includes(opt);
                      return (
                        <label
                          key={opt}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                            selected
                              ? "bg-emerald-50 border-[#006837] text-slate-900"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleCheckboxOption(question.id, opt)
                            }
                            className="accent-[#006837] w-4 h-4 rounded"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {question.type === "DROPDOWN" && (
                  <select
                    value={(answers[question.id] as string) ?? ""}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#006837] font-medium"
                  >
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    {(question.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {isMissing && (
                <p className="text-xs font-semibold text-rose-600 pl-5">
                  Esta pergunta é obrigatória.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 sm:p-8 pt-4 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-11 px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-11 bg-[#006837] hover:bg-[#00522b] text-white text-sm font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Enviar Respostas</span>
              <SendHorizonal className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
