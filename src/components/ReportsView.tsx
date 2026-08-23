import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  FileDown,
  CheckCircle2,
  Users,
  Clock,
  Filter,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info,
  X,
  PieChart,
  Layers,
  HelpCircle,
  Search,
  Building2,
  BookOpen,
  GraduationCap,
  Award,
  Eye,
  FileSpreadsheet,
  FileCode,
  Printer,
  Maximize2,
} from 'lucide-react';
import {
  ReportCampaignData,
  ReportQuestion,
  ReportDimensionResult,
} from '../data/reportsData';
import { INITIAL_SMART_FORMS } from '../data/formsData';
import { buildReportsFromSmartForms } from '../utils/reportConverter';
import { exportReportToExcel, exportReportToCsv } from '../utils/reportExporter';
import { SmartForm } from '../types';
import { CpaPdfReportModal } from './CpaPdfReportModal';
import { DonutChart } from '../features/reports/components/DonutChart';
import { ReportSummaryCards } from '../features/reports/components/ReportSummaryCards';
import { ReportIndicators } from '../features/reports/components/ReportIndicators';
import { ReportAreasSection } from '../features/reports/components/ReportAreasSection';
import { ReportQuestionsSection } from '../features/reports/components/ReportQuestionsSection';
import { QuestionDetailModal } from '../features/reports/components/QuestionDetailModal';
import { DimensionDrawer } from '../features/reports/components/DimensionDrawer';
import { QuickNavRail } from '../features/reports/components/QuickNavRail';
import { getCategoryIcon } from '../features/reports/utils/getCategoryIcon';

