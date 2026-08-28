import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";

import { IFCELogo } from "../../../components/IFCELogo";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/forgot-password.schema";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulação temporária até existir backend.
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Solicitação de recuperação:", data.email);

    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-[#0B7A3E]" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Verifique seu e-mail
          </h1>

          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Se o e-mail informado estiver cadastrado, enviaremos as instruções
            para redefinição da senha.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full h-12 mt-8 bg-[#0B7A3E] hover:bg-[#045C2D] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Voltar para o login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
      <div className="mb-8">
        <IFCELogo variant="full" />
      </div>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0B7A3E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="space-y-2 mb-7">
        <h1 className="text-2xl font-bold text-slate-800">
          Esqueceu sua senha?
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed">
          Informe seu e-mail institucional para receber as instruções de
          recuperação da sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="recovery-email"
            className="block text-xs font-semibold text-slate-700"
          >
            E-mail Institucional
          </label>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              id="recovery-email"
              type="email"
              placeholder="cpa.taua@ifce.edu.br"
              {...register("email")}
              className={`w-full h-12 pl-10 pr-3.5 text-sm bg-slate-50 border ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#D9D9D9] focus:border-[#0B7A3E] focus:ring-[#0B7A3E]/10"
              } rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-4 transition-all`}
            />
          </div>

          {errors.email && (
            <p className="text-xs font-medium text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#0B7A3E] hover:bg-[#045C2D] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar instruções"
          )}
        </button>
      </form>
    </div>
  );
}
