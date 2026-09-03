import { SidebarMenuItem } from "./SidebarMenuItem";

import type { MenuGroup, NavTabId } from "./navigationTypes";

interface SidebarMenuGroupProps {
  group: MenuGroup;
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onCloseMobile?: () => void;
}

export function SidebarMenuGroup({
  group,
  activeTab,
  onSelectTab,
  onCloseMobile,
}: SidebarMenuGroupProps) {
  return (
    <div className="space-y-1">
      <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
        {group.title}
      </div>

      {group.items.map((item) => (
        <SidebarMenuItem
          key={item.id}
          item={item}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onCloseMobile={onCloseMobile}
        />
      ))}
    </div>
  );
}
