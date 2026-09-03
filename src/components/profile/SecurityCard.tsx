import { KeyRound } from "lucide-react";

interface SecurityCardProps {
  email: string;
  onChangePassword: () => void;
}

export function SecurityCard({ email, onChangePassword }: SecurityCardProps) {
  return (
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

        <div className="pt-1">
          <button
            type="button"
            onClick={onChangePassword}
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
  );
}
