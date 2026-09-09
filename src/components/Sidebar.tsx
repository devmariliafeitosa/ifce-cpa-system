import { LogOut, X } from "lucide-react";

import { IFCELogo } from "./auth/IFCELogo";
import { MENU_GROUPS } from "./navigation/navigationConfig";
import { SidebarMenuGroup } from "./navigation/SidebarMenuGroup";

import type { NavTabId } from "./navigation/navigationTypes";

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onLogout: () => void;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  onLogout,
  onCloseMobile,
}: SidebarProps) {
  return (
    <aside className="w-[260px] h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between select-none shrink-0 shadow-xs">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IFCELogo showSubtitle={false} />
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto px-3 py-4 custom-scrollbar">
        <div className="space-y-6">
          {MENU_GROUPS.map((group) => (
            <SidebarMenuGroup
              key={group.title}
              group={group}
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              onCloseMobile={onCloseMobile}
            />
          ))}
        </div>

        <div className="pt-6 mt-auto border-t border-slate-100">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/80 hover:text-rose-700 transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50">
        <p className="text-xs font-semibold text-slate-700">
          CPA IFCE • Campus Tauá
        </p>

        <p className="text-[10px] text-slate-400 font-normal mt-0.5">
          Versão 1.0 • © Instituto Federal do Ceará
        </p>
      </div>
    </aside>
  );
}
