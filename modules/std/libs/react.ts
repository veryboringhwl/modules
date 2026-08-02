import type * as react from "./react.xpui.ts";

export let React: typeof react.React;
export let ReactJSX: typeof react.ReactJSX;
export let jsx: typeof react.jsx;
export let jsxs: typeof react.jsxs;
export let Fragment: typeof react.Fragment;
export let ReactDOM: typeof react.ReactDOM;
export let ReactDOMServer: typeof react.ReactDOMServer;

import("./react.xpui.ts").then((m) => {
  React = m.React;
  ReactJSX = m.ReactJSX;
  jsx = m.jsx;
  jsxs = m.jsxs;
  Fragment = m.Fragment;
  ReactDOM = m.ReactDOM;
  ReactDOMServer = m.ReactDOMServer;
});
