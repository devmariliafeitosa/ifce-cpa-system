import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getAccessToken, googleSignIn } from '../../../lib/googleAuth.ts';
import type { GoogleFormFile } from '../../../services/googleFormsService';
import { createGoogleForm, listGoogleForms } from '../../../services/googleFormsService';
import type {
  Campaign,
  QuestionCategory,
  SmartForm,
  SmartQuestion,
  StudentLevel,
  TargetAudience,
} from '../../../types';
import { CampaignQRCodeModal } from "../../CampaignQRCodeModal";
import { useFormWizard } from '../../../hooks/useFormWizard';
import { useFormsData } from '../../../hooks/useFormsData';

import { QuestionClassificationView } from './components/QuestionClassificationView';
import { FormsListPanel } from './components/FormsListPanel';
import type { DriveFormMock } from './data/mockDriveForms';
import { QUESTION_CATEGORIES } from './data/questionCategories';
import { getCampaignStatus } from './utils/campaignStatus';
import { CreateFormWizardModal } from './modals/CreateFormWizardModal';
import { SendCampaignWizardModal } from './modals/SendCampaignWizardModal';
import { ParticipantResponseModal } from './modals/ParticipantResponseModal';
import { AudienceMetricsModal } from './modals/AudienceMetricsModal';
import { DeleteFormConfirmModal } from './modals/DeleteFormConfirmModal';
import { ImportDriveFormModal } from './modals/ImportDriveFormModal';
import { FormQuestionsPreviewModal } from './modals/FormQuestionsPreviewModal';
import { EmailPreviewModal } from './modals/EmailPreviewModal';
import { EmailEditModal } from './modals/EmailEditModal';
import { QrCodePreviewModal } from './modals/QrCodePreviewModal';
import { LaunchCampaignConfirmModal } from './modals/LaunchCampaignConfirmModal';



interface FormsManagerViewProps {
  onSelectTab?: (tab: string) => void;
}

