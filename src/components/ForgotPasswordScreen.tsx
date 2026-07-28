import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { IFCELogo } from './IFCELogo';
import { AuthView } from '../types';
import coordinatorsData from '../data/coordinators.json';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe seu e-mail institucional.')
    .email('E-mail em formato inválido.')
    .refine((val) => val.trim().toLowerCase().endsWith('@ifce.edu.br'), {
      message: 'Utilize um e-mail institucional do IFCE.',
    }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordScreenProps {
  onNavigate: (view: AuthView) => void;
  prefilledEmail?: string;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigate,
  prefilledEmail = '',
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: prefilledEmail || '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    // Simulate sending recovery email
    await new Promise((resolve) => setTimeout(resolve, 800));

    const enteredEmail = data.email.trim().toLowerCase();
    const exists = coordinatorsData.coordinators.some(
      (c) => c.email.toLowerCase() === enteredEmail
    ) || (prefilledEmail && prefilledEmail.trim().toLowerCase() === enteredEmail);

    if (exists) {
      setSuccessMessage('Um link de recuperação foi enviado para seu e-mail.');
    } else {
      setErrorMessage('E-mail inválido.');
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 font-sans my-auto py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <IFCELogo variant="full" />
          <div className="pt-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Recuperar senha
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-1">
              Digite seu e-mail institucional para continuar.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-800 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-[#0B7A3E] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{successMessage}</p>
              <p className="text-emerald-700/90 text-[11px]">
                Acesse sua caixa de entrada institucional e siga as instruções para redefinir sua senha.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        {!successMessage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="recovery-email-input" className="block text-xs font-semibold text-slate-700">
                E-mail Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="recovery-email-input"
                  type="email"
                  placeholder="exemplo@ifce.edu.br"
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

            <button
              id="send-recovery-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#0B7A3E] hover:bg-[#045C2D] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg focus:outline-hidden focus:ring-4 focus:ring-[#0B7A3E]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white/90" />
                  <span>Enviando solicitação...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Recuperar Senha</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Navigation back */}
        <div className="pt-2 border-t border-slate-100 flex justify-center">
          <button
            id="back-to-login-btn"
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0B7A3E] transition-colors py-1 px-3 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Login</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 font-medium">
          CPA IFCE • Comissão Própria de Avaliação
        </div>

      </div>
    </div>
  );
};
