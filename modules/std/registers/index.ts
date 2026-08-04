import "./menu.tsx";
import "./navlink.tsx";
import "./panel.ts";
import "./playbarButton.tsx";
import "./playbarWidget.tsx";
import "./root.ts";
import "./route.ts";
import "./settingsSection.ts";
import "./topbarLeftButton.tsx";
import "./topbarRightButton.tsx";

export { useMenuItem } from "./menu.tsx";
export { NavLink, type NavLinkProps } from "./navlink.tsx";
export { Machine, type StateMachine } from "./panel.ts";
export { PlaybarButton, type PlaybarButtonProps } from "./playbarButton.tsx";
export { PlaybarWidget, type PlaybarWidgetProps } from "./playbarWidget.tsx";
export { TopbarLeftButton } from "./topbarLeftButton.tsx";
export { TopbarRightButton } from "./topbarRightButton.tsx";

export type RegisterType =
  | "menu"
  | "navlink"
  | "panel"
  | "playbarButton"
  | "playbarWidget"
  | "rootChild"
  | "rootProvider"
  | "route"
  | "settingsSection"
  | "topbarLeftButton"
  | "topbarRightButton";
