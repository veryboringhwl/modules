import { findBy } from "/hooks/util.ts";

import { Platform } from "../api/platform.ts";
import { exported, exportedFunctions, ready } from "../core/webpack.ts";

await ready;

export const DragHandler: Function = findBy("dataTransfer", "data-dragging")(exportedFunctions);

export const usePanelAPI: Function = findBy("panelSend", "context")(exportedFunctions);

export const useContextMenuState: Function = findBy("useContextMenuState")(exportedFunctions);

export const imageAnalysis: Function = findBy(/![a-zA-Z_$][\w$]*\.isFallback|\{extractColor/)(
  exportedFunctions
);

export const fallbackPreset: any = exported.find((m) => m.colorDark);

export const getPlayContext: Function = findBy(
  "referrerIdentifier",
  "usePlayContextItem"
)(exportedFunctions);

export const useTrackListColumns: Function = findBy("useTrackListColumns")(exportedFunctions);

export const usePanelStateMachine: () => [state: any, actor: any, machine: any] =
  findBy("usePanelStateMachine")(exportedFunctions);

export const extractColorPreset = async (image: any) => {
  const analysis = await imageAnalysis(Platform.getGraphQLLoader(), image);

  return analysis;
};
