export function ProfileHeader() {
  return (
    <div
      id="profile-header"
      className="bg-white border border-slate-200/90 rounded-xl px-4 py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-700">
          Coordenação de Avaliação Institucional
        </span>

        <span className="bg-emerald-50 text-[#006837] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200/80">
          Coordenador Titular
        </span>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-[#006837] border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Sessão Ativa
        </span>
      </div>
    </div>
  );
}
