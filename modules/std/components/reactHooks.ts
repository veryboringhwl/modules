import type * as fullscreen from "./reactHooks.fullscreen.ts";
import type * as xpui from "./reactHooks.xpui.ts";

export let DragHandler: typeof xpui.DragHandler;
export let usePanelAPI: typeof xpui.usePanelAPI;
export let useContextMenuState: typeof xpui.useContextMenuState;
export let imageAnalysis: typeof xpui.imageAnalysis;
export let fallbackPreset: typeof xpui.fallbackPreset;
export let getPlayContext: typeof xpui.getPlayContext;
export let useTrackListColumns: typeof xpui.useTrackListColumns;
export let usePanelStateMachine: typeof xpui.usePanelStateMachine;
export let extractColorPreset: typeof xpui.extractColorPreset;

import("./reactHooks.xpui.ts").then((m) => {
  DragHandler = m.DragHandler;
  usePanelAPI = m.usePanelAPI;
  useContextMenuState = m.useContextMenuState;
  imageAnalysis = m.imageAnalysis;
  fallbackPreset = m.fallbackPreset;
  getPlayContext = m.getPlayContext;
  useTrackListColumns = m.useTrackListColumns;
  usePanelStateMachine = m.usePanelStateMachine;
  extractColorPreset = m.extractColorPreset;
});

export let useExtractedColor: typeof fullscreen.useExtractedColor;

import("./reactHooks.fullscreen.ts").then((m) => {
  useExtractedColor = m.useExtractedColor;
});
