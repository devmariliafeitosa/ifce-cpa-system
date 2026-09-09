import React, { useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

import { isInstitutionalEmail } from "../utils/segment";

interface EmailIdentifyStepProps {
  onContinue: (email: string) => void;
  errorMessage?: string | null;
}

export const EmailIdentifyStep: React.FC<EmailIdentifyStepProps> = ({
  onContinue,
  errorMessage,
}) => {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setLocalError("Informe seu e-mail institucional para continuar.");
      return;
    }

    if (!isInstitutionalEmail(trimmed)) {
      setLocalError(
        "Utilize um e-mail institucional válido do IFCE (ex.: nome@aluno.ifce.edu.br)."
      );
      return;
    }

    setLocalError(null);
    onContinue(trimmed);
  };

  const shownError = localError || errorMessage;

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
      <div className="space-y-1.5">
        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#006837] flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </div>
        <h2 className="text-base font-extrabold text-slate-900 pt-1">
          Identifique-se com seu e-mail institucional
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          O e-mail é usado apenas para impedir respostas duplicadas nesta
          campanha. Suas respostas serão registradas de forma totalmente
          anônima, sem qualquer vínculo com sua identidade.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">
          E-mail institucional
        </label>
        <input
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@aluno.ifce.edu.br"
          className="w-full h-11 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837] focus:border-[#006837] font-medium"
        />
        {shownError && (
          <p className="text-xs font-semibold text-rose-600 pt-0.5">
            {shownError}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
        <ShieldCheck className="w-4 h-4 text-[#006837] shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Conforme a Política de Anonimato da CPA, o sistema dissocia
          automaticamente sua resposta da sua identidade antes de qualquer
          análise ou relatório.
        </p>
      </div>

      <button
        type="submit"
        className="w-full h-11 bg-[#006837] hover:bg-[#00522b] text-white text-sm font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <span>Continuar</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
