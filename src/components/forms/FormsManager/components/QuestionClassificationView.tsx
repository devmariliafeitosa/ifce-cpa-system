import { ArrowLeft, Check, Eye, Filter, HelpCircle, Sparkles, Tag, Users } from 'lucide-react';
import React from 'react';
import type { QuestionCategory, SmartForm, SmartQuestion, TargetAudience } from '../../../../types';
import { QUESTION_CATEGORIES } from '../../FormsManager/data/questionCategories';

interface QuestionClassificationViewProps {
  classifyingForm: SmartForm | null;
  setClassifyingForm: (form: SmartForm | null) => void;
  classSearchTerm: string;
  setClassSearchTerm: (value: string) => void;
  classCategoryFilter: string;
  setClassCategoryFilter: (value: string) => void;
  classAudienceFilter: string;
  setClassAudienceFilter: (value: string) => void;
  classRequiredFilter: string;
  setClassRequiredFilter: (value: string) => void;
  classTypeFilter: string;
  setClassTypeFilter: (value: string) => void;
  previewRole: 'none' | 'alunos' | 'docentes' | 'taes';
  setPreviewRole: (role: 'none' | 'alunos' | 'docentes' | 'taes') => void;
  getFilteredQuestionsForClassification: () => SmartQuestion[];
  handleToggleAudienceInClassifying: (questionId: string, target: TargetAudience) => void;
  handleUpdateCategoryInClassifying: (questionId: string, category: QuestionCategory) => void;
  handleSaveClassification: () => void;
}