export const FormsManagerView: React.FC<FormsManagerViewProps> = ({
  onSelectTab,
}) => {
  const {
    wizardStep,
    setWizardStep,
    wizardQuestions: formQuestions,
    setWizardQuestions: setFormQuestions,
    wizardTitle: formTitle,
    setWizardTitle: setFormTitle,
    wizardDescription: formDescription,
    setWizardDescription: setFormDescription,
    expandedQuestionIds,
    setExpandedQuestionIds,
    toggleQuestionExpanded,
    handleMoveWizardQuestion,
    handleUpdateWizardQuestionField,
    handleRemoveWizardQuestion,
    handleAddGeneralQuestion,
  } = useFormWizard();

  const {
    forms,
    setForms,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    audienceFilter,
    setAudienceFilter,
    campusFilter,
    setCampusFilter,
    periodFilter,
    setPeriodFilter,
    availablePeriods,
    filteredForms,
  } = useFormsData();

  // Notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  // Carregamento inicial, isLoading, forms/setForms, filtros de busca (searchTerm,
  // statusFilter, audienceFilter, campusFilter, periodFilter), availablePeriods e
  // filteredForms agora são responsabilidade do hook useFormsData().

  // Se o período filtrado não existir mais, volta para 'todos'
  useEffect(() => {
    if (periodFilter !== 'todos' && !availablePeriods.some((p) => p.value === periodFilter)) {
      setPeriodFilter('todos');
    }
  }, [availablePeriods, periodFilter]);

  // Import Google Form Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSearchTerm, setImportSearchTerm] = useState('');
  const [isFetchingDriveForms, setIsFetchingDriveForms] = useState(false);
  const [, setGoogleDriveFiles] = useState<GoogleFormFile[]>([]);

  // Classificação das Perguntas Screen State
  const [classifyingForm, setClassifyingForm] = useState<SmartForm | null>(null);

  // Filters for Classification Screen
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [classCategoryFilter, setClassCategoryFilter] = useState<string>('todas');
  const [classAudienceFilter, setClassAudienceFilter] = useState<string>('todos');
  const [classRequiredFilter, setClassRequiredFilter] = useState<string>('todas');
  const [classTypeFilter, setClassTypeFilter] = useState<string>('todos');

  // "Visualizar como" Profile Preview Role ('none' | 'alunos' | 'docentes' | 'taes')
  const [previewRole, setPreviewRole] = useState<'none' | 'alunos' | 'docentes' | 'taes'>('none');

  // Fetch real Google Forms if connected
  const handleFetchDriveForms = async () => {
    setIsFetchingDriveForms(true);
    try {
      let token = getAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes?.accessToken || null;
      }
      if (token) {
        const files = await listGoogleForms(token);
        setGoogleDriveFiles(files);
        showNotification('success', `${files.length} formulários encontrados no seu Google Drive.`);
      }
    } catch (err: any) {
      console.warn('Google Drive integration notice:', err);
      showNotification('info', 'Exibindo formulários disponíveis no repositório Google Forms.');
    } finally {
      setIsFetchingDriveForms(false);
    }
  };

  // Import Selected Form Handler
  const handleImportForm = (mockItem: DriveFormMock) => {
    const newForm: SmartForm = {
      id: `form-imp-${Date.now()}`,
      title: `${mockItem.name} (Importado)`,
      description: mockItem.description,
      campus: 'Campus Tauá',
      status: 'Rascunho',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      periodo: '15/08/2026 - 30/12/2026',
      lastSync: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      googleFormId: mockItem.id,
      questions: mockItem.questions.map((q, idx) => ({
        ...q,
        id: `q-imp-${Date.now()}-${idx}`,
        category: q.category || 'Outros',
        audiences: q.audiences || ['todos'],
      })),
      responsesCount: { total: 0, alunos: 0, docentes: 0, taes: 0 },
    };

    setForms([newForm, ...forms]);
    setIsImportModalOpen(false);

    // Transition directly to Classification Screen!
    setClassifyingForm(newForm);
    setPreviewRole('none');
    showNotification(
      'success',
      `Formulário "${newForm.title}" importado com sucesso! Classifique as categorias e públicos das perguntas abaixo.`
    );
  };

  // Classification Screen Handlers
  const handleToggleAudienceInClassifying = (questionId: string, target: TargetAudience) => {
    if (!classifyingForm) return;

    const updatedQuestions = classifyingForm.questions.map((q) => {
      if (q.id !== questionId) return q;

      let newAudiences = [...q.audiences];

      if (target === 'todos') {
        if (newAudiences.includes('todos')) {
          newAudiences = ['alunos'];
        } else {
          newAudiences = ['todos'];
        }
      } else {
        if (newAudiences.includes('todos')) {
          newAudiences = newAudiences.filter((a) => a !== 'todos');
        }

        if (newAudiences.includes(target)) {
          newAudiences = newAudiences.filter((a) => a !== target);
          if (newAudiences.length === 0) newAudiences = ['todos'];
        } else {
          newAudiences.push(target);
        }
      }

      return { ...q, audiences: newAudiences };
    });

    setClassifyingForm({
      ...classifyingForm,
      questions: updatedQuestions,
    });
  };

  const handleUpdateCategoryInClassifying = (questionId: string, category: QuestionCategory) => {
    if (!classifyingForm) return;

    const updatedQuestions = classifyingForm.questions.map((q) => {
      if (q.id !== questionId) return q;
      return { ...q, category };
    });

    setClassifyingForm({
      ...classifyingForm,
      questions: updatedQuestions,
    });
  };

  const handleSaveClassification = () => {
    if (!classifyingForm) return;

    setForms((prevForms) =>
      prevForms.map((f) => (f.id === classifyingForm.id ? classifyingForm : f))
    );

    showNotification(
      'success',
      `Classificação das perguntas para "${classifyingForm.title}" salva com sucesso!`
    );
    setClassifyingForm(null);
    setPreviewRole('none');
  };

  // Question filtering logic for Classification screen
  const getFilteredQuestionsForClassification = (): SmartQuestion[] => {
    if (!classifyingForm) return [];

    return classifyingForm.questions.filter((q) => {
      // 1. Text search
      if (classSearchTerm.trim()) {
        const term = classSearchTerm.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(term);
        const matchesDesc = (q.description || '').toLowerCase().includes(term);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Category filter
      if (classCategoryFilter !== 'todas' && q.category !== classCategoryFilter) {
        return false;
      }

      // 3. Audience filter
      if (classAudienceFilter === 'todos_only') {
        if (!q.audiences.includes('todos')) return false;
      } else if (classAudienceFilter === 'alunos') {
        if (!q.audiences.includes('alunos')) return false;
      } else if (classAudienceFilter === 'docentes') {
        if (!q.audiences.includes('docentes')) return false;
      } else if (classAudienceFilter === 'taes') {
        if (!q.audiences.includes('taes')) return false;
      }

      // 4. Required filter
      if (classRequiredFilter === 'required' && !q.required) return false;
      if (classRequiredFilter === 'optional' && q.required) return false;

      // 5. Type filter
      if (classTypeFilter !== 'todos' && q.type !== classTypeFilter) return false;

      return true;
    });
  };

  // Wizard State (Steps 1 to 5) — wizardStep agora vem de useFormWizard()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<SmartForm | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<'alunos' | 'docentes' | 'taes'>('alunos');
  const [completedSegments, setCompletedSegments] = useState<string[]>([]);

  // Form Builder Inputs — formTitle/formDescription agora vêm de useFormWizard()
  const [formCampus, setFormCampus] = useState('IFCE Campus Tauá');
  const [formPeriodo, setFormPeriodo] = useState('2026.2');
  const [, setFormCategory] = useState<string>('Autoavaliação Institucional');
  const [formStartDate, setFormStartDate] = useState('2026-09-15');
  const [formStartTime, setFormStartTime] = useState('08:00');
  const [formEndDate, setFormEndDate] = useState('2026-09-30');
  const [formEndTime, setFormEndTime] = useState('23:59');
  const [, setFormDurationPreset] = useState<number | 'custom'>(15);
  const [, setFormAnonymous] = useState(true);
  const [formAudiences, setFormAudiences] = useState<TargetAudience[]>(['alunos', 'docentes', 'taes']);
  const [, setFormEixos] = useState<string[]>([
    'Eixo 1: Planejamento e Avaliação',
    'Eixo 3: Políticas Acadêmicas',
    'Eixo 5: Infraestrutura Física',
  ]);
  // formQuestions/setFormQuestions e expandedQuestionIds/setExpandedQuestionIds
  // agora vêm de useFormWizard() (aliased de wizardQuestions)

  // Step 6: Envio da Campanha state
  const [wizardCampaignName, setWizardCampaignName] = useState('');
  const [wizardCampaignCampus, setWizardCampaignCampus] = useState('IFCE Campus Tauá');
  const [wizardCampaignStartDate, setWizardCampaignStartDate] = useState('2026-09-15');
  const [wizardCampaignEndDate, setWizardCampaignEndDate] = useState('2026-09-30');
  const [wizardCampaignEstimatedTime, setWizardCampaignEstimatedTime] = useState('4 min');
  const [sendMethods, setSendMethods] = useState({
    email: true,
    qrcode: true,
    link: false,
  });
  const [emailSubject, setEmailSubject] = useState('[CPA IFCE] Convite para a Avaliação Institucional 2026.2');
  const [emailBody, setEmailBody] = useState(
    'Prezado(a) participante,\n\nA Comissão Própria de Avaliação (CPA) do IFCE convida você a responder à Avaliação Institucional 2026.2 do Campus Tauá.\n\nSua opinião é fundamental para orientar as melhorias no ensino, na infraestrutura e na gestão da nossa instituição.\n\nPrazo de preenchimento: até 30/09/2026.\n\nAcesse o link abaixo para responder:'
  );
  const [emailSignature, setEmailSignature] = useState(
    'Comissão Própria de Avaliação - CPA\nInstituto Federal do Ceará - Campus Tauá\nProcesso de Autoavaliação Institucional SINAES'
  );
  const [wizardCopiedLink, setWizardCopiedLink] = useState(false);
  const [showSendConfirmModal, setShowSendConfirmModal] = useState(false);
  const [isCampaignSentSuccess, setIsCampaignSentSuccess] = useState(false);
  const [isPreviewQuestionsModalOpen, setIsPreviewQuestionsModalOpen] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [showEmailEditModal, setShowEmailEditModal] = useState(false);
  const [showQrCodePreviewModal, setShowQrCodePreviewModal] = useState(false);

  // Open Create Wizard
  const handleOpenCreateModal = () => {
    setEditingForm(null);
    setWizardStep(1);
    setFormTitle('');
    setFormDescription('');
    setFormCampus('IFCE Campus Tauá');
    setFormPeriodo('2026.2');
    setFormCategory('Autoavaliação Institucional');
    setFormStartDate('2026-09-15');
    setFormStartTime('08:00');
    setFormEndDate('2026-09-30');
    setFormEndTime('23:59');
    setFormDurationPreset(15);
    setFormAnonymous(true);
    setFormAudiences(['alunos', 'docentes', 'taes']);
    setSelectedSegment('alunos');
    setCompletedSegments([]);
    setFormEixos([
      'Eixo 1: Planejamento e Avaliação',
      'Eixo 3: Políticas Acadêmicas',
      'Eixo 5: Infraestrutura Física',
    ]);
    const initQId = `q-${Date.now()}-1`;
    setFormQuestions([
      {
        id: initQId,
        title: 'Como você avalia o apoio acadêmico e as instalações gerais do campus?',
        description: 'Estas perguntas serão exibidas para todos os participantes da avaliação.',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: ['todos'],
        options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
      },
    ]);
    setExpandedQuestionIds({ [initQId]: true });
    setIsCreateModalOpen(true);
  };

  // Open Edit Wizard
  const handleOpenEditModal = (form: SmartForm, targetStep: number = 1) => {
    setEditingForm(form);
    setWizardStep(targetStep);
    setFormTitle(form.title);
    setFormDescription(form.description);
    setFormCampus(form.campus || 'IFCE Campus Tauá');
    setFormPeriodo(form.periodo || '2026.2');
    setFormStartDate(form.startDate || '2026-09-15');
    setFormStartTime(form.startTime || '08:00');
    setFormEndDate(form.endDate || '2026-09-30');
    setFormEndTime(form.endTime || '23:59');
    setFormDurationPreset('custom');
    setFormQuestions(form.questions || []);
    setExpandedQuestionIds({});
    setSelectedSegment('alunos');
    const existingSegs: string[] = [];
    if (form.questions?.some((q) => q.audiences.includes('alunos') && !q.audiences.includes('todos'))) existingSegs.push('alunos');
    if (form.questions?.some((q) => q.audiences.includes('docentes') && !q.audiences.includes('todos'))) existingSegs.push('docentes');
    if (form.questions?.some((q) => q.audiences.includes('taes') && !q.audiences.includes('todos'))) existingSegs.push('taes');
    setCompletedSegments(existingSegs);
    setIsCreateModalOpen(true);
  };

  // Save Progress as Draft (Botão "Salvar progresso")
  const handleSaveProgressDraft = () => {
    const titleToSave = formTitle.trim() || 'Novo Formulário';
    const questionsToSave: SmartQuestion[] =
      formQuestions.length > 0
        ? formQuestions
        : [
            {
              id: `q-${Date.now()}-1`,
              title: 'Como você avalia a qualidade geral das instalações do campus?',
              type: 'SCALE',
              required: true,
              category: 'Ensino',
              audiences: ['todos'],
              options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
            },
          ];

    const computedStatus = 'Rascunho';

    if (editingForm) {
      const updated: SmartForm = {
        ...editingForm,
        title: titleToSave,
        description: formDescription,
        campus: formCampus,
        periodo: formPeriodo,
        startDate: formStartDate,
        startTime: formStartTime,
        endDate: formEndDate,
        endTime: formEndTime,
        questions: questionsToSave,
        updatedAt: new Date().toLocaleDateString('pt-BR'),
        status: computedStatus,
      };
      setForms(forms.map((f) => (f.id === editingForm.id ? updated : f)));
      showNotification('success', `Progresso salvo! Formulário "${titleToSave}" mantido em Rascunho.`);
    } else {
      const newForm: SmartForm = {
        id: `form-smart-${Date.now()}`,
        title: titleToSave,
        description: formDescription,
        campus: formCampus,
        periodo: formPeriodo,
        startDate: formStartDate,
        startTime: formStartTime,
        endDate: formEndDate,
        endTime: formEndTime,
        status: computedStatus,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        questions: questionsToSave,
        responsesCount: { total: 0, alunos: 0, docentes: 0, taes: 0 },
      };
      setForms([newForm, ...forms]);
      showNotification('success', `Progresso salvo! Novo formulário "${titleToSave}" armazenado em Rascunho.`);
    }

    setIsCreateModalOpen(false);
  };

  // Step 5 -> Step 6 Transition
  const handleAdvanceToCampaignSend = () => {
    const titleToUse = formTitle.trim() || 'Avaliação Institucional CPA';
    setWizardCampaignName(titleToUse);
    setWizardCampaignCampus(formCampus || 'IFCE Campus Tauá');
    setWizardCampaignStartDate(formStartDate || '2026-09-15');
    setWizardCampaignEndDate(formEndDate || '2026-09-30');
    const qCount = formQuestions.length || 1;
    const estMin = Math.max(2, Math.round(qCount * 0.3));
    setWizardCampaignEstimatedTime(`${estMin} min`);
    setWizardStep(6);
  };

  // Step 6 Confirm & Launch Campaign
  const handleConfirmSendCampaign = () => {
    const titleToSave = wizardCampaignName.trim() || formTitle.trim() || 'Avaliação Institucional CPA';
    const questionsToSave: SmartQuestion[] =
      formQuestions.length > 0
        ? formQuestions
        : [
            {
              id: `q-${Date.now()}-1`,
              title: 'Como você avalia as condições de apoio acadêmico e infraestrutura do campus?',
              type: 'SCALE',
              required: true,
              category: 'Ensino',
              audiences: ['todos'],
              options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
            },
          ];

    const formatDateShort = (dStr: string) => {
      if (!dStr) return '';
      const p = dStr.split('-');
      if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
      return dStr;
    };

    const formattedPeriodo = `${formatDateShort(wizardCampaignStartDate)} ${formStartTime} - ${formatDateShort(wizardCampaignEndDate)} ${formEndTime}`;
    const computedStatus = getCampaignStatus(wizardCampaignStartDate, formStartTime, wizardCampaignEndDate, formEndTime, 'Ativo');

    const newFormOrUpdated: SmartForm = {
      id: editingForm ? editingForm.id : `form-smart-${Date.now()}`,
      title: titleToSave,
      description: formDescription,
      campus: wizardCampaignCampus,
      periodo: formattedPeriodo,
      startDate: wizardCampaignStartDate,
      startTime: formStartTime,
      endDate: wizardCampaignEndDate,
      endTime: formEndTime,
      status: computedStatus,
      createdAt: editingForm ? editingForm.createdAt : new Date().toLocaleDateString('pt-BR'),
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      questions: questionsToSave,
      responsesCount: { total: 0, alunos: 0, docentes: 0, taes: 0 },
    };

    let updatedList: SmartForm[] = [];
    if (editingForm) {
      updatedList = forms.map((f) => (f.id === editingForm.id ? newFormOrUpdated : f));
    } else {
      updatedList = [newFormOrUpdated, ...forms];
    }

    setForms(updatedList);
    localStorage.setItem('cpa_smart_forms', JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent('cpa_smart_forms_updated', { detail: updatedList }));

    showNotification('success', `Campanha "${titleToSave}" enviada com sucesso!`);
    setShowSendConfirmModal(false);
    setIsCampaignSentSuccess(true);
  };

  // Question Manipulation Helpers for Steps 2 e 4
  // handleAddGeneralQuestion agora vem de useFormWizard()
  const handleAddSegmentQuestion = (seg: 'alunos' | 'docentes' | 'taes') => {
    const newId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setFormQuestions((prev) => [
      ...prev,
      {
        id: newId,
        title: '',
        type: 'SCALE',
        required: true,
        category: 'Ensino',
        audiences: [seg],
        options: ['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'],
      },
    ]);
    setExpandedQuestionIds({ [newId]: true });

    // Exibe a nova pergunta centralizada na área visível
    setTimeout(() => {
      const el = document.getElementById(`wizard-question-card-${newId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = el.querySelector<HTMLInputElement>('input[type="text"]');
        if (input) {
          input.focus({ preventScroll: true });
        }
      }
    }, 60);
  };

  // handleRemoveWizardQuestion, handleMoveWizardQuestion e
  // handleUpdateWizardQuestionField agora vêm de useFormWizard()

  // Participant Responder Mode ("Visão do Participante")
  const [respondingForm, setRespondingForm] = useState<SmartForm | null>(null);
  const [participantSegment, setParticipantSegment] = useState<'alunos' | 'docentes' | 'taes' | null>(null);
  const [participantStudentLevel, setParticipantStudentLevel] = useState<StudentLevel>('graduacao');
  const [participantAnswers, setParticipantAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const [unansweredQuestionIds, setUnansweredQuestionIds] = useState<string[]>([]);
  const [showValidationErrorBanner, setShowValidationErrorBanner] = useState(false);

  // Metrics & Analytics Viewer
  const [viewingMetricsForm, setViewingMetricsForm] = useState<SmartForm | null>(null);

  // Delete Confirmation State
  const [deletingForm, setDeletingForm] = useState<SmartForm | null>(null);

  // Publishing to Google Forms State
  const [, setPublishingFormId] = useState<string | null>(null);

  // View Mode: 'table' (default requested) or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Campaign Configuration State
  const [campaignModalForm, setCampaignModalForm] = useState<SmartForm | null>(null);
  const [viewingQrCodeCampaign, setViewingQrCodeCampaign] = useState<Campaign | null>(null);
  const [submittedCampaignIds, setSubmittedCampaignIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cpa_submitted_campaign_ids');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cpa_submitted_campaign_ids', JSON.stringify(submittedCampaignIds));
  }, [submittedCampaignIds]);

  const [campaignsList, setCampaignsList] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('cpa_campaigns_list');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'camp-1',
        formId: 'form-smart-1',
        formTitle: 'Avaliação Docente e das Disciplinas - 2026.2',
        title: 'Campanha de Avaliação Institucional 2026.2 - Campus Tauá',
        campus: 'Campus Tauá',
        segment: 'todos',
        startDate: '15/08/2026',
        endDate: '30/12/2026',
        customMessage:
          'Prezado(a) integrante da comunidade acadêmica, a Comissão Própria de Avaliação (CPA) convida você a participar da Avaliação Institucional do IFCE. Sua contribuição é fundamental para o aprimoramento dos serviços, infraestrutura e ensino.',
        createdAt: '15/08/2026',
        status: 'Ativa',
        sentEmailsCount: 2450,
        uniqueTokenUrl: 'https://cpa.ifce.edu.br/avaliacao/form-smart-1?token=suap-taua-883921',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('cpa_campaigns_list', JSON.stringify(campaignsList));
  }, [campaignsList]);

  // Open Campaign Configuration Modal
  const handleOpenCampaignModal = (form: SmartForm) => {
    setCampaignModalForm(form);
    setOpenActionMenuId(null);
  };

  const handleOpenQRCodeForForm = (form: SmartForm) => {
    let campaign = campaignsList.find((c) => c.formId === form.id);
    if (!campaign) {
      campaign = {
        id: `camp-${Date.now()}`,
        formId: form.id,
        formTitle: form.title,
        title: `Campanha de Avaliação - ${form.title}`,
        campus: form.campus || 'Campus Tauá',
        segment: 'todos',
        startDate: new Date().toLocaleDateString('pt-BR'),
        endDate: '30/12/2026',
        customMessage: 'Convite para Avaliação Institucional CPA IFCE',
        createdAt: new Date().toLocaleDateString('pt-BR'),
        status: form.status === 'Ativo' ? 'Ativa' : 'Rascunho',
        sentEmailsCount: 2450,
        uniqueTokenUrl: `https://cpa.ifce.edu.br/avaliacao/${form.id}?token=suap-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        qrCodeAccessCount: 184,
        qrCodeResponsesCount: 142,
      };
    }
    setViewingQrCodeCampaign(campaign);
    setOpenActionMenuId(null);
  };

  // Action Menu Handlers
  const handleDuplicateForm = (form: SmartForm) => {
    const duplicated: SmartForm = {
      ...form,
      id: `form-smart-${Date.now()}`,
      title: `${form.title} (Cópia)`,
      status: 'Rascunho',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      periodo: form.periodo || '15/08/2026 - 30/12/2026',
      lastSync: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      responsesCount: { total: 0, alunos: 0, docentes: 0, taes: 0 },
      googleFormId: undefined,
      googleFormLink: undefined,
    };
    setForms([duplicated, ...forms]);
    showNotification('success', `Formulário "${form.title}" duplicado como rascunho com sucesso!`);
    setOpenActionMenuId(null);
  };

  const handleSendCampaign = (form: SmartForm) => {
    handleOpenCampaignModal(form);
  };

  const handleToggleCampaignStatus = (form: SmartForm) => {
    const newStatus = form.status === 'Ativo' ? 'Encerrado' : 'Ativo';
    setForms(forms.map((f) => (f.id === form.id ? { ...f, status: newStatus } : f)));
    showNotification(
      'info',
      `O status do formulário "${form.title}" foi alterado para "${newStatus}".`
    );
    setOpenActionMenuId(null);
  };

  const handleOpenGoogleFormsLink = (form: SmartForm) => {
    setOpenActionMenuId(null);
    if (form.googleFormLink) {
      window.open(form.googleFormLink, '_blank', 'noopener,noreferrer');
    } else {
      handlePublishToGoogleForms(form);
    }
  };

  // Question option manipulation helpers
  const handleAddQuestionOption = (questionId: string) => {
    setFormQuestions(
      formQuestions.map((q) => {
        if (q.id !== questionId) return q;
        const opts = q.options && q.options.length > 0 ? [...q.options] : ['Opção 1', 'Opção 2'];
        return { ...q, options: [...opts, `Opção ${opts.length + 1}`] };
      })
    );
  };

  const handleUpdateQuestionOption = (questionId: string, optionIdx: number, value: string) => {
    setFormQuestions(
      formQuestions.map((q) => {
        if (q.id !== questionId) return q;
        const opts = [...(q.options || [])];
        opts[optionIdx] = value;
        return { ...q, options: opts };
      })
    );
  };

  const handleRemoveQuestionOption = (questionId: string, optionIdx: number) => {
    setFormQuestions(
      formQuestions.map((q) => {
        if (q.id !== questionId) return q;
        const opts = (q.options || []).filter((_, idx) => idx !== optionIdx);
        return { ...q, options: opts };
      })
    );
  };

  // Participant Mode Actions
  const handleStartResponding = (form: SmartForm) => {
    setRespondingForm(form);
    setParticipantSegment(null);
    setParticipantAnswers({});
    setResponseSubmitted(false);
    setUnansweredQuestionIds([]);
    setShowValidationErrorBanner(false);
  };

  // Filter questions for current participant segment and student level
  const getFilteredQuestionsForParticipant = (): SmartQuestion[] => {
    if (!respondingForm || !participantSegment) return [];
    return respondingForm.questions.filter((q) => {
      if (q.audiences.includes('todos')) return true;
      if (!q.audiences.includes(participantSegment)) return false;

      // Subsegmentation filtering for Discentes
      if (participantSegment === 'alunos') {
        const level = q.studentLevel || 'todos';
        if (level === 'todos') return true;
        return level === participantStudentLevel;
      }

      return true;
    });
  };

  // Handle participant answer changes with live validation updates
  const handleParticipantAnswerChange = (qId: string, val: string | string[]) => {
    setParticipantAnswers((prev) => ({
      ...prev,
      [qId]: val,
    }));

    if (showValidationErrorBanner || unansweredQuestionIds.length > 0) {
      let isFilled = false;
      if (Array.isArray(val)) {
        isFilled = val.length > 0;
      } else {
        isFilled = typeof val === 'string' && val.trim() !== '';
      }

      if (isFilled) {
        setUnansweredQuestionIds((prev) => {
          const remaining = prev.filter((id) => id !== qId);
          if (remaining.length === 0) {
            setShowValidationErrorBanner(false);
          }
          return remaining;
        });
      } else {
        const visibleQuestions = getFilteredQuestionsForParticipant();
        const targetQ = visibleQuestions.find((q) => q.id === qId);
        if (targetQ?.required && !unansweredQuestionIds.includes(qId)) {
          setUnansweredQuestionIds((prev) => [...prev, qId]);
          setShowValidationErrorBanner(true);
        }
      }
    }
  };

  // Submit Participant Answer with Mandatory Validation Rules
  const handleSubmitParticipantResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingForm || !participantSegment) return;

    // 1. Get filtered questions applicable to the active segment and student level
    const visibleQuestions = getFilteredQuestionsForParticipant();

    // 2. Identify required questions that have no answer
    const unanswered = visibleQuestions.filter((q) => {
      if (!q.required) return false;
      const ans = participantAnswers[q.id];
      if (q.type === 'CHECKBOX') {
        return !Array.isArray(ans) || ans.length === 0;
      }
      return ans === undefined || ans === null || (typeof ans === 'string' && ans.trim() === '');
    });

    // 3. Block submission if required questions are unanswered
    if (unanswered.length > 0) {
      const unansweredIds = unanswered.map((q) => q.id);
      setUnansweredQuestionIds(unansweredIds);
      setShowValidationErrorBanner(true);

      // Scroll automatically to the first pending unanswered question
      const firstUnansweredId = unansweredIds[0];
      setTimeout(() => {
        const element = document.getElementById(`participant-question-${firstUnansweredId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const banner = document.getElementById('validation-error-banner');
          if (banner) {
            banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 50);

      showNotification('error', 'Existem perguntas obrigatórias que ainda não foram respondidas.');
      return;
    }

    // 4. All required questions answered -> submit response
    setUnansweredQuestionIds([]);
    setShowValidationErrorBanner(false);

    setIsSubmittingResponse(true);
    setTimeout(() => {
      // Increment response count
      setForms((prevForms) =>
        prevForms.map((f) => {
          if (f.id === respondingForm.id) {
            return {
              ...f,
              responsesCount: {
                ...f.responsesCount,
                total: f.responsesCount.total + 1,
                [participantSegment]: f.responsesCount[participantSegment] + 1,
              },
            };
          }
          return f;
        })
      );

      setSubmittedCampaignIds((prev) => Array.from(new Set([...prev, respondingForm.id])));
      setIsSubmittingResponse(false);
      setResponseSubmitted(true);
      showNotification(
        'success',
        `Resposta enviada com sucesso para o segmento ${
          participantSegment === 'alunos'
            ? 'Aluno'
            : participantSegment === 'docentes'
            ? 'Docente'
            : 'TAE'
        }!`
      );
    }, 600);
  };

  // Sync / Publish Smart Form to Google Forms API
  const handlePublishToGoogleForms = async (form: SmartForm) => {
    setPublishingFormId(form.id);
    try {
      let accessToken = getAccessToken();
      if (!accessToken) {
        const res = await googleSignIn();
        if (res) accessToken = res.accessToken;
      }

      if (!accessToken) {
        showNotification('error', 'Conexão com Google necessária. Faça login na sua conta Google.');
        return;
      }

      // Convert questions for Google Forms API
      const questionsInput = form.questions.map((q) => ({
        title: `${q.title} [Público: ${
          q.audiences.includes('todos')
            ? 'Todos'
            : q.audiences
                .map((a) => (a === 'alunos' ? 'Alunos' : a === 'docentes' ? 'Docentes' : 'TAEs'))
                .join(', ')
        }]`,
        type: q.type,
        required: q.required,
        options: q.options,
      }));

      const created = await createGoogleForm(
        accessToken,
        form.title,
        form.description,
        questionsInput
      );

      // Update form with Google link
      const updatedForm: SmartForm = {
        ...form,
        googleFormId: created.formId,
        googleFormLink: created.responderUri || `https://docs.google.com/forms/d/${created.formId}/viewform`,
      };

      setForms(forms.map((f) => (f.id === form.id ? updatedForm : f)));
      showNotification('success', `Formulário gerado e publicado no Google Forms com sucesso!`);
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Erro ao publicar no Google Forms.');
    } finally {
      setPublishingFormId(null);
    }
  };

  // Delete Form
  const handleDeleteForm = () => {
    if (!deletingForm) return;
    setForms(forms.filter((f) => f.id !== deletingForm.id));
    showNotification('success', `Formulário "${deletingForm.title}" excluído.`);
    setDeletingForm(null);
  };

  // filteredForms agora vem de useFormsData()

  // Render Classificação das Perguntas Screen if active
  if (classifyingForm) {
    return (
      <QuestionClassificationView
        classifyingForm={classifyingForm}
        setClassifyingForm={setClassifyingForm}
        classSearchTerm={classSearchTerm}
        setClassSearchTerm={setClassSearchTerm}
        classCategoryFilter={classCategoryFilter}
        setClassCategoryFilter={setClassCategoryFilter}
        classAudienceFilter={classAudienceFilter}
        setClassAudienceFilter={setClassAudienceFilter}
        classRequiredFilter={classRequiredFilter}
        setClassRequiredFilter={setClassRequiredFilter}
        classTypeFilter={classTypeFilter}
        setClassTypeFilter={setClassTypeFilter}
        previewRole={previewRole}
        setPreviewRole={setPreviewRole}
        getFilteredQuestionsForClassification={getFilteredQuestionsForClassification}
        handleToggleAudienceInClassifying={handleToggleAudienceInClassifying}
        handleUpdateCategoryInClassifying={handleUpdateCategoryInClassifying}
        handleSaveClassification={handleSaveClassification}
      />
    );
  }


  const renderQuestionCard = (q: SmartQuestion, qIdx: number, totalCount: number) => {
    const isExpanded = !!expandedQuestionIds[q.id];

    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'SCALE':
          return 'Escala CPA';
        case 'YES_NO':
          return 'Sim / Não';
        case 'RADIO':
          return 'Múltipla Escolha';
        case 'CHECKBOX':
          return 'Caixa de Seleção';
        default:
          return 'Escala CPA';
      }
    };

    const isStudentQuestion = q.audiences.includes('alunos') || (selectedSegment === 'alunos' && wizardStep === 4);

    if (!isExpanded) {
      // COMPACT MINIMIZED CARD (~50px height)
      return (
        <div
          id={`wizard-question-card-${q.id}`}
          key={q.id}
          className="min-h-[50px] py-2 px-3.5 sm:px-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-[#006837]/50 transition-all"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="px-2 py-0.5 bg-[#006837] text-white text-[11px] font-extrabold rounded-md shrink-0">
              Pergunta {String(qIdx + 1).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {q.title.trim() ? q.title : 'Sem título'}
            </span>
            {q.required && (
              <span className="text-rose-500 font-extrabold text-xs shrink-0" title="Resposta Obrigatória">
                *
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isStudentQuestion && q.studentLevel && q.studentLevel !== 'todos' && (
              <span className="hidden md:inline-flex px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold rounded-md mr-1">
                {q.studentLevel === 'tecnico' && 'Ensino Técnico'}
                {q.studentLevel === 'graduacao' && 'Graduação'}
                {q.studentLevel === 'mestrado' && 'Mestrado'}
                {q.studentLevel === 'pos_graduacao' && 'Pós-graduação'}
              </span>
            )}

            <span className="hidden sm:inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase mr-1">
              {getTypeLabel(q.type)}
            </span>

            <button
              type="button"
              onClick={() => handleMoveWizardQuestion(q.id, 'up')}
              disabled={qIdx === 0}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
              title="Mover para cima"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleMoveWizardQuestion(q.id, 'down')}
              disabled={qIdx === totalCount - 1}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
              title="Mover para baixo"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleRemoveWizardQuestion(q.id)}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer mr-1"
              title="Excluir pergunta"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Expand Button */}
            <button
              type="button"
              onClick={() => toggleQuestionExpanded(q.id)}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#006837] border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              title="Expandir pergunta"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span className="text-[11px]">Expandir</span>
            </button>
          </div>
        </div>
      );
    }

    // EXPANDED QUESTION CARD
    return (
      <div
        id={`wizard-question-card-${q.id}`}
        key={q.id}
        className="p-4 sm:p-5 rounded-2xl border-2 border-[#006837]/30 bg-white shadow-xs space-y-3.5 transition-all"
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#006837] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {qIdx + 1}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#006837] text-[10px] font-bold uppercase">
              Pergunta {String(qIdx + 1).padStart(2, '0')}
            </span>
            {isStudentQuestion && q.studentLevel && q.studentLevel !== 'todos' && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 text-[10px] font-extrabold">
                {q.studentLevel === 'tecnico' && 'Ensino Técnico'}
                {q.studentLevel === 'graduacao' && 'Graduação'}
                {q.studentLevel === 'mestrado' && 'Mestrado'}
                {q.studentLevel === 'pos_graduacao' && 'Pós-graduação'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleMoveWizardQuestion(q.id, 'up')}
              disabled={qIdx === 0}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
              title="Mover para cima"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleMoveWizardQuestion(q.id, 'down')}
              disabled={qIdx === totalCount - 1}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
              title="Mover para baixo"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleRemoveWizardQuestion(q.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer mr-1"
              title="Excluir pergunta"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Minimize Button */}
            <button
              type="button"
              onClick={() => toggleQuestionExpanded(q.id)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              title="Minimizar pergunta"
            >
              <ChevronUp className="w-3.5 h-3.5 text-[#006837]" />
              <span className="text-[11px]">Minimizar</span>
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Enunciado da Pergunta</label>
          <input
            type="text"
            value={q.title}
            onChange={(e) => handleUpdateWizardQuestionField(q.id, 'title', e.target.value as any)}
            placeholder="Ex: Como você avalia a infraestrutura física dos laboratórios do campus?"
            className="w-full h-10 px-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
          />
        </div>

        <div className={`grid grid-cols-1 ${isStudentQuestion ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Tipo de Pergunta</label>
            <select
              value={q.type}
              onChange={(e) => handleUpdateWizardQuestionField(q.id, 'type', e.target.value as any)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#006837]"
            >
              <option value="SCALE">Escala CPA (Ótimo, Regular, Ruim...)</option>
              <option value="YES_NO">Sim / Não</option>
              <option value="RADIO">Múltipla Escolha (Única opção)</option>
              <option value="CHECKBOX">Caixa de Seleção (Múltiplas opções)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">Categoria</label>
            <select
              value={q.category || 'Ensino'}
              onChange={(e) => handleUpdateWizardQuestionField(q.id, 'category', e.target.value as any)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#006837]"
            >
              {QUESTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {isStudentQuestion && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-indigo-900 flex items-center justify-between">
                <span>Aplicar para</span>
              </label>
              <select
                value={q.studentLevel || 'todos'}
                onChange={(e) => handleUpdateWizardQuestionField(q.id, 'studentLevel', e.target.value as any)}
                className="w-full h-9 px-2.5 bg-indigo-50/70 border border-indigo-200/90 rounded-xl text-xs font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
              >
                <option value="todos">Todos os Discentes</option>
                <option value="tecnico">Ensino Técnico</option>
                <option value="graduacao">Graduação</option>
                <option value="mestrado">Mestrado</option>
                <option value="pos_graduacao">Pós-graduação</option>
              </select>
            </div>
          )}

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={q.required ?? true}
                onChange={(e) => handleUpdateWizardQuestionField(q.id, 'required', e.target.checked as any)}
                className="accent-[#006837] w-4 h-4 cursor-pointer"
              />
              <span>Resposta Obrigatória</span>
            </label>
          </div>
        </div>

        {q.type === 'SCALE' && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Alternativas Padrão da Escala CPA:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Ótimo', 'Regular', 'Ruim', 'Não possuo conhecimento'].map((opt) => (
                <span
                  key={opt}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold shadow-2xs"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        )}

        {q.type === 'YES_NO' && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Opções de Resposta:
            </span>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-[#006837] text-xs font-bold">Sim</span>
              <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold">Não</span>
            </div>
          </div>
        )}

        {['RADIO', 'CHECKBOX'].includes(q.type) && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Opções da Pergunta:
            </span>
            <div className="space-y-1.5">
              {(q.options || ['Opção 1', 'Opção 2']).map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleUpdateQuestionOption(q.id, oIdx, e.target.value)}
                    className="flex-1 h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestionOption(q.id, oIdx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddQuestionOption(q.id)}
                className="text-xs font-bold text-[#006837] hover:underline pt-1 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar mais uma opção</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <FormsListPanel
        forms={forms}
        filteredForms={filteredForms}
        notification={notification}
        setNotification={setNotification}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        audienceFilter={audienceFilter}
        setAudienceFilter={setAudienceFilter}
        campusFilter={campusFilter}
        setCampusFilter={setCampusFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        availablePeriods={availablePeriods}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openActionMenuId={openActionMenuId}
        setOpenActionMenuId={setOpenActionMenuId}
        handleOpenCreateModal={handleOpenCreateModal}
        handleOpenEditModal={handleOpenEditModal}
        handleDuplicateForm={handleDuplicateForm}
        handleSendCampaign={handleSendCampaign}
        handleToggleCampaignStatus={handleToggleCampaignStatus}
        handleOpenGoogleFormsLink={handleOpenGoogleFormsLink}
        handleOpenQRCodeForForm={handleOpenQRCodeForForm}
        handleStartResponding={handleStartResponding}
        setDeletingForm={setDeletingForm}
        setViewingMetricsForm={setViewingMetricsForm}
        setIsImportModalOpen={setIsImportModalOpen}
      />

      <CreateFormWizardModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        isCampaignSentSuccess={isCampaignSentSuccess}
        setIsCampaignSentSuccess={setIsCampaignSentSuccess}
        editingForm={editingForm}
        wizardStep={wizardStep}
        setWizardStep={setWizardStep}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formCampus={formCampus}
        setFormCampus={setFormCampus}
        formPeriodo={formPeriodo}
        formStartTime={formStartTime}
        setFormStartTime={setFormStartTime}
        formEndTime={formEndTime}
        setFormEndTime={setFormEndTime}
        formAudiences={formAudiences}
        formQuestions={formQuestions}
        selectedSegment={selectedSegment}
        setSelectedSegment={setSelectedSegment}
        completedSegments={completedSegments}
        setCompletedSegments={setCompletedSegments}
        wizardCampaignName={wizardCampaignName}
        wizardCampaignCampus={wizardCampaignCampus}
        wizardCampaignStartDate={wizardCampaignStartDate}
        setWizardCampaignStartDate={setWizardCampaignStartDate}
        wizardCampaignEndDate={wizardCampaignEndDate}
        setWizardCampaignEndDate={setWizardCampaignEndDate}
        wizardCampaignEstimatedTime={wizardCampaignEstimatedTime}
        setWizardCampaignEstimatedTime={setWizardCampaignEstimatedTime}
        sendMethods={sendMethods}
        setSendMethods={setSendMethods}
        emailSubject={emailSubject}
        wizardCopiedLink={wizardCopiedLink}
        setWizardCopiedLink={setWizardCopiedLink}
        handleAddGeneralQuestion={handleAddGeneralQuestion}
        handleAddSegmentQuestion={handleAddSegmentQuestion}
        handleAdvanceToCampaignSend={handleAdvanceToCampaignSend}
        handleSaveProgressDraft={handleSaveProgressDraft}
        renderQuestionCard={renderQuestionCard}
        setIsPreviewQuestionsModalOpen={setIsPreviewQuestionsModalOpen}
        setShowEmailPreviewModal={setShowEmailPreviewModal}
        setShowEmailEditModal={setShowEmailEditModal}
        setShowQrCodePreviewModal={setShowQrCodePreviewModal}
        setShowSendConfirmModal={setShowSendConfirmModal}
        onSelectTab={onSelectTab}
      />

      <ParticipantResponseModal
        respondingForm={respondingForm}
        setRespondingForm={setRespondingForm}
        participantSegment={participantSegment}
        setParticipantSegment={setParticipantSegment}
        participantStudentLevel={participantStudentLevel}
        setParticipantStudentLevel={setParticipantStudentLevel}
        participantAnswers={participantAnswers}
        isSubmittingResponse={isSubmittingResponse}
        responseSubmitted={responseSubmitted}
        unansweredQuestionIds={unansweredQuestionIds}
        setUnansweredQuestionIds={setUnansweredQuestionIds}
        showValidationErrorBanner={showValidationErrorBanner}
        setShowValidationErrorBanner={setShowValidationErrorBanner}
        getFilteredQuestionsForParticipant={getFilteredQuestionsForParticipant}
        handleParticipantAnswerChange={handleParticipantAnswerChange}
        handleSubmitParticipantResponse={handleSubmitParticipantResponse}
      />

      <AudienceMetricsModal
        viewingMetricsForm={viewingMetricsForm}
        setViewingMetricsForm={setViewingMetricsForm}
      />

      <DeleteFormConfirmModal
        deletingForm={deletingForm}
        setDeletingForm={setDeletingForm}
        handleDeleteForm={handleDeleteForm}
      />

      <ImportDriveFormModal
        isImportModalOpen={isImportModalOpen}
        setIsImportModalOpen={setIsImportModalOpen}
        importSearchTerm={importSearchTerm}
        setImportSearchTerm={setImportSearchTerm}
        isFetchingDriveForms={isFetchingDriveForms}
        handleFetchDriveForms={handleFetchDriveForms}
        handleImportForm={handleImportForm}
      />

      {/* MODAL 6: Criar e Configurar Campanha de Avaliação (Envio - Wizard de 5 Etapas) */}
      {campaignModalForm && (
        <SendCampaignWizardModal
          form={campaignModalForm}
          onClose={() => setCampaignModalForm(null)}
          onLaunchCampaign={(newCampaign, options) => {
            setCampaignsList((prev) => [newCampaign, ...prev]);
            setForms((prevForms) =>
              prevForms.map((f) => (f.id === newCampaign.formId ? { ...f, status: 'Ativo' } : f))
            );
            setCampaignModalForm(null);

            if (options?.sendEmail !== false) {
              showNotification(
                'success',
                `Campanha "${newCampaign.title}" configurada com sucesso! Convocação disparada para o e-mail institucional (${newCampaign.sentEmailsCount} participantes).`
              );
            } else {
              showNotification(
                'success',
                `Campanha "${newCampaign.title}" criada e ativada com sucesso!`
              );
            }

            if (options?.openQrCode) {
              setViewingQrCodeCampaign(newCampaign);
            }
          }}
          onSaveProgressDraft={(draftCampaign) => {
            setCampaignsList((prev) => [draftCampaign, ...prev]);
            showNotification(
              'info',
              `Rascunho da campanha "${draftCampaign.title}" salvo com sucesso!`
            );
          }}
          showNotification={showNotification}
        />
      )}

      {/* MODAL 7: QR Code e Material de Divulgação da Campanha */}
      {viewingQrCodeCampaign && (
        <CampaignQRCodeModal
          campaign={viewingQrCodeCampaign}
          onClose={() => setViewingQrCodeCampaign(null)}
          onUpdateCampaign={(updated) => {
            setCampaignsList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            setViewingQrCodeCampaign(updated);
          }}
          showNotification={showNotification}
        />
      )}

      <FormQuestionsPreviewModal
        isPreviewQuestionsModalOpen={isPreviewQuestionsModalOpen}
        setIsPreviewQuestionsModalOpen={setIsPreviewQuestionsModalOpen}
        formQuestions={formQuestions}
      />

      <EmailPreviewModal
        showEmailPreviewModal={showEmailPreviewModal}
        setShowEmailPreviewModal={setShowEmailPreviewModal}
        setShowEmailEditModal={setShowEmailEditModal}
        emailSubject={emailSubject}
        emailBody={emailBody}
        emailSignature={emailSignature}
      />

      <EmailEditModal
        showEmailEditModal={showEmailEditModal}
        setShowEmailEditModal={setShowEmailEditModal}
        setShowEmailPreviewModal={setShowEmailPreviewModal}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        emailBody={emailBody}
        setEmailBody={setEmailBody}
        emailSignature={emailSignature}
        setEmailSignature={setEmailSignature}
        showNotification={showNotification}
      />

      <QrCodePreviewModal
        showQrCodePreviewModal={showQrCodePreviewModal}
        setShowQrCodePreviewModal={setShowQrCodePreviewModal}
        formTitle={formTitle}
        showNotification={showNotification}
      />

      <LaunchCampaignConfirmModal
        showSendConfirmModal={showSendConfirmModal}
        setShowSendConfirmModal={setShowSendConfirmModal}
        handleConfirmSendCampaign={handleConfirmSendCampaign}
      />
    </>
  );
};
