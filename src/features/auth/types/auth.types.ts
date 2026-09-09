export type AuthView =
  | "login"
  | "forgot-password"
  | "register"
  | "reset-password";

export interface LoginFormProps {
  onNavigate: (view: AuthView) => void;
  onLoginSuccess: (userEmail: string) => void;
  prefilledEmail?: string;
  registrationSuccessMessage?: string | null;
}
