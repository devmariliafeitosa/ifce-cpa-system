import {
  AlertCircle,
  ArrowRight,
  BarChart2,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  FilterX,
  GraduationCap,
  Grid,
  Hourglass,
  Layers,
  ListFilter,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Send,
  Table,
  Trash2,
  Users,
} from 'lucide-react';
import React from 'react';
import type { SmartForm } from '../../../../types';
import {
  formatCompactPeriod,
  getCampaignStatus,
  getCompactStatusBadge,
  getCountdownBadgeInfo,
} from '../../FormsManager/utils/campaignStatus';
import { FormRowActionButton } from './FormRowActionButton';
import { ReportsSelect } from '../../../reports/ReportsSelect';

type NotificationType = 'success' | 'error' | 'info';
type StatusFilterType = 'todos' | 'Ativo' | 'Rascunho' | 'Encerrado';

const getNotificationClass = (type: NotificationType): string => {
  if (type === 'success') return 'bg-emerald-50 border border-emerald-200 text-emerald-800';
  if (type === 'error') return 'bg-rose-50 border border-rose-200 text-rose-800';
  return 'bg-blue-50 border border-blue-200 text-blue-800';
};

interface FormsListPanelProps {
  forms: SmartForm[];
  filteredForms: SmartForm[];
  notification: { type: NotificationType; message: string } | null;
  setNotification: (value: { type: NotificationType; message: string } | null) => void;

  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: StatusFilterType;
  setStatusFilter: (value: StatusFilterType) => void;
  audienceFilter: 'todos' | 'alunos' | 'docentes' | 'taes';
  setAudienceFilter: (value: 'todos' | 'alunos' | 'docentes' | 'taes') => void;
  campusFilter: string;
  setCampusFilter: (value: string) => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  availablePeriods: { value: string; label: string }[];

  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  openActionMenuId: string | null;
  setOpenActionMenuId: (id: string | null) => void;

  handleOpenCreateModal: () => void;
  handleOpenEditModal: (form: SmartForm, targetStep?: number) => void;
  handleDuplicateForm: (form: SmartForm) => void;
  handleSendCampaign: (form: SmartForm) => void;
  handleToggleCampaignStatus: (form: SmartForm) => void;
  handleOpenGoogleFormsLink: (form: SmartForm) => void;
  handleOpenQRCodeForForm?: (form: SmartForm) => void;
  handleStartResponding: (form: SmartForm) => void;
  setDeletingForm: (form: SmartForm) => void;
  setViewingMetricsForm: (form: SmartForm) => void;
  setIsImportModalOpen: (open: boolean) => void;
}

