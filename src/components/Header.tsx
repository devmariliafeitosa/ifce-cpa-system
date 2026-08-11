import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, Settings, LogOut, ChevronDown, Building2, Bell } from 'lucide-react';
import { NavTabId } from './Sidebar';
import { UserCoordinator } from '../types';

interface HeaderProps {
  activeTab: NavTabId;
  user: UserCoordinator | null;
  onOpenMobileSidebar: () => void;
  onSelectTab: (tab: NavTabId) => void;
  onLogout: () => void;
}

const PAGE_TITLES: Record<NavTabId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Bem-vindo ao Sistema da Comissão Própria de Avaliação.',
  },
  relatorios: {
    title: 'Relatórios Institucionais',
    subtitle: 'Consolidação e exportação dos relatórios da CPA.',
  },
  'google-forms': {
    title: 'Gerenciador Google Forms',
    subtitle: 'Integração oficial com Google Forms e Drive no Campus Tauá.',
  },
  formularios: {
    title: 'Questionários de Avaliação',
    subtitle: 'Gerenciamento de questionários e instrumentos avaliativos.',
  },
  'novo-formulario': {
    title: 'Novo Questionário',
    subtitle: 'Criação de novos questionários de avaliação por ciclo.',
  },
  participantes: {
    title: 'Participantes do Sistema',
    subtitle: 'Gerenciamento e controle de usuários cadastrados (Alunos, Docentes e TAEs).',
  },
  alunos: {
    title: 'Participação dos Alunos',
    subtitle: 'Acompanhamento do engajamento do corpo discente.',
  },
  docentes: {
    title: 'Participação dos Docentes',
    subtitle: 'Painel de resposta e engajamento do corpo docente.',
  },
  taes: {
    title: 'Técnicos Administrativos (TAEs)',
    subtitle: 'Engajamento dos servidores técnico-administrativos.',
  },
  configuracoes: {
    title: 'Configurações do Sistema',
    subtitle: 'Preferências gerais, parâmetros de ciclo e permissões.',
  },
  perfil: {
    title: 'Perfil do Coordenador',
    subtitle: 'Informações da conta e dados institucionais.',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  user,
  onOpenMobileSidebar,
  onSelectTab,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageInfo = PAGE_TITLES[activeTab] || {
    title: 'Painel CPA',
    subtitle: 'Bem-vindo ao Sistema de Avaliação Institucional.',
  };

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || 'Coordenador CPA Tauá';
  const userCampus = user?.campus || 'Campus Tauá';
  const userEmail = user?.email || 'cpa.taua@ifce.edu.br';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-tight">
            {pageInfo.title}
          </h1>
          <p className="text-xs text-slate-500 font-normal hidden sm:block mt-0.5">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & User Dropdown Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Badge */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer hidden sm:flex"
          title="Notificações do Sistema"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#006837] rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pl-2.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group"
          >
            {/* Avatar Circle */}
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] text-[#006837] flex items-center justify-center font-bold text-xs shadow-2xs border border-[#006837]/20">
              {userName.substring(0, 2).toUpperCase()}
            </div>

            {/* Name & Campus info */}
            <div className="text-left hidden md:block pr-1">
              <div className="text-xs font-semibold text-slate-800 group-hover:text-[#006837] transition-colors">
                {userName}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>{userCampus}</span>
              </div>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-slate-600' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-800">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{userEmail}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#006837] bg-[#E8F5EE] px-2 py-0.5 rounded-md">
                  <Building2 className="w-3 h-3" />
                  <span>{userCampus}</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onSelectTab('perfil');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#006837] transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Meu Perfil</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('configuracoes');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#006837] transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Configurações</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sair do Sistema</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
