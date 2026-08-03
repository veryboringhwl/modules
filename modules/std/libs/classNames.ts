import { byFactorySource, resolveIntoModule } from "../core/webpack.ts";

import type classNames from "npm:@types/classnames";

export let classnames: classNames;

resolveIntoModule(byFactorySource("window.classNames"), (exports) => {
  if (typeof exports === "function") {
    classnames = exports as classNames;
  }
});
