import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatusScreenProps {
  icon: LucideIcon;
  tone: "warning" | "success" | "neutral";
  title: string;
  description: string;
}

const TONE_STYLES: Record<StatusScreenProps["tone"], string> = {
  warning: "bg-amber-100 text-amber-600",
  success: "bg-emerald-100 text-[#006837]",
  neutral: "bg-slate-100 text-slate-500",
};

export const StatusScreen: React.FC<StatusScreenProps> = ({
  icon: Icon,
  tone,
  title,
  description,
}) => {
  return (
    <div className="p-8 sm:p-10 text-center space-y-4">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${TONE_STYLES[tone]}`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
};
