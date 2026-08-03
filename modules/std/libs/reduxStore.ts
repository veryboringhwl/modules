import { findModuleComponent } from "../core/lazyComponent.ts";
import { transformer } from "../core/transformer.ts";
import { byCode } from "../core/webpack.ts";

import type { Store } from "npm:@types/redux";

export type ReduxStoreT = Store;

export const Redux = {
  store: undefined as unknown as ReduxStoreT,
  StoreProvider: findModuleComponent(
    byCode({ matches: ["notifyNestedSubs", "serverState"], mode: "all" })
  )
};

transformer<ReduxStoreT>(
  (emit) => (str) => {
    str = str.replace(
      /\.jsx\)\(([a-zA-Z_$][\w$]*),\{store:([a-zA-Z_$][\w$]*),platform:([a-zA-Z_$][\w$]*)\}\)/,
      ".jsx)($1,{store:__ReduxStore=$2,platform:__Platform=$3})"
    );
    Object.defineProperty(globalThis, "__ReduxStore", {
      set: emit
    });

    return str;
  },
  {
    glob: /^\/xpui-snapshot\.js/
  }
).then(($) => {
  Redux.store = $;
});
