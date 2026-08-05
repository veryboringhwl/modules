import { createApi, fromModule, selectExport, selectFirstExport } from "../core/expose.ts";
import { findModuleComponentByFactory } from "../core/lazyComponent.ts";
import { byCode, byFactorySource } from "../core/webpack.ts";

import type { LazyComponent } from "../core/lazyComponent.ts";
import type {
  createRoutesFromChildren as createRoutesFromChildrenT,
  Navigate as NavigateT,
  Outlet as OutletT,
  Route as RouteT,
  Router as RouterT,
  Routes as RoutesT,
  useHref as useHrefT,
  useLocation as useLocationT,
  useMatch as useMatchT,
  useNavigate as useNavigateT,
  useNavigationType as useNavigationTypeT,
  useParams as useParamsT,
  useResolvedPath as useResolvedPathT
} from "npm:react-router@6.30.3";
// spotify uses v6.30.3 as of 2026-08-05

const ROUTES_REGEX =
  /\([a-zA-Z_$][\w$]*\)\{let\{children:[a-zA-Z_$][\w$]*,location:[a-zA-Z_$][\w$]*\}=[a-zA-Z_$][\w$]*/;

const routerModule = byFactorySource(ROUTES_REGEX);

export type ReactRouterApi = {
  useHref: typeof useHrefT;
  useLocation: typeof useLocationT;
  useMatch: typeof useMatchT;
  useNavigate: typeof useNavigateT;
  useNavigationType: typeof useNavigationTypeT;
  useParams: typeof useParamsT;
  useResolvedPath: typeof useResolvedPathT;
  Router: typeof RouterT;
  Routes: typeof RoutesT;
  Route: typeof RouteT;
  Navigate: typeof NavigateT;
  Outlet: typeof OutletT;
  createRoutesFromChildren: typeof createRoutesFromChildrenT;
  InstrumentedNavigate: LazyComponent<any>;
};

export const ReactRouter = createApi<ReactRouterApi>({
  useHref: fromModule(routerModule, selectExport(byCode(new RegExp(String.raw`\.createHref\(`)))),
  useLocation: fromModule(
    routerModule,
    selectExport(byCode(new RegExp(String.raw`\i\.useContext\(\i\)\.location`)))
  ),
  useMatch: fromModule(
    routerModule,
    selectExport(byCode(new RegExp(String.raw`let\{pathname:\i\}=\i\(\)`)))
  ),
  useNavigate: fromModule(
    routerModule,
    selectExport(byCode(new RegExp(String.raw`\.UseNavigateStable`)))
  ),
  useNavigationType: fromModule(
    routerModule,
    selectExport(byCode(new RegExp(String.raw`\i\.useContext\(\i\)\.navigationType`)))
  ),
  useParams: fromModule(
    routerModule,
    selectExport(byCode(new RegExp(String.raw`let\{matches:\i\}=\i\.useContext\(`)))
  ),
  useResolvedPath: fromModule(
    routerModule,
    selectExport(
      byCode(new RegExp(String.raw`,\{pathname:\i\}=\i\(\),[\s\S]*?return\s*\i\.useMemo\(`))
    )
  ),
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
  Navigate: fromModule(routerModule, selectExport(byCode(new RegExp(String.raw`\.useEffect\(`)))),
  Outlet: fromModule(
    routerModule,
    selectExport(byCode(new RegExp(String.raw`\i\.useContext\(\i\)\.outlet`)))
  ),
  createRoutesFromChildren: fromModule(
    routerModule,
    selectExport(byCode(new RegExp(String.raw`\.Children\.forEach\(`)))
  ),
  InstrumentedNavigate: findModuleComponentByFactory(
    byFactorySource(new RegExp(String.raw`interactionId\?\?\i\.getInteractionId`)),
    selectFirstExport
  )
});
