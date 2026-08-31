import { ReportsQuestionsList } from "./ReportsQuestionsList";
import { ReportsFiltersBar } from "./ReportsFiltersBar";
import { ReportsQuickNav } from "./ReportsQuickNav";
import { ReportsAreaDrawer } from "./ReportsAreaDrawer";
import { ReportsQuestionDetailModal } from "./ReportsQuestionDetailModal";
import { ReportsQuestionsPagination } from "./ReportsQuestionsPagination";
import { ReportsQuestionsToolbar } from "./ReportsQuestionsToolbar";
import { ReportsAreas } from "./ReportsAreas";
import { ReportsIndicators } from "./ReportsIndicators";
import { ReportsSummaryCards } from "./ReportsSummaryCards";
import React, { useEffect, useMemo, useState } from 'react';
import { INITIAL_SMART_FORMS } from '../../data/formsData.ts';
import type {
  ReportCampaignData,
  ReportDimensionResult,
  ReportQuestion,
} from '../../data/reportsData.ts';
import type { SmartForm } from "../../types.ts";
import { buildReportsFromSmartForms } from '../../utils/reportConverter.ts';
import { CpaPdfReportModal } from './CpaPdfReportModal.tsx';

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

  // Selected Campaign State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    reportCampaigns.length > 0 ? reportCampaigns[0].id : null
  );
  // Questions Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

    // Real-time sync
  useEffect(() => {
    const syncForms = (forms: SmartForm[]) => {
      const converted = buildReportsFromSmartForms(forms);

      setReportCampaigns(converted);

      const nextCampaignId =
        converted.length === 0
          ? null
          : selectedCampaignId &&
              converted.some((campaign) => campaign.id === selectedCampaignId)
            ? selectedCampaignId
            : converted[0].id;

      if (nextCampaignId !== selectedCampaignId) {
        setSelectedCampaignId(nextCampaignId);
        setCurrentPage(1);
      }
    };

    const loadFormsAndSync = () => {
      const savedForms = localStorage.getItem('cpa_smart_forms');
      const forms: SmartForm[] = savedForms
        ? JSON.parse(savedForms)
        : INITIAL_SMART_FORMS;

      syncForms(forms);
    };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<SmartForm[]>;

      if (Array.isArray(customEvent.detail)) {
        syncForms(customEvent.detail);
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
  }, [selectedCampaignId, setCurrentPage]);

  // Filter States
  const [campusFilter, setCampusFilter] = useState<string>('todos');
  const [yearFilter, setYearFilter] = useState<string>('todos');

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

  // Export Menu State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Quick Nav active section
  const [activeNavSection, setActiveNavSection] = useState<'resumo' | 'indicadores' | 'areas' | 'perguntas'>('resumo');


  // Available Campuses
  const availableCampuses = useMemo(() => {
    const set = new Set<string>([
      "Campus Tauá",
      "Campus Crateús",
      "Campus Iguatu",
      "Campus Quixadá",
      "Campus Fortaleza",
    ]);

    reportCampaigns.forEach((campaign) => {
      if (campaign.campus) {
        set.add(campaign.campus);
      }
    });

    return Array.from(set);
  }, [reportCampaigns]);

  // Available Years
  const availableYears = useMemo(() => {
    const set = new Set<string>([
      "2026",
      "2025",
      "2024",
      "2023",
      "2022",
    ]);

    reportCampaigns.forEach((campaign) => {
      if (campaign.year) {
        set.add(campaign.year);
      }
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
  const scrollToSection = (
    sectionId: 'resumo' | 'indicadores' | 'areas' | 'perguntas'
  ) => {
    setActiveNavSection(sectionId);

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
    1. BARRA DE FILTROS ÚNICA E COMPACTA
   ===================================================================== */}
   <ReportsFiltersBar
      availableCampuses={availableCampuses}
      availableYears={availableYears}
      campusFilter={campusFilter}
      yearFilter={yearFilter}
      selectedCampaign={selectedCampaign}
      selectedCampaignId={selectedCampaignId}
      filteredCampaigns={filteredCampaignsList}
      isCampaignSelectorOpen={isCampaignSelectorOpen}
      campaignSearchTerm={campaignSearchTerm}
      isExportMenuOpen={isExportMenuOpen}
      onCampusChange={setCampusFilter}
      onYearChange={setYearFilter}
      onCampaignSelectorToggle={() =>
        setIsCampaignSelectorOpen(!isCampaignSelectorOpen)
      }
      onCampaignSearchChange={setCampaignSearchTerm}
      onCampaignSelect={(campaignId) => {
        setSelectedCampaignId(campaignId);
        setCurrentPage(1);
        setIsCampaignSelectorOpen(false);
      }}
      onExportToggle={() =>
        setIsExportMenuOpen(!isExportMenuOpen)
      }
  onExportClose={() => setIsExportMenuOpen(false)}
  onOpenPdf={() => setIsPdfModalOpen(true)}
/>
      {selectedCampaign ? (
        <div className="space-y-3.5">
          {/* =====================================================================
              3. RESUMO DA CAMPANHA (4 INDICADORES COMPACTOS PADRONIZADOS)
             ===================================================================== */}
        <ReportsSummaryCards campaign={selectedCampaign} />
          {/* =====================================================================
              4. INDICADORES GERAIS DA CAMPANHA
             ===================================================================== */}
          <ReportsIndicators campaign={selectedCampaign} />

          {/* =====================================================================
              5. RESULTADO POR ÁREA AVALIADA (SELETOR COMPACTO EM GRID / ABAS)
             ===================================================================== */}
        <ReportsAreas
          campaign={selectedCampaign}
          selectedDimension={selectedDimension}
          onShowAll={() => {
            setSelectedDimension("todas");
            setCurrentPage(1);
          }}
          onSelectArea={(dimension) => {
            setSelectedDimension(dimension);
            setCurrentPage(1);
            scrollToSection("perguntas");
          }}
          onOpenArea={setDrawerDimension}
        />

          {/* =====================================================================
              6. PERGUNTAS • TODAS AS ÁREAS (ORGANIZADO POR ÁREA + COMPACTO ACCORDION)
             ===================================================================== */}
          <section id="sec-perguntas" className="scroll-mt-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
              <ReportsQuestionsToolbar
                campaign={selectedCampaign}
                selectedDimension={selectedDimension}
                activeQuestionSegment={activeQuestionSegment}
                classificationFilter={classificationFilter}
                questionSearchTerm={questionSearchTerm}
                filteredQuestionsCount={filteredQuestions.length}
                onSegmentChange={(segment) => {
                  setActiveQuestionSegment(segment);
                  setCurrentPage(1);
                }}
                onDimensionChange={(dimension) => {
                  setSelectedDimension(dimension);
                  setCurrentPage(1);
                }}
                onClassificationChange={(classification) => {
                  setClassificationFilter(classification);
                  setCurrentPage(1);
                }}
                onSearchChange={(term) => {
                  setQuestionSearchTerm(term);
                  setCurrentPage(1);
                }}
              />

    {/* Botões para Expandir / Recolher Todas as Áreas */}

              {/* Botões para Expandir / Recolher Todas as Áreas */}
              <ReportsQuestionsList
                groups={questionsByArea}
                expandedAreaNames={expandedAreaNames}
                expandedQuestionIds={expandedQuestionIds}
                campaignTotalResponses={selectedCampaign.totalResponses}
                onExpandAll={setAllAreasExpanded}
                onToggleArea={toggleAreaAccordion}
                onToggleQuestion={toggleQuestionInline}
                onOpenQuestionDetails={setSelectedDetailQuestion}
              />
              {/* =====================================================================
                  8. PAGINAÇÃO COMPACTA NO FINAL DA SEÇÃO DE PERGUNTAS
                 ===================================================================== */}
              <ReportsQuestionsPagination
                currentPage={paginatedQuestionsData.currentPage}
                totalPages={paginatedQuestionsData.totalPages}
                startIndex={paginatedQuestionsData.startIndex}
                endIndex={paginatedQuestionsData.endIndex}
                totalCount={paginatedQuestionsData.totalCount}
                onPageChange={setCurrentPage}
              />
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
          Selecione um questionário no filtro superior para visualizar o relatório completo.
        </div>
      )}

      {/* =====================================================================
          7. MODAL COMPACTO DE DETALHES DA PERGUNTA
        
        ===================================================================== */}
      <ReportsQuestionDetailModal
        question={selectedDetailQuestion}
        campaignTotalResponses={selectedCampaign?.totalResponses}
        segmentBreakdown={selectedQuestionSegmentBreakdown}
        onClose={() => setSelectedDetailQuestion(null)}
      />

      <ReportsAreaDrawer
        dimension={drawerDimension}
        questions={drawerQuestions}
        activeQuestionSegment={activeQuestionSegment}
        campaignTotalResponses={selectedCampaign?.totalResponses}
        onSegmentChange={setActiveQuestionSegment}
        onClose={() => setDrawerDimension(null)}
      />
      {/* =====================================================================
          9. TRILHO DE NAVEGAÇÃO FLUTUANTE (QUICK NAV RAIL COM TOOLTIPS CLAROS)
         ===================================================================== */}
      <ReportsQuickNav
        activeSection={activeNavSection}
        onNavigate={scrollToSection}
      />

      {/* MODAL DE PDF */}
      <CpaPdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        campaign={selectedCampaign}
      />
    </div>
  );
};
