import { byProps, resolveInto } from "../core/webpack.ts";

import type ReactT from "npm:@types/react";

export type ReactJSX = {
  jsx: typeof ReactT.createElement;
  jsxs: typeof ReactT.createElement;
  Fragment: typeof ReactT.Fragment;
};

export let ReactJSX: ReactJSX;
export let jsx: typeof ReactT.createElement;
export let jsxs: typeof ReactT.createElement;
export let Fragment: typeof ReactT.Fragment;

resolveInto<ReactJSX>(byProps("jsx"), (value) => {
  ReactJSX = value;
  ({ jsx, jsxs, Fragment } = value);
});
