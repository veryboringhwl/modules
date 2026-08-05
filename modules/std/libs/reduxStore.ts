import { captureGlobal, createApi, resolve } from "../core/expose.ts";
import { findModuleComponent } from "../core/lazyComponent.ts";
import { byCode } from "../core/webpack.ts";

import type React from "npm:@types/react";
import type {
  connect as connectT,
  ProviderProps,
  useSelector as useSelectorT,
  useDispatch as useDispatchT,
  useStore as useStoreT
} from "npm:react-redux@8.1.3";
// spotify uses v8.1.3 as of 2026-08-05
import type {
  applyMiddleware as applyMiddlewareT,
  combineReducers as combineReducersT,
  compose as composeT,
  createStore as createStoreT,
  Store as StoreT
} from "npm:redux@4.2.1";
// spotify uses v4.2.1 as of 2026-08-05

export type ReduxStoreT = StoreT;

export type ReduxApi = {
  store: StoreT;
  Provider: React.FC<ProviderProps>;
  connect: typeof connectT;
  useSelector: typeof useSelectorT;
  useDispatch: typeof useDispatchT;
  useStore: typeof useStoreT;
  combineReducers: typeof combineReducersT;
  applyMiddleware: typeof applyMiddlewareT;
  compose: typeof composeT;
  createStore: typeof createStoreT;
};

export const Redux = createApi<ReduxApi>({
  store: captureGlobal<ReduxStoreT>("__ReduxStore", /^\/xpui-snapshot\.js/, (str, name) =>
    str.replace(
      /\.jsx\)\(([a-zA-Z_$][\w$]*),\{store:([a-zA-Z_$][\w$]*),platform:([a-zA-Z_$][\w$]*)\}\)/,
      `.jsx)($1,{store:${name}=$2,platform:__Platform=$3})`
    )
  ),
  Provider: findModuleComponent(
    byCode({ matches: ["notifyNestedSubs", "serverState"], mode: "all" })
  ),
  connect: resolve(byCode("initMapStateToProps")),
  useSelector: resolve(
    byCode({
      matches: [new RegExp(String.raw`{equalityFn:\i`), "addNestedSub"],
      mode: "all"
    })
  ),
  useDispatch: resolve(byCode(new RegExp(String.raw`return \i\(\)\.dispatch\}`))),
  useStore: resolve(byCode(new RegExp(String.raw`let\{store:\i\}=\i\(\)`))),
  combineReducers: resolve(byCode(new RegExp(String.raw`type:\i\.PROBE_UNKNOWN_ACTION\(\)`))),
  applyMiddleware: resolve(byCode({ matches: ["getState", "void 0,arguments"], mode: "all" })),
  compose: resolve(byCode({ matches: ["0===t.length", "void 0,arguments"], mode: "all" })),
  createStore: resolve(byCode("replaceReducer"))
});
