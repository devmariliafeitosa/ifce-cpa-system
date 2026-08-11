import React, { useState } from 'react';
import {
  FileCheck,
  Archive,
  Users,
  BarChart2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  Search,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { NavTabId } from './Sidebar';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTabId) => void;
}

// Mock Data for Metric Cards
const METRIC_CARDS = [
  {
    id: 'active-forms',
    title: 'Questionários Ativos',
    value: '6',
    description: 'Em fase de coleta de respostas',
    change: '+2 este mês',
    isPositive: true,
    icon: FileCheck,
    colorClass: 'text-[#006837] bg-[#E8F5EE] border-[#006837]/20',
  },
  {
    id: 'closed-forms',
    title: 'Questionários Encerrados',
    value: '18',
    description: 'Ciclos avaliativos concluídos',
    change: 'Ciclo 2024.2 finalizado',
    isPositive: true,
    icon: Archive,
    colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: 'total-responses',
    title: 'Participações Recebidas',
    value: '12.480',
    description: 'Respostas consolidadas no total',
    change: '+18.4% vs ciclo anterior',
    isPositive: true,
    icon: Users,
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'generated-reports',
    title: 'Relatórios Gerados',
    value: '24',
    description: 'Relatórios setoriais e gerais',
    change: 'Disponíveis para download',
    isPositive: true,
    icon: BarChart2,
    colorClass: 'text-purple-700 bg-purple-50 border-purple-200',
  },
];

// Mock Data for Segment Participation Chart
const SEGMENT_DATA = [
  { segmento: 'Alunos', participacao: 8420, meta: 10000 },
  { segmento: 'Docentes', participacao: 640, meta: 750 },
  { segmento: 'TAEs', participacao: 420, meta: 500 },
];

// Mock Data for Daily Responses Trend Chart
const DAILY_RESPONSES = [
  { data: '15/05', respostas: 310 },
  { data: '16/05', respostas: 480 },
  { data: '17/05', respostas: 620 },
  { data: '18/05', respostas: 890 },
  { data: '19/05', respostas: 740 },
  { data: '20/05', respostas: 1120 },
  { data: '21/05', respostas: 1450 },
  { data: '22/05', respostas: 1380 },
  { data: '23/05', respostas: 1620 },
  { data: '24/05', respostas: 1890 },
  { data: '25/05', respostas: 1980 },
];

// Mock Data for Recent Forms Table
interface FormItem {
  id: string;
  titulo: string;
  campus: string;
  status: 'Ativo' | 'Encerrado' | 'Rascunho';
  dataCriacao: string;
  participacaoPct: number;
  totalRespostas: number;
}

