import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export const SuccessStep: React.FC = () => {
  return (
    <div className="p-8 sm:p-10 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#006837] flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-extrabold text-slate-900">
          Resposta enviada com sucesso!
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          Obrigado por contribuir com a Avaliação Institucional do IFCE. Sua
          participação ajuda a comunidade acadêmica a orientar melhorias
          reais no campus.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#006837]" />
        <span>Sua resposta foi registrada de forma anônima.</span>
      </div>
    </div>
  );
};
