import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Sliders,
  CheckCircle2,
  Save,
  ArrowLeft
} from "lucide-react";
import type { NavTabId } from "./navigation/navigationTypes";
interface PlaceholderViewProps {
  tabId: NavTabId;
  onReturnToDashboard?: () => void;
  onSelectTab?: (tab: NavTabId) => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  tabId,
  onReturnToDashboard,
}) => {
  const isProfile = tabId === "perfil";

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [exportAnonymized, setExportAnonymized] = useState(true);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-[#006837] rounded-xl shrink-0">
            {isProfile ? (
              <User className="w-5 h-5" />
            ) : (
              <Settings className="w-5 h-5" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {isProfile ? "Perfil da Coordenação" : "Configurações do Sistema"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {isProfile
                ? "Informações institucionais do Coordenador da CPA • Campus Tauá"
                : "Parâmetros operacionais e preferências da CPA"}
            </p>
          </div>
        </div>

        <button
          onClick={onReturnToDashboard}
          className="self-start sm:self-auto px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Dashboard</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#006837] px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Alterações salvas com sucesso no sistema local!</span>
        </div>
      )}

      {isProfile ? (
        /* Perfil do Coordenador */
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Dados Institucionais do Titular
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">
                Nome do Coordenador
              </label>
              <input
                type="text"
                readOnly
                value="Coordenador CPA Tauá"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-bold">
                Campus de Atuação
              </label>
              <input
                type="text"
                readOnly
                value="IFCE — Campus Tauá"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-bold">
                E-mail Institucional
              </label>
              <input
                type="text"
                readOnly
                value="cpa.taua@ifce.edu.br"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-bold">
                Matrícula SIAPE
              </label>
              <input
                type="text"
                readOnly
                value="1982736"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium outline-hidden"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              Vigência da Portaria: 2024 — 2026
            </span>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Confirmar Dados</span>
            </button>
          </div>
        </div>
      ) : (
        /* Configurações Gerais */
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Preferências Operacionais
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#006837]" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Notificações de Novas Respostas
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Enviar resumo diário para o e-mail da coordenação
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 accent-[#006837] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-[#006837]" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Sincronização com Google Forms
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Atualizar dados automaticamente a cada abertura de tela
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 accent-[#006837] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#006837]" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Anonimização Estrita LGPD
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Garantir sigilo das respostas e desvincular identificadores
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={exportAnonymized}
                onChange={(e) => setExportAnonymized(e.target.checked)}
                className="w-4 h-4 accent-[#006837] rounded"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#006837] hover:bg-[#00522b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
