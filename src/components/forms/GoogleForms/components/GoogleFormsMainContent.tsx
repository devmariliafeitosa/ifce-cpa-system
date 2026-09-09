import {
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import React from 'react';
import type { User } from 'firebase/auth';
import type { GoogleFormFile } from '../../../../services/googleFormsService';
import { CPA_PRESET_TEMPLATES } from '../data/cpaPresetTemplates';

interface GoogleFormsMainContentProps {
  googleUser: User | null;
  token: string | null;
  isLoadingAuth: boolean;
  isLoggingIn: boolean;
  handleGoogleLogin: () => void;
  handleGoogleLogout: () => void;
  errorMsg: string | null;
  setErrorMsg: (value: string | null) => void;
  successMsg: string | null;
  setSuccessMsg: (value: string | null) => void;
  isLoadingForms: boolean;
  fetchForms: (currentToken?: string) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  isSubmittingForm: boolean;
  handleDeployPreset: (presetId: string) => void;
  formsList: GoogleFormFile[];
  handleInspectForm: (formId: string) => void;
  setDeleteTarget: (form: GoogleFormFile | null) => void;
}

export const GoogleFormsMainContent: React.FC<GoogleFormsMainContentProps> = ({
  googleUser,
  token,
  isLoadingAuth,
  isLoggingIn,
  handleGoogleLogin,
  handleGoogleLogout,
  errorMsg,
  setErrorMsg,
  successMsg,
  setSuccessMsg,
  isLoadingForms,
  fetchForms,
  setIsCreateModalOpen,
  isSubmittingForm,
  handleDeployPreset,
  formsList,
  handleInspectForm,
  setDeleteTarget,
}) => {
  
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner de Integração */}
      <div className="bg-gradient-to-r from-[#006837] via-[#045C2D] to-[#0A4222] rounded-xl p-4 sm:p-5 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 text-[11px] font-semibold">
              <FileSpreadsheet className="w-3 h-3 text-emerald-300" />
              <span>Integração com Google Forms & Drive</span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Sincronize questionários institucionais externos com o Campus
              Tauá.
            </p>
          </div>

          {/* Connection Status Button */}
          <div className="shrink-0">
            {googleUser && token ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#006837] font-bold flex items-center justify-center text-sm shadow-xs">
                  {googleUser.displayName?.[0] || "G"}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white truncate max-w-[180px]">
                    {googleUser.displayName || googleUser.email}
                  </p>
                  <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Google Forms Conectado
                  </p>
                </div>
                <button
                  onClick={handleGoogleLogout}
                  title="Desconectar conta Google"
                  className="ml-2 text-xs text-emerald-200 hover:text-white underline cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      style={{ display: "block" }}
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    {isLoggingIn ? "Conectando..." : "Conectar Google Forms"}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications / Feedback Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Atenção</p>
            <p>{errorMsg}</p>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-500 hover:text-rose-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Sucesso</p>
            <p>{successMsg}</p>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-500 hover:text-emerald-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Prompt if not authenticated */}
      {!token && !isLoadingAuth && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              Conexão Google Necessária
            </h3>
            <p className="text-xs text-slate-500">
              Para listar, criar e visualizar respostas de formulários no Google
              Forms do IFCE Campus Tauá, faça login com sua conta Google com
              permissão concedida.
            </p>
          </div>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#006837] hover:bg-[#045C2D] text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Conectar ao Google Forms com 1-Clique</span>
          </button>
        </div>
      )}

      {/* Main Content Area (Shown when connected or loading) */}
      {token && (
        <div className="space-y-8">
          {/* Action Row & Quick Presets */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                  Modelos de Formulário CPA (Prontos para Lançamento)
                </h2>
                <p className="text-xs text-slate-500">
                  Clique para publicar instantaneamente um questionário
                  padronizado no Google Forms do Campus Tauá.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchForms()}
                  disabled={isLoadingForms}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoadingForms ? "animate-spin" : ""}`}
                  />
                  <span>Atualizar</span>
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar Formulário Personalizado</span>
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CPA_PRESET_TEMPLATES.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#006837] bg-[#E8F5EE] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Modelo Oficial CPA
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-[#006837] transition-colors">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      {preset.questions.length} perguntas
                    </span>
                    <button
                      onClick={() => handleDeployPreset(preset.id)}
                      disabled={isSubmittingForm}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006837] hover:text-[#045C2D] bg-[#E8F5EE] hover:bg-[#d5eee0] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Publicar no Google</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* List of Existing Google Forms in Google Drive */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#006837]" />
                <h3 className="text-base font-bold text-slate-800">
                  Formulários Encontrados no Google Drive ({formsList.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Campus Tauá • Sincronizado
              </span>
            </div>

            {isLoadingForms ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#006837]" />
                <p className="text-xs font-medium">
                  Carregando formulários do Google Forms...
                </p>
              </div>
            ) : formsList.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">
                    Nenhum formulário no Google Drive
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Ainda não há formulários criados nesta conta. Escolha um dos
                    modelos da CPA acima ou clique em "Criar Formulário
                    Personalizado".
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {formsList.map((form) => (
                  <div
                    key={form.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 px-3 rounded-xl transition-colors"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[#006837] shrink-0" />
                        <h4 className="text-sm font-bold text-slate-800 hover:text-[#006837] transition-colors truncate">
                          {form.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Modificado:{" "}
                          {form.modifiedTime
                            ? new Date(form.modifiedTime).toLocaleDateString(
                                "pt-BR",
                              )
                            : "N/A"}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">
                          Google Forms Oficial
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleInspectForm(form.id)}
                        className="px-3 py-1.5 bg-[#E8F5EE] text-[#006837] hover:bg-[#d0ebd9] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Ver Detalhes e Respostas no app"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span>Ver Respostas</span>
                      </button>

                      {form.webViewLink && (
                        <a
                          href={form.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                          title="Abrir editor no Google Forms"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Abrir no Google</span>
                        </a>
                      )}

                      <button
                        onClick={() => setDeleteTarget(form)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir Formulário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
