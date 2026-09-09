import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Eye,
  HelpCircle,
  Info,
  Link2,
  Mail,
  Plus,
  QrCode,
  Save,
  Send,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import React from 'react';
import type { SmartForm, SmartQuestion, TargetAudience } from '../../../../types';
import { IFCE_CAMPUSES, WIZARD_STEPS } from '../data/constants';

interface SendMethods {
  email: boolean;
  qrcode: boolean;
  link: boolean;
}

interface CreateFormWizardModalProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isCampaignSentSuccess: boolean;
  setIsCampaignSentSuccess: (value: boolean) => void;
  editingForm: SmartForm | null;
  wizardStep: number;
  setWizardStep: React.Dispatch<React.SetStateAction<number>>;

  formTitle: string;
  setFormTitle: (value: string) => void;
  formDescription: string;
  setFormDescription: (value: string) => void;
  formCampus: string;
  setFormCampus: (value: string) => void;
  formPeriodo: string;
  formStartTime: string;
  setFormStartTime: (value: string) => void;
  formEndTime: string;
  setFormEndTime: (value: string) => void;
  formAudiences: TargetAudience[];
  formQuestions: SmartQuestion[];

  selectedSegment: 'alunos' | 'docentes' | 'taes';
  setSelectedSegment: (segment: 'alunos' | 'docentes' | 'taes') => void;
  completedSegments: string[];
  setCompletedSegments: (segments: string[]) => void;

  wizardCampaignName: string;
  wizardCampaignCampus: string;
  wizardCampaignStartDate: string;
  setWizardCampaignStartDate: (value: string) => void;
  wizardCampaignEndDate: string;
  setWizardCampaignEndDate: (value: string) => void;
  wizardCampaignEstimatedTime: string;
  setWizardCampaignEstimatedTime: (value: string) => void;

  sendMethods: SendMethods;
  setSendMethods: (methods: SendMethods) => void;
  emailSubject: string;
  wizardCopiedLink: boolean;
  setWizardCopiedLink: (value: boolean) => void;

  handleAddGeneralQuestion: () => void;
  handleAddSegmentQuestion: (segment: 'alunos' | 'docentes' | 'taes') => void;
  handleAdvanceToCampaignSend: () => void;
  handleSaveProgressDraft: () => void;
  renderQuestionCard: (q: SmartQuestion, qIdx: number, totalCount: number) => React.ReactNode;

  setIsPreviewQuestionsModalOpen: (open: boolean) => void;
  setShowEmailPreviewModal: (open: boolean) => void;
  setShowEmailEditModal: (open: boolean) => void;
  setShowQrCodePreviewModal: (open: boolean) => void;
  setShowSendConfirmModal: (open: boolean) => void;

  onSelectTab?: (tab: string) => void;
}

