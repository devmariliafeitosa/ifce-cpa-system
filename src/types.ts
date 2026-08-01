export type AuthView = 'login' | 'forgot-password' | 'register';

export type TargetAudience = 'todos' | 'alunos' | 'docentes' | 'taes';

export type StudentLevel = 'todos' | 'tecnico' | 'graduacao' | 'mestrado' | 'pos_graduacao';

export interface UserCoordinator {
  id: string;
  name: string;
  email: string;
  campus: string;
  siape: string;
  createdAt: string;
}

export interface AuthState {
  currentView: AuthView;
  rememberMe: boolean;
  prefilledEmail?: string;
  loggedInUser?: UserCoordinator | null;
  registrationSuccessMessage?: string | null;
  recoverySuccessMessage?: string | null;
}

export type QuestionCategory =
  | 'Planejamento Institucional'
  | 'Ensino'
  | 'Pesquisa'
  | 'Extensão'
  | 'Infraestrutura'
  | 'Biblioteca'
  | 'Tecnologia'
  | 'Comunicação'
  | 'Assistência Estudantil'
  | 'Gestão'
  | 'Sustentabilidade'
  | 'Outros';

export interface SmartQuestion {
  id: string;
  title: string;
  description?: string;
  type: 'SCALE' | 'RADIO' | 'CHECKBOX' | 'DROPDOWN' | 'YES_NO';
  required: boolean;
  category?: QuestionCategory;
  options?: string[];
  audiences: TargetAudience[]; // ['todos'], or ['alunos'], or ['docentes', 'taes']
  studentLevel?: StudentLevel; // Subsegmentação para discentes: 'todos' | 'tecnico' | 'graduacao' | 'mestrado' | 'pos_graduacao'
}

export interface FormParticipantAnswer {
  questionId: string;
  value: string | string[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  segment: 'alunos' | 'docentes' | 'taes';
  submittedAt: string;
  answers: FormParticipantAnswer[];
}

export interface Campaign {
  id: string;
  formId: string;
  formTitle: string;
  title: string;
  campus: string;
  segment: TargetAudience;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  customMessage: string;
  createdAt: string;
  status: 'Ativa' | 'Agendada' | 'Encerrada' | 'Concluída' | 'Rascunho';
  sentEmailsCount: number;
  uniqueTokenUrl?: string;
  qrCodeAccessCount?: number;
  qrCodeResponsesCount?: number;
  qrCodeUrl?: string;
}

export interface SmartForm {
  id: string;
  title: string;
  description: string;
  campus: string;
  status: 'Ativo' | 'Agendada' | 'Ativa' | 'Encerrada' | 'Encerrado' | 'Rascunho';
  createdAt: string;
  updatedAt?: string;
  periodo?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  lastSync?: string;
  googleFormId?: string;
  googleFormLink?: string;
  questions: SmartQuestion[];
  responsesCount: {
    total: number;
    alunos: number;
    docentes: number;
    taes: number;
  };
}
