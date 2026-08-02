import { findBy, fnStr } from "/hooks/util.ts";

import { exportedFunctions, modules, ready } from "../core/webpack.ts";
import { webpackRequire } from "../core/wpunpk.mix.ts";

import type { useLocation as useLocationT, useMatch as useMatchT } from "npm:react-router";

await ready;

const [ReactRouterModuleID] = modules.find(([_, v]) => fnStr(v).includes("React Router"))!;
const ReactRouterModule = Object.values(webpackRequire(ReactRouterModuleID));

export const useMatch: typeof useMatchT = ReactRouterModule.find(
  (f) => fnStr(f).includes("let{pathname:") && !fnStr(f).includes(".createElement(")
);

export const useLocation: typeof useLocationT = findBy("location", "useContext")(exportedFunctions);
