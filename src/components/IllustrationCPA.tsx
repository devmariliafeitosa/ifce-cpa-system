import React from "react";
import { BarChart2, ShieldCheck, CheckCircle2, Building2 } from "lucide-react";

export const IllustrationCPA: React.FC = () => {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* Decorative ambient backdrop glow */}
      <div className="absolute inset-0 bg-white/10 rounded-3xl blur-xl transform scale-105 pointer-events-none"></div>

      {/* Main Streamlined Container Card */}
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Avalia├º├úo Institucional
              </p>
              <p className="text-[11px] text-white/70">Ciclo CPA 2026</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-medium border border-emerald-300/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
            Em andamento
          </span>
        </div>

        {/* 2 Clean Stat Boxes */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white/10 border border-white/15 rounded-xl p-3 text-center">
            <p className="text-[11px] text-white/70 font-medium">
              Participa├º├úo Geral
            </p>
            <p className="text-lg font-bold text-white mt-0.5">91,2%</p>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-xl p-3 text-center">
            <p className="text-[11px] text-white/70 font-medium">
              Campi Integrados
            </p>
            <p className="text-lg font-bold text-white mt-0.5">33</p>
          </div>
        </div>

        {/* Single Minimal Progress Indicator */}
        <div className="bg-white/10 border border-white/15 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-300" />
              Consolida├º├úo de Respostas
            </span>
            <span className="text-emerald-300 font-semibold text-[11px]">
              88%
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-300 to-teal-200 rounded-full w-[88%]"></div>
          </div>
        </div>

        {/* Clean Footer note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/70 pt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>Painel exclusivo da Coordena├º├úo CPA</span>
        </div>
      </div>
    </div>
  );
};
