import {SubmenuSidebar} from './submenu-sidebar.model';

export interface MenuSidebar {
  title: string;
  id: string;
  icon_google?: string;
  icon_svg?: string;
  url?: string;
  submenus?: SubmenuSidebar[];
}
