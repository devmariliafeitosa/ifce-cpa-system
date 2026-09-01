import { AlertCircle, Briefcase, CheckCircle2, Eye, GraduationCap, Loader2, Send, UserCheck, X } from 'lucide-react';
import React from 'react';
import type { SmartForm, SmartQuestion, StudentLevel } from '../../../../types';

interface ParticipantResponseModalProps {
  respondingForm: SmartForm | null;
  setRespondingForm: (form: SmartForm | null) => void;
  participantSegment: 'alunos' | 'docentes' | 'taes' | null;
  setParticipantSegment: (segment: 'alunos' | 'docentes' | 'taes' | null) => void;
  participantStudentLevel: StudentLevel;
  setParticipantStudentLevel: (level: StudentLevel) => void;
  participantAnswers: Record<string, string | string[]>;
  isSubmittingResponse: boolean;
  responseSubmitted: boolean;
  unansweredQuestionIds: string[];
  setUnansweredQuestionIds: (ids: string[]) => void;
  showValidationErrorBanner: boolean;
  setShowValidationErrorBanner: (value: boolean) => void;
  getFilteredQuestionsForParticipant: () => SmartQuestion[];
  handleParticipantAnswerChange: (qId: string, val: string | string[]) => void;
  handleSubmitParticipantResponse: (e: React.FormEvent) => void;
}

