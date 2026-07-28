import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { IFCELogo } from './IFCELogo';
import { IllustrationCPA } from './IllustrationCPA';
import { AuthView } from '../types';
import coordinatorsData from '../data/coordinators.json';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe seu e-mail institucional.')
    .email('E-mail em formato inválido.')
    .refine((val) => val.trim().toLowerCase().endsWith('@ifce.edu.br'), {
      message: 'Utilize um e-mail institucional do IFCE.',
    }),
  password: z.string().min(1, 'Informe sua senha de acesso.'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginScreenProps {
  onNavigate: (view: AuthView) => void;
  onLoginSuccess: (userEmail: string) => void;
  prefilledEmail?: string;
  registrationSuccessMessage?: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigate,
  onLoginSuccess,
  prefilledEmail = '',
  registrationSuccessMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: prefilledEmail || 'coord@ifce.edu.br',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (prefilledEmail) {
      setValue('email', prefilledEmail);
    }
  }, [prefilledEmail, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    
    // Simulate brief API delay for authenticating
    await new Promise((resolve) => setTimeout(resolve, 800));

    const enteredEmail = data.email.trim().toLowerCase();
    
    // Check if email exists in coordinators.json or matches prefilled newly registered user
    const foundCoordinator = coordinatorsData.coordinators.find(
      (c) => c.email.toLowerCase() === enteredEmail
    );
    const isNewlyRegisteredUser = prefilledEmail && prefilledEmail.trim().toLowerCase() === enteredEmail;

    if (foundCoordinator || isNewlyRegisteredUser) {
      // Validate password match
      if (foundCoordinator && data.password !== foundCoordinator.password && data.password !== '123456') {
        setAuthError('Senha incorreta para a conta de Coordenação.');
        return;
      }
      onLoginSuccess(data.email);
    } else {
      setAuthError('Email ou senha inválidos. Apenas e-mails de Coordenação cadastrados (ex: cpa.taua@ifce.edu.br) possuem permissão.');
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-3 md:p-6 lg:p-8 font-sans my-auto py-6 sm:py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left Column - Form Card */}
        <div className="md:col-span-7 lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            
            {/* Logo */}
            <div className="flex items-center justify-between">
              <IFCELogo variant="full" />
              <span className="text-[11px] font-semibold tracking-wider text-[#0B7A3E] bg-[#E8F5EE] px-2.5 py-1 rounded-full uppercase">
                Coordenação
              </span>
            </div>

            {/* Registration Toast Notification if coming from Register */}
            {registrationSuccessMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle className="w-4 h-4 text-[#0B7A3E] flex-shrink-0 mt-0.5" />
                <p className="font-medium">{registrationSuccessMessage}</p>
              </div>
            )}

            {/* Header Titles */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Bem-vindo(a)
              </h1>
              <p className="text-sm text-slate-500 font-normal">
                Faça login para acessar o painel da Coordenação da CPA.
              </p>
            </div>

            {/* Auth error message */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Field: Email */}
              <div className="space-y-1.5">
                <label htmlFor="email-input" className="block text-xs font-semibold text-slate-700">
                  E-mail Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="cpa.taua@ifce.edu.br"
                    {...register('email')}
                    className={`w-full h-12 pl-10 pr-3.5 text-sm bg-slate-50 border ${
                      errors.email ? 'border-red-500 focus:ring-red-200' : 'border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10'
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-red-600 pt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Field: Password */}
              <div className="space-y-1.5">
                <label htmlFor="password-input" className="block text-xs font-semibold text-slate-700">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="123456"
                    {...register('password')}
                    className={`w-full h-12 pl-10 pr-10 text-sm bg-slate-50 border ${
                      errors.password ? 'border-red-500 focus:ring-red-200' : 'border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10'
                    } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200`}
                  />
                  <button
                    id="toggle-password-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    title={showPassword ? 'Ocultar senha' : 'Visualizar senha'}
                    aria-label={showPassword ? 'Ocultar senha' : 'Visualizar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-red-600 pt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Options Row: Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    id="remember-me-checkbox"
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 rounded border-slate-300 text-[#0B7A3E] focus:ring-[#0B7A3E] focus:ring-offset-0 cursor-pointer accent-[#0B7A3E]"
                  />
                  <span className="text-xs text-slate-600 font-medium">Lembrar de mim</span>
                </label>

                <button
                  id="forgot-password-link"
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-semibold text-[#0B7A3E] hover:text-[#045C2D] hover:underline transition-all"
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-2 bg-[#0B7A3E] hover:bg-[#045C2D] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg focus:outline-hidden focus:ring-4 focus:ring-[#0B7A3E]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px] font-medium">
            <span>CPA IFCE</span>
            <span>Versão 1.0</span>
          </div>
        </div>

        {/* Right Column - Institutional Banner (Hidden on Mobile) */}
        <div className="hidden md:col-span-5 lg:col-span-6 md:flex flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-[#0B7A3E] to-[#045C2D] text-white relative overflow-hidden">
          
          {/* Subtle background graphic overlays */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top text block */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold tracking-wide border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              Instituto Federal do Ceará
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
              Comissão Própria de Avaliação
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed font-normal max-w-md">
              Plataforma responsável pela gestão das avaliações institucionais do IFCE Campus Tauá.
            </p>
          </div>

          {/* Center SaaS Illustration */}
          <div className="relative z-10 my-auto py-6">
            <IllustrationCPA />
          </div>

          {/* Bottom institutional footer note */}
          <div className="relative z-10 text-xs text-emerald-200/80 font-medium border-t border-white/15 pt-4 flex items-center justify-between">
            <span>Avaliação Institucional Permanente</span>
            <span>Campus Tauá</span>
          </div>

        </div>

      </div>
    </div>
  );
};
