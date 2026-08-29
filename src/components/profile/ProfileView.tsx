import { useState, type FormEvent } from "react";
import { Info, Save } from "lucide-react";

import type { UserCoordinator } from "../../types";

import { ChangePasswordModal } from "./ChangePasswordModal";
import { NotificationPreferences } from "./NotificationPreferences";
import { PersonalDataCard } from "./PersonalDataCard";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileOverview } from "./ProfileOverview";
import { ProfileToast, type ProfileToastData } from "./ProfileToast";
import { SecurityCard } from "./SecurityCard";

interface ProfileViewProps {
  user?: UserCoordinator | null;
  onReturnToDashboard?: () => void;
}

export function ProfileView({ user }: ProfileViewProps) {
  // Dados pessoais
  const [fullName, setFullName] = useState(
    user?.name || "Coordenador CPA Tauá",
  );
  const [email] = useState(user?.email || "cpa.taua@ifce.edu.br");
  const [phone, setPhone] = useState("(88) 3437-1234");
  const [siape] = useState(user?.siape || "1982736");
  const [campus] = useState(user?.campus || "IFCE Campus Tauá");
  const [department] = useState("Comissão Própria de Avaliação • CPA");

  // Preferências de notificação
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [reportCopyNotification, setReportCopyNotification] = useState(true);

  // Interface
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showToast, setShowToast] = useState<ProfileToastData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showSuccessToast = (message: string, duration: number) => {
    setShowToast({
      message,
      type: "success",
    });

    setTimeout(() => setShowToast(null), duration);
  };

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);

      showSuccessToast(
        "Dados do perfil do coordenador salvos com sucesso!",
        3500,
      );
    }, 400);
  };

  const handlePasswordChangeSuccess = () => {
    showSuccessToast("Senha do coordenador alterada com sucesso!", 4000);
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleCloseToast = () => {
    setShowToast(null);
  };

  return (
    <div className="w-full max-w-[96%] 2xl:max-w-[1440px] mx-auto px-2 sm:px-4 py-4 space-y-4 select-none animate-in fade-in duration-200">
      <ProfileHeader />

      <ProfileToast toast={showToast} onClose={handleCloseToast} />

      <ProfileOverview
        fullName={fullName}
        campus={campus}
        email={email}
        onChangePassword={handleOpenPasswordModal}
      />

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <PersonalDataCard
            fullName={fullName}
            email={email}
            phone={phone}
            siape={siape}
            department={department}
            onFullNameChange={setFullName}
            onPhoneChange={setPhone}
          />

          <SecurityCard
            email={email}
            onChangePassword={handleOpenPasswordModal}
          />
        </div>

        <NotificationPreferences
          emailNotifications={emailNotifications}
          systemNotifications={systemNotifications}
          reportCopyNotification={reportCopyNotification}
          onEmailNotificationsChange={setEmailNotifications}
          onSystemNotificationsChange={setSystemNotifications}
          onReportCopyNotificationChange={setReportCopyNotification}
        />

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

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
}
