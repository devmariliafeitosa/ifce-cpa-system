import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Table,
  Layers,
  Award,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowLeft,
  Info,
  ChevronDown,
  Building2,
  Users,
  Calendar,
  Sparkles,
  FileText,
} from 'lucide-react';
import { SmartForm, SmartQuestion, TargetAudience } from '../types';
import { INITIAL_SMART_FORMS } from '../data/formsData';
import { MOCK_PARTICIPANT_RESPONSES, ParticipantResponseRow } from '../data/mockResponsesData';

interface FormResultsViewProps {
  initialFormId?: string;
  onReturnToForms?: () => void;
}

// Methodology Etapa 1: Classify answer to satisfaction level
export type SatisfactionLevel = 'Baixo' | 'Médio' | 'Alto' | 'Ignorado';

export function classifyAnswer(value: string | number | undefined | null): SatisfactionLevel {
  if (value === null || value === undefined) return 'Ignorado';
  const valStr = String(value).trim().toLowerCase();

  if (
    valStr.includes('não possuo') ||
    valStr.includes('não se aplica') ||
    valStr.includes('sem informação') ||
    valStr.includes('não sei') ||
    valStr === '0' ||
    valStr === 'n/a'
  ) {
    return 'Ignorado';
  }

  // Baixo
  if (
    valStr === 'não' ||
    valStr === 'raramente' ||
    valStr === 'nunca' ||
    valStr === 'baixa' ||
    valStr === 'insuficiente' ||
    valStr === 'péssimo' ||
    valStr === 'ruim' ||
    valStr === 'inadequado' ||
    valStr === '1' ||
    valStr === '2' ||
    valStr.includes('não atende') ||
    valStr.includes('não soube')
  ) {
    return 'Baixo';
  }

  // Médio
  if (
    valStr === 'parcialmente' ||
    valStr === 'moderada' ||
    valStr === 'regular' ||
    valStr === '3' ||
    valStr.includes('atendeu parcialmente') ||
    valStr.includes('tenho conhecimento, mas não')
  ) {
    return 'Médio';
  }

  // Alto
  if (
    valStr === 'sim' ||
    valStr === 'sempre' ||
    valStr === 'frequentemente' ||
    valStr === 'alta' ||
    valStr === 'bom' ||
    valStr === 'ótimo' ||
    valStr === 'otimo' ||
    valStr === 'adequado' ||
    valStr === '4' ||
    valStr === '5' ||
    valStr.includes('sim, ativamente') ||
    valStr.includes('atende plenamente') ||
    valStr.includes('superou') ||
    valStr.includes('na maioria das vezes')
  ) {
    return 'Alto';
  }

  const num = Number(valStr);
  if (!isNaN(num)) {
    if (num <= 2) return 'Baixo';
    if (num === 3) return 'Médio';
    if (num >= 4) return 'Alto';
  }

  return 'Alto';
}

// Methodology Etapa 2: Segment Result Badge Classification
export type CpaSegmentResult = 'Fragilidade' | 'Avaliação Mediana' | 'Potencialidade' | 'Sem Respostas';

export function getSegmentResult(percentAlto: number, totalValid: number): CpaSegmentResult {
  if (totalValid === 0) return 'Sem Respostas';
  if (percentAlto < 50) return 'Fragilidade';
  if (percentAlto < 70) return 'Avaliação Mediana';
  return 'Potencialidade';
}

// Methodology Etapa 3: Final Combination across 3 segments
export type CpaFinalResult =
  | 'Fragilidade'
  | 'Avaliação Mediana'
  | 'Potencialidade'
  | 'Tendência de Fragilidade'
  | 'Tendência de Potencialidade'
  | 'Controvérsia'
  | 'Sem Dados Suficientes';

