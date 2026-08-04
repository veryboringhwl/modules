import { createApi, resolve } from "../core/expose.ts";

import type { Flipped as FlippedT, Flipper as FlipperT } from "npm:react-flip-toolkit";

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
