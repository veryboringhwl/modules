import type * as color from "./color.xpui.ts";

export let Color: typeof color.Color;

import("./color.xpui.ts").then((m) => {
  Color = m.Color;
});
