import type * as componentLibrary from "./componentLibrary.xpui.ts";

export let UI: typeof componentLibrary.UI;

import("./componentLibrary.xpui.ts").then((m) => {
  UI = m.UI;
});
