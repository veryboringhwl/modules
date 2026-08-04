import { byFactorySource, resolveIntoModule } from "../core/webpack.ts";

import type classNames from "npm:classnames";

export let classnames: typeof classNames;

resolveIntoModule(byFactorySource("window.classNames"), (exports) => {
  if (typeof exports === "function") {
    classnames = exports as typeof classNames;
  }
});
