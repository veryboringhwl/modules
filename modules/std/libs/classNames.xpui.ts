import { fnStr } from "/hooks/util.ts";

import { modules, ready } from "../core/webpack.ts";
import { webpackRequire } from "../core/wpunpk.mix.ts";

import type classNames from "npm:@types/classnames";

await ready;

export const classnames: classNames = modules
  .filter(([_, v]) => fnStr(v).includes("[native code]"))
  .map(([i]) => webpackRequire(i))
  .find((e) => typeof e === "function");
