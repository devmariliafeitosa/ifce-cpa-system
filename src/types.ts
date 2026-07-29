export type AuthView = 'login' | 'forgot-password' | 'register';

export type TargetAudience = 'todos' | 'alunos' | 'docentes' | 'taes';

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
  type: 'SCALE' | 'SHORT_TEXT' | 'LONG_TEXT' | 'RADIO' | 'CHECKBOX' | 'DROPDOWN' | 'TEXT';
  required: boolean;
  category?: QuestionCategory;
  options?: string[];
  audiences: TargetAudience[]; // ['todos'], or ['alunos'], or ['docentes', 'taes']
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
  endDate: string;
  customMessage: string;
  createdAt: string;
  status: 'Ativa' | 'Agendada' | 'Concluída';
  sentEmailsCount: number;
  uniqueTokenUrl?: string;
}

export interface SmartForm {
  id: string;
  title: string;
  description: string;
  campus: string;
  status: 'Ativo' | 'Rascunho' | 'Encerrado';
  createdAt: string;
  updatedAt?: string;
  periodo?: string;
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
