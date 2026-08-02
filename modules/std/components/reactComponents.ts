import { fnStr } from "/hooks/util.ts";

import { webpackRequire } from "../core/wpunpk.mix.ts";
import { matchWebpackModule } from "../core/wpunpk.ts";

import type { React } from "../libs/react.ts";
import type * as panel from "./reactComponents.panel.ts";
import type * as providers from "./reactComponents.providers.tsx";
import type * as xpui from "./reactComponents.xpui.ts";

export let Slider: React.FC<any>;
export let Toggle: React.FC<any>;
export let TracklistRow: React.FC<any>;

matchWebpackModule(
  (_id, module) => {
    const moduleStr = fnStr(module);
    return moduleStr.includes('"_nD_jYvjV80Rf8sX"');
  },
  (id, _$) => {
    const module = webpackRequire(id);
    Toggle = Object.values(module)[0];
  }
);

matchWebpackModule(
  (_id, module) => {
    const moduleStr = fnStr(module);
    return moduleStr.includes("progressBarRef");
  },
  (id, _$) => {
    const module = webpackRequire(id);
    Slider = Object.values(module)[0];
  }
);

matchWebpackModule(
  (_id, module) => {
    const moduleStr = fnStr(module);
    return moduleStr.includes('"data-testid":"track-icon"');
  },
  async (id, _$) => {
    await new Promise(setTimeout);
    const module = webpackRequire(id);
    TracklistRow = Object.values(module)[0];
  }
);

export let Menus: typeof xpui.Menus;
export let Nav: typeof xpui.Nav;
export let NavTo: typeof xpui.NavTo;
export let InstrumentedRedirect: typeof xpui.InstrumentedRedirect;
export let ContextMenu: typeof xpui.ContextMenu;
export let RightClickMenu: typeof xpui.RightClickMenu;
export let Tooltip: typeof xpui.Tooltip;
export let Menu: typeof xpui.Menu;
export let MenuItem: typeof xpui.MenuItem;
export let MenuItemSubMenu: typeof xpui.MenuItemSubMenu;
export let Snackbar: typeof xpui.Snackbar;
export let FilterBox: typeof xpui.FilterBox;
export let ScrollableContainer: typeof xpui.ScrollableContainer;
export let ConfirmDialog: typeof xpui.ConfirmDialog;
export let Router: typeof xpui.Router;
export let Routes: typeof xpui.Routes;
export let Route: typeof xpui.Route;
export let GenericModal: typeof xpui.GenericModal;
export let Dialog: typeof xpui.Dialog;
export let Tracklist: typeof xpui.Tracklist;
export let IconWrapper: typeof xpui.IconWrapper;

import("./reactComponents.xpui.ts").then((m) => {
  Menus = m.Menus;
  Cards = m.Cards;
  Nav = m.Nav;
  NavTo = m.NavTo;
  InstrumentedRedirect = m.InstrumentedRedirect;
  ContextMenu = m.ContextMenu;
  RightClickMenu = m.RightClickMenu;
  Tooltip = m.Tooltip;
  Menu = m.Menu;
  MenuItem = m.MenuItem;
  MenuItemSubMenu = m.MenuItemSubMenu;
  Snackbar = m.Snackbar;
  FilterBox = m.FilterBox;
  ScrollableContainer = m.ScrollableContainer;
  ConfirmDialog = m.ConfirmDialog;
  Router = m.Router;
  Routes = m.Routes;
  Route = m.Route;
  GenericModal = m.GenericModal;
  Dialog = m.Dialog;
  Tracklist = m.Tracklist;
  IconWrapper = m.IconWrapper;
});

export let PanelContainer: typeof panel.PanelContainer;
export let PanelContent: typeof panel.PanelContent;
export let PanelHeader: typeof panel.PanelHeader;

import("./reactComponents.panel.ts").then((m) => {
  PanelContainer = m.PanelContainer;
  PanelContent = m.PanelContent;
  PanelHeader = m.PanelHeader;
});

export let RemoteConfigProviderComponent: typeof providers.RemoteConfigProviderComponent;
export let RemoteConfigProvider: typeof providers.RemoteConfigProvider;
export let SnackbarProvider: typeof providers.SnackbarProvider;
export let StoreProvider: typeof providers.StoreProvider;
export let TracklistColumnsContextProvider: typeof providers.TracklistColumnsContextProvider;

import("./reactComponents.providers.tsx").then((m) => {
  RemoteConfigProviderComponent = m.RemoteConfigProviderComponent;
  RemoteConfigProvider = m.RemoteConfigProvider;
  SnackbarProvider = m.SnackbarProvider;
  StoreProvider = m.StoreProvider;
  TracklistColumnsContextProvider = m.TracklistColumnsContextProvider;
});
