import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validation = useMemo(() => {
    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[^A-Za-z0-9\s]/.test(newPassword);

    const passwordsMatch =
      newPassword.length > 0 && newPassword === confirmPassword;

    const criteriaMetCount = [
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;

    const allCriteriaMet =
      hasMinLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar &&
      passwordsMatch &&
      currentPassword.trim().length > 0;

    let strengthLabel = "Muito Fraca";
    let strengthColor = "bg-rose-500";
    let strengthWidth = "w-1/6";

    if (criteriaMetCount === 2) {
      strengthLabel = "Fraca";
      strengthColor = "bg-orange-500";
      strengthWidth = "w-2/5";
    } else if (criteriaMetCount === 3) {
      strengthLabel = "Média";
      strengthColor = "bg-amber-500";
      strengthWidth = "w-3/5";
    } else if (criteriaMetCount === 4) {
      strengthLabel = "Boa";
      strengthColor = "bg-emerald-500";
      strengthWidth = "w-4/5";
    } else if (criteriaMetCount === 5) {
      strengthLabel = "Forte e Segura";
      strengthColor = "bg-[#006837]";
      strengthWidth = "w-full";
    }

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      passwordsMatch,
      allCriteriaMet,
      strengthLabel,
      strengthColor,
      strengthWidth,
    };
  }, [currentPassword, newPassword, confirmPassword]);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setErrorMsg(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg("Por favor, informe sua senha atual.");
      return;
    }

    if (!validation.allCriteriaMet) {
      setErrorMsg(
        "Certifique-se de que todos os requisitos da senha foram atendidos e que a confirmação é idêntica.",
      );
      return;
    }

    setIsSubmitting(true);

    // Simulação temporária até integração com o backend.
    setTimeout(() => {
      setIsSubmitting(false);
      resetForm();
      onSuccess();
      onClose();
    }, 600);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-md overflow-hidden my-auto"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100/80 text-[#006837] rounded-xl shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Alteração de Senha
                </h3>

                <p className="text-[11px] text-slate-500 font-medium">
                  Coordenador CPA • IFCE Campus Tauá
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Senha Atual <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Digite sua senha atual"
                  required
                  className="w-full h-9 pl-3 pr-9 text-xs bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all font-medium"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent((current) => !current)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={
                    showCurrent ? "Ocultar senha atual" : "Mostrar senha atual"
                  }
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Nova Senha <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  className="w-full h-9 pl-3 pr-9 text-xs bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all font-medium"
                />

                <button
                  type="button"
                  onClick={() => setShowNew((current) => !current)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={
                    showNew ? "Ocultar nova senha" : "Mostrar nova senha"
                  }
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {newPassword.length > 0 && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Força da senha:</span>

                    <span className="text-slate-800">
                      {validation.strengthLabel}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${validation.strengthColor} ${validation.strengthWidth} transition-all duration-300 rounded-full`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Confirmar Nova Senha <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repita a nova senha exatamente igual"
                  required
                  className={`w-full h-9 pl-3 pr-9 text-xs bg-slate-50/70 border rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:bg-white transition-all font-medium ${
                    confirmPassword.length > 0 && !validation.passwordsMatch
                      ? "border-rose-300 focus:ring-rose-500"
                      : "border-slate-200 focus:ring-[#006837]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((current) => !current)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={
                    showConfirm
                      ? "Ocultar confirmação da senha"
                      : "Mostrar confirmação da senha"
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {confirmPassword.length > 0 && !validation.passwordsMatch && (
                <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                  As senhas digitadas não coincidem.
                </p>
              )}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Requisitos Obrigatórios:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                <PasswordRequirement
                  valid={validation.hasMinLength}
                  label="Mínimo de 8 caracteres"
                />

                <PasswordRequirement
                  valid={validation.hasUppercase}
                  label="Letra maiúscula (A-Z)"
                />

                <PasswordRequirement
                  valid={validation.hasLowercase}
                  label="Letra minúscula (a-z)"
                />

                <PasswordRequirement
                  valid={validation.hasNumber}
                  label="Pelo menos 1 número"
                />

                <PasswordRequirement
                  valid={validation.hasSpecialChar}
                  label="Caractere especial (!@#$%^&*...)"
                  fullWidth
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-8 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={!validation.allCriteriaMet || isSubmitting}
                className="h-8 px-4 bg-[#006837] hover:bg-[#00522b] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <ShieldCheck className="w-3.5 h-3.5" />

                <span>
                  {isSubmitting ? "Salvando..." : "Salvar Nova Senha"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface PasswordRequirementProps {
  valid: boolean;
  label: string;
  fullWidth?: boolean;
}

function PasswordRequirement({
  valid,
  label,
  fullWidth = false,
}: PasswordRequirementProps) {
  return (
    <div
      className={`flex items-center gap-1.5 font-medium ${
        fullWidth ? "sm:col-span-2" : ""
      } ${valid ? "text-[#006837] font-bold" : "text-slate-500"}`}
    >
      <div
        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
          valid
            ? "bg-emerald-100 text-[#006837]"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        <Check className="w-2.5 h-2.5" />
      </div>

      <span>{label}</span>
    </div>
  );
}
