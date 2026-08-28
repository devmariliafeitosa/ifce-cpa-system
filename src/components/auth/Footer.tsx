import React from "react";
import {
  Globe,
  Mail,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-xs mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        {/* Institutional & CPA Info */}
        <div className="flex items-center gap-2 font-medium text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#006837]" />
          <span>Comissão Propria de Avaliação (CPA) IFCE</span>
        </div>

        {/* Links & Support */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a
            href="https://ifce.edu.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#006837] font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Portal IFCE</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href="https://ifce.edu.br/cpa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#006837] font-medium transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pagína da CPA</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href="mailto:cpa@ifce.edu.br"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#006837] font-medium transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#006837]" />
            <span>Suporte: cpa@ifce.edu.br</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-400 font-normal">
          ® {new Date().getFullYear()} IFCE. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
