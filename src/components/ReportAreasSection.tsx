import React from 'react';
import { Layers, Eye } from 'lucide-react';
import { ReportCampaignData, ReportDimensionResult } from '../../../data/reportsData';
import { getCategoryIcon } from '../utils/getCategoryIcon';

/* Seção "Resultados por Área Avaliada" — grade de dimensões clicáveis para filtrar
 * as perguntas exibidas na seção seguinte. Extraído de ReportsView.tsx. */

interface ReportAreasSectionProps {
  selectedCampaign: ReportCampaignData;
  selectedDimension: string;
  setSelectedDimension: (dimension: string) => void;
  scrollToSection: (sectionId: string) => void;
  setDrawerDimension: (dimension: ReportDimensionResult) => void;
}

export const ReportAreasSection: React.FC<ReportAreasSectionProps> = ({
  selectedCampaign,
  selectedDimension,
  setSelectedDimension,
  scrollToSection,
  setDrawerDimension,
}) => {
  return (
    <section id="sec-areas" className="scroll-mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Resultados por Área Avaliada
          </h2>
          <p className="text-[10px] text-slate-500 font-medium">
            Selecione uma área para filtrar as perguntas abaixo
          </p>
        </div>

        {selectedDimension !== 'todas' && (
          <button
            onClick={() => setSelectedDimension('todas')}
            className="text-xs font-bold text-[#006837] hover:underline cursor-pointer"
          >
            Exibir Todas as Áreas
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
        {/* Botão "Todas as Áreas" */}
        <div
          onClick={() => {
            setSelectedDimension('todas');
            scrollToSection('perguntas');
          }}
          className={`bg-white border rounded-xl px-3 py-2 h-[82px] transition-all flex flex-col justify-between relative cursor-pointer ${
            selectedDimension === 'todas'
              ? 'border-[#006837] ring-2 ring-[#006837]/20 shadow-2xs bg-emerald-50/20'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-emerald-100 text-[#006837] rounded-md flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 truncate">
              Todas as Áreas
            </h3>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-bold text-slate-500">
              {selectedCampaign.totalQuestions} perguntas
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase bg-emerald-100 text-[#006837]">
              Visão Geral
            </span>
          </div>
        </div>

        {selectedCampaign.dimensions.map((dim) => {
          const isSelected = selectedDimension === dim.dimension;
          const isNoResp = selectedCampaign.totalResponses === 0;
          return (
            <div
              key={dim.dimension}
              onClick={() => {
                setSelectedDimension(isSelected ? 'todas' : dim.dimension);
                scrollToSection('perguntas');
              }}
              className={`bg-white border rounded-xl px-3 py-2 h-[82px] transition-all flex flex-col justify-between relative cursor-pointer ${
                isSelected
                  ? 'border-[#006837] ring-2 ring-[#006837]/20 shadow-2xs bg-emerald-50/20'
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="p-1 bg-slate-100 rounded-md flex-shrink-0">
                    {getCategoryIcon(dim.dimension)}
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 truncate">
                    {dim.dimension}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDrawerDimension(dim);
                  }}
                  title="Ver Detalhes da Área"
                  className="p-1 hover:bg-emerald-100 text-[#006837] rounded-md transition-colors cursor-pointer flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                {isNoResp ? (
                  <>
                    <span className="text-[10px] font-medium text-slate-400">Status:</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      Sem respostas
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base font-black text-slate-900 tracking-tight">
                      {dim.potencialidadePct}%
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                        dim.classification === 'Potencialidade'
                          ? 'bg-emerald-100 text-[#006837]'
                          : dim.classification === 'Mediana'
                          ? 'bg-amber-100 text-amber-800'
                          : dim.classification === 'Fragilidade'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {dim.classification}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
