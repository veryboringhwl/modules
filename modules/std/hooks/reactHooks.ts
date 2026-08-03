import { Platform } from "../api/platform.ts";
import { byCode, byProps, resolveInto, sourceOf } from "../core/webpack.ts";

export let DragHandler: Function;

resolveInto<Function>(
  byCode({ matches: ["dataTransfer", "data-dragging"], mode: "all" }),
  (value) => {
    DragHandler = value;
  }
);

export let usePanelAPI: Function;

resolveInto<Function>(byCode({ matches: ["panelSend", "context"], mode: "all" }), (value) => {
  usePanelAPI = value;
});

export let useContextMenuState: Function;

resolveInto<Function>(byCode("useContextMenuState"), (value) => {
  useContextMenuState = value;
});

export let imageAnalysis: Function;

resolveInto<Function>(byCode(/![a-zA-Z_$][\w$]*\.isFallback|\{extractColor/), (value) => {
  imageAnalysis = value;
});

export let fallbackPreset: any;

resolveInto<any>(byProps("colorDark"), (value) => {
  fallbackPreset = value;
});

export let getPlayContext: Function;

resolveInto<Function>(
  byCode({ matches: ["referrerIdentifier", "usePlayContextItem"], mode: "all" }),
  (value) => {
    getPlayContext = value;
  }
);

export let useTrackListColumns: Function;

resolveInto<Function>(byCode("useTrackListColumns"), (value) => {
  useTrackListColumns = value;
});

export let usePanelStateMachine: () => [state: any, actor: any, machine: any];

resolveInto<() => [state: any, actor: any, machine: any]>(
  byCode("usePanelStateMachine"),
  (value) => {
    usePanelStateMachine = value;
  }
);

export let useExtractedColor: Function;

resolveInto<Function>(
  (v) =>
    typeof v === "function" &&
    (sourceOf(v).includes("extracted-color") ||
      (sourceOf(v).includes("colorRaw") && sourceOf(v).includes("useEffect"))),
  (value) => {
    useExtractedColor = value;
  }
);

export const extractColorPreset = async (image: any) => {
  const analysis = await imageAnalysis(Platform.getGraphQLLoader(), image);

  return analysis;
};
