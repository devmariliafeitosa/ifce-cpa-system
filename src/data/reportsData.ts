export interface ReportQuestionAlternative {
  option: string;
  count: number;
  percentage: number;
}

export interface ReportQuestion {
  id: string;
  questionText: string;
  category: string;
  segment: 'Todos' | 'Discentes' | 'Docentes' | 'TAEs';
  totalAnswers: number;
  approvalRate: number; // e.g. 78 (%)
  classification: 'Potencialidade' | 'Mediana' | 'Fragilidade';
  alternatives: ReportQuestionAlternative[];
}

export interface ReportDimensionResult {
  dimension: string;
  potencialidadePct: number;
  medianaPct: number;
  fragilidadePct: number;
  classification: 'Potencialidade' | 'Mediana' | 'Fragilidade';
}

export interface ReportCampaignData {
  id: string;
  title: string;
  campus: string;
  period: string;
  year: string;
  semester: string;
  status: 'Finalizada' | 'Em andamento';
  totalResponses: number;
  totalQuestions: number;
  responseRate: number; // e.g. 84.5
  avgResponseTime: string; // e.g. "6.2 min"
  updatedAt: string;
  
  // Resumo Geral
  potencialidadePct: number; // e.g. 65
  medianaPct: number;        // e.g. 22
  fragilidadePct: number;    // e.g. 13
  
  // Resultado por Dimensão
  dimensions: ReportDimensionResult[];
  
  // Resultado por Perguntas
  questions: ReportQuestion[];
}

export const REPORT_CAMPAIGNS: ReportCampaignData[] = [];
