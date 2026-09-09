import type { NavTabId } from "./navigationTypes";
import type { MenuItem } from "./navigationTypes";

interface SidebarMenuItemProps {
  item: MenuItem;
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onCloseMobile?: () => void;
}

export function SidebarMenuItem({
  item,
  activeTab,
  onSelectTab,
  onCloseMobile,
}: SidebarMenuItemProps) {
  const Icon = item.icon;
  const isActive = activeTab === item.id;

  const handleClick = () => {
    onSelectTab(item.id);

    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer group ${
        isActive
          ? "bg-[#E8F5EE] text-[#006837] font-semibold shadow-2xs"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
            isActive
              ? "text-[#006837]"
              : "text-slate-400 group-hover:text-slate-600"
          }`}
        />

        <span>{item.label}</span>
      </div>

      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#006837]" />}
    </button>
  );
}
