export type AuthView = 'login' | 'forgot-password' | 'register';

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
