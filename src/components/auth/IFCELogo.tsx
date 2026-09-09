import React from "react";

interface IFCELogoProps {
  className?: string;
  variant?: "full" | "compact" | "light";
  showSubtitle?: boolean;
}

export const IFCELogo: React.FC<IFCELogoProps> = ({
  className = "",
  variant = "full",
  showSubtitle = true,
}) => {
  const isLight = variant === "light";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official IFCE Logo Symbol (4 rows x 3 cols grid) */}
      <svg
        viewBox="0 0 100 135"
        className="w-9 h-11 flex-shrink-0 drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo IFCE"
      >
        {/* Row 1 */}
        <circle cx="15" cy="15" r="15" fill="#C8192E" />
        <rect x="36" y="0" width="30" height="30" rx="6" fill="#006837" />
        <rect x="70" y="0" width="30" height="30" rx="6" fill="#006837" />

        {/* Row 2 */}
        <rect x="0" y="35" width="30" height="30" rx="6" fill="#006837" />
        <rect x="36" y="35" width="30" height="30" rx="6" fill="#006837" />

        {/* Row 3 */}
        <rect x="0" y="70" width="30" height="30" rx="6" fill="#006837" />
        <rect x="36" y="70" width="30" height="30" rx="6" fill="#006837" />
        <rect x="70" y="70" width="30" height="30" rx="6" fill="#006837" />

        {/* Row 4 */}
        <rect x="0" y="105" width="30" height="30" rx="6" fill="#006837" />
        <rect x="36" y="105" width="30" height="30" rx="6" fill="#006837" />
      </svg>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight text-xl leading-none ${isLight ? "text-white" : "text-[#006837]"}`}
          >
            IFCE
          </span>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
              isLight ? "bg-white/20 text-white" : "bg-[#E8F5EE] text-[#006837]"
            }`}
          >
            CPA
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[11px] font-medium leading-tight mt-0.5 ${isLight ? "text-white/80" : "text-slate-500"}`}
          >
            Comissão Propria de Avaliação
          </span>
        )}
      </div>
    </div>
  );
};
