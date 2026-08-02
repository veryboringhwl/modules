import { exports, ready } from "../core/webpack.ts";

import type ReactT from "npm:@types/react";
import type ReactDOMT from "npm:@types/react-dom";
import type ReactDOMServerT from "npm:@types/react-dom/server";

await ready;

export const React: typeof ReactT = exports.find((m) => m.createElement)!;
export const ReactJSX: any = exports.find((m) => m.jsx)!;
if (!ReactJSX) {
  throw new Error("Failed to find the React JSX runtime in the xpui bundle");
}
export const { jsx, jsxs, Fragment } = ReactJSX;
export const ReactDOM: typeof ReactDOMT = exports.find((m) => m.createRoot)!;
export const ReactDOMServer: typeof ReactDOMServerT = exports.find((m) => m.renderToString)!;