export const ParticipantResponseModal: React.FC<ParticipantResponseModalProps> = ({
  respondingForm,
  setRespondingForm,
  participantSegment,
  setParticipantSegment,
  participantStudentLevel,
  setParticipantStudentLevel,
  participantAnswers,
  isSubmittingResponse,
  responseSubmitted,
  unansweredQuestionIds,
  setUnansweredQuestionIds,
  showValidationErrorBanner,
  setShowValidationErrorBanner,
  getFilteredQuestionsForParticipant,
  handleParticipantAnswerChange,
  handleSubmitParticipantResponse,
}) => {
  return (
    <>
      {/* MODAL 2: Participant Responder Experience ("Visão do Participante") */}
      {respondingForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Fixo */}
            <div className="px-4 sm:px-6 py-3 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006837] flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    Preenchimento Inteligente do Formulário
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Simulação do participante no IFCE Campus Tauá
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRespondingForm(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Form Presentation & Segment Selection */}
            {!participantSegment ? (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* Form Presentation Card */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#006837]/10 text-[#006837] text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                      Modo de Teste / Avaliação CPA
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      IFCE Campus Tauá
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {respondingForm.title}
                  </h3>

                  {respondingForm.description && (
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {respondingForm.description}
                    </p>
                  )}

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed italic border-l-3 border-l-[#006837]">
                    "Esta avaliação tem como objetivo coletar a percepção da comunidade acadêmica sobre os aspectos avaliados."
                  </div>
                </div>

                <div className="text-center space-y-1 pt-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    Selecione o seu segmento no IFCE para iniciar a avaliação
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    O formulário apresentará instantaneamente apenas as perguntas vinculadas ao seu público.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Aluno Button */}
                  <button
                    type="button"
                    onClick={() => setParticipantSegment('alunos')}
                    className="p-3.5 sm:p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-indigo-900">Sou Aluno(a)</p>
                      <p className="text-[10px] text-indigo-600 font-medium">Discente</p>
                    </div>
                  </button>

                  {/* Docente Button */}
                  <button
                    type="button"
                    onClick={() => setParticipantSegment('docentes')}
                    className="p-3.5 sm:p-4 rounded-xl border-2 border-emerald-100 hover:border-[#006837] bg-emerald-50/40 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006837] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-emerald-950">Sou Docente</p>
                      <p className="text-[10px] text-[#006837] font-medium">Professor(a)</p>
                    </div>
                  </button>

                  {/* TAE Button */}
                  <button
                    type="button"
                    onClick={() => setParticipantSegment('taes')}
                    className="p-3.5 sm:p-4 rounded-xl border-2 border-amber-100 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-amber-950">Sou TAE</p>
                      <p className="text-[10px] text-amber-700 font-medium">Técnico Admin.</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : responseSubmitted ? (
              /* Success Confirmation */
              <div className="p-6 text-center space-y-4 my-auto animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#006837] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-800">Obrigado pela sua participação!</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Sua resposta para o formulário "{respondingForm.title}" foi registrada com sucesso pela CPA do IFCE Campus Tauá.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRespondingForm(null)}
                  className="px-5 py-2 bg-[#006837] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer hover:bg-#045C2D transition-colors"
                >
                  Fechar Janela
                </button>
              </div>
            ) : (
              /* Step 2: Answer Filtered Questions */
              <form onSubmit={handleSubmitParticipantResponse} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Header / Info Bar Compacta e Unificada */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider">SEGMENTO:</span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-[#006837] font-black text-[11px] uppercase shadow-2xs">
                          {participantSegment === 'alunos'
                            ? 'Aluno (Discente)'
                            : participantSegment === 'docentes'
                            ? 'Docente (Professor)'
                            : 'TAE (Técnico Admin.)'}
                        </span>
                      </div>

                      {participantSegment === 'alunos' && (
                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300">
                          <span className="font-extrabold text-slate-500 text-[10px] uppercase tracking-wider">NÍVEL:</span>
                          <select
                            value={participantStudentLevel}
                            onChange={(e) => {
                              setParticipantStudentLevel(e.target.value as StudentLevel);
                              setUnansweredQuestionIds([]);
                              setShowValidationErrorBanner(false);
                            }}
                            className="h-6 px-1.5 bg-white border border-indigo-300 rounded-md text-[11px] font-extrabold text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                          >
                            <option value="tecnico">Ensino Técnico</option>
                            <option value="graduacao">Graduação (ENADE)</option>
                            <option value="mestrado">Mestrado</option>
                            <option value="pos_graduacao">Pós-graduação</option>
                          </select>
                        </div>
                      )}

                      <span className="text-[11px] text-slate-500 pl-2 border-l border-slate-300 font-medium">
                        💡 <strong>{getFilteredQuestionsForParticipant().length}</strong> perguntas aplicáveis
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setParticipantSegment(null);
                        setUnansweredQuestionIds([]);
                        setShowValidationErrorBanner(false);
                      }}
                      className="text-[11px] text-[#006837] hover:underline font-bold cursor-pointer"
                    >
                      Alterar segmento
                    </button>
                  </div>
                </div>

                {/* Validation Banner (if active) */}
                {showValidationErrorBanner && (
                  <div
                    id="validation-error-banner"
                    className="mx-4 mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 shrink-0 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Existem perguntas obrigatórias pendentes. Por favor, preencha todos os campos destacados.</span>
                    </div>
                  </div>
                )}

                {/* Central Scrollable Area for Questions */}
                <div className="p-4 overflow-y-auto flex-1 space-y-3">
                  {getFilteredQuestionsForParticipant().map((q, idx) => {
                    const isMissingRequired = unansweredQuestionIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        id={`participant-question-${q.id}`}
                        className={`p-3 sm:p-3.5 rounded-xl space-y-2 transition-all ${
                          isMissingRequired
                            ? 'bg-rose-50/40 border-2 border-rose-400 shadow-2xs ring-2 ring-rose-200'
                            : 'bg-slate-50/70 border border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-[#006837] text-xs mt-0.5 shrink-0">#{idx + 1}</span>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 leading-snug">
                              {q.title} {q.required && <span className="text-rose-500 font-extrabold">*</span>}
                            </p>
                            {q.description && (
                              <p className="text-[11px] text-slate-500 font-normal leading-tight">
                                {q.description}
                              </p>
                            )}
                            {q.category && (
                              <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700 mt-0.5">
                                {q.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Scale Question (1 to 5) */}
                        {q.type === 'SCALE' && (
                          <div className="space-y-1 pt-0.5">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-0.5">
                              <span>1 - Discordo Totalmente</span>
                              <span>5 - Concordo Totalmente</span>
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                  type="button"
                                  key={num}
                                  onClick={() => handleParticipantAnswerChange(q.id, String(num))}
                                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    participantAnswers[q.id] === String(num)
                                      ? 'bg-[#006837] text-white shadow-xs'
                                      : isMissingRequired
                                      ? 'bg-white border-2 border-rose-200 text-slate-700 hover:bg-rose-50'
                                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Yes/No Question */}
                        {q.type === 'YES_NO' && (
                          <div className="flex items-center gap-2 pt-0.5">
                            {['Sim', 'Não'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleParticipantAnswerChange(q.id, opt)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                  participantAnswers[q.id] === opt
                                    ? 'bg-[#006837] text-white border-[#006837] shadow-xs'
                                    : isMissingRequired
                                    ? 'bg-white text-slate-700 border-2 border-rose-200 hover:bg-rose-50'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Radio Question (Multiple Choice Single) */}
                        {q.type === 'RADIO' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                            {(q.options && q.options.length > 0
                              ? q.options
                              : ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento']
                            ).map((opt, oIdx) => (
                              <label
                                key={oIdx}
                                className={`flex items-center gap-2 px-2.5 py-1.5 bg-white rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                                  participantAnswers[q.id] === opt
                                    ? 'border-[#006837] bg-emerald-50/50 text-emerald-950 font-bold ring-1 ring-[#006837]'
                                    : isMissingRequired
                                    ? 'border-rose-200 hover:border-rose-400'
                                    : 'border-slate-200 hover:border-[#006837]'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt}
                                  checked={participantAnswers[q.id] === opt}
                                  onChange={() => handleParticipantAnswerChange(q.id, opt)}
                                  className="accent-[#006837]"
                                />
                                <span className="truncate">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Checkbox Question (Multiple Choice Multi) */}
                        {q.type === 'CHECKBOX' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                            {(q.options && q.options.length > 0
                              ? q.options
                              : ['Opção 1', 'Opção 2', 'Opção 3']
                            ).map((opt, oIdx) => {
                              const currentList = Array.isArray(participantAnswers[q.id])
                                ? (participantAnswers[q.id] as string[])
                                : [];
                              const isChecked = currentList.includes(opt);
                              return (
                                <label
                                  key={oIdx}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 bg-white rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                                    isChecked
                                      ? 'border-[#006837] bg-emerald-50/50 text-emerald-950 font-bold ring-1 ring-[#006837]'
                                      : isMissingRequired
                                      ? 'border-rose-200 hover:border-rose-400'
                                      : 'border-slate-200 hover:border-[#006837]'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    value={opt}
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        handleParticipantAnswerChange(q.id, [...currentList, opt]);
                                      } else {
                                        handleParticipantAnswerChange(q.id, currentList.filter((item) => item !== opt));
                                      }
                                    }}
                                    className="accent-[#006837]"
                                  />
                                  <span className="truncate">{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* Dropdown Question */}
                        {q.type === 'DROPDOWN' && (
                          <select
                            value={(participantAnswers[q.id] as string) || ''}
                            onChange={(e) => handleParticipantAnswerChange(q.id, e.target.value)}
                            className={`w-full h-8 px-2.5 bg-white border rounded-lg text-xs font-medium focus:outline-none ${
                              isMissingRequired
                                ? 'border-2 border-rose-300 focus:ring-2 focus:ring-rose-400'
                                : 'border-slate-200 focus:ring-1 focus:ring-[#006837]'
                            }`}
                          >
                            <option value="">-- Selecione uma opção --</option>
                            {(q.options && q.options.length > 0
                              ? q.options
                              : ['Opção 1', 'Opção 2', 'Opção 3']
                            ).map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Discrete error message below unanswered required question */}
                        {isMissingRequired && (
                          <div className="flex items-center gap-1 text-[11px] font-extrabold text-rose-600 pt-0.5 animate-in fade-in duration-150">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                            <span>Este campo é obrigatório.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Fixed Footer */}
                <div className="p-3 sm:px-4 sm:py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
                  {showValidationErrorBanner ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="hidden sm:inline">Existem perguntas obrigatórias pendentes.</span>
                      <span className="sm:hidden">Perguntas pendentes.</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                      Preencha com atenção todas as questões antes de enviar.
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => setRespondingForm(null)}
                      className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl cursor-pointer transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingResponse}
                      className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                    >
                      {isSubmittingResponse ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar respostas</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </>
  );
};
