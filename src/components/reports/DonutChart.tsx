interface DonutChartProps {
  potencialidadePct: number;
  medianaPct: number;
  fragilidadePct: number;
  size?: number;
}

export function DonutChart({
  potencialidadePct,
  medianaPct,
  fragilidadePct,
  size = 115,
}: DonutChartProps) {
  const radius = 46;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;

  const len1 = Math.max(0, (potencialidadePct / 100) * circumference);
  const len2 = Math.max(0, (medianaPct / 100) * circumference);
  const len3 = Math.max(0, (fragilidadePct / 100) * circumference);

  const offset1 = 0;
  const offset2 = len1;
  const offset3 = len1 + len2;

  const hasData =
    potencialidadePct > 0 || medianaPct > 0 || fragilidadePct > 0;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="-rotate-90 transform"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke={hasData ? "#f1f5f9" : "#e2e8f0"}
          strokeWidth={strokeWidth}
        />

        {potencialidadePct > 0 && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#006837"
            strokeWidth={strokeWidth}
            strokeDasharray={`${len1} ${circumference - len1}`}
            strokeDashoffset={-offset1}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}

        {medianaPct > 0 && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#d97706"
            strokeWidth={strokeWidth}
            strokeDasharray={`${len2} ${circumference - len2}`}
            strokeDashoffset={-offset2}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}

        {fragilidadePct > 0 && (
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#dc2626"
            strokeWidth={strokeWidth}
            strokeDasharray={`${len3} ${circumference - len3}`}
            strokeDashoffset={-offset3}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 pointer-events-none">
        <span className="text-base font-black text-slate-900 tracking-tight leading-none">
          {hasData ? `${potencialidadePct}%` : "0%"}
        </span>

        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
          {hasData ? "Potencial" : "Sem respostas"}
        </span>
      </div>
    </div>
  );
}