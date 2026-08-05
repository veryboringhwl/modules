import { byProps, resolveInto } from "../core/webpack.ts";

import type ReactDOMServerT from "npm:@types/react-dom@18.3.1";
import type ReactDOMT from "npm:@types/react-dom@18.3.1";
import type ReactT from "npm:@types/react@18.3.1";
// spotify uses v18.3.1 as of 2026-08-05

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
