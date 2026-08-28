export type ParticipantSegment = 'discente' | 'docente' | 'tae';
export type StudentLevelType = 'T├®cnico' | 'Gradua├º├úo' | 'Especializa├º├úo' | 'Mestrado' | 'Doutorado';

export interface Participant {
  id: string;
  name: string;
  email: string;
  segment: ParticipantSegment;
  studentLevel?: StudentLevelType;
  matricula?: string;
  campus: string;
  status: 'Ativo' | 'Inativo';
  createdAt: string;
}

export type AuthView = 'login' | 'forgot-password' | 'register' | 'reset-password';

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
  | 'Extens├úo'
  | 'Infraestrutura'
  | 'Biblioteca'
  | 'Tecnologia'
  | 'Comunica├º├úo'
  | 'Assist├¬ncia Estudantil'
  | 'Gest├úo'
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
  studentLevel?: StudentLevel; // Subsegmenta├º├úo para discentes: 'todos' | 'tecnico' | 'graduacao' | 'mestrado' | 'pos_graduacao'
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
  status: 'Ativa' | 'Agendada' | 'Encerrada' | 'Conclu├¡da' | 'Rascunho';
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
