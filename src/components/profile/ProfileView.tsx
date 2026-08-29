import React, { useState } from "react";
import { Bell, CheckCircle2, Info, KeyRound, Save, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChangePasswordModal } from "./ChangePasswordModal";
import type { UserCoordinator } from "../../types";

import { ProfileHeader } from "./ProfileHeader";
import { ProfileOverview } from "./ProfileOverview";

interface ProfileViewProps {
  user?: UserCoordinator | null;
  onReturnToDashboard?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  // Dados Pessoais
  const [fullName, setFullName] = useState(
    user?.name || "Coordenador CPA Tauá",
  );
  const [email] = useState(user?.email || "cpa.taua@ifce.edu.br");
  const [phone, setPhone] = useState("(88) 3437-1234");
  const [siape] = useState(user?.siape || "1982736");
  const [campus] = useState(user?.campus || "IFCE Campus Tauá");
  const [department] = useState("Comissão Própria de Avaliação • CPA");

  // Preferências
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [reportCopyNotification, setReportCopyNotification] = useState(true);

  // States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showToast, setShowToast] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setShowToast({
        message: "Dados do perfil do coordenador salvos com sucesso!",
        type: "success",
      });
      setTimeout(() => setShowToast(null), 3500);
    }, 400);
  };

  const handlePasswordChangeSuccess = () => {
    setShowToast({
      message: "Senha do coordenador alterada com sucesso!",
      type: "success",
    });
    setTimeout(() => setShowToast(null), 4000);
  };

  return (
    <div className="w-full max-w-[96%] 2xl:max-w-[1440px] mx-auto px-2 sm:px-4 py-4 space-y-4 select-none animate-in fade-in duration-200">
      {/* Barra de Status e Cargo */}
      <ProfileHeader />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between shadow-2xs border ${
              showToast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-[#006837]"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{showToast.message}</span>
            </div>
            <button
              onClick={() => setShowToast(null)}
              className="p-1 hover:opacity-75 cursor-pointer text-slate-500 text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Overview Card */}
      <ProfileOverview
        fullName={fullName}
        campus={campus}
        email={email}
        onChangePassword={() => setIsPasswordModalOpen(true)}
      />

      {/* Main Form Formats in 2 Columns */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {/* =====================================================================
              CARD 1: DADOS PESSOAIS E INSTITUCIONAIS
             ===================================================================== */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="p-1.5 bg-emerald-50 text-[#006837] rounded-lg">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 tracking-tight">
                    Dados Pessoais e Institucionais
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Identificação do coordenador perante a CPA e o SINAES
                  </p>
                </div>
              </div>

              {/* Nome Completo */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all"
                  placeholder="Nome do Coordenador"
                  required
                />
              </div>

              {/* Grid: E-mail e Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* E-mail Institucional (Somente leitura) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>E-mail Institucional</span>
                    <span className="text-[9px] text-slate-400 font-normal">
                      Oficial
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full h-8 px-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 cursor-not-allowed outline-none"
                    title="O e-mail institucional é gerenciado pela Reitoria / TI do IFCE."
                  />
                </div>

                {/* Telefone / Ramal */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Telefone / Ramal
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all"
                    placeholder="(88) 3437-0000"
                  />
                </div>
              </div>

              {/* Grid: SIAPE e Lotação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Matrícula SIAPE */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Matrícula SIAPE
                  </label>
                  <input
                    type="text"
                    value={siape}
                    readOnly
                    className="w-full h-8 px-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 cursor-not-allowed outline-none"
                  />
                </div>

                {/* Lotação / Setor */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Lotação / Setor
                  </label>
                  <input
                    type="text"
                    value={department}
                    readOnly
                    className="w-full h-8 px-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Portaria de Nomeação: 104/2024 - GR</span>
              <span className="text-[#006837] font-bold">Vigente</span>
            </div>
          </div>

          {/* =====================================================================
              CARD 2: DADOS DE ACESSO E SEGURANÇA
             ===================================================================== */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 tracking-tight">
                    Dados de Acesso e Segurança
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Controle de credenciais e histórico de login institucional
                  </p>
                </div>
              </div>

              {/* Informações em Lista de Chave-Valor */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-lg flex items-center justify-between">
                  <span className="text-slate-500 font-bold text-[11px]">
                    E-mail de Login:
                  </span>
                  <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[200px]">
                    {email}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-lg flex items-center justify-between">
                  <span className="text-slate-500 font-bold text-[11px]">
                    Perfil de Acesso:
                  </span>
                  <span className="font-bold text-[#006837] text-[11px]">
                    Administrador / Coordenador Geral
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-lg flex items-center justify-between">
                  <span className="text-slate-500 font-bold text-[11px]">
                    Último Acesso:
                  </span>
                  <span className="font-medium text-slate-700 text-[11px]">
                    Hoje às 17:15 (IFCE Campus Tauá)
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-lg flex items-center justify-between">
                  <span className="text-slate-500 font-bold text-[11px]">
                    Endereço IP:
                  </span>
                  <span className="font-mono text-slate-600 text-[10px]">
                    200.17.42.10 (Rede Segura)
                  </span>
                </div>
              </div>

              {/* Botão Alterar Senha */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full h-8 px-3 bg-[#006837] hover:bg-[#00522b] text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Alterar Senha do Coordenador</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Criptografia de Acesso: SHA-256 / SSL</span>
              <span className="text-purple-600 font-bold">Seguro</span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            CARD 3: PREFERÊNCIAS E NOTIFICAÇÕES (LARGURA TOTAL / 2 COLUNAS)
           ===================================================================== */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 tracking-tight">
                Preferências de Comunicação e Notificações do Coordenador
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Personalize os alertas enviados diretamente para o seu e-mail e
                painel
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Switch 1: Notificações por e-mail */}
            <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/70 border border-slate-200/80 rounded-lg">
              <div>
                <span className="text-[11px] font-bold text-slate-800 block">
                  Notificações por e-mail
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Alertas de respostas e prazos no e-mail
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  emailNotifications ? "bg-[#006837]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                    emailNotifications ? "left-4.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Switch 2: Notificações do sistema */}
            <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/70 border border-slate-200/80 rounded-lg">
              <div>
                <span className="text-[11px] font-bold text-slate-800 block">
                  Notificações no sistema
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Sino de avisos no cabeçalho superior
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSystemNotifications(!systemNotifications)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  systemNotifications ? "bg-[#006837]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                    systemNotifications ? "left-4.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Switch 3: Cópia de relatórios */}
            <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/70 border border-slate-200/80 rounded-lg">
              <div>
                <span className="text-[11px] font-bold text-slate-800 block">
                  Cópia de relatórios gerados
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Envio automático de PDFs emitidos
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setReportCopyNotification(!reportCopyNotification)
                }
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  reportCopyNotification ? "bg-[#006837]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                    reportCopyNotification ? "left-4.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Info className="w-4 h-4 text-[#006837] shrink-0" />
            <span>
              As informações pessoais e institucionais são vinculadas à comissão
              avaliadora do Campus Tauá.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="h-8 px-4 bg-[#006837] hover:bg-[#00522b] text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Salvando..." : "Salvar Alterações"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Password Change Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
};
