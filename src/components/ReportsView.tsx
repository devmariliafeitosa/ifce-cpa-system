import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  FileDown,
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  Filter,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Info,
  X,
  PieChart,
  Layers,
  HelpCircle,
  AlertTriangle,
  Search,
  Building2,
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers3,
  ListFilter,
  Eye,
} from 'lucide-react';
import {
  ReportCampaignData,
  ReportQuestion,
  ReportDimensionResult,
} from '../data/reportsData';
import { INITIAL_SMART_FORMS } from '../data/formsData';
import { buildReportsFromSmartForms } from '../utils/reportConverter';
import { SmartForm } from '../types';
import { CpaPdfReportModal } from './CpaPdfReportModal';

interface ReportsViewProps {
  onReturnToDashboard?: () => void;
}

// Custom SVG Donut Chart Component
const DonutChart: React.FC<{
  potencialidadePct: number;
  medianaPct: number;
  fragilidadePct: number;
  size?: number;
}> = ({ potencialidadePct, medianaPct, fragilidadePct, size = 140 }) => {
  const radius = 52;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~326.72

  const len1 = Math.max(0, (potencialidadePct / 100) * circumference);
  const len2 = Math.max(0, (medianaPct / 100) * circumference);
  const len3 = Math.max(0, (fragilidadePct / 100) * circumference);

  const offset1 = 0;
  const offset2 = len1;
  const offset3 = len1 + len2;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 130 130" className="-rotate-90 transform">
        {/* Track Background */}
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="transparent"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        {/* Segment 1: Potencialidade */}
        {potencialidadePct > 0 && (
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="transparent"
            stroke="#006837"
            strokeWidth={strokeWidth}
            strokeDasharray={`${len1} ${circumference - len1}`}
            strokeDashoffset={-offset1}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}
        {/* Segment 2: Mediana */}
        {medianaPct > 0 && (
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${len2} ${circumference - len2}`}
            strokeDashoffset={-offset2}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}
        {/* Segment 3: Fragilidade */}
        {fragilidadePct > 0 && (
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="transparent"
            stroke="#e11d48"
            strokeWidth={strokeWidth}
            strokeDasharray={`${len3} ${circumference - len3}`}
            strokeDashoffset={-offset3}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 pointer-events-none">
        <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
          {potencialidadePct}%
        </span>
        <span className="text-[9px] font-bold text-[#006837] uppercase tracking-wider mt-0.5">
          Potencialidade
        </span>
      </div>
    </div>
  );
};

export const ReportsView: React.FC<ReportsViewProps> = () => {
  // Dynamic Report Campaigns state from LocalStorage / Initial Forms
  const [reportCampaigns, setReportCampaigns] = useState<ReportCampaignData[]>(() => {
    const savedForms = localStorage.getItem('cpa_smart_forms');
    const forms: SmartForm[] = savedForms ? JSON.parse(savedForms) : INITIAL_SMART_FORMS;
    return buildReportsFromSmartForms(forms);
  });

  // Real-time synchronization
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

  // Filter States (Campus, Ano)
  const [campusFilter, setCampusFilter] = useState<string>('todos');
  const [yearFilter, setYearFilter] = useState<string>('todos');

  // Selected Campaign State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    reportCampaigns.length > 0 ? reportCampaigns[0].id : null
  );

  // Campaign Selector Dropdown state
  const [isCampaignSelectorOpen, setIsCampaignSelectorOpen] = useState(false);
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('');

  // Selected Area / Dimension for Main View
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  // Drawer Area / Dimension State (Side Drawer for Area Details)
  const [drawerDimension, setDrawerDimension] = useState<ReportDimensionResult | null>(null);

  // Accordion State for Questions (single question open at a time)
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Question Segment Tab (Todos | Discentes | Docentes | TAEs)
  const [activeQuestionSegment, setActiveQuestionSegment] = useState<'Todos' | 'Discentes' | 'Docentes' | 'TAEs'>('Todos');

  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Quick Nav active section
  const [activeNavSection, setActiveNavSection] = useState<'resumo' | 'indicadores' | 'areas' | 'perguntas'>('resumo');

  // Sync selectedCampaignId if list updates
  useEffect(() => {
    if (reportCampaigns.length > 0) {
      if (!selectedCampaignId || !reportCampaigns.some((c) => c.id === selectedCampaignId)) {
        setSelectedCampaignId(reportCampaigns[0].id);
      }
    } else {
      setSelectedCampaignId(null);
    }
  }, [reportCampaigns, selectedCampaignId]);

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

  // Filtered campaigns for top selector
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

  // Toggle Accordion Question (Single question open at a time)
  const toggleQuestionAccordion = (questionId: string) => {
    setExpandedQuestionId((prev) => (prev === questionId ? null : questionId));
  };

  // Questions for the main section filtered by dimension and active segment
  const mainQuestions = useMemo(() => {
    if (!selectedCampaign) return [];
    let qs = selectedCampaign.questions;

    // Filter by selected dimension
    if (selectedDimension) {
      qs = qs.filter((q) => q.category === selectedDimension);
    }

    // Filter by active segment tab
    qs = qs.filter((q) => q.segment === activeQuestionSegment);

    return qs;
  }, [selectedCampaign, selectedDimension, activeQuestionSegment]);

  // Questions for the Drawer
  const drawerQuestions = useMemo(() => {
    if (!selectedCampaign || !drawerDimension) return [];
    return selectedCampaign.questions.filter(
      (q) => q.category === drawerDimension.dimension && q.segment === activeQuestionSegment
    );
  }, [selectedCampaign, drawerDimension, activeQuestionSegment]);

  // Scroll handler for Quick Nav Rail
  const scrollToSection = (sectionId: string) => {
    setActiveNavSection(sectionId as any);
    const element = document.getElementById(`sec-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Category Icon Helper
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('infra')) return <Building2 className="w-4 h-4 text-[#006837]" />;
    if (cat.includes('biblio')) return <BookOpen className="w-4 h-4 text-blue-600" />;
    if (cat.includes('ensino')) return <GraduationCap className="w-4 h-4 text-[#006837]" />;
    if (cat.includes('gestã') || cat.includes('gestao')) return <Award className="w-4 h-4 text-amber-600" />;
    if (cat.includes('assistê') || cat.includes('estudant')) return <Users className="w-4 h-4 text-purple-600" />;
    return <Layers className="w-4 h-4 text-[#006837]" />;
  };

  return (
    <div className="w-full max-w-[95%] xl:max-w-[1440px] mx-auto px-2 sm:px-4 py-4 space-y-4.5 relative">
      {/* =====================================================================
          1. CABEÇALHO & FILTROS EM LINHA ÚNICA
         ===================================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* À esquerda: Título e Identificação da Campanha */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-1.5 bg-emerald-100/80 text-[#006837] rounded-lg flex-shrink-0">
            <BarChart3 className="w-4 h-4" />
          </span>
          <div className="truncate">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {selectedCampaign ? selectedCampaign.title : 'Relatórios CPA'}
            </h1>
            {selectedCampaign && (
              <p className="text-[11px] font-medium text-slate-500 truncate">
                {selectedCampaign.campus} • Período {selectedCampaign.period}
              </p>
            )}
          </div>
        </div>

        {/* À direita: Filtros em linha única (Campus | Ano | Campanha | Exportar PDF) */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap lg:justify-end">
          {/* Filtro de Campus */}
          <select
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] cursor-pointer"
          >
            <option value="todos">Todos Campi</option>
            {availableCampuses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Filtro de Ano */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] cursor-pointer"
          >
            <option value="todos">Todos Anos</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Seletor da Campanha */}
          <div className="relative min-w-[170px] sm:min-w-[210px]">
            <button
              onClick={() => setIsCampaignSelectorOpen(!isCampaignSelectorOpen)}
              className="w-full h-9 px-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-bold text-slate-800 flex items-center justify-between gap-1.5 shadow-2xs transition-all cursor-pointer text-left"
            >
              <span className="truncate">
                {selectedCampaign ? selectedCampaign.title : 'Selecione uma campanha'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform ${
                  isCampaignSelectorOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu da Campanha */}
            <AnimatePresence>
              {isCampaignSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute right-0 top-full mt-1.5 z-40 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 space-y-2 w-72 sm:w-80 overflow-hidden flex flex-col"
                >
                  <div className="relative flex-shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={campaignSearchTerm}
                      onChange={(e) => setCampaignSearchTerm(e.target.value)}
                      placeholder="Pesquisar campanha..."
                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837]"
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 flex-1">
                    {filteredCampaignsList.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Nenhuma campanha encontrada.
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

          {/* Botão Exportar PDF */}
          <button
            onClick={() => setIsPdfModalOpen(true)}
            disabled={!selectedCampaign}
            className="h-9 px-3.5 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {selectedCampaign ? (
        <div className="space-y-4">
          {/* =====================================================================
              2. CARDS SUPERIORES COMPACTOS (4 EM UMA ÚNICA LINHA)
             ===================================================================== */}
          <section id="sec-resumo" className="scroll-mt-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1: Perguntas */}
              <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-3 shadow-2xs hover:shadow-xs transition-all space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Perguntas
                  </span>
                  <div className="p-1.5 bg-slate-100 rounded-md text-slate-600">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 tracking-tight block leading-tight">
                    {selectedCampaign.totalQuestions}
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Itens no instrumento
                  </p>
                </div>
              </div>

              {/* Card 2: Respondentes */}
              <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-3 shadow-2xs hover:shadow-xs transition-all space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Respondentes
                  </span>
                  <div className="p-1.5 bg-emerald-50 rounded-md text-[#006837]">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-[#006837] tracking-tight block leading-tight">
                    {selectedCampaign.totalResponses.toLocaleString('pt-BR')}
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Participações validadas
                  </p>
                </div>
              </div>

              {/* Card 3: Taxa de Resposta */}
              <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-3 shadow-2xs hover:shadow-xs transition-all space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Taxa de Resposta
                  </span>
                  <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 tracking-tight block leading-tight">
                    {selectedCampaign.responseRate}%
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Adesão da comunidade
                  </p>
                </div>
              </div>

              {/* Card 4: Tempo Médio */}
              <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-3 shadow-2xs hover:shadow-xs transition-all space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Tempo Médio
                  </span>
                  <div className="p-1.5 bg-amber-50 rounded-md text-amber-600">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 tracking-tight block leading-tight">
                    {selectedCampaign.avgResponseTime} min
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Duração por formulário
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              3. INDICADORES GERAIS (LEGENDA AO LADO DO GRÁFICO COMPACTO)
             ===================================================================== */}
          <section id="sec-indicadores" className="scroll-mt-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  Indicadores Gerais da Campanha
                </h2>
                <p className="text-[11px] text-slate-500">
                  Classificação consolidada do instrumento
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6 py-1">
                {/* Donut Chart Compacto */}
                <DonutChart
                  potencialidadePct={selectedCampaign.potencialidadePct}
                  medianaPct={selectedCampaign.medianaPct}
                  fragilidadePct={selectedCampaign.fragilidadePct}
                  size={130}
                />

                {/* Legenda dos Indicadores ao Lado */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-2xl">
                  {/* Potencialidade */}
                  <div className="px-3 py-2 bg-emerald-50/70 border border-emerald-200/80 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006837] flex-shrink-0" />
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 block leading-tight">
                          Potencialidade
                        </span>
                        <span className="text-[10px] text-slate-500">Aprovação ≥ 70%</span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-[#006837]">
                      {selectedCampaign.potencialidadePct}%
                    </span>
                  </div>

                  {/* Mediana */}
                  <div className="px-3 py-2 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 block leading-tight">
                          Mediana
                        </span>
                        <span className="text-[10px] text-slate-500">50% – 69%</span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-amber-600">
                      {selectedCampaign.medianaPct}%
                    </span>
                  </div>

                  {/* Fragilidade */}
                  <div className="px-3 py-2 bg-rose-50/70 border border-rose-200/80 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 block leading-tight">
                          Fragilidade
                        </span>
                        <span className="text-[10px] text-slate-500">Aprovação &lt; 50%</span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-rose-600">
                      {selectedCampaign.fragilidadePct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              4. RESULTADOS POR ÁREA (CARDS COMPACTOS ~90PX, 4-5 POR LINHA)
             ===================================================================== */}
          <section id="sec-areas" className="scroll-mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  Resultados por Área Avaliada
                </h2>
                <p className="text-[11px] text-slate-500">
                  Desempenho por dimensão da CPA
                </p>
              </div>

              {selectedDimension && (
                <button
                  onClick={() => setSelectedDimension(null)}
                  className="text-xs font-bold text-[#006837] hover:underline cursor-pointer"
                >
                  Exibir Todas
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {selectedCampaign.dimensions.map((dim) => {
                const isSelected = selectedDimension === dim.dimension;
                return (
                  <div
                    key={dim.dimension}
                    onClick={() => {
                      setSelectedDimension(isSelected ? null : dim.dimension);
                      scrollToSection('perguntas');
                    }}
                    className={`bg-white border rounded-xl px-3 py-2.5 h-[88px] transition-all flex flex-col justify-between relative cursor-pointer ${
                      isSelected
                        ? 'border-[#006837] ring-2 ring-[#006837]/20 shadow-2xs bg-emerald-50/20'
                        : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    {/* Header: Icon & Area Name */}
                    <div className="flex items-center justify-between gap-1.5">
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
                        title="Ver Detalhes"
                        className="p-1 hover:bg-emerald-100 text-[#006837] rounded-md transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Value & Compact Classification Badge */}
                    <div className="flex items-baseline justify-between pt-0.5">
                      <span className="text-lg font-black text-slate-900 tracking-tight">
                        {dim.potencialidadePct}%
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                          dim.classification === 'Potencialidade'
                            ? 'bg-emerald-100 text-[#006837]'
                            : dim.classification === 'Mediana'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {dim.classification}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =====================================================================
              5. PERGUNTAS (ACCORDION COMPACTO - 1 PERGUNTA ABERTA POR VEZ)
             ===================================================================== */}
          <section id="sec-perguntas" className="scroll-mt-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-4">
              {/* Header com Filtro de Área & Tabs Fixas de Segmento */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Perguntas {selectedDimension ? `• ${selectedDimension}` : '• Todas as Áreas'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Clique em uma pergunta para abrir os detalhes (apenas uma permanece expandida por vez)
                  </p>
                </div>

                {/* Tabs de Segmentos permanentes */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
                  {(['Todos', 'Discentes', 'Docentes', 'TAEs'] as const).map((seg) => (
                    <button
                      key={seg}
                      onClick={() => setActiveQuestionSegment(seg)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        activeQuestionSegment === seg
                          ? 'bg-white text-[#006837] shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista Accordion de Perguntas */}
              {mainQuestions.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  Nenhuma pergunta encontrada para os filtros selecionados.
                </div>
              ) : (
                <div className="space-y-2">
                  {mainQuestions.map((q) => {
                    const isExpanded = expandedQuestionId === q.id;
                    return (
                      <div
                        key={q.id}
                        className={`border rounded-lg transition-all overflow-hidden bg-white ${
                          isExpanded
                            ? 'border-[#006837] ring-1 ring-[#006837]/30 shadow-2xs'
                            : 'border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        {/* Cabeçalho do Accordion (Modo Compacto) */}
                        <button
                          onClick={() => toggleQuestionAccordion(q.id)}
                          className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`p-0.5 rounded-md transition-transform ${
                                isExpanded ? 'rotate-90 text-[#006837]' : 'text-slate-400'
                              }`}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </span>
                            <div className="truncate">
                              <h3 className="text-xs font-bold text-slate-800 truncate">
                                {q.questionText}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
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
                          </div>
                        </button>

                        {/* Conteudo Expandido (Detalhes da Pergunta) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-4"
                            >
                              {/* Barra de Progresso e Percentuais */}
                              <div className="space-y-2.5 max-w-2xl">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                  <span>Distribuição das Avaliações</span>
                                  <span className="text-[#006837] font-black">{q.approvalRate}% Aprovação</span>
                                </div>

                                <div className="space-y-1.5">
                                  {q.alternatives.map((alt, idx) => (
                                    <div key={idx} className="space-y-0.5">
                                      <div className="flex justify-between text-xs font-medium text-slate-700">
                                        <span>{alt.option}</span>
                                        <span className="font-extrabold text-slate-900">
                                          {alt.percentage}% ({alt.count.toLocaleString('pt-BR')})
                                        </span>
                                      </div>
                                      <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                                        <div
                                          style={{ width: `${alt.percentage}%` }}
                                          className={`h-full rounded-full transition-all ${
                                            idx === 0
                                              ? 'bg-[#006837]'
                                              : idx === 1
                                              ? 'bg-amber-400'
                                              : idx === 2
                                              ? 'bg-rose-500'
                                              : 'bg-slate-400'
                                          }`}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Métricas Adicionais */}
                              <div className="pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center gap-5 text-xs text-slate-600 font-semibold">
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-[#006837]" />
                                  <span>Respondentes: <strong className="text-slate-900">{q.totalAnswers.toLocaleString('pt-BR')}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Tempo médio: <strong className="text-slate-900">18 segundos</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Segmento: <strong className="text-slate-900">{activeQuestionSegment}</strong></span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500 text-xs">
          Selecione uma campanha no seletor para visualizar o relatório executivo.
        </div>
      )}

      {/* =====================================================================
          5. DRAWER LATERAL (PAINEL LATERAL DIREITA PARA DETALHES DA ÁREA)
         ===================================================================== */}
      <AnimatePresence>
        {drawerDimension && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerDimension(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Painel Lateral */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-lg sm:max-w-xl bg-white shadow-2xl flex flex-col"
              >
                {/* Header do Drawer */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200">
                      {getCategoryIcon(drawerDimension.dimension)}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">
                        {drawerDimension.dimension}
                      </h2>
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider mt-0.5 ${
                          drawerDimension.classification === 'Potencialidade'
                            ? 'bg-emerald-100 text-[#006837]'
                            : drawerDimension.classification === 'Mediana'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {drawerDimension.classification} ({drawerDimension.potencialidadePct}%)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDrawerDimension(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Conteúdo do Drawer */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {/* Segment Tabs no Drawer */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <span className="text-xs font-extrabold text-slate-600">
                      Filtrar por Segmento:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      {(['Todos', 'Discentes', 'Docentes', 'TAEs'] as const).map((seg) => (
                        <button
                          key={seg}
                          onClick={() => setActiveQuestionSegment(seg)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeQuestionSegment === seg
                              ? 'bg-white text-[#006837] shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {seg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Perguntas da Área no Drawer */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Perguntas desta dimensão ({drawerQuestions.length})
                    </h3>

                    {drawerQuestions.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                        Nenhuma pergunta encontrada para este segmento nesta área.
                      </div>
                    ) : (
                      drawerQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-800 leading-snug">
                              {q.questionText}
                            </h4>
                            <span className="text-[10px] font-black text-[#006837] bg-emerald-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                              {q.approvalRate}%
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {q.alternatives.map((alt, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <div className="flex justify-between text-[11px] text-slate-600">
                                  <span>{alt.option}</span>
                                  <span className="font-bold">{alt.percentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    style={{ width: `${alt.percentage}%` }}
                                    className={`h-full rounded-full ${
                                      idx === 0 ? 'bg-[#006837]' : idx === 1 ? 'bg-amber-400' : 'bg-rose-500'
                                    }`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer do Drawer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
                  <button
                    onClick={() => setDrawerDimension(null)}
                    className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Fechar Painel
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          9. BARRA LATERAL DE NAVEGAÇÃO RÁPIDA (FLOATING QUICK NAV RAIL)
         ===================================================================== */}
      <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 bg-white/90 backdrop-blur-md border border-slate-200 p-2 rounded-2xl shadow-lg">
        <button
          onClick={() => scrollToSection('resumo')}
          title="Resumo Geral"
          className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
            activeNavSection === 'resumo'
              ? 'bg-[#006837] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Resumo
          </span>
        </button>

        <button
          onClick={() => scrollToSection('indicadores')}
          title="Indicadores Gerais"
          className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
            activeNavSection === 'indicadores'
              ? 'bg-[#006837] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Indicadores
          </span>
        </button>

        <button
          onClick={() => scrollToSection('areas')}
          title="Resultados por Área"
          className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
            activeNavSection === 'areas'
              ? 'bg-[#006837] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Áreas
          </span>
        </button>

        <button
          onClick={() => scrollToSection('perguntas')}
          title="Perguntas da Área"
          className={`p-2.5 rounded-xl transition-all cursor-pointer relative group ${
            activeNavSection === 'perguntas'
              ? 'bg-[#006837] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Perguntas
          </span>
        </button>
      </div>

      {/* MODAL DE PDF */}
      <CpaPdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        campaign={selectedCampaign}
      />
    </div>
  );
};

