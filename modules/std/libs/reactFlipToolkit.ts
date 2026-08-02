import type * as reactFlipToolkit from "./reactFlipToolkit.xpui.ts";

export let Flipper: typeof reactFlipToolkit.Flipper;
export let Flipped: typeof reactFlipToolkit.Flipped;

import("./reactFlipToolkit.xpui.ts").then((m) => {
  Flipper = m.Flipper;
  Flipped = m.Flipped;
});