export function calculateCpaFinalResult(
  alunosRes: CpaSegmentResult,
  docentesRes: CpaSegmentResult,
  taesRes: CpaSegmentResult
): CpaFinalResult {
  const list = [alunosRes, docentesRes, taesRes].filter((r) => r !== 'Sem Respostas');
  if (list.length === 0) return 'Sem Dados Suficientes';

  const countP = list.filter((r) => r === 'Potencialidade').length;
  const countF = list.filter((r) => r === 'Fragilidade').length;
  const countM = list.filter((r) => r === 'Avaliação Mediana').length;

  // Unanimous cases
  if (countP === list.length) return 'Potencialidade';
  if (countF === list.length) return 'Fragilidade';
  if (countM === list.length) return 'Avaliação Mediana';

  // Conflict between Fragilidade and Potencialidade
  if (countP > 0 && countF > 0) {
    if (countF > countP) return 'Fragilidade';
    return 'Controvérsia';
  }

  // Combination of Avaliação Mediana + Potencialidade
  if (countP > 0 && countM > 0 && countF === 0) {
    return 'Tendência de Potencialidade';
  }

  // Combination of Avaliação Mediana + Fragilidade
  if (countF > 0 && countM > 0 && countP === 0) {
    return 'Tendência de Fragilidade';
  }

  return 'Avaliação Mediana';
}

