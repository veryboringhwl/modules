import { findModuleComponent, findModuleComponentByFactory } from "../core/lazyComponent.ts";
import { byCode, byFactorySource, resolveInto, sourceOf } from "../core/webpack.ts";

import type { useLocation as useLocationT, useMatch as useMatchT } from "npm:react-router";

export const ReactRouter = {
  useMatch: undefined as unknown as typeof useMatchT,
  useLocation: undefined as unknown as typeof useLocationT,
  Router: findModuleComponent(byCode({ matches: ["navigationType", "static"], mode: "all" })),
  Routes: findModuleComponent(
    byCode(
      /\([a-zA-Z_$][\w$]*\)\{let\{children:[a-zA-Z_$][\w$]*,location:[a-zA-Z_$][\w$]*\}=[a-zA-Z_$][\w$]*/
    )
  ),
  Route: findModuleComponent(
    byCode(
      /^function [a-zA-Z_$][\w$]*\([a-zA-Z_$][\w$]*\)\{\(0,[a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*\)\(!1\)\}$/
    )
  ),
  InstrumentedNavigate: findModuleComponentByFactory(
    byFactorySource("interactionId??t.getInteractionId"),
    (exports) => Object.values(exports)[0]
  )
};

resolveInto<typeof useMatchT>(
  (v) =>
    typeof v === "function" &&
    sourceOf(v).includes("let{pathname:") &&
    !sourceOf(v).includes(".createElement("),
  (value) => {
    ReactRouter.useMatch = value;
  }
);

resolveInto<typeof useLocationT>(
  byCode({ matches: ["location", "useContext"], mode: "all" }),
  (value) => {
    ReactRouter.useLocation = value;
  }
);
