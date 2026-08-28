import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  X,
} from "lucide-react";

import { IFCELogo } from "./IFCELogo";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../features/auth/schemas/reset-password.schema";

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
  onRequestNewLink: () => void;
  isExpired?: boolean;
}

export function ResetPasswordForm({
  onBackToLogin,
  onRequestNewLink,
  isExpired = false,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const requirements = useMemo(
    () => ({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9\s]/.test(password),
    }),
    [password],
  );

  const requirementsCount = Object.values(requirements).filter(Boolean).length;

  const strength = useMemo(() => {
    if (!password) {
      return {
        label: "",
        width: "0%",
        barClass: "bg-slate-200",
        textClass: "text-slate-400",
      };
    }

    if (requirementsCount <= 2 || !requirements.minLength) {
      return {
        label: "Fraca",
        width: "33%",
        barClass: "bg-red-500",
        textClass: "text-red-600",
      };
    }

    if (requirementsCount <= 4) {
      return {
        label: "Média",
        width: "66%",
        barClass: "bg-amber-500",
        textClass: "text-amber-600",
      };
    }

    return {
      label: "Forte",
      width: "100%",
      barClass: "bg-[#0B7A3E]",
      textClass: "text-[#0B7A3E]",
    };
  }, [password, requirementsCount, requirements.minLength]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    // Depois isso será substituído pela chamada ao backend.
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Nova senha definida:", data.password);

    setSuccess(true);
  };

  if (isExpired) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="flex justify-center mb-5">
          <IFCELogo variant="full" />
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-amber-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Link expirado
          </h1>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Este link de redefinição de senha expirou ou já foi utilizado.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Solicite um novo link para continuar.
          </p>
        </div>

        <button
          type="button"
          onClick={onRequestNewLink}
          className="w-full h-12 mt-7 bg-[#0B7A3E] hover:bg-[#045C2D] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Solicitar novo link
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="flex justify-center mb-5">
          <IFCELogo variant="full" />
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#0B7A3E]" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Senha alterada com sucesso!
          </h1>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Sua senha foi redefinida.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Agora você já pode acessar o sistema utilizando sua nova senha.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full h-12 mt-7 bg-[#0B7A3E] hover:bg-[#045C2D] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          Ir para Login
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
      <div className="flex justify-center mb-7">
        <IFCELogo variant="full" />
      </div>

      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-slate-900">Criar Nova Senha</h1>

        <p className="mt-2 text-sm text-slate-500">
          Defina uma nova senha para acessar o sistema da CPA.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="new-password"
            className="block text-xs font-semibold text-slate-700"
          >
            Nova senha
          </label>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua nova senha"
              {...register("password")}
              className={`w-full h-12 pl-10 pr-10 text-sm bg-slate-50 border ${
                errors.password
                  ? "border-red-500"
                  : "border-[#D9D9D9] focus:border-[#0B7A3E]"
              } rounded-xl focus:outline-hidden focus:ring-4 focus:ring-[#0B7A3E]/10`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {password && (
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Força da senha</span>

                <span className={`font-semibold ${strength.textClass}`}>
                  {strength.label}
                </span>
              </div>

              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${strength.barClass}`}
                  style={{
                    width: strength.width,
                  }}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-xs font-medium text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0B7A3E]" />
              Requisitos da senha
            </span>

            <span className="text-[11px] text-slate-400">
              {requirementsCount}/5
            </span>
          </div>

          <PasswordRequirement
            valid={requirements.minLength}
            text="Pelo menos 8 caracteres"
          />

          <PasswordRequirement
            valid={requirements.uppercase}
            text="Uma letra maiúscula"
          />

          <PasswordRequirement
            valid={requirements.lowercase}
            text="Uma letra minúscula"
          />

          <PasswordRequirement valid={requirements.number} text="Um número" />

          <PasswordRequirement
            valid={requirements.special}
            text="Um caractere especial"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirm-password"
            className="block text-xs font-semibold text-slate-700"
          >
            Confirmar nova senha
          </label>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Digite novamente sua senha"
              {...register("confirmPassword")}
              className={`w-full h-12 pl-10 pr-10 text-sm bg-slate-50 border ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-[#D9D9D9] focus:border-[#0B7A3E]"
              } rounded-xl focus:outline-hidden focus:ring-4 focus:ring-[#0B7A3E]/10`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs font-medium text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#0B7A3E] hover:bg-[#045C2D] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Alterando senha...
            </>
          ) : (
            <>
              Redefinir senha
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

interface PasswordRequirementProps {
  valid: boolean;
  text: string;
}

function PasswordRequirement({ valid, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {valid ? (
        <Check className="w-4 h-4 text-[#0B7A3E]" />
      ) : (
        <X className="w-4 h-4 text-slate-400" />
      )}

      <span className={valid ? "font-medium text-slate-700" : "text-slate-500"}>
        {text}
      </span>
    </div>
  );
}
