import { transformer } from "../../mixin.ts";

import type { PlatformAutoGen } from "/hooks/PlatformAutoGen.d.ts";

export type Platform = PlatformAutoGen;
export let Platform: Platform;

transformer<Platform>(
  (emit) => (str) => {
    str = str.replace(
      /{(?=[^{}]*(?:{[^{}]*(?:{[^{}]*(?:{[^{}]*}[^{}]*)*}[^{}]*)*}[^{}]*)*(?<=[,{])version:)(?=[^{}]*(?:{[^{}]*(?:{[^{}]*(?:{[^{}]*}[^{}]*)*}[^{}]*)*}[^{}]*)*(?<=[,{])container:)/,
      "globalThis.Spicetify.__Platform={"
    );
    emit();
    return str;
  },
  {
    glob: /^\/xpui-modules\.js/
  }
);
