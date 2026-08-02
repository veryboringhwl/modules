import type * as mousetrap from "./mousetrap.xpui.ts";

export let Mousetrap: typeof mousetrap.Mousetrap;

import("./mousetrap.xpui.ts").then((m) => {
  Mousetrap = m.Mousetrap;
});
