import { exportedContexts, ready } from "../core/webpack.ts";

await ready;

export const FilterContext = exportedContexts.find((c) => (c as any)._currentValue2?.setFilter)!;