interface ReportsViewProps {
  onReturnToDashboard?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = () => {
  // Dynamic Report Campaigns state
  const [reportCampaigns, setReportCampaigns] = useState<ReportCampaignData[]>(() => {
    const savedForms = localStorage.getItem('cpa_smart_forms');
    const forms: SmartForm[] = savedForms ? JSON.parse(savedForms) : INITIAL_SMART_FORMS;
    return buildReportsFromSmartForms(forms);
  });

  // Real-time sync
  useEffect(() => {
    const loadFormsAndSync = () => {
      const savedForms = localStorage.getItem('cpa_smart_forms');
      const forms: SmartForm[] = savedForms ? JSON.parse(savedForms) : INITIAL_SMART_FORMS;
      const converted = buildReportsFromSmartForms(forms);
      setReportCampaigns(converted);
    };

    loadFormsAndSync();

    const handleCustomEvent = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setReportCampaigns(buildReportsFromSmartForms(e.detail));
      } else {
        loadFormsAndSync();
      }
    };

    window.addEventListener('cpa_forms_updated', handleCustomEvent);
    window.addEventListener('storage', loadFormsAndSync);
    window.addEventListener('focus', loadFormsAndSync);

    return () => {
      window.removeEventListener('cpa_forms_updated', handleCustomEvent);
      window.removeEventListener('storage', loadFormsAndSync);
      window.removeEventListener('focus', loadFormsAndSync);
    };
  }, []);

  // Filter States
  const [campusFilter, setCampusFilter] = useState<string>('todos');
  const [yearFilter, setYearFilter] = useState<string>('todos');

  // Selected Campaign State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    reportCampaigns.length > 0 ? reportCampaigns[0].id : null
  );

  // Campaign Selector Dropdown
  const [isCampaignSelectorOpen, setIsCampaignSelectorOpen] = useState(false);
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('');

  // Selected Area / Dimension Filter
  const [selectedDimension, setSelectedDimension] = useState<string>('todas');

  // Drawer Area / Dimension State
  const [drawerDimension, setDrawerDimension] = useState<ReportDimensionResult | null>(null);

  // Modal Question Detail State
  const [selectedDetailQuestion, setSelectedDetailQuestion] = useState<ReportQuestion | null>(null);

  // Segment Tab (Todos | Discentes | Docentes | TAEs)
  const [activeQuestionSegment, setActiveQuestionSegment] = useState<'Todos' | 'Discentes' | 'Docentes' | 'TAEs'>('Todos');

  // Classification Filter State
  const [classificationFilter, setClassificationFilter] = useState<'todas' | 'Potencialidade' | 'Mediana' | 'Fragilidade' | 'Sem respostas'>('todas');

  // Search input for questions
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');

  // Expanded Area Accordions state
  const [expandedAreaNames, setExpandedAreaNames] = useState<Record<string, boolean>>({});

  // Inline Expanded Question state
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});

  // Questions Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Export Menu State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Quick Nav active section
  const [activeNavSection, setActiveNavSection] = useState<'resumo' | 'indicadores' | 'areas' | 'perguntas'>('resumo');

  // Sync selected campaign if list updates
  useEffect(() => {
    if (reportCampaigns.length > 0) {
      if (!selectedCampaignId || !reportCampaigns.some((c) => c.id === selectedCampaignId)) {
        setSelectedCampaignId(reportCampaigns[0].id);
      }
    } else {
      setSelectedCampaignId(null);
    }
  }, [reportCampaigns, selectedCampaignId]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDimension, activeQuestionSegment, classificationFilter, questionSearchTerm, selectedCampaignId]);

  // Available Campuses
  const availableCampuses = useMemo(() => {
    const set = new Set<string>();
    reportCampaigns.forEach((c) => {
      if (c.campus) set.add(c.campus);
    });
    return Array.from(set);
  }, [reportCampaigns]);

  // Available Years
  const availableYears = useMemo(() => {
    const set = new Set<string>();
    reportCampaigns.forEach((c) => {
      if (c.year) set.add(c.year);
    });
    return Array.from(set).sort().reverse();
  }, [reportCampaigns]);

  // Filtered campaigns list for selector
  const filteredCampaignsList = useMemo(() => {
    return reportCampaigns.filter((c) => {
      const matchCampus = campusFilter === 'todos' || c.campus === campusFilter;
      const matchYear = yearFilter === 'todos' || c.year === yearFilter;
      const matchSearch =
        !campaignSearchTerm ||
        c.title.toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
        c.period.toLowerCase().includes(campaignSearchTerm.toLowerCase());
      return matchCampus && matchYear && matchSearch;
    });
  }, [reportCampaigns, campusFilter, yearFilter, campaignSearchTerm]);

  // Selected Campaign Data Object
  const selectedCampaign = useMemo(() => {
    if (!selectedCampaignId) return null;
    return reportCampaigns.find((c) => c.id === selectedCampaignId) || null;
  }, [reportCampaigns, selectedCampaignId]);

  // Filtered Questions list
  const filteredQuestions = useMemo(() => {
    if (!selectedCampaign) return [];
    let qs = selectedCampaign.questions;

    // Filter by segment
    qs = qs.filter((q) => q.segment === activeQuestionSegment);

    // Filter by area/dimension
    if (selectedDimension && selectedDimension !== 'todas') {
      qs = qs.filter((q) => q.category === selectedDimension);
    }

    // Filter by classification
    if (classificationFilter !== 'todas') {
      if (classificationFilter === 'Sem respostas') {
        qs = qs.filter((q) => q.classification === 'Sem respostas' || q.totalAnswers === 0 || selectedCampaign.totalResponses === 0);
      } else {
        qs = qs.filter((q) => q.classification === classificationFilter && q.totalAnswers > 0 && selectedCampaign.totalResponses > 0);
      }
    }

    // Search filter
    if (questionSearchTerm.trim()) {
      const term = questionSearchTerm.toLowerCase();
      qs = qs.filter(
        (q) =>
          q.questionText.toLowerCase().includes(term) ||
          q.category.toLowerCase().includes(term)
      );
    }

    return qs;
  }, [selectedCampaign, activeQuestionSegment, selectedDimension, classificationFilter, questionSearchTerm]);

  // Group filtered questions by area for Accordion Display
  const questionsByArea = useMemo(() => {
    if (!selectedCampaign) return [];

    const map = new Map<string, ReportQuestion[]>();

    // Collect available categories in order
    selectedCampaign.dimensions.forEach((dim) => {
      map.set(dim.dimension, []);
    });

    filteredQuestions.forEach((q) => {
      if (!map.has(q.category)) {
        map.set(q.category, []);
      }
      map.get(q.category)!.push(q);
    });

    const result: {
      area: string;
      questions: ReportQuestion[];
      potCount: number;
      medCount: number;
      fragCount: number;
      semRespCount: number;
    }[] = [];

    map.forEach((qs, area) => {
      if (qs.length > 0) {
        let potCount = 0;
        let medCount = 0;
        let fragCount = 0;
        let semRespCount = 0;

        qs.forEach((q) => {
          if (selectedCampaign.totalResponses === 0 || q.totalAnswers === 0 || q.classification === 'Sem respostas') {
            semRespCount++;
          } else if (q.classification === 'Potencialidade') {
            potCount++;
          } else if (q.classification === 'Mediana') {
            medCount++;
          } else if (q.classification === 'Fragilidade') {
            fragCount++;
          }
        });

        result.push({
          area,
          questions: qs,
          potCount,
          medCount,
          fragCount,
          semRespCount,
        });
      }
    });

    return result;
  }, [selectedCampaign, filteredQuestions]);

  // Flattened questions for pagination across areas
  const paginatedQuestionsData = useMemo(() => {
    const totalCount = filteredQuestions.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
    const validPage = Math.min(Math.max(1, currentPage), totalPages);

    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const pageQuestions = filteredQuestions.slice(startIndex, endIndex);

    return {
      totalCount,
      totalPages,
      currentPage: validPage,
      pageQuestions,
      startIndex,
      endIndex,
    };
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Default expand first area if not set
  useEffect(() => {
    if (questionsByArea.length > 0) {
      setExpandedAreaNames((prev) => {
        if (Object.keys(prev).length === 0) {
          return { [questionsByArea[0].area]: true };
        }
        return prev;
      });
    }
  }, [questionsByArea]);

  // Toggle Area Accordion
  const toggleAreaAccordion = (areaName: string) => {
    setExpandedAreaNames((prev) => ({
      ...prev,
      [areaName]: !prev[areaName],
    }));
  };

  // Expand / Collapse All Areas
  const setAllAreasExpanded = (expand: boolean) => {
    const newMap: Record<string, boolean> = {};
    questionsByArea.forEach((g) => {
      newMap[g.area] = expand;
    });
    setExpandedAreaNames(newMap);
  };

  // Toggle Question Inline Accordion
  const toggleQuestionInline = (qId: string) => {
    setExpandedQuestionIds((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Questions for the Drawer
  const drawerQuestions = useMemo(() => {
    if (!selectedCampaign || !drawerDimension) return [];
    return selectedCampaign.questions.filter(
      (q) => q.category === drawerDimension.dimension && q.segment === activeQuestionSegment
    );
  }, [selectedCampaign, drawerDimension, activeQuestionSegment]);

  // Scroll handler for Quick Nav
  const scrollToSection = (sectionId: string) => {
    setActiveNavSection(sectionId as any);
    const element = document.getElementById(`sec-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Segment breakdown helper for selected question detail modal
  const selectedQuestionSegmentBreakdown = useMemo(() => {
    if (!selectedCampaign || !selectedDetailQuestion) return [];
    return selectedCampaign.questions.filter(
      (q) => q.questionText === selectedDetailQuestion.questionText && q.segment !== 'Todos'
    );
  }, [selectedCampaign, selectedDetailQuestion]);

  return (
    <div className="w-full max-w-[95%] xl:max-w-[1400px] mx-auto px-2 sm:px-4 py-3 space-y-3.5 relative">
      {/* =====================================================================
          1. CABEÇALHO COMPACTO
         ===================================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 bg-emerald-100/80 text-[#006837] rounded-lg flex-shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                Relatórios Institucionais
              </h1>
              <span className="bg-emerald-50 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/80 hidden sm:inline-block">
                CPA • Campus Tauá
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 truncate">
              Consolidação e análise dos resultados da Comissão Própria de Avaliação
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. BARRA DE FILTROS ÚNICA E COMPACTA
         ===================================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <div className="flex items-center gap-1 text-slate-500 text-xs font-bold shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#006837]" />
            <span className="hidden md:inline">Filtros:</span>
          </div>

          {/* Campus */}
          <select
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] cursor-pointer"
          >
            <option value="todos">Todos Campi</option>
            {availableCampuses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Ano */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] cursor-pointer"
          >
            <option value="todos">Todos Anos</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Seletor de Questionário / Campanha */}
          <div className="relative min-w-[180px] max-w-[260px] flex-1">
            <button
              onClick={() => setIsCampaignSelectorOpen(!isCampaignSelectorOpen)}
              className="w-full h-8 px-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-bold text-slate-800 flex items-center justify-between gap-1.5 shadow-2xs transition-all cursor-pointer text-left"
            >
              <span className="truncate">
                {selectedCampaign ? selectedCampaign.title : 'Selecione um questionário'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform ${
                  isCampaignSelectorOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isCampaignSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute left-0 top-full mt-1 z-40 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1.5 w-72 sm:w-80 overflow-hidden flex flex-col"
                >
                  <div className="relative flex-shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={campaignSearchTerm}
                      onChange={(e) => setCampaignSearchTerm(e.target.value)}
                      placeholder="Pesquisar questionário..."
                      className="w-full pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837]"
                    />
                  </div>

                  <div className="max-h-52 overflow-y-auto space-y-1 pr-1 flex-1">
                    {filteredCampaignsList.length === 0 ? (
                      <div className="p-2 text-center text-xs text-slate-400">
                        Nenhum questionário encontrado.
                      </div>
                    ) : (
                      filteredCampaignsList.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCampaignId(c.id);
                            setIsCampaignSelectorOpen(false);
                          }}
                          className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            c.id === selectedCampaignId
                              ? 'bg-[#006837] text-white font-bold'
                              : 'hover:bg-slate-50 text-slate-700 font-medium'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="truncate">{c.title}</div>
                            <div
                              className={`text-[10px] mt-0.5 ${
                                c.id === selectedCampaignId ? 'text-emerald-100' : 'text-slate-400'
                              }`}
                            >
                              {c.campus} • {c.period}
                            </div>
                          </div>
                          {c.id === selectedCampaignId && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Botão Exportar relatório com Menu Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            disabled={!selectedCampaign}
            className="h-8 px-3 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Exportar relatório</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isExportMenuOpen && selectedCampaign && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 w-48 space-y-1"
              >
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    setIsPdfModalOpen(true);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF (.pdf)</span>
                </button>

                <button
                  onClick={async () => {
                    setIsExportMenuOpen(false);
                    await exportReportToExcel(selectedCampaign);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel (.xlsx)</span>
                </button>

                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    exportReportToCsv(selectedCampaign);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>CSV (.csv)</span>
                </button>

                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    window.print();
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#006837] rounded-lg flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-100 pt-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Imprimir</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {selectedCampaign ? (
        <div className="space-y-3.5">
          {/* =====================================================================
              3. RESUMO DA CAMPANHA (4 INDICADORES COMPACTOS PADRONIZADOS)
             ===================================================================== */}
          <ReportSummaryCards selectedCampaign={selectedCampaign} />

          {/* =====================================================================
              INDICADORES GERAIS DA CAMPANHA
             ===================================================================== */}
          <ReportIndicators selectedCampaign={selectedCampaign} />

          {/* =====================================================================
              RESULTADOS POR ÁREA AVALIADA
             ===================================================================== */}
          <ReportAreasSection
            selectedCampaign={selectedCampaign}
            selectedDimension={selectedDimension}
            setSelectedDimension={setSelectedDimension}
            scrollToSection={scrollToSection}
            setDrawerDimension={setDrawerDimension}
          />

          {/* =====================================================================
              PERGUNTAS
             ===================================================================== */}
          <ReportQuestionsSection
            selectedCampaign={selectedCampaign}
            selectedDimension={selectedDimension}
            setSelectedDimension={setSelectedDimension}
            activeQuestionSegment={activeQuestionSegment}
            setActiveQuestionSegment={setActiveQuestionSegment}
            classificationFilter={classificationFilter}
            setClassificationFilter={setClassificationFilter}
            questionSearchTerm={questionSearchTerm}
            setQuestionSearchTerm={setQuestionSearchTerm}
            filteredQuestions={filteredQuestions}
            questionsByArea={questionsByArea}
            expandedAreaNames={expandedAreaNames}
            toggleAreaAccordion={toggleAreaAccordion}
            setAllAreasExpanded={setAllAreasExpanded}
            expandedQuestionIds={expandedQuestionIds}
            toggleQuestionInline={toggleQuestionInline}
            setSelectedDetailQuestion={setSelectedDetailQuestion}
            paginatedQuestionsData={paginatedQuestionsData}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
          Selecione um questionário no filtro superior para visualizar o relatório completo.
        </div>
      )}

      <QuestionDetailModal
        question={selectedDetailQuestion}
        campaignHasResponses={(selectedCampaign?.totalResponses ?? 0) > 0}
        segmentBreakdown={selectedQuestionSegmentBreakdown}
        onClose={() => setSelectedDetailQuestion(null)}
      />

      <DimensionDrawer
        dimension={drawerDimension}
        campaignHasResponses={(selectedCampaign?.totalResponses ?? 0) > 0}
        activeQuestionSegment={activeQuestionSegment}
        setActiveQuestionSegment={setActiveQuestionSegment}
        drawerQuestions={drawerQuestions}
        onClose={() => setDrawerDimension(null)}
      />

      {/* =====================================================================
          TRILHO DE NAVEGAÇÃO FLUTUANTE
         ===================================================================== */}
      <QuickNavRail activeNavSection={activeNavSection} scrollToSection={scrollToSection} />

      {/* MODAL DE PDF */}
      <CpaPdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        campaign={selectedCampaign}
      />
    </div>
  );
};
