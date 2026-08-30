import { Bell, Mail } from "lucide-react";

interface NotificationSettingsCardProps {
  alertEmail: string;
  notifyNewResponses: boolean;
  notifyCampaignEnding: boolean;
  notifyCampaignFinished: boolean;
  onAlertEmailChange: (value: string) => void;
  onNotifyNewResponsesChange: (value: boolean) => void;
  onNotifyCampaignEndingChange: (value: boolean) => void;
  onNotifyCampaignFinishedChange: (value: boolean) => void;
}

export function NotificationSettingsCard({
  alertEmail,
  notifyNewResponses,
  notifyCampaignEnding,
  notifyCampaignFinished,
  onAlertEmailChange,
  onNotifyNewResponsesChange,
  onNotifyCampaignEndingChange,
  onNotifyCampaignFinishedChange,
}: NotificationSettingsCardProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <Bell className="w-4 h-4" />
          </div>

          <div>
            <h2 className="text-xs font-black text-slate-900 tracking-tight">
              Notificações e Alertas
            </h2>

            <p className="text-[10px] text-slate-400 font-medium">
              Alertas automáticos para a comissão e respondentes
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 block">
            E-mail Institucional para Recebimento de Alertas
          </label>

          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />

            <input
              type="email"
              value={alertEmail}
              onChange={(e) => onAlertEmailChange(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all"
              placeholder="cpa.taua@ifce.edu.br"
              required
            />
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
            <div>
              <span className="text-[11px] font-bold text-slate-800 block">
                Notificar sobre novas respostas
              </span>

              <span className="text-[10px] text-slate-500 font-medium block">
                Resumo diário consolidado das participações recebidas
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNotifyNewResponsesChange(!notifyNewResponses)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                notifyNewResponses ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                  notifyNewResponses ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
            <div>
              <span className="text-[11px] font-bold text-slate-800 block">
                Avisar quando a campanha estiver próxima do encerramento
              </span>

              <span className="text-[10px] text-slate-500 font-medium block">
                Alerta com 3 dias de antecedência para reforçar divulgação
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                onNotifyCampaignEndingChange(!notifyCampaignEnding)
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                notifyCampaignEnding ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                  notifyCampaignEnding ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 p-2 bg-slate-50/70 border border-slate-200/80 rounded-lg">
            <div>
              <span className="text-[11px] font-bold text-slate-800 block">
                Avisar quando uma campanha for finalizada
              </span>

              <span className="text-[10px] text-slate-500 font-medium block">
                Gera automaticamente o relatório preliminar de resultados
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                onNotifyCampaignFinishedChange(!notifyCampaignFinished)
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                notifyCampaignFinished ? "bg-[#006837]" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 ${
                  notifyCampaignFinished ? "left-4.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>Canal de Notificações: E-mail & Sistema</span>
        <span className="text-amber-600 font-bold">Ativo</span>
      </div>
    </div>
  );
}
