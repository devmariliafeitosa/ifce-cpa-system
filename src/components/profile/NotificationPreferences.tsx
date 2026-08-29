import { Bell } from "lucide-react";

interface NotificationPreferencesProps {
  emailNotifications: boolean;
  systemNotifications: boolean;
  reportCopyNotification: boolean;
  onEmailNotificationsChange: (value: boolean) => void;
  onSystemNotificationsChange: (value: boolean) => void;
  onReportCopyNotificationChange: (value: boolean) => void;
}

export function NotificationPreferences({
  emailNotifications,
  systemNotifications,
  reportCopyNotification,
  onEmailNotificationsChange,
  onSystemNotificationsChange,
  onReportCopyNotificationChange,
}: NotificationPreferencesProps) {
  return (
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
            aria-pressed={emailNotifications}
            onClick={() => onEmailNotificationsChange(!emailNotifications)}
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
            aria-pressed={systemNotifications}
            onClick={() => onSystemNotificationsChange(!systemNotifications)}
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
            aria-pressed={reportCopyNotification}
            onClick={() =>
              onReportCopyNotificationChange(!reportCopyNotification)
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
  );
}
