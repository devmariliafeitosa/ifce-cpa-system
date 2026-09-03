import {
  ClipboardList,
  FileText,
  Home,
  Settings,
  User,
  Users,
} from "lucide-react";

import type { MenuGroup } from "./navigationTypes";

export const MENU_GROUPS: MenuGroup[] = [
  {
    title: "GERENCIAMENTO",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: Home,
      },
      {
        id: "formularios",
        label: "Questionários",
        icon: ClipboardList,
      },
      {
        id: "relatorios",
        label: "Relatórios",
        icon: FileText,
      },
      {
        id: "participantes",
        label: "Participantes",
        icon: Users,
      },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      {
        id: "configuracoes",
        label: "Configurações",
        icon: Settings,
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: User,
      },
    ],
  },
];
