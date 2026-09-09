import React from "react";
import { ShieldCheck } from "lucide-react";

import { IFCELogo } from "../../../components/auth/IFCELogo";
import { Footer } from "../../../components/auth/Footer";

interface RespondShellProps {
  campaignTitle?: string;
  campus?: string;
  stepIndex?: number; // 1-based
  totalSteps?: number;
  children: React.ReactNode;
}

const STEP_LABELS = ["Identificação", "Segmento", "Questionário", "Concluído"];

export const RespondShell: React.FC<RespondShellProps> = ({
  campaignTitle,
  campus,
  stepIndex,
  totalSteps = 4,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 antialiased font-sans overflow-x-hidden flex flex-col">
      <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xs">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <IFCELogo />
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Resposta anônima e segura</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-3 py-6 sm:py-10">
        <div className="w-full max-w-2xl">
          {(campaignTitle || stepIndex) && (
            <div className="mb-4 space-y-2.5">
              {campaignTitle && (
                <div className="text-center space-y-0.5">
                  <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {campaignTitle}
                  </h1>
                  {campus && (
                    <p className="text-xs font-medium text-slate-500">{campus}</p>
                  )}
                </div>
              )}

              {stepIndex && (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className="flex-1 flex items-center gap-1.5">
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i < stepIndex ? "bg-[#006837]" : "bg-slate-200"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {stepIndex && (
                <p className="text-center text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Etapa {stepIndex} de {totalSteps} — {STEP_LABELS[stepIndex - 1]}
                </p>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
