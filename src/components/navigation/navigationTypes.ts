import type { ElementType } from "react";

export type NavTabId =
  | "dashboard"
  | "formularios"
  | "relatorios"
  | "google-forms"
  | "novo-formulario"
  | "participantes"
  | "alunos"
  | "docentes"
  | "taes"
  | "configuracoes"
  | "perfil";

export interface MenuItem {
  id: NavTabId;
  label: string;
  icon: ElementType;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}
