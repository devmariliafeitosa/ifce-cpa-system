import React, { useState, useMemo } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Loader2,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { IFCELogo } from './IFCELogo';
import { AuthView } from '../types';

interface ResetPasswordScreenProps {
  onNavigate: (view: AuthView) => void;
  isExpiredInitial?: boolean;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onNavigate,
  isExpiredInitial = false,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLinkExpired, setIsLinkExpired] = useState(isExpiredInitial);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Requirements check
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|~`]/.test(password);

  const requirementsCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  const allRequirementsMet = requirementsCount === 5;

  // Password match check
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Strength score & Label
  const strengthInfo = useMemo(() => {
    if (!password) {
      return { score: 0, label: '', color: 'bg-slate-200', textClass: 'text-slate-400', widthPercent: 0 };
    }
    if (requirementsCount <= 2 || !hasMinLength) {
      return { score: 1, label: 'Fraca', color: 'bg-red-500', textClass: 'text-red-600', widthPercent: 33 };
    }
    if (requirementsCount >= 3 && requirementsCount <= 4) {
      return { score: 2, label: 'Média', color: 'bg-amber-500', textClass: 'text-amber-600', widthPercent: 66 };
    }
    return { score: 3, label: 'Forte', color: 'bg-[#006837]', textClass: 'text-[#006837]', widthPercent: 100 };
  }, [password, requirementsCount, hasMinLength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!hasMinLength) {
      setGeneralError('A senha deve possuir no mínimo 8 caracteres.');
      return;
    }

    if (!allRequirementsMet) {
      setGeneralError('Sua senha não atende aos critérios mínimos de segurança.');
      return;
    }

    if (!passwordsMatch) {
      setGeneralError('As senhas informadas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    // Simulate backend password update and token validation
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 font-sans my-auto py-8">
      
      {/* Simulation Banner to easily test "Link Expirado" state vs "Link Válido" */}
      <div className="mb-4 flex items-center gap-2 bg-slate-100 p-1.5 px-3 rounded-full text-xs text-slate-600 border border-slate-200/80 shadow-2xs">
        <span className="font-semibold text-slate-500">Modo de Teste:</span>
        <button
          type="button"
          onClick={() => {
            setIsLinkExpired(false);
            setIsSuccess(false);
          }}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
            !isLinkExpired && !isSuccess ? 'bg-[#006837] text-white' : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          Link Válido
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLinkExpired(true);
            setIsSuccess(false);
          }}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
            isLinkExpired ? 'bg-amber-600 text-white' : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          Link Expirado
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <IFCELogo variant="full" />
        </div>

        {/* ----------------- STATE 1: LINK EXPIRADO ----------------- */}
        {isLinkExpired ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Link expirado
                </h1>
                <p className="text-xs text-slate-600 leading-relaxed font-normal max-w-xs mx-auto pt-1">
                  Este link de redefinição de senha expirou ou já foi utilizado.
                </p>
                <p className="text-xs text-slate-500 font-normal">
                  Solicite um novo link para continuar.
                </p>
              </div>
            </div>

            <button
              id="request-new-link-btn"
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="w-full h-12 bg-[#006837] hover:bg-[#00522b] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg focus:outline-hidden focus:ring-4 focus:ring-[#006837]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Solicitar novo link</span>
            </button>
          </div>
        ) : isSuccess ? (
          /* ----------------- STATE 2: SUCESSO ----------------- */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#006837] shadow-2xs">
                <CheckCircle2 className="w-8 h-8 text-[#006837]" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Senha alterada com sucesso!
                </h1>
                <p className="text-xs text-slate-600 leading-relaxed font-normal max-w-xs mx-auto pt-1">
                  Sua senha foi redefinida.
                </p>
                <p className="text-xs text-slate-500 font-normal">
                  Agora você já pode acessar o sistema utilizando sua nova senha.
                </p>
              </div>
            </div>

            <button
              id="go-to-login-btn"
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full h-12 bg-[#006837] hover:bg-[#00522b] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg focus:outline-hidden focus:ring-4 focus:ring-[#006837]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ir para Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* ----------------- STATE 3: FORMULÁRIO DE REDEFINIÇÃO ----------------- */
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Criar Nova Senha
              </h1>
              <p className="text-xs text-slate-500 font-normal mt-1">
                Defina uma nova senha para acessar o sistema da CPA.
              </p>
            </div>

            {/* Mensagem de Erro Geral */}
            {generalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-medium">{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo 1: Nova senha */}
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="block text-xs font-semibold text-slate-700">
                  Nova senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 text-sm bg-slate-50 border border-[#D9D9D9] focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/10 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all duration-200 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Indicador de Força da Senha */}
                {password && (
                  <div className="pt-1.5 space-y-1 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">Força da senha:</span>
                      <span className={`font-bold ${strengthInfo.textClass}`}>
                        {strengthInfo.label === 'Fraca' && '🔴 '}
                        {strengthInfo.label === 'Média' && '🟡 '}
                        {strengthInfo.label === 'Forte' && '🟢 '}
                        {strengthInfo.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strengthInfo.color}`}
                        style={{ width: `${strengthInfo.widthPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card de Requisitos da Senha */}
              <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-200/60 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#006837]" />
                    Requisitos da senha
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {requirementsCount}/5 atendidos
                  </span>
                </div>
                
                <div className="space-y-1.5 text-[11px]">
                  {/* Requisito 1: Min 8 caracteres */}
                  <div className="flex items-center gap-2">
                    {hasMinLength ? (
                      <Check className="w-3.5 h-3.5 text-[#006837] shrink-0 font-bold" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className={hasMinLength ? 'font-semibold text-slate-800' : 'text-slate-500'}>
                      Pelo menos 8 caracteres
                    </span>
                  </div>

                  {/* Requisito 2: Maiúscula */}
                  <div className="flex items-center gap-2">
                    {hasUppercase ? (
                      <Check className="w-3.5 h-3.5 text-[#006837] shrink-0 font-bold" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className={hasUppercase ? 'font-semibold text-slate-800' : 'text-slate-500'}>
                      Uma letra maiúscula
                    </span>
                  </div>

                  {/* Requisito 3: Minúscula */}
                  <div className="flex items-center gap-2">
                    {hasLowercase ? (
                      <Check className="w-3.5 h-3.5 text-[#006837] shrink-0 font-bold" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className={hasLowercase ? 'font-semibold text-slate-800' : 'text-slate-500'}>
                      Uma letra minúscula
                    </span>
                  </div>

                  {/* Requisito 4: Número */}
                  <div className="flex items-center gap-2">
                    {hasNumber ? (
                      <Check className="w-3.5 h-3.5 text-[#006837] shrink-0 font-bold" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className={hasNumber ? 'font-semibold text-slate-800' : 'text-slate-500'}>
                      Um número
                    </span>
                  </div>

                  {/* Requisito 5: Caractere Especial */}
                  <div className="flex items-center gap-2">
                    {hasSpecialChar ? (
                      <Check className="w-3.5 h-3.5 text-[#006837] shrink-0 font-bold" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className={hasSpecialChar ? 'font-semibold text-slate-800' : 'text-slate-500'}>
                      Um caractere especial
                    </span>
                  </div>
                </div>
              </div>

              {/* Campo 2: Confirmar senha */}
              <div className="space-y-1.5 pt-1">
                <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-700">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full h-11 pl-10 pr-10 text-sm bg-slate-50 border ${
                      passwordsMismatch
                        ? 'border-red-400 focus:ring-red-100'
                        : passwordsMatch
                        ? 'border-emerald-500 focus:ring-emerald-100'
                        : 'border-[#D9D9D9] focus:border-[#006837] focus:ring-[#006837]/10'
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200 font-sans`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Validação de Correspondência de Senhas em tempo real */}
                {confirmPassword.length > 0 && (
                  <div className="pt-0.5 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
                    {passwordsMatch ? (
                      <span className="text-[#006837] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> As senhas coincidem.
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> As senhas não coincidem.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Botão de Salvar */}
              <div className="pt-2">
                <button
                  id="save-new-password-btn"
                  type="submit"
                  disabled={!allRequirementsMet || !passwordsMatch || isSubmitting}
                  className="w-full h-12 bg-[#006837] hover:bg-[#00522b] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg focus:outline-hidden focus:ring-4 focus:ring-[#006837]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                      <span>Salvando nova senha...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Salvar Nova Senha</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer Link Voltar */}
        <div className="pt-3 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-xs font-semibold text-slate-500 hover:text-[#006837] transition-colors py-1 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Voltar para a página de Login
          </button>
        </div>
      </div>
    </div>
  );
};
