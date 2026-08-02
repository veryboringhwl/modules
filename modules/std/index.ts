import type { IndexLoadFn, IndexMixinFn } from "/hooks/module.ts";

export const mixin: IndexMixinFn = async (context) => {
  return (await import("./mixin.ts")).default(context);
};

export const load: IndexLoadFn = async (context) => {
  return (await import("./load.ts")).default(context.module);
};
