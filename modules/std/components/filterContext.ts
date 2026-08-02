import type * as filterContext from "./filterContext.xpui.ts";

export let FilterContext: typeof filterContext.FilterContext;

import("./filterContext.xpui.ts").then((m) => {
  FilterContext = m.FilterContext;
});
