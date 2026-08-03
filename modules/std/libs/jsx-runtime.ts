import { byProps, resolveInto } from "../core/webpack.ts";

import type ReactT from "npm:@types/react";
export let ReactJSX: any;
export let jsx: typeof ReactT.createElement;
export let jsxs: typeof ReactT.createElement;
export let Fragment: typeof ReactT.Fragment;

resolveInto<any>(byProps("jsx"), (value) => {
  ReactJSX = value;
  ({ jsx, jsxs, Fragment } = value as any);
});
