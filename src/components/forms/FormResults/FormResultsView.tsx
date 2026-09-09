import {
  ArrowLeft,
  Award,
  Building2,
  Download,
  FileSpreadsheet,
  Layers,
  Printer,
  Search,
  Table,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { INITIAL_SMART_FORMS } from '../../../data/formsData';
import { MOCK_PARTICIPANT_RESPONSES } from '../../../data/mockResponsesData';
import type { TargetAudience } from '../../../types';

import { classifyAnswer, getSegmentResult, calculateCpaFinalResult } from './utils/cpaMethodology';
import type { CpaSegmentResult } from './utils/cpaMethodology';
import { ResponsesTab } from './components/ResponsesTab';
import { ConsolidationTab } from './components/ConsolidationTab';
import { FinalResultTab } from './components/FinalResultTab';

interface FormResultsViewProps {
  initialFormId?: string;
  onReturnToForms?: () => void;
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
    const questions = selectedForm.questions;
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

        segResponses.forEach((r) => {
          const val = r.answers[q.id];
          const level = classifyAnswer(val);
          if (level === 'Baixo') countBaixo++;
          else if (level === 'Médio') countMedio++;
          else if (level === 'Alto') countAlto++;
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
    const questions = selectedForm.questions;

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


  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          {onReturnToForms && (
            <button
              type="button"
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
                type="button"
                onClick={() => handleExportCSV(activeTab)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#006837]" />
                <span>Exportar Excel / CSV</span>
              </button>
              <button
                type="button"
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
          type="button"
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
          type="button"
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
          type="button"
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

      {activeTab === 'respostas' && (
        <ResponsesTab selectedForm={selectedForm} rawResponses={rawResponses} />
      )}

      {activeTab === 'consolidacao' && (
        <ConsolidationTab consolidatedBySegment={consolidatedBySegment} />
      )}

      {activeTab === 'resultado-final' && (
        <FinalResultTab consolidatedFinalRows={consolidatedFinalRows} />
      )}
    </div>
  );
};
