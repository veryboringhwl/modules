import { findBy } from "/hooks/util.ts";

import { exported, exportedFunctions, ready } from "../core/webpack.ts";

await ready;

export const Color: Function & {
  Format: any;
} = Object.assign(findBy("this.rgb")(exportedFunctions)!, {
  Format: exported.find((m) => m.RGBA)!
});