export const FormResultsView: React.FC<FormResultsViewProps> = ({
  initialFormId,
  onReturnToForms,
}) => {
  const [selectedFormId, setSelectedFormId] = useState<string>(
    initialFormId || INITIAL_SMART_FORMS[0].id
  );
  const [activeTab, setActiveTab] = useState<'respostas' | 'consolidacao' | 'resultado-final'>(
    'consolidacao'
  );

  // Filters
  const [filterCampus, setFilterCampus] = useState('todos');
  const [filterSegment, setFilterSegment] = useState<TargetAudience>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Form Details
  const selectedForm = useMemo(() => {
    return INITIAL_SMART_FORMS.find((f) => f.id === selectedFormId) || INITIAL_SMART_FORMS[0];
  }, [selectedFormId]);

  // Filtered Raw Participant Responses for Aba 1
  const rawResponses = useMemo(() => {
    return MOCK_PARTICIPANT_RESPONSES.filter((r) => {
      const matchesForm = r.formId === selectedForm.id || r.formId === 'form-cpa-taua-2025-1';
      const matchesCampus = filterCampus === 'todos' || r.campus === filterCampus;
      const matchesSegment = filterSegment === 'todos' || r.segment === filterSegment;
      const matchesSearch =
        searchTerm === '' ||
        r.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.respondentEmail.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesForm && matchesCampus && matchesSegment && matchesSearch;
    });
  }, [selectedForm, filterCampus, filterSegment, searchTerm]);

  // Calculated Segment Statistics for Aba 2 (Consolidação por Segmento)
  const consolidatedBySegment = useMemo(() => {
    const questions = selectedForm.questions.filter((q) => q.type !== 'TEXT' && q.type !== 'LONG_TEXT');
    const segments: Array<{ key: 'alunos' | 'docentes' | 'taes'; label: string }> = [
      { key: 'alunos', label: 'Alunos' },
      { key: 'docentes', label: 'Docentes' },
      { key: 'taes', label: 'TAEs' },
    ];

    const rows: Array<{
      questionId: string;
      questionTitle: string;
      category: string;
      segmentKey: 'alunos' | 'docentes' | 'taes';
      segmentLabel: string;
      validCount: number;
      pctBaixo: number;
      pctMedio: number;
      pctAlto: number;
      result: CpaSegmentResult;
    }> = [];

    questions.forEach((q) => {
      segments.forEach((seg) => {
        // Filter responses for this segment & question
        const segResponses = rawResponses.filter((r) => r.segment === seg.key);
        let countBaixo = 0;
        let countMedio = 0;
        let countAlto = 0;
        let countIgnored = 0;

        segResponses.forEach((r) => {
          const val = r.answers[q.id];
          const level = classifyAnswer(val);
          if (level === 'Baixo') countBaixo++;
          else if (level === 'Médio') countMedio++;
          else if (level === 'Alto') countAlto++;
          else countIgnored++;
        });

        const totalValid = countBaixo + countMedio + countAlto;
        const pctBaixo = totalValid > 0 ? (countBaixo / totalValid) * 100 : 0;
        const pctMedio = totalValid > 0 ? (countMedio / totalValid) * 100 : 0;
        const pctAlto = totalValid > 0 ? (countAlto / totalValid) * 100 : 0;

        const result = getSegmentResult(pctAlto, totalValid);

        rows.push({
          questionId: q.id,
          questionTitle: q.title,
          category: q.category || 'Geral',
          segmentKey: seg.key,
          segmentLabel: seg.label,
          validCount: totalValid,
          pctBaixo,
          pctMedio,
          pctAlto,
          result,
        });
      });
    });

    return rows.filter((r) => {
      if (filterSegment !== 'todos' && r.segmentKey !== filterSegment) return false;
      if (
        searchTerm &&
        !r.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !r.category.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [selectedForm, rawResponses, filterSegment, searchTerm]);

  // Calculated Final Results for Aba 3 (Resultado Final - Metodologia CPA)
  const consolidatedFinalRows = useMemo(() => {
    const questions = selectedForm.questions.filter((q) => q.type !== 'TEXT' && q.type !== 'LONG_TEXT');

    return questions
      .map((q) => {
        const alunosData = consolidatedBySegment.find(
          (c) => c.questionId === q.id && c.segmentKey === 'alunos'
        );
        const docentesData = consolidatedBySegment.find(
          (c) => c.questionId === q.id && c.segmentKey === 'docentes'
        );
        const taesData = consolidatedBySegment.find(
          (c) => c.questionId === q.id && c.segmentKey === 'taes'
        );

        const alunosResult = alunosData ? alunosData.result : 'Sem Respostas';
        const docentesResult = docentesData ? docentesData.result : 'Sem Respostas';
        const taesResult = taesData ? taesData.result : 'Sem Respostas';

        const finalResult = calculateCpaFinalResult(alunosResult, docentesResult, taesResult);

        return {
          questionId: q.id,
          questionTitle: q.title,
          category: q.category || 'Geral',
          alunosResult,
          docentesResult,
          taesResult,
          finalResult,
          alunosPct: alunosData ? alunosData.pctAlto : 0,
          docentesPct: docentesData ? docentesData.pctAlto : 0,
          taesPct: taesData ? taesData.pctAlto : 0,
        };
      })
      .filter((row) => {
        if (
          searchTerm &&
          !row.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !row.category.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
  }, [selectedForm, consolidatedBySegment, searchTerm]);

  // Export CSV Handler
  const handleExportCSV = (type: 'respostas' | 'consolidacao' | 'resultado-final') => {
    let csvContent = '';
    const filename = `CPA_IFCE_${selectedForm.title.replace(/[^a-z0-9]/gi, '_')}_${type}.csv`;

    if (type === 'respostas') {
      csvContent = 'Respondente,Email,Segmento,Campus,Data\n';
      rawResponses.forEach((r) => {
        csvContent += `"${r.respondentName}","${r.respondentEmail}","${r.segment}","${r.campus}","${r.date}"\n`;
      });
    } else if (type === 'consolidacao') {
      csvContent = 'Pergunta,Categoria,Segmento,Baixo (%),Medio (%),Alto (%),% Alto,Resultado CPA\n';
      consolidatedBySegment.forEach((r) => {
        csvContent += `"${r.questionTitle}","${r.category}","${r.segmentLabel}",${r.pctBaixo.toFixed(
          1
        )}%,${r.pctMedio.toFixed(1)}%,${r.pctAlto.toFixed(1)}%,${r.pctAlto.toFixed(1)}%,"${r.result}"\n`;
      });
    } else {
      csvContent = 'Pergunta,Categoria,Alunos,Docentes,TAEs,Resultado Final CPA\n';
      consolidatedFinalRows.forEach((r) => {
        csvContent += `"${r.questionTitle}","${r.category}","${r.alunosResult}","${r.docentesResult}","${r.taesResult}","${r.finalResult}"\n`;
      });
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Printable PDF Window
  const handlePrintPDF = () => {
    window.print();
  };

  // Helper Badge Colors for CPA Results
  const renderCpaBadge = (result: CpaSegmentResult | CpaFinalResult) => {
    switch (result) {
      case 'Fragilidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            🟥 Fragilidade
          </span>
        );
      case 'Avaliação Mediana':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            🟨 Avaliação Mediana
          </span>
        );
      case 'Potencialidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-[#006837] border border-emerald-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            🟩 Potencialidade
          </span>
        );
      case 'Tendência de Fragilidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            🟧 Tendência de Fragilidade
          </span>
        );
      case 'Tendência de Potencialidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            🟦 Tendência de Potencialidade
          </span>
        );
      case 'Controvérsia':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            🟪 Controvérsia
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Sem Respostas
          </span>
        );
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          {onReturnToForms && (
            <button
              onClick={onReturnToForms}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006837] hover:underline mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para lista de questionários
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E8F5EE] text-[#006837]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Consolidação Automática de Resultados da CPA
              </h1>
              <p className="text-xs text-slate-500">
                Planilha inteligente alimentada em tempo real com a metodologia oficial do IFCE.
              </p>
            </div>
          </div>
        </div>

        {/* Form Switcher Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-500 shrink-0 hidden sm:inline">Questionário:</span>
          <select
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] max-w-xs cursor-pointer"
          >
            {INITIAL_SMART_FORMS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por pergunta, categoria ou participante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837]"
            />
          </div>

          {/* Filters Selects */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterCampus}
                onChange={(e) => setFilterCampus(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-bold"
              >
                <option value="todos">Todos os Campi</option>
                <option value="Campus Tauá">Campus Tauá</option>
                <option value="Campus Crateús">Campus Crateús</option>
                <option value="Campus Canindé">Campus Canindé</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterSegment}
                onChange={(e) => setFilterSegment(e.target.value as TargetAudience)}
                className="bg-transparent focus:outline-none text-slate-700 font-bold"
              >
                <option value="todos">Todos os Segmentos</option>
                <option value="alunos">Alunos (Discentes)</option>
                <option value="docentes">Docentes</option>
                <option value="taes">TAEs</option>
              </select>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => handleExportCSV(activeTab)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#006837]" />
                <span>Exportar Excel / CSV</span>
              </button>
              <button
                onClick={handlePrintPDF}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Imprimir PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3 Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('respostas')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'respostas'
              ? 'bg-[#006837] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Aba 1 – Respostas Individuais ({rawResponses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consolidacao')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'consolidacao'
              ? 'bg-[#006837] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Aba 2 – Consolidação por Segmento</span>
        </button>

        <button
          onClick={() => setActiveTab('resultado-final')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'resultado-final'
              ? 'bg-[#006837] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Aba 3 – Resultado Final (Metodologia CPA)</span>
        </button>
      </div>

      {/* TAB CONTENT 1: Aba 1 – Respostas */}
      {activeTab === 'respostas' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Respostas Individuais dos Participantes (Formato Planilha)
              </h3>
              <p className="text-xs text-slate-500">
                Cada linha representa o envio de um respondente identificado pelo e-mail institucional do IFCE.
              </p>
            </div>
            <span className="text-xs font-bold text-[#006837] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {rawResponses.length} registros encontrados
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 border-r border-slate-200">Respondente</th>
                  <th className="p-3 border-r border-slate-200">Segmento</th>
                  <th className="p-3 border-r border-slate-200">Campus</th>
                  <th className="p-3 border-r border-slate-200">Data</th>
                  {selectedForm.questions.slice(0, 4).map((q, idx) => (
                    <th key={q.id} className="p-3 border-r border-slate-200 max-w-[150px] truncate" title={q.title}>
                      P{idx + 1}: {q.title.slice(0, 20)}...
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rawResponses.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}>
                    <td className="p-3 font-semibold text-slate-900 border-r border-slate-200">
                      <div>{row.respondentName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{row.respondentEmail}</div>
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-emerald-50 text-[#006837] border border-emerald-200">
                        {row.segment}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 border-r border-slate-200 font-medium">{row.campus}</td>
                    <td className="p-3 text-slate-500 border-r border-slate-200">{row.date}</td>
                    {selectedForm.questions.slice(0, 4).map((q) => {
                      const val = row.answers[q.id] ?? '—';
                      const level = classifyAnswer(val);
                      return (
                        <td key={q.id} className="p-3 border-r border-slate-200 font-medium">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              level === 'Alto'
                                ? 'bg-emerald-50 text-emerald-800'
                                : level === 'Médio'
                                ? 'bg-amber-50 text-amber-800'
                                : level === 'Baixo'
                                ? 'bg-rose-50 text-rose-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {String(val)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Aba 2 – Consolidação por Segmento */}
      {activeTab === 'consolidacao' && (
        <div className="space-y-4">
          {/* Legend Banner */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 text-xs border border-slate-800">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Metodologia CPA – Etapa 2: Intervalos de Nível de Satisfação (% Alto)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Cálculo Válido Exclui Opções Nulo/Inexistente</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/30 space-y-1">
                <span className="font-bold text-rose-400">0% a 49,99% → 🟥 Fragilidade</span>
                <p className="text-[11px] text-slate-300">Indica necessidade de intervenção imediata da gestão.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/30 space-y-1">
                <span className="font-bold text-amber-400">50% a 69,99% → 🟨 Avaliação Mediana</span>
                <p className="text-[11px] text-slate-300">Nível aceitável, necessitando de ações de aprimoramento.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-400">70% a 100% → 🟩 Potencialidade</span>
                <p className="text-[11px] text-slate-300">Ponto forte institucional e referência de boas práticas.</p>
              </div>
            </div>
          </div>

          {/* Spreadsheet Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3 border-r border-slate-200 min-w-[280px]">Pergunta</th>
                    <th className="p-3 border-r border-slate-200">Categoria</th>
                    <th className="p-3 border-r border-slate-200">Segmento</th>
                    <th className="p-3 border-r border-slate-200 text-center">Baixo</th>
                    <th className="p-3 border-r border-slate-200 text-center">Médio</th>
                    <th className="p-3 border-r border-slate-200 text-center">Alto</th>
                    <th className="p-3 border-r border-slate-200 text-center">% Alto</th>
                    <th className="p-3 text-center">Resultado CPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {consolidatedBySegment.map((row, idx) => (
                    <tr
                      key={`${row.questionId}-${row.segmentKey}`}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}
                    >
                      <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 max-w-[320px]">
                        {row.questionTitle}
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                          {row.category}
                        </span>
                      </td>
                      <td className="p-3 border-r border-slate-200 font-bold text-slate-800">
                        {row.segmentLabel}
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center font-mono text-slate-600">
                        {row.pctBaixo.toFixed(1)}%
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center font-mono text-slate-600">
                        {row.pctMedio.toFixed(1)}%
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center font-mono font-bold text-slate-900">
                        {row.pctAlto.toFixed(1)}%
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center font-mono font-bold text-[#006837] bg-emerald-50/50">
                        {row.pctAlto.toFixed(1)}%
                      </td>
                      <td className="p-3 text-center">{renderCpaBadge(row.result)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Aba 3 – Resultado Final (Sintese Institucional) */}
      {activeTab === 'resultado-final' && (
        <div className="space-y-4">
          {/* CPA Rules Methodology Reference Box */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 text-xs border border-slate-800">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Regras de Combinação da CPA – Resultado Final Unificado
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Consolidação Multi-Segmento</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-center">
                <span className="block font-bold text-emerald-400">P + P</span>
                <span className="text-[10px] text-slate-300">Potencialidade</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/30 text-center">
                <span className="block font-bold text-rose-400">F + F</span>
                <span className="text-[10px] text-slate-300">Fragilidade</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-center">
                <span className="block font-bold text-purple-400">P + F</span>
                <span className="text-[10px] text-slate-300">Controvérsia</span>
              </div>
              <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-500/30 text-center">
                <span className="block font-bold text-sky-400">M + P</span>
                <span className="text-[10px] text-slate-300">Tend. Potencialidade</span>
              </div>
              <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-500/30 text-center">
                <span className="block font-bold text-orange-400">M + F</span>
                <span className="text-[10px] text-slate-300">Tend. Fragilidade</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/30 text-center">
                <span className="block font-bold text-amber-400">M + M</span>
                <span className="text-[10px] text-slate-300">Avaliação Mediana</span>
              </div>
            </div>
          </div>

          {/* Final Spreadsheet Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3 border-r border-slate-200 min-w-[280px]">Pergunta</th>
                    <th className="p-3 border-r border-slate-200">Categoria</th>
                    <th className="p-3 border-r border-slate-200 text-center">Alunos (Discentes)</th>
                    <th className="p-3 border-r border-slate-200 text-center">Docentes</th>
                    <th className="p-3 border-r border-slate-200 text-center">TAEs</th>
                    <th className="p-3 text-center">Resultado Final CPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {consolidatedFinalRows.map((row, idx) => (
                    <tr
                      key={row.questionId}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}
                    >
                      <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 max-w-[320px]">
                        {row.questionTitle}
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                          {row.category}
                        </span>
                      </td>
                      <td className="p-3 border-r border-slate-200 text-center">{renderCpaBadge(row.alunosResult)}</td>
                      <td className="p-3 border-r border-slate-200 text-center">{renderCpaBadge(row.docentesResult)}</td>
                      <td className="p-3 border-r border-slate-200 text-center">{renderCpaBadge(row.taesResult)}</td>
                      <td className="p-3 text-center bg-slate-50/80">{renderCpaBadge(row.finalResult)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
