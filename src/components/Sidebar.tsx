import React from 'react';
import {
  Home,
  FileText,
  ClipboardList,
  PlusCircle,
  Users,
  Settings,
  User,
  LogOut,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { IFCELogo } from './IFCELogo';

export type NavTabId =
  | 'dashboard'
  | 'formularios'
  | 'relatorios'
  | 'google-forms'
  | 'novo-formulario'
  | 'participantes'
  | 'alunos'
  | 'docentes'
  | 'taes'
  | 'configuracoes'
  | 'perfil';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onLogout: () => void;
  onCloseMobile?: () => void;
}

interface MenuItem {
  id: NavTabId;
  label: string;
  icon: React.ElementType;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'GERENCIAMENTO',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'formularios', label: 'Formulários', icon: ClipboardList },
      { id: 'relatorios', label: 'Relatórios', icon: FileText },
      { id: 'google-forms', label: 'Google Forms', icon: FileSpreadsheet },
      { id: 'participantes', label: 'Participantes', icon: Users },
    ],
  },
  {
    title: 'SISTEMA',
    items: [
      { id: 'configuracoes', label: 'Configurações', icon: Settings },
      { id: 'perfil', label: 'Perfil', icon: User },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onCloseMobile,
}) => {
  return (
    <aside className="w-[260px] h-screen sticky top-0 bg-white border-r border-slate-200/80 flex flex-col justify-between select-none shrink-0 shadow-xs">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IFCELogo showSubtitle={false} />
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu Groups */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3 py-4 custom-scrollbar">
        {/* Menu Groups */}
        <div className="space-y-6">
          {MENU_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {/* Group Header */}
              <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                {group.title}
              </div>

              {/* Group Items */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? 'bg-[#E8F5EE] text-[#006837] font-semibold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
                          isActive ? 'text-[#006837]' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Centered Logout Action at the very bottom */}
        <div className="pt-6 mt-auto border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/80 hover:text-rose-700 transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50">
        <p className="text-xs font-semibold text-slate-700">CPA IFCE • Campus Tauá</p>
        <p className="text-[10px] text-slate-400 font-normal mt-0.5">
          Versão 1.0 • © Instituto Federal do Ceará
        </p>
      </div>
    </aside>
  );
};
