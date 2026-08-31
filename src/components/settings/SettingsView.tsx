import { useState } from "react";
import { Save, Info } from "lucide-react";
import { ChangePasswordModal } from "../profile/ChangePasswordModal";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsToast } from "./SettingsToast";
import type { SettingsToastData } from "./SettingsToast";
import { SystemPreferencesCard } from "./SystemPreferencesCard";
import { EvaluationSettingsCard } from "./EvaluationSettingsCard";
import { NotificationSettingsCard } from "./NotificationSettingsCard";
import { SecuritySettingsCard } from "./SecuritySettingsCard";
interface SettingsViewProps {
  onReturnToDashboard?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = () => {
  // Preferências do Sistema
  const [systemName, setSystemName] = useState(
    "Sistema de Autoavaliação Institucional • CPA IFCE",
  );
  const [defaultCampus, setDefaultCampus] = useState("Campus Tauá");
  const [currentAcademicPeriod, setCurrentAcademicPeriod] = useState("2025.1");

  // Configurações das Avaliações
  const [defaultDuration, setDefaultDuration] = useState("30");
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [requireIdentification, setRequireIdentification] = useState(true);
  const [singleResponsePerUser, setSingleResponsePerUser] = useState(true);

  // Notificações
  const [notifyNewResponses, setNotifyNewResponses] = useState(true);
  const [notifyCampaignEnding, setNotifyCampaignEnding] = useState(true);
  const [notifyCampaignFinished, setNotifyCampaignFinished] = useState(true);
  const [alertEmail, setAlertEmail] = useState("cpa.taua@ifce.edu.br");

  // Segurança
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [require2FA, setRequire2FA] = useState(false);

  // Modal & Toast States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showToast, setShowToast] = useState<SettingsToastData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setShowToast({
        message: "Configurações do sistema salvas e aplicadas com sucesso!",
        type: "success",
      });
      setTimeout(() => setShowToast(null), 3500);
    }, 400);
  };

  const handlePasswordChangeSuccess = () => {
    setShowToast({
      message: "Senha do coordenador atualizada com sucesso!",
      type: "success",
    });
    setTimeout(() => setShowToast(null), 4000);
  };

  const handleResetDefaults = () => {
    setSystemName("Sistema de Autoavaliação Institucional • CPA IFCE");
    setDefaultCampus("Campus Tauá");
    setCurrentAcademicPeriod("2025.1");
    setDefaultDuration("30");
    setAllowAnonymous(true);
    setRequireIdentification(true);
    setSingleResponsePerUser(true);
    setNotifyNewResponses(true);
    setNotifyCampaignEnding(true);
    setNotifyCampaignFinished(true);
    setAlertEmail("cpa.taua@ifce.edu.br");
    setSessionTimeout("60");
    setRequire2FA(false);

    setShowToast({
      message:
        "Configurações restauradas para os padrões institucionais da CPA.",
      type: "info",
    });
    setTimeout(() => setShowToast(null), 3500);
  };

  return (
    <div className="w-full max-w-[96%] 2xl:max-w-[1440px] mx-auto px-2 sm:px-4 py-4 space-y-4 select-none animate-in fade-in duration-200">
      {/* Barra de Ações e Status */}
      <SettingsHeader onResetDefaults={handleResetDefaults} />

      {/* Toast Notification */}
      <SettingsToast toast={showToast} onClose={() => setShowToast(null)} />

      {/* Main Settings Grid Form (2 Columns on large screens) */}
      <form onSubmit={handleSaveSettings} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {/* CARD 1: PREFERÊNCIAS DO SISTEMA */}

          <SystemPreferencesCard
            systemName={systemName}
            defaultCampus={defaultCampus}
            currentAcademicPeriod={currentAcademicPeriod}
            onSystemNameChange={setSystemName}
            onDefaultCampusChange={setDefaultCampus}
            onCurrentAcademicPeriodChange={setCurrentAcademicPeriod}
          />

          {/* CARD 2: CONFIGURAÇÕES DAS AVALIAÇÕES */}
          <EvaluationSettingsCard
            defaultDuration={defaultDuration}
            allowAnonymous={allowAnonymous}
            requireIdentification={requireIdentification}
            singleResponsePerUser={singleResponsePerUser}
            onDefaultDurationChange={setDefaultDuration}
            onAllowAnonymousChange={setAllowAnonymous}
            onRequireIdentificationChange={setRequireIdentification}
            onSingleResponsePerUserChange={setSingleResponsePerUser}
          />

          {/* CARD 3: NOTIFICAÇÕES */}
          <NotificationSettingsCard
            alertEmail={alertEmail}
            notifyNewResponses={notifyNewResponses}
            notifyCampaignEnding={notifyCampaignEnding}
            notifyCampaignFinished={notifyCampaignFinished}
            onAlertEmailChange={setAlertEmail}
            onNotifyNewResponsesChange={setNotifyNewResponses}
            onNotifyCampaignEndingChange={setNotifyCampaignEnding}
            onNotifyCampaignFinishedChange={setNotifyCampaignFinished}
          />

          {/* CARD 4: SEGURANÇA E ACESSO */}
          <SecuritySettingsCard
            sessionTimeout={sessionTimeout}
            require2FA={require2FA}
            onSessionTimeoutChange={setSessionTimeout}
            onRequire2FAChange={setRequire2FA}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
          />
        </div>

        {/* Footer Actions: Botão Discreto Salvar Alterações */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Info className="w-4 h-4 text-[#006837] shrink-0" />
            <span>
              As alterações efetuadas serão aplicadas imediatamente a todas as
              sessões da CPA do Campus Tauá.
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
