import { captureGlobal } from "../core/expose.ts";

import type { PlatformAutoGen } from "/hooks/PlatformAutoGen.d.ts";

export type Platform = PlatformAutoGen;
export let Platform: Platform;

captureGlobal<Platform>("__Platform", /^\/xpui-modules\.js/, (str, name) =>
  str.replace(
    /{(?=[^{}]*(?:{[^{}]*(?:{[^{}]*(?:{[^{}]*}[^{}]*)*}[^{}]*)*}[^{}]*)*(?<=[,{])version:)(?=[^{}]*(?:{[^{}]*(?:{[^{}]*(?:{[^{}]*}[^{}]*)*}[^{}]*)*}[^{}]*)*(?<=[,{])container:)/,
    `${name}={`
  )
).then(($) => {
  Platform = $;
  const registry = ($ as unknown as { getRegistry(): any }).getRegistry();
  for (const s of registry._map.keys()) {
    const getter = `get${s.description}`;
    if (Object.hasOwn(Platform, getter)) {
      continue;
    }
    Object.defineProperty(Platform, getter, {
      get: () => () => registry.resolve(s)
    });
  }
});
