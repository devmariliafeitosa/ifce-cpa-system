import { User } from "lucide-react";

interface PersonalDataCardProps {
  fullName: string;
  email: string;
  phone: string;
  siape: string;
  department: string;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export function PersonalDataCard({
  fullName,
  email,
  phone,
  siape,
  department,
  onFullNameChange,
  onPhoneChange,
}: PersonalDataCardProps) {
  return (
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

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 block">
            Nome Completo
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(event) => onFullNameChange(event.target.value)}
            className="w-full h-8 px-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all"
            placeholder="Nome do Coordenador"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">
              Telefone / Ramal
            </label>

            <input
              type="text"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              className="w-full h-8 px-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white transition-all"
              placeholder="(88) 3437-0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
  );
}
