import type * as classNames from "./classNames.xpui.ts";

export let classnames: typeof classNames.classnames;

import("./classNames.xpui.ts").then((m) => {
  classnames = m.classnames;
});