export const FormsListPanel: React.FC<FormsListPanelProps> = ({
  forms,
  filteredForms,
  notification,
  setNotification,
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
  viewMode,
  setViewMode,
  openActionMenuId,
  setOpenActionMenuId,
  handleOpenCreateModal,
  handleOpenEditModal,
  handleDuplicateForm,
  handleSendCampaign,
  handleToggleCampaignStatus,
  handleOpenGoogleFormsLink,
  handleOpenQRCodeForForm,
  handleStartResponding,
  setDeletingForm,
  setViewingMetricsForm,
  setIsImportModalOpen,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Barra de Ações Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Instrumentos Avaliativos</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006837] text-[10px] font-extrabold border border-emerald-200">
            {forms.length} {forms.length === 1 ? 'formulário' : 'formulários'}
          </span>
        </div>
        
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#006837] border border-emerald-300 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#006837]" />
            <span>Importar Questionário</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Questionário</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-2xs animate-in fade-in ${
            getNotificationClass(notification.type)
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Indicators Bar (Padronizado em 4 cards horizontais compactos) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total de Questionários */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Total Cadastrados
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {forms.length}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Instrumentos no campus
            </p>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        
        {/* Card 2: Questionários Ativos */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Questionários Ativos
            </span>
            <span className="text-2xl font-black text-[#006837] tracking-tight leading-none mt-1 block">
              {forms.filter((f) => f.status === 'Ativo').length}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Em andamento na CPA
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-[#006837] rounded-xl shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Respostas Recebidas */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Respostas Recebidas
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1 block">
              {forms.reduce((acc, f) => acc + (f.responsesCount?.total || 0), 0).toLocaleString('pt-BR')}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Consolidadas no sistema
            </p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Sincronização */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Sincronização
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none mt-1 block truncate max-w-120px sm:max-w-none">
              {forms.find((f) => f.lastSync)?.lastSync || 'Hoje, 11:45'}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Google Forms ativo
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Single Horizontal Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Horizontal Filters Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 w-full xl:w-auto flex-1">
          {/* 1. Pesquisa */}
          <div className="relative min-w-160px">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006837] focus:bg-white"
            />
          </div>

          {/* 2. Campus */}
          <div className="relative">
            <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
            <div className="[&_button]:pl-8">
              <ReportsSelect
                value={campusFilter}
                onChange={(val) => setCampusFilter(val)}
                options={[
                  { value: 'todos', label: 'Todos os Campi' },
                  { value: 'Campus Tauá', label: 'Campus Tauá' },
                  { value: 'Campus Crateús', label: 'Campus Crateús' },
                  { value: 'Campus Canindé', label: 'Campus Canindé' },
                  { value: 'Campus Fortaleza', label: 'Campus Fortaleza' },
                ]}
              />
            </div>
          </div>

          {/* 3. Status */}
          <div className="relative">
            <ListFilter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
            <div className="[&_button]:pl-8">
              <ReportsSelect
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as 'todos' | 'Ativo' | 'Rascunho' | 'Encerrado')}
                options={[
                  { value: 'todos', label: 'Todos os Status' },
                  { value: 'Ativo', label: 'Ativo' },
                  { value: 'Rascunho', label: 'Rascunho' },
                  { value: 'Encerrado', label: 'Encerrado' },
                ]}
              />
            </div>
          </div>

          {/* 4. Segmento */}
          <div className="relative">
            <Users className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
            <div className="[&_button]:pl-8">
              <ReportsSelect
                value={audienceFilter}
                onChange={(val) => setAudienceFilter(val as FormsListPanelProps['audienceFilter'])}
                options={[
                  { value: 'todos', label: 'Todos os Segmentos' },
                  { value: 'alunos', label: 'Alunos' },
                  { value: 'docentes', label: 'Docentes' },
                  { value: 'taes', label: 'TAEs' },
                ]}
              />
            </div>
          </div>

          {/* 5. Período */}
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
            <div className="[&_button]:pl-8">
              <ReportsSelect
                value={periodFilter}
                onChange={(val) => setPeriodFilter(val)}
                options={[
                  { value: 'todos', label: 'Todos os Períodos' },
                  ...availablePeriods.map((p) => ({
                    value: p.value,
                    label: p.label,
                  })),
                ]}
              />
            </div>
          </div>
        </div> {/* Fecha a div: Horizontal Filters Group */}

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tabela</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grade</span>
          </button>
        </div>
      </div> {/* Fecha a div: Single Horizontal Filter Bar */}

      {/* Main Content Area: Table View (Default) or Grid View */}
      {(() => {
        const hasActiveFilters =
          searchTerm.trim() !== '' ||
          statusFilter !== 'todos' ||
          audienceFilter !== 'todos' ||
          campusFilter !== 'todos' ||
          periodFilter !== 'todos';

        const renderContent = () => {
          if (filteredForms.length === 0) {
            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs my-2 animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/80 shadow-2xs">
                  <FilterX className="w-8 h-8 text-slate-400" />
                </div>
                <div className="max-w-md space-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-800">Nenhum formulário encontrado</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Não existem formulários cadastrados que correspondam aos filtros selecionados (Campus,
                    Status, Público-Alvo, Período ou Busca).
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('todos');
                      setAudienceFilter('todos');
                      setCampusFilter('todos');
                      setPeriodFilter('todos');
                    }}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006837] text-xs font-bold rounded-xl transition-all cursor-pointer border border-emerald-200/80 shadow-2xs active:scale-98"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#006837]" />
                    <span>Limpar Filtros</span>
                  </button>
                )}
              </div>
            );
          }

          if (viewMode === 'table') {
            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-visible">
                <div className="overflow-visible">
                  <table className="w-full text-left text-xs border-collapse table-fixed">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3 w-35% min-w-40">Título</th>
                        <th className="py-2.5 px-3 w-18% min-w-25">Campus</th>
                        <th className="py-2.5 px-3 w-10% min-w-21.25 text-center">Status</th>
                        <th className="py-2.5 px-3 w-12% min-w-25">Período</th>
                        <th className="py-2.5 px-3 w-10% min-w-16.25 text-center">Respostas</th>
                        <th className="py-2.5 px-3 w-[15%] min-w-22.5 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredForms.map((form) => {
                        const compactPeriod = formatCompactPeriod(
                          form.startDate,
                          form.startTime,
                          form.endDate,
                          form.endTime,
                          form.periodo
                        );
                        const compactBadge = getCompactStatusBadge(
                          form.startDate,
                          form.startTime,
                          form.endDate,
                          form.endTime,
                          form.status
                        );

                        return (
                          <tr key={form.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 w-[35%] min-w-40">
                              <div className="space-y-0.5">
                                <p
                                  className="font-bold text-slate-900 hover:text-[#006837] transition-colors leading-snug line-clamp-2"
                                  title={form.title}
                                >
                                  {form.title}
                                </p>
                                <p
                                  className="text-[11px] text-slate-500 line-clamp-1 font-normal"
                                  title={form.description}
                                >
                                  {form.description}
                                </p>
                                <div className="flex items-center gap-1 pt-0.5">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                    {form.questions.length} perguntas
                                  </span>
                                  {form.googleFormLink && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                                      <FileSpreadsheet className="w-3 h-3 text-[#006837]" /> Google Forms OK
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td
                              className="py-2.5 px-3 w-[18%] min-w-25 font-semibold text-slate-600 truncate"
                              title={form.campus}
                            >
                              {form.campus}
                            </td>

                            <td className="py-2.5 px-3 w-[10%] min-w-21.25 text-center whitespace-nowrap">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${compactBadge.badgeClass}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${compactBadge.dotColor} shrink-0`} />
                                <span>{compactBadge.label}</span>
                              </span>
                            </td>

                            <td className="py-2.5 px-3 w-[12%] min-w-25 text-slate-600 align-middle">
                              <div
                                
                                role="button"
                                tabIndex={0}
                                onClick={() => handleOpenEditModal(form, 5)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    handleOpenEditModal(form, 5);
                                  }
                                }}
                                className="relative group/period cursor-pointer space-y-0.5 py-1 px-1.5 -mx-1.5 rounded-lg hover:bg-emerald-50/80 transition-all border border-transparent hover:border-emerald-200/80 outline-none focus-visible:ring-2 focus-visible:ring-[#006837]/30"
                                title="Clique para editar as datas e período deste formulário"
                              >
                                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 leading-tight">
                                  <Calendar className="w-3.5 h-3.5 text-[#006837] shrink-0 group-hover/period:scale-110 transition-transform" />
                                  {compactPeriod.stackedDates ? (
                                    <div className="flex flex-col text-[10px] font-bold leading-none space-y-0.5">
                                      <span>{compactPeriod.date1}</span>
                                      <span className="text-[9px] text-slate-400 font-extrabold text-center">↓</span>
                                      <span>{compactPeriod.date2}</span>
                                    </div>
                                  ) : (
                                    <span className="truncate font-bold text-slate-900 tracking-tight group-hover/period:text-[#006837] transition-colors">
                                      {compactPeriod.displayDates}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${compactBadge.badgeClass}`}
                                  >
                                    <span className={`w-1 h-1 rounded-full ${compactBadge.dotColor} shrink-0`} />
                                    <span>{compactBadge.label}</span>
                                  </span>
                                  <span className="text-[9px] text-[#006837] font-semibold opacity-0 group-hover/period:opacity-100 transition-opacity flex items-center gap-0.5">
                                    <Edit3 className="w-2.5 h-2.5" /> Editar
                                  </span>
                                </div>

                                <div
                                  
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(form, 5);
                                  }}
                                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/period:flex flex-col w-72 p-3.5 bg-white text-slate-800 text-xs rounded-xl shadow-xl border border-slate-200/90 z-50 transition-all duration-150 animate-in fade-in zoom-in-95 cursor-pointer"
                                >
                                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[12px]">
                                      <Calendar className="w-4 h-4 text-[#006837]" />
                                      <span>Período da Campanha</span>
                                    </div>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${compactBadge.badgeClass}`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${compactBadge.dotColor} shrink-0`} />
                                      <span>{compactBadge.label}</span>
                                    </span>
                                  </div>

                                  {compactPeriod.hasDates ? (
                                    <div className="space-y-2 text-[11px]">
                                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          <span>Início</span>
                                        </div>
                                        <span className="font-semibold text-slate-900 font-mono">
                                          {compactPeriod.tooltipStart}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                          <span>Encerramento</span>
                                        </div>
                                        <span className="font-semibold text-slate-900 font-mono">
                                          {compactPeriod.tooltipEnd}
                                        </span>
                                      </div>

                                      {compactPeriod.durationText && (
                                        <div className="flex items-center justify-between px-2 py-1 text-slate-600">
                                          <div className="flex items-center gap-1.5 font-medium">
                                            <Hourglass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                            <span>Duração</span>
                                          </div>
                                          <span className="font-bold text-slate-800">
                                            {compactPeriod.durationText}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-900 text-[11px]">
                                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                      <span className="font-medium">Período ainda não configurado.</span>
                                    </div>
                                  )}

                                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between bg-emerald-50/50 p-2 rounded-lg border hover:bg-emerald-100/60 transition-colors">
                                    <span className="text-[11px] font-semibold text-[#006837] flex items-center gap-1.5">
                                      <Edit3 className="w-3.5 h-3.5 text-[#006837]" />
                                      Ajustar datas / período
                                    </span>
                                    <span className="text-[10px] font-bold text-white bg-[#006837] px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs">
                                      Editar <ArrowRight className="w-2.5 h-2.5" />
                                    </span>
                                  </div>

                                  <div className="w-2.5 h-2.5 bg-white rotate-45 absolute -bottom-1.25 left-1/2 -translate-x-1/2 border-r border-b border-slate-200/90" />
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 w-[10%] min-w-16.25 text-center whitespace-nowrap">
                              <div className="relative group/responses cursor-help inline-block">
                                <span className="font-black text-slate-900 text-xs px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 inline-block hover:bg-emerald-50 hover:border-emerald-200 hover:text-[#006837] transition-colors">
                                  {form.responsesCount.total.toLocaleString('pt-BR')}
                                </span>

                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/responses:flex flex-col w-72 p-3.5 bg-white text-slate-800 text-xs rounded-xl shadow-xl border border-slate-200/90 z-50 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 text-left">
                                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2.5">
                                    <BarChart3 className="w-4 h-4 text-[#006837]" />
                                    <span className="font-bold text-slate-900 text-[12px]">Respostas Recebidas</span>
                                  </div>

                                  <div className="space-y-2 text-[11px]">
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between font-semibold text-slate-700">
                                        <span className="flex items-center gap-1.5">
                                          <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                          Discentes
                                        </span>
                                        <span className="font-bold text-slate-900">
                                          {form.responsesCount.alunos.toLocaleString('pt-BR')}
                                        </span>
                                      </div>

                                      {form.responsesCount.alunos > 0 && (
                                        <div className="pl-4 space-y-1 text-[10px] text-slate-500 font-medium border-l-2 border-slate-100 ml-1.5 py-0.5">
                                          <div className="flex justify-between items-center">
                                            <span>• Técnico</span>
                                            <span className="font-mono text-slate-700 font-semibold">
                                              {Math.round(form.responsesCount.alunos * 0.28)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span>• Graduação</span>
                                            <span className="font-mono text-slate-700 font-semibold">
                                              {Math.round(form.responsesCount.alunos * 0.58)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span>• Mestrado</span>
                                            <span className="font-mono text-slate-700 font-semibold">
                                              {Math.round(form.responsesCount.alunos * 0.08)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span>• Pós-graduação</span>
                                            <span className="font-mono text-slate-700 font-semibold">
                                              {Math.max(
                                                0,
                                                form.responsesCount.alunos -
                                                  Math.round(form.responsesCount.alunos * 0.28) -
                                                  Math.round(form.responsesCount.alunos * 0.58) -
                                                  Math.round(form.responsesCount.alunos * 0.08)
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-between font-semibold text-slate-700 pt-0.5">
                                      <span className="flex items-center gap-1.5">
                                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        Docentes
                                      </span>
                                      <span className="font-bold text-slate-900">
                                        {form.responsesCount.docentes.toLocaleString('pt-BR')}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between font-semibold text-slate-700 pt-0.5">
                                      <span className="flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                        TAEs
                                      </span>
                                      <span className="font-bold text-slate-900">
                                        {form.responsesCount.taes.toLocaleString('pt-BR')}
                                      </span>
                                    </div>

                                    <div className="border-t border-slate-100 my-2 pt-1.5">
                                      <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                                        <span className="flex items-center gap-1.5">
                                          <Layers className="w-3.5 h-3.5 text-[#006837]" />
                                          Total
                                        </span>
                                        <span className="text-sm font-black text-[#006837]">
                                          {form.responsesCount.total.toLocaleString('pt-BR')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="w-2.5 h-2.5 bg-white rotate-45 absolute -bottom-1.25 left-1/2 -translate-x-1/2 border-r border-b border-slate-200/90" />
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 w-[15%] min-w-22.5 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStartResponding(form)}
                                  className="p-1.5 text-[#006837] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-emerald-200/80"
                                  title="Visualizar / Responder"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSendCampaign(form)}
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer border border-amber-200/80"
                                  title="Lançar Formulário / Enviar Campanha"
                                >
                                  <Send className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenQRCodeForForm?.(form)}
                                  className="p-1.5 text-[#006837] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer border border-emerald-200/80"
                                  title="Divulgação (Gerar QR Code)"
                                >
                                  <QrCode className="w-4 h-4" />
                                </button>

                                <FormRowActionButton
                                  form={form}
                                  isOpen={openActionMenuId === form.id}
                                  onToggle={() => setOpenActionMenuId(openActionMenuId === form.id ? null : form.id)}
                                  onClose={() => setOpenActionMenuId(null)}
                                  handleStartResponding={handleStartResponding}
                                  handleOpenGoogleFormsLink={handleOpenGoogleFormsLink}
                                  setViewingMetricsForm={setViewingMetricsForm}
                                  handleOpenEditModal={handleOpenEditModal}
                                  handleDuplicateForm={handleDuplicateForm}
                                  handleSendCampaign={handleSendCampaign}
                                  handleOpenQRCodeForForm={handleOpenQRCodeForForm}
                                  handleToggleCampaignStatus={handleToggleCampaignStatus}
                                  setDeletingForm={setDeletingForm}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form) => {
                const questionsForAlunos = form.questions.filter(
                  (q) => q.audiences.includes('todos') || q.audiences.includes('alunos')
                ).length;
                const questionsForDocentes = form.questions.filter(
                  (q) => q.audiences.includes('todos') || q.audiences.includes('docentes')
                ).length;
                const questionsForTaes = form.questions.filter(
                  (q) => q.audiences.includes('todos') || q.audiences.includes('taes')
                ).length;

                const computedStatus = getCampaignStatus(
                  form.startDate,
                  form.startTime,
                  form.endDate,
                  form.endTime,
                  form.status
                );
                const countdown = getCountdownBadgeInfo(
                  form.startDate,
                  form.startTime,
                  form.endDate,
                  form.endTime,
                  form.status
                );

                let statusClassName = 'bg-slate-100 text-slate-600 border-slate-200';
                if (computedStatus === 'Ativa') {
                  statusClassName = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                } else if (computedStatus === 'Agendada') {
                  statusClassName = 'bg-amber-50 text-amber-800 border-amber-200';
                } else if (computedStatus === 'Encerrada') {
                  statusClassName = 'bg-rose-50 text-rose-800 border-rose-200';
                }

                return (
                  <div
                    key={form.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${statusClassName}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                            <span>{computedStatus}</span>
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border ${countdown.badgeClass}`}>
                            {countdown.text}
                          </span>
                        </div>

                        <span className="text-[11px] font-semibold text-slate-400">{form.campus}</span>
                      </div>

                      <h2 className="text-base font-bold text-slate-900 group-hover:text-[#006837] transition-colors leading-snug">
                        {form.title}
                      </h2>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{form.description}</p>
                    </div>

                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                        <span>Perguntas por Público-Alvo:</span>
                        <span className="text-slate-400">{form.questions.length} total</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-1.5 bg-indigo-50/80 rounded-lg border border-indigo-100">
                          <p className="text-[10px] text-indigo-600 font-medium">Alunos</p>
                          <p className="text-xs font-bold text-indigo-900">{questionsForAlunos} q</p>
                        </div>
                        <div className="p-1.5 bg-emerald-50/80 rounded-lg border border-emerald-100">
                          <p className="text-[10px] text-emerald-700 font-medium">Docentes</p>
                          <p className="text-xs font-bold text-emerald-900">{questionsForDocentes} q</p>
                        </div>
                        <div className="p-1.5 bg-amber-50/80 rounded-lg border border-amber-100">
                          <p className="text-[10px] text-amber-700 font-medium">TAEs</p>
                          <p className="text-xs font-bold text-amber-900">{questionsForTaes} q</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Respostas Recebidas:</span>
                        <span className="font-bold text-slate-800">{form.responsesCount.total}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                        <div
                          style={{
                            width: `${
                              form.responsesCount.total > 0
                                ? (form.responsesCount.alunos / form.responsesCount.total) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-indigo-500"
                          title={`Alunos: ${form.responsesCount.alunos}`}
                        />
                        <div
                          style={{
                            width: `${
                              form.responsesCount.total > 0
                                ? (form.responsesCount.docentes / form.responsesCount.total) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-[#006837]"
                          title={`Docentes: ${form.responsesCount.docentes}`}
                        />
                        <div
                          style={{
                            width: `${
                              form.responsesCount.total > 0
                                ? (form.responsesCount.taes / form.responsesCount.total) * 100
                                : 0
                            }%`,
                          }}
                          className="bg-amber-500"
                          title={`TAEs: ${form.responsesCount.taes}`}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartResponding(form)}
                        className="w-full py-2.5 bg-[#006837] hover:bg-ifce-dark text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-98"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Visualizar (Preenchimento)</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(form)}
                          className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenGoogleFormsLink(form)}
                          className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006837] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Forms</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewingMetricsForm(form)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Ver Métricas"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingForm(form)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        };
        return renderContent();
      })()}
    </div>
  );
};