export const CreateFormWizardModal: React.FC<CreateFormWizardModalProps> = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  isCampaignSentSuccess,
  setIsCampaignSentSuccess,
  editingForm,
  wizardStep,
  setWizardStep,
  formTitle,
  setFormTitle,
  formDescription,
  setFormDescription,
  formCampus,
  setFormCampus,
  formPeriodo,
  formStartTime,
  setFormStartTime,
  formEndTime,
  setFormEndTime,
  formAudiences,
  formQuestions,
  selectedSegment,
  setSelectedSegment,
  completedSegments,
  setCompletedSegments,
  wizardCampaignName,
  wizardCampaignCampus,
  wizardCampaignStartDate,
  setWizardCampaignStartDate,
  wizardCampaignEndDate,
  setWizardCampaignEndDate,
  wizardCampaignEstimatedTime,
  setWizardCampaignEstimatedTime,
  sendMethods,
  setSendMethods,
  emailSubject,
  wizardCopiedLink,
  setWizardCopiedLink,
  handleAddGeneralQuestion,
  handleAddSegmentQuestion,
  handleAdvanceToCampaignSend,
  handleSaveProgressDraft,
  renderQuestionCard,
  setIsPreviewQuestionsModalOpen,
  setShowEmailPreviewModal,
  setShowEmailEditModal,
  setShowQrCodePreviewModal,
  setShowSendConfirmModal,
  onSelectTab,
}) => {
  return (
    <>
      {/* MODAL 1: Wizard de Criação de Formulários (CPA IFCE) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div
            className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
              isCampaignSentSuccess
                ? 'max-w-md w-full p-6 sm:p-7 space-y-4 my-auto animate-in zoom-in-95'
                : 'max-w-4xl w-full h-680px max-h-[92vh]'
            }`}
          >
            {isCampaignSentSuccess ? (
              <div className="text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-[#006837] rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h3 className="text-lg font-black text-slate-900 leading-tight">Campanha enviada com sucesso!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Os convites e informativos foram disponibilizados aos participantes. Você já pode acompanhar as respostas em tempo real pelo módulo de Relatórios.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-left space-y-1 text-xs shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-[#006837] truncate">{wizardCampaignName || formTitle}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#006837] font-bold text-[10px] shrink-0">
                      Ativa
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">Campus: {wizardCampaignCampus}</p>
                  <p className="text-slate-600 text-[11px]">Período: {wizardCampaignStartDate} até {wizardCampaignEndDate}</p>
                  <p className="text-slate-600 text-[11px]">Público: {formAudiences.length} segmento(s)</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsCampaignSentSuccess(false);
                      onSelectTab?.('reports');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-[#006837] text-white font-extrabold text-xs rounded-xl hover:bg-[#045C2D] transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Ir para Relatórios</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsCampaignSentSuccess(false);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Voltar para Formulários
                  </button>
                </div>
              </div>
            ) : (
              <>
            {/* CABEÇALHO DO WIZARD (COMPACTO E LIMPO) */}
            <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-3 space-y-2 shrink-0">
              {/* Header Top Row: Title, Step Subtitle & Close */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate tracking-tight">
                    {formTitle.trim() ? formTitle : 'Novo Formulário'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Etapa {wizardStep} de {WIZARD_STEPS.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                  title="Fechar assistente"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Discrete Progress Bar */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#006837] transition-all duration-300 rounded-full"
                  style={{ width: `${Math.round((wizardStep / WIZARD_STEPS.length) * 100)}%` }}
                />
              </div>

              {/* STEPPER INDICATOR RAIL */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 pt-0.5">
                {WIZARD_STEPS.map((step) => {
                  const isActive = wizardStep === step.id;
                  const isCompleted = wizardStep > step.id;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setWizardStep(step.id)}
                      className={`py-1 px-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
                        isActive
                          ? 'bg-[#006837] text-white shadow-2xs'
                          : isCompleted
                          ? 'bg-emerald-100/80 text-[#006837] hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200/70'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 shrink-0" />
                      ) : (
                        <span className="text-[11px] shrink-0">{step.id}</span>
                      )}
                      <span className="truncate text-[10px] sm:text-[11px] font-medium">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CORPO DO WIZARD (CONTEÚDO DAS ETAPAS) */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

              {/* ETAPA 1 — INFORMAÇÕES DO FORMULÁRIO */}
              {wizardStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#006837]" />
                      Etapa 1: Informações do Formulário
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informe o título, a apresentação e o campus do IFCE para onde este instrumento será direcionado.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Campo 1: Título do Formulário */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>Título do Formulário</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Avaliação Institucional CPA 2026.2"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full h-11 px-4 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium transition-all"
                      />
                      <p className="text-[11px] text-slate-400 italic">
                        O título digitado aqui é atualizado automaticamente no cabeçalho do assistente.
                      </p>
                    </div>

                    {/* Campo 2: Descrição */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        Descrição / Apresentação Institucional
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Descreva os objetivos do formulário e orientações para os participantes..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-medium transition-all"
                      />
                    </div>

                    {/* Campo 3: Campus (Seletor com lista de todos os campi do IFCE) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#006837]" />
                        <span>Campus do IFCE</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formCampus}
                        onChange={(e) => setFormCampus(e.target.value)}
                        className="w-full h-11 px-3.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] font-semibold text-slate-800 transition-all cursor-pointer"
                      >
                        {IFCE_CAMPUSES.map((campusName) => (
                          <option key={campusName} value={campusName}>
                            {campusName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 2 — PERGUNTAS GERAIS */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-[#006837]" />
                      <span>Perguntas Gerais</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#006837] text-[11px] font-extrabold">
                        {formQuestions.filter((q) => q.audiences.includes('todos')).length}
                      </span>
                    </h4>

                    <button
                      type="button"
                      onClick={handleAddGeneralQuestion}
                      className="px-3.5 py-1.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Pergunta Geral</span>
                    </button>
                  </div>

                  {/* Questions List (Filtered for 'todos') */}
                  {formQuestions.filter((q) => q.audiences.includes('todos')).length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/50">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">Nenhuma pergunta geral cadastrada</p>
                        <p className="text-[11px] text-slate-400">Clique no botão acima para adicionar a primeira pergunta aberta a todos os segmentos.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddGeneralQuestion}
                        className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Pergunta Geral</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                      {(() => {
                        const filtered = formQuestions.filter((q) => q.audiences.includes('todos'));
                        return (
                          <>
                            {filtered.map((q, qIdx) => renderQuestionCard(q, qIdx, filtered.length))}
                            <div className="pt-2 pb-1">
                              <button
                                type="button"
                                onClick={handleAddGeneralQuestion}
                                className="w-full py-2.5 px-4 border-2 border-dashed border-emerald-300 hover:border-[#006837] bg-emerald-50/40 hover:bg-emerald-50 text-[#006837] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
                              >
                                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Adicionar Nova Pergunta Geral</span>
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 3 — ESCOLHA DO SEGMENTO */}
              {wizardStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#006837]" />
                      Segmentos Específicos
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Agora selecione qual segmento deseja configurar.
                    </p>
                  </div>

                  {/* 3 CARDS GRANDES DE SEGMENTO */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* CARD 1: DISCENTES */}
                    {(() => {
                      const qCount = formQuestions.filter((q) => q.audiences.includes('alunos') && !q.audiences.includes('todos')).length;
                      const isDone = qCount > 0 || completedSegments.includes('alunos');

                      return (
                        <div
                          
                          onClick={() => {
                            setSelectedSegment('alunos');
                            setWizardStep(4);
                          }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                            selectedSegment === 'alunos'
                              ? 'border-[#006837] bg-emerald-50/50 shadow-md ring-2 ring-[#006837]/20'
                              : isDone
                              ? 'border-emerald-200 bg-white hover:border-[#006837]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                              🎓
                            </div>

                            {isDone ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#006837] text-[11px] font-extrabold flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Concluído
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                                Pendente
                              </span>
                            )}
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#006837] transition-colors">
                              Discentes
                            </h5>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Estudantes de cursos técnicos, graduação e pós-graduação.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600">
                              {qCount} {qCount === 1 ? 'pergunta' : 'perguntas'}
                            </span>
                            <span className="text-[#006837] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Configurar <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* CARD 2: DOCENTES */}
                    {(() => {
                      const qCount = formQuestions.filter((q) => q.audiences.includes('docentes') && !q.audiences.includes('todos')).length;
                      const isDone = qCount > 0 || completedSegments.includes('docentes');

                      return (
                        <div
                          onClick={() => {
                            setSelectedSegment('docentes');
                            setWizardStep(4);
                          }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                            selectedSegment === 'docentes'
                              ? 'border-[#006837] bg-emerald-50/50 shadow-md ring-2 ring-[#006837]/20'
                              : isDone
                              ? 'border-emerald-200 bg-white hover:border-[#006837]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006837] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                              👨‍🏫
                            </div>

                            {isDone ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#006837] text-[11px] font-extrabold flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Concluído
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                                Pendente
                              </span>
                            )}
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#006837] transition-colors">
                              Docentes
                            </h5>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Professores efetivos, substitutos e visitantes do IFCE.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600">
                              {qCount} {qCount === 1 ? 'pergunta' : 'perguntas'}
                            </span>
                            <span className="text-[#006837] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Configurar <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* CARD 3: TAES */}
                    {(() => {
                      const qCount = formQuestions.filter((q) => q.audiences.includes('taes') && !q.audiences.includes('todos')).length;
                      const isDone = qCount > 0 || completedSegments.includes('taes');

                      return (
                        <div
                          onClick={() => {
                            setSelectedSegment('taes');
                            setWizardStep(4);
                          }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative ${
                            selectedSegment === 'taes'
                              ? 'border-[#006837] bg-emerald-50/50 shadow-md ring-2 ring-[#006837]/20'
                              : isDone
                              ? 'border-emerald-200 bg-white hover:border-[#006837]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                              👨‍💼
                            </div>

                            {isDone ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#006837] text-[11px] font-extrabold flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Concluído
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                                Pendente
                              </span>
                            )}
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#006837] transition-colors">
                              Técnicos Administrativos (TAEs)
                            </h5>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Corpo técnico-administrativo em educação.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600">
                              {qCount} {qCount === 1 ? 'pergunta' : 'perguntas'}
                            </span>
                            <span className="text-[#006837] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Configurar <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <p className="text-xs text-slate-500 text-center italic">
                    Ao selecionar um segmento acima, você será direcionado para cadastrar as perguntas exclusivas desse grupo.
                  </p>
                </div>
              )}

              {/* ETAPA 4 — PERGUNTAS DO SEGMENTO */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Cabeçalho da Etapa 4 (Sem filtro/troca de segmento) */}
                  <div className="border-b border-slate-100 pb-2.5">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#006837]" />
                      <span>
                        Perguntas para{' '}
                        {selectedSegment === 'alunos'
                          ? 'Discentes'
                          : selectedSegment === 'docentes'
                          ? 'Docentes'
                          : 'Técnicos Administrativos (TAEs)'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cadastre as perguntas específicas direcionadas exclusivamente para este grupo.
                    </p>
                  </div>

                  {/* Lista de perguntas do segmento selecionado */}
                  {formQuestions.filter((q) => q.audiences.includes(selectedSegment) && !q.audiences.includes('todos')).length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-4 bg-slate-50/50">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          Nenhuma pergunta específica cadastrada para {selectedSegment === 'alunos' ? 'Discentes' : selectedSegment === 'docentes' ? 'Docentes' : 'TAEs'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Estas perguntas serão exibidas somente no questionário deste segmento.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddSegmentQuestion(selectedSegment)}
                          className="w-full sm:w-auto py-2.5 px-4 border-2 border-dashed border-emerald-300 hover:border-[#006837] bg-emerald-50/40 hover:bg-emerald-50 text-[#006837] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
                        >
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Adicionar Nova Pergunta para {selectedSegment === 'alunos' ? 'Discentes' : selectedSegment === 'docentes' ? 'Docentes' : 'TAEs'}</span>
                        </button>

                        {selectedSegment === 'alunos' ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (!completedSegments.includes('alunos')) setCompletedSegments([...completedSegments, 'alunos']);
                              setSelectedSegment('docentes');
                            }}
                            className="w-full sm:w-auto py-2.5 px-4 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                          >
                            <span>Próximo segmento (Docentes)</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : selectedSegment === 'docentes' ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (!completedSegments.includes('docentes')) setCompletedSegments([...completedSegments, 'docentes']);
                              setSelectedSegment('taes');
                            }}
                            className="w-full sm:w-auto py-2.5 px-4 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                          >
                            <span>Próximo segmento (TAEs)</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (!completedSegments.includes('taes')) setCompletedSegments([...completedSegments, 'taes']);
                              setWizardStep(5);
                            }}
                            className="w-full sm:w-auto py-2.5 px-4 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                          >
                            <span>Concluir e ir para Revisão</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {(() => {
                        const filtered = formQuestions.filter((q) => q.audiences.includes(selectedSegment) && !q.audiences.includes('todos'));
                        const segmentLabel = selectedSegment === 'alunos' ? 'Discentes' : selectedSegment === 'docentes' ? 'Docentes' : 'TAEs';
                        return (
                          <>
                            {filtered.map((q, qIdx) => renderQuestionCard(q, qIdx, filtered.length))}
                            <div className="pt-2 pb-1 flex flex-col sm:flex-row items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleAddSegmentQuestion(selectedSegment)}
                                className="w-full sm:flex-1 py-2.5 px-4 border-2 border-dashed border-emerald-300 hover:border-[#006837] bg-emerald-50/40 hover:bg-emerald-50 text-[#006837] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
                              >
                                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Adicionar Nova Pergunta para {segmentLabel}</span>
                              </button>

                              {selectedSegment === 'alunos' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!completedSegments.includes('alunos')) setCompletedSegments([...completedSegments, 'alunos']);
                                    setSelectedSegment('docentes');
                                  }}
                                  className="w-full sm:w-auto py-2.5 px-4 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                                >
                                  <span>Próximo segmento (Docentes)</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              ) : selectedSegment === 'docentes' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!completedSegments.includes('docentes')) setCompletedSegments([...completedSegments, 'docentes']);
                                    setSelectedSegment('taes');
                                  }}
                                  className="w-full sm:w-auto py-2.5 px-4 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                                >
                                  <span>Próximo segmento (TAEs)</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!completedSegments.includes('taes')) setCompletedSegments([...completedSegments, 'taes']);
                                    setWizardStep(5);
                                  }}
                                  className="w-full sm:w-auto py-2.5 px-4 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                                >
                                  <span>Concluir e ir para Revisão</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 5 — REVISÃO DO FORMULÁRIO */}
              {wizardStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Cabeçalho da Etapa */}
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#006837]" />
                      <span>REVISÃO DO FORMULÁRIO</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Confira o resumo da estrutura do formulário antes de avançar para a configuração de envio.
                    </p>
                  </div>

                  {/* RESUMO RÁPIDO NO TOPO */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center space-y-0.5">
                      <span className="text-base font-black text-[#006837] block leading-none">{formQuestions.length}</span>
                      <span className="text-[11px] font-bold text-slate-600 block">Perguntas</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center space-y-0.5">
                      <span className="text-base font-black text-[#006837] block leading-none">{formAudiences.length}</span>
                      <span className="text-[11px] font-bold text-slate-600 block">Segmentos</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center space-y-0.5 truncate">
                      <span className="text-xs font-black text-slate-800 block truncate leading-snug" title={formCampus}>
                        {formCampus.replace('IFCE Campus ', '')}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 block">Campus</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center space-y-0.5">
                      <span className="text-xs font-black text-slate-800 block leading-snug">
                        {formPeriodo || '2026.2'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 block">Semestre</span>
                    </div>
                  </div>

                  {/* BLOCOS COMPACTOS DA REVISÃO (SEM CONFIGURAÇÃO DE TEMPO) */}
                  <div className="space-y-3">
                    {/* BLOCO 1: Informações Gerais */}
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-[#006837]" />
                          Informações Gerais
                        </span>
                        <button
                          type="button"
                          onClick={() => setWizardStep(1)}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#006837] hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium block text-[11px]">Título:</span>
                          <span className="font-bold text-slate-800">{formTitle.trim() ? formTitle : 'Novo Formulário'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block text-[11px]">Campus:</span>
                          <span className="font-bold text-slate-800">{formCampus}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block text-[11px]">Período Letivo:</span>
                          <span className="font-bold text-slate-800">{formPeriodo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block text-[11px]">Descrição:</span>
                          <span className="font-medium text-slate-600 line-clamp-1">{formDescription.trim() ? formDescription : 'Sem descrição.'}</span>
                        </div>
                      </div>
                    </div>

                    {/* BLOCO 2: Participantes / Segmentos */}
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#006837]" />
                          Participantes Convocados
                        </span>
                        <button
                          type="button"
                          onClick={() => setWizardStep(3)}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#006837] hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {formAudiences.includes('alunos') && (
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-indigo-600" /> Discentes
                          </span>
                        )}
                        {formAudiences.includes('docentes') && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-[#006837] border border-emerald-200 rounded-lg font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-[#006837]" /> Docentes
                          </span>
                        )}
                        {formAudiences.includes('taes') && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-amber-600" /> TAEs
                          </span>
                        )}
                      </div>
                    </div>

                    {/* BLOCO 3: Perguntas */}
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-[#006837]" />
                          Distribuição das Perguntas ({formQuestions.length} no total)
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setIsPreviewQuestionsModalOpen(true)}
                            className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Ver perguntas</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setWizardStep(2)}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#006837] hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-slate-500 font-medium block text-[10px]">Gerais (Todos)</span>
                          <span className="font-bold text-slate-800">{formQuestions.filter((q) => q.audiences.includes('todos')).length} perguntas</span>
                        </div>
                        <div className="p-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                          <span className="text-indigo-600 font-medium block text-[10px]">Discentes</span>
                          <span className="font-bold text-indigo-950">{formQuestions.filter((q) => q.audiences.includes('alunos') && !q.audiences.includes('todos')).length} perguntas</span>
                        </div>
                        <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                          <span className="text-[#006837] font-medium block text-[10px]">Docentes</span>
                          <span className="font-bold text-emerald-950">{formQuestions.filter((q) => q.audiences.includes('docentes') && !q.audiences.includes('todos')).length} perguntas</span>
                        </div>
                        <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                          <span className="text-amber-700 font-medium block text-[10px]">TAEs</span>
                          <span className="font-bold text-amber-950">{formQuestions.filter((q) => q.audiences.includes('taes') && !q.audiences.includes('todos')).length} perguntas</span>
                        </div>
                      </div>
                    </div>

                    {/* BLOCO 4: Identificação e Sigilo */}
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#006837]" />
                          Anonimato e Sigilo SINAES
                        </span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-[#006837] border border-emerald-200 rounded-full font-bold text-[11px]">
                          Anonimato Ativo
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Garantia de que as respostas individuais não serão associadas aos dados cadastrais dos participantes, em conformidade com as diretrizes do SINAES/MEC.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 6 — ENVIO DA CAMPANHA */}
              {wizardStep === 6 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Send className="w-5 h-5 text-[#006837]" />
                      <span>ENVIO DA CAMPANHA</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure os destinatários, os canais de distribuição e o período de vigência da campanha.
                    </p>
                  </div>

                  {/* BLOCO 1: PÚBLICO */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#006837]" />
                        1. PÚBLICO
                      </span>
                      <span className="text-xs font-extrabold text-[#006837] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        2.450 participantes selecionados
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {formAudiences.includes('alunos') && (
                        <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Discentes
                        </span>
                      )}
                      {formAudiences.includes('docentes') && (
                        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-[#006837] text-xs font-bold rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#006837]" /> Docentes
                        </span>
                      )}
                      {formAudiences.includes('taes') && (
                        <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> TAEs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BLOCO 2: CANAIS DE ENVIO */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5">
                    <div className="border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-[#006837]" />
                        2. CANAIS DE ENVIO
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* E-mail Checkbox */}
                      <label
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                          sendMethods.email
                            ? 'border-[#006837] bg-emerald-50/60 text-emerald-950 font-bold'
                            : 'border-slate-200 bg-slate-50/60 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sendMethods.email}
                          onChange={(e) => setSendMethods({ ...sendMethods, email: e.target.checked })}
                          className="accent-[#006837] w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#006837]" /> E-mail institucional
                        </span>
                      </label>

                      {/* QR Code Checkbox */}
                      <label
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                          sendMethods.qrcode
                            ? 'border-[#006837] bg-emerald-50/60 text-emerald-950 font-bold'
                            : 'border-slate-200 bg-slate-50/60 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sendMethods.qrcode}
                          onChange={(e) => setSendMethods({ ...sendMethods, qrcode: e.target.checked })}
                          className="accent-[#006837] w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-[#006837]" /> QR Code
                        </span>
                      </label>

                      {/* Link Checkbox */}
                      <label
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                          sendMethods.link
                            ? 'border-[#006837] bg-emerald-50/60 text-emerald-950 font-bold'
                            : 'border-slate-200 bg-slate-50/60 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sendMethods.link}
                          onChange={(e) => setSendMethods({ ...sendMethods, link: e.target.checked })}
                          className="accent-[#006837] w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-[#006837]" /> Link direto
                        </span>
                      </label>
                    </div>

                    {/* REVELA APENAS O QUE ESTIVER SELECIONADO COM FORMATO COMPACTO */}

                    {/* 1. SE E-MAIL ESTIVER SELECIONADO: CARD COMPACTO */}
                    {sendMethods.email && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#006837] flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {emailSubject}
                              </span>
                              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 text-[#006837] rounded">
                                SUAP
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">
                              Disparo institucional para Discentes, Docentes e TAEs • 2.450 destinatários
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setShowEmailPreviewModal(true)}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#006837]" />
                            <span>Visualizar mensagem</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowEmailEditModal(true)}
                            className="px-2.5 py-1.5 bg-[#006837] text-white hover:bg-[#045C2D] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar mensagem</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 2. SE QR CODE ESTIVER SELECIONADO */}
                    {sendMethods.qrcode && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#006837] flex items-center justify-center shrink-0">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">QR Code para Divulgação</span>
                            <p className="text-[11px] text-slate-500">Pronto para impressão em cartazes e murais do campus.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowQrCodePreviewModal(true)}
                          className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#006837]" />
                          <span>Visualizar QR Code</span>
                        </button>
                      </div>
                    )}

                    {/* 3. SE LINK ESTIVER SELECIONADO */}
                    {sendMethods.link && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5 animate-in fade-in duration-150">
                        <span className="text-xs font-bold text-slate-900 block">Link direto de acesso</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`https://cpa.ifce.edu.br/avaliar/${editingForm?.id || '2026-2'}`}
                            className="flex-1 h-8 px-3 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-700"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`https://cpa.ifce.edu.br/avaliar/${editingForm?.id || '2026-2'}`);
                              setWizardCopiedLink(true);
                              setTimeout(() => setWizardCopiedLink(false), 3000);
                            }}
                            className="px-3 py-1.5 bg-[#006837] text-white text-xs font-bold rounded-lg hover:bg-[#045C2D] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                          >
                            {wizardCopiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{wizardCopiedLink ? 'Copiado!' : 'Copiar link'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BLOCO 3: PERÍODO E AGENDAMENTO DE ENVIO */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#006837]" />
                        3. PERÍODO E AGENDAMENTO DE ENVIO
                      </span>
                      {/* Presets rápidos */}
                      <div className="flex items-center gap-1">
                        {[7, 15, 30].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => {
                              const base = wizardCampaignStartDate ? new Date(wizardCampaignStartDate + 'T00:00:00') : new Date();
                              base.setDate(base.getDate() + days);
                              const y = base.getFullYear();
                              const m = String(base.getMonth() + 1).padStart(2, '0');
                              const d = String(base.getDate()).padStart(2, '0');
                              setWizardCampaignEndDate(`${y}-${m}-${d}`);
                            }}
                            className="px-2 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
                          >
                            +{days} dias
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Início</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="date"
                            value={wizardCampaignStartDate}
                            onChange={(e) => setWizardCampaignStartDate(e.target.value)}
                            className="w-full h-8 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                          />
                          <input
                            type="time"
                            value={formStartTime}
                            onChange={(e) => setFormStartTime(e.target.value)}
                            className="w-full h-8 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Encerramento</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="date"
                            value={wizardCampaignEndDate}
                            onChange={(e) => setWizardCampaignEndDate(e.target.value)}
                            className="w-full h-8 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                          />
                          <input
                            type="time"
                            value={formEndTime}
                            onChange={(e) => setFormEndTime(e.target.value)}
                            className="w-full h-8 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Tempo estimado de resposta</label>
                        <input
                          type="text"
                          value={wizardCampaignEstimatedTime}
                          onChange={(e) => setWizardCampaignEstimatedTime(e.target.value)}
                          placeholder="Ex: 3–5 minutos"
                          className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RODAPÉ DO WIZARD (TODAS AS ETAPAS POSSUEM) */}
            <div className="bg-slate-50 border-t border-slate-200/80 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
              {/* Esquerda: Cancelar */}
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              {/* Direita: Voltar, Salvar progresso, Seguinte / Finalizar */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Botão Voltar (Desabilitado na Etapa 1) */}
                <button
                  type="button"
                  disabled={wizardStep === 1}
                  onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    wizardStep === 1
                      ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200 bg-slate-100'
                      : 'text-slate-700 border-slate-300 bg-white hover:bg-slate-100'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>

                {/* Botão Salvar Progresso (Permanece como Rascunho) */}
                <button
                  type="button"
                  onClick={handleSaveProgressDraft}
                  className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200/80 border border-emerald-300/80 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Salvar como Rascunho para continuar depois"
                >
                  <Save className="w-3.5 h-3.5 text-[#006837]" />
                  <span>Salvar progresso</span>
                </button>

                {/* Botão Dinâmico de Avanço por Etapa */}
                {wizardStep === 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Seguinte</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {wizardStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Escolher segmento</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {wizardStep === 3 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className="px-5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Seguinte</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Na Etapa 4, o botão ao lado de 'Adicionar Nova Pergunta' substitui o botão seguinte */}
                {wizardStep === 4 && null}

                {wizardStep === 5 && (
                  <button
                    type="button"
                    onClick={handleAdvanceToCampaignSend}
                    className="px-5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Avançar para Envio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {wizardStep === 6 && (
                  <button
                    type="button"
                    onClick={() => setShowSendConfirmModal(true)}
                    className="px-5 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Campanha</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
          </div>
        </div>
      )}

    </>
  );
};
