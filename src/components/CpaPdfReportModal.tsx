import React, { useRef, useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Building2,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ReportCampaignData, ReportQuestion } from '../data/reportsData';
import { IFCELogo } from './IFCELogo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CpaPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: ReportCampaignData | null;
}

export const CpaPdfReportModal: React.FC<CpaPdfReportModalProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen || !campaign) return null;

  // Group questions by dimension/category using segment 'Todos'
  const todosQuestions = campaign.questions.filter((q) => q.segment === 'Todos');
  const dimensionMap = new Map<string, ReportQuestion[]>();

  // Ensure standard dimensions appear if present or fallback
  todosQuestions.forEach((q) => {
    const cat = q.category || 'Geral';
    if (!dimensionMap.has(cat)) {
      dimensionMap.set(cat, []);
    }
    dimensionMap.get(cat)!.push(q);
  });

  const dimensionEntries = Array.from(dimensionMap.entries());

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('infra')) return <Building2 className="w-5 h-5 text-[#006837]" />;
    if (cat.includes('biblio')) return <BookOpen className="w-5 h-5 text-blue-600" />;
    if (cat.includes('ensino')) return <GraduationCap className="w-5 h-5 text-[#006837]" />;
    if (cat.includes('gestã') || cat.includes('gestao')) return <Award className="w-5 h-5 text-amber-600" />;
    if (cat.includes('assistê') || cat.includes('estudant')) return <Users className="w-5 h-5 text-purple-600" />;
    return <Layers className="w-5 h-5 text-[#006837]" />;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const element = printRef.current;
      const pages = element.querySelectorAll<HTMLElement>('.pdf-page');

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      const sanitizeFileName = campaign.title.replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Relatorio_CPA_IFCE_${sanitizeFileName}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      // Fallback to window.print if html2canvas faces issues
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 md:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Modal Card */}
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:w-full print:rounded-none">
        {/* Top Controls Bar (Hidden in Print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006837] flex items-center justify-center text-white shadow-sm">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Relatório Institucional CPA - IFCE
              </h2>
              <p className="text-xs text-slate-400">
                Documento Oficial de Avaliação • {campaign.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
              title="Imprimir / Salvar em PDF pelo Navegador"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Imprimir / PDF Navegador</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Arquivo PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Document Container - Scrollable in Modal */}
        <div className="p-4 md:p-8 bg-slate-100 overflow-y-auto space-y-8 print:p-0 print:bg-white print:space-y-0 print:overflow-visible">
          {/* Printable Element */}
          <div ref={printRef} className="space-y-8 print:space-y-0">
            {/* =====================================================================
                PÁGINA 1: CAPA (COVER PAGE)
               ===================================================================== */}
            <div className="pdf-page bg-white w-full min-h-[1050px] p-12 md:p-16 flex flex-col justify-between border border-slate-200 shadow-sm mx-auto max-w-[800px] print:border-0 print:shadow-none print:w-full print:h-[297mm] print:min-h-0 print:max-w-none print:page-break-after-always">
              {/* Header Logos */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-[#006837] pb-6 mb-12">
                  <IFCELogo variant="full" showSubtitle={true} />
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600 block">
                      SISTEMA DE AVALIAÇÃO
                    </span>
                    <span className="text-xs font-extrabold text-[#006837] tracking-tight">
                      CPA IFCE
                    </span>
                  </div>
                </div>

                {/* Main Cover Title */}
                <div className="my-16 space-y-6 text-center">
                  <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-[#006837] text-xs font-bold rounded-full uppercase tracking-wider">
                    Relatório Institucional de Autoavaliação
                  </div>

                  <h1 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight max-w-xl mx-auto">
                    {campaign.title}
                  </h1>

                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Resultados consolidados dos processos avaliativos conduzidos pela Comissão Própria de Avaliação do Instituto Federal do Ceará.
                  </p>
                </div>
              </div>

              {/* Cover Metadata Box */}
              <div className="space-y-8">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-600 font-medium block">Campus Avaliado:</span>
                    <span className="font-extrabold text-slate-800 text-sm">{campaign.campus}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-600 font-medium block">Período de Referência:</span>
                    <span className="font-extrabold text-slate-800 text-sm">{campaign.period} ({campaign.year})</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-600 font-medium block">Total de Participantes:</span>
                    <span className="font-extrabold text-[#006837] text-sm">
                      {campaign.totalResponses.toLocaleString('pt-BR')} respondentes
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-600 font-medium block">Data da Emissão:</span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Cover Footer Note */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>Instituto Federal do Ceará • IFCE</span>
                  <span>Comissão Própria de Avaliação (CPA)</span>
                </div>
              </div>
            </div>

            {/* =====================================================================
                PÁGINA 2: RESUMO GERAL (GENERAL SUMMARY)
               ===================================================================== */}
            <div className="pdf-page bg-white w-full min-h-[1050px] p-12 md:p-16 flex flex-col justify-between border border-slate-200 shadow-sm mx-auto max-w-[800px] print:border-0 print:shadow-none print:w-full print:h-[297mm] print:min-h-0 print:max-w-none print:page-break-after-always">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
                  <IFCELogo variant="compact" showSubtitle={false} />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Página 02 • Resumo Geral
                  </span>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mb-1">
                    01. Resumo Geral da Avaliação
                  </h2>
                  <p className="text-xs text-slate-600">
                    Visão executiva dos indicadores chave de participação e classificações do campus.
                  </p>
                </div>

                {/* 4 KPI Indicator Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <span className="text-[11px] font-semibold text-slate-600 block">Perguntas</span>
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                      {campaign.totalQuestions}
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">questões avaliadas</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <span className="text-[11px] font-semibold text-slate-600 block">Participantes</span>
                    <span className="text-2xl font-extrabold text-[#006837] tracking-tight">
                      {campaign.totalResponses.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">respostas válidas</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <span className="text-[11px] font-semibold text-slate-600 block">Tempo Médio</span>
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                      {campaign.avgResponseTime}
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">por preenchimento</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <span className="text-[11px] font-semibold text-slate-600 block">Taxa de Resposta</span>
                    <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                      {campaign.responseRate}%
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">do público estimado</span>
                  </div>
                </div>

                {/* Graphical Synthesis Block */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                    Resumo Gráfico do Desempenho Institucional
                  </h3>

                  {/* Progress Stack */}
                  <div className="space-y-2">
                    <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${campaign.potencialidadePct}%` }}
                        className="bg-[#006837] h-full transition-all"
                        title={`Potencialidades: ${campaign.potencialidadePct}%`}
                      />
                      <div
                        style={{ width: `${campaign.medianaPct}%` }}
                        className="bg-amber-500 h-full transition-all"
                        title={`Avaliações Medianas: ${campaign.medianaPct}%`}
                      />
                      <div
                        style={{ width: `${campaign.fragilidadePct}%` }}
                        className="bg-rose-600 h-full transition-all"
                        title={`Fragilidades: ${campaign.fragilidadePct}%`}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#006837] mr-1.5" />
                        <span className="font-semibold text-slate-700">Potencialidades</span>
                        <div className="text-lg font-extrabold text-[#006837] mt-0.5">
                          {campaign.potencialidadePct}%
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" />
                        <span className="font-semibold text-slate-700">Medianas</span>
                        <div className="text-lg font-extrabold text-amber-600 mt-0.5">
                          {campaign.medianaPct}%
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-600 mr-1.5" />
                        <span className="font-semibold text-slate-700">Fragilidades</span>
                        <div className="text-lg font-extrabold text-rose-600 mt-0.5">
                          {campaign.fragilidadePct}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Synthesis Note */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-[#006837] block mb-1">Síntese Metodológica da CPA:</span>
                  Os dados apresentados foram ponderados com base nos critérios fixados pela Resolução da Comissão Própria de Avaliação do IFCE. As dimensões com percentual de aprovação igual ou superior a 70% são classificadas como <strong>Potencialidades</strong>; entre 50% e 69% como <strong>Avaliações Medianas</strong>; e abaixo de 50% como <strong>Fragilidades</strong>.
                </div>
              </div>

              {/* Page Footer */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>Relatório de Avaliação Institucional • IFCE {campaign.campus}</span>
                <span>CPA IFCE</span>
              </div>
            </div>

            {/* =====================================================================
                PÁGINAS SEGUINTES: UMA PÁGINA OBRIGATÓRIA POR DIMENSÃO (CATEGORIA)
               ===================================================================== */}
            {dimensionEntries.map(([categoryName, questions], index) => {
              // Calculate category status
              let potCount = 0;
              let medCount = 0;
              let fragCount = 0;

              questions.forEach((q) => {
                if (q.classification === 'Potencialidade') potCount++;
                else if (q.classification === 'Mediana') medCount++;
                else fragCount++;
              });

              const totalQ = questions.length;
              const potPct = totalQ > 0 ? Math.round((potCount / totalQ) * 100) : 0;
              const fragPct = totalQ > 0 ? Math.round((fragCount / totalQ) * 100) : 0;

              let catStatus: 'Potencialidade' | 'Mediana' | 'Fragilidade' = 'Mediana';
              if (potPct >= 60) catStatus = 'Potencialidade';
              else if (fragPct >= 40) catStatus = 'Fragilidade';

              return (
                <div
                  key={categoryName}
                  className="pdf-page bg-white w-full min-h-[1050px] p-12 md:p-16 flex flex-col justify-between border border-slate-200 shadow-sm mx-auto max-w-[800px] print:border-0 print:shadow-none print:w-full print:h-[297mm] print:min-h-0 print:max-w-none print:page-break-before-always print:page-break-after-always"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                      <IFCELogo variant="compact" showSubtitle={false} />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Dimensão 0{index + 1} • {categoryName}
                      </span>
                    </div>

                    {/* Category Title & Badge */}
                    <div className="flex items-center justify-between mb-6 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-lg shadow-xs">
                          {getCategoryIcon(categoryName)}
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            {categoryName}
                          </h3>
                          <span className="text-xs text-slate-600">
                            {questions.length} {questions.length === 1 ? 'pergunta avaliada' : 'perguntas avaliadas'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            catStatus === 'Potencialidade'
                              ? 'bg-emerald-100 text-[#006837]'
                              : catStatus === 'Mediana'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {catStatus === 'Potencialidade' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {catStatus === 'Mediana' && <HelpCircle className="w-3.5 h-3.5" />}
                          {catStatus === 'Fragilidade' && <AlertTriangle className="w-3.5 h-3.5" />}
                          {catStatus}
                        </span>
                      </div>
                    </div>

                    {/* Questions List for this dimension */}
                    <div className="space-y-6">
                      {questions.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="border border-slate-200 rounded-xl p-4 bg-white space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase text-slate-600 block">
                                Questão {qIdx + 1}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800 leading-snug">
                                {q.questionText}
                              </h4>
                            </div>

                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold whitespace-nowrap ${
                                q.classification === 'Potencialidade'
                                  ? 'bg-emerald-50 text-[#006837] border border-emerald-200'
                                  : q.classification === 'Mediana'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {q.classification} ({q.approvalRate}%)
                            </span>
                          </div>

                          {/* Alternatives Bar breakdown */}
                          <div className="space-y-2 pt-1 border-t border-slate-100">
                            {q.alternatives.map((alt, aIdx) => (
                              <div key={aIdx} className="space-y-1 text-[11px]">
                                <div className="flex justify-between font-medium text-slate-700">
                                  <span>{alt.option}</span>
                                  <span className="font-bold text-slate-900">
                                    {alt.percentage}% ({alt.count.toLocaleString('pt-BR')} respostas)
                                  </span>
                                </div>

                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    style={{ width: `${alt.percentage}%` }}
                                    className={`h-full rounded-full transition-all ${
                                      aIdx === 0
                                        ? 'bg-[#006837]'
                                        : aIdx === 1
                                        ? 'bg-emerald-500'
                                        : aIdx === 2
                                        ? 'bg-amber-500'
                                        : 'bg-slate-400'
                                    }`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="text-[10px] text-slate-600 pt-1">
                            Total de respostas válidas nesta questão: <strong>{q.totalAnswers.toLocaleString('pt-BR')}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Page Footer */}
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Relatório por Área • {categoryName} • IFCE</span>
                    <span>Página {index + 3}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
