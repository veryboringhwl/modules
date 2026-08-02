import { fnStr } from "/hooks/util.ts";

import { analyzeWebpackRequire, ready } from "../core/webpack.ts";
import { webpackRequire } from "../core/wpunpk.mix.ts";

await (CHUNKS["/dwp-full-screen-mode-container.js"] ??= Promise.withResolvers()).promise;
await ready;

const { exportedFunctions } = analyzeWebpackRequire(webpackRequire);

export const useExtractedColor: Function = exportedFunctions.find(
  (m) =>
    fnStr(m).includes("extracted-color") ||
    (fnStr(m).includes("colorRaw") && fnStr(m).includes("useEffect"))
)!;
