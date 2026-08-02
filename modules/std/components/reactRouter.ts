import type * as reactRouter from "./reactRouter.xpui.ts";

export let useMatch: typeof reactRouter.useMatch;
export let useLocation: typeof reactRouter.useLocation;

import("./reactRouter.xpui.ts").then((m) => {
  useMatch = m.useMatch;
  useLocation = m.useLocation;
});
