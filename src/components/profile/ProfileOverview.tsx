import { Building2, KeyRound, Mail } from "lucide-react";

interface ProfileOverviewProps {
  fullName: string;
  campus: string;
  email: string;
  onChangePassword: () => void;
}

export function ProfileOverview({
  fullName,
  campus,
  email,
  onChangePassword,
}: ProfileOverviewProps) {
  const initials =
    fullName
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CT";

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#006837] to-[#00522b] text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shrink-0 border-2 border-white ring-2 ring-emerald-100">
          {initials}
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {fullName}
            </h2>

            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#E8F5EE] text-[#006837] border border-[#006837]/20 uppercase tracking-wider">
              Coordenador CPA
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{campus}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{email}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onChangePassword}
        className="h-8 px-3 bg-white hover:bg-emerald-50 hover:text-[#006837] border border-slate-200 hover:border-emerald-300 text-slate-700 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-center"
      >
        <KeyRound className="w-3.5 h-3.5 text-[#006837]" />
        <span>Alterar Senha de Acesso</span>
      </button>
    </div>
  );
}
