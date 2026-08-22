import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, ChevronDown, ChevronRight, ChevronUp, Maximize2 } from 'lucide-react';
import { ReportCampaignData, ReportQuestion } from '../../../data/reportsData';
import { getCategoryIcon } from '../utils/getCategoryIcon';

/* Seção "Perguntas" — toolbar de filtros/busca + lista de perguntas agrupadas por área
 * (accordion) + paginação. A maior e mais densa seção do relatório.
 * Extraído de ReportsView.tsx. */

interface QuestionAreaGroup {
  area: string;
  questions: ReportQuestion[];
  potCount: number;
  medCount: number;
  fragCount: number;
  semRespCount: number;
}

interface PaginatedQuestionsData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageQuestions: ReportQuestion[];
  startIndex: number;
  endIndex: number;
}

interface ReportQuestionsSectionProps {
  selectedCampaign: ReportCampaignData;
  selectedDimension: string;
  setSelectedDimension: (dimension: string) => void;
  activeQuestionSegment: 'Todos' | 'Discentes' | 'Docentes' | 'TAEs';
  setActiveQuestionSegment: (segment: 'Todos' | 'Discentes' | 'Docentes' | 'TAEs') => void;
  classificationFilter: 'todas' | 'Potencialidade' | 'Mediana' | 'Fragilidade' | 'Sem respostas';
  setClassificationFilter: (value: 'todas' | 'Potencialidade' | 'Mediana' | 'Fragilidade' | 'Sem respostas') => void;
  questionSearchTerm: string;
  setQuestionSearchTerm: (value: string) => void;
  filteredQuestions: ReportQuestion[];
  questionsByArea: QuestionAreaGroup[];
  expandedAreaNames: Record<string, boolean>;
  toggleAreaAccordion: (areaName: string) => void;
  setAllAreasExpanded: (expand: boolean) => void;
  expandedQuestionIds: Record<string, boolean>;
  toggleQuestionInline: (qId: string) => void;
  setSelectedDetailQuestion: (q: ReportQuestion) => void;
  paginatedQuestionsData: PaginatedQuestionsData;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const ReportQuestionsSection: React.FC<ReportQuestionsSectionProps> = ({
  selectedCampaign,
  selectedDimension,
  setSelectedDimension,
  activeQuestionSegment,
  setActiveQuestionSegment,
  classificationFilter,
  setClassificationFilter,
  questionSearchTerm,
  setQuestionSearchTerm,
  filteredQuestions,
  questionsByArea,
  expandedAreaNames,
  toggleAreaAccordion,
  setAllAreasExpanded,
  expandedQuestionIds,
  toggleQuestionInline,
  setSelectedDetailQuestion,
  paginatedQuestionsData,
  setCurrentPage,
}) => {
  return (
    <section id="sec-perguntas" className="scroll-mt-4">
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
        {/* Toolbar Compacta de Filtros & Busca no Topo */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              Perguntas {selectedDimension !== 'todas' ? `• ${selectedDimension}` : '• Todas as Áreas'}
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">
              Exibindo {filteredQuestions.length} perguntas filtradas
            </p>
          </div>

          {/* Filtros em Linha Horizontal Compacta */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Filtro de Segmento */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              {(['Todos', 'Discentes', 'Docentes', 'TAEs'] as const).map((seg) => (
                <button
                  key={seg}
                  onClick={() => setActiveQuestionSegment(seg)}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    activeQuestionSegment === seg
                      ? 'bg-white text-[#006837] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>

            {/* 2. Filtro de Área */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-lg px-2 py-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Área:</span>
              <select
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="todas">Todas as Áreas</option>
                {selectedCampaign.dimensions.map((d) => (
                  <option key={d.dimension} value={d.dimension}>
                    {d.dimension}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Filtro de Classificação */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-lg px-2 py-1">
              <Filter className="w-3 h-3 text-[#006837]" />
              <select
                value={classificationFilter}
                onChange={(e) => setClassificationFilter(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="todas">Todas as classificações</option>
                <option value="Potencialidade">Potencialidade (≥ 70%)</option>
                <option value="Mediana">Avaliação Mediana (50-69%)</option>
                <option value="Fragilidade">Fragilidade (&lt; 50%)</option>
                <option value="Sem respostas">Sem respostas</option>
              </select>
            </div>

            {/* 4. Campo de Busca */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={questionSearchTerm}
                onChange={(e) => setQuestionSearchTerm(e.target.value)}
                placeholder="Buscar pergunta..."
                className="w-36 sm:w-48 pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837]"
              />
            </div>
          </div>
        </div>

        {/* Botões para Expandir / Recolher Todas as Áreas */}
        {questionsByArea.length > 0 && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
            <span>
              Agrupadas por área ({questionsByArea.length} áreas ativas)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAllAreasExpanded(true)}
                className="hover:text-[#006837] font-semibold cursor-pointer underline decoration-dotted"
              >
                Expandir todas
              </button>
              <span>•</span>
              <button
                onClick={() => setAllAreasExpanded(false)}
                className="hover:text-slate-700 font-semibold cursor-pointer underline decoration-dotted"
              >
                Recolher todas
              </button>
            </div>
          </div>
        )}

        {/* Caso Nenhuma pergunta seja encontrada */}
        {questionsByArea.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="text-slate-400 text-lg font-bold">Nenhuma pergunta encontrada</div>
            <p className="text-xs text-slate-500">
              Tente ajustar os filtros de segmento, área, classificação ou busca acima.
            </p>
          </div>
        ) : (
          /* Lista Agrupada por Áreas em Accordions */
          <div className="space-y-3">
            {questionsByArea.map((group) => {
              const isAreaExpanded = expandedAreaNames[group.area] !== false; // default true

              return (
                <div
                  key={group.area}
                  className="border border-slate-200/90 rounded-xl bg-white overflow-hidden shadow-2xs"
                >
                  {/* Area Header Accordion Toggle */}
                  <div
                    onClick={() => toggleAreaAccordion(group.area)}
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
                          {getCategoryIcon(group.area)}
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                          {group.area}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                          {group.questions.length} {group.questions.length === 1 ? 'pergunta' : 'perguntas'}
                        </span>
                      </div>
                    </div>

                    {/* Resumo/Badges da Área */}
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

                  {/* Conteúdo do Accordion da Área */}
                  <AnimatePresence>
                    {isAreaExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2 space-y-1.5 bg-slate-50/20"
                      >
                        {group.questions.map((q, idx) => {
                          const isExpandedInline = !!expandedQuestionIds[q.id];
                          const isNoResp =
                            q.totalAnswers === 0 ||
                            selectedCampaign.totalResponses === 0 ||
                            q.classification === 'Sem respostas';

                          return (
                            <div
                              key={q.id}
                              className={`border rounded-lg transition-all bg-white overflow-hidden ${
                                isExpandedInline
                                  ? 'border-[#006837] ring-1 ring-[#006837]/20 shadow-2xs'
                                  : 'border-slate-200/80 hover:border-slate-300'
                              }`}
                            >
                              {/* Linha da Pergunta Minimizada */}
                              <div
                                onClick={() => toggleQuestionInline(q.id)}
                                className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
                              >
                                <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                                  <span className="text-[10px] font-black text-slate-400 shrink-0 w-6">
                                    #{String(idx + 1).padStart(2, '0')}
                                  </span>

                                  <div className="min-w-0 space-y-0.5 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-md">
                                        {q.category}
                                      </span>
                                      <span className="text-[9px] font-semibold text-slate-400">
                                        {q.segment}
                                      </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                                      {q.questionText}
                                    </h4>
                                  </div>
                                </div>

                                {/* Status / Badge & Botão Ver Detalhes */}
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                  {isNoResp ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                                      SEM RESPOSTAS
                                    </span>
                                  ) : (
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold whitespace-nowrap ${
                                        q.classification === 'Potencialidade'
                                          ? 'bg-emerald-50 text-[#006837] border border-emerald-200'
                                          : q.classification === 'Mediana'
                                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                                      }`}
                                    >
                                      {q.classification} • {q.approvalRate}%
                                    </span>
                                  )}

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleQuestionInline(q.id);
                                    }}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                                      isExpandedInline
                                        ? 'bg-[#006837] text-white'
                                        : 'bg-slate-100 hover:bg-emerald-50 hover:text-[#006837] text-slate-700'
                                    }`}
                                  >
                                    <span>{isExpandedInline ? 'Fechar' : 'Ver detalhes'}</span>
                                    {isExpandedInline ? (
                                      <ChevronUp className="w-3 h-3" />
                                    ) : (
                                      <ChevronDown className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Detalhes Expandidos Inline da Pergunta */}
                              <AnimatePresence>
                                {isExpandedInline && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-t border-slate-200 bg-slate-50/50 p-3.5 space-y-3"
                                  >
                                    {/* Info da Pergunta */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white border border-slate-200/80 rounded-lg">
                                      <div>
                                        <p className="text-xs font-bold text-slate-900 leading-snug">
                                          {q.questionText}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                                          <span>Área: <strong className="text-slate-800">{q.category}</strong></span>
                                          <span>•</span>
                                          <span>Segmento: <strong className="text-slate-800">{q.segment}</strong></span>
                                          <span>•</span>
                                          <span>Respostas: <strong className="text-[#006837]">{q.totalAnswers}</strong></span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                                        {isNoResp ? (
                                          <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                                            SEM RESPOSTAS
                                          </span>
                                        ) : (
                                          <div className="text-right">
                                            <span className="text-xs font-bold text-slate-500 block">
                                              Satisfação alta: <strong className="text-base font-black text-[#006837]">{q.approvalRate}%</strong>
                                            </span>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006837]">
                                              {q.classification}
                                            </span>
                                          </div>
                                        )}

                                        <button
                                          onClick={() => setSelectedDetailQuestion(q)}
                                          title="Abrir em modal completo"
                                          className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-[#006837] rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Maximize2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Distribuição de Respostas */}
                                    {isNoResp ? (
                                      <div className="p-3 bg-white border border-slate-200 rounded-lg text-center text-xs text-slate-500 font-medium">
                                        📋 Ainda não existem respostas registradas para esta pergunta.
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5 bg-white p-3 border border-slate-200/80 rounded-lg">
                                        <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                                          Distribuição de Respostas
                                        </h5>

                                        <div className="space-y-1.5 pt-1">
                                          {q.alternatives.map((alt, aIdx) => (
                                            <div key={aIdx} className="space-y-0.5">
                                              <div className="flex justify-between text-xs text-slate-700 font-medium">
                                                <span>{alt.option}</span>
                                                <span className="font-bold text-slate-900">
                                                  {alt.count} respostas ({alt.percentage}%)
                                                </span>
                                              </div>
                                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                  style={{ width: `${alt.percentage}%` }}
                                                  className={`h-full rounded-full transition-all ${
                                                    aIdx === 0
                                                      ? 'bg-[#006837]'
                                                      : aIdx === 1
                                                      ? 'bg-amber-500'
                                                      : 'bg-rose-500'
                                                  }`}
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* =====================================================================
            PAGINAÇÃO COMPACTA NO FINAL DA SEÇÃO DE PERGUNTAS
           ===================================================================== */}
        {paginatedQuestionsData.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-500 font-medium">
              Exibindo {paginatedQuestionsData.startIndex + 1}–
              {Math.min(paginatedQuestionsData.endIndex, paginatedQuestionsData.totalCount)} de{' '}
              <strong className="text-slate-800">{paginatedQuestionsData.totalCount}</strong> perguntas
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={paginatedQuestionsData.currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                ← Anterior
              </button>

              {Array.from({ length: paginatedQuestionsData.totalPages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => setCurrentPage(pNum)}
                  className={`w-7 h-7 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    pNum === paginatedQuestionsData.currentPage
                      ? 'bg-[#006837] text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pNum}
                </button>
              ))}

              <button
                disabled={paginatedQuestionsData.currentPage === paginatedQuestionsData.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(paginatedQuestionsData.totalPages, p + 1))}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
