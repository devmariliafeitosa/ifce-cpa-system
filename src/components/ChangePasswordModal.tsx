import React, { useState, useMemo } from 'react';
import {
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Requirements validation
  const validation = useMemo(() => {
    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

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

    let strengthLabel = 'Muito Fraca';
    let strengthColor = 'bg-rose-500';
    let strengthWidth = 'w-1/6';

    if (criteriaMetCount === 2) {
      strengthLabel = 'Fraca';
      strengthColor = 'bg-orange-500';
      strengthWidth = 'w-2/5';
    } else if (criteriaMetCount === 3) {
      strengthLabel = 'Média';
      strengthColor = 'bg-amber-500';
      strengthWidth = 'w-3/5';
    } else if (criteriaMetCount === 4) {
      strengthLabel = 'Boa';
      strengthColor = 'bg-emerald-500';
      strengthWidth = 'w-4/5';
    } else if (criteriaMetCount === 5) {
      strengthLabel = 'Forte e Segura';
      strengthColor = 'bg-[#006837]';
      strengthWidth = 'w-full';
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
      criteriaMetCount,
    };
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg('Por favor, informe sua senha atual.');
      return;
    }

    if (!validation.allCriteriaMet) {
      setErrorMsg('Certifique-se de que todos os requisitos da senha foram atendidos e que a confirmação é idêntica.');
      return;
    }

    setIsSubmitting(true);

    // Simulate secure API call to update coordinator password
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess();
      onClose();
    }, 600);
  };

  const handleCloseModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen) return null;

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
          {/* Header */}
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
              onClick={handleCloseModal}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Senha Atual */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Senha Atual <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  required
                  className="w-full h-9 pl-3 pr-9 text-xs bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Nova Senha <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  className="w-full h-9 pl-3 pr-9 text-xs bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Indicador de Força de Senha */}
              {newPassword.length > 0 && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Força da senha:</span>
                    <span className="text-slate-800">{validation.strengthLabel}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${validation.strengthColor} ${validation.strengthWidth} transition-all duration-300 rounded-full`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Nova Senha */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Confirmar Nova Senha <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha exatamente igual"
                  required
                  className={`w-full h-9 pl-3 pr-9 text-xs bg-slate-50/70 border rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:bg-white transition-all font-medium ${
                    confirmPassword.length > 0 && !validation.passwordsMatch
                      ? 'border-rose-300 focus:ring-rose-500'
                      : 'border-slate-200 focus:ring-[#006837]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !validation.passwordsMatch && (
                <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                  As senhas digitadas não coincidem.
                </p>
              )}
            </div>

            {/* Requisitos Obrigatórios */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Requisitos Obrigatórios:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                {/* 1. Mínimo 8 caracteres */}
                <div
                  className={`flex items-center gap-1.5 font-medium ${
                    validation.hasMinLength ? 'text-[#006837] font-bold' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                      validation.hasMinLength ? 'bg-emerald-100 text-[#006837]' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Mínimo de 8 caracteres</span>
                </div>

                {/* 2. Letra maiúscula */}
                <div
                  className={`flex items-center gap-1.5 font-medium ${
                    validation.hasUppercase ? 'text-[#006837] font-bold' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                      validation.hasUppercase ? 'bg-emerald-100 text-[#006837]' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Letra maiúscula (A-Z)</span>
                </div>

                {/* 3. Letra minúscula */}
                <div
                  className={`flex items-center gap-1.5 font-medium ${
                    validation.hasLowercase ? 'text-[#006837] font-bold' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                      validation.hasLowercase ? 'bg-emerald-100 text-[#006837]' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Letra minúscula (a-z)</span>
                </div>

                {/* 4. Número */}
                <div
                  className={`flex items-center gap-1.5 font-medium ${
                    validation.hasNumber ? 'text-[#006837] font-bold' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                      validation.hasNumber ? 'bg-emerald-100 text-[#006837]' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Pelo menos 1 número</span>
                </div>

                {/* 5. Caractere especial */}
                <div
                  className={`flex items-center gap-1.5 font-medium sm:col-span-2 ${
                    validation.hasSpecialChar ? 'text-[#006837] font-bold' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                      validation.hasSpecialChar ? 'bg-emerald-100 text-[#006837]' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Caractere especial (!@#$%^&*...)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
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
                <span>{isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
