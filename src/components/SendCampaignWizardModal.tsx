import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Building2, Calendar, Check, CheckCircle2, Eye, Mail, RefreshCw, Save, Send, Users, X } from 'lucide-react';
import { SmartForm, Campaign } from '../../../types';
import { getCampaignStatus } from '../utils/campaignStatus';

/* Wizard modal de envio de campanha em 5 etapas. Extraído de FormsManagerView.tsx. */

/* Componente de Wizard Modal do Envio de Campanha (5 Etapas) */
interface SendCampaignWizardModalProps {
  form: SmartForm;
  onClose: () => void;
  onLaunchCampaign: (campaign: Campaign, options?: { sendEmail: boolean; openQrCode: boolean }) => void;
  onSaveProgressDraft?: (campaign: Campaign) => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const SendCampaignWizardModal: React.FC<SendCampaignWizardModalProps> = ({
  form,
  onClose,
  onLaunchCampaign,
  onSaveProgressDraft,
  showNotification,
}) => {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState(
    `Campanha de Avaliação Institucional 2026.2 - ${form.title}`
  );
  const [campus, setCampus] = useState(form.campus || 'Campus Tauá');
  const [startDate, setStartDate] = useState(() => form.startDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(() => form.startTime || '08:00');
  const [endDate, setEndDate] = useState(() => {
    if (form.endDate) return form.endDate;
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [endTime, setEndTime] = useState(() => form.endTime || '23:59');
  const [durationPreset, setDurationPreset] = useState<number | 'custom'>(15);

  const handleSelectCampaignPreset = (days: number) => {
    setDurationPreset(days);
    const base = startDate ? new Date(startDate + 'T00:00:00') : new Date();
    base.setDate(base.getDate() + days);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    setEndDate(`${y}-${m}-${d}`);
  };

  const [segments, setSegments] = useState<{
    discentes: boolean;
    docentes: boolean;
    taes: boolean;
  }>({
    discentes: true,
    docentes: true,
    taes: true,
  });

  const DEFAULT_MESSAGE = `Prezado(a) {{Nome}},\n\nA Comissão Própria de Avaliação (CPA) do IFCE convida você a responder à "{{Título}}" do {{Campus}}.\n\nSua opinião é fundamental para orientar as melhorias no ensino, na infraestrutura e na gestão da nossa instituição.\n\nPrazo de preenchimento: até {{Prazo}}.\n\nAtenciosamente,\nCoordenação da CPA - IFCE.`;

  const [customMessage, setCustomMessage] = useState(DEFAULT_MESSAGE);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dispatchEmailOption, setDispatchEmailOption] = useState(true);
  const [generateQrCodeOption, setGenerateQrCodeOption] = useState(true);

  // Participant estimated count calculation
  const countDiscentes = segments.discentes ? 1250 : 0;
  const countDocentes = segments.docentes ? 84 : 0;
  const countTAEs = segments.taes ? 56 : 0;
  const totalRecipients = countDiscentes + countDocentes + countTAEs;

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handleInsertVariable = (variableTag: string) => {
    setCustomMessage((prev) => prev + ` ${variableTag}`);
  };

  const handleRestoreDefaultMessage = () => {
    setCustomMessage(DEFAULT_MESSAGE);
    showNotification('info', 'Modelo de e-mail padrão restaurado.');
  };

  const handleSaveProgress = () => {
    const draftCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      formId: form.id,
      formTitle: form.title,
      title: title.trim() || `Rascunho de Campanha - ${form.title}`,
      campus,
      segment:
        segments.discentes && segments.docentes && segments.taes
          ? 'todos'
          : segments.discentes
          ? 'alunos'
          : segments.docentes
          ? 'docentes'
          : 'taes',
      startDate: formatDateBR(startDate),
      endDate: formatDateBR(endDate),
      customMessage,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'Rascunho',
      sentEmailsCount: totalRecipients,
      uniqueTokenUrl: `https://cpa.ifce.edu.br/avaliacao/${form.id}?token=draft-${Date.now()}`,
    };

    if (onSaveProgressDraft) {
      onSaveProgressDraft(draftCampaign);
    }
    showNotification('success', 'Progresso da campanha salvo como rascunho com sucesso!');
  };

  const handleFinalSubmit = () => {
    if (!title.trim()) {
      showNotification('error', 'Por favor, informe o título da campanha.');
      setStep(1);
      setShowConfirmModal(false);
      return;
    }

    if (!segments.discentes && !segments.docentes && !segments.taes) {
      showNotification('error', 'Selecione pelo menos um segmento de destinatários.');
      setStep(2);
      setShowConfirmModal(false);
      return;
    }

    const startObj = new Date(`${startDate}T${startTime || '08:00'}:00`);
    const endObj = new Date(`${endDate}T${endTime || '23:59'}:00`);

    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
      showNotification('error', 'Datas ou horários inválidos informados.');
      setStep(1);
      setShowConfirmModal(false);
      return;
    }

    if (endObj <= startObj) {
      showNotification('error', 'A data/horário de encerramento deve ser posterior ao início.');
      setStep(1);
      setShowConfirmModal(false);
      return;
    }

    const computedStatus = getCampaignStatus(startDate, startTime, endDate, endTime, 'Ativa');

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      formId: form.id,
      formTitle: form.title,
      title,
      campus,
      segment:
        segments.discentes && segments.docentes && segments.taes
          ? 'todos'
          : segments.discentes
          ? 'alunos'
          : segments.docentes
          ? 'docentes'
          : 'taes',
      startDate: formatDateBR(startDate),
      startTime,
      endDate: formatDateBR(endDate),
      endTime,
      customMessage,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: computedStatus,
      sentEmailsCount: totalRecipients,
      uniqueTokenUrl: `https://cpa.ifce.edu.br/avaliacao/${form.id}?token=suap-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
    };

    onLaunchCampaign(newCampaign, {
      sendEmail: dispatchEmailOption,
      openQrCode: generateQrCodeOption,
    });
    setShowConfirmModal(false);
    onClose();
  };

  const formatPreviewText = (text: string) => {
    return text
      .replaceAll('{{Nome}}', 'João Silva')
      .replaceAll('{{Campus}}', campus)
      .replaceAll('{{Título}}', form.title)
      .replaceAll('{{Prazo}}', formatDateBR(endDate))
      .replaceAll('{{Link}}', 'https://cpa.ifce.edu.br/avaliacao/token-suap-883921');
  };

  const STEPS = [
    { id: 1, label: 'Campanha', icon: Calendar },
    { id: 2, label: 'Destinatários', icon: Users },
    { id: 3, label: 'Mensagem', icon: Mail },
    { id: 4, label: 'Pré-visualização', icon: Eye },
    { id: 5, label: 'Enviar', icon: Send },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-[850px] w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 my-auto overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-white space-y-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-[#006837]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Enviar Formulário / Campanha
                </h3>
                <p className="text-xs text-slate-500">
                  Assistente de configuração de convocação de participantes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006837] text-xs font-bold truncate max-w-[260px]">
                Formulário: {form.title}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="pt-1">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {STEPS.map((s) => {
                const IconComp = s.icon;
                const isCurrent = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`py-2 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#006837] text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50 text-[#006837] border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <IconComp className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="hidden md:inline truncate">{s.label}</span>
                    <span className="md:hidden">{s.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#006837] transition-all duration-300 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Body (Scrollable if needed) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Campanha */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-[#006837]" />
                <span>Etapa 1 — Informações da Campanha</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">
                    Título da Campanha <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex: Campanha de Avaliação Institucional 2026.2 - Campus Tauá"
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837] font-medium"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Campus</label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Campus Tauá">Campus Tauá</option>
                    <option value="Campus Crateús">Campus Crateús</option>
                    <option value="Campus Canindé">Campus Canindé</option>
                    <option value="Campus Cedro">Campus Cedro</option>
                    <option value="Campus Fortaleza">Campus Fortaleza</option>
                    <option value="Campus Iguatu">Campus Iguatu</option>
                    <option value="Campus Juazeiro do Norte">Campus Juazeiro do Norte</option>
                    <option value="Campus Limoeiro do Norte">Campus Limoeiro do Norte</option>
                    <option value="Campus Sobral">Campus Sobral</option>
                    <option value="Todos os Campi do IFCE">Todos os Campi do IFCE</option>
                  </select>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-bold text-slate-800">Data e Horário de Início</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setDurationPreset('custom');
                      }}
                      className="w-full h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837] font-medium"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-bold text-slate-800">Data e Horário de Encerramento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setDurationPreset('custom');
                      }}
                      className="w-full h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837] font-medium"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full h-9 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006837] font-medium"
                    />
                  </div>
                </div>

                {/* Configuração rápida */}
                <div className="space-y-1.5 sm:col-span-2 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Configuração rápida de duração
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[7, 15, 30, 45].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleSelectCampaignPreset(d)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          durationPreset === d
                            ? 'bg-[#006837] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {d} dias
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setDurationPreset('custom')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        durationPreset === 'custom'
                          ? 'bg-[#006837] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Personalizado
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Destinatários */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#006837]" />
                <span>Etapa 2 — Destinatários</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">
                    Campus Selecionado
                  </span>
                  <span className="font-bold text-slate-900">{campus}</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-[#006837] rounded-full font-bold text-[11px]">
                  Filtro Institucional SUAP
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Segmentos Convocados</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      segments.discentes
                        ? 'bg-emerald-50/80 border-[#006837] text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={segments.discentes}
                      onChange={(e) =>
                        setSegments({ ...segments, discentes: e.target.checked })
                      }
                      className="accent-[#006837] w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">Discentes</span>
                      <span className="text-[10px] text-slate-500">Alunos regularmente matriculados</span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      segments.docentes
                        ? 'bg-emerald-50/80 border-[#006837] text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={segments.docentes}
                      onChange={(e) =>
                        setSegments({ ...segments, docentes: e.target.checked })
                      }
                      className="accent-[#006837] w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">Docentes</span>
                      <span className="text-[10px] text-slate-500">Professores e corpo docente</span>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      segments.taes
                        ? 'bg-emerald-50/80 border-[#006837] text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={segments.taes}
                      onChange={(e) => setSegments({ ...segments, taes: e.target.checked })}
                      className="accent-[#006837] w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">Técnicos Adm.</span>
                      <span className="text-[10px] text-slate-500">Servidores técnico-administrativos</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quantidade estimada de destinatários */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  Quantidade Estimada de Destinatários
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase block">Discentes</span>
                    <strong className="text-sm font-black text-indigo-950 block pt-0.5">
                      {countDiscentes.toLocaleString('pt-BR')} participantes
                    </strong>
                  </div>

                  <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">Docentes</span>
                    <strong className="text-sm font-black text-emerald-950 block pt-0.5">
                      {countDocentes.toLocaleString('pt-BR')} participantes
                    </strong>
                  </div>

                  <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-amber-700 uppercase block">TAEs</span>
                    <strong className="text-sm font-black text-amber-950 block pt-0.5">
                      {countTAEs.toLocaleString('pt-BR')} participantes
                    </strong>
                  </div>

                  <div className="p-3 bg-[#006837] text-white rounded-xl text-center shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-200 uppercase block">Total</span>
                    <strong className="text-sm font-black text-white block pt-0.5">
                      {totalRecipients.toLocaleString('pt-BR')} destinatários
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Mensagem */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <Mail className="w-4 h-4 text-[#006837]" />
                <span>Etapa 3 — Mensagem</span>
              </div>

              {/* Dynamic Variables Pills */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Variáveis Dinâmicas (Clique para inserir no texto):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tag: '{{Nome}}', label: 'Nome do Participante' },
                    { tag: '{{Campus}}', label: 'Campus' },
                    { tag: '{{Título}}', label: 'Título do Formulário' },
                    { tag: '{{Prazo}}', label: 'Prazo Final' },
                    { tag: '{{Link}}', label: 'Link do SUAP' },
                  ].map((v) => (
                    <button
                      type="button"
                      key={v.tag}
                      onClick={() => handleInsertVariable(v.tag)}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-[#006837] shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      title={v.label}
                    >
                      <span>{v.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Conteúdo do E-mail de Convocação
                </label>
                <textarea
                  rows={6}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Digite a mensagem que os participantes receberão no e-mail institucional..."
                  className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837] font-sans leading-relaxed text-slate-800"
                />
              </div>

              {/* Restore Default Template Button */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={handleRestoreDefaultMessage}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#006837]" />
                  <span>Restaurar modelo padrão</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Pré-visualização */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#006837]" />
                  <span>Etapa 4 — Pré-visualização</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Simulação exata de recebimento no e-mail
                </span>
              </div>

              {/* Clean White Email Card (Gmail/Outlook style) */}
              <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5 text-slate-800 text-xs sm:text-sm">
                  {/* Email Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#006837] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-xs shrink-0">
                        IFCE
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">CPA IFCE</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Avaliação Institucional</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#006837] border border-emerald-200">
                      E-mail Institucional
                    </span>
                  </div>

                  {/* Email Body */}
                  <div className="space-y-3.5 leading-relaxed text-slate-700">
                    <p className="font-bold text-slate-900 text-sm">Olá, João!</p>
                    <p className="text-slate-600">
                      Você foi convidado para participar da Avaliação Institucional do IFCE.
                    </p>
                    <p className="text-slate-700 font-medium whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs leading-relaxed">
                      {formatPreviewText(customMessage)}
                    </p>
                    <p className="text-xs text-slate-600 font-semibold">
                      Sua participação é muito importante.
                    </p>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                      <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#006837] shrink-0" />
                        <div className="text-[11px]">
                          <span className="text-slate-400 block font-medium">📅 Período</span>
                          <strong className="text-emerald-950 font-bold">
                            {formatDateBR(startDate)} até {formatDateBR(endDate)}
                          </strong>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="text-[11px]">
                          <span className="text-slate-400 block font-medium">🎓 Campus</span>
                          <strong className="text-blue-950 font-bold">{campus}</strong>
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600 shrink-0" />
                        <div className="text-[11px]">
                          <span className="text-slate-400 block font-medium">👥 Segmento</span>
                          <strong className="text-purple-950 font-bold">
                            {Object.entries(segments)
                              .filter(([_, active]) => active)
                              .map(([k]) => (k === 'discentes' ? 'Discente' : k === 'docentes' ? 'Docente' : 'TAE'))
                              .join(', ') || 'Nenhum'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2 text-center sm:text-left">
                      <span className="px-6 py-3 bg-[#006837] text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2">
                        <span>Responder Avaliação</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Email Footer */}
                  <div className="border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400 font-medium">
                    Caso tenha dúvidas entre em contato com a Coordenação da CPA.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Enviar (Confirmação) */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <Send className="w-4 h-4 text-[#006837]" />
                <span>Etapa 5 — Confirmação e Disparo</span>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Resumo Geral da Campanha
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Campanha
                    </span>
                    <strong className="text-slate-900 font-bold text-sm block leading-snug">
                      {title}
                    </strong>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Campus Alvo
                    </span>
                    <strong className="text-slate-900 font-bold text-sm block">
                      {campus}
                    </strong>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Segmentos Convocados
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {segments.discentes && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-bold">
                          Discentes
                        </span>
                      )}
                      {segments.docentes && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                          Docentes
                        </span>
                      )}
                      {segments.taes && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                          TAEs
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Quantidade de Destinatários
                    </span>
                    <strong className="text-[#006837] font-extrabold text-sm block">
                      {totalRecipients.toLocaleString('pt-BR')} destinatários
                    </strong>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Período de Realização
                    </span>
                    <strong className="text-slate-900 font-bold text-xs block">
                      {formatDateBR(startDate)} até {formatDateBR(endDate)}
                    </strong>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">
                      Quantidade de Perguntas
                    </span>
                    <strong className="text-slate-900 font-bold text-xs block">
                      {form.questions.length} perguntas vinculadas
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#006837] hover:bg-[#045C2D] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Convites</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Fixed at bottom) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSaveProgress}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4 text-[#006837]" />
            <span>Salvar progresso</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1 transition-all ${
                step === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-200 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Seguinte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Convites</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Confirmation Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-emerald-100 text-[#006837] rounded-xl shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  Campanha criada com sucesso!
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  Como deseja divulgar esta avaliação?
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition-colors">
                <input
                  type="checkbox"
                  checked={dispatchEmailOption}
                  onChange={(e) => setDispatchEmailOption(e.target.checked)}
                  className="accent-[#006837] w-4 h-4 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold block text-slate-900">☑ Enviar por e-mail institucional</span>
                  <span className="text-[10px] text-slate-500">Disparo automático de convites via SUAP</span>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition-colors">
                <input
                  type="checkbox"
                  checked={generateQrCodeOption}
                  onChange={(e) => setGenerateQrCodeOption(e.target.checked)}
                  className="accent-[#006837] w-4 h-4 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold block text-slate-900">☑ Gerar QR Code da campanha</span>
                  <span className="text-[10px] text-slate-500">Abre o cartaz de divulgação em alta resolução para impressão</span>
                </div>
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirmar & Divulgar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
