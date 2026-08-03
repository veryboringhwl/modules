import { resolveInto } from "../core/webpack.ts";

export let FilterContext: any;

resolveInto<any>(
  (v) => v !== null && typeof v === "object" && (v as any)._currentValue2?.setFilter,
  (value) => {
    FilterContext = value;
  }
);
