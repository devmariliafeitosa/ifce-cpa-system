import { KeyRound, Shield } from "lucide-react";

interface SecuritySettingsCardProps {
  sessionTimeout: string;
  require2FA: boolean;
  onSessionTimeoutChange: (value: string) => void;
  onRequire2FAChange: (value: boolean) => void;
  onOpenPasswordModal: () => void;
}

export function SecuritySettingsCard({
  sessionTimeout,
  require2FA,
  onSessionTimeoutChange,
  onRequire2FAChange,
  onOpenPasswordModal,
}: SecuritySettingsCardProps) {
  return (
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

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
            <span>Tempo Limite de Sessão por Inatividade</span>

            <span className="text-[10px] text-slate-400 font-normal">
              Desconexão automática
            </span>
          </label>

          <select
            value={sessionTimeout}
            onChange={(e) => onSessionTimeoutChange(e.target.value)}
            className="w-full h-8 px-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white cursor-pointer"
          >
            <option value="30">30 minutos</option>
            <option value="60">1 hora (Recomendado)</option>
            <option value="120">2 horas</option>
            <option value="240">4 horas</option>
            <option value="480">8 horas (Jornada completa)</option>
          </select>
        </div>

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
            onClick={onOpenPasswordModal}
            className="h-7 px-3 bg-white hover:bg-emerald-50 hover:text-[#006837] border border-slate-200 hover:border-emerald-300 text-slate-700 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <KeyRound className="w-3 h-3 text-[#006837]" />
            <span>Alterar Senha</span>
          </button>
        </div>

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
            onClick={() => onRequire2FAChange(!require2FA)}
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
  );
}
