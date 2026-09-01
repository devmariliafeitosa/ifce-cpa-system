import { IllustrationCPA } from "./IllustrationCPA";

export function LoginBrandPanel() {
  return (
    <div className="hidden md:col-span-5 lg:col-span-6 md:flex flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-[#0B7A3E] to-[#045C2D] text-white relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -left-10 -top-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold tracking-wide border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
          Instituto Federal do Ceará
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
          Comissão Própria de Avaliação
        </h2>

        <p className="text-sm text-emerald-100/90 leading-relaxed font-normal max-w-md">
          Plataforma responsável pela gestão das avaliações institucionais do
          IFCE Campus Tauá.
        </p>
      </div>

      <div className="relative z-10 my-auto py-6">
        <IllustrationCPA />
      </div>

      <div className="relative z-10 text-xs text-emerald-200/80 font-medium border-t border-white/15 pt-4 flex items-center justify-between">
        <span>Avaliação Institucional Permanente</span>
        <span>Campus Tauá</span>
      </div>
    </div>
  );
}