const RECENT_FORMS: FormItem[] = [
  {
    id: 'f-1',
    titulo: 'Avaliação Docente e Didático-Pedagógica 2025.1 - Tauá',
    campus: 'Campus Tauá',
    status: 'Ativo',
    dataCriacao: '15/05/2025',
    participacaoPct: 86,
    totalRespostas: 1420,
  },
  {
    id: 'f-2',
    titulo: 'Avaliação de Infraestrutura e Laboratórios - Tauá',
    campus: 'Campus Tauá',
    status: 'Ativo',
    dataCriacao: '10/05/2025',
    participacaoPct: 78,
    totalRespostas: 980,
  },
  {
    id: 'f-3',
    titulo: 'Satisfação Geral do Discente - Graduação e Técnico',
    campus: 'Campus Tauá',
    status: 'Encerrado',
    dataCriacao: '01/04/2025',
    participacaoPct: 94,
    totalRespostas: 1850,
  },
  {
    id: 'f-4',
    titulo: 'Gestão e Serviços Administrativos - Tauá',
    campus: 'Campus Tauá',
    status: 'Ativo',
    dataCriacao: '20/05/2025',
    participacaoPct: 64,
    totalRespostas: 510,
  },
  {
    id: 'f-5',
    titulo: 'Autoavaliação de Cursos Técnicos e Licenciaturas - Tauá',
    campus: 'Campus Tauá',
    status: 'Rascunho',
    dataCriacao: '25/05/2025',
    participacaoPct: 0,
    totalRespostas: 0,
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativo' | 'Encerrado' | 'Rascunho'>('Todos');

  const filteredForms = RECENT_FORMS.filter((form) => {
    const matchesSearch =
      form.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.campus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Quick Action Top Banner */}
      <div className="bg-gradient-to-r from-[#006837] to-[#045C2D] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight">
            Painel da Comissão Própria de Avaliação (CPA) • Campus Tauá
          </h2>
          <p className="text-xs text-emerald-100 font-normal max-w-2xl leading-relaxed">
            Acompanhe em tempo real os indicadores de participação discente, docente e técnica do Campus Tauá do IFCE.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('google-forms')}
          className="px-4 py-2.5 bg-white text-[#006837] hover:bg-emerald-50 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Google Form</span>
        </button>
      </div>

      {/* Google Forms Integration Highlight Card */}
      <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/60 to-white">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#006837] text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Integração Oficial com Google Forms
              </h3>
              <span className="text-[10px] font-bold text-[#006837] bg-[#E8F5EE] px-2 py-0.5 rounded-full">
                Ativo no Campus Tauá
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Crie questionários de avaliação institucional, distribua links oficiais e analise respostas em tempo real pelo Google Forms API.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('google-forms')}
          className="px-4 py-2 bg-[#006837] hover:bg-[#045C2D] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <span>Acessar Google Forms</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Row 1: Informative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                  {card.value}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  {card.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-[#006837]">
                <TrendingUp className="w-3 h-3 text-[#006837]" />
                <span>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Segment Participation */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Participação por Segmento
              </h3>
              <p className="text-xs text-slate-500">
                Total de respostas recebidas por público
              </p>
            </div>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              Ciclo Atual
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SEGMENT_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="segmento" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} respostas`, 'Participação']}
                />
                <Bar
                  dataKey="participacao"
                  fill="#006837"
                  radius={[8, 8, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            {SEGMENT_DATA.map((item) => (
              <div key={item.segmento} className="p-2 rounded-lg bg-slate-50">
                <p className="text-[10px] text-slate-500">{item.segmento}</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {item.participacao.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Daily Responses Trend */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Evolução das Respostas por Dia
              </h3>
              <p className="text-xs text-slate-500">
                Fluxo diário de envios nos formulários ativos
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#006837] bg-[#E8F5EE] px-2.5 py-1 rounded-lg font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Últimos 10 dias</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={DAILY_RESPONSES}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRespostas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006837" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#006837" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="data" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value} formulários entregues`, 'Respostas']}
                />
                <Area
                  type="monotone"
                  dataKey="respostas"
                  stroke="#006837"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRespostas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Pico diário: <strong className="text-slate-800">1.980 respostas</strong> em 25/05</span>
            <span className="text-[#006837] font-semibold">Média: ~1.140 / dia</span>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Forms Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/40">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Últimos Questionários Criados
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhamento de status e taxa de preenchimento
            </p>
          </div>

          {/* Search & Filter controls */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título ou campus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837]"
              />
            </div>

            {/* Status Select Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837] cursor-pointer"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Ativo">Ativos</option>
                <option value="Encerrado">Encerrados</option>
                <option value="Rascunho">Rascunhos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Título do Questionário</th>
                <th className="px-4 py-3">Campus</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Criação</th>
                <th className="px-4 py-3 min-w-[160px]">Participação</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredForms.length > 0 ? (
                filteredForms.map((form) => (
                  <tr
                    key={form.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[#006837] shrink-0" />
                        <span className="line-clamp-1">{form.titulo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {form.campus}
                    </td>
                    <td className="px-4 py-3.5">
                      {form.status === 'Ativo' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ativo
                        </span>
                      )}
                      {form.status === 'Encerrado' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Encerrado
                        </span>
                      )}
                      {form.status === 'Rascunho' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-normal">
                      {form.dataCriacao}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">
                            {form.participacaoPct}%
                          </span>
                          <span className="text-slate-400">
                            ({form.totalRespostas.toLocaleString()} resp.)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              form.participacaoPct > 80
                                ? 'bg-[#006837]'
                                : form.participacaoPct > 50
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${form.participacaoPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onNavigateTab('relatorios')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#006837] bg-[#E8F5EE] hover:bg-[#006837] hover:text-white transition-all cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                    Nenhum formulário encontrado para o filtro aplicado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Link */}
        <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
          <button
            onClick={() => onNavigateTab('formularios')}
            className="text-xs font-semibold text-[#006837] hover:underline cursor-pointer"
          >
            Ver todos os formulários cadastrados →
          </button>
        </div>
      </div>
    </div>
  );
};
