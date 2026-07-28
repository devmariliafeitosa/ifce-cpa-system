import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, UserCheck, LogOut, Sparkles, Building2, FileText, BarChart2 } from 'lucide-react';

interface AuthSuccessModalProps {
  userEmail: string;
  onLogout: () => void;
}

export const AuthSuccessModal: React.FC<AuthSuccessModalProps> = ({
  userEmail,
  onLogout,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-0"
      >
        {/* Top Accent Banner */}
        <div className="bg-gradient-to-r from-[#0B7A3E] to-[#045C2D] p-6 text-white text-center relative">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle2 className="w-7 h-7 text-emerald-200" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Autenticação Confirmada
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Acesso Autorizado à Coordenação
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Bem-vindo(a) à plataforma da Comissão Própria de Avaliação do IFCE.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* User Profile Card */}
          <div className="bg-[#F7F8FA] border border-slate-200 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#E8F5EE] border border-[#0B7A3E]/20 text-[#0B7A3E] flex items-center justify-center font-bold text-sm flex-shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-medium">Coordenador(a) Autenticado(a)</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{userEmail}</p>
              <p className="text-[11px] text-[#0B7A3E] font-medium flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3" />
                <span>Instituto Federal do Ceará (IFCE)</span>
              </p>
            </div>
          </div>

          {/* Phase 1 Scope Explanation */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0B7A3E]" />
              Status do Sistema (Etapa 1)
            </h3>
            <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3.5 text-xs text-slate-700 space-y-2">
              <p className="leading-relaxed">
                As telas de autenticação da Coordenação da CPA foram concluídas com validação de domínio institucional (<strong className="font-semibold text-[#0B7A3E]">@ifce.edu.br</strong>), formulários responsivos, mensagens de erro e recuperação de senha.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/50 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <FileText className="w-3.5 h-3.5 text-[#0B7A3E]" />
                  <span>Questionários (Links Diretos)</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <BarChart2 className="w-3.5 h-3.5 text-[#0B7A3E]" />
                  <span>Relatórios & Dashboard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              id="logout-btn"
              type="button"
              onClick={onLogout}
              className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair / Testar Novo Login</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-center text-[11px] text-slate-400 font-medium">
          CPA IFCE • Comissão Própria de Avaliação
        </div>
      </motion.div>
    </motion.div>
  );
};

