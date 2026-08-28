import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

import { IFCELogo } from "../../../components/IFCELogo";

import { loginSchema, type LoginFormData } from "../schemas/login.schema";

import { authenticateCoordinator } from "../../../services/auth.service";

import type { LoginFormProps } from "../types/auth.types";

export function LoginForm({
  onNavigate,
  onLoginSuccess,
  prefilledEmail = "",
  registrationSuccessMessage,
}: LoginFormProps) {
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
      email: prefilledEmail || "coord@ifce.edu.br",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (prefilledEmail) {
      setValue("email", prefilledEmail);
    }
  }, [prefilledEmail, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    const result = await authenticateCoordinator({
      email: data.email,
      password: data.password,
      prefilledEmail,
    });

    if (!result.success) {
      setAuthError(result.message);
      return;
    }

    onLoginSuccess(result.email);
  };

  return (
    <div className="md:col-span-7 lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <IFCELogo variant="full" />

          <span className="text-[11px] font-semibold tracking-wider text-[#0B7A3E] bg-[#E8F5EE] px-2.5 py-1 rounded-full uppercase">
            Coordenação
          </span>
        </div>

        {registrationSuccessMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle className="w-4 h-4 text-[#0B7A3E] flex-shrink-0 mt-0.5" />

            <p className="font-medium">{registrationSuccessMessage}</p>
          </div>
        )}

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Bem-vindo(a)
          </h1>

          <p className="text-sm text-slate-500">
            Faça login para acessar o painel da Coordenação da CPA.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <Info className="w-4 h-4 text-red-500 flex-shrink-0" />

            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email-input"
              className="block text-xs font-semibold text-slate-700"
            >
              E-mail Institucional
            </label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                id="email-input"
                type="email"
                placeholder="cpa.taua@ifce.edu.br"
                {...register("email")}
                className={`w-full h-12 pl-10 pr-3.5 text-sm bg-slate-50 border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10"
                } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200`}
              />
            </div>

            {errors.email && (
              <p className="text-xs font-medium text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password-input"
              className="block text-xs font-semibold text-slate-700"
            >
              Senha
            </label>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="123456"
                {...register("password")}
                className={`w-full h-12 pl-10 pr-10 text-sm bg-slate-50 border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10"
                } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all duration-200`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Ocultar senha" : "Visualizar senha"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs font-medium text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 accent-[#0B7A3E]"
              />

              <span className="text-xs text-slate-600 font-medium">
                Lembrar de mim
              </span>
            </label>

            <button
              type="button"
              onClick={() => onNavigate("forgot-password")}
              className="text-xs font-semibold text-[#0B7A3E] hover:text-[#045C2D] hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 mt-2 bg-[#0B7A3E] hover:bg-[#045C2D] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px] font-medium">
        <span>CPA IFCE</span>
        <span>Versão 1.0</span>
      </div>
    </div>
  );
}
