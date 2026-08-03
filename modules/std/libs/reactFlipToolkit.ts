import { resolveInto } from "../core/webpack.ts";

import type { Flipped as FlippedT, Flipper as FlipperT } from "npm:react-flip-toolkit";

export const ReactFlipToolkit = {
  Flipper: undefined as unknown as FlipperT,
  Flipped: undefined as unknown as typeof FlippedT
};

resolveInto<FlipperT>(
  (v) => typeof v === "function" && !!v.prototype?.getSnapshotBeforeUpdate,
  (value) => {
    ReactFlipToolkit.Flipper = value;
  }
);

resolveInto<typeof FlippedT>(
  (v) => (v as any).displayName === "Flipped",
  (value) => {
    ReactFlipToolkit.Flipped = value;
  }
);
