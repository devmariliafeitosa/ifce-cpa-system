import { Info } from "lucide-react";

import type { ReportCampaignData } from "../../data/reportsData";

import { DonutChart } from "./DonutChart";

interface ReportsIndicatorsProps {
  campaign: ReportCampaignData;
}

export function ReportsIndicators({
  campaign,
}: ReportsIndicatorsProps) {
  return (
    <section id="sec-indicadores" className="scroll-mt-4">
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-2.5">
        <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              Indicadores Gerais da Campanha
            </h2>

            <p className="text-[10px] text-slate-500 font-medium">
              Consolidação das avaliações por metodologia da CPA
            </p>
          </div>

          {campaign.totalResponses === 0 ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 self-start sm:self-center">
              Status • Sem respostas
            </span>
          ) : (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006837] border border-emerald-200 self-start sm:self-center">
              Geral:{" "}
              {campaign.potencialidadePct >= 70
                ? "Potencialidade"
                : campaign.fragilidadePct >= 40
                  ? "Fragilidade"
                  : "Mediana"}
            </span>
          )}
        </div>

        {campaign.totalResponses === 0 && (
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 text-[#006837] shrink-0" />

            <span>
              Ainda não existem respostas para este questionário. Os
              indicadores serão calculados após o recebimento dos primeiros
              preenchimentos.
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-around gap-3 sm:gap-5 py-0.5">
          <DonutChart
            potencialidadePct={
              campaign.totalResponses > 0
                ? campaign.potencialidadePct
                : 0
            }
            medianaPct={
              campaign.totalResponses > 0
                ? campaign.medianaPct
                : 0
            }
            fragilidadePct={
              campaign.totalResponses > 0
                ? campaign.fragilidadePct
                : 0
            }
            size={115}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-2xl">
            <div className="px-3 py-2 bg-emerald-50/70 border border-emerald-200/80 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006837] flex-shrink-0" />

                  <span className="text-xs font-extrabold text-slate-800">
                    Potencialidade
                  </span>
                </div>

                <span className="text-base font-black text-[#006837]">
                  {campaign.totalResponses > 0
                    ? `${campaign.potencialidadePct}%`
                    : "0%"}
                </span>
              </div>

              <div className="h-1.5 w-full bg-emerald-200/60 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${
                      campaign.totalResponses > 0
                        ? campaign.potencialidadePct
                        : 0
                    }%`,
                  }}
                  className="h-full bg-[#006837] rounded-full transition-all"
                />
              </div>

              <span className="text-[10px] text-slate-500 block">
                Satisfação ≥ 70%
              </span>
            </div>

            <div className="px-3 py-2 bg-amber-50/70 border border-amber-200/80 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />

                  <span className="text-xs font-extrabold text-slate-800">
                    Mediana
                  </span>
                </div>

                <span className="text-base font-black text-amber-600">
                  {campaign.totalResponses > 0
                    ? `${campaign.medianaPct}%`
                    : "0%"}
                </span>
              </div>

              <div className="h-1.5 w-full bg-amber-200/60 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${
                      campaign.totalResponses > 0
                        ? campaign.medianaPct
                        : 0
                    }%`,
                  }}
                  className="h-full bg-amber-500 rounded-full transition-all"
                />
              </div>

              <span className="text-[10px] text-slate-500 block">
                Satisfação 50% – 69%
              </span>
            </div>

            <div className="px-3 py-2 bg-rose-50/70 border border-rose-200/80 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 flex-shrink-0" />

                  <span className="text-xs font-extrabold text-slate-800">
                    Fragilidade
                  </span>
                </div>

                <span className="text-base font-black text-rose-600">
                  {campaign.totalResponses > 0
                    ? `${campaign.fragilidadePct}%`
                    : "0%"}
                </span>
              </div>

              <div className="h-1.5 w-full bg-rose-200/60 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${
                      campaign.totalResponses > 0
                        ? campaign.fragilidadePct
                        : 0
                    }%`,
                  }}
                  className="h-full bg-rose-600 rounded-full transition-all"
                />
              </div>

              <span className="text-[10px] text-slate-500 block">
                Satisfação &lt; 50%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}