import { createApi, fromModule, resolve, selectExport, selectFirstExport } from "../core/expose.ts";
import { findModuleComponentByFactory } from "../core/lazyComponent.ts";
import { byCode, byFactorySource, sourceOf } from "../core/webpack.ts";

import type { LazyComponent } from "../core/lazyComponent.ts";
import type { ExportFilter } from "../core/webpack.ts";
import type {
  Route as RouteT,
  Router as RouterT,
  Routes as RoutesT,
  useLocation as useLocationT,
  useMatch as useMatchT,
  useNavigate as useNavigateT,
  useNavigationType as useNavigationTypeT,
  useParams as useParamsT
} from "npm:react-router";

const ROUTES_REGEX =
  /\([a-zA-Z_$][\w$]*\)\{let\{children:[a-zA-Z_$][\w$]*,location:[a-zA-Z_$][\w$]*\}=[a-zA-Z_$][\w$]*/;

const routerModule = byFactorySource(ROUTES_REGEX);

const useMatchFilter: ExportFilter = (value) =>
  typeof value === "function" &&
  sourceOf(value).includes("let{pathname:") &&
  !sourceOf(value).includes(".createElement(");

export type ReactRouterApi = {
  useMatch: typeof useMatchT;
  useLocation: typeof useLocationT;
  useNavigate: typeof useNavigateT;
  useNavigationType: typeof useNavigationTypeT;
  useParams: typeof useParamsT;
  Router: typeof RouterT;
  Routes: typeof RoutesT;
  Route: typeof RouteT;
  InstrumentedNavigate: LazyComponent<any>;
};

export const ReactRouter = createApi<ReactRouterApi>({
  useMatch: resolve(useMatchFilter),
  useLocation: resolve(byCode({ matches: ["location", "useContext"], mode: "all" })),
  useNavigate: resolve(byCode("isDataRoute")),
  useNavigationType: resolve(byCode({ matches: ["navigationType", "useContext"], mode: "all" })),
  useParams: resolve(byCode(new RegExp(String.raw`let\{params:\i\}=`))),
  Router: fromModule(
    routerModule,
    selectExport(byCode({ matches: ["navigationType", "static"], mode: "all" }))
  ),
  Routes: fromModule(routerModule, selectExport(byCode(ROUTES_REGEX))),
  Route: fromModule(
    routerModule,
    selectExport(
      byCode(
        /^function [a-zA-Z_$][\w$]*\([a-zA-Z_$][\w$]*\)\{\(0,[a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*\)\(!1\)\}$/
      )
    )
  ),
  InstrumentedNavigate: findModuleComponentByFactory(
    byFactorySource("interactionId??t.getInteractionId"),
    selectFirstExport
  )
});
