import React from 'react';
import { Users, GraduationCap, Award, Building2, ChevronRight } from 'lucide-react';
import { NavTabId } from '../../../components/Sidebar';

/* Seção "Participação dos segmentos" — barras de progresso por Discentes/Docentes/TAEs.
 * Extraído de DashboardView.tsx. */

interface SegmentParticipationCardProps {
  totalResponses: number;
  totalUniverse: number;
  discentesResponses: number;
  discentesUniverse: number;
  discentesRate: number;
  docentesResponses: number;
  docentesUniverse: number;
  docentesRate: number;
  taesResponses: number;
  taesUniverse: number;
  taesRate: number;
  onNavigateTab: (tab: NavTabId) => void;
}

export const SegmentParticipationCard: React.FC<SegmentParticipationCardProps> = ({
  totalResponses,
  totalUniverse,
  discentesResponses,
  discentesUniverse,
  discentesRate,
  docentesResponses,
  docentesUniverse,
  docentesRate,
  taesResponses,
  taesUniverse,
  taesRate,
  onNavigateTab,
}) => {
  return (
    <section
      id="sec-participacao-segmentos"
      className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3 flex-1 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                Participação dos segmentos
              </h2>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('participantes')}
            className="text-xs font-bold text-[#006837] hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>Gerenciar participantes</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Barras e Estatísticas por Segmento */}
        <div className="space-y-3.5 pt-3">
          {/* Segmento 1: Discentes */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <GraduationCap className="w-4 h-4 text-[#006837]" />
                <span>Discentes (Alunos)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">
                  {discentesResponses.toLocaleString('pt-BR')} de ~{discentesUniverse}
                </span>
                <span className="font-extrabold text-slate-900 min-w-[36px] text-right">
                  {totalResponses > 0 ? `${discentesRate}%` : '0%'}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${totalResponses > 0 ? discentesRate : 0}%` }}
                className="h-full bg-[#006837] rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Segmento 2: Docentes */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Docentes (Professores)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">
                  {docentesResponses.toLocaleString('pt-BR')} de ~{docentesUniverse}
                </span>
                <span className="font-extrabold text-slate-900 min-w-[36px] text-right">
                  {totalResponses > 0 ? `${docentesRate}%` : '0%'}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${totalResponses > 0 ? docentesRate : 0}%` }}
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Segmento 3: TAEs */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Técnico-Administrativos (TAEs)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">
                  {taesResponses.toLocaleString('pt-BR')} de ~{taesUniverse}
                </span>
                <span className="font-extrabold text-slate-900 min-w-[36px] text-right">
                  {totalResponses > 0 ? `${taesRate}%` : '0%'}
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${totalResponses > 0 ? taesRate : 0}%` }}
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Universo Total Estimado: <strong className="text-slate-700">~{totalUniverse} participantes</strong>
        </span>
        <span className="text-slate-400">Dados baseados no censo local</span>
      </div>
    </section>
  );
};
