import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  ExternalLink,
  Trash2,
  Eye,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Send,
  X,
  FileText,
  Clock,
  Loader2,
  Lock,
} from 'lucide-react';
import {
  googleSignIn,
  googleLogout,
  initAuth,
  getAccessToken,
} from '../lib/googleAuth';
import {
  GoogleFormFile,
  GoogleFormDetails,
  GoogleFormResponsesData,
  FormQuestionInput,
  listGoogleForms,
  getGoogleFormDetails,
  getGoogleFormResponses,
  createGoogleForm,
  deleteGoogleForm,
} from '../services/googleFormsService';
import { CPA_PRESET_TEMPLATES } from '../features/googleforms/data/cpaPresetTemplates';

interface GoogleFormsManagerProps {
  onReturnToDashboard?: () => void;
}

// Preset CPA Questionnaires for quick deployment in IFCE Campus Tauá

export const GoogleFormsManager: React.FC<GoogleFormsManagerProps> = () => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forms list state
  const [formsList, setFormsList] = useState<GoogleFormFile[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Custom Form Builder state
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customQuestions, setCustomQuestions] = useState<FormQuestionInput[]>([
    {
      title: 'Como você avalia a organização do curso?',
      type: 'SCALE',
      required: true,
    },
  ]);

  // Selected Form Details & Inspector Modal
  const [inspectFormId, setInspectFormId] = useState<string | null>(null);
  const [inspectDetails, setInspectDetails] = useState<GoogleFormDetails | null>(null);
  const [inspectResponses, setInspectResponses] = useState<GoogleFormResponsesData | null>(null);
  const [isLoadingInspect, setIsLoadingInspect] = useState(false);

  // Delete Confirmation Dialog state
  const [deleteTarget, setDeleteTarget] = useState<GoogleFormFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, accessToken) => {
        setGoogleUser(user);
        setToken(accessToken);
        setIsLoadingAuth(false);
        fetchForms(accessToken);
      },
      () => {
        setGoogleUser(null);
        setToken(null);
        setIsLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setToken(res.accessToken);
        setSuccessMsg('Conectado com sucesso ao Google Forms!');
        fetchForms(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao conectar com o Google. Tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleLogout();
    setGoogleUser(null);
    setToken(null);
    setFormsList([]);
    setSuccessMsg('Conta desconectada do Google.');
  };

  const fetchForms = async (currentToken?: string) => {
    const authToken = currentToken || token || getAccessToken();
    if (!authToken) return;

    setIsLoadingForms(true);
    setErrorMsg(null);
    try {
      const files = await listGoogleForms(authToken);
      setFormsList(files);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message ||
          'Erro ao buscar formulários no Google Drive. Verifique se o login está ativo.'
      );
    } finally {
      setIsLoadingForms(false);
    }
  };

  // Quick Create Preset Form
  const handleDeployPreset = async (presetId: string) => {
    const authToken = token || getAccessToken();
    if (!authToken) {
      setErrorMsg('Por favor, conecte sua conta Google primeiro.');
      return;
    }

    const template = CPA_PRESET_TEMPLATES.find((t) => t.id === presetId);
    if (!template) return;

    setIsSubmittingForm(true);
    setErrorMsg(null);
    try {
      const created = await createGoogleForm(
        authToken,
        template.title,
        template.description,
        template.questions
      );
      setSuccessMsg(`Formulário "${template.title}" criado com sucesso no Google Forms!`);
      fetchForms(authToken);
      if (created?.formId) {
        handleInspectForm(created.formId);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao publicar formulário no Google Forms.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Create Custom Form
  const handleCreateCustomForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = token || getAccessToken();
    if (!authToken) {
      setErrorMsg('Conecte ao Google Forms antes de criar.');
      return;
    }

    if (!customTitle.trim()) {
      setErrorMsg('Por favor, digite o título do formulário.');
      return;
    }

    setIsSubmittingForm(true);
    setErrorMsg(null);
    try {
      const created = await createGoogleForm(
        authToken,
        customTitle,
        customDescription,
        customQuestions
      );
      setSuccessMsg(`Formulário "${customTitle}" criado com sucesso no Google Forms!`);
      setIsCreateModalOpen(false);
      setCustomTitle('');
      setCustomDescription('');
      setCustomQuestions([
        {
          title: 'Como você avalia a organização do curso?',
          type: 'SCALE',
          required: true,
        },
      ]);
      fetchForms(authToken);
      if (created?.formId) {
        handleInspectForm(created.formId);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao criar o formulário.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Inspect Form & Fetch Responses
  const handleInspectForm = async (formId: string) => {
    const authToken = token || getAccessToken();
    if (!authToken) return;

    setInspectFormId(formId);
    setIsLoadingInspect(true);
    setInspectDetails(null);
    setInspectResponses(null);

    try {
      const [details, responses] = await Promise.all([
        getGoogleFormDetails(authToken, formId),
        getGoogleFormResponses(authToken, formId).catch(() => ({
          responses: [],
          totalResponses: 0,
        })),
      ]);
      setInspectDetails(details);
      setInspectResponses(responses);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao buscar detalhes e respostas do formulário.');
    } finally {
      setIsLoadingInspect(false);
    }
  };

  // Confirm and Delete Form
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const authToken = token || getAccessToken();
    if (!authToken) return;

    setIsDeleting(true);
    try {
      await deleteGoogleForm(authToken, deleteTarget.id);
      setSuccessMsg(`Formulário "${deleteTarget.name}" movido para a lixeira do Google Drive.`);
      setDeleteTarget(null);
      fetchForms(authToken);
      if (inspectFormId === deleteTarget.id) {
        setInspectFormId(null);
        setInspectDetails(null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao excluir o formulário.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Form question builders handlers
  const addQuestion = () => {
    setCustomQuestions([
      ...customQuestions,
      {
        title: '',
        type: 'SCALE',
        required: true,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (customQuestions.length <= 1) return;
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof FormQuestionInput, value: any) => {
    const updated = [...customQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setCustomQuestions(updated);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006837] via-[#045C2D] to-[#0A4222] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-100 text-xs font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span>Integração Oficial Google Forms • CPA IFCE Tauá</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Gerenciador de Formulários do Google
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Crie, distribua e acompanhe questionários de autoavaliação institucional no Google Forms diretamente no sistema da CPA Tauá.
            </p>
          </div>

          {/* Connection Status Button */}
          <div className="shrink-0">
            {googleUser && token ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#006837] font-bold flex items-center justify-center text-sm shadow-xs">
                  {googleUser.displayName?.[0] || 'G'}
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
                      style={{ display: 'block' }}
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
                    {isLoggingIn ? 'Conectando...' : 'Conectar Google Forms'}
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
            <h3 className="text-base font-bold text-slate-800">Conexão Google Necessária</h3>
            <p className="text-xs text-slate-500">
              Para listar, criar e visualizar respostas de formulários no Google Forms do IFCE Campus Tauá, faça login com sua conta Google com permissão concedida.
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
                  Clique para publicar instantaneamente um questionário padronizado no Google Forms do Campus Tauá.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchForms()}
                  disabled={isLoadingForms}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForms ? 'animate-spin' : ''}`} />
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
                <p className="text-xs font-medium">Carregando formulários do Google Forms...</p>
              </div>
            ) : formsList.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">Nenhum formulário no Google Drive</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Ainda não há formulários criados nesta conta. Escolha um dos modelos da CPA acima ou clique em "Criar Formulário Personalizado".
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
                          Modificado:{' '}
                          {form.modifiedTime
                            ? new Date(form.modifiedTime).toLocaleDateString('pt-BR')
                            : 'N/A'}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">Google Forms Oficial</span>
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

      {/* MODAL: Custom Form Builder */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#006837]" />
                <h3 className="text-base font-bold text-slate-800">
                  Criar Novo Google Form • CPA Tauá
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomForm} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título do Formulário *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Avaliação de Cursos Técnicos 2025.1"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Descrição / Instruções</label>
                <textarea
                  rows={2}
                  placeholder="Instruções aos discentes ou servidores respondentes do Campus Tauá..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                />
              </div>

              {/* Questions Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Perguntas do Questionário ({customQuestions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="text-xs font-semibold text-[#006837] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Pergunta
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {customQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#006837] shrink-0">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Digite o enunciado da pergunta..."
                          value={q.title}
                          onChange={(e) => updateQuestion(idx, 'title', e.target.value)}
                          className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837]"
                        />
                        {customQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <label className="text-slate-500 font-medium">Tipo:</label>
                          <select
                            value={q.type}
                            onChange={(e) => updateQuestion(idx, 'type', e.target.value as any)}
                            className="h-8 px-2 bg-white border border-slate-200 rounded-md text-xs font-medium focus:outline-none"
                          >
                            <option value="SCALE">Escala de Satisfação (1 a 5)</option>
                            <option value="RADIO">Múltipla Escolha (Opção Única)</option>
                            <option value="TEXT">Resposta de Texto Livre</option>
                          </select>
                        </div>

                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => updateQuestion(idx, 'required', e.target.checked)}
                            className="accent-[#006837]"
                          />
                          <span>Obrigatória</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isSubmittingForm ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando no Google...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Criar e Publicar Formulário</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Form Inspector & Responses Viewer */}
      {inspectFormId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#006837]" />
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Inspeção do Formulário Google
                  </h3>
                  <p className="text-[11px] text-slate-400">ID: {inspectFormId}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectFormId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingInspect ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#006837]" />
                <p className="text-xs font-medium">Buscando dados no Google Forms API...</p>
              </div>
            ) : inspectDetails ? (
              <div className="space-y-6">
                {/* Form Header info */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-2">
                  <h4 className="text-base font-bold text-slate-800">
                    {inspectDetails.info?.title}
                  </h4>
                  {inspectDetails.info?.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {inspectDetails.info.description}
                    </p>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#006837]">
                    <span>Perguntas: {inspectDetails.items?.length || 0}</span>
                    <span>•</span>
                    <span>Total Respostas Recebidas: {inspectResponses?.totalResponses || 0}</span>
                  </div>
                </div>

                {/* Direct Links */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://docs.google.com/forms/d/${inspectFormId}/viewform`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#006837] text-white hover:bg-[#045C2D] text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Visualizar / Preencher Formulário</span>
                  </a>

                  <a
                    href={`https://docs.google.com/forms/d/${inspectFormId}/edit#responses`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Abrir Gráficos Nativos no Google Forms</span>
                  </a>
                </div>

                {/* Items & Questions list */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Perguntas Cadastradas ({inspectDetails.items?.length || 0})
                  </h5>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {inspectDetails.items?.map((item, idx) => (
                      <div
                        key={item.itemId || idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
                      >
                        <p className="font-bold text-slate-800">
                          {idx + 1}. {item.title}
                        </p>
                        {item.questionItem?.question?.choiceQuestion && (
                          <div className="pl-4 text-[11px] text-slate-500 space-y-0.5">
                            {item.questionItem.question.choiceQuestion.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>{opt.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.questionItem?.question?.scaleQuestion && (
                          <p className="text-[11px] text-[#006837] font-medium">
                            Escala Linear ({item.questionItem.question.scaleQuestion.low} a{' '}
                            {item.questionItem.question.scaleQuestion.high})
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Embedded Form Preview Frame */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pré-visualização Incorporada
                  </h5>
                  <div className="w-full h-80 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <iframe
                      src={`https://docs.google.com/forms/d/${inspectFormId}/viewform?embedded=true`}
                      className="w-full h-full border-0"
                      title="Google Form Embedded Preview"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DESTRUCTIVE ACTION (Excluir Formulário) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Confirmar Exclusão de Formulário
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tem certeza de que deseja mover o formulário{' '}
                  <strong className="text-slate-800">"{deleteTarget.name}"</strong> para a lixeira do Google Drive? Esta ação removerá o formulário do sistema da CPA.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Aviso de Segurança
              </p>
              <p className="text-[11px] leading-relaxed">
                As respostas acumuladas no Google Forms poderão deixar de aceitar novos envios.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Sim, Excluir Formulário</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
