import { byProps, resolveInto } from "../core/webpack.ts";

import type ReactT from "npm:@types/react";
import type ReactDOMT from "npm:@types/react-dom";
import type ReactDOMServerT from "npm:@types/react-dom/server";

export let React: typeof ReactT;
export let ReactDOM: typeof ReactDOMT;
export let ReactDOMServer: typeof ReactDOMServerT;

resolveInto<typeof ReactT>(byProps("createElement"), (value) => {
  React = value;
});

resolveInto<typeof ReactDOMT>(byProps("createRoot"), (value) => {
  ReactDOM = value;
});

resolveInto<typeof ReactDOMServerT>(byProps("renderToString"), (value) => {
  ReactDOMServer = value;
});
