import { byFactorySource, resolveIntoModule } from "../core/webpack.ts";

import type classNames from "npm:classnames@2.5.1";
// spotify uses v2.5.1 as of 2026-08-05

export let classnames: typeof classNames;

resolveIntoModule(byFactorySource("window.classNames"), (exports) => {
  if (typeof exports === "function") {
    classnames = exports as typeof classNames;
  }
});
