import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  Filter,
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  FileSpreadsheet,
  ChevronRight,
  Info,
  X,
  PieChart,
  Layers,
  HelpCircle,
  Sparkles,
  Search,
  RefreshCw,
} from 'lucide-react';
import {
  ReportCampaignData,
  ReportQuestion,
} from '../data/reportsData';
import { INITIAL_SMART_FORMS } from '../data/formsData';
import { buildReportsFromSmartForms } from '../utils/reportConverter';
import { SmartForm } from '../types';

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

  // Listen for real-time form or response submission updates
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
  const [semesterFilter, setSemesterFilter] = useState<string>('todos');
  const [campaignFilter, setCampaignFilter] = useState<string>('todos');
  const [segmentFilter, setSegmentFilter] = useState<string>('todos');

  // Active Campaign State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    reportCampaigns.length > 0 ? reportCampaigns[0].id : null
  );

  // Sync selectedCampaignId if current selection is invalid or null
  useEffect(() => {
    if (reportCampaigns.length > 0) {
      if (!selectedCampaignId || !reportCampaigns.some((c) => c.id === selectedCampaignId)) {
        setSelectedCampaignId(reportCampaigns[0].id);
      }
    } else {
      setSelectedCampaignId(null);
    }
  }, [reportCampaigns, selectedCampaignId]);

  // Segment Tab inside Right Column (Discentes | Docentes | TAEs)
  const [activeSegmentTab, setActiveSegmentTab] = useState<'Discentes' | 'Docentes' | 'TAEs'>('Discentes');

  // Modal State for Question Details
  const [selectedQuestion, setSelectedQuestion] = useState<ReportQuestion | null>(null);

  // Total summary metrics calculated dynamically from reportCampaigns
  const totalReportsCount = reportCampaigns.length;
  const finishedCampaignsCount = reportCampaigns.filter((c) => c.status === 'Finalizada').length;
  const totalResponsesSum = reportCampaigns.reduce((acc, c) => acc + (c.totalResponses || 0), 0);
  const latestReportDate = reportCampaigns.length > 0 ? reportCampaigns[0].updatedAt : 'Sem dados';

  // Filtered List of Campaigns for Left Column
  const filteredCampaigns = useMemo(() => {
    return reportCampaigns.filter((c) => {
      const matchCampus = campusFilter === 'todos' || c.campus === campusFilter;
      const matchYear = yearFilter === 'todos' || c.year === yearFilter;
      const matchSemester = semesterFilter === 'todos' || c.semester === semesterFilter;
      const matchCampaign = campaignFilter === 'todos' || c.id === campaignFilter || c.title === campaignFilter;
      return matchCampus && matchYear && matchSemester && matchCampaign;
    });
  }, [reportCampaigns, campusFilter, yearFilter, semesterFilter, campaignFilter]);

  // Selected Campaign Object
  const selectedCampaign = useMemo(() => {
    if (!selectedCampaignId) return null;
    return reportCampaigns.find((c) => c.id === selectedCampaignId) || null;
  }, [reportCampaigns, selectedCampaignId]);

  // Handle "Gerar Relatório" button click
  const handleGenerateReport = () => {
    if (filteredCampaigns.length > 0) {
      // Select the first matching campaign or keep current if it's in the list
      const currentStillValid = filteredCampaigns.some((c) => c.id === selectedCampaignId);
      if (!currentStillValid) {
        setSelectedCampaignId(filteredCampaigns[0].id);
      }
    } else {
      setSelectedCampaignId(null);
    }
  };

  // Filter questions by selected segment inside the right column
  const segmentQuestions = useMemo(() => {
    if (!selectedCampaign) return [];
    
    // Filter by tab segment
    let questions = selectedCampaign.questions.filter((q) => q.segment === activeSegmentTab);
    
    // If top filter specifies segment, also enforce it
    if (segmentFilter !== 'todos') {
      const mapped = segmentFilter === 'alunos' || segmentFilter === 'discentes' ? 'Discentes' : segmentFilter === 'docentes' ? 'Docentes' : 'TAEs';
      if (activeSegmentTab !== mapped) {
        questions = selectedCampaign.questions.filter((q) => q.segment === mapped);
      }
    }
    
    return questions;
  }, [selectedCampaign, activeSegmentTab, segmentFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Início</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#006837] font-semibold">Relatórios Institucionais</span>
          </nav>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#006837]" />
            <span>Relatórios da CPA</span>
          </h2>
        </div>
        <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs self-start sm:self-auto flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#006837]" />
          <span>Última atualização do sistema: <strong>31/07/2026</strong></span>
        </div>
      </div>

      {/* Cards Superiores (4 small metric cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Relatórios Gerados */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Relatórios Gerados
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {totalReportsCount}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Relatórios
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006837] border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Campanhas Finalizadas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Campanhas Finalizadas
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {finishedCampaignsCount}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Encerradas
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006837] border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Respostas Consolidadas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Respostas Consolidadas
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {totalResponsesSum.toLocaleString('pt-BR')}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Respostas
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006837] border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Último Relatório */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Último Relatório
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-slate-800 tracking-tight">
                {latestReportDate}
              </span>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                Status
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006837] border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-[#006837]" />
          <span>Filtros do Relatório</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          {/* Campus */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Campus</label>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
            >
              <option value="todos">Todos os Campi</option>
              <option value="IFCE Campus Tauá">IFCE Campus Tauá</option>
              <option value="IFCE Campus Fortaleza">IFCE Campus Fortaleza</option>
              <option value="IFCE Campus Crateús">IFCE Campus Crateús</option>
              <option value="IFCE Campus Juazeiro do Norte">IFCE Campus Juazeiro</option>
            </select>
          </div>

          {/* Ano */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Ano</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
            >
              <option value="todos">Todos os Anos</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Semestre */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Semestre</label>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
            >
              <option value="todos">Todos os Semestres</option>
              <option value="2026.1">2026.1</option>
              <option value="2026.2">2026.2</option>
              <option value="2025.1">2025.1</option>
              <option value="2025.2">2025.2</option>
            </select>
          </div>

          {/* Campanha */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Campanha</label>
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer truncate"
            >
              <option value="todos">Todas as Campanhas</option>
              {reportCampaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Segmento */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Segmento</label>
            <select
              value={segmentFilter}
              onChange={(e) => {
                const val = e.target.value;
                setSegmentFilter(val);
                if (val === 'discentes' || val === 'alunos') setActiveSegmentTab('Discentes');
                else if (val === 'docentes') setActiveSegmentTab('Docentes');
                else if (val === 'taes') setActiveSegmentTab('TAEs');
              }}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
            >
              <option value="todos">Todos os Segmentos</option>
              <option value="discentes">Discentes</option>
              <option value="docentes">Docentes</option>
              <option value="taes">TAEs</option>
            </select>
          </div>

          {/* Botão Gerar Relatório */}
          <div>
            <button
              onClick={handleGenerateReport}
              className="w-full h-9 px-4 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#006837]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Relatório</span>
            </button>
          </div>
        </div>
      </div>

      {/* Área Principal (Split into 2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Coluna Esquerda: Lista de Campanhas (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#006837]" />
              <span>Campanhas Avaliativas</span>
            </h3>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {filteredCampaigns.length} disponíveis
            </span>
          </div>

          {/* Campaign List */}
          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-medium text-slate-500">Nenhuma campanha encontrada com esses filtros.</p>
                <button
                  onClick={() => {
                    setCampusFilter('todos');
                    setYearFilter('todos');
                    setSemesterFilter('todos');
                    setCampaignFilter('todos');
                    setSegmentFilter('todos');
                  }}
                  className="text-[11px] font-bold text-[#006837] hover:underline cursor-pointer"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              filteredCampaigns.map((camp) => {
                const isSelected = selectedCampaignId === camp.id;
                const isFinished = camp.status === 'Finalizada';

                return (
                  <button
                    key={camp.id}
                    onClick={() => setSelectedCampaignId(camp.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-[#E8F5EE] border-[#006837] shadow-2xs ring-1 ring-[#006837]/30'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Top Row: Title + Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs font-bold leading-snug transition-colors ${
                          isSelected ? 'text-[#006837]' : 'text-slate-800 group-hover:text-slate-900'
                        }`}
                      >
                        {camp.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                          isFinished
                            ? 'bg-emerald-100/80 text-emerald-800'
                            : 'bg-amber-100/80 text-amber-800'
                        }`}
                      >
                        {isFinished ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Finalizada</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Em andamento</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Meta details */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100/70">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <strong>{camp.totalResponses}</strong> respostas
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200/60 font-semibold text-slate-600">
                        {camp.semester}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Coluna Direita: Detalhes do Relatório / Empty State (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!selectedCampaign ? (
            /* Empty State when no campaign is selected */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs">
              <div className="w-20 h-20 rounded-2xl bg-[#E8F5EE] text-[#006837] border border-[#006837]/20 flex items-center justify-center shadow-inner">
                <FileText className="w-10 h-10" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-lg font-bold text-slate-800">
                  Nenhuma campanha selecionada
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Selecione uma campanha na lista ao lado ou ajuste os filtros superiores para visualizar o resumo consolidado, dimensões e perguntas.
                </p>
              </div>
            </div>
          ) : (
            /* Detailed Report Content */
            <motion.div
              key={selectedCampaign.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Cabeçalho do Relatório com Ações de Exportação */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold bg-[#E8F5EE] text-[#006837] px-2.5 py-0.5 rounded-md border border-[#006837]/20">
                        {selectedCampaign.campus}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                        {selectedCampaign.period}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                          selectedCampaign.status === 'Finalizada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedCampaign.status === 'Finalizada' ? '🟢 Finalizada' : '🟡 Em andamento'}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                      {selectedCampaign.title}
                    </h3>
                  </div>

                  {/* Top Right Action Buttons (Export PDF, Excel, Print) */}
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <button
                      disabled
                      className="opacity-75 cursor-not-allowed px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium rounded-xl flex items-center gap-1.5"
                      title="Exportação PDF em breve"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Exportar PDF</span>
                      <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                        Em breve
                      </span>
                    </button>

                    <button
                      disabled
                      className="opacity-75 cursor-not-allowed px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium rounded-xl flex items-center gap-1.5"
                      title="Exportação Excel em breve"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                      <span>Exportar Excel</span>
                      <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                        Em breve
                      </span>
                    </button>

                    <button
                      disabled
                      className="opacity-75 cursor-not-allowed p-2 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium rounded-xl flex items-center gap-1.5"
                      title="Impressão em breve"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Imprimir</span>
                      <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                        Em breve
                      </span>
                    </button>
                  </div>
                </div>

                {/* Indicadores do Relatório (4 KPI Cards Internos) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Total de Perguntas
                    </span>
                    <p className="text-base font-extrabold text-slate-800">
                      {selectedCampaign.totalQuestions}
                    </p>
                  </div>

                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Participantes
                    </span>
                    <p className="text-base font-extrabold text-slate-800">
                      {selectedCampaign.totalResponses}
                    </p>
                  </div>

                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Taxa de Resposta
                    </span>
                    <p className="text-base font-extrabold text-[#006837]">
                      {selectedCampaign.responseRate}%
                    </p>
                  </div>

                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Tempo Médio
                    </span>
                    <p className="text-base font-extrabold text-slate-800">
                      {selectedCampaign.avgResponseTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumo Geral (Gráfico de Barras Horizontal) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#006837]" />
                    <span>Resumo Geral de Avaliação</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Metodologia Institucional CPA
                  </span>
                </div>

                {/* Progress Bar Display */}
                <div className="space-y-3">
                  {/* Single Stacked Bar Visual */}
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${selectedCampaign.potencialidadePct}%` }}
                      className="bg-[#006837] h-full transition-all duration-500"
                      title={`Potencialidades: ${selectedCampaign.potencialidadePct}%`}
                    />
                    <div
                      style={{ width: `${selectedCampaign.medianaPct}%` }}
                      className="bg-amber-500 h-full transition-all duration-500"
                      title={`Avaliação Mediana: ${selectedCampaign.medianaPct}%`}
                    />
                    <div
                      style={{ width: `${selectedCampaign.fragilidadePct}%` }}
                      className="bg-rose-500 h-full transition-all duration-500"
                      title={`Fragilidades: ${selectedCampaign.fragilidadePct}%`}
                    />
                  </div>

                  {/* Horizontal Bar Breakdown Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* Potencialidades */}
                    <div className="bg-emerald-50/60 border border-emerald-200/70 p-3.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#006837]" />
                          Potencialidades
                        </span>
                        <span className="text-sm font-extrabold text-[#006837]">
                          {selectedCampaign.potencialidadePct}%
                        </span>
                      </div>
                      <div className="w-full bg-emerald-200/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${selectedCampaign.potencialidadePct}%` }}
                          className="bg-[#006837] h-full"
                        />
                      </div>
                    </div>

                    {/* Mediana */}
                    <div className="bg-amber-50/60 border border-amber-200/70 p-3.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          Avaliação Mediana
                        </span>
                        <span className="text-sm font-extrabold text-amber-700">
                          {selectedCampaign.medianaPct}%
                        </span>
                      </div>
                      <div className="w-full bg-amber-200/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${selectedCampaign.medianaPct}%` }}
                          className="bg-amber-500 h-full"
                        />
                      </div>
                    </div>

                    {/* Fragilidades */}
                    <div className="bg-rose-50/60 border border-rose-200/70 p-3.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          Fragilidades
                        </span>
                        <span className="text-sm font-extrabold text-rose-700">
                          {selectedCampaign.fragilidadePct}%
                        </span>
                      </div>
                      <div className="w-full bg-rose-200/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${selectedCampaign.fragilidadePct}%` }}
                          className="bg-rose-500 h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultado por Dimensão (Tabela) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#006837]" />
                    <span>Resultado por Dimensão Avaliativa</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedCampaign.dimensions.length} dimensões mapeadas
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Dimensão</th>
                        <th className="py-2.5 px-3 text-center">Potencialidade</th>
                        <th className="py-2.5 px-3 text-center">Mediana</th>
                        <th className="py-2.5 px-3 text-center">Fragilidade</th>
                        <th className="py-2.5 px-3 text-right">Classificação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCampaign.dimensions.map((dim, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {dim.dimension}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-[#006837]">
                            {dim.potencialidadePct}%
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-amber-600">
                            {dim.medianaPct}%
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-rose-600">
                            {dim.fragilidadePct}%
                          </td>
                          <td className="py-3 px-3 text-right">
                            {dim.classification === 'Potencialidade' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                🟢 Potencialidade
                              </span>
                            )}
                            {dim.classification === 'Mediana' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                🟡 Mediana
                              </span>
                            )}
                            {dim.classification === 'Fragilidade' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                🔴 Fragilidade
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resultado por Segmento (3 Abas + Lista de Perguntas) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#006837]" />
                      <span>Resultado por Segmento</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-normal">
                      Selecione um segmento para filtrar as perguntas correspondentes
                    </p>
                  </div>

                  {/* 3 Abas: Discentes | Docentes | TAEs */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                    <button
                      onClick={() => setActiveSegmentTab('Discentes')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeSegmentTab === 'Discentes'
                          ? 'bg-white text-[#006837] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Discentes
                    </button>
                    <button
                      onClick={() => setActiveSegmentTab('Docentes')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeSegmentTab === 'Docentes'
                          ? 'bg-white text-[#006837] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Docentes
                    </button>
                    <button
                      onClick={() => setActiveSegmentTab('TAEs')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeSegmentTab === 'TAEs'
                          ? 'bg-white text-[#006837] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      TAEs
                    </button>
                  </div>
                </div>

                {/* Question Cards List */}
                <div className="space-y-3 pt-2">
                  {segmentQuestions.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500">
                      Nenhuma pergunta registrada para este segmento nesta campanha.
                    </div>
                  ) : (
                    segmentQuestions.map((q) => {
                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {q.category}
                              </span>
                              <span className="text-[10px] font-bold bg-[#E8F5EE] text-[#006837] px-2 py-0.5 rounded-md">
                                {q.segment}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 leading-relaxed">
                              {q.questionText}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            {/* Classification Badge */}
                            <div className="text-right">
                              {q.classification === 'Potencialidade' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  🟢 Potencialidade ({q.approvalRate}%)
                                </span>
                              )}
                              {q.classification === 'Mediana' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                  🟡 Mediana ({q.approvalRate}%)
                                </span>
                              )}
                              {q.classification === 'Fragilidade' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                  🔴 Fragilidade ({q.approvalRate}%)
                                </span>
                              )}
                            </div>

                            {/* Button Ver detalhes */}
                            <button
                              onClick={() => setSelectedQuestion(q)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006837] text-xs font-bold rounded-xl border border-emerald-200/80 transition-colors cursor-pointer active:scale-95"
                            >
                              Ver detalhes
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pop-up da Pergunta (Modal) */}
      <AnimatePresence>
        {selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuestion(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-6 space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8F5EE] text-[#006837] px-2.5 py-0.5 rounded-md">
                    Detalhes da Resposta
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                    {selectedQuestion.questionText}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Meta Info Pill Row */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Categoria</span>
                  <strong className="text-slate-800 font-bold">{selectedQuestion.category}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Segmento</span>
                  <strong className="text-slate-800 font-bold">{selectedQuestion.segment}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Respostas</span>
                  <strong className="text-slate-800 font-bold">{selectedQuestion.totalAnswers}</strong>
                </div>
              </div>

              {/* Tabela das Alternativas */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Distribuição de Respostas por Alternativa
                </h4>
                <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200/80">
                        <th className="py-2 px-3">Alternativa</th>
                        <th className="py-2 px-3 text-center">Qtd.</th>
                        <th className="py-2 px-3 text-center">Percentual</th>
                        <th className="py-2 px-3 text-right">Distribuição</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedQuestion.alternatives.map((alt, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{alt.option}</td>
                          <td className="py-2.5 px-3 text-center font-medium text-slate-600">{alt.count}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-[#006837]">
                            {alt.percentage}%
                          </td>
                          <td className="py-2.5 px-3 text-right w-28">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${alt.percentage}%` }}
                                className="bg-[#006837] h-full rounded-full"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Classificação Metodologia CPA */}
              <div className="p-3.5 rounded-xl border flex items-center justify-between gap-3 bg-slate-50/80 border-slate-200">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Classificação Metodológica CPA
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Métrica calculada com base no somatório das respostas Ótimo e Bom.
                  </p>
                </div>

                <div>
                  {selectedQuestion.classification === 'Potencialidade' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🟢 Potencialidade
                    </span>
                  )}
                  {selectedQuestion.classification === 'Mediana' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      🟡 Mediana
                    </span>
                  )}
                  {selectedQuestion.classification === 'Fragilidade' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      🔴 Fragilidade
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
