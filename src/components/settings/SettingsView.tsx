import { Shield, KeyRound, CheckCircle2, Save, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChangePasswordModal } from "../profile/ChangePasswordModal";
import { SettingsHeader } from "./SettingsHeader";
import { SystemPreferencesCard } from "./SystemPreferencesCard";
import { EvaluationSettingsCard } from "./EvaluationSettingsCard";
import { NotificationSettingsCard } from "./NotificationSettingsCard";
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
  const [showToast, setShowToast] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);
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

          {/* =====================================================================
              CARD 4: SEGURANÇA E ACESSO
             ===================================================================== */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-slate-900 tracking-tight">
                    Segurança e Acesso
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Políticas de sessão, credenciais e proteção de dados
                  </p>
                </div>
              </div>

              {/* Tempo de Sessão */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Tempo Limite de Sessão por Inatividade</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Desconexão automática
                  </span>
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full h-8 px-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
                >
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora (Recomendado)</option>
                  <option value="120">2 horas</option>
                  <option value="240">4 horas</option>
                  <option value="480">8 horas (Jornada completa)</option>
                </select>
              </div>

              {/* Alteração de Senha */}
              <div className="p-3 bg-slate-50/80 border border-slate-200/90 rounded-xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Credenciais de Coordenador
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Senha forte com requisitos de segurança ativos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="h-7 px-3 bg-white hover:bg-emerald-50 hover:text-[#006837] border border-slate-200 hover:border-emerald-300 text-slate-700 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <KeyRound className="w-3 h-3 text-[#006837]" />
                  <span>Alterar Senha</span>
                </button>
              </div>

              {/* Switch Autenticação em Duas Etapas (2FA) */}
              <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    Exigir autenticação em duas etapas (2FA)
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Código de confirmação enviado ao e-mail institucional
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRequire2FA(!require2FA)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    require2FA ? "bg-[#006837]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                      require2FA ? "left-4.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Status de Proteção: LGPD & Criptografia</span>
              <span className="text-[#006837] font-bold">Protegido</span>
            </div>
          </div>
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