export const QuestionClassificationView: React.FC<QuestionClassificationViewProps> = ({
  classifyingForm,
  setClassifyingForm,
  classSearchTerm,
  setClassSearchTerm,
  classCategoryFilter,
  setClassCategoryFilter,
  classAudienceFilter,
  setClassAudienceFilter,
  classRequiredFilter,
  setClassRequiredFilter,
  classTypeFilter,
  setClassTypeFilter,
  previewRole,
  setPreviewRole,
  getFilteredQuestionsForClassification,
  handleToggleAudienceInClassifying,
  handleUpdateCategoryInClassifying,
  handleSaveClassification,
}) => {
  if (!classifyingForm) {
    return null;
  }

  const filteredClassQuestions = getFilteredQuestionsForClassification();

  // If profile preview role is active (e.g. Aluno), filter questions as seen by that role
  const previewQuestions =
    previewRole === 'none'
      ? filteredClassQuestions
      : classifyingForm.questions.filter(
          (q) => q.audiences.includes('todos') || q.audiences.includes(previewRole)
        );

  return (
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-200">
        {/* Header Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type='button'
                  onClick={() => {
                    setClassifyingForm(null);
                    setPreviewRole('none');
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer mr-1"
                  title="Voltar para Lista de Formulários"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">Classificação das Perguntas</h1>
                <span className="bg-emerald-50 text-[#006837] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Google Forms Importado
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-8">
                Formulário: <span className="font-bold text-slate-800">{classifyingForm.title}</span>
              </p>
            </div>

            {/* Controls: "Visualizar como" & "Salvar Classificação" */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Button "Visualizar como" */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-700">
                <span className="px-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  Visualizar como:
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewRole('none')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewRole === 'none'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  ⚙️ Edição
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewRole('alunos')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewRole === 'alunos'
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  🎓 Aluno
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewRole('docentes')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewRole === 'docentes'
                      ? 'bg-[#006837] text-white font-bold shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  👨‍🏫 Docente
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewRole('taes')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewRole === 'taes'
                      ? 'bg-amber-600 text-white font-bold shadow-2xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  💼 TAE
                </button>
              </div>

              {/* Save Classification Button */}
              <button
                type="button"
                onClick={handleSaveClassification}
                className="px-4 py-2 bg-[#006837] hover:bg-#045C2] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Salvar & Concluir Classificação</span>
              </button>
            </div>
          </div>

          {/* Educational Instruction Banner */}
          {previewRole === 'none' ? (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Como os formulários antigos do Google Forms possuem todas as perguntas misturadas, utilize os controles em cada card para classificar rapidamente a <strong className="font-bold">Categoria CPA</strong> e o <strong className="font-bold">Público-Alvo (Segmento)</strong>. A edição é salva instantaneamente no card sem precisar abrir outras telas.
              </p>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Modo de Visualização do Perfil:{' '}
                  <strong className="font-bold uppercase text-indigo-700">
                    {previewRole === 'alunos'
                      ? 'Aluno (Discente)'
                      : previewRole === 'docentes'
                      ? 'Docente (Professor)'
                      : 'Técnico Administrativo (TAE)'}
                  </strong>{' '}
                  — O sistema oculta automaticamente todas as perguntas destinadas exclusivamente a outros públicos. Exibindo{' '}
                  <strong className="font-bold">{previewQuestions.length} de {classifyingForm.questions.length}</strong> perguntas visíveis.
                </span>
              </div>
              <button
              type="button"
                onClick={() => setPreviewRole('none')}
                className="px-3 py-1 bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                Voltar para Edição
              </button>
            </div>
          )}
        </div>

        {/* Filter and Search Bar for Questions (Only in classification mode) */}
        {previewRole === 'none' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              {/* Search text */}
              <div className="relative w-full lg:w-72">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por texto no enunciado..."
                  value={classSearchTerm}
                  onChange={(e) => setClassSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837]"
                />
              </div>

              {/* Select Filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto text-xs">
                {/* Category filter */}
                <select
                  value={classCategoryFilter}
                  onChange={(e) => setClassCategoryFilter(e.target.value)}
                  className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="todas">Todas as Categorias ({classifyingForm.questions.length})</option>
                  {QUESTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      Categoria: {cat}
                    </option>
                  ))}
                </select>

                {/* Audience / Segment filter */}
                <select
                  value={classAudienceFilter}
                  onChange={(e) => setClassAudienceFilter(e.target.value)}
                  className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="todos">Todos os Segmentos</option>
                  <option value="todos_only">Somente '☑ Todos'</option>
                  <option value="alunos">Público: Alunos</option>
                  <option value="docentes">Público: Docentes</option>
                  <option value="taes">Público: TAEs</option>
                </select>

                {/* Required filter */}
                <select
                  value={classRequiredFilter}
                  onChange={(e) => setClassRequiredFilter(e.target.value)}
                  className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="todas">Todas as Obrigatoriedades</option>
                  <option value="required">Somente Obrigatórias (*)</option>
                  <option value="optional">Somente Opcionais</option>
                </select>

                {/* Type filter */}
                <select
                  value={classTypeFilter}
                  onChange={(e) => setClassTypeFilter(e.target.value)}
                  className="h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="SCALE">Escala Likert (1 a 5)</option>
                  <option value="RADIO">Múltipla Escolha (Única)</option>
                  <option value="CHECKBOX">Caixas de Seleção</option>
                  <option value="DROPDOWN">Lista Suspensa</option>
                  <option value="SHORT_TEXT">Texto Curto</option>
                  <option value="LONG_TEXT">Texto Longo</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              <span>
                Exibindo <strong className="text-slate-800">{previewQuestions.length}</strong> de <strong className="text-slate-800">{classifyingForm.questions.length}</strong> perguntas
              </span>
              <button
                onClick={() => {
                  setClassSearchTerm('');
                  setClassCategoryFilter('todas');
                  setClassAudienceFilter('todos');
                  setClassRequiredFilter('todas');
                  setClassTypeFilter('todos');
                }}
                className="text-[#006837] font-bold hover:underline cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Cards List */}
        <div className="space-y-4">
          {previewQuestions.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Nenhuma pergunta encontrada com os filtros selecionados.</p>
              <button
                onClick={() => {
                  setClassSearchTerm('');
                  setClassCategoryFilter('todas');
                  setClassAudienceFilter('todos');
                  setClassRequiredFilter('todas');
                  setClassTypeFilter('todos');
                }}
                className="text-xs font-bold text-[#006837] underline cursor-pointer"
              >
                Resetar todos os filtros
              </button>
            </div>
          ) : (
            previewQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-emerald-300 transition-all"
              >
                {/* Header of question card */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#006837] text-xs">#{idx + 1}</span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {q.title || 'Pergunta sem título'}
                        {q.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                      </h4>
                    </div>
                    {q.description && (
                      <p className="text-xs text-slate-500 font-normal">{q.description}</p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                      {q.type === 'SCALE'
                        ? 'Escala (1 a 5)'
                        : q.type === 'RADIO'
                        ? 'Múltipla Escolha'
                        : q.type === 'CHECKBOX'
                        ? 'Caixa de Seleção'
                        : q.type === 'DROPDOWN'
                        ? 'Lista Suspensa'
                        : 'Sim / Não'}
                    </span>
                    {q.required ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                        Obrigatória
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                        Opcional
                      </span>
                    )}
                  </div>
                </div>

                {/* If in Classification Mode: Show Fast Inline Selectors for Category & Público */}
                {previewRole === 'none' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    {/* Categoria Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#006837]" />
                        <span>Categoria CPA:</span>
                      </label>
                      <select
                        value={q.category || 'Outros'}
                        onChange={(e) =>
                          handleUpdateCategoryInClassifying(q.id, e.target.value as QuestionCategory)
                        }
                        className="w-full h-9 px-3 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#006837] shadow-2xs cursor-pointer"
                      >
                        {QUESTION_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Público Target Checkboxes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Público-Alvo (Segmento):</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 text-xs font-medium">
                        {/* Todos */}
                        <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#006837]">
                          <input
                            type="checkbox"
                            checked={q.audiences.includes('todos')}
                            onChange={() => handleToggleAudienceInClassifying(q.id, 'todos')}
                            className="accent-[#006837] rounded"
                          />
                          <span>Todos</span>
                        </label>

                        {/* Alunos */}
                        <label className="flex items-center gap-1.5 cursor-pointer text-indigo-900 font-semibold">
                          <input
                            type="checkbox"
                            checked={
                              q.audiences.includes('todos') || q.audiences.includes('alunos')
                            }
                            disabled={q.audiences.includes('todos')}
                            onChange={() => handleToggleAudienceInClassifying(q.id, 'alunos')}
                            className="accent-indigo-600 rounded"
                          />
                          <span>Alunos</span>
                        </label>

                        {/* Docentes */}
                        <label className="flex items-center gap-1.5 cursor-pointer text-emerald-900 font-semibold">
                          <input
                            type="checkbox"
                            checked={
                              q.audiences.includes('todos') || q.audiences.includes('docentes')
                            }
                            disabled={q.audiences.includes('todos')}
                            onChange={() => handleToggleAudienceInClassifying(q.id, 'docentes')}
                            className="accent-emerald-600 rounded"
                          />
                          <span>Docentes</span>
                        </label>

                        {/* TAEs */}
                        <label className="flex items-center gap-1.5 cursor-pointer text-amber-900 font-semibold">
                          <input
                            type="checkbox"
                            checked={
                              q.audiences.includes('todos') || q.audiences.includes('taes')
                            }
                            disabled={q.audiences.includes('todos')}
                            onChange={() => handleToggleAudienceInClassifying(q.id, 'taes')}
                            className="accent-amber-600 rounded"
                          />
                          <span>TAEs</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Profile Preview Question Interactive Component */
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#006837] bg-emerald-50 px-2 py-0.5 rounded-md">
                        {q.category || 'Outros'}
                      </span>
                    </div>

                    {/* Scale Question */}
                    {q.type === 'SCALE' && (
                      <div className="grid grid-cols-5 gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <div
                            key={val}
                            className="p-2.5 rounded-xl border border-slate-200 text-center bg-slate-50 text-xs font-bold text-slate-700"
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Options if Radio or Checkbox */}
                    {(q.type === 'RADIO' || q.type === 'CHECKBOX') && (
                      <div className="space-y-2 pt-1">
                        {(q.options || ['Opção 1', 'Opção 2']).map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium flex items-center gap-2"
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white inline-block shrink-0" />
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dropdown */}
                    {q.type === 'DROPDOWN' && (
                      <select
                        disabled
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        {(q.options || ['Opção 1', 'Opção 2']).map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {/* Sim / Não */}
                    {q.type === 'YES_NO' && (
                      <div className="grid grid-cols-2 gap-2">
                        {(q.options || ['Sim', 'Não']).map((option) => (
                          <div
                            key={option}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
};
