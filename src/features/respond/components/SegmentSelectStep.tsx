import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Briefcase, GraduationCap, UserCheck } from "lucide-react";

import type { ParticipantSegment, StudentLevel } from "../../../types";
import { SEGMENT_OPTIONS, STUDENT_LEVEL_OPTIONS } from "../utils/segment";

const SEGMENT_ICONS: Record<ParticipantSegment, React.ElementType> = {
  discente: GraduationCap,
  docente: UserCheck,
  tae: Briefcase,
};

interface SegmentSelectStepProps {
  suggestedSegment: ParticipantSegment | null;
  onBack: () => void;
  onContinue: (segment: ParticipantSegment, studentLevel?: Exclude<StudentLevel, "todos">) => void;
}

export const SegmentSelectStep: React.FC<SegmentSelectStepProps> = ({
  suggestedSegment,
  onBack,
  onContinue,
}) => {
  const [segment, setSegment] = useState<ParticipantSegment | null>(
    suggestedSegment
  );
  const [studentLevel, setStudentLevel] = useState<
    Exclude<StudentLevel, "todos"> | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!segment) {
      setError("Selecione uma das opções acima para continuar.");
      return;
    }
    if (segment === "discente" && !studentLevel) {
      setError("Selecione seu nível de ensino para continuar.");
      return;
    }
    setError(null);
    onContinue(segment, segment === "discente" ? studentLevel! : undefined);
  };

  return (
    <div className="p-6 sm:p-8 space-y-5">
      <div className="space-y-1">
        <h2 className="text-base font-extrabold text-slate-900">
          Qual é o seu vínculo com o IFCE?
        </h2>
        <p className="text-sm text-slate-500">
          Isso garante que você veja apenas as perguntas relevantes para o
          seu perfil.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SEGMENT_OPTIONS.map((option) => {
          const Icon = SEGMENT_ICONS[option.value];
          const isSelected = segment === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSegment(option.value);
                setStudentLevel(null);
                setError(null);
              }}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? "border-[#006837] bg-emerald-50 shadow-xs ring-1 ring-[#006837]"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isSelected
                    ? "bg-[#006837] text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {option.label}
                </p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {segment === "discente" && (
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-700">
            Nível de ensino
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STUDENT_LEVEL_OPTIONS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => {
                  setStudentLevel(level.value);
                  setError(null);
                }}
                className={`h-10 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  studentLevel === level.value
                    ? "bg-[#006837] text-white border-[#006837]"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-rose-600">{error}</p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="h-11 px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 h-11 bg-[#006837] hover:bg-[#00522b] text-white text-sm font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
