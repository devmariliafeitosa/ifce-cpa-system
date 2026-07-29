import React from 'react';
import {
  FileText,
  ClipboardList,
  PlusCircle,
  GraduationCap,
  UserCheck,
  Briefcase,
  Users,
  Settings,
  User,
  ArrowLeft,
  Construction,
} from 'lucide-react';
import { NavTabId } from './Sidebar';

interface PlaceholderViewProps {
  tabId: NavTabId;
  onReturnToDashboard: () => void;
}

const PAGE_CONFIG: Record<
  NavTabId,
  { title: string; subtitle: string; icon: React.ElementType }
> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Painel Geral da CPA',
    icon: Construction,
  },
  participantes: {
    title: 'Participantes do Sistema',
    subtitle: 'Gerenciamento de usuários cadastrados no IFCE Campus Tauá',
    icon: Users,
  },
  relatorios: {
    title: 'Relatórios Institucionais',
    subtitle: 'Consolidação e exportação de relatórios da avaliação',
    icon: FileText,
  },
  'google-forms': {
    title: 'Google Forms',
    subtitle: 'Integração oficial com Google Forms e Drive no Campus Tauá',
    icon: ClipboardList,
  },
  formularios: {
    title: 'Formulários de Avaliação',
    subtitle: 'Gerenciamento de questionários e instrumentos avaliativos',
    icon: ClipboardList,
  },
  'novo-formulario': {
    title: 'Novo Formulário',
    subtitle: 'Criação e edição de instrumentos de coleta por campus',
    icon: PlusCircle,
  },
  alunos: {
    title: 'Módulo de Alunos',
    subtitle: 'Indicadores e engajamento do corpo discente do IFCE',
    icon: GraduationCap,
  },
  docentes: {
    title: 'Módulo de Docentes',
    subtitle: 'Indicadores e respostas do corpo docente do IFCE',
    icon: UserCheck,
  },
  taes: {
    title: 'Módulo de TAEs',
    subtitle: 'Indicadores e engajamento dos servidores técnico-administrativos',
    icon: Briefcase,
  },
  configuracoes: {
    title: 'Configurações do Sistema',
    subtitle: 'Parâmetros de ciclo, notificações e acessos',
    icon: Settings,
  },
  perfil: {
    title: 'Perfil do Coordenador',
    subtitle: 'Dados institucionais e preferências do usuário',
    icon: User,
  },
};

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  tabId,
  onReturnToDashboard,
}) => {
  const config = PAGE_CONFIG[tabId] || {
    title: 'Página em Desenvolvimento',
    subtitle: 'Funcionalidade em fase de construção',
    icon: Construction,
  };

  const Icon = config.icon;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex items-center justify-center my-auto">
      <div className="bg-white w-full rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Large Styled Icon Circle */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#E8F5EE] text-[#006837] border border-[#006837]/20 flex items-center justify-center shadow-inner">
          <Icon className="w-10 h-10" />
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-[11px] font-bold text-[#006837] uppercase tracking-wider bg-[#E8F5EE] px-3 py-1 rounded-full">
            Módulo em Construção
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {config.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto text-xs text-slate-600 font-medium leading-relaxed">
          Esta funcionalidade está em desenvolvimento e será disponibilizada em breve.
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onReturnToDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006837] hover:bg-[#045C2D] text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg focus:outline-hidden focus:ring-4 focus:ring-[#006837]/30 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
