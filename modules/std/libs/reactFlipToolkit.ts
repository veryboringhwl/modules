import { createApi, resolve } from "../core/expose.ts";

import type { Flipped as FlippedT, Flipper as FlipperT } from "npm:react-flip-toolkit@7.2.4";
// spotify uses v7.2.4 as of 2026-08-05

export type ReactFlipToolkitApi = {
  Flipper: FlipperT;
  Flipped: typeof FlippedT;
};

export const ReactFlipToolkit = createApi<ReactFlipToolkitApi>({
  Flipper: resolve(
    (value) => typeof value === "function" && !!value.prototype?.getSnapshotBeforeUpdate
  ),
  Flipped: resolve((value) => (value as any).displayName === "Flipped")
});
