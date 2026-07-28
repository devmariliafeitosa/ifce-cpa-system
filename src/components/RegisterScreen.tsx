import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Hash,
  Loader2,
  CheckCircle,
  X,
  ShieldAlert,
} from 'lucide-react';
import { IFCELogo } from './IFCELogo';
import { CampiSelect } from './CampiSelect';
import { AuthView } from '../types';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Nome completo é obrigatório.')
      .min(3, 'Informe seu nome completo.'),
    email: z
      .string()
      .min(1, 'E-mail institucional é obrigatório.')
      .email('E-mail em formato inválido.')
      .refine((val) => val.trim().toLowerCase().endsWith('@ifce.edu.br'), {
        message: 'Utilize um e-mail institucional do IFCE (@ifce.edu.br).',
      }),
    campus: z.string().min(1, 'Selecione o seu campus.'),
    siape: z
      .string()
      .min(1, 'Número SIAPE é obrigatório.')
      .regex(/^\d+$/, 'O SIAPE deve conter apenas números.'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterScreenProps {
  onNavigate: (view: AuthView) => void;
  onRegisterSuccess: (email: string, message: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigate,
  onRegisterSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      campus: '',
      siape: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Simulate brief API registration delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    onRegisterSuccess(
      data.email,
      `Cadastro realizado com sucesso para o campus ${data.campus}! Digite sua senha para acessar.`
    );
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F7F8FA] items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <IFCELogo variant="full" />
          <div className="pt-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Cadastro da Coordenação
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 max-w-sm">
              Preencha seus dados institucionais para criar a conta da Coordenação da CPA.
            </p>
          </div>
        </div>

        {/* Informational Callout */}
        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
          <ShieldAlert className="w-4 h-4 text-[#0B7A3E] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Este formulário é exclusivo para membros e coordenadores da CPA. Professores e alunos receberão links diretos no e-mail institucional.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Row 1: Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-700">
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="reg-fullname"
                type="text"
                placeholder="Seu nome completo"
                {...register('fullName')}
                className={`w-full h-12 pl-10 pr-3.5 text-sm bg-slate-50 border ${
                  errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10'
                } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200`}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs font-medium text-red-600 pt-0.5">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Row 2: Email & SIAPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700">
                E-mail Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
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

            {/* SIAPE Number */}
            <div className="space-y-1.5">
              <label htmlFor="reg-siape" className="block text-xs font-semibold text-slate-700">
                Número SIAPE
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  id="reg-siape"
                  type="text"
                  inputMode="numeric"
                  placeholder="1234567"
                  {...register('siape')}
                  className={`w-full h-12 pl-10 pr-3.5 text-sm bg-slate-50 border ${
                    errors.siape ? 'border-red-500 focus:ring-red-200' : 'border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10'
                  } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200`}
                />
              </div>
              {errors.siape && (
                <p className="text-xs font-medium text-red-600 pt-0.5">
                  {errors.siape.message}
                </p>
              )}
            </div>

          </div>

          {/* Row 3: Campi Select */}
          <Controller
            control={control}
            name="campus"
            render={({ field }) => (
              <CampiSelect
                id="reg-campus"
                value={field.value}
                onChange={field.onChange}
                error={errors.campus?.message}
              />
            )}
          />

          {/* Row 4: Password and Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  {...register('password')}
                  className={`w-full h-12 pl-10 pr-10 text-sm bg-slate-50 border ${
                    errors.password ? 'border-red-500 focus:ring-red-200' : 'border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10'
                  } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200`}
                />
                <button
                  id="toggle-reg-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Visualizar senha"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-slate-700">
                Confirmar senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repita sua senha"
                  {...register('confirmPassword')}
                  className={`w-full h-12 pl-10 pr-10 text-sm bg-slate-50 border ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10'
                  } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200`}
                />
                <button
                  id="toggle-confirm-password"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Visualizar confirmação de senha"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-red-600 pt-0.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Primary Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#0B7A3E] hover:bg-[#045C2D] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg focus:outline-hidden focus:ring-4 focus:ring-[#0B7A3E]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cadastrando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Cadastrar</span>
                </>
              )}
            </button>

            {/* Secondary Cancel */}
            <button
              id="register-cancel-btn"
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer order-2 sm:order-1"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>

          </div>

        </form>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium">
          CPA IFCE • Comissão Própria de Avaliação - Instituto Federal do Ceará
        </div>

      </div>
    </div>
  );
};
