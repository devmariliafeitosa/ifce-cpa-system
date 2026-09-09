export interface ReportQuestionAlternative {
  option: string;
  count: number;
  percentage: number;
}

export interface ReportQuestion {
  id: string;
  questionText: string;
  category: string;

  segment:
    | "Todos"
    | "Discentes"
    | "Docentes"
    | "TAEs";

  totalAnswers: number;

  approvalRate: number;

  classification:
    | "Potencialidade"
    | "Mediana"
    | "Fragilidade"
    | "Sem respostas";

  alternatives: ReportQuestionAlternative[];
}

export interface ReportDimensionResult {
  dimension: string;

  potencialidadePct: number;

  medianaPct: number;

  fragilidadePct: number;

  classification:
    | "Potencialidade"
    | "Mediana"
    | "Fragilidade"
    | "Sem respostas";
}

export interface ReportCampaignData {
  id: string;

  title: string;

  campus: string;

  period: string;

  year: string;

  semester: string;

  status:
    | "Finalizada"
    | "Em andamento";

  totalResponses: number;

  totalQuestions: number;

  responseRate: number;

  avgResponseTime: string;

  updatedAt: string;

  potencialidadePct: number;

  medianaPct: number;

  fragilidadePct: number;

  dimensions: ReportDimensionResult[];

  questions: ReportQuestion[];
}

export const REPORT_CAMPAIGNS: ReportCampaignData[] = [];